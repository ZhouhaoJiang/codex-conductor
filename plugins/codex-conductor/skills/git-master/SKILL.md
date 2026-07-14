---
name: git-master
description: "Use when a task explicitly needs a commit, history investigation, rebase, squash, blame, bisect, reflog, or git log search. Do not use for ordinary code edits unless the user asks for Git work."
---

# Git Master

Operate conservatively and preserve changes that are outside the user's scope.

## Start with state

Read `git status --short --branch`, the relevant diff, and recent log before
mutating history or staging files. Treat pre-existing modifications and
untracked files as user-owned unless the current task clearly created them.

## Commits

1. Identify one coherent change and the files that belong to it.
2. Inspect staged and unstaged diffs; do not stage unrelated work.
3. Infer message style from recent commits unless the user supplied a message.
4. Run proportionate verification before committing.
5. Stage explicit paths, review `git diff --cached`, then commit once.

Do not amend, push, force-push, rewrite, or delete branches unless the user
authorized that action.

## History investigation

- Use `git log -S<string>` when a literal token was added or removed.
- Use `git log -G<regex>` when the shape of a changed line matters.
- Use `git blame -L` for the origin of a specific current line.
- Use `git show` to verify the candidate commit and surrounding rationale.
- Use `git reflog` for local reference movement and recovery questions.
- Use `git bisect` only with a reliable good/bad test and a clean strategy for
  restoring the starting state.

Report the exact commit(s) and evidence that answer the question. Do not infer
authorial intent from a commit message when the diff or later history disagrees.

## Rebase and cleanup

Before rewriting local history, confirm the target range, whether commits were
published, and whether the worktree is clean enough to proceed safely. Prefer
non-interactive operations. Stop on conflicts, explain the concrete conflict,
and resolve only files inside the requested scope.
