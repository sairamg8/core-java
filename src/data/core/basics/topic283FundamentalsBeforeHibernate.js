export default {
  id: 'fundamentals-before-hibernate',
  title: '283. Fundamentals Before Hibernate',
  explanation: `Hibernate will feel like magic if you jump straight into annotations without understanding what it stands on. This topic lays out the fundamentals you should be comfortable with so that Hibernate makes sense rather than mystifies.

**1. Core Java objects and JavaBeans conventions**
Hibernate maps *POJOs* (Plain Old Java Objects). Your entity classes should follow JavaBean conventions:
- A no-argument constructor (Hibernate needs it to instantiate objects via reflection).
- Private fields with public getters and setters.
- Ideally, a stable identifier field.

**2. Relational database basics**
You must be comfortable with tables, rows, columns, primary keys, foreign keys, and basic SQL (SELECT, INSERT, UPDATE, DELETE). Hibernate generates this SQL, but you need to read and reason about it.

**3. JDBC**
Hibernate is built on top of JDBC. Understanding Connection, Statement/PreparedStatement, ResultSet, and transactions helps you understand what Hibernate is automating — and helps you debug when connection or transaction issues surface.

**4. The object-relational impedance mismatch**
Objects and tables do not line up perfectly:
- Objects use references; tables use foreign keys.
- Objects support inheritance; tables do not natively.
- Objects have identity (\`==\`) and equality (\`equals\`); rows have primary keys.
- Object graphs can be deep; loading everything eagerly would be disastrous.
Hibernate exists precisely to bridge these gaps, so knowing they exist helps you understand Hibernate's design choices.

**5. Maven and dependencies**
Hibernate is added to a project as Maven dependencies. You should be comfortable editing \`pom.xml\`, adding a dependency, and running \`mvn clean package\`.

**6. XML and/or annotations**
Hibernate mappings can be expressed in XML or (far more commonly today) with annotations. Basic familiarity with both helps, though modern projects lean heavily on annotations.

If these fundamentals are solid, everything Hibernate does will read as "a convenient automation of things I already understand" rather than unexplained magic.`,
  code: `// A proper POJO / JavaBean that Hibernate can map:
public class Student {

    private int id;         // will map to the primary key
    private String name;
    private String email;

    // 1) No-arg constructor is REQUIRED by Hibernate (uses reflection)
    public Student() {
    }

    public Student(int id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // 2) Getters and setters for every persistent field
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

/* The relational table this maps to:
   CREATE TABLE student (
       id    INT PRIMARY KEY,
       name  VARCHAR(255),
       email VARCHAR(255)
   );
*/`,
  codeTitle: 'A Hibernate-ready POJO and its target table',
  points: [
    'Entities must be POJOs following JavaBean conventions: no-arg constructor, private fields, getters/setters',
    'You need working knowledge of relational basics — tables, keys, and CRUD SQL — to reason about generated SQL',
    'Hibernate sits on JDBC, so understanding Connection, PreparedStatement, ResultSet, and transactions helps',
    'The object-relational impedance mismatch (references vs. keys, inheritance, identity) is the problem Hibernate solves',
    'Comfort with Maven dependencies and with annotations (over XML) is assumed by modern Hibernate projects',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting the no-argument constructor is one of the most common beginner mistakes. Hibernate instantiates entities via reflection and needs a no-arg constructor to do so. If you only define a parameterized constructor, the compiler does not add a default one, and Hibernate will fail at runtime with an InstantiationException.',
    },
    {
      type: 'interview',
      content: 'Q: What is the object-relational impedance mismatch?\nA: It is the set of structural differences between the object-oriented model and the relational model. Objects use references, inheritance, and identity, while relational databases use foreign keys, flat tables, and primary keys. These models do not map one-to-one, and bridging that gap — for example turning object references into foreign keys — is exactly what an ORM like Hibernate does.',
    },
  ],
}
