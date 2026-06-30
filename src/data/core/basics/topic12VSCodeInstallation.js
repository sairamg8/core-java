export default {
  id: 'vscode-installation',
  title: '12. VS Code Installation',
  explanation: `**Visual Studio Code** (VS Code) is a free, lightweight, highly extensible code editor from Microsoft. It is an excellent choice for Java beginners: fast to install, low memory footprint, and powerful with the right extensions.

**Installation:**
1. Go to code.visualstudio.com
2. Download the installer for your OS (Windows, macOS, Linux)
3. Run the installer — defaults are fine
4. Launch VS Code

**Essential Java extensions:**

Install the **Extension Pack for Java** (publisher: Microsoft) — it bundles six extensions into one:
- **Language Support for Java** — IntelliSense, code completion, error highlighting, refactoring
- **Debugger for Java** — Set breakpoints, step through code, inspect variables
- **Test Runner for Java** — Run JUnit/TestNG tests with a click
- **Maven for Java** — Maven project support and lifecycle commands
- **Project Manager for Java** — Create new Java projects without any setup
- **Visual Studio IntelliCode** — AI-assisted code suggestions

**Installing extensions:**
Click the Extensions icon (Ctrl+Shift+X) → search "Extension Pack for Java" → Install.

**Creating your first Java project in VS Code:**
1. Ctrl+Shift+P → "Create Java Project"
2. Select "No build tools" for a simple project
3. Choose a folder, enter a project name
4. VS Code creates a \`src/\` folder with a \`Hello.java\` starter file
5. Press the Run button (▶) at the top right to run`,
  code: `// After VS Code + Extension Pack setup:
// Open the folder with your .java files
// Click the ▶ button or press F5 to run

// File: HelloVSCode.java
public class HelloVSCode {
    public static void main(String[] args) {
        System.out.println("Hello from VS Code!");

        // VS Code features you'll use constantly:
        // Ctrl+Space      → code completion
        // F2              → rename symbol across all files
        // Alt+Shift+F     → format document
        // Ctrl+.          → quick fix (resolve imports, suggest fixes)
        // Ctrl+Shift+B    → build
        // F5              → debug (with breakpoints)
        // Ctrl+\`          → open integrated terminal
    }
}`,
  codeTitle: 'VS Code Java Setup',
  points: [
    'VS Code is an editor, not an IDE. It becomes a Java IDE through extensions. The Extension Pack for Java transforms it into a capable development environment.',
    'VS Code uses the Language Server Protocol (LSP) — the Java language server runs in the background to provide IntelliSense and error checking without blocking the editor.',
    'For Spring Boot projects in VS Code, also install the "Spring Boot Extension Pack" — it adds support for application.properties auto-completion, Spring Bean navigation, and live reload.',
    'VS Code settings are stored in settings.json. You can have workspace-specific settings (per project) and global user settings — useful for per-project Java version overrides.',
    'The integrated terminal (Ctrl+backtick) runs in the project directory — you can compile and run with javac/java without leaving the editor.',
  ],
  callouts: [
    {
      type: 'note',
      content: 'VS Code requires the JDK to be installed separately (see Topic 11). Unlike IntelliJ, it does not bundle a JDK. Make sure JAVA_HOME is set correctly before opening Java files in VS Code.',
    },
    {
      type: 'tip',
      content: 'Use the "Java: Clean Java Language Server Workspace" command (Ctrl+Shift+P) if VS Code shows red errors on code that should be correct. This clears the language server cache and often resolves stale error state after adding dependencies.',
    },
  ],
}
