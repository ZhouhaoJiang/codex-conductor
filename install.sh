#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="codex-conductor"
MARKETPLACE_NAME="codex-conductor"
PLUGIN_ROOT="$REPO_ROOT/plugins/$PLUGIN_NAME"
CLI_SOURCE="$PLUGIN_ROOT/bin/codex-conductor"
CLI_DIR="${CODEX_CONDUCTOR_CLI_DIR:-$HOME/.local/bin}"
CODEX_BIN_RESOLVED=""
INSTALL_CLI=1
INSTALL_CODEGRAPH=0
DRY_RUN=0

usage() {
  cat <<'USAGE'
Install Codex Conductor.

Usage:
  ./install.sh [--dry-run] [--no-cli] [--with-codegraph] [--cli-dir <dir>]

Environment:
  CODEX_BIN                  Codex CLI binary to use. Auto-detected by default.
  CODEX_CONDUCTOR_CLI_DIR  CLI symlink directory. Defaults to ~/.local/bin.
  CODEX_CONDUCTOR_RUNTIME_HOME  Optional runtime directory. Defaults to
                              ~/.local/share/codex-conductor.
USAGE
}

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '+'
    printf ' %q' "$@"
    printf '\n'
    return
  fi
  "$@"
}

warn() {
  printf 'warning: %s\n' "$*" >&2
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

codex_supports_plugins() {
  local candidate="$1"
  "$candidate" plugin add --help >/dev/null 2>&1 &&
    "$candidate" plugin marketplace add --help >/dev/null 2>&1
}

emit_codex_candidates() {
  local dir candidate

  if [[ -n "${PATH:-}" ]]; then
    local IFS=':'
    for dir in $PATH; do
      [[ -n "$dir" ]] || continue
      candidate="$dir/codex"
      [[ -x "$candidate" ]] && printf '%s\n' "$candidate"
    done
  fi

  for candidate in \
    "/Applications/Codex.app/Contents/Resources/codex" \
    "$HOME"/.nvm/versions/node/*/bin/codex \
    "$HOME"/.local/bin/codex; do
    [[ -x "$candidate" ]] && printf '%s\n' "$candidate"
  done
}

find_codex() {
  local candidate

  if [[ -n "${CODEX_BIN:-}" ]]; then
    [[ -x "$CODEX_BIN" ]] || die "CODEX_BIN is not executable: $CODEX_BIN"
    codex_supports_plugins "$CODEX_BIN" ||
      die "CODEX_BIN does not support plugin install commands: $CODEX_BIN"
    printf '%s\n' "$CODEX_BIN"
    return 0
  fi

  while IFS= read -r candidate; do
    [[ -n "$candidate" && -x "$candidate" ]] || continue
    if codex_supports_plugins "$candidate"; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done < <(emit_codex_candidates)

  return 1
}

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --no-cli)
      INSTALL_CLI=0
      shift
      ;;
    --with-codegraph)
      INSTALL_CODEGRAPH=1
      shift
      ;;
    --cli-dir)
      [[ "$#" -ge 2 ]] || die "--cli-dir requires a value"
      CLI_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage
      die "unknown argument: $1"
      ;;
  esac
done

[[ -f "$REPO_ROOT/.agents/plugins/marketplace.json" ]] || die "missing marketplace manifest"
[[ -f "$PLUGIN_ROOT/.codex-plugin/plugin.json" ]] || die "missing plugin manifest"
[[ -x "$CLI_SOURCE" ]] || die "CLI is not executable: $CLI_SOURCE"
[[ -x "$PLUGIN_ROOT/scripts/install-codegraph-runtime" ]] ||
  die "CodeGraph runtime installer is not executable"

CODEX_BIN_RESOLVED="$(find_codex)" ||
  die "no Codex CLI with plugin install support was found; update Codex or set CODEX_BIN"
command -v node >/dev/null 2>&1 || die "node was not found in PATH; Conductor hooks require Node.js"

run "$CODEX_BIN_RESOLVED" plugin marketplace add "$REPO_ROOT"
run "$CODEX_BIN_RESOLVED" plugin add "$PLUGIN_NAME@$MARKETPLACE_NAME"

if [[ "$INSTALL_CODEGRAPH" -eq 1 ]]; then
  run "$PLUGIN_ROOT/scripts/install-codegraph-runtime"
fi

if [[ "$INSTALL_CLI" -eq 1 ]]; then
  run mkdir -p "$CLI_DIR"
  run ln -sf "$CLI_SOURCE" "$CLI_DIR/codex-conductor"
  case ":$PATH:" in
    *":$CLI_DIR:"*) ;;
    *) warn "$CLI_DIR is not on PATH; add it to your shell profile to run codex-conductor directly" ;;
  esac
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  cat <<EOF

Codex Conductor dry-run complete. No changes were made.

Commands above show what a real install would run.

EOF
else
  cat <<EOF

Codex Conductor installed.

Next steps:
  1. Start a new Codex task so plugin skills and hooks are loaded.
  2. Try: "Use Codex Conductor to split this task into worker sessions."
  3. Try: "Conductor Lite: finish this directly."
  4. CLI: codex-conductor help

CodeGraph is optional. Re-run ./install.sh --with-codegraph to install its
pinned local runtime; no session hook downloads it in the background.

EOF
fi
