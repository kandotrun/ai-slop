#!/usr/bin/env node
import { runGigaCli } from "./command.js";

const exitCode = await runGigaCli(process.argv.slice(2), {
  stdout: (line) => process.stdout.write(`${line}\n`),
  stderr: (line) => process.stderr.write(`${line}\n`)
});

process.exitCode = exitCode;
