export default {
  id: 'maven-project-update',
  title: '294. Maven Project Update',
  explanation: `As a Hibernate project grows, you frequently update its Maven configuration — bumping the Hibernate version, adding a connection pool, adding a caching provider, or aligning the JDBC driver. This topic covers how to update a Hibernate Maven project cleanly and reload dependencies in the IDE.

**Common updates you will make:**
- **Upgrade Hibernate** — change the \`hibernate-core\` version (e.g. from 6.2 to 6.4). Read the migration notes for breaking changes between major versions.
- **Add a connection pool** — production Hibernate should use a pool like **HikariCP** instead of the built-in one. Add \`hibernate-hikaricp\` (or configure Hikari directly).
- **Add second-level caching** — add a cache provider such as \`hibernate-jcache\` + a JCache implementation (e.g. EhCache).
- **Match the JDBC driver** — ensure the driver version is compatible with your database server.
- **Manage versions centrally** — put versions in \`<properties>\` so you change them in one place.

**Reloading after editing pom.xml:**
Editing \`pom.xml\` does not automatically refresh the IDE's classpath. You must:
- **IntelliJ IDEA** — click the "Load Maven Changes" (reimport) button, or enable auto-import.
- **Eclipse** — right-click the project → Maven → "Update Project" (Alt+F5).
- **Command line** — run \`mvn clean install\` to re-resolve and rebuild.

**Verifying the update:**
- \`mvn dependency:tree\` shows the resolved versions and reveals conflicts.
- \`mvn clean package\` confirms everything still compiles and tests pass.
- Watch for **transitive version conflicts** — Hibernate pulls in many libraries (Jakarta annotations, ANTLR, Byte Buddy). A mismatched version elsewhere can break the build.

**Best practice — centralize versions:**
Define versions once in \`<properties>\` and reference them with \`\${...}\` placeholders in each dependency. Upgrading then means changing one line.

Keeping the Maven project tidy and up to date avoids the classic "works on my machine" problems and makes framework upgrades far less painful.`,
  code: `<!-- Centralize versions in <properties> for one-place upgrades -->
<properties>
    <hibernate.version>6.4.4.Final</hibernate.version>
    <mysql.version>8.3.0</mysql.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>\${hibernate.version}</version>
    </dependency>

    <!-- Production connection pool -->
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-hikaricp</artifactId>
        <version>\${hibernate.version}</version>
    </dependency>

    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>\${mysql.version}</version>
    </dependency>
</dependencies>

<!--
  After editing pom.xml:
    IntelliJ : click "Load Maven Changes"
    Eclipse  : right-click project -> Maven -> Update Project (Alt+F5)
    CLI      : mvn clean install
  Verify    : mvn dependency:tree   (check resolved versions / conflicts)
-->`,
  codeTitle: 'Updating pom.xml and reloading the project',
  points: [
    'Common updates include upgrading hibernate-core, adding HikariCP pooling, and adding a second-level cache provider',
    'Editing pom.xml does not auto-refresh the IDE — use Load Maven Changes (IntelliJ) or Update Project (Eclipse)',
    'Run mvn clean install to re-resolve dependencies and mvn dependency:tree to inspect resolved versions and conflicts',
    'Hibernate pulls many transitive libraries, so watch for version conflicts that can break the build after an upgrade',
    'Centralize versions in <properties> and reference them with placeholders so upgrades change a single line',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Before a major Hibernate upgrade (e.g. 5.x to 6.x), always read the official migration guide. Hibernate 6 moved from the javax.persistence namespace to jakarta.persistence — a change that breaks every import in an older codebase. Knowing this in advance turns a mysterious wall of compile errors into a simple find-and-replace.',
    },
    {
      type: 'gotcha',
      content: 'After editing pom.xml, forgetting to reload the Maven project is a frequent source of confusion: the IDE keeps compiling against the old classpath, so a newly added dependency appears "not found" even though it is in pom.xml. Always trigger a Maven reload/update after changing dependencies.',
    },
  ],
}
