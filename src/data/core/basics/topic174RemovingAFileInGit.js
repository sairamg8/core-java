export default {
  id: 'removing-a-file-in-git',
  title: '174. Removing a File in Git',
  explanation: `Removing files from Git requires more than just deleting them from disk — you need to tell Git to stop tracking them too.

**git rm — remove from working tree AND staging area:**
  git rm file.txt           — delete file + stage the deletion
  git rm --cached file.txt  — stop tracking but keep on disk
  git rm -r folder/         — remove recursively
  git rm -f file.txt        — force remove (even if staged changes exist)

**What happens:**
  git rm file.txt   → file is deleted from disk + deletion is staged
  git commit        → file is removed from the repository

**git rm --cached:**
Removes the file from git tracking without deleting it from disk. Use when you accidentally committed a file that should be in .gitignore:
  echo "secrets.properties" >> .gitignore
  git rm --cached secrets.properties
  git commit -m "Untrack secrets.properties"

**Manual delete vs git rm:**
If you delete a file with rm (or OS file manager), git sees it as an unstaged deletion. You still need to stage it:
  rm file.txt
  git add file.txt    // "add" the deletion to staging
  OR
  git rm file.txt     // delete + stage in one command

**git rm --dry-run:**
Preview what would be removed without actually doing it:
  git rm --dry-run -r src/

**Restoring a deleted file (before commit):**
  git restore file.txt     // restore from last commit
  git checkout -- file.txt  // older syntax

**After commit (recover deleted file):**
  git log --diff-filter=D -- file.txt   // find the commit that deleted it
  git checkout <commit>^ -- file.txt   // restore from parent of that commit`,
  code: `# ===== Removing Files in Git =====

# 1. Add a file to track
echo "data" > temp.txt
git add temp.txt
git commit -m "Add temp.txt"

# 2. Remove file from working tree AND git tracking
git rm temp.txt
# Removes temp.txt from disk + stages the deletion
git status
# Changes to be committed: deleted: temp.txt
git commit -m "Remove temp.txt"

# 3. Remove only from git (keep on disk)
echo "secret=abc" > secrets.properties
git add secrets.properties
git commit -m "Oops — committed secrets"

# Fix: untrack and add to .gitignore
echo "secrets.properties" >> .gitignore
git rm --cached secrets.properties   # removes from git, keeps on disk
git add .gitignore
git commit -m "Untrack secrets, add to gitignore"
# File still exists locally but git no longer tracks it

# 4. Delete file manually first, then stage
rm stale.txt
git status
# Changes not staged: deleted: stale.txt

git add stale.txt   # stage the deletion (despite being "add")
git commit -m "Remove stale.txt"
# OR shorthand: git rm stale.txt (does both at once)

# 5. Remove multiple files at once
git rm *.log
git rm -r build/

# 6. Dry run — preview what would be removed
git rm --dry-run -r target/
# rm 'target/app.jar'
# rm 'target/classes/Main.class'

# 7. Restore a deleted file (before commit)
git rm temp.txt     # deleted and staged
git restore --staged temp.txt  # unstage the deletion
git restore temp.txt           # restore file content from HEAD

# 8. Recover a file deleted in a past commit
git log --all --full-history -- deleted-file.txt
# Find the commit hash that deleted it (e.g., abc123)
git checkout abc123^ -- deleted-file.txt
# Restores the file as it was before the deletion commit`,
  codeTitle: 'Removing Files with git rm',
  points: [
    'git rm file removes from disk AND stages the deletion — ready to commit in one command',
    'git rm --cached file removes from git tracking but keeps the file on disk — use after accidental commits',
    'Manually deleting a file (rm) leaves an unstaged deletion — must follow with git add file or git rm file',
    'Always add accidentally committed sensitive files to .gitignore AND use git rm --cached to untrack them',
    'git rm --dry-run previews deletions without actually removing anything',
    'To restore a file deleted in a past commit: find the commit with git log --diff-filter=D then checkout from its parent',
    'git rm -r removes a directory and all its contents recursively',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'git rm --cached only removes the file from the CURRENT and FUTURE state — the file still exists in past commits. If you accidentally committed a secret (password, API key), you must rewrite history (git filter-branch or BFG) AND rotate the secret immediately. The file is still in history.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between rm file and git rm file?\nA: rm file deletes the file from disk but Git still shows it as "deleted: file" in the unstaged area — you must then run git add file to stage the deletion. git rm file does both steps at once: deletes from disk and stages the deletion.',
    },
    {
      type: 'tip',
      content: 'Before removing files, check git log -- filename to see the full history of that file. If you might want to recover it later, note the last commit hash. Deleted files are always recoverable from Git history as long as the .git directory exists.',
    },
  ],
}
