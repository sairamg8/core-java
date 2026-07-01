export default {
  id: 'lazy-loading-vs-eager-loading',
  title: '297. Lazy Loading vs Eager Loading in Hibernate',
  explanation: `When an entity has associations (e.g. a Student with many Courses), Hibernate must decide *when* to load the related data. This is the choice between **lazy** and **eager** loading — one of the most performance-critical decisions in Hibernate.

**Eager loading (FetchType.EAGER):**
- The associated data is loaded **immediately**, together with the parent, usually via a JOIN or an extra SELECT.
- Convenient — the data is always there — but can load far more than you need, hurting performance.

**Lazy loading (FetchType.LAZY):**
- The association is **not** loaded up front. Hibernate returns a proxy/placeholder and runs the SELECT only when you actually access the collection or reference.
- Efficient — you pay only for what you use — but the data must be accessed **while the session is open**.

**Default fetch types (JPA):**
- \`@OneToMany\` and \`@ManyToMany\` → **LAZY** by default (collections can be huge).
- \`@ManyToOne\` and \`@OneToOne\` → **EAGER** by default (single reference, cheaper).

You can override any of these with \`fetch = FetchType.LAZY\` or \`FetchType.EAGER\`.

**The LazyInitializationException trap:**
If you access a lazy association *after* the session is closed, the deferred SELECT cannot run and Hibernate throws \`LazyInitializationException\`. Solutions: access the data inside the session, use a \`JOIN FETCH\` query, or use an entity graph.

**The N+1 problem (why eager is not a fix):**
Making everything eager does not solve performance — it often causes the **N+1 select problem**: loading N parents triggers N additional SELECTs for their associations (1 + N queries). The real fix is targeted \`JOIN FETCH\` or batch fetching, not blanket eager loading.

**Best-practice default:**
Prefer **LAZY** for associations and fetch what you need explicitly with \`JOIN FETCH\` in queries. Lazy-by-default keeps queries lean; you opt into loading related data precisely where you need it.`,
  code: `@Entity
public class Student {
    @Id private int id;
    private String name;

    // OneToMany defaults to LAZY — courses loaded only when accessed
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY)
    private List<Course> courses = new ArrayList<>();
}

@Entity
public class Course {
    @Id private int id;
    private String title;

    // ManyToOne defaults to EAGER — override to LAZY for performance
    @ManyToOne(fetch = FetchType.LAZY)
    private Student student;
}

// ---- Lazy access must happen while the session is OPEN ----
try (Session session = factory.openSession()) {
    Student s = session.get(Student.class, 1);
    System.out.println(s.getCourses().size());  // OK: SELECT for courses runs now
}   // session closed

// Accessing s.getCourses() HERE would throw LazyInitializationException

// ---- The right way to eagerly fetch when you need it: JOIN FETCH ----
List<Student> list = session.createQuery(
        "SELECT s FROM Student s JOIN FETCH s.courses", Student.class)
        .getResultList();   // one query, courses included — avoids N+1`,
  codeTitle: 'Lazy vs. eager fetch and JOIN FETCH',
  points: [
    'Eager loading fetches associations immediately with the parent; lazy loading defers until the association is accessed',
    '@OneToMany and @ManyToMany default to LAZY; @ManyToOne and @OneToOne default to EAGER',
    'Accessing a lazy association after the session closes throws LazyInitializationException',
    'Blanket eager loading causes the N+1 select problem rather than fixing performance',
    'Best practice: keep associations LAZY and fetch exactly what you need with JOIN FETCH or an entity graph',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The N+1 problem is the classic Hibernate performance killer: fetching a list of N parents, then touching a lazy association on each, fires 1 query for the parents plus N queries for the children — N+1 total. Watch your SQL logs; if you see a burst of near-identical SELECTs, reach for JOIN FETCH or batch fetching.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between lazy and eager loading, and what problem can eager loading cause?\nA: Lazy loading defers fetching an association until it is accessed, while eager loading fetches it immediately with the parent. Making associations eager can trigger the N+1 select problem, where loading N entities causes N extra queries for their associations. The recommended approach is lazy by default, fetching related data explicitly with JOIN FETCH where needed.',
    },
  ],
}
