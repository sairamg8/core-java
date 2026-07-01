export default {
  id: 'selective-insertion-with-transient-annotation',
  title: '295. Selective Insertion with @Transient Annotation',
  explanation: `Sometimes an entity has fields you do **not** want stored in the database — a computed value, a temporary flag, or a helper field. The JPA \`@Transient\` annotation tells Hibernate to ignore a field during persistence: it is not mapped to a column and is neither saved nor loaded.

**Default behavior:**
By default, Hibernate persists **every** non-static, non-transient field of an entity, creating a column for each. \`@Transient\` opts a specific field out of this.

**When to use @Transient:**
- **Derived/computed values** — e.g. a \`fullName\` built from \`firstName + lastName\`, or an \`age\` computed from \`dateOfBirth\`. Store the source data, compute the rest.
- **Temporary state** — flags used only in memory during processing.
- **Cached/expensive references** — objects you attach at runtime but do not persist.

**Two different "transient" meanings — do not confuse them:**
1. **Java's \`transient\` keyword** — affects *Java serialization* (whether a field is written when the object is serialized to bytes). It happens to also exclude a field from Hibernate mapping, but its real purpose is serialization.
2. **JPA's \`@Transient\` annotation** (\`jakarta.persistence.Transient\`) — specifically tells the JPA provider not to persist the field. This is the correct, explicit tool for ORM.

Use the **\`@Transient\` annotation** for persistence intent; it is clear and self-documenting.

**Placement:**
Put \`@Transient\` on the field (or its getter, matching your access strategy). The field still lives in the Java object normally — you can set and read it — it simply is not part of any INSERT, UPDATE, or SELECT.

This gives you "selective insertion": full control over which fields become columns, keeping derived and temporary data out of the schema.`,
  code: `import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class Student {

    @Id
    private int id;
    private String firstName;
    private String lastName;
    private int birthYear;

    // NOT persisted: computed at runtime from firstName + lastName
    @Transient
    private String fullName;

    // NOT persisted: derived from birthYear
    @Transient
    private int age;

    public String getFullName() {
        return firstName + " " + lastName;   // computed, never stored
    }

    public int getAge() {
        return java.time.Year.now().getValue() - birthYear;
    }
    // id, firstName, lastName, birthYear are persisted as columns
}

/* The generated table has NO fullName or age columns:
   create table Student (id int not null, firstName varchar,
                         lastName varchar, birthYear int, primary key (id))

   Note: JPA @Transient (jakarta.persistence.Transient) is for persistence.
   Java's 'transient' keyword is for serialization — a different concern. */`,
  codeTitle: 'Excluding fields from persistence with @Transient',
  points: [
    'By default Hibernate persists every non-static field; @Transient opts a specific field out of mapping',
    'A @Transient field gets no column and is neither saved nor loaded — it lives only in the Java object',
    'Use it for derived/computed values (fullName, age) and temporary in-memory state',
    "JPA's @Transient annotation is for persistence; Java's transient keyword is for serialization — different purposes",
    'Place @Transient on the field or getter consistent with your access strategy',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Do not confuse the JPA @Transient annotation with Java's transient keyword. The keyword controls object serialization, while @Transient (jakarta.persistence.Transient) controls persistence. Using the keyword to exclude a field from Hibernate works as a side effect but is misleading — always use the @Transient annotation to express persistence intent clearly.",
    },
    {
      type: 'interview',
      content: 'Q: What does @Transient do in JPA/Hibernate?\nA: @Transient marks an entity field as non-persistent — Hibernate creates no column for it and never includes it in INSERT, UPDATE, or SELECT statements. It is used for computed or derived values and temporary state that should live only in memory. It is distinct from the Java transient keyword, which controls serialization rather than persistence.',
    },
  ],
}
