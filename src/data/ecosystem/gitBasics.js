export default {
  id: 'git-basics',
  title: '1. Git Basics — Setup, Stage & Commit',
  explanation: `**Git** is a distributed version control system. Every developer has a full copy of the repository (including history) — there is no single server that must stay online.

**Core concepts:**
- **Working directory** — files you see and edit on disk
- **Staging area (index)** — files you have marked for the next commit (\`git add\`)
- **Repository (.git)** — the database of all commits and history

**Three-stage workflow:**
\`\`\`
[Working Dir] --git add--> [Staging Area] --git commit--> [Repository]
\`\`\`

**Essential config (do this once after install):**
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.editor "code --wait"  # use VS Code as editor
\`\`\``,
  code: `# Initialize a new repo
git init my-project
cd my-project

# Check what's changed at any time
git status

# Stage files
git add README.md          # stage one file
git add src/               # stage an entire directory
git add .                  # stage everything in current directory

# Commit staged changes
git commit -m "Initial commit: add README and src"

# See the commit log
git log                    # full history
git log --oneline          # one line per commit (compact)
git log --oneline --graph  # show branch topology

# Inspect differences
git diff                   # unstaged changes vs last commit
git diff --staged          # staged changes vs last commit
git show HEAD              # show the most recent commit

# Undo a staged file (unstage without losing changes)
git restore --staged README.md

# Discard local changes in working directory (irreversible!)
git restore README.md`,
  points: [
    'git status is your best friend — run it constantly to see what is staged, unstaged, and untracked',
    'git add -p lets you stage specific hunks (parts of a file) — useful for splitting unrelated changes into separate commits',
    'Commit messages should describe WHY the change was made, not WHAT (the diff already shows what)',
    'git log --oneline --graph --all shows the full branch picture in the terminal',
    'git restore --staged is the modern replacement for git reset HEAD <file>',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between git add and git commit?\nA: git add moves changes from the working directory into the staging area (it "proposes" what will go into the next commit). git commit takes everything in the staging area and permanently records it in the repository history. You must stage before you can commit.',
    },
    {
      type: 'gotcha',
      content: 'git restore <file> (without --staged) PERMANENTLY discards your working directory changes — it cannot be undone. There is no recycle bin. Always check git status before running restore on untracked or modified files.',
    },
  ],
}
