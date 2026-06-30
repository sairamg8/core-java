export default {
  id: 'creating-a-git-branch',
  title: '179. Creating a Git Branch',
  explanation: `Branches allow parallel lines of development — work on a feature without affecting the main codebase. Creating a branch is cheap and instant in Git.

**Creating a branch:**
  git branch feature/login      — creates branch (stays on current branch)
  git checkout -b feature/login — creates + switches to branch (classic)
  git switch -c feature/login   — creates + switches (modern Git 2.23+)

**Listing branches:**
  git branch            — local branches (current marked with *)
  git branch -r         — remote-tracking branches
  git branch -a         — all branches (local + remote)

**What is a branch?**
A branch is just a lightweight pointer (a file containing a SHA-1 hash) to a commit. Creating a branch is O(1) — no file copying, just a pointer.

**HEAD:**
HEAD is a special pointer that points to the currently checked-out branch. When you commit, the branch pointer advances and HEAD follows.

**Branch naming conventions:**
  feature/login        — new feature
  bugfix/null-pointer  — bug fix
  hotfix/security-fix  — urgent production fix
  release/v2.0         — release preparation
  chore/update-deps    — maintenance

**Switch branch:**
  git checkout main       — switch to main
  git switch main         — modern syntax
  git checkout -          — switch to previous branch

**Create branch from specific commit:**
  git branch feature/fix abc123     — create from commit hash
  git branch feature/fix v1.0       — create from tag
  git branch feature/fix origin/main — create from remote branch`,
  code: `# ===== Creating Git Branches =====

# 1. Create a branch (stay on current branch)
git branch feature/login
# Branch "feature/login" created at current HEAD

# 2. Create AND switch to new branch (classic syntax)
git checkout -b feature/login
# Switched to a new branch "feature/login"

# 3. Create AND switch (modern syntax — Git 2.23+)
git switch -c feature/login
# Switched to a new branch "feature/login"

# 4. List all branches
git branch
#   main
# * feature/login    (currently on this branch)

git branch -a
#   main
# * feature/login
#   remotes/origin/main
#   remotes/origin/feature/old

# 5. What a branch pointer looks like
# .git/refs/heads/feature/login contains a SHA-1 hash:
# d4f83d5e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6

# 6. Make commits on the feature branch
echo "public class LoginService { }" > LoginService.java
git add LoginService.java
git commit -m "Add LoginService skeleton"
# Only the feature/login branch advances — main stays where it was

# 7. Switch back to main (feature changes are preserved)
git checkout main
# Switched to branch "main"
# LoginService.java disappears from working tree (it is only on feature/login)

# 8. Create branch from specific base points
git branch feature/fix abc1234        # from a specific commit
git branch feature/fix v1.0           # from a tag
git branch feature/fix origin/develop # from a remote branch

# 9. Push new branch to remote
git push -u origin feature/login
# Creates feature/login on origin, sets tracking

# 10. Quick switch to previous branch
git checkout main
git checkout -    # switch back to feature/login (previous)

# 11. View branch + commit history
git log --oneline --graph --all
# * d4f83d5 (feature/login) Add LoginService skeleton
# * abc1234 (HEAD -> main, origin/main) Previous commit`,
  codeTitle: 'Creating and Managing Git Branches',
  points: [
    'git branch <name> creates a branch at the current HEAD; git checkout -b <name> creates and switches in one command',
    'git switch -c <name> is the modern (Git 2.23+) alternative to git checkout -b',
    'Branches are just pointers to commits — creating a branch is instant and lightweight',
    'HEAD points to the current branch; committing advances the current branch pointer and HEAD follows',
    'Switch between branches with git checkout <name> or git switch <name>',
    'git branch -a shows all local AND remote-tracking branches',
    'Branch naming conventions: feature/, bugfix/, hotfix/, release/ prefixes make repos easier to navigate',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'When you switch branches, Git updates your working tree to match the branch state. Uncommitted changes may be carried over OR cause a conflict. Use git stash to save work before switching, or git commit to checkpoint it first.',
    },
    {
      type: 'interview',
      content: 'Q: What is a branch in Git internally?\nA: A branch is a file in .git/refs/heads/ containing a single 40-character SHA-1 hash pointing to a commit. Creating a branch just writes a new 41-byte file — it does not copy any code. This is why branching in Git is nearly instantaneous regardless of project size.',
    },
    {
      type: 'tip',
      content: 'Always create feature branches from the latest main: git checkout main && git pull && git checkout -b feature/new. This ensures your feature starts from the most recent shared state and reduces merge conflicts later.',
    },
  ],
}
