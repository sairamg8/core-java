export default {
  id: 'git-version-control',
  title: '167. Git Version Control',
  explanation: `Git is a distributed version control system (VCS) that tracks changes in source code and enables collaboration among multiple developers.

**What is Version Control?**
Version control records every change made to files over time. You can:
- Go back to any previous version
- See who changed what and when
- Work on multiple features simultaneously
- Merge contributions from multiple developers

**Git vs other VCS:**
- CVS, SVN (Subversion): centralized — one server, everyone depends on it
- Git: distributed — every developer has a full copy of the entire history locally

**Key Git concepts:**
- **Repository (repo):** the project directory containing all files and the .git history folder
- **Commit:** a snapshot of all tracked files at a point in time
- **Branch:** a parallel line of development
- **Remote:** a copy of the repo on a server (like GitHub, GitLab, Bitbucket)
- **Working tree:** your current local files
- **Staging area (index):** changes marked to be included in the next commit

**Why Git?**
- Industry standard — nearly all software projects use Git
- Fast — local operations need no network
- Reliable — cryptographic checksums ensure data integrity
- Flexible — supports any workflow (trunk-based, Gitflow, forking)

**Git vs GitHub:**
Git is the tool. GitHub is a hosting platform for Git repositories. GitLab and Bitbucket are alternatives.

**File states in Git:**
  Untracked → Staged → Committed → Modified → Staged → Committed...`,
  code: `# Key Git concepts illustrated as commands

# 1. Check git version
git --version

# 2. Initialize a new repo
git init myproject
cd myproject

# 3. Stage and commit — the core cycle
echo "Hello Git" > readme.txt
git add readme.txt           # stage the file
git commit -m "Add readme"   # commit snapshot

# 4. Check status and history
git status                   # see what is tracked/untracked/staged
git log                      # full commit history
git log --oneline            # compact one-line format

# 5. Branching
git branch feature/login     # create branch
git checkout feature/login   # switch to branch
git checkout -b feature/cart # create AND switch in one command

# 6. Remote workflow
git remote add origin git@github.com:user/repo.git
git push -u origin main      # push to remote
git pull origin main         # fetch + merge from remote
git clone git@github.com:user/repo.git  # copy a repo

# 7. See what changed
git diff                     # unstaged changes
git diff --staged            # staged changes

# 8. The three "areas" of Git
# Working tree (your files)
#     |  git add
#     v
# Staging area (index)
#     |  git commit
#     v
# Repository (.git/objects)`,
  codeTitle: 'Git Core Commands Overview',
  points: [
    'Git is a distributed version control system — every developer has the complete project history locally',
    'Core Git workflow: modify files → git add (stage) → git commit (snapshot) → git push (share)',
    'A commit is an immutable snapshot of all tracked files — identified by a SHA-1 hash',
    'Branches are lightweight pointers to commits — switching branches changes your working files',
    'Git separates the working tree (files), staging area (what will be committed), and repository history',
    'Git is not GitHub — Git is the tool, GitHub is a cloud hosting platform for Git repos',
    'Every Git operation is local except push, pull, fetch, and clone — no network required for history browsing',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never run git in your home directory (~) unless you want to track your entire home folder. Always cd into a project directory first, or pass the path: git init /path/to/project. Check git status to confirm you are in the right repo.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Git and GitHub?\nA: Git is the version control tool — a program that tracks file changes and manages history locally. GitHub is a cloud service that hosts Git repositories and adds collaboration features (pull requests, issues, CI/CD, etc.). You can use Git without GitHub.',
    },
    {
      type: 'tip',
      content: 'Run git status frequently — it shows exactly where you are (branch, staged changes, untracked files). When in doubt about your state, git status is the first command to run. It is non-destructive and always safe.',
    },
  ],
}
