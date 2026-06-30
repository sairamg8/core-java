export default {
  id: 'git-tag',
  title: '177. Git Tag',
  explanation: `Tags are named pointers to specific commits — typically used to mark release versions like v1.0, v2.3.1.

**Two types of tags:**

**Lightweight tag:**
  git tag v1.0
Just a pointer to a commit — no message, no author, no date. Like a branch that does not move.

**Annotated tag (recommended):**
  git tag -a v1.0 -m "Release version 1.0"
Stores: tag message, tagger name, email, date. A full Git object. Preferred for releases.

**Tagging a specific commit:**
  git tag -a v1.0 <commit-hash> -m "Release 1.0"

**Listing tags:**
  git tag                   — list all tags
  git tag -l "v1.*"         — list matching pattern
  git show v1.0             — show tag details

**Pushing tags to remote:**
Tags are NOT pushed automatically with git push:
  git push origin v1.0       — push one tag
  git push origin --tags     — push all tags

**Deleting tags:**
  git tag -d v1.0            — delete local tag
  git push origin --delete v1.0  — delete from remote

**Checking out a tag:**
  git checkout v1.0
This puts you in "detached HEAD" state — you can explore but should not commit here. To work from a tag:
  git checkout -b hotfix-1.0 v1.0  — create branch from tag

**Semantic Versioning (SemVer):**
v MAJOR.MINOR.PATCH
- MAJOR: breaking changes
- MINOR: new features (backward-compatible)
- PATCH: bug fixes`,
  code: `# ===== Git Tags =====

# 1. Create a lightweight tag at HEAD
git tag v1.0
# Simple pointer — no extra metadata

# 2. Create an annotated tag (recommended for releases)
git tag -a v1.0.0 -m "Release version 1.0.0 — initial stable release"

# 3. List all tags
git tag
# v0.9.0-beta
# v1.0.0

git tag -l "v1.*"
# v1.0.0
# v1.1.0

# 4. Show tag details
git show v1.0.0
# tag v1.0.0
# Tagger: Your Name <you@email.com>
# Date:   Mon Jun 30 10:00:00 2025
# Release version 1.0.0 — initial stable release
# ... + commit diff

# 5. Tag a specific past commit
git log --oneline
# d4f83d5 Final fix before release
# a3b2c1 Add feature X

git tag -a v1.0.0 d4f83d5 -m "Tagging commit d4f83d5 as v1.0.0"

# 6. Push tags to remote (tags do NOT push automatically)
git push origin v1.0.0
# Push one specific tag

git push origin --tags
# Push ALL local tags to remote

# 7. Delete a tag
git tag -d v0.9.0-beta         # delete locally
git push origin --delete v0.9.0-beta  # delete from remote

# 8. Checkout a tag (read-only — detached HEAD)
git checkout v1.0.0
# HEAD is now at d4f83d5...
# You are in detached HEAD state

# 9. Create branch from a tag (to make fixes on old release)
git checkout -b hotfix/v1.0.1 v1.0.0
# Now on branch hotfix/v1.0.1 — can commit here

# 10. Compare tags
git diff v1.0.0 v1.1.0
# Show all changes between two releases

git log v1.0.0..v1.1.0 --oneline
# Show commits between v1.0.0 and v1.1.0`,
  codeTitle: 'Git Tags for Version Marking',
  points: [
    'Lightweight tags are simple commit pointers — no metadata. Annotated tags (-a) include message, author, and date',
    'Annotated tags are the standard for marking releases — use lightweight tags only for temporary personal markers',
    'git push does NOT push tags — use git push origin --tags or git push origin v1.0 explicitly',
    'git tag -d deletes a local tag; git push origin --delete <tag> deletes from remote',
    'Checking out a tag puts you in "detached HEAD" — create a branch with -b to make commits',
    'Use Semantic Versioning (MAJOR.MINOR.PATCH): v1.0.0 → v1.0.1 (patch) → v1.1.0 (minor) → v2.0.0 (major)',
    'git log v1.0..v2.0 shows all commits between two tags — useful for generating changelogs',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git push --tags pushes ALL tags, including experimental or draft ones. Prefer pushing specific tags: git push origin v1.0.0. If you pushed a wrong tag, delete it from remote with git push origin --delete <tagname>.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a Git tag and a Git branch?\nA: A branch is a moving pointer — it advances with each new commit. A tag is a fixed pointer — it always points to the same commit and never moves. Tags mark specific historical points (releases); branches represent lines of active development.',
    },
    {
      type: 'tip',
      content: 'On GitHub, annotated tags automatically create a "Release" entry that you can attach release notes and binary artifacts to. This is the standard way to publish software versions. Create tags from the CLI, then add release notes on GitHub.',
    },
  ],
}
