export default {
  id: 'repository-layer',
  title: '347. Repository Layer',
  explanation: `The **repository layer** (also called the **DAO** — Data Access Object — layer) is the only part of the application that talks to the **database**. It hides all persistence detail — SQL, JDBC, or ORM calls — behind clean methods so the service layer works with plain Java, never queries (see [[different-layers]]).

**Marked with \`@Repository\`:**
\`\`\`java
@Repository
public class StudentRepository {
    public Student findById(int id) { /* run a query, return a Student */ }
    public Student save(Student s)  { /* insert or update */ }
    public List<Student> findAll()  { /* select all */ }
}
\`\`\`

**Why \`@Repository\` and not just \`@Component\`:** besides registering the bean, \`@Repository\` enables **exception translation** — Spring wraps low-level, technology-specific exceptions (like a JDBC \`SQLException\` or a JPA \`PersistenceException\`) into its **unified \`DataAccessException\`** hierarchy. The service layer then catches one consistent exception type regardless of whether you use JDBC, JPA, or MongoDB underneath. That is the key benefit: your business code is decoupled from the persistence technology's exceptions.

**Responsibilities kept in the repository:**
- CRUD operations (create, read, update, delete).
- Queries and their mapping from rows to objects.
- Nothing else — **no business rules** (those live in the service).

**Implementation options:**
- **Plain JDBC / \`JdbcTemplate\`** — you write the SQL, Spring handles connections and mapping (see [[spring-jdbc-introduction]]).
- **Spring Data JPA** — you declare an interface extending \`JpaRepository\` and Spring generates the implementation, giving \`save\`, \`findById\`, \`findAll\`, and derived query methods for free.

**Why isolate data access:** you can swap the storage technology (JDBC → JPA → NoSQL) without touching the service, mock the repository to unit-test business logic without a database, and keep all query knowledge in one place.`,
  code: `// Manual repository with JdbcTemplate
@Repository
public class StudentRepository {

    private final JdbcTemplate jdbc;
    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Student findById(int id) {
        return jdbc.queryForObject(
            "select id, name from student where id = ?",
            (rs, rowNum) -> new Student(rs.getInt("id"), rs.getString("name")),
            id);
    }

    public int save(Student s) {
        return jdbc.update("insert into student(name) values (?)", s.getName());
    }
}

// Spring Data JPA: no implementation to write
public interface StudentRepositoryJpa extends JpaRepository<Student, Integer> {
    List<Student> findByName(String name);   // query derived from the method name
}`,
  codeTitle: '@Repository: JdbcTemplate and Spring Data JPA',
  points: [
    'The repository (DAO) layer is the only layer that accesses the database',
    '@Repository registers the bean and enables translation into the DataAccessException hierarchy',
    'It holds CRUD and query logic and hides SQL/ORM details from the service layer',
    'It must contain no business rules — those belong to the service',
    'Spring Data JPA can generate a repository from an interface, removing hand-written boilerplate',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the repository layer and what does @Repository add beyond @Component?\nA: The repository or DAO layer is the sole layer that talks to the database, hiding SQL and ORM details behind clean methods. Beyond registering the bean, @Repository enables Spring exception translation, wrapping technology-specific exceptions like SQLException or PersistenceException into the unified DataAccessException hierarchy, so business code depends on one consistent exception type regardless of the underlying persistence technology.',
    },
    {
      type: 'tip',
      content: 'Isolating all data access in the repository lets you swap JDBC for JPA or a NoSQL store without changing the service, and lets you unit-test business logic against a mocked repository with no real database in the loop.',
    },
  ],
}
