export default {
  id: 'jdbc-template',
  title: '351. JDBCtemplate',
  explanation: `**\`JdbcTemplate\`** is the central class of Spring JDBC. It runs your SQL and handles everything tedious around it — connections, statements, result sets, and exception translation — so a query becomes a **single method call** (see [[spring-jdbc-introduction]]).

**Getting one:** in Spring Boot it is auto-configured — just inject it. Otherwise \`new JdbcTemplate(dataSource)\`.

**The core methods:**

**1. \`update\` — INSERT / UPDATE / DELETE.** Returns the number of rows affected:
\`\`\`java
jdbc.update("insert into student(name,email) values (?,?)", name, email);
jdbc.update("delete from student where id=?", id);
\`\`\`

**2. \`queryForObject\` — a single row or a single value:**
\`\`\`java
int count = jdbc.queryForObject("select count(*) from student", Integer.class);
Student s = jdbc.queryForObject("select * from student where id=?", mapper, id);
\`\`\`
Throws \`EmptyResultDataAccessException\` if **zero** rows and \`IncorrectResultSizeDataAccessException\` if **more than one**.

**3. \`query\` — many rows into a \`List\`:**
\`\`\`java
List<Student> all = jdbc.query("select * from student", mapper);
\`\`\`

**4. \`batchUpdate\` — run one statement many times efficiently.**

**Parameters and mapping:**
- **\`?\` placeholders** with varargs bind values safely — parameterised queries prevent **SQL injection**. Never concatenate user input into SQL.
- **\`RowMapper<T>\`** — a small function \`(ResultSet, rowNum) -> T\` that builds an object from one row. Reuse it across query methods.

**Why \`JdbcTemplate\` over raw JDBC:**
- No manual resource handling — it always closes connections/statements/result sets.
- Checked \`SQLException\` becomes the unchecked \`DataAccessException\` hierarchy.
- Far less code; a query drops from a dozen lines to one.

Use \`JdbcTemplate\` inside your \`@Repository\` (see [[repository-layer]]) to keep all SQL in the data-access layer.`,
  code: `@Repository
public class StudentRepository {
    private final JdbcTemplate jdbc;
    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private final RowMapper<Student> mapper = (rs, rowNum) ->
        new Student(rs.getInt("id"), rs.getString("name"));

    // INSERT / UPDATE / DELETE -> rows affected
    public int save(Student s) {
        return jdbc.update("insert into student(name) values (?)", s.getName());
    }

    // single value
    public int count() {
        return jdbc.queryForObject("select count(*) from student", Integer.class);
    }

    // single row (throws if 0 or >1 rows)
    public Student findById(int id) {
        return jdbc.queryForObject("select id, name from student where id=?", mapper, id);
    }

    // many rows
    public List<Student> findAll() {
        return jdbc.query("select id, name from student", mapper);
    }

    // batch
    public void saveAll(List<Student> list) {
        jdbc.batchUpdate("insert into student(name) values (?)",
            list, list.size(), (ps, s) -> ps.setString(1, s.getName()));
    }
}`,
  codeTitle: 'JdbcTemplate CRUD methods',
  points: [
    'JdbcTemplate is the central Spring JDBC class that runs SQL and manages connections and exceptions',
    'update runs INSERT/UPDATE/DELETE and returns the number of rows affected',
    'queryForObject fetches a single value or a single row and throws if the result is not exactly one row',
    'query returns many rows as a List using a RowMapper to build each object',
    'Use ? placeholders with bound parameters to run parameterised queries and prevent SQL injection',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What are the main JdbcTemplate methods and when do you use each?\nA: update runs INSERT, UPDATE, and DELETE and returns rows affected; queryForObject returns a single row or scalar value and throws EmptyResultDataAccessException or IncorrectResultSizeDataAccessException if the count is not exactly one; query returns a List of rows mapped by a RowMapper; and batchUpdate runs one statement many times efficiently. All of them use ? placeholders with bound parameters and handle connection cleanup and exception translation automatically.',
    },
    {
      type: 'gotcha',
      content: 'queryForObject expects exactly one row: zero rows throw EmptyResultDataAccessException and multiple rows throw IncorrectResultSizeDataAccessException. For lookups that may legitimately return nothing, use query and check whether the returned List is empty instead. Always bind values with ? placeholders — never build SQL by string concatenation, which opens SQL injection.',
    },
  ],
}
