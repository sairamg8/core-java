export default {
  id: 'jdk-ide-download',
  title: '10. JDK and IDE Download',
  explanation: `Before writing any Java code, you need two things: the **JDK** (to compile and run Java) and an **IDE** (to write code efficiently).

**The JDK (Java Development Kit)**

The JDK contains:
- **javac** — the Java compiler (source → bytecode)
- **java** — the JVM launcher (runs .class files)
- **javadoc** — generates API documentation from code comments
- **jar** — packages .class files into a distributable archive
- **jshell** — an interactive Read-Eval-Print Loop (REPL) for experimenting with Java

**Which JDK to download?**

There are multiple JDK distributions — all conform to the OpenJDK specification:

| Distribution | Vendor | Notes |
|---|---|---|
| Oracle JDK | Oracle | Official, free for development, paid license for production |
| OpenJDK / Adoptium | Eclipse Foundation | Fully open-source, recommended for most use |
| Amazon Corretto | Amazon | Optimized for AWS, free |
| Azul Zulu | Azul | Wide platform support |
| GraalVM | Oracle/Community | Adds native compilation and polyglot |

**Recommendation:** Download **Eclipse Adoptium Temurin** (adoptium.net) — it is the open-source reference implementation, free for all uses, widely used in production.

**Which Java version?**
Use **Java 21** (current LTS). If your project requires Java 17 (older LTS), that is also fine. Avoid non-LTS versions (18, 19, 20) for learning — they become unsupported quickly.

**Available IDEs:**
- **IntelliJ IDEA** (JetBrains) — industry standard; free Community Edition is excellent
- **VS Code** with the "Extension Pack for Java" — lightweight, good for beginners
- **Eclipse** — older, used in enterprise; heavier UI`,
  code: `# Verify your JDK installation after downloading
# Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux)

java -version
# Expected output: openjdk version "21.0.x" ...

javac -version
# Expected output: javac 21.0.x

# If not found: the JDK bin directory is not in your PATH
# Fix on macOS/Linux: add to ~/.bashrc or ~/.zshrc:
#   export JAVA_HOME=/path/to/jdk
#   export PATH=$JAVA_HOME/bin:$PATH

# Fix on Windows: System Properties → Environment Variables
#   Add JAVA_HOME = C:\\Program Files\\Java\\jdk-21
#   Add to Path: %JAVA_HOME%\\bin

# Launch the Java REPL (interactive playground)
jshell
# Type: int x = 5 + 3;
# Output: x ==> 8`,
  codeTitle: 'Verifying JDK Installation',
  points: [
    'JAVA_HOME is an environment variable that points to the JDK root directory. Many build tools (Maven, Gradle, Spring Boot CLI) use it to find the JDK.',
    'You can have multiple JDK versions installed simultaneously. Tools like SDKMAN (sdkman.io) on Mac/Linux let you switch between versions with a single command.',
    'IntelliJ IDEA Community Edition is completely free and has all features needed for this course. The Ultimate Edition (paid) adds web framework support but is not required here.',
    'jshell (introduced in Java 9) is the fastest way to test a small idea — no need to create a file, class, or main method. Type an expression and see the result immediately.',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'If you are on Windows and the java command is not found after installation, you need to add the JDK to PATH. The installer sometimes does this automatically; sometimes it does not. Check: open Command Prompt, type java -version. If you see an error, follow the PATH setup steps above.',
    },
    {
      type: 'note',
      content: 'Oracle JDK requires a paid license for commercial use in production (since Oracle JDK 8u211). For learning and personal projects, it is free. For any work you intend to ship, use OpenJDK-based distributions (Adoptium, Corretto, Zulu) — they are free for all uses.',
    },
  ],
}
