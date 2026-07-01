export default {
  id: 'introduction-to-hibernate-association-mapping',
  title: '303. Introduction to Hibernate Association Mapping',
  explanation: `Real domain models are not isolated tables — entities relate to one another. A Student *has* an Address; a Department *has many* Employees; Students *enroll in many* Courses. **Association mapping** is how Hibernate represents these relationships between entities and translates them to foreign keys and join tables.

**The four association types:**
- **One-to-One (\`@OneToOne\`)** — one row relates to exactly one row. e.g. Person ↔ Passport.
- **One-to-Many (\`@OneToMany\`)** — one row relates to many. e.g. Department → Employees.
- **Many-to-One (\`@ManyToOne\`)** — the inverse; many rows relate to one. e.g. Employee → Department.
- **Many-to-Many (\`@ManyToMany\`)** — many relate to many, via a join table. e.g. Students ↔ Courses.

**Directionality:**
- **Unidirectional** — only one side knows about the relationship (e.g. Employee has a \`department\` field, but Department has no employees list).
- **Bidirectional** — both sides reference each other (Employee has \`department\`, Department has \`List<Employee>\`). One side is the **owning** side (controls the foreign key); the other is the **inverse** side, marked with \`mappedBy\`.

**The owning side and mappedBy:**
- The **owning side** is where the foreign key lives; changes to it drive the SQL.
- The **inverse side** uses \`mappedBy = "fieldNameOnOwningSide"\` and does *not* control the foreign key.
- Getting the owning side wrong is the most common cause of "changes not persisting" in bidirectional relationships.

**How associations map to the schema:**
- \`@ManyToOne\` / \`@OneToOne\` → a foreign-key column on the owning entity's table.
- \`@OneToMany\` → a foreign key on the *many* side's table (or a join table).
- \`@ManyToMany\` → a separate **join table** holding both foreign keys.

**Cascade and fetch:**
Each association can specify \`cascade\` (which operations propagate to related entities — persist, remove, etc.) and \`fetch\` (LAZY vs EAGER).

The following topics implement each association type in detail. This introduction gives you the vocabulary — owning vs inverse side, unidirectional vs bidirectional, cascade, and fetch — that all of them build on.`,
  code: `import jakarta.persistence.*;
import java.util.*;

// Many-to-One (owning side): the FK 'department_id' lives on Employee's table
@Entity
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")   // foreign key column
    private Department department;         // owning side
}

// One-to-Many (inverse side): mappedBy points to the field on the owning side
@Entity
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();  // inverse side
}

/* Schema:
   employee(id, name, department_id)   -- FK on the many side
   department(id, name)
   The owning side (Employee.department) controls the department_id FK.
   The inverse side (Department.employees) uses mappedBy and does not. */`,
  codeTitle: 'The four association types and owning vs inverse sides',
  points: [
    'Association mapping represents relationships between entities: one-to-one, one-to-many, many-to-one, many-to-many',
    'Associations can be unidirectional (one side knows) or bidirectional (both sides reference each other)',
    'In bidirectional mappings, the owning side holds the foreign key; the inverse side uses mappedBy',
    '@ManyToOne/@OneToOne create an FK column; @OneToMany maps to an FK on the many side; @ManyToMany uses a join table',
    'Each association can configure cascade (which operations propagate) and fetch (LAZY vs EAGER)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In a bidirectional relationship you must set BOTH sides in your Java code, even though only the owning side drives the SQL. If you add an Employee to department.getEmployees() but never call employee.setDepartment(dept), the foreign key stays null because the owning side (Employee) was never updated. Keep both sides in sync, ideally via helper methods.',
    },
    {
      type: 'interview',
      content: 'Q: What is the owning side of a bidirectional association in Hibernate?\nA: The owning side is the entity whose table holds the foreign key and whose state changes drive the generated SQL. The other side is the inverse side, declared with mappedBy pointing to the field on the owning side. Only changes to the owning side are persisted, so in a bidirectional relationship you must update the owning side (and keep both sides consistent in memory).',
    },
  ],
}
