export default {
  id: 'hibernate-introduction',
  title: '282. Hibernate Introduction',
  explanation: `Hibernate is the most widely used **ORM (Object-Relational Mapping)** framework in the Java world. Its job is to let you work with plain Java objects while it quietly takes care of storing and retrieving those objects in a relational database — without you writing SQL by hand for every operation.

**The core idea in one sentence:**
You describe your data as Java classes (entities); Hibernate maps each class to a table, each object to a row, and each field to a column — then generates and runs the SQL for you.

**What Hibernate does for you:**
- **Persistence:** Save a Java object and Hibernate INSERTs a row.
- **Retrieval:** Ask for an object by id and Hibernate SELECTs and rebuilds it.
- **Updates & deletes:** Change a managed object and Hibernate figures out the UPDATE; delete it and Hibernate issues the DELETE.
- **Query language:** HQL/JPQL lets you query using entity and field names instead of table and column names.
- **Caching:** A first-level cache (per session) and an optional second-level cache reduce redundant database trips.
- **Database portability:** Dialects let the same code run on MySQL, PostgreSQL, Oracle, H2, and more.

**Where Hibernate sits:**
\`\`\`
Your Java code  ->  Hibernate  ->  JDBC  ->  Database
\`\`\`
Hibernate does not replace JDBC — it sits on top of it. Under the hood, Hibernate still opens JDBC connections and executes SQL; it just generates that SQL and manages the plumbing so you do not have to.

**Hibernate and JPA:**
JPA (Jakarta Persistence API) is a *specification* — a set of interfaces and annotations. Hibernate is the most popular *implementation* of that specification. So when you write \`@Entity\`, \`@Id\`, \`@OneToMany\`, you are using JPA annotations, and Hibernate is the engine executing them.

**Why it matters:**
Without an ORM, a large application drowns in repetitive JDBC boilerplate — opening connections, building SQL strings, mapping ResultSets to objects, handling exceptions, closing resources. Hibernate removes almost all of that, letting you focus on business logic and object models instead of database plumbing.`,
  code: `// Without Hibernate (raw JDBC) — verbose and repetitive:
String sql = "INSERT INTO student (id, name, email) VALUES (?, ?, ?)";
try (PreparedStatement ps = connection.prepareStatement(sql)) {
    ps.setInt(1, student.getId());
    ps.setString(2, student.getName());
    ps.setString(3, student.getEmail());
    ps.executeUpdate();
}

// With Hibernate — you work with the object, not SQL:
Student student = new Student(1, "Asha", "asha@example.com");
session.persist(student);   // Hibernate generates and runs the INSERT

// The entity class that makes this possible:
@Entity
@Table(name = "student")
public class Student {
    @Id
    private int id;
    private String name;
    private String email;
    // constructors, getters, setters
}`,
  codeTitle: 'JDBC boilerplate vs. Hibernate persistence',
  points: [
    'Hibernate is an ORM framework: it maps Java classes to tables, objects to rows, and fields to columns',
    'It generates SQL for save, retrieve, update, and delete so you do not write it by hand',
    'Hibernate runs on top of JDBC — it manages connections and SQL rather than replacing the JDBC layer',
    'JPA is the specification (annotations/interfaces); Hibernate is the most popular implementation of it',
    'HQL/JPQL lets you query using entity and field names, and caching plus dialects add performance and portability',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Think of Hibernate as a translator between two worlds that do not naturally match: the object world (classes, references, inheritance) and the relational world (tables, foreign keys, joins). This mismatch is called the "object-relational impedance mismatch," and bridging it is precisely the problem ORMs exist to solve.',
    },
    {
      type: 'interview',
      content: 'Q: What is Hibernate and how does it relate to JPA?\nA: Hibernate is an ORM framework that maps Java objects to relational database tables and generates the SQL to persist and query them. JPA is a specification that defines the standard persistence annotations and interfaces; Hibernate is the most widely used implementation of that specification, so JPA annotations like @Entity and @Id are executed by the Hibernate engine.',
    },
  ],
}
