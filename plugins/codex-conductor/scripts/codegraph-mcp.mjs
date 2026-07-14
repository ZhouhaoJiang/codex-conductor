#!/usr/bin/env node

import { existsSync } from "node:fs";
import { homedir, platform } from "node:os";
import { delimiter, join } from "node:path";
import { spawn } from "node:child_process";

const runtimeHome =
	process.env.CODEX_CONDUCTOR_RUNTIME_HOME ??
	join(homedir(), ".local", "share", "codex-conductor");
const executableName = platform() === "win32" ? "codegraph.cmd" : "codegraph";
const installedBinary = join(
	runtimeHome,
	"codegraph",
	"node_modules",
	".bin",
	executableName,
);
const explicitBinary = process.env.CODEX_CONDUCTOR_CODEGRAPH_BIN;
const pathBinary = findOnPath(executableName);
const binary =
	[explicitBinary, installedBinary, pathBinary].find(
		(candidate) => typeof candidate === "string" && existsSync(candidate),
	) ?? null;

if (binary === null) {
	process.stderr.write(
		"CodeGraph is optional and is not installed. Run ./install.sh --with-codegraph from the codex-conductor repository.\n",
	);
	process.exitCode = 1;
} else {
	const child = spawn(binary, ["serve", "--mcp"], {
		env: {
			...process.env,
			CODEGRAPH_NO_DAEMON: "1",
			CODEGRAPH_NO_DOWNLOAD: "1",
			CODEGRAPH_TELEMETRY: "0",
			DO_NOT_TRACK: "1",
		},
		stdio: "inherit",
		shell: platform() === "win32",
	});

	child.once("error", (error) => {
		process.stderr.write(`Unable to start CodeGraph: ${error.message}\n`);
		process.exitCode = 1;
	});
	child.once("exit", (code, signal) => {
		if (signal !== null) {
			process.kill(process.pid, signal);
			return;
		}
		process.exitCode = code ?? 1;
	});
}

function findOnPath(executable) {
	const pathValue = process.env.PATH;
	if (typeof pathValue !== "string") return null;
	for (const directory of pathValue.split(delimiter)) {
		if (directory.length === 0) continue;
		const candidate = join(directory, executable);
		if (existsSync(candidate)) return candidate;
	}
	return null;
}
