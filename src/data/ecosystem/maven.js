export default {
  id: 'maven',
  title: '1. Maven — Build Tool & Dependency Management',
  explanation: `**Maven** is the standard Java build tool. It manages dependencies, compiles code, runs tests, and packages artifacts — all driven by a single \`pom.xml\` (Project Object Model).

**Convention over configuration:** Maven follows a standard directory layout so you don't configure what's standard.

**GAV coordinates** uniquely identify every artifact: \`groupId:artifactId:version\``,
  table: {
    headers: ['Directory', 'Purpose'],
    rows: [
      ['src/main/java', 'Production source code'],
      ['src/main/resources', 'Production config files (application.properties, SQL)'],
      ['src/test/java', 'Test source code'],
      ['src/test/resources', 'Test config files'],
      ['target/', 'Compiled classes, packaged JARs (generated, not committed)'],
      ['pom.xml', 'Project descriptor — the heart of a Maven project'],
    ],
  },
  code: `<!-- pom.xml — minimal structure -->
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <!-- GAV — uniquely identifies this artifact -->
  <groupId>com.mycompany</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>jar</packaging>  <!-- jar (default), war, pom -->

  <!-- Java version -->
  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <!-- Production dependency -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.15.2</version>
    </dependency>

    <!-- Test dependency — only on test classpath -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>

    <!-- Scope options:
         compile (default) — available everywhere
         provided  — needed for compile but provided at runtime (e.g. servlet-api)
         runtime   — not needed to compile, but needed to run (e.g. JDBC driver)
         test      — test only
         import    — import dependency management (BOMs)
    -->
  </dependencies>

  <!-- Spring Boot BOM — manages versions for all Spring dependencies -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>3.2.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>

<!-- Maven Build Lifecycle (default) — each phase includes all previous -->
<!--
  validate   → check pom.xml is valid
  compile    → compile src/main/java → target/classes
  test       → run src/test/java (uses Surefire plugin)
  package    → create JAR/WAR in target/
  verify     → run integration tests
  install    → copy JAR to local ~/.m2/repository
  deploy     → push to remote repository (Nexus, Artifactory)

  Common commands:
  mvn compile            compile only
  mvn test               compile + run tests
  mvn package            compile + test + package
  mvn package -DskipTests skip tests
  mvn install            install to local repo
  mvn clean package      delete target/ then build (always do this for fresh builds)
  mvn dependency:tree    show full dependency tree
  mvn dependency:resolve download all dependencies
-->`,
  points: [
    'SNAPSHOT versions (1.0.0-SNAPSHOT) are unstable, development versions — Maven always downloads the latest snapshot. Release versions are immutable.',
    'Maven resolves transitive dependencies automatically — if A depends on B which depends on C, you get C for free. Use mvn dependency:tree to inspect.',
    'The local repository (~/.m2/repository) caches all downloaded artifacts — first build is slow, subsequent builds are fast.',
    'Multi-module projects use a parent pom.xml with <modules> — child modules inherit dependency management from the parent.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Maven compile and runtime scope?\nA: compile scope is the default — the dependency is on both the compile and runtime classpath. runtime scope means the code does not need it to compile (no import statements reference it), but it must be present at runtime. Classic example: a JDBC driver — your code only uses java.sql.* interfaces, but needs the MySQL driver JAR at runtime.',
    },
    {
      type: 'gotcha',
      content: 'Always run mvn clean package, not just mvn package, before deploying. Without clean, stale .class files from deleted source files remain in target/ and get bundled into the JAR — causing "class not found" errors that disappear on a clean build.',
    },
  ],
}
