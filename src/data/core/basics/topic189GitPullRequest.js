export default {
  id: 'git-pull-request',
  title: '189. Git Pull Request',
  explanation: `A Pull Request (PR) is a proposal to merge a branch into another branch. It is the central mechanism for code review and collaboration on GitHub.

**What is a Pull Request?**
A PR says: "I have made changes on my branch — please review and merge them into the target branch."

PRs enable:
- Code review before merge
- Automated CI/CD checks (tests, linting, security scans)
- Discussion and feedback inline in the code
- Tracking of changes by feature/ticket

**PR workflow:**
  1. Create a feature branch: git checkout -b feature/login
  2. Make commits on that branch
  3. Push to remote: git push -u origin feature/login
  4. Open PR: from feature/login → main (on GitHub)
  5. Team reviews code, leaves comments
  6. Author addresses feedback, pushes more commits
  7. Reviewer approves
  8. PR is merged (merge commit, squash, or rebase)
  9. Branch is deleted

**PR merge strategies on GitHub:**
- **Create a merge commit:** preserves all commits + adds merge commit
- **Squash and merge:** combines all commits into one on main (cleanest history)
- **Rebase and merge:** replays commits linearly on main (no merge commit)

**Draft PRs:**
Mark a PR as "Draft" to signal it is not ready for review. Reviewers know not to review until converted to "ready."

**Key PR elements:**
- Title: concise summary of change
- Description: what changed, why, how to test
- Linked issues: "Closes #42" auto-closes the issue on merge
- Reviewers: assigned team members
- Labels: feature, bugfix, documentation, etc.
- CI status: green checks mean tests pass

**Required reviews:**
Most teams configure branch protection rules: PRs require at least 1 approved review before merging.`,
  code: `# ===== Pull Request Workflow =====

# ---- Creating a PR with GitHub CLI ----
git checkout -b feature/add-login
# ... make commits ...
git push -u origin feature/add-login

# Create PR:
gh pr create \\
  --base main \\
  --head feature/add-login \\
  --title "Add JWT login endpoint" \\
  --body "## Summary
Implements JWT-based login using Spring Security.
Closes #42.

## Test Plan
- [ ] Unit tests pass (mvn test)
- [ ] Manual test: POST /auth/login returns 200 with token"

# ---- View PR status ----
gh pr status
# Shows your open PRs, PRs assigned to you, PRs awaiting review

gh pr list
# List all open PRs in the repo

gh pr view 42
# View PR #42 details

# ---- Review a PR ----
gh pr checkout 42     # checkout the PR branch locally to test it
# Run tests, verify behavior...

gh pr review 42 --approve --body "Looks good! Clean implementation."
gh pr review 42 --request-changes --body "Please add null check on line 57."

# ---- Address review feedback ----
# Make more commits on the same branch
echo "// added null check" >> LoginService.java
git add LoginService.java
git commit -m "Add null check per review feedback"
git push    # PR automatically updates

# ---- Merge the PR ----
gh pr merge 42 --squash --delete-branch
# --squash: combine all commits into one
# --delete-branch: remove the branch after merge

# ---- PR via web URL ----
gh pr view 42 --web   # opens PR in browser

# ---- Link to GitHub issues ----
# In PR description:
# "Closes #42" or "Fixes #42" or "Resolves #42"
# GitHub automatically closes the issue when the PR merges

# ---- Draft PR (not ready for review) ----
gh pr create --draft --title "WIP: Add payment" --body "Work in progress"
# Convert to ready when done:
gh pr ready

# ---- Check CI status ----
gh pr checks 42
# Shows: tests, lint, security scan results`,
  codeTitle: 'Pull Request Workflow',
  points: [
    'A Pull Request proposes merging one branch into another — it enables code review, CI checks, and discussion',
    'PR workflow: branch → commits → push → create PR → review → address feedback → approve → merge → delete branch',
    'GitHub offers 3 merge strategies: merge commit (full history), squash (one commit), rebase (linear replay)',
    'Draft PRs signal "work in progress" — notify reviewers when ready with gh pr ready or via UI',
    '"Closes #42" in the PR description auto-closes the linked issue when the PR merges',
    'Branch protection rules can require: N approvals, passing CI, no unresolved comments before merging',
    'GitHub CLI (gh pr create, gh pr review, gh pr merge) handles the full PR lifecycle from the terminal',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Avoid opening PRs against the wrong base branch. Always verify --base before creating. A PR opened against "develop" instead of "main" will merge into the wrong branch. Check the PR page shows "base: main" before submitting.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between squash merge, rebase merge, and a regular merge commit in GitHub PRs?\nA: Merge commit preserves all PR commits and adds a merge commit. Squash merge combines all PR commits into one clean commit on main. Rebase merge replays each PR commit individually on main with no merge commit. Squash is most popular for clean history.',
    },
    {
      type: 'tip',
      content: 'Write your PR description as if explaining to a new team member. Include: what changed, why, how to test it, and any screenshots for UI changes. Good PR descriptions dramatically reduce review time and prevent misunderstandings. This is a skill that marks senior engineers.',
    },
  ],
}
