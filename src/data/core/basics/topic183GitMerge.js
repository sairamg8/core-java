export default {
  id: 'git-merge',
  title: '183. Git Merge',
  explanation: `git merge integrates changes from one branch into another. Understanding merge types helps you choose the cleanest strategy for your workflow.

**Basic merge:**
  git checkout main        — switch to target branch
  git merge feature/login  — merge feature into main

**Merge types:**

**1. Fast-forward merge:**
When feature is a direct descendant of main (no divergence), Git just advances the main pointer:
  main: A → B
  feature: A → B → C → D
  After merge: main: A → B → C → D   (no merge commit)

**2. Three-way merge (merge commit):**
When both branches have diverged from a common ancestor, Git creates a merge commit with two parents:
  main: A → B → C
  feature: A → B → D
  After merge: A → B → C → M (M has parents C and D)

**Flags:**
  --no-ff   — force a merge commit even for fast-forwards (preserves branch history)
  --ff-only — fail if a fast-forward is not possible (only allows clean fast-forwards)
  --squash  — squash all feature commits into one staged change, you commit manually

**--no-ff usage:**
  git merge --no-ff feature/login
Creates a merge commit always — clear record that a feature was developed on a separate branch.

**Aborting a merge:**
  git merge --abort    — cancel mid-merge (restore pre-merge state)

**After merge:**
  git branch -d feature/login   — delete the merged branch
  git push origin main          — push merged result

**Merge vs Rebase:**
Merge: preserves history of parallel work (merge commits)
Rebase: rewrites history to appear linear (no merge commits)`,
  code: `# ===== git merge EXAMPLES =====

# 1. Fast-forward merge (no divergence)
git checkout main
git merge feature/quick-fix
# Fast-forward
# file.txt | 1 +
# main pointer moved to feature tip — no merge commit

# 2. Three-way merge (diverged branches)
# main: A → B → C
# feature: A → B → D → E
git checkout main
git merge feature/login
# Merge made by the "ort" strategy.
# Creates a merge commit M with parents C and E

git log --oneline --graph
# *   f3e2d1 (HEAD -> main) Merge branch "feature/login"
# |\\
# | * d4f83d (feature/login) Add LoginService
# | * abc123 Add LoginController
# * | e5f6a7 Update config on main
# |/
# * 123abc Common ancestor

# 3. Force a merge commit even for fast-forwards
git merge --no-ff feature/login -m "Merge feature/login into main"
# Creates merge commit even if fast-forward was possible
# Preserves branch history in the graph

# 4. Squash merge — combine all feature commits into one
git checkout main
git merge --squash feature/big-feature
# All changes are staged but NOT committed
git commit -m "Add big feature (squashed)"
# Clean history — feature commits are not visible in main log

# 5. Fast-forward only (fail if not possible)
git merge --ff-only feature/hotfix
# Only succeeds if merge would be a fast-forward
# Protects against accidental merge commits

# 6. Abort a merge in progress
git merge feature/login
# CONFLICT — merge paused
git merge --abort
# Back to pre-merge state

# 7. Merge remote branch into current
git fetch origin
git merge origin/main  # merge remote main into local feature branch

# 8. See what would be merged (without doing it)
git diff main...feature/login
# Shows changes unique to feature/login not yet in main`,
  codeTitle: 'git merge — Integrating Branches',
  points: [
    'git merge feature → main integrates feature changes into main — switch to target branch first',
    'Fast-forward merge: no divergence → just moves the pointer, no new commit created',
    'Three-way merge: both branches diverged → creates a merge commit with two parents',
    '--no-ff forces a merge commit always — preserves the record that work was done on a feature branch',
    '--squash combines all feature commits into one staged change — clean history, no merge commit',
    '--ff-only fails if a fast-forward is not possible — ensures no accidental merge commits',
    'git merge --abort cancels an in-progress merge and restores the pre-merge state',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you run git merge and there are conflicts, Git pauses and requires manual resolution. Do NOT run git merge again or git commit until all conflicts are resolved. Use git status to see which files have conflicts, resolve them, then git add and git commit.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between git merge --no-ff and a regular merge?\nA: A regular merge fast-forwards when possible (no merge commit). --no-ff always creates a merge commit, even if fast-forward was possible. --no-ff preserves the full branch topology in history — useful when you want to see which commits were part of a feature branch.',
    },
    {
      type: 'tip',
      content: 'Prefer --no-ff or --squash for merging feature branches into main — both preserve the intention of "this was a feature." Use fast-forward only for trivial one-liner fixes. Many teams configure their PR merge buttons to squash or no-ff by default.',
    },
  ],
}
