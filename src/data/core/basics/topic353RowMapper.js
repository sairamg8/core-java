export default {
  id: 'row-mapper',
  title: '353. RowMapper',
  explanation: `A **\`RowMapper<T>\`** tells \`JdbcTemplate\` how to turn **one row** of a \`ResultSet\` into **one Java object**. JDBC gives you rows and columns; your app wants objects. \`RowMapper\` is the bridge (see [[jdbc-template]]).

**The interface** has a single method:
\`\`\`java
T mapRow(ResultSet rs, int rowNum) throws SQLException;
\`\`\`
Spring calls it once per row. You read columns from \`rs\` and return a populated object. You never call \`rs.next()\` yourself — \`JdbcTemplate\` handles iteration, resource closing, and exception translation.

**Three ways to write one:**

**1. Lambda** (cleanest for a one-off):
\`\`\`java
RowMapper<Student> mapper = (rs, rowNum) ->
    new Student(rs.getInt("id"), rs.getString("name"), rs.getInt("marks"));
\`\`\`

**2. A named class** implementing \`RowMapper<Student>\` — reusable and testable, good when the mapping is non-trivial.

**3. \`BeanPropertyRowMapper\`** — maps columns to bean properties automatically by name (\`first_name\` column to \`setFirstName\`). Zero boilerplate, but needs a no-arg constructor and matching names:
\`\`\`java
new BeanPropertyRowMapper<>(Student.class)
\`\`\`

You pass the mapper into \`query(...)\` for many rows or \`queryForObject(...)\` for a single row.`,
  code: `// Reusable RowMapper as a field in the repository
@Repository
public class StudentRepo {
    private final JdbcTemplate jdbc;
    public StudentRepo(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private final RowMapper<Student> mapper = (rs, rowNum) -> {
        Student s = new Student();
        s.setId(rs.getInt("id"));
        s.setName(rs.getString("name"));
        s.setMarks(rs.getInt("marks"));
        return s;
    };

    public List<Student> findAll() {
        return jdbc.query("select * from student", mapper);
    }

    public Student findById(int id) {
        return jdbc.queryForObject(
            "select * from student where id=?", mapper, id);
    }
}`,
  codeTitle: 'RowMapper in a repository',
  points: [
    'RowMapper<T> has one method: mapRow(ResultSet rs, int rowNum) — maps one row to one object.',
    'You never call rs.next(); JdbcTemplate iterates rows and calls mapRow once per row.',
    'Write it as a lambda for one-offs, or a named class for reusable/complex mappings.',
    'BeanPropertyRowMapper auto-maps columns to bean setters by name (needs a no-arg constructor).',
    'Pass the mapper to query(...) for a List or queryForObject(...) for a single object.',
  ],
  callouts: [
    { type: 'gotcha', content: 'BeanPropertyRowMapper matches column names to property names loosely (underscores to camelCase), but if a column has no matching setter it is silently skipped — leaving that field null. Double-check your column aliases.' },
    { type: 'tip', content: 'Keep one RowMapper instance as a private final field and reuse it across findAll, findById, and search methods rather than re-creating a lambda each call.' },
    { type: 'interview', content: 'Q: Difference between RowMapper and ResultSetExtractor?\nA: RowMapper maps ONE row at a time (Spring loops for you); ResultSetExtractor is handed the WHOLE ResultSet so you control iteration — useful for joins that collapse many rows into one object.' },
  ],
}
