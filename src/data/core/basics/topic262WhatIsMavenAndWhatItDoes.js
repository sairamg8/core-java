export default {
  id: 'what-is-maven',
  title: '262. What is Maven & What It Does',
  explanation: `**Apache Maven** is a build automation and project management tool for Java. It is driven by a single configuration file — \`pom.xml\` — and follows the principle of **convention over configuration**.

**The three things Maven does:**

**1. Dependency Management:**
You declare the libraries you need in \`pom.xml\`. Maven downloads them (and their transitive dependencies) from repositories and puts them on your classpath automatically.

**2. Build Lifecycle:**
Maven defines a standard sequence of build phases (validate → compile → test → package → install → deploy). Running \`mvn package\` automatically runs every phase up to and including \`package\`.

**3. Project Standardization:**
Maven imposes a standard directory layout. Every Maven project looks the same, so any developer can navigate any Maven project instantly.

**Convention over configuration:**
Maven assumes sensible defaults:
- Source code lives in \`src/main/java\`
- Tests live in \`src/test/java\`
- Resources live in \`src/main/resources\`
- Build output goes to \`target/\`

Because of these conventions, your \`pom.xml\` only needs to specify what is *different* from the defaults — not every detail.

**The pom.xml (Project Object Model):**
This XML file is the heart of every Maven project. It declares:
- **GAV coordinates** — groupId, artifactId, version (the project's identity)
- **Dependencies** — libraries the project needs
- **Plugins** — extensions that perform build tasks
- **Properties** — reusable values like Java version

**GAV coordinates:**
Every Maven artifact is uniquely identified by three values:
- \`groupId\` — organization/namespace (e.g. \`org.springframework\`)
- \`artifactId\` — the project name (e.g. \`spring-core\`)
- \`version\` — e.g. \`6.1.0\`

**What Maven is NOT:**
Maven is not a programming language or an IDE. It is a tool that your IDE and CI server invoke to build your project consistently.`,
  code: `<!-- ===== A minimal but complete pom.xml ===== -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <!-- The POM model version — always 4.0.0 for Maven 2/3 -->
  <modelVersion>4.0.0</modelVersion>

  <!-- ===== GAV — this project's unique identity ===== -->
  <groupId>com.example</groupId>      <!-- organization / namespace -->
  <artifactId>my-app</artifactId>     <!-- project name -->
  <version>1.0.0</version>            <!-- this release's version -->

  <!-- Packaging type: jar (default), war, pom, etc. -->
  <packaging>jar</packaging>

  <!-- ===== Properties — reusable values ===== -->
  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <!-- ===== Dependencies — libraries Maven downloads automatically ===== -->
  <dependencies>

    <!-- A dependency is also identified by GAV -->
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.10.1</version>
    </dependency>

    <!-- JUnit for testing (test scope — not bundled in the artifact) -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>

  </dependencies>

</project>`,
  codeTitle: 'Anatomy of a Maven pom.xml',
  points: [
    'Maven is a build automation and project management tool driven entirely by the pom.xml configuration file',
    'It does three core things: dependency management, executing a standard build lifecycle, and enforcing a standard project layout',
    'Convention over configuration: Maven assumes defaults (src/main/java, target/) so pom.xml only specifies what differs',
    'Every Maven artifact is uniquely identified by GAV: groupId (namespace), artifactId (name), and version',
    'The pom.xml declares GAV coordinates, dependencies, plugins, and properties for the project',
    'Maven downloads declared dependencies and all their transitive dependencies automatically from repositories',
    'modelVersion is always 4.0.0 for Maven 2 and 3 — it identifies the POM schema version, not your project version',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "GAV coordinates must be unique for every artifact. If you publish two builds with the same groupId, artifactId, AND version, the second overwrites the first in the repository (except for SNAPSHOT versions which are expected to change). Always bump the version when releasing a new build, or use a -SNAPSHOT suffix during development.",
    },
    {
      type: 'interview',
      content: "Q: What does GAV stand for and why is it important?\nA: GAV stands for groupId, artifactId, and version — the three coordinates that uniquely identify any Maven artifact. groupId is the organization namespace (like a package name), artifactId is the project name, and version is the specific release. Together they let Maven locate exactly the right JAR in a repository. Every dependency you declare and every artifact you publish is addressed by its GAV.",
    },
    {
      type: 'tip',
      content: "Use the <properties> section to define values once and reference them with ${propertyName} elsewhere in the pom. For example, define a Spring version property and use ${spring.version} across multiple Spring dependencies — then upgrading Spring means changing one line instead of many.",
    },
  ],
}
