export default {
  id: 'git-time-travel',
  title: '186. Git Time Travel',
  explanation: `Git preserves the entire project history — you can travel to any point in time, restore files, undo commits, and investigate past states.

**Viewing past states:**
  git log                        — full history
  git log --oneline --graph      — visual graph
  git show <hash>                — show a commit's changes
  git checkout <hash>            — visit a past commit (detached HEAD)

**Restoring specific files:**
  git restore <file>             — discard unstaged changes (working tree)
  git restore --staged <file>    — unstage (remove from staging area)
  git restore --source=<hash> <file>  — restore file from past commit

**Undoing commits:**
  git revert <hash>              — creates a new commit that reverses the target commit (safe)
  git reset HEAD~1               — moves HEAD back 1 commit (options: --soft, --mixed, --hard)

**git reset modes:**
  --soft:  keep changes staged (moved to staging area)
  --mixed: keep changes unstaged (moved to working tree) [DEFAULT]
  --hard:  discard all changes (DESTRUCTIVE)

  git reset --soft HEAD~1   — undo last commit, keep changes staged
  git reset --mixed HEAD~1  — undo last commit, keep changes unstaged
  git reset --hard HEAD~1   — undo last commit AND discard all changes

**git reflog — the time machine:**
Records every movement of HEAD:
  git reflog
  # HEAD@{0}: commit: Latest commit
  # HEAD@{1}: merge: Merge branch...
  # HEAD@{2}: reset: moving to HEAD~1
  Recover anything by checking out its hash.

**Comparing past versions:**
  git diff HEAD~3..HEAD          — changes over last 3 commits
  git diff <hash1>..<hash2>      — between any two commits`,
  code: `# ===== Git Time Travel =====

# 1. View history
git log --oneline
# d4f83d5 (HEAD -> main) Third commit
# abc1234 Second commit
# 123abcd First commit

# 2. Visit a past commit (read-only)
git checkout abc1234
# Detached HEAD — files show abc1234 state
# git checkout main   → go back to present

# 3. Restore a single file from a past commit
git restore --source=abc1234 -- Main.java
# Main.java now shows its state from abc1234
# Other files unchanged

# 4. Discard unstaged changes (working tree)
git restore Main.java
# Reverts Main.java to last committed state

# 5. Unstage a file (remove from staging area)
git add Main.java
git restore --staged Main.java  # unstaged, changes preserved in working tree

# 6. Undo last commit — keep changes staged (--soft)
git reset --soft HEAD~1
# Commit is gone, changes are in staging area (git add already done)

# 7. Undo last commit — keep changes unstaged (--mixed, default)
git reset HEAD~1
# Commit is gone, changes are in working tree (need git add again)

# 8. Undo last commit — discard all changes (--hard, DESTRUCTIVE)
git reset --hard HEAD~1
# Commit is gone AND all changes are deleted permanently

# 9. git revert — safe undo (creates NEW commit)
git revert abc1234
# Creates a new commit that reverses abc1234 changes
# History is preserved — safe for shared branches

# 10. git reflog — recover "lost" commits
git reflog
# d4f83d5 HEAD@{0}: reset: moving to HEAD~1
# abc1234 HEAD@{1}: commit: Third commit (this was "lost")

git checkout abc1234  # recover the "lost" commit
git branch rescue main  # save it as a branch

# 11. Find when a bug was introduced (git bisect)
git bisect start
git bisect bad HEAD           # current version is broken
git bisect good abc1234       # this old version was fine
# Git checks out middle commit — test it, then:
git bisect good   # or: git bisect bad
# Repeat until git bisect identifies the exact culprit commit`,
  codeTitle: 'Git Time Travel — History Exploration and Undo',
  points: [
    'git checkout <hash> visits a past commit in detached HEAD — read-only exploration, return with git checkout main',
    'git restore --source=<hash> -- file restores a single file from a past commit without moving HEAD',
    'git reset --soft HEAD~1 undoes the last commit but keeps changes staged; --mixed keeps them unstaged; --hard discards them',
    'git revert <hash> creates a new reverse commit — safe for shared branches since it does not rewrite history',
    'git reflog records every HEAD movement — use it to recover commits that seem "lost" after reset or rebase',
    'git bisect automates binary search through history to find which commit introduced a bug',
    'git reset --hard is DESTRUCTIVE — always check git status and git log before using it',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git reset --hard HEAD~1 permanently discards your local changes and uncommitted work — there is no undo. Always commit or stash WIP before resetting. If you ran it by mistake, check git reflog immediately — the commits may still be recoverable for a short time.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git reset and git revert?\nA: git reset moves HEAD backwards, rewriting history (destructive for shared branches). git revert creates a new commit that reverses the target commit, preserving all history. Use revert on shared branches; use reset only on private local branches.',
    },
    {
      type: 'tip',
      content: 'git reflog is your safety net — it remembers where HEAD has been for the last 90 days (default). If you accidentally reset --hard, dropped a stash, or deleted a branch, check git reflog immediately. Find the SHA-1 and create a branch from it.',
    },
  ],
}
