export default {
  id: 'git-fork',
  title: '188. Git Fork',
  explanation: `A fork is your personal copy of someone else's repository on GitHub — the foundation of open source contribution.

**What is a Fork?**
Forking creates a complete copy of a repository under your GitHub account. You get full control over your copy — you can push freely without needing permission from the original owner.

**Fork vs Clone:**
- **Fork:** Server-side copy (GitHub → your GitHub account). Enables PRs to the original.
- **Clone:** Local copy (GitHub → your machine). Does not create a server-side copy.

**Typical open source contribution workflow:**
  1. Fork the repo on GitHub (your GitHub account gets a copy)
  2. Clone YOUR fork: git clone git@github.com:YOU/project.git
  3. Add the original as "upstream": git remote add upstream git@github.com:ORIGINAL/project.git
  4. Create a feature branch: git checkout -b fix/typo
  5. Make changes, commit, push to YOUR fork
  6. Open a Pull Request from your fork to the original repo

**Staying in sync with upstream:**
  git fetch upstream
  git merge upstream/main  — OR —
  git rebase upstream/main

**Why this workflow?**
Contributors do not have write access to the original repo. They push to their fork and create PRs from there. The original repo owner reviews and merges the PR.

**Fork vs Branch:**
- Fork: copy of an entire repo — used when you do NOT own the original
- Branch: line of development within a single repo — used when you DO own it

**GitHub features:**
- Forks show "forked from original/repo"
- PRs from forks are labeled "from fork"
- You can sync your fork via GitHub UI ("Sync fork" button)`,
  code: `# ===== Git Fork Workflow =====

# ---- Step 1: Fork on GitHub ----
# Go to github.com/original-owner/project
# Click "Fork" → Fork to your account
# Now: github.com/YOU/project exists

# ---- Step 2: Clone your fork locally ----
git clone git@github.com:YOU/project.git
cd project

# ---- Step 3: Add original repo as "upstream" ----
git remote add upstream git@github.com:original-owner/project.git

# Verify remotes:
git remote -v
# origin    git@github.com:YOU/project.git (fetch)
# origin    git@github.com:YOU/project.git (push)
# upstream  git@github.com:original-owner/project.git (fetch)
# upstream  git@github.com:original-owner/project.git (push)

# ---- Step 4: Create a feature branch ----
git checkout -b fix/update-readme

# ---- Step 5: Make changes and commit ----
echo "## Contributing" >> README.md
git add README.md
git commit -m "Add contributing section to README"

# ---- Step 6: Push to YOUR fork ----
git push -u origin fix/update-readme

# ---- Step 7: Create Pull Request ----
gh pr create \
  --repo original-owner/project \
  --base main \
  --head YOU:fix/update-readme \
  --title "Add contributing section" \
  --body "Adds a Contributing section to the README."

# ---- Keeping fork in sync with upstream ----
git fetch upstream
git checkout main
git merge upstream/main     # merge upstream changes into local main
git push origin main        # update your fork on GitHub

# OR rebase approach (cleaner):
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin main

# ---- GitHub CLI fork shortcut ----
gh repo fork original-owner/project --clone
# Forks + clones in one command, sets up remotes automatically

# ---- Check if your fork is behind upstream ----
git fetch upstream
git log HEAD..upstream/main --oneline
# Shows commits in upstream not yet in your fork`,
  codeTitle: 'Fork Workflow for Open Source Contribution',
  points: [
    'A fork is a server-side copy of a repo under your GitHub account — you have full push access to your fork',
    'Workflow: Fork on GitHub → clone your fork → add upstream remote → branch → commit → push → PR to original',
    'Always add the original repo as "upstream" remote so you can sync changes from the source project',
    'git fetch upstream + git merge upstream/main keeps your fork in sync with the original repository',
    'Fork is for contributing to repos you do not own; branch is for parallel development in repos you do own',
    'gh repo fork --clone forks and clones in one command and auto-configures origin and upstream remotes',
    'PRs from forks go from your-username:feature-branch to the original repo, pending owner approval',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forks do NOT automatically stay in sync with the upstream repo. If the original receives 50 commits while you are working on your fork, your fork falls behind. Regularly run git fetch upstream && git rebase upstream/main to stay current and avoid large merge conflicts.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a fork and a branch in Git/GitHub?\nA: A fork creates a separate copy of the entire repository under your GitHub account — used when contributing to projects you do not own. A branch is a parallel line of development within a single repository — used when you have write access to the repo.',
    },
    {
      type: 'tip',
      content: 'When contributing to open source, fork first and always work on a feature branch in your fork — never directly on main. This keeps your fork main clean and in sync with upstream, making it easy to stay updated and create multiple PRs simultaneously.',
    },
  ],
}
