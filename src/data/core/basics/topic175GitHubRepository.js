export default {
  id: 'github-repository',
  title: '175. GitHub Repository',
  explanation: `GitHub is the most popular platform for hosting Git repositories, enabling collaboration, code review, and CI/CD integration.

**What is a GitHub repository?**
A remote copy of your local Git repository hosted on GitHub's servers. It enables:
- Sharing code with others
- Collaboration via pull requests and code review
- Issue tracking
- Automated testing and deployment (GitHub Actions)
- Documentation via README.md and GitHub Pages

**Public vs Private:**
- Public: visible to everyone on the internet
- Private: visible only to you and collaborators you invite

**Creating a repository on GitHub:**
1. Go to github.com → click "New repository"
2. Choose name, visibility (public/private)
3. Optionally: add README, .gitignore, license
4. Click "Create repository"

**Connecting local to remote:**
After creating on GitHub, push your local repo:
  git remote add origin https://github.com/user/repo.git
  git branch -M main
  git push -u origin main

**SSH vs HTTPS:**
  HTTPS: git remote add origin https://github.com/user/repo.git
  SSH: git remote add origin git@github.com:user/repo.git

SSH requires setting up SSH keys but avoids typing credentials. HTTPS uses a personal access token.

**Key GitHub concepts:**
- **Fork:** your own copy of someone else's repo — for contributing to projects you do not own
- **Pull Request (PR):** propose changes from your branch to be merged
- **Issues:** bug reports and feature requests
- **Stars:** bookmark/like a repository
- **README.md:** the home page of a repository — written in Markdown`,
  code: `# ===== GitHub Repository Setup =====

# 1. Create repo on GitHub (via web UI or GitHub CLI)
gh repo create my-java-app --public --description "Java learning project"
# Creates a repo and clones it locally

# 2. Connect existing local repo to GitHub
git remote add origin git@github.com:yourusername/my-java-app.git
# OR with HTTPS:
# git remote add origin https://github.com/yourusername/my-java-app.git

# 3. Verify remotes
git remote -v
# origin  git@github.com:yourusername/my-java-app.git (fetch)
# origin  git@github.com:yourusername/my-java-app.git (push)

# 4. Push local commits to GitHub
git push -u origin main
# -u sets "origin main" as the upstream tracking branch
# Future: just "git push" works

# 5. View repository info via GitHub CLI
gh repo view

# 6. Create README.md (the repo home page)
cat > README.md << 'EOF'
# My Java App

A Java project for learning core concepts.

## Setup
1. Install JDK 17+
2. Run: javac Main.java && java Main
EOF
git add README.md
git commit -m "Add README"
git push

# 7. Set up .gitignore for Java
cat > .gitignore << 'EOF'
target/
*.class
*.jar
.idea/
*.iml
.DS_Store
EOF
git add .gitignore
git commit -m "Add .gitignore for Java project"
git push

# 8. Common repo management
gh repo clone yourusername/my-java-app  # clone your repo
gh issue create --title "Fix login bug" --body "Details..."
gh pr create --title "Add feature" --body "Description"

# 9. SSH key setup (one-time)
ssh-keygen -t ed25519 -C "your@email.com"
# Add ~/.ssh/id_ed25519.pub to GitHub Settings → SSH keys
ssh -T git@github.com  # test connection`,
  codeTitle: 'GitHub Repository Setup',
  points: [
    'GitHub hosts remote Git repositories — push your local commits there to share and back up code',
    'git remote add origin <url> connects your local repo to a GitHub remote called "origin"',
    'git push -u origin main pushes and sets origin/main as the tracking branch — future git push works without arguments',
    'SSH authentication uses key pairs (no password prompts); HTTPS uses personal access tokens',
    'Public repos are visible to everyone; private repos require explicit collaborator invitations',
    'README.md is the home page of your repo — write it in Markdown; it is auto-rendered by GitHub',
    'GitHub CLI (gh) lets you create repos, PRs, and issues from the terminal without the web UI',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never commit sensitive data (API keys, passwords, private keys) to a public GitHub repository. Even if you delete it in the next commit, the secret is still in the history and GitHub has likely already indexed it. Rotate any exposed secrets immediately.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git remote add and git clone?\nA: git clone copies an entire existing repository (all history) from a URL to your machine and automatically sets up the "origin" remote. git remote add only registers a URL under a name in your config — it does not download anything. Use clone for new projects, remote add when connecting an existing local repo to GitHub.',
    },
    {
      type: 'tip',
      content: 'Use SSH for GitHub authentication — no password prompts and more secure than HTTPS with tokens. Generate a key with ssh-keygen -t ed25519, add the public key to GitHub Settings → SSH Keys, then test with ssh -T git@github.com.',
    },
  ],
}
