export default {
  id: 'maven-in-intellij-idea',
  title: '274. Maven in IntelliJ IDEA IDE',
  explanation: `IntelliJ IDEA has first-class Maven integration. It reads your \`pom.xml\`, downloads dependencies, and provides a Maven tool window for running goals — no command line needed.

**Creating a Maven project in IntelliJ:**
File → New → Project → Maven Archetype (or "Maven" generator) → set GAV → Create. IntelliJ generates the project and imports it.

**Opening an existing Maven project:**
File → Open → select the folder containing \`pom.xml\`. IntelliJ detects it as a Maven project and imports it automatically.

**The Maven tool window:**
View → Tool Windows → Maven. It shows:
- **Lifecycle** — clickable phases (clean, validate, compile, test, package, install, deploy)
- **Plugins** — all plugins and their goals
- **Dependencies** — the resolved dependency tree
Double-click any phase or goal to run it.

**Auto-import:**
When you edit \`pom.xml\` (add a dependency), IntelliJ detects the change and re-imports — downloading new dependencies and updating the classpath. If auto-import is off, a refresh icon appears; click it or press the "Reload All Maven Projects" button.

**Reload Maven project:**
The circular-arrows button in the Maven tool window forces a full re-import. Use it when dependencies seem out of sync or after editing the pom manually.

**Running Maven goals:**
- Double-click a phase in the Lifecycle tree, OR
- Use the "Execute Maven Goal" command (the \`m\` icon) and type a goal like \`clean install\`

**Viewing dependencies:**
The Dependencies node shows the full tree. Right-click a dependency → "Analyze Dependencies" to find conflicts. There is also a built-in dependency diagram.

**IntelliJ uses the same Maven:**
By default IntelliJ uses its bundled Maven, but you can point it at your own installation: Settings → Build Tools → Maven → "Maven home path". This ensures the IDE build matches your command-line build.`,
  code: `// ===== Maven in IntelliJ IDEA — workflow reference =====

// 1. CREATE a Maven project:
//    File > New > Project > Maven Archetype
//      GroupId:    com.example
//      ArtifactId: my-app
//      Archetype:  org.apache.maven.archetypes:maven-archetype-quickstart
//    IntelliJ scaffolds the project and runs the initial import.

// 2. OPEN an existing one:
//    File > Open > select the folder containing pom.xml
//    IntelliJ auto-detects Maven and imports dependencies.

// 3. MAVEN TOOL WINDOW (View > Tool Windows > Maven):
//    my-app
//    +-- Lifecycle
//    |   +-- clean      <- double-click to run 'mvn clean'
//    |   +-- compile
//    |   +-- test
//    |   +-- package    <- double-click to run 'mvn package'
//    |   +-- install
//    +-- Plugins
//    +-- Dependencies   <- the resolved tree

// 4. ADD A DEPENDENCY: edit pom.xml, IntelliJ shows a reload prompt
/*
   <dependency>
     <groupId>com.google.code.gson</groupId>
     <artifactId>gson</artifactId>
     <version>2.10.1</version>
   </dependency>
*/
//    Click the "Load Maven Changes" / reload icon (Ctrl+Shift+O) to import it.

// 5. POINT INTELLIJ AT YOUR OWN MAVEN (so IDE == command line):
//    Settings > Build, Execution, Deployment > Build Tools > Maven
//      Maven home path:        /opt/apache-maven-3.9.6   (or bundled)
//      User settings file:     ~/.m2/settings.xml
//      Local repository:       ~/.m2/repository

// 6. RUN A CUSTOM GOAL:
//    Maven tool window > "Execute Maven Goal" (m icon) > type:  clean install -DskipTests

// 7. TROUBLESHOOT a stale classpath:
//    Click "Reload All Maven Projects" (circular arrows) to force a full re-import.`,
  codeTitle: 'Maven Integration in IntelliJ IDEA',
  points: [
    'IntelliJ reads pom.xml directly — open the folder containing it and the project imports automatically',
    'The Maven tool window (View > Tool Windows > Maven) shows Lifecycle phases, Plugins, and the Dependencies tree',
    'Double-click any lifecycle phase or goal in the tool window to run it without using the terminal',
    'After editing pom.xml, click "Load Maven Changes" / the reload icon to re-import and download new dependencies',
    'The "Reload All Maven Projects" button forces a full re-import when the classpath seems out of sync',
    'Point IntelliJ at your own Maven install (Settings > Build Tools > Maven) so IDE builds match command-line builds',
    'The Dependencies view and dependency analyzer help find version conflicts visually',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you add a dependency to pom.xml but your code still shows 'cannot resolve symbol', IntelliJ has not re-imported the Maven project. The new JAR is not on the IDE's classpath yet. Click the reload/Load Maven Changes icon (or enable auto-import). The dependency exists in the pom but the IDE index is stale until you reload.",
    },
    {
      type: 'interview',
      content: "Q: How does an IDE like IntelliJ use Maven?\nA: IntelliJ reads the pom.xml to understand the project's dependencies, source layout, and build configuration. It uses Maven to resolve and download dependencies into the local repository, then builds the project classpath from them. The Maven tool window lets you run lifecycle phases and goals directly. You can configure IntelliJ to use the same Maven installation and settings.xml as your command line, ensuring consistent builds.",
    },
    {
      type: 'tip',
      content: "Configure IntelliJ to use your external Maven installation rather than the bundled one (Settings > Build Tools > Maven > Maven home path). This guarantees that what builds in the IDE builds identically on the command line and CI server — eliminating 'it works in IntelliJ but fails in mvn package' discrepancies caused by different Maven versions.",
    },
  ],
}
