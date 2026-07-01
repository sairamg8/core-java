export default {
  id: 'hibernate-one-to-one-mapping',
  title: '304. Hibernate One-to-One Mapping (Unidirectional and Bidirectional)',
  explanation: `A **one-to-one** association links exactly one row of one entity to exactly one row of another — for example a Person and their Passport, or a User and their UserProfile. Hibernate maps this with \`@OneToOne\`, and you can make it unidirectional or bidirectional.

**Unidirectional one-to-one:**
Only one entity references the other. The referencing entity is the **owning side**; it holds a foreign-key column (via \`@JoinColumn\`) pointing to the other table.
\`\`\`
Person (id, name, passport_id)  ->  Passport (id, number)
\`\`\`
Person knows its Passport; Passport does not know its Person.

**Bidirectional one-to-one:**
Both entities reference each other. The owning side keeps the \`@JoinColumn\` (foreign key). The inverse side uses \`@OneToOne(mappedBy = "...")\` and does not create another foreign key — it just navigates back.

**Sharing a primary key (@MapsId):**
An alternative to a separate foreign-key column is to make the child share the parent's primary key using \`@MapsId\`. Then Passport's primary key *is* Person's id — a common, space-efficient one-to-one pattern.

**Cascade in one-to-one:**
One-to-one relationships often use \`cascade = CascadeType.ALL\` so that saving/deleting the parent automatically saves/deletes the child (e.g. deleting a Person also deletes their Passport).

**Fetch type:**
\`@OneToOne\` defaults to **EAGER**. For large or optional associations you may set it to LAZY, though lazy one-to-one has caveats (Hibernate sometimes cannot proxy an optional one-to-one and fetches eagerly anyway).

**Key annotations:**
- \`@OneToOne\` — declares the relationship.
- \`@JoinColumn(name = "...")\` — the foreign-key column on the owning side.
- \`mappedBy\` — on the inverse side of a bidirectional mapping.
- \`@MapsId\` — to share the primary key instead of adding a foreign key.

One-to-one is the simplest association, and mastering owning-vs-inverse and cascade here makes the more complex associations (one-to-many, many-to-many) easier.`,
  code: `import jakarta.persistence.*;

// ---- Owning side: holds the FK column passport_id ----
@Entity
public class Person {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToOne(cascade = CascadeType.ALL)   // saving Person saves Passport too
    @JoinColumn(name = "passport_id")       // FK column on person table
    private Passport passport;
}

// ---- Inverse side (bidirectional): navigates back via mappedBy ----
@Entity
public class Passport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String number;

    @OneToOne(mappedBy = "passport")        // no extra FK; just back-reference
    private Person person;
}

// ---- Usage ----
Person p = new Person();
p.setName("Arjun");
Passport pass = new Passport();
pass.setNumber("X1234567");
p.setPassport(pass);
pass.setPerson(p);                          // keep both sides in sync
session.persist(p);                         // cascade persists the passport too

/* Schema:
   person(id, name, passport_id)   passport(id, number)
   Alternative: @MapsId makes passport.id equal person.id (shared PK). */`,
  codeTitle: 'Unidirectional and bidirectional @OneToOne',
  points: [
    'A one-to-one association links exactly one row of each entity, e.g. Person and Passport',
    'The owning side holds the foreign key via @JoinColumn; the inverse side uses @OneToOne(mappedBy = ...)',
    '@MapsId lets the child share the parent primary key instead of adding a separate foreign-key column',
    'cascade = CascadeType.ALL is common so persisting or deleting the parent propagates to the child',
    '@OneToOne defaults to EAGER fetch; lazy one-to-one is possible but has proxying caveats',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Lazy loading on @OneToOne often does not work as expected for the optional (nullable) side. Because Hibernate must know whether the related row exists to decide between a proxy and null, it frequently issues an eager SELECT anyway. If lazy one-to-one is important, consider @MapsId (shared primary key) or making the association mandatory (optional = false).',
    },
    {
      type: 'interview',
      content: 'Q: How do you implement a one-to-one relationship in Hibernate, and what makes it bidirectional?\nA: You annotate the reference with @OneToOne and put @JoinColumn on the owning side to create the foreign key. For a bidirectional mapping, the inverse side adds @OneToOne(mappedBy = "fieldName") to navigate back without creating a second foreign key. Cascade is commonly set to ALL, and you can share the primary key with @MapsId instead of a dedicated FK column.',
    },
  ],
}
