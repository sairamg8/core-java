export default {
  id: 'jdk-installation',
  title: '11. JDK Installation',
  explanation: `Installing the JDK correctly and setting up environment variables is a one-time setup that enables all Java development on your machine.

**Installation steps by OS:**

**Windows:**
1. Go to adoptium.net → Download Temurin JDK 21 (Windows x64 MSI)
2. Run the installer → accept defaults → check "Set JAVA_HOME variable" option
3. Open Command Prompt: \`java -version\` and \`javac -version\` to verify
4. If commands not found: manually set JAVA_HOME and PATH (see code block)

**macOS:**
Option A (Installer): Download .pkg from adoptium.net, run it, done.
Option B (Homebrew, recommended):
\`\`\`
brew install temurin@21
\`\`\`
Option C (SDKMAN, best for managing multiple versions):
\`\`\`
curl -s "https://get.sdkman.io" | bash
sdk install java 21-tem
\`\`\`

**Linux (Ubuntu/Debian):**
\`\`\`
sudo apt update
sudo apt install temurin-21-jdk
\`\`\`
Or use SDKMAN (works on all distros).

**JAVA_HOME explained:**
JAVA_HOME is an environment variable pointing to the JDK's root directory. Build tools like Maven and Gradle rely on it to find the compiler and runtime. Without it set correctly, \`mvn compile\` and \`gradle build\` may fail.`,
  code: `# --- Windows: Set JAVA_HOME and PATH manually ---
# In System Properties → Advanced → Environment Variables:
# New System Variable:
#   Name:  JAVA_HOME
#   Value: C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.x.x-hotspot

# Edit Path variable, add new entry:
#   %JAVA_HOME%\\bin

# Verify (new Command Prompt window):
echo %JAVA_HOME%
java -version

# --- macOS/Linux: Set in shell profile ---
# Add to ~/.zshrc (macOS) or ~/.bashrc (Linux):
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS
# or for Linux:
export JAVA_HOME=/usr/lib/jvm/temurin-21-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Apply changes:
source ~/.zshrc

# Verify:
echo $JAVA_HOME
java -version   # should show openjdk version "21.x.x"
javac -version  # should show javac 21.x.x`,
  codeTitle: 'Setting JAVA_HOME and PATH',
  points: [
    'JAVA_HOME must point to the JDK root directory (the folder containing bin/, lib/, etc.) — not to the bin/ subdirectory itself.',
    'After changing environment variables on Windows, you must open a NEW Command Prompt window — existing ones do not pick up the new values.',
    'SDKMAN is the easiest way to manage multiple JDK versions on Mac/Linux. sdk use java 17-tem switches your current session to Java 17. sdk default java 21-tem makes Java 21 the default.',
    'On macOS, /usr/libexec/java_home -v 21 prints the path to the Java 21 installation — useful for dynamically setting JAVA_HOME in your shell profile.',
    'Corporate laptops sometimes have IT policies that block installer files. In that case, use the portable JDK zip/tar.gz — extract it anywhere and set JAVA_HOME to that directory.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Common mistake: pointing JAVA_HOME to the JRE directory instead of the JDK directory. The JRE does not contain javac. If you get "javac: command not found" after installation, check that JAVA_HOME points to a directory that contains a bin/javac executable.',
    },
    {
      type: 'tip',
      content: 'In IntelliJ IDEA, you can manage JDKs from Project Structure (Ctrl+Shift+Alt+S on Windows). IntelliJ can download and install JDKs directly — you do not need to install them separately unless you also want to use the command line.',
    },
  ],
}
