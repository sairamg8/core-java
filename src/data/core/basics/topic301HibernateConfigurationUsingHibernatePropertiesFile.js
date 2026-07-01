export default {
  id: 'hibernate-configuration-using-hibernate-properties-file',
  title: '301. Hibernate Configuration Using hibernate.properties File',
  explanation: `Besides \`hibernate.cfg.xml\` and pure Java, Hibernate supports a third configuration style: a plain **\`hibernate.properties\`** file. It holds the same settings as key=value pairs and is picked up automatically from the classpath.

**How it works:**
- Place \`hibernate.properties\` in \`src/main/resources\` (the classpath root).
- Hibernate loads it **automatically** when you build a \`Configuration\` — you do not call \`.configure()\` with a file name.
- Because it is plain properties, it is simple to read and easy to override per environment.

**Format — same keys, key=value syntax:**
\`\`\`
hibernate.connection.driver_class=com.mysql.cj.jdbc.Driver
hibernate.connection.url=jdbc:mysql://localhost:3306/school
hibernate.connection.username=root
hibernate.connection.password=secret
hibernate.dialect=org.hibernate.dialect.MySQLDialect
hibernate.hbm2ddl.auto=update
hibernate.show_sql=true
\`\`\`

**Registering entities:**
The \`hibernate.properties\` file only holds *properties* — it cannot list \`<mapping class>\` entries the way \`hibernate.cfg.xml\` can. So you still register entities in Java with \`addAnnotatedClass(...)\`, or use automatic entity scanning.

**The three configuration styles compared:**
- **hibernate.cfg.xml** — XML; can hold both properties *and* \`<mapping>\` entries; loaded via \`.configure()\`.
- **hibernate.properties** — key=value; properties only; loaded automatically; entities registered in code.
- **Java (setProperty)** — programmatic; type-safe; dynamic values.

**Precedence:**
If both \`hibernate.properties\` and \`hibernate.cfg.xml\` are present, values set in \`hibernate.cfg.xml\` (and any set programmatically) **override** those from \`hibernate.properties\`. This lets you keep common defaults in the properties file and override specifics elsewhere.

**When to use it:**
The properties file is handy for simple, environment-specific settings and for keeping configuration readable. Many teams keep connection details in \`hibernate.properties\` and register entities in code.`,
  code: `# src/main/resources/hibernate.properties
# Loaded AUTOMATICALLY from the classpath — no .configure() call needed.
hibernate.connection.driver_class=com.mysql.cj.jdbc.Driver
hibernate.connection.url=jdbc:mysql://localhost:3306/school
hibernate.connection.username=root
hibernate.connection.password=secret
hibernate.dialect=org.hibernate.dialect.MySQLDialect
hibernate.hbm2ddl.auto=update
hibernate.show_sql=true`,
  codeTitle: 'hibernate.properties + registering entities in code',
  points: [
    'hibernate.properties holds the same settings as key=value pairs and is loaded automatically from the classpath',
    'Unlike hibernate.cfg.xml, it cannot list <mapping class> entries, so you register entities in Java with addAnnotatedClass',
    'You do not call .configure() with a file name — Hibernate picks up hibernate.properties on its own',
    'When both files exist, hibernate.cfg.xml and programmatic settings override values from hibernate.properties',
    'It suits simple, readable, environment-specific configuration while entities are registered in code',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A common surprise: hibernate.properties cannot register your entity classes. If you rely on it alone and forget to call addAnnotatedClass (or configure entity scanning), Hibernate starts up fine but throws "Unknown entity" the moment you try to persist. The properties file configures the connection; entity registration is a separate step.',
    },
    {
      type: 'interview',
      content: 'Q: What are the ways to configure Hibernate, and how does hibernate.properties differ from hibernate.cfg.xml?\nA: Hibernate can be configured via hibernate.cfg.xml (XML, loaded with .configure(), can include entity <mapping> entries), hibernate.properties (key=value, loaded automatically, properties only), or pure Java with setProperty. The properties file cannot register entities, so those are added in code. When multiple sources exist, XML and programmatic settings override the properties file.',
    },
  ],
}
