export default {
  id: 'git-diff',
  title: '173. Git diff',
  explanation: `git diff shows the differences between versions of files — unstaged changes, staged changes, between branches, or between any two commits.

**Core variants:**
  git diff                    — unstaged changes (working tree vs staging area)
  git diff --staged           — staged changes (staging area vs last commit)
  git diff HEAD               — all changes since last commit (staged + unstaged)
  git diff HEAD~1             — changes since the commit before HEAD

**Comparing commits:**
  git diff abc123 def456      — between two commits
  git diff main feature       — between two branches
  git diff HEAD~3..HEAD       — last 3 commits of changes

**Specific files:**
  git diff Main.java          — diff for one file only
  git diff HEAD~1 -- Main.java — that file across commits

**Output format:**
  --- a/Main.java    (before)
  +++ b/Main.java    (after)
  @@ -5,7 +5,8 @@   (line numbers: -before +after)
  - removed line
  + added line
    context line

**Useful flags:**
  --stat        — summary of changed files and line counts
  --name-only   — just file names
  --word-diff   — highlight changed words within lines (good for docs)
  --color-words — same, colored

**git diff with external tools:**
  git difftool    — opens configured GUI diff tool (VS Code, IntelliJ, Meld)
  git config --global diff.tool vscode

**Diff between remote and local:**
  git fetch origin
  git diff origin/main..main   — what changed locally vs remote`,
  code: `# ===== git diff EXAMPLES =====

# Setup
echo "original" > hello.txt
git add hello.txt
git commit -m "Add hello.txt"

# Modify file
echo "modified" >> hello.txt

# 1. Unstaged diff (working tree vs staging area)
git diff
# diff --git a/hello.txt b/hello.txt
# index abc123..def456 100644
# --- a/hello.txt
# +++ b/hello.txt
# @@ -1 +1,2 @@
#  original
# +modified

# 2. Stage the change
git add hello.txt

# 3. Staged diff (staging area vs last commit)
git diff --staged
# Same output — because change is now staged

# 4. All changes vs HEAD (staged + unstaged combined)
git diff HEAD

# 5. Compare two branches
git diff main feature/login
# Shows all differences between the two branch tips

# 6. Compare two commits
git log --oneline
# a3b2c1 Second commit
# f1e2d3 First commit

git diff f1e2d3 a3b2c1
# Shows what changed between first and second commit

# 7. Specific file only
git diff Main.java

# 8. Summary (file names + insertions/deletions count)
git diff --stat
# hello.txt | 1 +
# 1 file changed, 1 insertion(+)

# 9. Word-level diff (good for documentation)
git diff --word-diff
# Changes highlighted at word level, not line level

# 10. Diff vs remote (fetch first to update remote refs)
git fetch origin
git diff origin/main
# Shows what your local main has that remote does not`,
  codeTitle: 'git diff — Comparing Changes',
  points: [
    'git diff (no args) shows unstaged changes — modifications in your working tree not yet staged',
    'git diff --staged shows staged changes — what will be included in the next commit',
    'git diff HEAD shows ALL uncommitted changes (staged + unstaged) versus the last commit',
    'git diff branch1 branch2 shows differences between the tips of two branches',
    'git diff --stat gives a summary: which files changed and how many lines were added/removed',
    'Lines starting with - were removed; lines starting with + were added; context lines have no prefix',
    'git difftool opens a graphical diff viewer — configure with git config --global diff.tool <toolname>',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git diff with no arguments shows UNSTAGED changes only. If you ran git add already, git diff shows nothing — use git diff --staged to see what is staged. Many beginners are confused when git diff is empty after git add.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git diff and git diff --staged?\nA: git diff compares your working tree against the staging area — it shows changes you have made but not yet staged. git diff --staged (or --cached) compares the staging area against the last commit — it shows what will be included in your next commit.',
    },
    {
      type: 'tip',
      content: 'Before committing, always run git diff --staged to review exactly what will be committed. This prevents accidentally committing debug code, sensitive data, or unrelated changes. Make it a habit before every commit.',
    },
  ],
}
