export default {
  id: 'maven-dependencies',
  title: '271. Maven Dependencies',
  explanation: `A **dependency** is an external library your project needs. You declare it in \`pom.xml\` by its GAV, and Maven downloads it — plus everything it depends on — automatically.

**Declaring a dependency:**
\`\`\`xml
<dependencies>
  <dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
  </dependency>
</dependencies>
\`\`\`

**Dependency scopes — when the dependency is on the classpath:**

| Scope | Compile | Test | Runtime | Packaged? | Example |
|-------|---------|------|---------|-----------|---------|
| \`compile\` (default) | ✓ | ✓ | ✓ | ✓ | Gson, commons-lang |
| \`provided\` | ✓ | ✓ | ✗ | ✗ | servlet-api (container provides) |
| \`runtime\` | ✗ | ✓ | ✓ | ✓ | JDBC driver |
| \`test\` | ✗ | ✓ | ✗ | ✗ | JUnit, Mockito |
| \`system\` | ✓ | ✓ | ✗ | ✗ | local JAR (avoid) |

**Transitive dependencies:**
If you depend on Spring Context, it transitively pulls Spring Core, Spring Beans, etc. You declare ONE dependency; Maven resolves the whole tree.

**Excluding a transitive dependency:**
\`\`\`xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>6.1.0</version>
  <exclusions>
    <exclusion>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
\`\`\`

**Version conflict resolution (nearest-wins):**
If two paths bring in different versions of the same library, Maven picks the one **nearest** to your project in the dependency tree. Use \`<dependencyManagement>\` to force a specific version.

**Optional dependencies:**
\`<optional>true</optional>\` means the dependency is NOT passed transitively to projects that depend on yours.

**Finding dependencies:**
Search \`search.maven.org\` (Maven Central) for the exact GAV and copy the \`<dependency>\` snippet.`,
  code: `<!-- ===== Maven Dependencies — scopes and management ===== -->
<project>
  <!-- ... GAV ... -->

  <dependencies>

    <!-- compile (default): available everywhere, bundled in artifact -->
    <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-lang3</artifactId>
      <version>3.14.0</version>
    </dependency>

    <!-- provided: needed to compile, but the runtime container supplies it -->
    <dependency>
      <groupId>jakarta.servlet</groupId>
      <artifactId>jakarta.servlet-api</artifactId>
      <version>6.0.0</version>
      <scope>provided</scope>
    </dependency>

    <!-- runtime: not needed to compile, needed to run (e.g. JDBC driver) -->
    <dependency>
      <groupId>com.mysql</groupId>
      <artifactId>mysql-connector-j</artifactId>
      <version>8.3.0</version>
      <scope>runtime</scope>
    </dependency>

    <!-- test: only on the test classpath, never packaged -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>

    <!-- Exclude an unwanted transitive dependency -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>6.1.0</version>
      <exclusions>
        <exclusion>
          <groupId>commons-logging</groupId>
          <artifactId>commons-logging</artifactId>
        </exclusion>
      </exclusions>
    </dependency>

  </dependencies>

  <!-- dependencyManagement: declare versions ONCE, children/dependencies inherit -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.16.1</version>   <!-- forces this version everywhere -->
      </dependency>
    </dependencies>
  </dependencyManagement>

</project>

<!-- Inspect the resolved tree (shows transitive deps + chosen versions): -->
<!-- mvn dependency:tree -->
<!-- Find why a dependency is present: -->
<!-- mvn dependency:tree -Dincludes=commons-logging -->`,
  codeTitle: 'Maven Dependency Scopes, Exclusions, and Management',
  points: [
    'A dependency is declared by GAV; Maven downloads it and all its transitive dependencies automatically',
    'Scope controls classpath visibility: compile (default, everywhere), test (test only), provided (container supplies), runtime (run but not compile)',
    'provided scope (e.g. servlet-api) is on the compile classpath but excluded from the packaged artifact',
    'test scope (JUnit, Mockito) is only on the test classpath and is never bundled into the JAR/WAR',
    'Use <exclusions> to remove an unwanted transitive dependency pulled in by a direct dependency',
    'On version conflicts, Maven uses nearest-wins; <dependencyManagement> lets you force a single version across the project',
    'mvn dependency:tree shows the full resolved tree including transitive dependencies and the versions Maven chose',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Maven's nearest-wins conflict resolution can silently give you a different version than you expect. If library A needs Jackson 2.16 and library B needs Jackson 2.12, whichever is 'nearer' in the tree wins — possibly the older one, causing runtime NoSuchMethodError. Use <dependencyManagement> to pin the exact version you want, removing the ambiguity entirely.",
    },
    {
      type: 'interview',
      content: "Q: Explain the difference between compile, provided, runtime, and test scopes.\nA: compile (default): available at compile, test, and runtime, and packaged. provided: available at compile and test but supplied by the runtime environment (e.g. servlet-api from Tomcat), so not packaged. runtime: not needed to compile but needed to run (e.g. a JDBC driver), and packaged. test: only available when compiling and running tests (e.g. JUnit), never packaged. Scope controls both classpath visibility and whether the dependency ends up in the final artifact.",
    },
    {
      type: 'tip',
      content: "When you hit a mysterious version conflict, run mvn dependency:tree -Dincludes=<groupId>:<artifactId> to see exactly which dependency path pulled in the conflicting version. Then either add an <exclusion> on that path or pin the version in <dependencyManagement>. This is the standard workflow for resolving Maven dependency conflicts.",
    },
  ],
}
