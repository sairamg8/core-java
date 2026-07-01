export default {
  id: 'student-service-and-repository',
  title: '350. Student Service and Repository',
  explanation: `A **worked example** that ties the layers together: a \`Student\` domain object, a \`StudentRepository\` for data access, and a \`StudentService\` for business logic. This is the standard shape of a Spring data-access feature (see [[different-layers]]).

**The model:**
\`\`\`java
public class Student {
    private int id;
    private String name;
    private String email;
    // constructors, getters, setters
}
\`\`\`

**The repository — data access only** (\`@Repository\` + \`JdbcTemplate\`):
- \`save\`, \`findById\`, \`findAll\` — pure CRUD, no rules.
- A \`RowMapper\` converts each row into a \`Student\`.

**The service — business logic only** (\`@Service\`):
- Validates input (name not blank, email unique).
- Calls the repository and may orchestrate other collaborators.
- Owns transactions with \`@Transactional\`.

**How they connect:** the service **depends on** the repository, injected by constructor. Spring creates both beans (both are stereotypes) and wires the repository into the service automatically (see [[annotation-autowiring]]):
\`\`\`java
@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) { this.repo = repo; }
}
\`\`\`

**Why this split matters here:** the service can be unit-tested with a **mock** \`StudentRepository\` — no database needed — and the repository can be swapped from \`JdbcTemplate\` to Spring Data JPA without the service noticing. The controller (next layer up) would then depend only on \`StudentService\`, never touching SQL. This Student example is the concrete pattern every CRUD feature follows.`,
  code: `@Repository
public class StudentRepository {
    private final JdbcTemplate jdbc;
    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private final RowMapper<Student> mapper = (rs, n) ->
        new Student(rs.getInt("id"), rs.getString("name"), rs.getString("email"));

    public int save(Student s) {
        return jdbc.update("insert into student(name,email) values (?,?)",
                           s.getName(), s.getEmail());
    }
    public Student findById(int id) {
        return jdbc.queryForObject("select * from student where id=?", mapper, id);
    }
    public List<Student> findAll() {
        return jdbc.query("select * from student", mapper);
    }
    public boolean existsByEmail(String email) {
        Integer c = jdbc.queryForObject(
            "select count(*) from student where email=?", Integer.class, email);
        return c != null && c > 0;
    }
}

@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) { this.repo = repo; }

    @Transactional
    public int register(Student s) {
        if (repo.existsByEmail(s.getEmail()))
            throw new IllegalStateException("email already used");
        return repo.save(s);
    }
    public List<Student> all() { return repo.findAll(); }
}`,
  codeTitle: 'StudentService wired to StudentRepository',
  points: [
    'A typical feature has a model (Student), a repository for data access, and a service for business logic',
    'The repository does pure CRUD with JdbcTemplate and a RowMapper — no business rules',
    'The service validates input, owns transactions, and calls the repository',
    'Spring creates both beans and injects the repository into the service by constructor',
    'This split lets you unit-test the service with a mock repository and swap the persistence technology freely',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How do a service and repository collaborate in a typical Spring feature?\nA: The repository (@Repository) exposes CRUD methods over the database and contains no business logic, while the service (@Service) validates input, enforces rules, manages transactions, and calls the repository. The service depends on the repository through constructor injection, and Spring wires them automatically. This keeps business logic testable with a mocked repository and lets the persistence implementation change without affecting the service.',
    },
    {
      type: 'tip',
      content: 'Keep the repository methods intention-revealing (findById, existsByEmail, save) and free of business decisions. All the branching and validation belongs in the service, so the same repository can serve multiple services and be reasoned about purely as data access.',
    },
  ],
}
