export default {
  id: 'git-advanced',
  title: '4. Git Advanced — Stash, Reset, Tags & .gitignore',
  explanation: `**Stash** is a temporary shelf for uncommitted changes. Use it when you need to switch branches but are not ready to commit.

**reset vs revert:**
- \`git reset\` — moves the branch pointer backward, optionally discarding staged/working changes. Rewrites history — dangerous on shared branches.
- \`git revert\` — creates a new commit that undoes a previous commit. Safe on shared branches because it does not rewrite history.

**Tags** mark specific points in history (usually releases). Unlike branches, tags do not move.
- **Lightweight tag** — just a name for a commit
- **Annotated tag** — a full object with author, date, message, and optional GPG signature. Preferred for releases.

**.gitignore** tells Git which files to never track. Applies to untracked files only — already-tracked files must be removed with \`git rm --cached\`.`,
  code: `# === STASH ===
git stash                      # stash all uncommitted changes
git stash push -m "WIP: login form"  # stash with a message
git stash list                 # see all stashes
git stash pop                  # apply top stash + remove it from the list
git stash apply stash@{1}      # apply a specific stash (keep it in the list)
git stash drop stash@{0}       # delete a stash
git stash clear                # delete ALL stashes

# === RESET ===
git reset --soft HEAD~1        # undo last commit, keep changes staged
git reset --mixed HEAD~1       # undo last commit, keep changes unstaged (default)
git reset --hard HEAD~1        # undo last commit, DISCARD all changes (dangerous!)
git reset --hard HEAD          # discard ALL unstaged+staged changes (nuclear option)

# === REVERT (safe, creates a new commit) ===
git revert HEAD                # revert last commit
git revert abc123              # revert any commit by hash

# === CHERRY-PICK (apply one commit from another branch) ===
git cherry-pick abc123         # copy commit abc123 onto current branch

# === TAGS ===
git tag v1.0.0                 # lightweight tag on HEAD
git tag -a v1.0.0 -m "Release 1.0.0"  # annotated tag (preferred)
git push origin v1.0.0         # push a specific tag
git push origin --tags         # push all tags
git tag -d v1.0.0              # delete local tag

# === .gitignore (file at repo root) ===
# *.class          — ignore all .class files
# target/          — ignore the Maven build directory
# .env             — ignore environment files with secrets
# !important.class — exception: track this .class even though *.class is ignored`,
  points: [
    'git stash pop is stash apply + stash drop combined — use it when you are done with the stash',
    'git reset --hard cannot be undone by git undo — but git reflog can find the lost commits for ~30 days',
    'git revert is the correct tool for undoing a pushed commit on a shared branch',
    'Annotated tags (git tag -a) are stored as full objects with metadata — always use them for releases',
    '.gitignore patterns are not retroactive: already-tracked files must be removed with git rm --cached then ignored',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between git reset and git revert?\nA: git reset moves the branch pointer backward, effectively removing commits from history — it rewrites history and is unsafe on shared branches. git revert creates a NEW commit that applies the inverse of a previous commit, leaving the original commit in history. Always use revert on public/shared branches.',
    },
    {
      type: 'tip',
      content: 'Generate a strong .gitignore for your tech stack at gitignore.io — type your tools (java, maven, intellij, vscode) and it produces a comprehensive ignore file covering all IDE files, build artifacts, and OS temp files.',
    },
  ],
}
