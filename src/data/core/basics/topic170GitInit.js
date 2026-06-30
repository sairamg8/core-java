export default {
  id: 'git-init',
  title: '170. Git Init',
  explanation: `git init creates a new empty Git repository in the current directory, setting up the hidden .git folder that stores all version history.

**Command:**
  git init            — initialize in the current directory
  git init myproject  — create directory "myproject" and initialize inside it

**What happens:**
Git creates a .git/ folder with:
  .git/
  ├── HEAD         — points to the current branch ref
  ├── config       — local repo config
  ├── description  — repo description (used by GitWeb)
  ├── hooks/       — scripts triggered by git events
  ├── info/        — global gitignore for this repo
  ├── objects/     — all committed files, trees, commits (SHA-1 addressed)
  └── refs/        — branch and tag pointers

**git init in existing project:**
Running git init in an already-tracked directory reinitializes it (safe — it does NOT overwrite history).

**Setting the initial branch:**
  git init -b main         — start with "main" branch (Git 2.28+)
  git config --global init.defaultBranch main  — set default globally

**First steps after init:**
  1. Create files
  2. git add <files>     — stage them
  3. git commit -m "msg" — first commit

**git init vs git clone:**
- git init: starts a new empty repo
- git clone: copies an existing repo from a URL

**Bare repository:**
  git init --bare myrepo.git
Creates a repo without a working tree — used as a central "push target" on servers. No actual files, only git history.

**Check if in a git repo:**
  git status   — gives error if not in a git repo
  git rev-parse --is-inside-work-tree  — returns "true"`,
  code: `# ===== git init WORKFLOW =====

# 1. Initialize a new project
mkdir my-java-app
cd my-java-app
git init
# Output: Initialized empty Git repository in /path/to/my-java-app/.git/

# 2. With initial branch name (Git 2.28+)
git init -b main
# Output: Initialized empty Git repository in ... (on branch 'main')

# 3. See what git init created
ls -la .git/
# HEAD  config  description  hooks/  info/  objects/  refs/

# 4. Create first file and commit
echo "# My Java App" > README.md
git status
# On branch main
# No commits yet
# Untracked files: README.md

git add README.md
git commit -m "Initial commit: add README"

# 5. View the first commit
git log
# commit abc123... (HEAD -> main)
# Author: Your Name <you@email.com>
# Date:   ...
# Initial commit: add README

# 6. Init in an existing directory (safe to re-run)
git init existing-project
# Reinitialized existing Git repository in .../existing-project/.git/

# 7. Bare repository (server-side)
git init --bare myproject.git
# Contains: HEAD  config  description  hooks/  info/  objects/  refs/
# No working directory — only used as a push target

# 8. Check if you are inside a git repo
git rev-parse --is-inside-work-tree
# true (inside repo) or error (outside repo)

# 9. Find the root of the repo
git rev-parse --show-toplevel`,
  codeTitle: 'git init Command and .git Directory',
  points: [
    'git init creates a .git/ directory containing the entire version history — do not manually edit files inside it',
    'Initializing in an existing directory is safe — it does not overwrite any committed history',
    'Use git init -b main (Git 2.28+) or configure init.defaultBranch globally to use "main" instead of "master"',
    'The .git/objects/ directory holds all committed content addressed by SHA-1 hashes',
    'Bare repositories (--bare) have no working tree — used as shared push targets on servers, not for development',
    'The first commit after init is on the default branch (main or master) — there are no parents yet',
    'git clone is the alternative when joining an existing project — it calls init internally and then fetches all history',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never run git init in your home directory (~) accidentally. Check pwd before running it. A git repo in your home directory would try to track everything under your home folder. If you do this by mistake, delete the .git folder: rm -rf ~/.git (with extreme care).',
    },
    {
      type: 'interview',
      content: 'Q: What is the purpose of the .git directory created by git init?\nA: It is the entire Git database. It stores all commits (in objects/), branch pointers (in refs/), the current HEAD, config settings, and hooks. Without .git, the directory is just a normal folder — deleting .git destroys all version history.',
    },
    {
      type: 'tip',
      content: 'Create a .gitignore file immediately after git init — before your first commit. Add it to .gitignore: build outputs, IDE files, secrets, node_modules, target/, .class files. This prevents accidentally committing files you never want in the repo.',
    },
  ],
}
