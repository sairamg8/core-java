export default {
  id: 'history-of-git',
  title: '168. History of Git',
  explanation: `Git was created in 2005 by Linus Torvalds — the same person who created the Linux kernel. Understanding its origins explains why it works the way it does.

**Timeline:**

**Before Git (1991–2002):**
The Linux kernel was developed using patches shared via email and tarballs. Slow, error-prone, and difficult to track.

**BitKeeper era (2002–2005):**
Linux adopted BitKeeper — a proprietary distributed VCS — for free. In 2005, the relationship broke down when the license was revoked. The community needed an alternative.

**Git birth (April 2005):**
Linus Torvalds started writing Git in April 2005 with specific goals:
- Speed — fast enough for the Linux kernel (thousands of files)
- Simple design
- Strong support for non-linear development (branching/merging)
- Fully distributed — no central server required
- Handle large projects efficiently

The first version of Git was released in just 10 days (April 7, 2005). Git managed its own development using itself by April 29, 2005.

**Junio Hamano:**
Linus handed Git maintenance to Junio C. Hamano in July 2005. Junio has been the primary maintainer ever since.

**GitHub (2008):**
GitHub launched in April 2008, making Git accessible to everyone with a web interface, pull requests, and issue tracking. It accelerated Git adoption massively.

**Today:**
Git is the de facto standard for version control in the software industry. Used by virtually every major open source project and nearly all companies. Over 93% of developers use Git (Stack Overflow surveys).

**GitLab (2011), Bitbucket, Azure DevOps** — alternative hosting platforms built on Git.`,
  code: `# Git history timeline as git log format

# 2005-04-03 — Linus Torvalds starts writing Git
# "I'm an egotistical bastard, and I name all my projects after myself.
#  First Linux, now git." — Linus Torvalds

# 2005-04-07 — Initial Git commit
# The first commit in the Git repository (git's own history):
# commit e83c5163316f89bfbde7d9ab23ca2e25604af290
# Author: Linus Torvalds
# Date: Thu Apr 7 15:13:13 2005 -0700
# Initial revision of "git", the information manager from hell

# 2005-06-16 — Git 0.99 released
# 2005-12-21 — Git 1.0 released

# 2008-04-10 — GitHub launches
# 2011-09-13 — GitLab launches

# Check git version you are running:
git --version

# See git's own git history (on any git installation):
# git log --oneline --graph --all (inside a git repo)

# Key design decisions that made Git great:
# 1. Content-addressed storage — SHA-1 identifies content, not location
# 2. Snapshots, not diffs — git stores full file snapshots per commit
# 3. Distributed — no central authority, full history everywhere
# 4. Cheap branching — branches are just pointers to commits
# 5. The three-area model: working tree / staging / repository

# Compare with SVN (centralized) workflow:
# SVN: commit → central server (requires network)
# Git: commit → local repo (offline) → push to remote (optional, on demand)`,
  codeTitle: 'Git History and Design Philosophy',
  points: [
    'Git was created by Linus Torvalds in April 2005 after BitKeeper revoked its free license for Linux development',
    'The first version of Git was written in just 10 days — designed specifically for the Linux kernel scale',
    'Junio Hamano became the primary maintainer in July 2005 and has maintained Git ever since',
    'GitHub launched in 2008 and dramatically accelerated Git adoption with its web UI and pull request workflow',
    'Git stores file snapshots (not diffs) — each commit is a complete picture of all tracked files',
    'Content-addressed storage: every object (commit, file, tree) is identified by a SHA-1 hash of its content',
    'Git is used by over 93% of developers worldwide — it became the industry standard within a decade',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Git was designed for source code, not binary files. Large binaries (images, videos, executables) dramatically increase repository size because git keeps the full history. Use Git LFS (Large File Storage) for binary assets.',
    },
    {
      type: 'interview',
      content: 'Q: Why was Git designed as a distributed system rather than centralized like SVN?\nA: The Linux kernel has thousands of contributors worldwide — a central server would be a bottleneck and single point of failure. Distributed design means everyone has the full history, can work offline, and can push/pull independently.',
    },
    {
      type: 'tip',
      content: 'Git stores snapshots, not delta diffs — this is why switching branches is instant. It does not need to reconstruct the file state by replaying diffs. It just copies the committed snapshot into your working tree.',
    },
  ],
}
