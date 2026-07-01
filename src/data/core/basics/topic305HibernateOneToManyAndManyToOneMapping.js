export default {
  id: 'hibernate-one-to-many-and-many-to-one-mapping',
  title: '305. Hibernate One-to-Many and Many-to-One Mapping',
  explanation: `One-to-many and many-to-one are two views of the **same** relationship. A Department has many Employees (**one-to-many**); each Employee belongs to one Department (**many-to-one**). This is the most common association in real applications, so mastering it is essential.

**The natural owning side is @ManyToOne:**
In a database, the foreign key lives on the **many** side (each employee row stores its \`department_id\`). So the \`@ManyToOne\` side is the **owning** side — it holds the foreign key and drives the SQL. The \`@OneToMany\` side is the **inverse** side, mapped with \`mappedBy\`.

**@ManyToOne (owning side):**
\`\`\`
@ManyToOne
@JoinColumn(name = "department_id")
private Department department;
\`\`\`
This creates the \`department_id\` foreign-key column on the employee table.

**@OneToMany (inverse side):**
\`\`\`
@OneToMany(mappedBy = "department")
private List<Employee> employees;
\`\`\`
\`mappedBy = "department"\` tells Hibernate the relationship is already managed by the \`department\` field on Employee — so no extra join table or column is created.

**Fetch defaults:**
- \`@ManyToOne\` → EAGER by default (often changed to LAZY for performance).
- \`@OneToMany\` → LAZY by default (good — collections can be large).

**Cascade and orphan removal:**
- \`cascade = CascadeType.ALL\` on the \`@OneToMany\` side makes saving/deleting a Department cascade to its Employees.
- \`orphanRemoval = true\` deletes an Employee automatically when it is removed from the Department's collection.

**Keeping both sides in sync:**
Because the owning side is \`@ManyToOne\`, you must set \`employee.setDepartment(dept)\` for the foreign key to be written. Adding to \`department.getEmployees()\` alone will *not* persist the link. Use helper methods that update both sides.

**Avoid unidirectional @OneToMany without mappedBy:**
A unidirectional \`@OneToMany\` without \`mappedBy\` forces Hibernate to use an extra join table (or issue extra UPDATEs), which is inefficient. Prefer the bidirectional form with \`@ManyToOne\` owning the foreign key.`,
  code: `import jakarta.persistence.*;
import java.util.*;

// ---- Many side = OWNING side: FK department_id lives here ----
@Entity
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)       // owning side
    @JoinColumn(name = "department_id")        // creates the FK column
    private Department department;
}

// ---- One side = INVERSE side: mappedBy, no extra column ----
@Entity
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "department",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();

    // Helper keeps BOTH sides in sync (essential for the FK to persist)
    public void addEmployee(Employee e) {
        employees.add(e);
        e.setDepartment(this);   // updates the owning side
    }
}

// ---- Usage ----
Department dept = new Department();
dept.setName("Engineering");
Employee e = new Employee();
e.setName("Sana");
dept.addEmployee(e);      // sets both sides
session.persist(dept);   // cascade persists the employee too`,
  codeTitle: 'Bidirectional @OneToMany / @ManyToOne',
  points: [
    'One-to-many and many-to-one are two views of one relationship; the foreign key lives on the many side',
    'The @ManyToOne side is the owning side (holds the FK via @JoinColumn); @OneToMany is the inverse side with mappedBy',
    '@ManyToOne defaults to EAGER (often set LAZY); @OneToMany defaults to LAZY',
    'cascade propagates operations from parent to children; orphanRemoval deletes children removed from the collection',
    'You must update the owning (@ManyToOne) side for the FK to persist — use helper methods to sync both sides',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A unidirectional @OneToMany without mappedBy is a performance trap: Hibernate cannot put the foreign key on the many side, so it creates an extra join table or issues additional UPDATE statements after inserts. Always prefer the bidirectional form where @ManyToOne owns the foreign key, and use mappedBy on the @OneToMany side.',
    },
    {
      type: 'interview',
      content: 'Q: In a one-to-many/many-to-one relationship, which side owns the foreign key and why?\nA: The many side (the @ManyToOne side) owns the foreign key, because in the relational schema the foreign key naturally lives on the many side — each child row stores the parent id. So @ManyToOne is the owning side that drives the SQL, and @OneToMany is the inverse side declared with mappedBy. You must set the @ManyToOne reference for the foreign key to be persisted.',
    },
  ],
}
