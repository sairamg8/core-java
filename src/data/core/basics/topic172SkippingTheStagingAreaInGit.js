export default {
  id: 'skipping-the-staging-area-in-git',
  title: '172. Skipping the Staging Area in Git',
  explanation: `Git's staging area (index) gives precise control over what goes into each commit. Sometimes you want to skip it and commit all modified tracked files directly.

**git commit -a (or --all):**
Automatically stages all modifications and deletions to already-tracked files, then commits:
  git commit -a -m "Fix all the things"
  git commit -am "Fix all the things"  // shorthand

**What -a does NOT stage:**
- New (untracked) files — must still use git add for new files
- Files in .gitignore

**When to use -a:**
- Small changes across many files
- Quick "checkpoint" commits during active development
- When all modifications in tracked files belong in one commit

**When NOT to use -a:**
- When you want to split changes across multiple commits
- When some tracked file modifications should be excluded
- When precision matters (use git add and git add -p instead)

**Comparing approaches:**

Explicit staging:
  git add src/Main.java
  git add tests/MainTest.java
  git commit -m "Add Main class with tests"

Skip staging:
  git commit -am "Add Main class with tests"
  // Commits ALL modified tracked files — no selective control

**git add . vs git commit -a:**
- git add . stages all changes (new + modified + deleted) in current directory, then you commit manually
- git commit -a stages and commits all modifications/deletions to tracked files in one command

**Risk:**
Using -a carelessly can commit unrelated changes in one commit — leading to messy history. Prefer explicit staging for important commits.`,
  code: `# ===== Skipping Staging Area =====

# Scenario: You have these files modified
# Main.java — modified
# Utils.java — modified
# Config.java — new (untracked)

# ---- Normal workflow (with staging) ----
git add Main.java Utils.java  # stage specific files
# Config.java is NOT staged
git commit -m "Update Main and Utils"

# ---- Skip staging (-a flag) ----
# Stage all modifications to TRACKED files + commit in one command
git commit -am "Update Main and Utils"
# Same result as above for Main.java and Utils.java
# Config.java is still NOT included — it is untracked (new file)

# ---- To include Config.java, you MUST use git add ----
git add Config.java
git commit -m "Add Config class"

# ---- Verification ----
# Check what -a would include BEFORE committing:
git diff          # shows unstaged changes in tracked files
git diff --staged # shows what is already staged

# ---- -a with deletions ----
rm OldFile.java
git commit -am "Remove OldFile"
# -a will include the deletion of OldFile.java (it was tracked)

# ---- Comparison ----
# git add .
echo "modified" >> Main.java
git add .
# Stages: Main.java (modified), Config.java (new), deletions
git commit -m "All changes"

# vs git commit -am
echo "modified" >> Main.java
git commit -am "All tracked changes"
# Stages: Main.java (modified), deletions
# Does NOT stage: Config.java (untracked)

# ---- Real-world use ----
# Quick fix across multiple files:
# Fix a typo in 5 files → git commit -am "Fix typos"
# No need to stage each file individually`,
  codeTitle: 'git commit -a — Skipping the Staging Area',
  points: [
    'git commit -am "msg" stages all modified/deleted tracked files and commits in one step',
    '-a does NOT stage new (untracked) files — new files always need git add first',
    'Use -a for small, all-inclusive changes; use explicit git add for precise, multi-commit workflows',
    'Carelessly using -a can bundle unrelated changes into one commit — prefer staging for clean history',
    'git diff shows unstaged changes; git diff --staged shows what is in the staging area ready to commit',
    'git add . stages all changes including new files in the current directory; -a does not include new files',
    'Deletions of tracked files are included by -a automatically',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git commit -a is easy to overuse — it commits EVERY modified tracked file. If you have debugging code, console.log statements, or WIP changes in other files, -a will include them all. Use git status and git diff before relying on -a.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git add . and git commit -a?\nA: git add . stages all changes (including new untracked files) in the current directory into the staging area, but does not commit. git commit -a automatically stages all modifications and deletions of already-tracked files and immediately commits, but does NOT include new untracked files.',
    },
    {
      type: 'tip',
      content: 'Use git add -p (interactive patch mode) when you want surgical control. It lets you stage individual "hunks" (sections of a diff) rather than entire files — perfect for separating a bug fix from a refactor that happened to be in the same file.',
    },
  ],
}
