export default {
  id: 'the-pom-xml-file',
  title: '273. The pom.xml File',
  explanation: `The \`pom.xml\` (Project Object Model) is the single configuration file that defines a Maven project. Every Maven project has exactly one at its root.

**The essential elements:**

**1. Coordinates (GAV) — the project's identity:**
\`\`\`xml
<groupId>com.example</groupId>
<artifactId>my-app</artifactId>
<version>1.0.0</version>
<packaging>jar</packaging>
\`\`\`

**2. Properties — reusable values:**
\`\`\`xml
<properties>
  <java.version>17</java.version>
  <spring.version>6.1.0</spring.version>
</properties>
\`\`\`
Reference them anywhere with the dollar-brace syntax, e.g. the value of the spring.version property.

**3. Dependencies — libraries needed:**
Declared by GAV in the \`<dependencies>\` block.

**4. Build — plugins and build config:**
\`\`\`xml
<build>
  <finalName>my-app</finalName>
  <plugins> ... </plugins>
</build>
\`\`\`

**5. Parent — inheritance:**
\`\`\`xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.2.0</version>
</parent>
\`\`\`
A child POM inherits properties, dependency versions, and plugin config from its parent.

**Property references:**
Maven properties are referenced with the dollar-and-brace syntax. Built-in properties include the project version, base directory, and any custom property you define. Using a property for a version (like spring.version) lets you change it in one place.

**Modules — multi-module projects:**
\`\`\`xml
<packaging>pom</packaging>
<modules>
  <module>core</module>
  <module>web</module>
</modules>
\`\`\`
A parent POM with \`packaging=pom\` aggregates child modules built together.

**Minimal valid pom.xml:**
Only \`modelVersion\`, \`groupId\`, \`artifactId\`, and \`version\` are strictly required. Everything else has sensible defaults.`,
  code: `<!-- ===== A well-structured pom.xml with properties ===== -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <!-- 1. Coordinates (GAV) -->
  <groupId>com.example</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <!-- 2. Properties — define once, reference with the dollar-brace syntax -->
  <properties>
    <java.version>17</java.version>
    <spring.version>6.1.0</spring.version>
    <maven.compiler.source>\${java.version}</maven.compiler.source>
    <maven.compiler.target>\${java.version}</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <!-- 3. Dependencies — version pulled from the property -->
  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>\${spring.version}</version>   <!-- = 6.1.0 -->
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>\${spring.version}</version>   <!-- same property, one place to change -->
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <!-- 4. Build config -->
  <build>
    <finalName>my-app</finalName>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.12.1</version>
      </plugin>
    </plugins>
  </build>

</project>

<!-- ===== Built-in properties you can reference ===== -->
<!-- \${project.version}    -> this project's version (1.0.0)            -->
<!-- \${project.basedir}    -> the project root directory               -->
<!-- \${project.build.directory} -> the target/ directory               -->
<!-- \${java.version}       -> a custom property defined above           -->`,
  codeTitle: 'pom.xml Structure with Properties and References',
  points: [
    'Every Maven project has exactly one pom.xml at its root — it fully defines the project',
    'Only modelVersion, groupId, artifactId, and version are strictly required; everything else has defaults',
    'The <properties> block defines reusable values referenced with the dollar-brace syntax throughout the pom',
    'Using a property for versions (e.g. spring.version) means upgrading is a one-line change applied everywhere',
    'A <parent> POM lets a child inherit properties, dependency versions, and plugin configuration',
    'Built-in properties like project.version, project.basedir, and project.build.directory are always available',
    'A parent with packaging=pom and a <modules> list aggregates a multi-module project built together',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Property references use the dollar-and-brace syntax. A common typo is forgetting the braces or misspelling the property name — Maven then treats the literal text as the version, producing errors like 'Could not find artifact ...:${spring.version}'. If you see the unresolved property text in an error message, the property name is wrong or not defined.",
    },
    {
      type: 'interview',
      content: "Q: What is the minimum required content of a pom.xml?\nA: A valid pom.xml requires modelVersion (always 4.0.0), and the project's GAV: groupId, artifactId, and version. With just these four elements Maven can build the project using all default conventions (jar packaging, src/main/java layout, target output). Everything else — dependencies, plugins, properties, packaging — is optional and overrides the defaults.",
    },
    {
      type: 'tip',
      content: "Centralize all version numbers in the <properties> block and reference them by property. This turns version management into single-line edits and prevents the common bug where the same library appears with two different versions in different parts of the pom. For families of libraries (Spring, Jackson), one property per family keeps everything in sync.",
    },
  ],
}
