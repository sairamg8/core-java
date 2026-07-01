export default {
  id: 'what-is-orm-and-jpa',
  title: '402. What Is ORM and JPA?',
  explanation: `Spring Data JPA (see [[spring-data-jpa-introduction]]) sits on top of two distinct concepts that are easy to conflate: **ORM** (a general idea) and **JPA** (a Java-specific standard for it).

**ORM (Object-Relational Mapping)** is the general problem: Java code deals in objects (a \`Job\` with fields and methods); a relational database deals in tables and rows. An ORM tool bridges the mismatch — mapping a class to a table, its fields to columns, and its object references to foreign keys — so code can work with plain objects while the tool generates the SQL behind the scenes.

**JPA (Jakarta Persistence API, formerly Java Persistence API)** is a **specification** — an interface and set of annotations (\`@Entity\`, \`@Id\`, \`@Column\`, \`@OneToMany\`, etc.) that any ORM tool can implement. JPA itself has no implementation; it's a contract.

**Hibernate** (already used directly in Chapter E, see [[hibernate-configuration-using-java-without-xml]]) is the most common **implementation** of that contract. When code depends on JPA's annotations and interfaces rather than Hibernate's own classes, the underlying implementation could — in theory — be swapped for a different JPA provider (EclipseLink, OpenJPA) without changing the entity code.

**Where Spring Data JPA fits in this stack:**
\`\`\`
Your code  →  Spring Data JPA (JpaRepository interfaces)
                   │
              JPA (the specification: @Entity, EntityManager, ...)
                   │
              Hibernate (the implementation, generates actual SQL)
                   │
              JDBC driver  →  the database
\`\`\`

Spring Data JPA adds one more layer of convenience *on top of* JPA/Hibernate — instead of writing JPA code directly (an \`EntityManager\`, explicit queries), Spring Data JPA generates that code from a declared repository interface (see [[spring-data-jpa-introduction]]).`,
  code: `// JPA: the standard annotation, works regardless of ORM implementation
@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String description;
    private String profile;
    // getters, setters ...
}

// Spring Data JPA: builds on top of the JPA-annotated entity
public interface JobRepository extends JpaRepository<Job, Integer> { }`,
  codeTitle: 'JPA annotations + a Spring Data JPA repository',
  points: [
    'ORM is the general concept of mapping Java objects to relational database tables, bridging two very different data models.',
    'JPA is a specification (interfaces and annotations) for ORM in Java - it defines the contract, not an implementation.',
    'Hibernate is the most widely used implementation of the JPA specification, and the one used by default in Spring Boot.',
    'Spring Data JPA is a further convenience layer on top of JPA/Hibernate, generating repository implementations from declared interfaces.',
    'The stack, top to bottom: your code -> Spring Data JPA -> JPA (spec) -> Hibernate (implementation) -> JDBC -> database.',
  ],
  callouts: [
    { type: 'gotcha', content: 'It is easy to say "we use Hibernate" and "we use JPA" interchangeably, but they answer different questions - JPA is what your @Entity code depends on (the standard); Hibernate is what actually executes underneath it (the implementation) and could, in principle, be swapped.' },
    { type: 'interview', content: 'Q: What is the relationship between JPA and Hibernate?\nA: JPA is a specification - a set of interfaces and annotations describing how Java objects map to relational data, with no implementation of its own. Hibernate is a concrete implementation of that specification: it is the library that actually reads @Entity annotations and generates real SQL to run against a database.' },
  ],
}
