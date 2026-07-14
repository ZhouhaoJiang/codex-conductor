#!/usr/bin/env node

process.env.CODEX_RULES_DISABLE_BUNDLED = "1";

await import("../runtime/rules/dist/cli.js");
