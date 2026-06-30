export default {
  id: 'git-setup',
  title: '169. Git Setup',
  explanation: `Before using Git, configure your identity. Every commit records your name and email — this is how code authorship is tracked.

**Install Git:**
- Windows: https://git-scm.com/download/win (Git Bash included)
- macOS: xcode-select --install or brew install git
- Ubuntu/Debian: sudo apt install git
- Fedora/RHEL: sudo dnf install git

**Verify installation:**
  git --version

**Global configuration (applies to all repos):**
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"

**Local configuration (this repo only):**
  git config user.name "Work Name"
  git config user.email "work@company.com"
  (No --global flag — stored in .git/config)

**Config priority:**
  local > global > system
  (local repo config overrides global)

**Other useful global settings:**
  git config --global core.editor "code --wait"   # VS Code as editor
  git config --global core.editor "vim"           # Vim
  git config --global init.defaultBranch main     # default branch name
  git config --global core.autocrlf true          # Windows: auto-fix line endings
  git config --global core.autocrlf input         # Mac/Linux

**View your configuration:**
  git config --list                    # all settings
  git config --global --list           # global only
  git config user.name                 # single value

**Config file locations:**
  ~/.gitconfig          — global config
  .git/config           — local (per-repo) config
  /etc/gitconfig        — system-wide config`,
  code: `# ===== INITIAL GIT SETUP =====

# 1. Check if git is installed
git --version
# git version 2.43.0

# 2. Set global identity (REQUIRED for commits)
git config --global user.name "Sairam Gudiputi"
git config --global user.email "sairam@example.com"

# 3. Set default editor (optional — affects commit messages, rebase)
git config --global core.editor "code --wait"   # VS Code
# git config --global core.editor "vim"         # Vim
# git config --global core.editor "nano"        # Nano (beginner-friendly)

# 4. Set default branch name (modern standard is 'main')
git config --global init.defaultBranch main

# 5. Line ending configuration
# Windows — auto-convert LF to CRLF on checkout, back to LF on commit
git config --global core.autocrlf true
# Mac/Linux — convert CRLF to LF on commit (no auto-convert on checkout)
# git config --global core.autocrlf input

# 6. View all settings
git config --list

# 7. View where each setting comes from
git config --list --show-origin

# 8. Set local config (project-specific, overrides global)
# Run this INSIDE a project directory — no --global flag
git config user.email "work@company.com"

# 9. View the config file directly
# ~/.gitconfig (on Mac/Linux)
# C:\\Users\\YourName\\.gitconfig (on Windows)

# 10. Useful aliases (optional but popular)
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"`,
  codeTitle: 'Git Initial Setup Commands',
  points: [
    'Set user.name and user.email before your first commit — they are embedded in every commit permanently',
    'global config (--global) applies to all repos on your machine; local config applies only to the current repo',
    'Config priority: local .git/config > ~/.gitconfig (global) > /etc/gitconfig (system)',
    'core.editor controls which editor opens for commit messages and interactive rebase',
    'init.defaultBranch main makes new repos start with "main" instead of "master"',
    'core.autocrlf controls line ending conversion — set to "true" on Windows, "input" on Mac/Linux',
    'git config --list --show-origin shows each setting AND which file it came from',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you forget to set your identity, git uses a default name (hostname) that looks unprofessional in commits and GitHub blame views. Always configure user.name and user.email before your first commit on any new machine.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git config --global and git config (local)?\nA: --global sets the value in ~/.gitconfig and applies to all repositories. Without --global, the value is set in .git/config inside the current repo — it overrides the global setting for that repo only. Useful when using different emails for work and personal projects.',
    },
    {
      type: 'tip',
      content: 'Set up a .gitignore_global in your home directory for files you always want to ignore regardless of project (like .DS_Store on Mac, Thumbs.db on Windows, IDE files): git config --global core.excludesfile ~/.gitignore_global',
    },
  ],
}
