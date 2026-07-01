export default {
  id: 'limitations-of-jdbc-need-of-hibernate',
  title: '284. Limitations of JDBC and Need of Hibernate',
  explanation: `To appreciate why Hibernate exists, you have to feel the pain of raw JDBC in a real application. JDBC is powerful and precise, but it forces you to write a large amount of repetitive, error-prone code and leaves many concerns entirely up to you.

**Limitations of raw JDBC:**

**1. Boilerplate everywhere**
Every operation requires opening a connection, creating a statement, setting parameters, executing, reading the ResultSet, and closing resources. The same ceremony repeats for every query in the application.

**2. Manual object mapping**
JDBC gives you a ResultSet of raw columns. You must manually pull each column and set each field on your object, and reverse the process to save. This mapping code is tedious and breaks whenever the schema changes.

**3. SQL is database-specific**
JDBC SQL is often tied to a particular database's dialect (auto-increment syntax, pagination, functions). Moving from MySQL to Oracle can mean rewriting queries.

**4. No caching**
JDBC re-runs every query against the database. There is no built-in mechanism to avoid fetching the same row twice within a unit of work.

**5. Exception handling noise**
JDBC throws checked \`SQLException\` everywhere, forcing try/catch/finally blocks that clutter business logic. Forgetting to close a resource leaks connections.

**6. No relationship management**
If a Student has many Courses, JDBC gives you no help. You manually write join queries and stitch object graphs together by hand.

**7. Transaction management is manual**
You must remember to disable auto-commit, commit on success, and roll back on failure — correctly, every time.

**How Hibernate answers each limitation:**
- Removes boilerplate by generating SQL and managing resources.
- Maps objects to rows automatically via annotations.
- Uses dialects for database portability.
- Provides first- and second-level caches.
- Wraps SQLException in unchecked exceptions.
- Manages relationships with mapping annotations and lazy loading.
- Provides a clean transaction API.

Hibernate does not make JDBC obsolete — it automates the parts of JDBC that are repetitive and error-prone, letting you write far less code and focus on the domain.`,
  code: `// ---- The SAME "fetch a student by id" in JDBC vs. Hibernate ----

// JDBC: ~15 lines of ceremony, manual mapping, checked exception
public Student findByIdJdbc(int id) throws SQLException {
    String sql = "SELECT id, name, email FROM student WHERE id = ?";
    try (Connection con = dataSource.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                Student s = new Student();
                s.setId(rs.getInt("id"));
                s.setName(rs.getString("name"));
                s.setEmail(rs.getString("email"));
                return s;
            }
            return null;
        }
    }
}

// Hibernate: one line, no manual mapping, no checked exception
public Student findByIdHibernate(int id) {
    return session.get(Student.class, id);
}`,
  codeTitle: 'JDBC ceremony vs. a single Hibernate call',
  points: [
    'Raw JDBC forces repetitive boilerplate: open connection, prepare statement, set params, read ResultSet, close resources',
    'You must map columns to fields (and back) by hand, and that code breaks whenever the schema changes',
    'JDBC SQL is often database-specific and offers no caching, so every query hits the database directly',
    'Checked SQLException handling and manual transaction management clutter business logic and risk resource leaks',
    'Hibernate automates all of this — SQL generation, mapping, dialects, caching, transactions, and relationships',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Hibernate reducing boilerplate does not mean SQL knowledge is optional. Hibernate still generates SQL, and when performance problems appear (like the N+1 query problem), you must read that generated SQL to diagnose them. Developers who never learned JDBC/SQL often struggle to debug Hibernate performance issues.',
    },
    {
      type: 'interview',
      content: 'Q: Why do we need Hibernate when JDBC already works?\nA: JDBC works but forces heavy boilerplate: manual connection and resource handling, manual object-to-column mapping, database-specific SQL, manual transactions, and no caching or relationship support. Hibernate automates all of these while still running on JDBC underneath, so you write far less code, gain database portability and caching, and can focus on the domain model instead of plumbing.',
    },
  ],
}
