import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

const command = "npx";
const args = ["--yes", "react-doctor@0.5.8", "--json", "--json-compact", "--blocking", "warning", "-y", "."];

function actionValue(value) {
  return String(value ?? "")
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

function actionProperty(value) {
  return actionValue(value).replaceAll(",", "%2C").replaceAll(":", "%3A");
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textField(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function nonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

function positiveInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function safeRawLog(label, value) {
  if (!value) return;
  const token = `react-doctor-${randomUUID()}`;
  console.error(`::stop-commands::${token}`);
  console.error(`${label}:`);
  console.error(String(value));
  console.error(`::${token}::`);
}

function emitAnnotation(kind, value) {
  const diagnostic = isRecord(value) ? value : {};
  const filePath = textField(diagnostic, "filePath");
  const lineNumber = positiveInteger(diagnostic.line);
  const columnNumber = positiveInteger(diagnostic.column);
  const rule = textField(diagnostic, "rule");
  const titleText = textField(diagnostic, "title");
  const title = [rule, titleText].filter(Boolean).join(": ");
  const props = [
    filePath ? `file=${actionProperty(filePath)}` : "",
    lineNumber ? `line=${lineNumber}` : "",
    columnNumber ? `col=${columnNumber}` : "",
    title ? `title=${actionProperty(title)}` : ""
  ].filter(Boolean).join(",");
  const category = textField(diagnostic, "category") || "React Doctor";
  const severity = textField(diagnostic, "severity") || "diagnostic";
  const messageText = textField(diagnostic, "message") || textField(diagnostic, "help") || "diagnostic";
  console.log(`::${kind}${props ? ` ${props}` : ""}::${actionValue(`${category} ${severity}: ${messageText}`)}`);
}

const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: "utf8",
  maxBuffer: 1024 * 1024 * 20
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch (error) {
  console.error("React Doctor JSON output could not be parsed.");
  safeRawLog("stdout", result.stdout);
  safeRawLog("stderr", result.stderr);
  console.error(error);
  process.exit(1);
}

const invalidFields = [];
if (!isRecord(report)) invalidFields.push("report");

const summary = isRecord(report) && isRecord(report.summary) ? report.summary : null;
if (!summary) invalidFields.push("summary");

const diagnostics = isRecord(report) && Array.isArray(report.diagnostics) ? report.diagnostics : [];
if (!(isRecord(report) && Array.isArray(report.diagnostics))) invalidFields.push("diagnostics");

const score = summary && typeof summary.score === "number" && Number.isFinite(summary.score) ? summary.score : null;
const errorCount = summary ? nonNegativeInteger(summary.errorCount) : null;
const warningCount = summary ? nonNegativeInteger(summary.warningCount) : null;
const totalDiagnosticCount = summary ? nonNegativeInteger(summary.totalDiagnosticCount) : null;

if (score === null) invalidFields.push("summary.score");
if (errorCount === null) invalidFields.push("summary.errorCount");
if (warningCount === null) invalidFields.push("summary.warningCount");
if (totalDiagnosticCount === null) invalidFields.push("summary.totalDiagnosticCount");

console.log(`React Doctor score: ${score ?? "unavailable"}/100`);
console.log(
  `React Doctor diagnostics: ${errorCount ?? "invalid"} errors, ${warningCount ?? "invalid"} warnings, ${totalDiagnosticCount ?? "invalid"} total`
);

for (const diagnostic of diagnostics) {
  emitAnnotation("error", diagnostic);
}

if (invalidFields.length > 0) {
  console.log(`::error title=React Doctor gate failed::Invalid React Doctor JSON fields: ${actionValue(invalidFields.join(", "))}`);
}

if (
  invalidFields.length > 0 ||
  score !== 100 ||
  errorCount !== 0 ||
  warningCount !== 0 ||
  totalDiagnosticCount !== 0 ||
  diagnostics.length !== 0 ||
  result.status !== 0
) {
  console.log("::error title=React Doctor gate failed::React Doctor must be exactly 100/100 with zero warnings and zero errors for PR CI.");
  process.exit(1);
}

console.log("React Doctor gate passed: 100/100 with zero warnings and zero errors.");
