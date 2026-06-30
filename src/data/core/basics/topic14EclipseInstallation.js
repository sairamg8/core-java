export default {
  id: 'eclipse-installation',
  title: '14. Eclipse Installation',
  explanation: `**Eclipse IDE** is one of the oldest and most established Java IDEs, with a large install base in enterprise environments. While IntelliJ has become more popular for new projects, many companies still run Eclipse — making it worth knowing.

**Installation steps:**
1. Go to eclipse.org/downloads
2. Download "Eclipse IDE for Java Developers" (not the generic installer)
3. Extract the zip/run the installer
4. On first launch, Eclipse asks for a workspace directory — this is where all your Eclipse projects live. Keep the default or choose a convenient folder.

**Eclipse vs IntelliJ (honest comparison):**

| Feature | Eclipse | IntelliJ |
|---|---|---|
| Cost | Free | Free (Community) / Paid (Ultimate) |
| Performance | Moderate | Faster on large projects |
| Smart completion | Good | Excellent |
| Refactoring | Good | Industry-leading |
| Spring support | Free (STS plugin) | Built-in (Ultimate) |
| Learning curve | Steeper | More intuitive |
| Industry use | Legacy enterprise | New projects |

**Essential Eclipse features:**

**Perspectives:** Eclipse uses "Perspectives" — different window layouts for different tasks. Java Perspective is for coding. Debug Perspective switches to debugging tools automatically when you hit a breakpoint.

**Views:** Package Explorer (left), Editor (center), Console (bottom), Outline (right). Drag and drop to reorganize.

**Quick Fix:** Hover over a red error → click the light bulb → Eclipse suggests fixes. Or press Ctrl+1 with cursor on the error.`,
  code: `// Eclipse keyboard shortcuts

// Ctrl+Space           → Content assist (auto-complete)
// Ctrl+1               → Quick Fix (on error line)
// Ctrl+Shift+O         → Organize imports (auto-add missing imports)
// Ctrl+Shift+F         → Format code
// F3                   → Go to declaration
// Ctrl+Alt+H           → Open Call Hierarchy (who calls this method)
// Alt+Shift+R          → Rename (refactor)
// Ctrl+D               → Delete current line
// Alt+Up/Down          → Move line up or down
// Ctrl+L               → Go to line number

// Run & Debug
// Ctrl+F11             → Run
// F11                  → Debug
// F6                   → Step over
// F5                   → Step into
// F8                   → Resume

// Creating a class in Eclipse:
// Right-click project/package → New → Class
// Enter name, check "public static void main(String[] args)" if needed`,
  codeTitle: 'Eclipse Essential Shortcuts',
  points: [
    'Eclipse uses a workspace model — all projects in a workspace share settings. If you want isolated settings per project, create separate workspaces.',
    'The Spring Tool Suite (STS) is Eclipse with Spring plugins pre-installed. Download it from spring.io/tools if you will be doing Spring development with Eclipse.',
    'Eclipse\'s "Problems" view (Window → Show View → Problems) lists all compile errors and warnings across all projects — useful for large multi-project setups.',
    'Eclipse build is incremental — it recompiles only changed files. If you see phantom errors, try Project → Clean → Clean all projects to force a full rebuild.',
    'For Maven projects in Eclipse: right-click project → Configure → Convert to Maven Project. Or import via File → Import → Existing Maven Projects.',
  ],
  callouts: [
    {
      type: 'note',
      content: 'Eclipse requires Java to be installed separately — it does not bundle a JDK. You need to point Eclipse to your JDK: Window → Preferences → Java → Installed JREs → Add → Standard VM → browse to your JDK directory.',
    },
    {
      type: 'tip',
      content: 'If you are using Eclipse for this course, the workflow is: New Project → add source files to src/ → Run as Java Application. Eclipse does not require a project structure — you can add plain .java files directly.',
    },
  ],
}
