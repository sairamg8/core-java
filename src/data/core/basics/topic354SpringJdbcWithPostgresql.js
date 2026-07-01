export default {
  id: 'spring-jdbc-with-postgresql',
  title: '354. Spring JDBC with PostgreSQL',
  explanation: `So far Spring JDBC examples often run on the embedded **H2** database. Moving to **PostgreSQL** — a real, persistent, production-grade database — takes just three steps because Spring Boot auto-configures the \`DataSource\` and \`JdbcTemplate\` from your properties.

**Step 1 — Add the driver.** Put the PostgreSQL JDBC driver on the classpath (Maven):
\`\`\`xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
\`\`\`

**Step 2 — Configure the connection** in \`application.properties\`. The URL, username, and password point Boot at your running Postgres instance:
\`\`\`
spring.datasource.url=jdbc:postgresql://localhost:5432/telusko
spring.datasource.username=postgres
spring.datasource.password=0000
spring.datasource.driver-class-name=org.postgresql.Driver
\`\`\`

**Step 3 — Inject and use \`JdbcTemplate\`** exactly as before. The code does not change — only the driver and URL do. That portability is the whole point of JDBC.

**Notes for Postgres specifically:**
- Unlike H2, Postgres does **not** auto-create the schema; either create tables manually, use \`schema.sql\` with \`spring.sql.init.mode=always\` (see [[schema-and-data-files]]), or let Hibernate manage DDL.
- Data **persists** across restarts, so use \`CREATE TABLE IF NOT EXISTS\` and be mindful that \`data.sql\` will try to re-insert seed rows on every boot.
- Default port is \`5432\`; the database named in the URL must already exist.`,
  code: `@Repository
public class StudentRepo {
    private final JdbcTemplate jdbc;
    public StudentRepo(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public int save(Student s) {
        return jdbc.update(
            "insert into student(id, name, marks) values (?,?,?)",
            s.getId(), s.getName(), s.getMarks());
    }

    public List<Student> findAll() {
        return jdbc.query("select * from student",
            (rs, i) -> new Student(rs.getInt("id"),
                                   rs.getString("name"),
                                   rs.getInt("marks")));
    }
}
// Same repository code works on H2 or PostgreSQL —
// only the driver dependency and datasource URL change.`,
  codeTitle: 'JdbcTemplate against PostgreSQL',
  points: [
    'Add the org.postgresql:postgresql driver dependency (runtime scope).',
    'Set spring.datasource.url/username/password to your Postgres instance (default port 5432).',
    'Spring Boot auto-configures DataSource and JdbcTemplate from those properties — no @Bean needed.',
    'Repository code is unchanged from H2; JDBC portability means only driver + URL differ.',
    'Postgres persists data and will not auto-create tables — manage the schema yourself or via schema.sql/Hibernate.',
  ],
  callouts: [
    { type: 'gotcha', content: 'The database named in the JDBC URL (for example telusko) must already exist in PostgreSQL — Boot connects to it but will not CREATE DATABASE for you. Create it with createdb or a client first.' },
    { type: 'tip', content: 'Keep credentials out of source control: reference environment variables like spring.datasource.password=${DB_PASSWORD} in properties, or use a local application-dev.properties that is gitignored.' },
    { type: 'interview', content: 'Q: What changes in your data-access code when you switch from H2 to PostgreSQL?\nA: Ideally nothing — only the driver dependency and the datasource URL/credentials. That is the benefit of coding to JdbcTemplate/JDBC rather than a specific database.' },
  ],
}
