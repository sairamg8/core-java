export default {
  id: 'what-is-a-build-tool',
  title: '261. What is a Build Tool & Why Do We Need It',
  explanation: `A **build tool** automates the repetitive steps of turning source code into a runnable, distributable artifact. Without one, every step is manual and error-prone.

**What "building" a Java project involves:**
1. **Compile** — turn .java files into .class bytecode
2. **Manage dependencies** — download the JAR libraries your code uses
3. **Run tests** — execute unit/integration tests
4. **Package** — bundle classes + resources into a JAR or WAR
5. **Install/Deploy** — publish the artifact to a repository or server

Doing all of this by hand with \`javac\` and \`java\` commands becomes unmanageable as soon as you have more than a couple of dependencies.

**The dependency problem (the big one):**
Suppose your project uses a library like Gson. Gson itself depends on other JARs. Those depend on more JARs. This is called **transitive dependency hell**. Manually downloading the correct version of every JAR — and every JAR they need — is impractical. A build tool resolves this graph automatically.

**Without a build tool:**
\`\`\`bash
javac -cp "lib/gson.jar:lib/commons.jar:lib/..." -d out src/**/*.java
java  -cp "out:lib/gson.jar:lib/commons.jar:lib/..." com.example.Main
# You manually find, download, and list every JAR. Painful.
\`\`\`

**With a build tool (Maven):**
\`\`\`bash
mvn package   # compiles, resolves all dependencies, tests, and packages — one command
\`\`\`

**Popular Java build tools:**
- **Maven** — XML configuration (pom.xml), convention over configuration, huge ecosystem
- **Gradle** — Groovy/Kotlin DSL, faster incremental builds, used by Android
- **Ant** — older, imperative, largely replaced by Maven/Gradle

**Why it matters:**
A build tool makes builds **reproducible** — any developer on any machine runs one command and gets an identical artifact. This is the foundation of CI/CD pipelines.`,
  code: `# ===== Life WITHOUT a build tool (manual, error-prone) =====

# 1. Manually download every JAR your project needs into lib/
#    ...plus every JAR THOSE jars depend on (transitive dependencies)
#    e.g. spring-core needs spring-jcl, which needs... you track it all by hand

# 2. Compile, listing every JAR on the classpath manually
javac -cp "lib/gson-2.10.jar:lib/junit-4.13.jar:lib/hamcrest.jar" \\
      -d target/classes \\
      src/main/java/com/example/*.java

# 3. Run, repeating the entire classpath
java -cp "target/classes:lib/gson-2.10.jar:lib/junit-4.13.jar:lib/hamcrest.jar" \\
     com.example.Main

# 4. Package into a JAR by hand
jar cfe app.jar com.example.Main -C target/classes .

# As the project grows to 30+ dependencies, this becomes unmaintainable.


# ===== Life WITH Maven (automated, reproducible) =====

# All dependencies declared once in pom.xml. Then:
mvn compile     # compile source
mvn test        # compile + run tests
mvn package     # compile + test + build JAR/WAR
mvn install     # package + copy artifact to local repository

# Maven downloads every dependency (and its transitive dependencies)
# automatically, builds the classpath for you, and produces the artifact.

# A new developer clones the repo and runs ONE command:
mvn package
# Same result on every machine — reproducible builds.`,
  codeTitle: 'Manual javac/java vs Maven Build',
  points: [
    'A build tool automates compiling, dependency management, testing, packaging, and deployment of a project',
    'The hardest manual problem it solves is transitive dependency resolution — downloading the JARs your JARs depend on',
    'Without a build tool you manually list every JAR on the classpath for every javac and java command — unmaintainable at scale',
    'Build tools make builds reproducible: any developer runs one command and gets an identical artifact',
    'Maven, Gradle, and Ant are the main Java build tools — Maven uses XML (pom.xml), Gradle uses a Groovy/Kotlin DSL',
    'Reproducible builds are the foundation of CI/CD — the same build command runs on a developer laptop and the build server',
    'Convention over configuration: build tools assume a standard project layout so you write minimal configuration',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The single biggest reason build tools exist is transitive dependencies. When you add one library, it may pull in dozens of others behind the scenes. Trying to manage this by hand leads to missing classes (NoClassDefFoundError) or version conflicts (two libraries needing different versions of the same dependency). Maven resolves the entire dependency tree automatically.",
    },
    {
      type: 'interview',
      content: "Q: Why do we need a build tool like Maven instead of just using javac?\nA: javac compiles code but does nothing about dependencies, testing, packaging, or reproducibility. A build tool automates the entire lifecycle: it resolves and downloads all transitive dependencies, compiles, runs tests, and packages the artifact — all from one command. It also enforces a standard project structure, making builds reproducible across machines and enabling CI/CD pipelines.",
    },
    {
      type: 'tip',
      content: "Even for a tiny project, start with Maven (or Gradle) rather than manual javac. The moment you add your first third-party library, the build tool pays for itself. Starting with a build tool also means your project is immediately compatible with IDEs, CI servers, and other developers' workflows.",
    },
  ],
}
