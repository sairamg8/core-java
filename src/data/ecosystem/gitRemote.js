export default {
  id: 'git-remote',
  title: '3. Remotes — Push, Pull & GitHub Workflow',
  explanation: `A **remote** is a named URL to another copy of the repository. \`origin\` is the conventional name for the remote you cloned from.

**Remote tracking branches** (e.g. \`origin/main\`) are local read-only snapshots of what the remote looked like the last time you fetched.

**fetch vs pull:**
- \`git fetch\` — downloads new data from the remote, updates remote tracking branches, does NOT touch your working directory or local branches
- \`git pull\` — fetch + merge (or fetch + rebase with \`--rebase\`). Modifies your current branch.

**Typical team workflow (GitHub Flow):**
1. Create a feature branch from \`main\`
2. Commit changes, push branch to remote
3. Open a Pull Request on GitHub
4. Code review + CI passes → merge into \`main\`
5. Delete the feature branch`,
  code: `# Clone an existing repo
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder  # clone into specific folder

# See your remotes
git remote -v                    # shows fetch and push URLs

# Fetch without merging (safe — does not touch your code)
git fetch origin                 # download all remote changes
git fetch origin main            # fetch only the main branch

# Push a local branch to the remote
git push origin feature/login              # push branch
git push -u origin feature/login          # -u sets upstream tracking (once)
git push                                   # after -u, just push

# Pull (fetch + merge)
git pull origin main             # pulls main from origin and merges
git pull --rebase origin main    # fetch + rebase instead of merge

# Sync main with remote (standard pattern)
git switch main
git pull origin main

# Delete a remote branch
git push origin --delete feature/login

# See all remote branches
git ls-remote origin
git branch -r                    # remote tracking branches`,
  points: [
    'git fetch is always safe — it never changes your local branches or working directory',
    'git pull --rebase keeps a linear history and is preferred in many teams over the default merge pull',
    'Always git pull main before creating a new feature branch so you start from the latest code',
    'The -u (--set-upstream) flag only needs to be used on the first push of a branch',
    'Fork + Pull Request workflow: fork the repo, work in your fork, open a PR to the original',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between git fetch and git pull?\nA: git fetch downloads changes from the remote and updates remote tracking branches (e.g. origin/main) but does NOT modify your local branches or working directory. git pull does a fetch then immediately merges (or rebases) the fetched changes into your current branch. Fetch is always safe; pull changes your local state.',
    },
    {
      type: 'gotcha',
      content: 'git push --force is dangerous on shared branches — it can overwrite teammates commits. Use git push --force-with-lease instead: it fails if someone else has pushed since your last fetch, preventing accidental overwrites.',
    },
  ],
}
