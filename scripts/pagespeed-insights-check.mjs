#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const API_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const DEFAULT_TARGET_URL = "https://giga-site.com/";
const DEFAULT_STRATEGIES = "mobile";
const DEFAULT_MIN_PERFORMANCE = 70;
const DEFAULT_RETRIES = 2;
const OUTPUT_DIR = process.env.PAGESPEED_OUTPUT_DIR || "pagespeed-results";
const AUDITS = [
  ["first-contentful-paint", "FCP"],
  ["largest-contentful-paint", "LCP"],
  ["total-blocking-time", "TBT"],
  ["cumulative-layout-shift", "CLS"],
  ["speed-index", "Speed Index"]
];

function intEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

function strategiesFromEnv() {
  return (process.env.PAGESPEED_STRATEGIES || DEFAULT_STRATEGIES)
    .split(",")
    .map((strategy) => strategy.trim())
    .filter(Boolean);
}

function buildRequestUrl({ apiKey, targetUrl, strategy }) {
  const url = new URL(API_ENDPOINT);
  url.searchParams.set("url", targetUrl);
  url.searchParams.set("strategy", strategy);
  url.searchParams.append("category", "performance");
  url.searchParams.set("key", apiKey);
  return url;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": "giga-site-pagespeed-ci/1.0" } });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    const message = body?.error?.message || response.statusText || "PageSpeed API request failed";
    const error = new Error(`PageSpeed API ${response.status}: ${message}`);
    error.status = response.status;
    throw error;
  }
  return body;
}

async function runRequest({ apiKey, targetUrl, strategy, retries }) {
  const url = buildRequestUrl({ apiKey, targetUrl, strategy });
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      const status = error && typeof error === "object" && "status" in error ? error.status : 0;
      const retryable = status === 429 || status >= 500;
      if (!retryable || attempt === retries) break;
      await delay(2500 * (attempt + 1));
    }
  }
  throw lastError;
}

function percentScore(score) {
  return typeof score === "number" ? Math.round(score * 100) : null;
}

function auditDisplay(audits, key) {
  const audit = audits?.[key];
  return audit?.displayValue || "n/a";
}

function summarizeResult(strategy, result) {
  const lighthouse = result?.lighthouseResult;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || {};
  return {
    strategy,
    fetchedAt: new Date().toISOString(),
    finalUrl: lighthouse?.finalDisplayedUrl || lighthouse?.finalUrl || "",
    performance: percentScore(categories.performance?.score),
    metrics: Object.fromEntries(AUDITS.map(([key, label]) => [label, auditDisplay(audits, key)])),
    opportunities: Object.values(audits)
      .filter((audit) => audit && audit.details?.type === "opportunity" && typeof audit.numericValue === "number" && audit.numericValue > 0)
      .sort((a, b) => b.numericValue - a.numericValue)
      .slice(0, 5)
      .map((audit) => ({ title: audit.title, displayValue: audit.displayValue || "" }))
  };
}

function markdown(results, targetUrl, minPerformance) {
  const rows = results.map((result) => {
    const metrics = result.metrics;
    return `| ${result.strategy} | ${result.performance ?? "n/a"} | ${metrics.FCP} | ${metrics.LCP} | ${metrics.TBT} | ${metrics.CLS} | ${metrics["Speed Index"]} |`;
  });
  const opportunities = results.flatMap((result) => result.opportunities.map((item) => `- ${result.strategy}: ${item.title}${item.displayValue ? ` (${item.displayValue})` : ""}`));
  return [
    "# PageSpeed Insights",
    "",
    `Target: ${targetUrl}`,
    `Performance threshold: ${minPerformance}`,
    "",
    "| Strategy | Performance | FCP | LCP | TBT | CLS | Speed Index |",
    "| --- | ---: | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "## Top opportunities",
    opportunities.length ? opportunities.join("\n") : "- None reported"
  ].join("\n");
}

function assertThresholds(results, minPerformance) {
  const failures = results.filter((result) => typeof result.performance !== "number" || result.performance < minPerformance);
  if (!failures.length) return;
  const message = failures.map((result) => `${result.strategy}: ${result.performance ?? "n/a"} < ${minPerformance}`).join(", ");
  throw new Error(`PageSpeed performance threshold failed: ${message}`);
}

function dryRunResult(strategy, targetUrl) {
  return {
    strategy,
    fetchedAt: new Date().toISOString(),
    finalUrl: targetUrl,
    performance: 100,
    metrics: {
      FCP: "0.1 s",
      LCP: "0.2 s",
      TBT: "0 ms",
      CLS: "0",
      "Speed Index": "0.2 s"
    },
    opportunities: []
  };
}

async function main() {
  const apiKey = process.env.PAGESPEED_INSIGHTS_API_KEY;
  if (!apiKey && process.env.PAGESPEED_DRY_RUN !== "1") {
    throw new Error("Missing PAGESPEED_INSIGHTS_API_KEY GitHub Actions secret");
  }
  const targetUrl = process.env.PAGESPEED_TARGET_URL || DEFAULT_TARGET_URL;
  const strategies = strategiesFromEnv();
  const minPerformance = intEnv("PAGESPEED_MIN_PERFORMANCE", DEFAULT_MIN_PERFORMANCE);
  const retries = intEnv("PAGESPEED_RETRIES", DEFAULT_RETRIES);
  await mkdir(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const strategy of strategies) {
    const result = process.env.PAGESPEED_DRY_RUN === "1"
      ? dryRunResult(strategy, targetUrl)
      : summarizeResult(strategy, await runRequest({ apiKey, targetUrl, strategy, retries }));
    results.push(result);
    await writeFile(`${OUTPUT_DIR}/${strategy}.json`, `${JSON.stringify(result, null, 2)}\n`);
  }

  const summary = markdown(results, targetUrl, minPerformance);
  await writeFile(`${OUTPUT_DIR}/summary.md`, `${summary}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, { flag: "a" });
  }
  console.log(summary);
  assertThresholds(results, minPerformance);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
