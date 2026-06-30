export default {
  id: 'git-commit',
  title: '171. Git commit',
  explanation: `A commit is a snapshot of your project at a point in time. It permanently records staged changes into the repository history.

**The commit cycle:**
  1. Modify files
  2. git add <files>        — stage changes
  3. git commit -m "msg"   — save snapshot

**git add — staging area:**
  git add file.txt         — stage one file
  git add src/             — stage a directory
  git add .                — stage all changes in current directory
  git add -p               — interactively choose chunks to stage (patch mode)

**git commit:**
  git commit -m "message"           — commit with inline message
  git commit                        — opens editor for message
  git commit -am "message"          — stage ALL tracked modified files + commit (skips git add)
  git commit --amend                — modify the last commit (rewrite message or add files)

**Commit message best practices:**
- Subject line: 50 chars or less, imperative mood: "Add login page", not "Added"
- Use present tense: "Fix bug" not "Fixed bug"
- Body (after blank line): explain WHY, not what — the diff shows what

**What a commit stores:**
- SHA-1 hash (40 hex chars)
- Author name, email, timestamp
- Committer name, email, timestamp
- Pointer to parent commit(s)
- Tree snapshot (all tracked file contents)
- Commit message

**git log:**
  git log                    — full history
  git log --oneline          — compact, one line per commit
  git log --oneline --graph  — ASCII graph of branches
  git show <hash>            — show a specific commit's diff`,
  code: `# ===== git commit WORKFLOW =====

# 1. Create files
echo "public class Main { }" > Main.java
echo "*.class" > .gitignore

# 2. Check status
git status
# Untracked files: Main.java, .gitignore

# 3. Stage files
git add Main.java .gitignore
git status
# Changes to be committed (staged):
#   new file: Main.java
#   new file: .gitignore

# 4. Commit
git commit -m "Add Main.java and gitignore"

# 5. Stage ALL tracked modified files and commit in one step
echo "// updated" >> Main.java
git commit -am "Update Main.java with comment"
# Caution: -a does NOT stage new (untracked) files

# 6. View history
git log --oneline
# d4f83d5 (HEAD -> main) Update Main.java with comment
# abc1234 Add Main.java and gitignore

# 7. Stage selectively (interactive patch mode)
# git add -p  — shows each change chunk and asks: stage? (y/n/s...)

# 8. Amend last commit (BEFORE pushing)
git commit --amend -m "Add Main.java and .gitignore (correct message)"

# 9. Show a specific commit
git show HEAD
# Shows commit metadata + full diff

git show HEAD~1
# Shows the commit BEFORE HEAD

# 10. What happens inside git on commit:
# 1. Git computes SHA-1 of each staged file → "blob" object
# 2. Git creates a "tree" object listing all blobs
# 3. Git creates a "commit" object: tree + parent + message + author
# 4. HEAD is updated to point to the new commit

# 11. Good commit message format:
# Add user authentication endpoint
#
# Implements JWT-based login using Spring Security.
# Closes #42.`,
  codeTitle: 'git add and git commit',
  points: [
    'A commit is an immutable snapshot — identified by a unique SHA-1 hash that encodes the entire project state',
    'git add stages changes into the index (staging area); git commit saves staged changes to history',
    'git commit -am stages all modified tracked files and commits — does NOT add new untracked files',
    'git commit --amend rewrites the last commit — never amend commits that have been pushed to a shared remote',
    'Commit messages: subject line under 50 chars, imperative mood ("Add", "Fix", "Remove"), WHY in the body',
    'git log --oneline --graph shows a compact visual view of branch and merge history',
    'Every commit records author, committer, timestamp, parent hash, and tree — providing full traceability',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git commit -a does NOT add new (untracked) files — it only stages modifications to already-tracked files. If you create a new file, you must run git add explicitly first. Use git status to confirm what is staged before committing.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between the staging area and a commit?\nA: The staging area is a temporary holding place for changes you plan to commit next. A commit permanently records a snapshot into the repository history. You can add files to staging, review them, remove some, and only then commit the final selection.',
    },
    {
      type: 'tip',
      content: 'Use git add -p (patch mode) for large changes — it shows each change "hunk" and lets you decide y (yes, stage this), n (no), s (split into smaller hunks), or e (edit). This produces clean, focused commits rather than one massive commit with many unrelated changes.',
    },
  ],
}
