export default {
  id: 'hibernate-project-setup-architecture',
  title: '288. Hibernate Project Setup Architecture',
  explanation: `Once the project is set up, it helps to see how the pieces you created map onto Hibernate's runtime architecture — how a request flows from your code, through Hibernate objects, down to JDBC and the database, and back.

**The layers, top to bottom:**

**1. Application layer (your code)**
Your \`main\` method or service class works only with entity objects and the Session/EntityManager API. It never writes SQL.

**2. Hibernate layer**
- **Configuration** loads \`hibernate.cfg.xml\` at startup.
- **SessionFactory** is built once and holds the compiled metadata and second-level cache.
- **Session** is opened per unit of work; it holds the persistence context (first-level cache) and delegates to the persistence engine.
- The **persistence engine** translates operations on entities into SQL using the configured **dialect**.

**3. JDBC layer**
Hibernate uses JDBC (\`Connection\`, \`PreparedStatement\`, \`ResultSet\`) under the hood. Connections typically come from a connection pool.

**4. Database**
The actual relational database that stores rows.

**Runtime flow of a single save:**
\`\`\`
App: session.persist(student)
   -> Session records the new entity in the persistence context
   -> On flush/commit, the persistence engine builds an INSERT
   -> Dialect formats the SQL for the target DB
   -> JDBC PreparedStatement executes it on a pooled Connection
   -> Database inserts the row
\`\`\`

**Where configuration values land:**
- \`connection.url / username / password\` -> used by JDBC to connect.
- \`dialect\` -> tells the engine which SQL syntax to generate.
- \`hbm2ddl.auto\` -> lets Hibernate create/update the schema at startup.
- \`show_sql\` -> logs the SQL the engine produces.
- \`<mapping class>\` -> tells Configuration which entities to include.

Seeing your project this way — application → Hibernate → JDBC → database — demystifies what happens between \`session.persist()\` and a row appearing in the table. Every configuration property you set has a specific place in this pipeline.`,
  code: `// The architecture expressed as a runnable bootstrap + one operation:

public class App {
    public static void main(String[] args) {

        // --- Hibernate layer: build the architecture once ---
        SessionFactory factory = new Configuration()
                .configure("hibernate.cfg.xml")   // Configuration reads settings
                .addAnnotatedClass(Student.class)
                .buildSessionFactory();           // SessionFactory (heavy, once)

        // --- Application layer: work with objects, not SQL ---
        try (Session session = factory.openSession()) {   // Session per unit of work
            Transaction tx = session.beginTransaction();

            Student s = new Student(1, "Meera", "meera@example.com");
            session.persist(s);   // -> engine -> dialect -> JDBC -> database

            tx.commit();          // flush + commit through JDBC
        }

        factory.close();          // release pooled JDBC connections on shutdown
    }
}

/* With show_sql=true you will see the engine's output in the console:
   Hibernate: insert into Student (email, name, id) values (?, ?, ?)   */`,
  codeTitle: 'Application → Hibernate → JDBC → Database in one bootstrap',
  points: [
    'Your application code works only with entities and the Session API — never with raw SQL',
    'Configuration loads settings at startup; SessionFactory (built once) holds metadata and the second-level cache',
    'The Session holds the first-level cache and delegates to the persistence engine, which builds SQL via the dialect',
    'Hibernate executes that SQL through JDBC (PreparedStatement) using pooled connections to the database',
    'Every config property has a place in the pipeline: url/credentials for JDBC, dialect for SQL syntax, hbm2ddl for schema',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Keep hibernate.show_sql=true (and format_sql=true) on while learning. Watching the exact SQL Hibernate emits for each persist, get, and query is the fastest way to build an accurate mental model of what the framework is doing on your behalf.',
    },
    {
      type: 'interview',
      content: 'Q: Walk me through what happens when you call session.persist(entity).\nA: The Session records the new entity in its persistence context (first-level cache). On flush or commit, the persistence engine generates an INSERT, the configured dialect formats it for the target database, and Hibernate executes it via a JDBC PreparedStatement on a pooled connection. The database then inserts the row, and the transaction commit makes it durable.',
    },
  ],
}
