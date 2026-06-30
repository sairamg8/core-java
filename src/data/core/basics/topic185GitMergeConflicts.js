export default {
  id: 'git-merge-conflicts',
  title: '185. Git Merge Conflicts',
  explanation: `A merge conflict occurs when two branches modify the same part of the same file and Git cannot automatically determine which version to keep.

**When conflicts happen:**
- Two branches edit the same lines of a file
- One branch deletes a file the other branch modified
- Both branches add different content at the same position

**Conflict markers in files:**
Git adds these markers to the conflicted file:
  <<<<<<< HEAD
  Your current branch version
  =======
  Incoming branch version
  >>>>>>> feature/login

<<<<<<< to ======= : your branch (HEAD)
======= to >>>>>>> : the incoming branch

**Resolving conflicts:**
1. Open the conflicted file
2. Edit to the correct final version (remove all markers)
3. git add <file>        — mark as resolved
4. git commit           — complete the merge

**Tools for conflict resolution:**
  git mergetool        — opens configured merge tool (VS Code, IntelliJ, Meld)
  git mergetool --tool=vscode

**Aborting a merge:**
  git merge --abort    — restore pre-merge state completely

**Checking conflict status:**
  git status           — shows "both modified" for conflicted files
  git diff             — shows remaining conflicts

**Common conflict scenarios:**
1. Two devs edit same function → edit manually
2. One renames a file, other edits it → pick the right name + content
3. Both add a feature at the same line → combine both additions

**Preventing conflicts:**
- Pull frequently
- Work on small, focused branches
- Communicate with teammates about file ownership
- Use feature flags to avoid long-lived branches`,
  code: `# ===== Git Merge Conflicts =====

# Setup: both branches edit the same file
# main branch:
echo "Hello World" > greeting.txt
git add greeting.txt
git commit -m "Add greeting"

# feature branch:
git checkout -b feature/greeting
echo "Hello Universe" > greeting.txt
git commit -am "Update greeting to Universe"

# Meanwhile, main branch also changed:
git checkout main
echo "Hello Java" > greeting.txt
git commit -am "Update greeting to Java"

# Now try to merge:
git merge feature/greeting
# CONFLICT (content): Merge conflict in greeting.txt
# Automatic merge failed; fix conflicts and then commit.

# ---- Inspect the conflicted file ----
cat greeting.txt
# <<<<<<< HEAD
# Hello Java
# =======
# Hello Universe
# >>>>>>> feature/greeting

git status
# Unmerged paths:
#   both modified: greeting.txt

# ---- Resolve: choose the right version ----
# Option A: keep our version (HEAD)
git checkout --ours greeting.txt

# Option B: keep their version (feature/greeting)
git checkout --theirs greeting.txt

# Option C: manual edit — combine both
# Remove markers, write the desired final content:
echo "Hello Java and the Universe" > greeting.txt

# ---- Stage the resolved file ----
git add greeting.txt

# ---- Complete the merge ----
git commit
# Opens editor with default message: "Merge branch 'feature/greeting'"

# ---- View the merge result ----
git log --oneline --graph
# *   f3e2d1 (HEAD -> main) Merge branch 'feature/greeting'
# |\\
# | * d4f83d (feature/greeting) Update greeting to Universe
# * | abc123 Update greeting to Java
# |/
# * 123abc Add greeting

# ---- Abort if things go wrong ----
git merge feature/greeting
# ... lots of conflicts you are not ready for ...
git merge --abort   # back to pre-merge state

# ---- Use mergetool (VS Code) ----
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd "code --wait \$MERGED"
git mergetool   # opens VS Code for each conflict`,
  codeTitle: 'Resolving Git Merge Conflicts',
  points: [
    'Merge conflicts occur when two branches change the same lines — Git pauses the merge and adds conflict markers',
    'Conflict markers: <<<<<<< HEAD (current), ======= (separator), >>>>>>> branch (incoming)',
    'Resolution: edit the file to the correct final content, remove ALL markers, git add, then git commit',
    'git checkout --ours file keeps the current branch version; --theirs keeps the incoming branch version',
    'git merge --abort cancels the merge and restores the repository to the pre-merge state',
    'git status shows "both modified" for conflicted files; git diff shows remaining unresolved conflicts',
    'Configure a mergetool (VS Code, IntelliJ) for a visual diff interface: git config --global merge.tool vscode',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'After resolving conflicts, you MUST run git add on each resolved file AND then git commit to complete the merge. Forgetting git add leaves the file in a "modified but unresolved" state. Forgetting git commit leaves the merge incomplete.',
    },
    {
      type: 'interview',
      content: 'Q: How do you resolve a Git merge conflict?\nA: 1) Open the conflicted file and look for <<<<<<<, =======, and >>>>>>> markers. 2) Edit the file to the correct final version, removing all markers. 3) git add <file> to mark it resolved. 4) Repeat for all conflicted files. 5) git commit to complete the merge.',
    },
    {
      type: 'tip',
      content: 'To reduce merge conflicts: pull from main frequently (daily), keep branches short-lived (days, not weeks), communicate with teammates when working on the same files. Long-lived feature branches are the #1 cause of painful merge conflicts.',
    },
  ],
}
