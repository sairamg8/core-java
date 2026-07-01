export default {
  id: 'first-hibernate-application',
  title: '290. First Hibernate Application',
  explanation: `This is the "Hello World" of Hibernate: create an entity, configure Hibernate, and save one object to the database. Getting this end-to-end flow working proves your setup is correct and cements the core steps you will repeat in every Hibernate program.

**The five steps of any Hibernate operation:**
1. **Build the SessionFactory** (once) from Configuration.
2. **Open a Session** from the factory.
3. **Begin a Transaction.**
4. **Perform the operation** (persist, get, update, delete, query).
5. **Commit the transaction** and **close the Session**.

**The entity:**
A simple \`Student\` POJO annotated with \`@Entity\` and \`@Id\`. With \`hibernate.hbm2ddl.auto=update\`, Hibernate creates the \`Student\` table automatically the first time you run.

**The main method:**
Bootstraps the factory, opens a session, creates a Student object, calls \`persist()\`, and commits. When you run it (with \`show_sql=true\`), you will see Hibernate print the generated \`insert\` statement, and a new row appears in the table.

**What proves it worked:**
- The console shows \`Hibernate: insert into Student ...\`.
- Querying the database (\`SELECT * FROM student\`) shows the new row.
- No exceptions on the way out.

**Common first-run issues:**
- Wrong JDBC URL/credentials → connection exception.
- Missing dialect → Hibernate cannot generate SQL correctly.
- Entity not registered → "Unknown entity" error.
- Missing no-arg constructor → InstantiationException.

Once this works, you have a repeatable template. Every later topic (update, delete, retrieval, relationships) simply swaps out step 4 — the operation — while steps 1, 2, 3, and 5 stay the same.`,
  code: `// 1) The entity
@Entity
public class Student {
    @Id
    private int id;
    private String name;
    private String email;

    public Student() {}                       // no-arg constructor REQUIRED
    public Student(int id, String name, String email) {
        this.id = id; this.name = name; this.email = email;
    }
    // getters and setters omitted for brevity
}

// 2) The first application
public class App {
    public static void main(String[] args) {

        SessionFactory factory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(Student.class)
                .buildSessionFactory();       // step 1: build factory once

        try (Session session = factory.openSession()) {   // step 2: open session
            Transaction tx = session.beginTransaction();   // step 3: begin tx

            Student s = new Student(1, "Kiran", "kiran@example.com");
            session.persist(s);                            // step 4: the operation

            tx.commit();                                   // step 5: commit
            System.out.println("Saved student with id " + s.getId());
        }
        factory.close();
    }
}

/* Console (show_sql=true):
   Hibernate: insert into Student (email, name, id) values (?, ?, ?)
   Saved student with id 1                                          */`,
  codeTitle: 'Your first Hibernate program: save a Student',
  points: [
    'Every Hibernate operation follows five steps: build factory, open session, begin transaction, do the work, commit and close',
    'A simple @Entity with @Id plus hbm2ddl.auto=update lets Hibernate create the table on first run',
    'session.persist(object) records the entity; the INSERT is issued on flush/commit',
    'With show_sql=true you can see the generated insert statement and confirm a new row in the table',
    'Later topics reuse this template unchanged and only swap step 4 for a different operation',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting tx.commit() is a classic first-app bug: persist() only stages the change in the persistence context. Without a commit (or flush), the transaction rolls back when the session closes and no row is ever written — yet you see no error. If your insert "silently does nothing," check that you committed the transaction.',
    },
    {
      type: 'interview',
      content: 'Q: What are the steps to perform an operation in a plain Hibernate application?\nA: Build a SessionFactory once from the Configuration, open a Session from it, begin a Transaction, perform the persistence operation such as persist or get, then commit the transaction and close the Session. The SessionFactory is created once for the whole app, while a Session and Transaction are per unit of work.',
    },
  ],
}
