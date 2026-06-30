export default {
  id: 'maven-java-installation-windows',
  title: '264. Maven & Java Installation on Windows',
  explanation: `This topic walks through installing the JDK and Maven on Windows and configuring the environment variables through the System Properties dialog.

**Part 1 — Install the JDK:**
1. Download a JDK installer (Temurin/Adoptium, Oracle, or OpenJDK) for Windows
2. Run the installer — it typically installs to \`C:\\Program Files\\Java\\jdk-17\`
3. Note the install path — you need it for JAVA_HOME

**Part 2 — Install Maven:**
1. Download the **binary zip** (e.g. \`apache-maven-3.9.6-bin.zip\`) from maven.apache.org
2. Extract it to a permanent folder, e.g. \`C:\\apache-maven-3.9.6\`
3. Do **not** put it in a folder with spaces or special characters

**Part 3 — Set environment variables (System Properties):**
Open: Start → "Edit the system environment variables" → Environment Variables

Add these **System variables**:
| Variable | Value |
|----------|-------|
| \`JAVA_HOME\` | \`C:\\Program Files\\Java\\jdk-17\` |
| \`MAVEN_HOME\` | \`C:\\apache-maven-3.9.6\` |

Then edit the \`Path\` variable and add two new entries:
- \`%JAVA_HOME%\\bin\`
- \`%MAVEN_HOME%\\bin\`

Using \`%JAVA_HOME%\\bin\` (rather than a hard-coded path) means that when you upgrade the JDK, you only update JAVA_HOME and the PATH entry still works.

**Part 4 — Verify (open a NEW Command Prompt):**
\`\`\`cmd
java -version
javac -version
mvn -version
\`\`\`
You must open a **new** terminal — environment variable changes do not affect already-open terminals.

**Common Windows pitfalls:**
- Editing PATH in an old terminal: changes won't apply, open a fresh one
- Spaces in the Maven path: avoid folders like \`C:\\Program Files\\maven\`
- Setting JAVA_HOME to the bin folder: it should point to the JDK root, not \`...\\jdk-17\\bin\``,
  code: `:: ===== Windows Installation & Verification (Command Prompt) =====

:: After installing JDK + extracting Maven and setting env vars,
:: open a NEW Command Prompt and verify each tool:

java -version
:: java version "17.0.9" 2023-10-17 LTS

javac -version
:: javac 17.0.9

mvn -version
:: Apache Maven 3.9.6
:: Maven home: C:\\apache-maven-3.9.6
:: Java version: 17.0.9, vendor: Eclipse Adoptium
:: Java home: C:\\Program Files\\Java\\jdk-17

:: ===== Verify the environment variables are set =====
echo %JAVA_HOME%
:: C:\\Program Files\\Java\\jdk-17

echo %MAVEN_HOME%
:: C:\\apache-maven-3.9.6

echo %PATH%
:: ...should contain C:\\Program Files\\Java\\jdk-17\\bin and C:\\apache-maven-3.9.6\\bin


:: ===== Setting env vars from PowerShell (alternative to the GUI) =====
:: Run PowerShell as Administrator:
::
:: [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\\Program Files\\Java\\jdk-17", "Machine")
:: [Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\\apache-maven-3.9.6", "Machine")
::
:: $p = [Environment]::GetEnvironmentVariable("Path", "Machine")
:: $p += ";%JAVA_HOME%\\bin;%MAVEN_HOME%\\bin"
:: [Environment]::SetEnvironmentVariable("Path", $p, "Machine")
::
:: Then close and reopen the terminal.


:: ===== Build a project to confirm everything works end to end =====
cd C:\\projects\\my-app
mvn clean package
:: BUILD SUCCESS means Java + Maven are correctly installed.`,
  codeTitle: 'Windows JDK + Maven Setup and Verification',
  points: [
    'Install a full JDK first, then extract the Maven binary zip to a path without spaces (e.g. C:\\apache-maven-3.9.6)',
    'Set JAVA_HOME to the JDK root folder, NOT the bin subfolder — pointing to bin is a common mistake',
    'Add %JAVA_HOME%\\bin and %MAVEN_HOME%\\bin to the Path variable so java, javac, and mvn work anywhere',
    'Using %JAVA_HOME%\\bin in Path (not a hard-coded path) means JDK upgrades only require changing JAVA_HOME',
    'Always open a NEW Command Prompt after changing environment variables — open terminals keep the old values',
    'Verify with java -version, javac -version, and mvn -version — all three must succeed',
    'A final mvn clean package on a real project confirms the whole toolchain works end to end',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The most common Windows setup mistake is setting JAVA_HOME to the bin directory (C:\\Program Files\\Java\\jdk-17\\bin) instead of the JDK root (C:\\Program Files\\Java\\jdk-17). Maven expects JAVA_HOME to be the root and appends \\bin itself. If you include bin, Maven looks for C:\\...\\bin\\bin\\java and fails. Point JAVA_HOME at the folder that CONTAINS bin.",
    },
    {
      type: 'interview',
      content: "Q: After setting environment variables on Windows, why might mvn still not be recognized in your open terminal?\nA: Environment variable changes only apply to processes started AFTER the change. An already-open Command Prompt or PowerShell window captured the old environment when it launched. You must open a new terminal window for the updated PATH, JAVA_HOME, and MAVEN_HOME to take effect.",
    },
    {
      type: 'tip',
      content: "Avoid installing Maven into 'C:\\Program Files\\' or any path containing spaces. Some older Maven plugins and scripts mishandle spaces in paths, leading to obscure errors. A simple path like C:\\apache-maven-3.9.6 or C:\\tools\\maven avoids the entire class of space-related problems.",
    },
  ],
}
