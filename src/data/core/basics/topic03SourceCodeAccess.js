export default {
  id: 'source-code-access',
  title: '3. [Important] Access for Source Code and Learner Community',
  explanation: `This topic covers where to find the course source code and how to join the learner community — both critical for getting the most from this course.

**Accessing the Source Code:**

The course source code is hosted on GitHub. Steps to access:
1. Find the GitHub link in the course description or first lecture
2. **Download:** Click the green Code button → Download ZIP (no Git needed)
3. **Clone (recommended):** \`git clone <repo-url>\` in your terminal
4. Open the project folder in IntelliJ IDEA: File → Open → select the folder
5. If it's a Maven project, IntelliJ auto-imports dependencies from \`pom.xml\`

**Repository structure (typical):**
\`\`\`
course-source/
  section-01-basics/
  section-02-oop/
  section-03-collections/
  ...
  README.md
\`\`\`

**Joining the Learner Community:**
1. Check course announcements for the latest Discord/Slack invite link
2. Join and introduce yourself: your background, goals, and what you want to build
3. Post your progress. Sharing accountability with others dramatically increases completion rates.

**Community etiquette:**
- No spam or self-promotion
- Format your code with code blocks when posting (triple backtick in Discord/Slack)
- Search before asking — your question has likely been answered
- Be kind to beginners — you were one recently`,
  code: `# Clone the course repository
git clone https://github.com/instructor/course-name.git

# Navigate into the project
cd course-name

# Open in VS Code
code .

# Or open IntelliJ IDEA from terminal
idea .

# Check Java version
java -version
javac -version`,
  codeTitle: 'Setting Up the Source Code',
  points: [
    'Always use the latest GitHub link from the course announcements — links get updated when content is reorganized.',
    'If IntelliJ shows "Cannot resolve symbol" errors after opening a Maven project, right-click pom.xml → Maven → Reload Project.',
    'Fork the repository to your own GitHub account so you can commit your modified versions and build a portfolio.',
    'Never post passwords, API keys, or access tokens in community channels or Q&A. Even deleted posts can be seen.',
  ],
  callouts: [
    {
      type: 'important',
      content: 'If you accidentally commit a secret (API key, password) to GitHub, rotate the credential immediately — do not just delete the commit. GitHub has bots that scan for secrets in real-time, and malicious actors archive leaked credentials faster than you can delete them.',
    },
  ],
}
