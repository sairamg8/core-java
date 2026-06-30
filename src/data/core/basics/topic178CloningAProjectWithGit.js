export default {
  id: 'cloning-a-project-with-git',
  title: '178. Cloning a Project with Git',
  explanation: `git clone downloads an entire repository from a remote URL — all commits, branches, and tags — and sets up the local working directory automatically.

**Basic syntax:**
  git clone <url>
  git clone <url> <directory-name>     — clone into custom-named folder

**URL formats:**
  HTTPS: git clone https://github.com/user/repo.git
  SSH:   git clone git@github.com:user/repo.git
  Local: git clone /path/to/local/repo

**What git clone does automatically:**
  1. Creates a new directory
  2. Initializes a .git/ folder (git init)
  3. Adds remote "origin" pointing to the URL
  4. Downloads all commits, branches, tags
  5. Checks out the default branch (main or master)

**After cloning:**
  git remote -v    — shows origin URL
  git branch -a    — shows all local + remote-tracking branches
  git log --oneline — shows all commit history

**Shallow clone (faster for large repos):**
  git clone --depth 1 <url>     — only the latest commit, no history
  git clone --depth 10 <url>    — last 10 commits
  Useful: CI environments, initial exploration

**Sparse clone (only some directories):**
  git clone --no-checkout <url>
  cd repo && git sparse-checkout set src/

**Single branch clone:**
  git clone --branch develop <url>    — only the develop branch

**Clone vs Fork:**
- Clone: copies to your LOCAL machine
- Fork (GitHub): copies to your GITHUB account — for contributing to projects you do not own`,
  code: `# ===== git clone EXAMPLES =====

# 1. Basic clone (HTTPS)
git clone https://github.com/spring-projects/spring-boot.git
# Creates: spring-boot/ directory with full history

# 2. Clone with custom directory name
git clone https://github.com/user/repo.git my-project
# Creates: my-project/ instead of repo/

# 3. Clone via SSH (requires SSH key setup)
git clone git@github.com:user/repo.git

# 4. Verify clone result
cd repo
git remote -v
# origin  git@github.com:user/repo.git (fetch)
# origin  git@github.com:user/repo.git (push)

git branch -a
# * main                        (checked out locally)
#   remotes/origin/HEAD -> origin/main
#   remotes/origin/develop
#   remotes/origin/feature/login

git log --oneline -5
# Shows last 5 commits from history

# 5. Shallow clone — only last commit (fastest)
git clone --depth 1 https://github.com/user/large-repo.git
# Downloads only the most recent snapshot — no history
# Useful: CI/CD pipelines, quick exploration

# 6. Clone a specific branch only
git clone --branch develop https://github.com/user/repo.git
# Clones develop branch (still sets up origin with all remote branches)

# 7. Clone a local repository
git clone /home/user/projects/myapp ./myapp-copy
# Useful for testing without touching the original

# 8. After clone — standard workflow
git checkout -b feature/my-change   # create local feature branch
# ... make changes ...
git add . && git commit -m "Add change"
git push -u origin feature/my-change  # push to remote

# 9. Sync after others have pushed
git fetch origin
git pull origin main

# 10. Clone and immediately set up upstream (for forks)
git clone git@github.com:youruser/forked-repo.git
cd forked-repo
git remote add upstream git@github.com:original-owner/repo.git
git fetch upstream  # get original repo changes`,
  codeTitle: 'git clone — Copying a Repository',
  points: [
    'git clone downloads the entire repository — all commits, branches, tags — and sets up origin automatically',
    'Clone creates a directory, initializes git, sets remote "origin," downloads history, and checks out the default branch',
    'Use --depth 1 for shallow clones — only the latest state, no history — much faster for CI or large repos',
    'SSH clones (git@github.com) require SSH key setup but avoid credential prompts',
    'git branch -a after cloning shows both local and remote-tracking branches',
    'Clone vs Fork: clone copies to your local machine; fork (GitHub web) copies to your GitHub account for contribution',
    'After cloning a fork, add the original as "upstream" remote: git remote add upstream <original-url>',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Shallow clones (--depth 1) lack history — some git commands (git blame, git log past shallow depth, git bisect) do not work correctly. If you clone shallowly for CI and then need full history, run git fetch --unshallow.',
    },
    {
      type: 'interview',
      content: 'Q: What happens when you run git clone?\nA: Git creates a new directory, initializes a .git folder, adds a remote named "origin" pointing to the URL, downloads all commits, branches, and tags (the full object database), then checks out the default branch into the working tree.',
    },
    {
      type: 'tip',
      content: 'Always clone using SSH (git@github.com:...) for repos you will push to — you will never be prompted for credentials. Use HTTPS (https://github.com/...) only for read-only access or public repos you just want to browse.',
    },
  ],
}
