export default {
  id: 'adding-files-to-a-remote-repository',
  title: '176. Adding Files to a Remote Repository',
  explanation: `After creating a GitHub repository, pushing local commits to the remote makes your code available online and to collaborators.

**Push workflow:**
  1. Make changes locally
  2. git add <files>       — stage changes
  3. git commit -m "msg"  — commit snapshot
  4. git push             — upload commits to remote

**git push:**
  git push origin main           — push to remote "origin", branch "main"
  git push -u origin main        — push + set tracking (first push)
  git push                       — push to tracked remote (after -u set up)
  git push --all origin          — push all local branches

**git pull:**
  git pull origin main           — fetch + merge from remote
  git pull                       — pull tracked branch
  git pull --rebase origin main  — fetch + rebase instead of merge

**Tracking branches:**
After git push -u origin main:
  - Local "main" tracks "origin/main"
  - git push / git pull work without specifying remote/branch

**Remote branch listing:**
  git branch -r            — list remote branches
  git branch -a            — list all (local + remote)

**Fetch vs Pull:**
  git fetch origin         — download remote commits (does NOT merge)
  git merge origin/main    — merge fetched commits into local branch
  git pull                 — fetch + merge (shorthand for above two)

**Force push (dangerous):**
  git push --force-with-lease   — safer force push (checks no one pushed since your last pull)
  git push --force              — dangerous: overwrites remote history

**First-time push checklist:**
  1. git remote -v  — verify origin points to correct URL
  2. git log --oneline — confirm commits are ready
  3. git push -u origin main`,
  code: `# ===== Pushing to Remote Repository =====

# ---- Initial setup (one time) ----
# 1. Create repo on GitHub, then:
git remote add origin git@github.com:yourusername/repo.git
git branch -M main           # rename branch to main if needed
git push -u origin main      # first push + set tracking

# ---- Regular development workflow ----
# 2. Make changes
echo "new feature" >> Feature.java
git add Feature.java
git commit -m "Add new feature"
git push                     # short form after -u tracking is set

# ---- View remote status ----
# 3. Check if local is ahead/behind remote
git status
# "Your branch is ahead of 'origin/main' by 1 commit"
# "Your branch is behind 'origin/main' by 2 commits"

# 4. Fetch without merging (see what remote has)
git fetch origin
git log origin/main --oneline  # see remote commits
git diff origin/main           # see what differs

# 5. Pull (fetch + merge) remote changes
git pull origin main

# 6. Pull with rebase (cleaner history)
git pull --rebase origin main

# ---- Collaboration workflow ----
# Someone else pushed to origin/main. You have local commits too.
# Option A: merge (creates a merge commit)
git pull origin main
# Option B: rebase (replays your commits on top of theirs)
git pull --rebase origin main

# ---- List remote branches ----
git branch -r
# origin/HEAD -> origin/main
# origin/main
# origin/feature/login

# ---- Push a new local branch to remote ----
git checkout -b feature/payment
# ... make changes ...
git push -u origin feature/payment  # creates branch on remote

# ---- Delete a remote branch ----
git push origin --delete feature/old-branch`,
  codeTitle: 'Pushing and Pulling from Remote Repository',
  points: [
    'git push origin main uploads your local commits to the remote — makes them visible to collaborators',
    'git push -u origin main sets tracking so future git push/pull work without specifying remote/branch',
    'git fetch downloads remote commits without merging; git pull does fetch + merge in one step',
    'git pull --rebase is often preferred over git pull (merge) — it avoids unnecessary merge commits',
    'git status shows "ahead" (local has unpushed commits) or "behind" (remote has commits you need)',
    'Force push (--force) rewrites remote history — never do it on shared branches; prefer --force-with-lease',
    'git branch -r lists remote-tracking branches; git branch -a lists all local and remote branches',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If git push is rejected with "rejected... non-fast-forward," someone else pushed to the same branch. Run git pull first to integrate their changes, then push. Never force push to main without team agreement — it can destroy colleagues work.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git fetch and git pull?\nA: git fetch downloads remote commits into origin/main (remote-tracking branch) but does not touch your local branch. git pull does git fetch + git merge — it downloads AND integrates changes. Use git fetch first to inspect remote changes before merging.',
    },
    {
      type: 'tip',
      content: 'Use git pull --rebase instead of git pull to keep a cleaner linear history. It puts your local commits AFTER the remote commits, avoiding merge commits like "Merge branch main of github.com/..." that clutter the log.',
    },
  ],
}
