#!/usr/bin/env node

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";
import { stdin, stdout } from "node:process";

const HOOK_EVENT_NAME = "SessionStart";

if (process.argv[2] !== "session-start") {
	process.stderr.write("Usage: work-report-hook.mjs session-start\n");
	process.exitCode = 1;
} else {
	const rawInput = await readStdin();
	const output = buildHookOutput(rawInput);
	if (output.length > 0) stdout.write(output);
}

function buildHookOutput(rawInput) {
	const input = parseInput(rawInput);
	if (input === null || input.hook_event_name !== HOOK_EVENT_NAME) return "";

	const sessionId = safeSegment(input.session_id);
	if (sessionId === null || typeof input.cwd !== "string") return "";

	const projectRoot = resolveProjectRoot(input.cwd);
	if (projectRoot === null) return "";

	const reportPath = join(projectRoot, ".ccc", `${sessionId}.md`);
	return formatAdditionalContext(workReportGuidance({ projectRoot, reportPath }));
}

function workReportGuidance({ projectRoot, reportPath }) {
	return `<ccc-work-report-guidance>
Maintain at most one concise work report for this Codex session at:
${reportPath}

This is quiet session guidance, not a per-message requirement and not a completion gate.

- Create or update the report only after a turn produces substantive project work or durable findings, such as implementation, file/config/document changes, testing or fixes, deployment, or an investigation with concrete conclusions.
- Do not update it for greetings, simple questions or explanations, clarification, approvals, planning-only or status-only turns, or any turn without material project output.
- For qualifying work, update the report before the normal final response. Keep one cumulative session report instead of appending a section for every message.
- Keep the report factual and limited to: 做了什么、完成了什么、验证结果（没有运行验证时说明原因）.
- Do not include chain-of-thought, prompts, raw transcripts, secrets, or routine tool logs.
- Treat .ccc as local session metadata. Do not stage or commit it unless the user explicitly asks.
- Do not interrupt, block, or send an extra user-facing message solely for this report.

Project root: ${projectRoot}
</ccc-work-report-guidance>`;
}

function resolveProjectRoot(cwd) {
	let current;
	try {
		current = resolve(cwd);
	} catch {
		return null;
	}
	if (!existsSync(current)) return null;

	while (true) {
		if (existsSync(join(current, ".git"))) return current;
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}

	const fallback = resolve(cwd);
	if (fallback === parse(fallback).root || fallback === resolve(homedir())) return null;
	return fallback;
}

function safeSegment(value) {
	if (typeof value !== "string") return null;
	const cleaned = value
		.trim()
		.replace(/[^A-Za-z0-9._-]/g, "_")
		.replace(/^[._-]+/, "");
	return cleaned.length > 0 ? cleaned : null;
}

function parseInput(rawInput) {
	if (rawInput.trim().length === 0) return null;
	try {
		const parsed = JSON.parse(rawInput);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function formatAdditionalContext(additionalContext) {
	return `${JSON.stringify({
		hookSpecificOutput: {
			hookEventName: HOOK_EVENT_NAME,
			additionalContext,
		},
	})}\n`;
}

function readStdin() {
	return new Promise((resolveInput, reject) => {
		let data = "";
		stdin.setEncoding("utf8");
		stdin.on("data", (chunk) => {
			data += chunk;
		});
		stdin.once("error", reject);
		stdin.once("end", () => resolveInput(data));
		stdin.resume();
	});
}

function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
