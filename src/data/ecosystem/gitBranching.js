export default {
  id: 'git-branching',
  title: '2. Branching & Merging',
  explanation: `A **branch** is a lightweight movable pointer to a commit. Creating a branch costs nothing — it is just a file containing a commit hash. The default branch is called \`main\` (or \`master\` in older repos).

**HEAD** is the pointer to your current branch (or commit). When you commit, HEAD and the current branch both advance.

**Merge strategies:**
- **Fast-forward** — no divergence, Git just moves the branch pointer forward. History stays linear.
- **3-way merge** — branches diverged; Git creates a merge commit combining both lines.
- **Rebase** — rewrites your commits on top of another branch. Linear history, but rewrites SHA hashes.

**Golden rule of rebase:** never rebase commits that have been pushed to a shared remote. Rewriting public history causes problems for everyone who has those commits.`,
  code: `# Create and switch to a new branch in one step
git switch -c feature/login   # modern syntax (Git 2.23+)
# or older: git checkout -b feature/login

# List all branches
git branch         # local branches
git branch -a      # local + remote tracking branches

# Switch between branches
git switch main
git switch feature/login

# Merge a feature branch into main
git switch main
git merge feature/login       # fast-forward if possible

# Merge with explicit merge commit (preserves branch topology in history)
git merge --no-ff feature/login

# Rebase: replay feature commits on top of main
git switch feature/login
git rebase main               # rewrites commits on top of current main

# Delete a merged branch
git branch -d feature/login   # safe delete (refuses if not merged)
git branch -D feature/login   # force delete

# Resolve a merge conflict:
# 1. Git marks conflicting files with <<<<<<< / ======= / >>>>>>>
# 2. Edit the file to keep what you want
# 3. git add <resolved-file>
# 4. git commit
git merge feature/login       # conflict!
# edit the file, then:
git add src/LoginService.java
git commit                    # opens editor for merge commit message`,
  points: [
    'Branches are free and fast — create one for every feature, bugfix, or experiment',
    'Fast-forward merge happens automatically when the target has no new commits since the branch was created',
    'git merge --no-ff is preferred in team workflows because it preserves which commits belong to which feature',
    'Rebase produces a cleaner linear history but rewrites SHA hashes — never rebase shared branches',
    'After resolving a conflict, always git add the resolved file before git commit',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between merge and rebase?\nA: Both integrate changes from one branch into another. Merge creates a merge commit preserving the full branch history. Rebase rewrites your commits as if they were made after the target branch — no merge commit, linear history. Use merge for public/shared branches; use rebase to clean up local feature branches before merging.',
    },
    {
      type: 'gotcha',
      content: 'If you accidentally delete a branch, the commits are not immediately gone — they are still reachable for ~30 days via git reflog. Run git reflog to find the commit SHA, then git switch -c recovered-branch <SHA> to restore it.',
    },
  ],
}
