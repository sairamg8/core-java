export default {
  id: 'intellij-installation',
  title: '13. IntelliJ IDEA Installation',
  explanation: `**IntelliJ IDEA** by JetBrains is the most widely used Java IDE in the industry. Its deep understanding of Java code — refactoring tools, smart completions, and built-in frameworks support — makes it the professional's choice.

**Two editions:**
- **Community Edition** — Free, open-source. Excellent for core Java, Maven/Gradle, Git, testing. Everything you need for this course.
- **Ultimate Edition** — Paid (free for students via jetbrains.com/student). Adds Spring, Hibernate, database tools, web frameworks, JavaScript/TypeScript support.

**Installation steps:**
1. Go to jetbrains.com/idea → Download
2. Select Community Edition (free) unless you have a student license
3. Run the installer — during setup, check "Add to PATH" and "Create Desktop Shortcut"
4. Launch IntelliJ IDEA
5. On first launch: choose a UI theme (Darcula = dark, IntelliJ Light = light)
6. Skip all optional plugin suggestions for now

**Creating your first project:**
File → New Project → Java → Choose JDK → Name the project → Create.
IntelliJ automatically creates a \`src/\` directory. Right-click src → New → Java Class.

**Key settings to configure immediately:**
- File → Settings → Editor → Font → set font size to 14-16 for readability
- File → Settings → Build → Build Tools → Maven → set to your Maven installation
- File → Project Structure → SDK → set to JDK 21`,
  code: `// IntelliJ IDEA keyboard shortcuts you'll use daily:

// Code Navigation
// Ctrl+N (Win) / Cmd+O (Mac)     → Find class by name
// Ctrl+Shift+N                    → Find any file
// Ctrl+B                          → Go to declaration
// Ctrl+Alt+B                      → Go to implementation
// Alt+F7                          → Find all usages

// Code Editing
// Ctrl+Space                      → Auto-complete
// Alt+Enter                       → Quick fix / intention action
// Ctrl+Alt+L (Win) / Cmd+Alt+L    → Reformat code
// Ctrl+Alt+O                      → Optimize imports
// Shift+F6                        → Rename (refactor)

// Running & Debugging
// Shift+F10                       → Run
// Shift+F9                        → Debug
// F9                              → Resume program
// F8                              → Step over
// F7                              → Step into

// Search Everything
// Double Shift                    → Search everywhere`,
  codeTitle: 'IntelliJ IDEA Essential Shortcuts',
  points: [
    'Alt+Enter is the most powerful shortcut in IntelliJ — it shows context-aware suggestions: add missing import, create method, implement interface, convert to lambda, and hundreds more.',
    'IntelliJ can manage JDKs for you: File → Project Structure → SDKs → + → Download JDK. You do not need to install the JDK separately if you use IntelliJ for everything.',
    'The built-in Git integration (View → Tool Windows → Git) shows changes, lets you commit, and resolves merge conflicts — all without leaving the IDE.',
    'IntelliJ\'s database tool (Ultimate) or the free Database Navigator plugin connects to MySQL, PostgreSQL, H2 etc. and lets you run SQL queries alongside your Java code.',
    'The .idea/ folder and *.iml files are IntelliJ project metadata. Add them to .gitignore for team projects — each developer has their own configuration.',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Apply for the JetBrains Student License at jetbrains.com/student — all JetBrains products (IntelliJ Ultimate, DataGrip, WebStorm, etc.) are free for students and educators with a .edu email or GitHub Student Pack.',
    },
    {
      type: 'note',
      content: 'IntelliJ uses more RAM than VS Code — expect 500 MB to 2 GB depending on project size. On machines with less than 8 GB RAM, VS Code may be a better choice. You can tune memory in Help → Change Memory Settings.',
    },
  ],
}
