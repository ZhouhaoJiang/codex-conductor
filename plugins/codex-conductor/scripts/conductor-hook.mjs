#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { stdin, stdout } from "node:process";

const CONDUCTOR_MARKER = "<codex-conductor-recommendation>";
const MIN_SCORE = 2;

const MAGIC_WORD_PATTERNS = [
	/(?:^|[^A-Za-z0-9_])\/?ccc(?=$|[^A-Za-z0-9_])/i,
];

const SHORTCUT_PATTERNS = [
	/^\s*\/?codex[-_\s]+conductor(?:\s|:|：|$)/i,
	/^\s*\/?codex[-_\s]+con(?:\s|:|：|$)/i,
	/^\s*\/?conductor(?:\s|:|：|$)/i,
];

const STRONG_PATTERNS = [
	/\bworker(?:s)?\b/i,
	/\bfork\b/i,
	/\bdispatch\b/i,
	/\borchestrat(?:e|ion)\b/i,
	/\bparallel\b/i,
	/\bmulti[- ]?(?:session|thread|agent)\b/i,
	/跨\s*(?:session|线程|会话|项目)/i,
	/多\s*(?:session|线程|会话|agent|任务)/i,
	/(?:派发|分发|调度).*(?:任务|worker|agent|线程|session)/i,
	/(?:拆|拆分|分解).*(?:任务|worker|agent|线程|session)/i,
];

const WEAK_PATTERNS = [
	/\bproject\b/i,
	/\bthread(?:s)?\b/i,
	/\bsession(?:s)?\b/i,
	/项目/,
	/线程/,
	/会话/,
	/并行/,
	/切换/,
	/协同/,
	/主\s*(?:session|线程|会话)/i,
];

const SUPPRESS_PATTERNS = [
	/^\s*(?:\/?ccc|\/?codex[-_\s]+conductor|\/?codex[-_\s]+con|\/?conductor)\s+lite(?:\s|:|：|$)/i,
	/不要.*conductor/i,
	/不用.*conductor/i,
	/不要.*调度/,
	/不用.*调度/,
	/别.*派发/,
	/别.*拆/,
	/just explain/i,
	/don'?t change/i,
];

if (process.argv[2] !== "user-prompt-submit") {
	process.stderr.write("Usage: conductor-hook.mjs user-prompt-submit\n");
	process.exitCode = 1;
} else {
	const rawInput = await readStdin();
	const output = buildHookOutput(rawInput);
	if (output.length > 0) stdout.write(output);
}

function buildHookOutput(rawInput) {
	const input = parseInput(rawInput);
	if (input === null) return "";
	if (input.hook_event_name !== "UserPromptSubmit") return "";
	if (typeof input.prompt !== "string") return "";
	if (shouldSuppress(input.prompt)) return "";
	if (alreadyRecommended(input.transcript_path)) return "";
	if (!shouldRecommend(input.prompt)) return "";
	return formatAdditionalContext(recommendationText());
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

function shouldRecommend(prompt) {
	if (hasMagicWord(prompt) || isShortcutCommand(prompt)) return true;

	let score = 0;
	for (const pattern of STRONG_PATTERNS) {
		if (pattern.test(prompt)) score += 2;
	}
	for (const pattern of WEAK_PATTERNS) {
		if (pattern.test(prompt)) score += 1;
	}
	return score >= MIN_SCORE;
}

function hasMagicWord(prompt) {
	return MAGIC_WORD_PATTERNS.some((pattern) => pattern.test(prompt));
}

function isShortcutCommand(prompt) {
	return SHORTCUT_PATTERNS.some((pattern) => pattern.test(prompt));
}

function shouldSuppress(prompt) {
	return SUPPRESS_PATTERNS.some((pattern) => pattern.test(prompt));
}

function alreadyRecommended(transcriptPath) {
	if (typeof transcriptPath !== "string" || transcriptPath.length === 0) return false;
	try {
		const transcript = readFileSync(transcriptPath, "utf8");
		return transcript.includes(CONDUCTOR_MARKER);
	} catch {
		return false;
	}
}

function recommendationText() {
	return `${CONDUCTOR_MARKER}
The user's prompt looks like it may benefit from Codex Conductor.

Before doing broad orchestration, briefly decide whether this task should use
Codex Conductor. If useful, ask the user for confirmation in one short sentence
or proceed when they explicitly asked for multi-thread/session dispatch.

When the accepted work is implementation, commit, plugin, project-session, or
other delivery-shaped work, pair Conductor with the bundled conductor-lite skill:
use the conductor skill for dispatch/session coordination and conductor-lite for
direct execution with one focused verification pass. For tiny read-only
questions, keep it lightweight.

When Conductor is accepted, keep the current thread as the coordinator, use
Codex App session/thread units exposed by this environment, and show a concise
Dispatch Plan before creating or messaging session units.

Default to Codex App session/thread units for project sessions, worker
sessions, durable workers, project-scoped code changes, parallel investigation,
or any prompt where a separate execution context is expected. If session/thread
tools are unavailable, keep the work in the coordinator or ask for a supported
session path rather than creating non-session workers.`;
}

function formatAdditionalContext(additionalContext) {
	return `${JSON.stringify({
		hookSpecificOutput: {
			hookEventName: "UserPromptSubmit",
			additionalContext,
		},
	})}\n`;
}

function readStdin() {
	return new Promise((resolve, reject) => {
		let data = "";
		stdin.setEncoding("utf8");
		stdin.on("data", (chunk) => {
			data += chunk;
		});
		stdin.once("error", reject);
		stdin.once("end", () => resolve(data));
		stdin.resume();
	});
}

function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
