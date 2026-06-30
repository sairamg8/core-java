export default {
  id: 'pushing-a-git-branch-to-a-remote-repository',
  title: '181. Pushing a Git Branch to a Remote Repository',
  explanation: `Pushing a branch to a remote makes it available to collaborators and is the first step in creating a pull request.

**Push a new branch to remote:**
  git push -u origin feature/login    — push + set tracking
  git push --set-upstream origin feature/login  — verbose form

**The -u flag (--set-upstream):**
Sets the remote branch as the "upstream" for your local branch. After this:
  git push    — just works (no need to specify origin feature/login)
  git pull    — fetches and merges from origin/feature/login

**Push workflow:**
  1. git checkout -b feature/login    — create local branch
  2. ... make commits ...
  3. git push -u origin feature/login  — first push (creates remote branch)
  4. ... more commits ...
  5. git push                           — subsequent pushes (simple)

**Verify tracking:**
  git branch -vv
  # * feature/login  abc123 [origin/feature/login] Add login page

**Push and track an existing remote branch:**
  git checkout -b feature/login origin/feature/login
This creates a local branch already tracking the remote one.

**Rename a remote branch:**
  git push origin origin/old:new    — create new, then delete old
  git push origin --delete old

**Force push (use with care):**
  git push --force-with-lease     — safe force: checks no one pushed since your last pull
  git push --force                — unsafe: overwrites without checking

**Push all branches:**
  git push --all origin           — push every local branch`,
  code: `# ===== Pushing a Branch to Remote =====

# 1. Create and switch to a feature branch
git checkout -b feature/login
# Now on: feature/login

# 2. Make commits
echo "public class LoginController { }" > LoginController.java
git add LoginController.java
git commit -m "Add LoginController"

echo "public class LoginService { }" > LoginService.java
git add LoginService.java
git commit -m "Add LoginService"

# 3. First push — creates branch on remote + sets tracking
git push -u origin feature/login
# Branch "origin/feature/login" created on GitHub
# Local feature/login now tracks origin/feature/login
# Output: Branch "feature/login" set up to track remote branch "feature/login" from "origin"

# 4. Check tracking relationship
git branch -vv
# * feature/login  d4f83d5 [origin/feature/login] Add LoginService

# 5. After tracking is set, push simply
echo "// more code" >> LoginController.java
git add LoginController.java
git commit -m "Enhance LoginController"
git push    # no need for "origin feature/login" anymore

# 6. Check remote branch exists
git branch -r
# remotes/origin/feature/login
# remotes/origin/main

# 7. Pull new commits from origin (collaborator pushed)
git pull    # uses tracking: pulls from origin/feature/login

# 8. Push with force-with-lease (safer than --force)
# Use when you rebased your local branch
git rebase main
git push --force-with-lease    # checks remote has not been updated since your last pull

# 9. View all remote branches on GitHub
git ls-remote origin
# Lists all branches and tags on remote with their SHA-1

# 10. Create a pull request after pushing
gh pr create --base main --head feature/login --title "Add login feature" --body "Adds JWT login"`,
  codeTitle: 'Pushing a Feature Branch to Remote',
  points: [
    'git push -u origin feature/login creates the remote branch and sets up tracking — subsequent git push works without arguments',
    '-u is --set-upstream: establishes which remote branch your local branch tracks for push and pull',
    'git branch -vv shows tracking relationships — [origin/main] or [origin/feature/login ahead 2]',
    'After tracking is set, git push and git pull automatically use the tracked remote branch',
    'Use --force-with-lease instead of --force when you need to overwrite — it fails if someone else pushed since your last pull',
    'git push --all origin pushes every local branch to the remote — useful for initial repo setup',
    'Always push before creating a PR — the PR is created from the remote branch, not your local one',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting -u on the first push means tracking is not set. git push will fail with: "The current branch has no upstream branch." Fix it with git push -u origin <branch> or git branch --set-upstream-to=origin/<branch>.',
    },
    {
      type: 'interview',
      content: 'Q: What does git push -u origin main mean?\nA: It pushes your local "main" branch to the remote "origin" and sets origin/main as the upstream tracking branch. After this, git push and git pull know to use origin/main without you specifying it each time.',
    },
    {
      type: 'tip',
      content: 'After pushing a feature branch, immediately create a pull request on GitHub (even as a draft PR) to get early feedback. A draft PR signals "work in progress" and lets reviewers see your approach before you finish.',
    },
  ],
}
