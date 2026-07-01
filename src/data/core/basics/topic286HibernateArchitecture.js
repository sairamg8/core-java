export default {
  id: 'hibernate-architecture',
  title: '286. Hibernate Architecture',
  explanation: `Hibernate's architecture is a set of well-defined objects that cooperate to move data between your Java entities and the database. Understanding these building blocks — and their lifecycles — is essential for using Hibernate correctly.

**The key objects:**

**1. Configuration**
Reads your settings (from \`hibernate.cfg.xml\`, properties, or Java code): the JDBC URL, credentials, dialect, and the list of mapped entity classes. It is used once at startup to bootstrap Hibernate.

**2. SessionFactory**
A heavyweight, thread-safe object built from the Configuration. It holds compiled mappings, connection settings, and the second-level cache. **You create exactly one SessionFactory per database for the entire application** because it is expensive to build. It is a factory that hands out Session objects.

**3. Session**
A lightweight, **single-threaded**, short-lived object obtained from the SessionFactory. It wraps a JDBC connection and is the main interface for all persistence operations — \`persist()\`, \`get()\`, \`remove()\`, queries. It also maintains the **first-level cache** (the persistence context). You open a Session per unit of work (often per request) and close it when done.

**4. Transaction**
Represents a unit of work in the database. Obtained from the Session (\`session.beginTransaction()\`), it groups operations so they commit or roll back together.

**5. Query / TypedQuery**
Objects used to run HQL/JPQL or native SQL queries and retrieve entities or scalar values.

**The flow:**
\`\`\`
Configuration  --build-->  SessionFactory  --openSession-->  Session
                                                               |
                                                     beginTransaction()
                                                               |
                                            persist / get / query (uses JDBC)
                                                               |
                                                          commit()
                                                               |
                                                          close()
\`\`\`

**Thread-safety at a glance:**
- **SessionFactory** — thread-safe, shared, one per application. Expensive.
- **Session** — NOT thread-safe, one per thread/request. Cheap.

Getting this distinction right is the single most important architectural rule in Hibernate: build the SessionFactory once, and open a fresh Session for each unit of work.`,
  code: `// Building the architecture in a typical (native Hibernate) bootstrap:

// 1) Configuration reads settings + registers entity classes
Configuration configuration = new Configuration()
        .configure("hibernate.cfg.xml")   // JDBC url, dialect, credentials
        .addAnnotatedClass(Student.class);

// 2) SessionFactory — build ONCE, keep for the whole app (thread-safe, heavy)
SessionFactory sessionFactory = configuration.buildSessionFactory();

// 3) Session — open one per unit of work (NOT thread-safe, cheap)
try (Session session = sessionFactory.openSession()) {

    // 4) Transaction — group operations
    Transaction tx = session.beginTransaction();

    Student s = new Student(1, "Ravi", "ravi@example.com");
    session.persist(s);                 // uses the Session's JDBC connection

    tx.commit();                        // flush + commit
}

// On application shutdown, close the factory to release pooled connections:
sessionFactory.close();`,
  codeTitle: 'Configuration → SessionFactory → Session → Transaction',
  points: [
    'Configuration reads settings (URL, dialect, credentials, mapped classes) and bootstraps Hibernate at startup',
    'SessionFactory is heavyweight and thread-safe — build exactly one per database for the whole application',
    'Session is lightweight, single-threaded, and short-lived — open one per unit of work and close it afterward',
    'Session wraps a JDBC connection, holds the first-level cache, and is the main API for persist/get/query',
    'Transaction groups operations so they commit or roll back together as one atomic unit of work',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never create a SessionFactory per request — it is extremely expensive to build (it compiles all mappings and sets up pools). Creating one per request will cripple performance and exhaust connections. Build one SessionFactory at startup, share it across threads, and only ever create Sessions per request.',
    },
    {
      type: 'interview',
      content: "Q: What is the difference between SessionFactory and Session in Hibernate?\nA: SessionFactory is a heavyweight, thread-safe object created once per application from the Configuration; it holds compiled mappings and the second-level cache and produces Session instances. A Session is lightweight, not thread-safe, and short-lived — opened per unit of work, wrapping a JDBC connection and holding the first-level cache. You share one SessionFactory but open a new Session for each request or transaction.",
    },
  ],
}
