export default {
  id: 'git-rebase',
  title: '184. Git Rebase',
  explanation: `git rebase replays your commits on top of another branch, creating a linear history without merge commits.

**What rebase does:**
  Before:   main: A → B → C
            feature: A → B → D → E

  After rebase of feature onto main:
            main: A → B → C
            feature: A → B → C → D' → E'
  (D and E are re-applied on top of C, getting new SHA-1 hashes)

**Command:**
  git checkout feature/login
  git rebase main              — rebase feature onto main
  OR
  git rebase main feature/login — same, without checkout

**Interactive rebase:**
  git rebase -i HEAD~3         — interactively edit last 3 commits
Options per commit: pick, reword, edit, squash, fixup, drop

**Rebase vs Merge:**
Merge:
- Preserves complete history including parallel development
- Creates merge commits
- Non-destructive — original commits unchanged

Rebase:
- Creates linear history (cleaner logs)
- Rewrites commit SHAs (destructive for shared history)
- No merge commits

**Golden Rule of Rebasing:**
Never rebase commits that have been pushed to a shared remote branch. Rebasing rewrites SHA-1 hashes — other developers who based work on the old hashes will have diverging history.

**git pull --rebase:**
  git pull --rebase origin main
Fetches remote changes then rebases your local commits on top (instead of creating a merge commit).

**Continue/abort rebase:**
  git rebase --continue   — after resolving a conflict
  git rebase --abort      — cancel and restore original state`,
  code: `# ===== git rebase EXAMPLES =====

# Setup: main has moved ahead while you worked on a feature
# main:    A → B → C → D
# feature: A → B → E → F (diverged at B)

# 1. Rebase feature onto main
git checkout feature/login
git rebase main
# Replays E, F on top of D
# feature becomes: A → B → C → D → E' → F'
# E' and F' are NEW commits with different SHA-1s

git log --oneline --graph
# * f3e2d1 (HEAD -> feature/login) F' — Second feature commit
# * d4f83d E' — First feature commit
# * abc123 (main) D — Latest main commit

# 2. Now merge into main (fast-forward possible!)
git checkout main
git merge feature/login
# Fast-forward — clean linear history, no merge commit!

# 3. Interactive rebase — clean up last 3 commits before PR
git rebase -i HEAD~3
# Opens editor showing:
# pick d4f83d Add feature skeleton
# pick abc123 WIP checkpoint
# pick e5f6a7 Fix typo

# Change to:
# pick d4f83d Add feature skeleton
# squash abc123 WIP checkpoint    ← squash into previous
# reword e5f6a7 Fix typo          ← change commit message

# 4. git pull with rebase (avoids merge commits on pull)
git pull --rebase origin main
# Fetches remote main, then rebases your local commits on top

# Set as default:
git config --global pull.rebase true

# 5. Rebase conflict resolution
git rebase main
# CONFLICT in LoginService.java
# Fix the file...
git add LoginService.java
git rebase --continue  # continue applying remaining commits

# OR abort (go back to pre-rebase state)
git rebase --abort

# 6. Push after rebase (force needed — SHA changed)
git rebase main
git push --force-with-lease origin feature/login
# --force-with-lease is safer than --force

# 7. Interactive rebase use cases:
# git rebase -i HEAD~5
# - pick: keep as-is
# - reword: change commit message
# - squash: merge into previous commit (combine message)
# - fixup: merge into previous (discard message)
# - drop: delete commit entirely
# - edit: pause to amend this commit`,
  codeTitle: 'git rebase — Linear History',
  points: [
    'git rebase replays your commits on top of another branch — creates linear history without merge commits',
    'Rebasing rewrites SHA-1 hashes of rebased commits — they become new commit objects (D becomes D\')',
    'Never rebase commits already pushed to a shared remote branch — it rewrites history others depend on',
    'Interactive rebase (git rebase -i HEAD~N) lets you squash, reword, reorder, or drop commits',
    'git pull --rebase avoids merge commits on pull — your local commits are replayed after remote changes',
    'Resolve rebase conflicts with git add then git rebase --continue; abort with git rebase --abort',
    'After rebasing, force push is needed: git push --force-with-lease (safer than --force)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you rebase a branch that colleagues are also working on, their git pull will fail with "diverged histories" — they will have to do a forced reset or refetch. The golden rule: only rebase branches that are local-only or that you own exclusively.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use git rebase instead of git merge?\nA: Use rebase to keep a clean linear history — especially for feature branches before merging a PR. Use merge to preserve the full history of parallel development. Rebase is preferred in teams that value clean logs; merge is safer for teams that need exact historical fidelity.',
    },
    {
      type: 'tip',
      content: 'Use interactive rebase (git rebase -i) before submitting a PR to clean up your commits — squash WIP commits, fix typos in messages, reorder logically. This makes the reviewer see a clean, intentional set of changes rather than your development process.',
    },
  ],
}
