export default {
  id: 'spring-jdbc-introduction',
  title: '348. Spring JDBC Introduction',
  explanation: `**Spring JDBC** is Spring's thin, helpful layer over plain JDBC. It keeps you writing **SQL** (unlike a full ORM) but removes all the **boilerplate and error-prone plumbing** that raw JDBC forces on you.

**What raw JDBC makes you do by hand:**
- Open a \`Connection\`, create a \`Statement\`, execute, iterate the \`ResultSet\`.
- Handle \`SQLException\` (checked) everywhere.
- **Close** connection, statement, and result set in \`finally\` — the classic source of connection leaks.

**What Spring JDBC does for you:**
- **Manages resources** — opens and **always closes** connections/statements/result sets, even on error. No leaks.
- **Translates exceptions** — the checked \`SQLException\` becomes Spring's **unchecked \`DataAccessException\`** hierarchy, so you are not forced to catch-and-wrap everywhere.
- **Maps rows** — a \`RowMapper\` turns each \`ResultSet\` row into an object (see [[repository-layer]]).
- **The centrepiece: \`JdbcTemplate\`** — one class with \`query\`, \`queryForObject\`, \`update\`, \`batchUpdate\` methods that reduce a dozen lines of JDBC to one (see [[jdbc-template]]).

**How it fits together:**
- A **\`DataSource\`** provides pooled connections (driver URL, user, password).
- **\`JdbcTemplate\`** wraps the \`DataSource\` and runs your SQL.
- Your **\`@Repository\`** injects the \`JdbcTemplate\` and exposes clean CRUD methods.

**Spring JDBC vs full ORM (JPA/Hibernate):**
- **Spring JDBC** — you write the SQL, so you have full control and see exactly what runs; great for reports, complex queries, and when you want no ORM magic.
- **JPA/Hibernate** — maps objects to tables and generates SQL, less code for standard CRUD but more abstraction.

Spring JDBC is the sweet spot when you want SQL control **without** the connection-management pain of raw JDBC.`,
  code: `// RAW JDBC — verbose, manual close, checked exception
public Student findByIdRaw(int id) throws SQLException {
    Connection con = dataSource.getConnection();
    try {
        PreparedStatement ps = con.prepareStatement("select * from student where id=?");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) return new Student(rs.getInt("id"), rs.getString("name"));
        return null;
    } finally {
        con.close();   // must remember, or leak
    }
}

// SPRING JDBC — one line, resources and exceptions handled
public Student findById(int id) {
    return jdbcTemplate.queryForObject(
        "select id, name from student where id = ?",
        (rs, n) -> new Student(rs.getInt("id"), rs.getString("name")),
        id);
}`,
  codeTitle: 'Raw JDBC vs Spring JDBC',
  points: [
    'Spring JDBC is a thin layer over JDBC that keeps you writing SQL but removes boilerplate',
    'It opens and always closes connections, statements, and result sets, preventing leaks',
    'It translates checked SQLException into the unchecked DataAccessException hierarchy',
    'JdbcTemplate is the central class providing query, queryForObject, update, and batchUpdate',
    'It offers SQL control without the ORM abstraction of JPA/Hibernate',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What problems does Spring JDBC solve compared to plain JDBC?\nA: Plain JDBC forces you to manually open and close connections, statements, and result sets, handle checked SQLException everywhere, and iterate result sets by hand — all error-prone and leak-prone. Spring JDBC, via JdbcTemplate, manages those resources automatically, translates SQLException into an unchecked DataAccessException hierarchy, and maps rows with a RowMapper, cutting a dozen lines of boilerplate to one while still letting you write the SQL.',
    },
    {
      type: 'tip',
      content: 'Choose Spring JDBC when you want full control over the SQL and no ORM magic — reporting, complex joins, or performance-sensitive queries. Choose JPA/Hibernate when standard object-to-table CRUD dominates and you would rather not write SQL by hand.',
    },
  ],
}
