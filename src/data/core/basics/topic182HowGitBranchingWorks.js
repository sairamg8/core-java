export default {
  id: 'how-git-branching-works',
  title: '182. How Git Branching Works',
  explanation: `Understanding how Git branches work internally explains why they are so fast and cheap compared to other version control systems.

**Git data model:**
Every Git object has a SHA-1 hash. The three core objects:
- **Blob:** file content
- **Tree:** directory listing (pointers to blobs and subtrees)
- **Commit:** author, message, pointer to tree, pointer to parent commit(s)

**What a branch actually is:**
A branch is a text file in .git/refs/heads/ containing a 40-character SHA-1 pointing to a commit.
  cat .git/refs/heads/main
  → d4f83d5e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6

Creating a branch = writing a new 41-byte file. It does NOT copy any code.

**HEAD:**
HEAD is a file in .git/HEAD pointing to the current branch:
  cat .git/HEAD
  → ref: refs/heads/main

When you commit, Git:
1. Writes blobs for changed files
2. Creates a tree pointing to those blobs
3. Creates a commit pointing to the tree + parent commit
4. Advances the current branch pointer to the new commit

**Fast-forward merge:**
When the branch being merged is a direct ancestor of the target:
  main (A → B → C)
  feature (A → B → C → D)
  Merging feature into main: just moves main pointer to D
  No merge commit needed.

**Diverged branches:**
  main:    A → B → C
  feature: A → B → D → E
  These have diverged from B. Merging creates a merge commit M:
  main: A → B → C → M (has two parents: C and E)

**Detached HEAD:**
When you checkout a commit directly (not a branch), HEAD points to a commit hash instead of a branch:
  cat .git/HEAD → d4f83d5...
  Any commits here are not tracked by a branch — they will be garbage collected.`,
  code: `# ===== How Git Branching Works Internally =====

# 1. See what a branch pointer is
cat .git/refs/heads/main
# d4f83d5e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6

cat .git/HEAD
# ref: refs/heads/main

# 2. Create a branch — just creates a new ref file
git branch feature/login
cat .git/refs/heads/feature/login
# Same SHA as main — points to same commit initially!

# 3. Make a commit — branch pointer advances
echo "new" >> file.txt
git add file.txt
git commit -m "New commit on feature"

cat .git/refs/heads/feature/login
# abc1234...  (new commit SHA)
cat .git/refs/heads/main
# d4f83d5...  (unchanged — main did not move)

# 4. Visualize branches
git log --oneline --graph --all
# * abc1234 (HEAD -> feature/login) New commit on feature
# * d4f83d5 (main, origin/main) Previous commit

# 5. Fast-forward merge (when no divergence)
git checkout main
git merge feature/login
# "Fast-forward"
# main now points to abc1234 — same as feature/login
# No merge commit created

git log --oneline --graph
# * abc1234 (HEAD -> main, feature/login)
# * d4f83d5

# 6. Diverged branches — creates 3-way merge commit
git checkout main
git commit -m "Commit on main while feature was being worked on"
# main and feature/login have diverged

git merge feature/login
# Merge commit M created with two parents

git log --oneline --graph
# *   e5f6789 (HEAD -> main) Merge branch "feature/login"
# |\\
# | * abc1234 (feature/login) New commit
# * | def456 Commit on main while feature was worked on
# |/
# * d4f83d5 Common ancestor

# 7. Detached HEAD state
git checkout d4f83d5   # checkout a specific commit
cat .git/HEAD
# d4f83d5... (NOT "ref: refs/heads/...")
# You are in detached HEAD — commits here are not tracked`,
  codeTitle: 'Git Branching Internals',
  points: [
    'A branch is a 41-byte file in .git/refs/heads/ containing a SHA-1 commit hash — not a copy of code',
    'HEAD is a file in .git/HEAD pointing to the current branch — or directly to a SHA-1 in detached HEAD state',
    'When you commit, Git updates only the current branch pointer — other branches are unchanged',
    'Fast-forward merge: if no divergence, just moves the target branch pointer to the source — no merge commit',
    'Three-way merge: when branches have diverged from a common ancestor, Git creates a new merge commit with two parents',
    'Detached HEAD: checking out a commit directly — commits here are orphaned unless you create a branch',
    'Branching is O(1) in Git — no file copying, just pointer manipulation. SVN branching was O(n).',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Commits in detached HEAD state are accessible immediately but will be garbage-collected by git gc after they become unreachable. If you made commits in detached HEAD, create a branch immediately: git branch rescue-branch HEAD.',
    },
    {
      type: 'interview',
      content: 'Q: What is a fast-forward merge in Git?\nA: A fast-forward merge happens when the branch being merged is a direct linear descendant of the target branch — no divergence. Git just moves the target branch pointer forward to the source. No merge commit is created. It produces the cleanest linear history.',
    },
    {
      type: 'tip',
      content: 'git log --oneline --graph --all is the best command to visualize your branch topology. It shows all branches, their relationships, and merge points as an ASCII graph. Make it an alias: git config --global alias.lg "log --oneline --graph --all".',
    },
  ],
}
