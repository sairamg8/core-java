export default {
  id: 'maven-installation-guide-preview',
  title: '263. Maven Installation Guide and Setup Preview',
  explanation: `Before using Maven you need to install it and verify the setup. This topic previews what the installation involves across platforms.

**Prerequisite — the JDK:**
Maven is a Java program, so it requires a **JDK** (not just a JRE) to be installed first. Verify with:
\`\`\`bash
java -version
javac -version
\`\`\`
If \`javac\` is missing, you have a JRE only — install a full JDK (e.g. Temurin/Adoptium, Oracle, or OpenJDK).

**What installing Maven involves:**
1. Download the Maven binary ZIP/tar.gz from \`maven.apache.org\`
2. Extract it to a permanent location
3. Set the \`MAVEN_HOME\` (or \`M2_HOME\`) environment variable to that folder
4. Add Maven's \`bin\` directory to the system \`PATH\`
5. Verify with \`mvn -version\`

**Environment variables Maven uses:**
| Variable | Purpose |
|----------|---------|
| \`JAVA_HOME\` | Points to the JDK install — Maven needs this |
| \`MAVEN_HOME\` / \`M2_HOME\` | Points to the Maven install directory |
| \`PATH\` | Must include Maven's bin so \`mvn\` works anywhere |

**Verifying a successful install:**
\`\`\`bash
mvn -version
\`\`\`
A correct install prints the Maven version, the Java version it found, and the JAVA_HOME path:
\`\`\`
Apache Maven 3.9.6
Maven home: /opt/apache-maven-3.9.6
Java version: 17.0.9, vendor: Eclipse Adoptium
Java home: /usr/lib/jvm/temurin-17
\`\`\`

**The local repository (.m2):**
On first use, Maven creates a hidden folder \`~/.m2/repository\` where it caches every downloaded dependency. This is covered in detail in the repositories topic.

**Platform coverage in this chapter:**
- Windows (local development) — next topic
- AWS EC2 Linux (cloud) — later topic
The steps are conceptually identical; only the commands to set environment variables differ.`,
  code: `# ===== Maven Installation — Verification Steps (all platforms) =====

# Step 0: Confirm a JDK is installed (Maven needs javac, not just java)
java -version
javac -version
# If javac is missing, install a full JDK before continuing.

# Step 1: After extracting Maven and setting env vars, verify:
mvn -version

# Expected output (versions will vary):
#   Apache Maven 3.9.6
#   Maven home: /opt/apache-maven-3.9.6
#   Java version: 17.0.9, vendor: Eclipse Adoptium, runtime: /usr/lib/jvm/temurin-17
#   Default locale: en_US, platform encoding: UTF-8
#   OS name: "linux", version: "6.x", arch: "amd64"

# ===== Environment variables — Linux/Mac (~/.bashrc or ~/.zshrc) =====
export JAVA_HOME=/usr/lib/jvm/temurin-17
export MAVEN_HOME=/opt/apache-maven-3.9.6
export PATH=$PATH:$JAVA_HOME/bin:$MAVEN_HOME/bin

# Apply changes without reopening the terminal:
source ~/.bashrc

# ===== Environment variables — Windows (PowerShell, as admin) =====
# [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\\Program Files\\Java\\jdk-17", "Machine")
# [System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\\apache-maven-3.9.6", "Machine")
# Then append %JAVA_HOME%\\bin and %MAVEN_HOME%\\bin to the system PATH.

# ===== First build downloads dependencies into the local repository =====
# Maven creates ~/.m2/repository on first run and caches all JARs there.
ls ~/.m2/repository    # Linux/Mac
# dir %USERPROFILE%\\.m2\\repository   (Windows)`,
  codeTitle: 'Maven Install Verification and Environment Variables',
  points: [
    'Maven requires a full JDK (with javac), not just a JRE — verify with both java -version and javac -version',
    'Installation = download binary, extract, set MAVEN_HOME/M2_HOME, add bin to PATH, verify with mvn -version',
    'JAVA_HOME must point to the JDK so Maven knows which Java to compile with',
    'mvn -version prints the Maven version, the detected Java version, and JAVA_HOME — use it to confirm a correct setup',
    'Maven caches all downloaded dependencies in the local repository at ~/.m2/repository (created on first use)',
    'The installation steps are the same across platforms — only the syntax for setting environment variables differs',
    'PATH must include Maven\'s bin directory so the mvn command works from any directory',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If mvn -version reports a different Java version than you expect, JAVA_HOME is pointing to the wrong JDK (or a JRE). Maven uses JAVA_HOME, not whatever javac is first on the PATH. Fix JAVA_HOME to point at the exact JDK you want Maven to compile with — mismatched Java versions cause confusing compilation errors.",
    },
    {
      type: 'interview',
      content: "Q: What environment variables does Maven depend on and why?\nA: Maven depends on JAVA_HOME (to locate the JDK it uses to compile and run), and it needs its own bin directory on the PATH so the mvn command is available everywhere. MAVEN_HOME/M2_HOME points to the Maven installation. JAVA_HOME is the most important — Maven uses it specifically to determine the Java toolchain, independent of the system default java.",
    },
    {
      type: 'tip',
      content: "Run mvn -version as the very first thing after installing. It validates three things at once: that mvn is on your PATH, that JAVA_HOME points to a working JDK, and that Maven can start. If this command works, your installation is correct and you can build any project.",
    },
  ],
}
