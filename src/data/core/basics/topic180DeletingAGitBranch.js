export default {
  id: 'deleting-a-git-branch',
  title: '180. Deleting a Git Branch',
  explanation: `Once a feature branch is merged, deleting it keeps the repository clean. Git protects against accidentally deleting unmerged work.

**Delete a local branch:**
  git branch -d feature/login    — safe delete (only if merged)
  git branch -D feature/login    — force delete (even if not merged)

**Delete a remote branch:**
  git push origin --delete feature/login
  git push origin :feature/login  — old syntax (colon prefix)

**Safety of -d:**
-d checks if the branch is fully merged into HEAD (or its upstream). If not, Git refuses with: "error: The branch 'feature/login' is not fully merged."
Use -D only when you are certain you do not need the unmerged work.

**After merge — typical cleanup:**
  git checkout main
  git merge feature/login
  git branch -d feature/login     — now safe since it is merged
  git push origin --delete feature/login  — clean up remote too

**GitHub auto-delete:**
GitHub has a setting "Automatically delete head branches" — deletes the branch after a PR is merged. This is a good practice.

**Recover a deleted branch:**
If you accidentally delete a branch, find the SHA-1 using:
  git reflog                      — lists recent HEAD positions
  git branch feature/login <hash> — restore it

**View merged branches (safe to delete):**
  git branch --merged     — branches merged into current branch
  git branch --no-merged  — branches NOT yet merged (do not delete)

**Remote branch cleanup:**
If remote branches were deleted on GitHub but still appear locally:
  git fetch --prune           — removes stale remote-tracking refs`,
  code: `# ===== Deleting Git Branches =====

# 1. Safe delete (only if merged)
git branch -d feature/login
# Deletes if fully merged into HEAD
# Error if not: "branch is not fully merged"

# 2. Force delete (even if not merged)
git branch -D feature/abandoned
# Use with caution — may lose unmerged work

# 3. Delete remote branch
git push origin --delete feature/login
# Removes from GitHub/remote

# Old syntax (same effect):
git push origin :feature/login

# 4. Full cleanup after merge
git checkout main
git pull origin main           # ensure main is up to date
git merge feature/login
git branch -d feature/login    # delete local
git push origin --delete feature/login  # delete remote

# 5. See which branches are safe to delete
git branch --merged
# * main
#   feature/login   ← safe to delete (merged)
#   feature/done    ← safe to delete (merged)

git branch --no-merged
#   feature/wip     ← NOT safe to delete (unmerged work)

# 6. Recover an accidentally deleted branch
git reflog
# d4f83d5 HEAD@{0}: checkout: moving from feature/login to main
# abc1234 HEAD@{1}: commit: Add LoginService (this was on feature/login)

git branch feature/login d4f83d5  # restore using the hash

# 7. Prune stale remote-tracking refs
git fetch --prune
# Removes: remotes/origin/feature/old-branch (deleted on remote)

# Automatic prune on all fetches:
git config --global fetch.prune true

# 8. List and delete all merged branches (cleanup script)
# git branch --merged main | grep -v "^* main" | xargs git branch -d

# 9. Delete multiple branches
git branch -d feature/a feature/b feature/c`,
  codeTitle: 'Deleting Local and Remote Git Branches',
  points: [
    'git branch -d deletes a merged branch safely; git branch -D force-deletes regardless of merge status',
    'git push origin --delete <branch> removes the branch from the remote repository',
    'git branch --merged lists branches already merged — safe to delete; --no-merged shows unmerged work',
    'After merging a PR, delete both local and remote branches to keep the repo clean',
    'Deleted branches are recoverable with git reflog — find the last SHA-1 and recreate the branch',
    'git fetch --prune removes local remote-tracking refs for branches deleted on the remote',
    'GitHub "Automatically delete head branches" setting deletes branches after PR merge — enable this for clean repos',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git branch -D (force delete) permanently removes the local branch reference. If there are unmerged commits on it, they will become unreachable after git gc runs. Use git reflog immediately if you delete the wrong branch — the commits are still in the object store for a while.',
    },
    {
      type: 'interview',
      content: 'Q: How do you delete a remote branch in Git?\nA: git push origin --delete branchname. The older syntax is git push origin :branchname (colon prefix). After deleting on remote, run git fetch --prune locally to remove the stale remote-tracking ref from your local list.',
    },
    {
      type: 'tip',
      content: 'Enable fetch.prune globally: git config --global fetch.prune true. This automatically cleans up stale remote-tracking references every time you fetch, keeping git branch -r clean without manual pruning.',
    },
  ],
}
