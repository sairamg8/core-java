export default {
  id: 'git-stash',
  title: '187. Git Stash',
  explanation: `git stash temporarily saves your uncommitted changes so you can switch branches or pull without losing work in progress.

**Basic stash:**
  git stash             — saves all staged + unstaged changes, restores clean working tree
  git stash push -m "WIP: login form"  — named stash

**Apply stash:**
  git stash pop         — apply most recent stash + delete it from stash list
  git stash apply       — apply most recent stash + keep it in list
  git stash apply stash@{2}  — apply specific stash

**List stashes:**
  git stash list
  # stash@{0}: WIP on main: abc123 Latest commit
  # stash@{1}: WIP on feature: def456 Another commit

**Show stash contents:**
  git stash show        — summary of stash@{0}
  git stash show -p     — full diff of stash@{0}

**Drop a stash:**
  git stash drop        — delete most recent stash
  git stash drop stash@{2}  — delete specific stash
  git stash clear       — delete ALL stashes

**Stash untracked files:**
  git stash -u          — include untracked (new) files
  git stash -a          — include untracked + ignored files

**Common workflow:**
  1. Working on feature, urgent hotfix arrives
  2. git stash           — save WIP
  3. git checkout main   — switch to main
  4. Fix the bug, commit, push
  5. git checkout feature/login
  6. git stash pop       — restore WIP

**Stash to a branch:**
  git stash branch new-branch stash@{0}
Creates a new branch from the stash base commit and applies the stash.`,
  code: `# ===== git stash EXAMPLES =====

# 1. Save current work in progress
echo "// half-done feature" >> LoginService.java
git stash
# Saved working directory and index state WIP on main: abc123 ...
# Working tree is now clean

# 2. Named stash (descriptive)
git stash push -m "WIP: adding JWT validation"
# stash@{0}: On feature/login: WIP: adding JWT validation

# 3. List stashes
git stash list
# stash@{0}: On feature/login: WIP: adding JWT validation
# stash@{1}: WIP on main: abc123 Previous stash

# 4. See stash contents
git stash show            # summary
git stash show -p         # full diff
git stash show stash@{1}  # specific stash

# 5. Apply and remove (pop)
git stash pop
# Applied: stash@{0} WIP: adding JWT validation
# Dropped stash@{0}

# 6. Apply but keep in stash list
git stash apply stash@{1}
# Stash@{1} is still in the list

# 7. Include untracked files in stash
echo "new file" > NewService.java  # untracked
git stash -u                       # stash including untracked
# NewService.java is now stashed too

# 8. Drop specific stash
git stash drop stash@{1}

# 9. Clear all stashes
git stash clear

# 10. Stash to a new branch
git stash branch feature/stashed-work stash@{0}
# Creates branch at the commit where stash was made
# Applies stash there — clean, no conflicts

# 11. Conflict when popping stash
git stash pop
# CONFLICT — stash changes conflict with current state
# Resolve conflicts, git add, then commit
# The stash is NOT dropped on conflict — still in list`,
  codeTitle: 'git stash — Saving Work in Progress',
  points: [
    'git stash saves staged and unstaged changes and restores a clean working tree — work is preserved',
    'git stash pop applies the most recent stash and removes it; git stash apply keeps it in the list',
    'git stash list shows all stashed entries; git stash show -p shows the full diff of a stash',
    'Use -m for named stashes: git stash push -m "WIP: feature description" — critical for multiple stashes',
    'git stash -u includes untracked (new) files; git stash -a includes untracked and gitignored files',
    'git stash branch <name> creates a new branch from the stash origin and applies the stash — avoids conflicts',
    'If stash pop creates conflicts, resolve them and commit; the stash entry is NOT auto-dropped on conflict',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Stashes are local — they are NOT pushed to the remote. If you lose your local machine or delete the repo, all stashes are lost. For long-term WIP storage, commit to a draft branch instead: git checkout -b wip/feature && git commit -am "WIP".',
    },
    {
      type: 'interview',
      content: 'Q: When would you use git stash instead of just committing your work in progress?\nA: Use git stash for truly temporary interruptions — you need to switch context quickly and will return soon. Prefer committing (even with a "WIP" message) for anything you might work on across multiple sessions, since stashes are local and not pushed.',
    },
    {
      type: 'tip',
      content: 'Always name your stashes with git stash push -m "description". Anonymous stashes become confusing when you have multiple. git stash list for unnamed ones reads like "WIP on main: abc123 Some commit message" — hard to tell what was actually stashed.',
    },
  ],
}
