export default {
  id: 'hibernate-project-setup',
  title: '287. Hibernate Project Setup',
  explanation: `Setting up a Hibernate project means creating a Maven project, adding the right dependencies, and providing configuration so Hibernate knows how to reach your database. This topic walks through the concrete steps.

**Step 1 — Create a Maven project**
A standard \`maven-archetype-quickstart\` JAR project is enough for learning Hibernate. You get a \`pom.xml\` and a \`src/main/java\` source tree.

**Step 2 — Add dependencies to pom.xml**
You need two things:
- **hibernate-core** — the Hibernate engine (which transitively brings JPA annotations).
- **A JDBC driver** for your database — for example \`mysql-connector-j\` for MySQL or \`h2\` for an in-memory database.

**Step 3 — Provide configuration**
Hibernate needs to know:
- The JDBC connection URL, username, and password.
- The **dialect** (which SQL flavor to generate).
- The **driver class**.
- Optional helpers like \`hibernate.hbm2ddl.auto\` (to auto-create tables) and \`hibernate.show_sql\` (to print generated SQL).

This configuration usually lives in \`src/main/resources/hibernate.cfg.xml\`.

**Step 4 — Create an entity class**
A POJO annotated with \`@Entity\` and \`@Id\`, following JavaBean conventions.

**Step 5 — Register the entity and bootstrap**
Register the entity (via \`<mapping class="..."/>\` in the XML or \`addAnnotatedClass\` in Java), build the SessionFactory, open a Session, and run an operation.

**Directory layout of a typical project:**
\`\`\`
my-hibernate-app/
├── pom.xml
└── src/main/
    ├── java/com/example/
    │   ├── Student.java        (entity)
    │   └── App.java            (main)
    └── resources/
        └── hibernate.cfg.xml   (configuration)
\`\`\`

Get these pieces in place and you can run your first save against the database — which is exactly what the next topics do.`,
  code: `<!-- pom.xml — the two dependencies you need -->
<dependencies>
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.4.4.Final</version>
    </dependency>

    <!-- JDBC driver for your database (MySQL shown) -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.3.0</version>
    </dependency>
</dependencies>

<!-- src/main/resources/hibernate.cfg.xml -->
<hibernate-configuration>
    <session-factory>
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/school</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">secret</property>
        <property name="hibernate.dialect">org.hibernate.dialect.MySQLDialect</property>
        <property name="hibernate.hbm2ddl.auto">update</property>
        <property name="hibernate.show_sql">true</property>

        <mapping class="com.example.Student"/>
    </session-factory>
</hibernate-configuration>`,
  codeTitle: 'pom.xml dependencies + hibernate.cfg.xml',
  points: [
    'Start from a maven-archetype-quickstart JAR project to get a pom.xml and standard source layout',
    'Add two dependencies: hibernate-core (the engine) and a JDBC driver for your target database',
    'Configuration (URL, username, password, dialect, driver) usually lives in src/main/resources/hibernate.cfg.xml',
    'hibernate.hbm2ddl.auto can auto-create/update tables, and hibernate.show_sql prints the generated SQL',
    'Register each entity via <mapping class="..."/> in XML or addAnnotatedClass in Java before building the SessionFactory',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'For learning and experiments, use the H2 in-memory database instead of MySQL. Add the H2 dependency, set the URL to jdbc:h2:mem:testdb and the dialect to H2Dialect, and Hibernate will create a fresh schema in memory every run — no database server to install or configure.',
    },
    {
      type: 'gotcha',
      content: 'The hibernate.cfg.xml file must sit in src/main/resources so it lands on the classpath after build. If you place it under src/main/java or elsewhere, Configuration.configure() will fail with "hibernate.cfg.xml not found." Confirm it is copied into target/classes after mvn compile.',
    },
  ],
}
