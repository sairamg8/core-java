export default {
  id: 'jpa-and-hibernate-as-orm-framework',
  title: '285. JPA and Hibernate as an ORM Framework',
  explanation: `A frequent source of confusion for beginners is the relationship between **JPA** and **Hibernate**. They are not competitors and they are not the same thing — they operate at different levels.

**JPA is a specification.**
JPA (Jakarta Persistence API, formerly Java Persistence API) is a set of **interfaces, annotations, and rules** defined as a Java standard. It says *what* a persistence provider must do — for example, that \`@Entity\` marks a persistent class and that \`EntityManager.persist()\` saves an entity — but it contains almost no working code itself. It is a contract.

**Hibernate is an implementation.**
Hibernate is a concrete framework that *implements* the JPA specification (and adds extra features of its own). It provides the actual code that turns \`@Entity\` and \`persist()\` into real SQL against a real database.

**The analogy:**
- JPA is like the JDBC API interfaces (\`Connection\`, \`Statement\`) — the standard.
- Hibernate is like a specific JDBC driver — the working implementation.
- You can swap implementations (Hibernate, EclipseLink, OpenJPA) while keeping the same JPA code, just as you can swap database drivers.

**Two ways to use Hibernate:**
1. **Native Hibernate API** — using \`SessionFactory\`, \`Session\`, and Hibernate-specific methods. More features, but ties you to Hibernate.
2. **JPA API backed by Hibernate** — using \`EntityManagerFactory\`, \`EntityManager\`, and standard JPA annotations, with Hibernate configured as the provider. Portable and the modern default (especially in Spring Boot).

**Mapping of equivalent concepts:**
\`\`\`
JPA (standard)              Hibernate (native)
---------------------------------------------
EntityManagerFactory   ->   SessionFactory
EntityManager          ->   Session
persist()              ->   persist()/save()
find()                 ->   get()
JPQL                   ->   HQL
\`\`\`

**Why it matters:**
Most annotations you will use — \`@Entity\`, \`@Id\`, \`@GeneratedValue\`, \`@OneToMany\`, \`@Column\` — come from the JPA package (\`jakarta.persistence.*\`), not from Hibernate. Understanding that you are usually writing *JPA code executed by Hibernate* explains why the same annotations work across Spring Data JPA, plain Hibernate, and other providers.`,
  code: `// These annotations come from JPA (jakarta.persistence.*),
// and Hibernate is the engine that executes them:
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    // getters / setters
}

// ---- Two ways to use Hibernate ----

// 1) Native Hibernate API (Session):
Session session = sessionFactory.openSession();
session.beginTransaction();
session.persist(new Student());
session.getTransaction().commit();

// 2) Standard JPA API, with Hibernate as the provider (EntityManager):
EntityManager em = entityManagerFactory.createEntityManager();
em.getTransaction().begin();
em.persist(new Student());
em.getTransaction().commit();`,
  codeTitle: 'JPA annotations executed by Hibernate; Session vs EntityManager',
  points: [
    'JPA is a specification — interfaces, annotations, and rules — that defines what a persistence provider must do',
    'Hibernate is an implementation of JPA that provides the actual working code and extra native features',
    'You can use Hibernate through its native API (SessionFactory/Session) or the standard JPA API (EntityManagerFactory/EntityManager)',
    'Most common annotations (@Entity, @Id, @OneToMany) come from jakarta.persistence, not from Hibernate itself',
    'Coding to the JPA standard keeps your persistence code portable across providers like Hibernate, EclipseLink, and OpenJPA',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'In modern projects, especially with Spring Boot and Spring Data JPA, you almost always code against the JPA API with Hibernate quietly configured as the default provider. Prefer JPA annotations and the EntityManager for portability, and reach for Hibernate-native features only when you specifically need something JPA does not offer.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between JPA and Hibernate?\nA: JPA is a specification — a standard set of annotations and interfaces defining how object persistence should work in Java. Hibernate is a concrete implementation of that specification that provides the real code and additional features. JPA is the contract; Hibernate is one (the most popular) provider that fulfills it, similar to how the JDBC API is a standard and a specific JDBC driver is the implementation.',
    },
  ],
}
