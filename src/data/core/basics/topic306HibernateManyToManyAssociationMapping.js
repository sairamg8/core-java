export default {
  id: 'hibernate-many-to-many-association-mapping',
  title: '306. Hibernate ManyToMany Association Mapping',
  explanation: `A **many-to-many** relationship is where each side can relate to many of the other: Students enroll in many Courses, and each Course has many Students. Relational databases cannot express this directly, so Hibernate maps it through a **join table** holding foreign keys to both entities.

**The join table:**
\`\`\`
student(id, name)
course(id, title)
student_course(student_id, course_id)   -- join table, both FKs
\`\`\`
The join table has no data of its own (in the simplest case) — just the two foreign keys forming the link.

**Unidirectional @ManyToMany:**
Only one side declares the relationship and defines the join table with \`@JoinTable\`:
\`\`\`
@ManyToMany
@JoinTable(name = "student_course",
    joinColumns = @JoinColumn(name = "student_id"),
    inverseJoinColumns = @JoinColumn(name = "course_id"))
private List<Course> courses;
\`\`\`

**Bidirectional @ManyToMany:**
Both sides reference each other. One side owns the join table (\`@JoinTable\`); the other is the inverse side using \`mappedBy\`. Only the owning side's changes update the join table.

**Fetch:** \`@ManyToMany\` defaults to **LAZY** (collections can be large) — keep it that way.

**Cascade caution:** Do **not** use \`CascadeType.REMOVE\` on \`@ManyToMany\`. Deleting a Student should remove join-table rows, not delete the shared Courses that other Students still reference. Typically use only PERSIST/MERGE, and let removal affect just the association.

**Sync both sides:** As with all bidirectional mappings, update both collections in memory (add the course to the student *and* the student to the course) via helper methods.

**When the join needs extra columns:**
If the relationship itself carries data — e.g. an enrollment *date* or *grade* — a plain \`@ManyToMany\` is not enough. You promote the join table to its own entity (e.g. \`Enrollment\`) with two \`@ManyToOne\` associations. This "association entity" pattern is extremely common in real systems, so recognize when \`@ManyToMany\` is too limited.`,
  code: `import jakarta.persistence.*;
import java.util.*;

// ---- Owning side: defines the join table ----
@Entity
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})  // NOT REMOVE
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private List<Course> courses = new ArrayList<>();

    public void enroll(Course c) {
        courses.add(c);
        c.getStudents().add(this);   // keep both sides in sync
    }
}

// ---- Inverse side: mappedBy points to the owning field ----
@Entity
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();
}

/* If the link carries data (grade, enrolledOn), replace @ManyToMany with
   an association entity:
     class Enrollment { @ManyToOne Student student; @ManyToOne Course course;
                        LocalDate enrolledOn; String grade; }             */`,
  codeTitle: 'Bidirectional @ManyToMany with a join table',
  points: [
    'Many-to-many means each side relates to many of the other; it is mapped through a join table of two foreign keys',
    'The owning side defines the join table with @JoinTable; the inverse side uses @ManyToMany(mappedBy = ...)',
    '@ManyToMany defaults to LAZY fetch, which is the right choice for potentially large collections',
    'Avoid CascadeType.REMOVE on @ManyToMany so deleting one entity does not delete shared related entities',
    'If the relationship carries its own data (date, grade), promote the join table to an association entity with two @ManyToOne',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never put CascadeType.REMOVE (or ALL) on a @ManyToMany. Deleting one Student would cascade into deleting Courses that other Students are still enrolled in — destroying shared data. Cascade only PERSIST/MERGE on many-to-many, and let removing an element affect just the join-table row.',
    },
    {
      type: 'interview',
      content: 'Q: How is a many-to-many relationship mapped in Hibernate, and when should you not use @ManyToMany?\nA: It is mapped with @ManyToMany and a join table (defined via @JoinTable on the owning side) that stores both foreign keys; the inverse side uses mappedBy. You should not use a plain @ManyToMany when the relationship itself carries data, such as an enrollment date or grade — in that case you promote the join table to its own entity with two @ManyToOne associations.',
    },
  ],
}
