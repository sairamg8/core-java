export default {
  id: 'jdbc',
  title: '1. JDBC — Java Database Connectivity',
  explanation: `**JDBC** is the standard Java API for connecting to relational databases. Every database (MySQL, PostgreSQL, H2, Oracle) provides a JDBC driver that implements the same interfaces — your code works the same regardless of the database.

**Core interfaces:** \`Connection\`, \`Statement\`/\`PreparedStatement\`, \`ResultSet\`, \`DataSource\`

**Always use PreparedStatement over Statement** — it prevents SQL injection and is more performant (the DB reuses the compiled query plan).`,
  code: `import java.sql.*;
import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

// ── Connection setup (low-level — prefer DataSource) ──────────────────────
String url  = "jdbc:mysql://localhost:3306/mydb?useSSL=false";
String user = "root", pass = "secret";

try (Connection conn = DriverManager.getConnection(url, user, pass)) {
    System.out.println("Connected: " + conn.getMetaData().getDatabaseProductName());
}

// ── PreparedStatement — safe, parameterized queries ────────────────────────
String sql = "SELECT id, name, email FROM users WHERE age > ? AND active = ?";

try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = conn.prepareStatement(sql)) {

    ps.setInt(1, 18);        // parameter index starts at 1
    ps.setBoolean(2, true);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            int id      = rs.getInt("id");
            String name = rs.getString("name");
            String email = rs.getString("email");
            System.out.printf("%d | %s | %s%n", id, name, email);
        }
    }
}

// ── INSERT / UPDATE / DELETE — executeUpdate() ────────────────────────────
String insert = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = conn.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {

    ps.setString(1, "Alice");
    ps.setString(2, "alice@example.com");
    ps.setInt(3, 30);
    int rowsAffected = ps.executeUpdate();

    // Get auto-generated primary key
    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            long newId = keys.getLong(1);
            System.out.println("Created user with ID: " + newId);
        }
    }
}

// ── Transactions ──────────────────────────────────────────────────────────
try (Connection conn = DriverManager.getConnection(url, user, pass)) {
    conn.setAutoCommit(false);  // begin transaction
    try {
        // transfer money between accounts
        try (PreparedStatement debit = conn.prepareStatement(
                "UPDATE accounts SET balance = balance - ? WHERE id = ?")) {
            debit.setBigDecimal(1, new java.math.BigDecimal("100.00"));
            debit.setLong(2, 1L);
            debit.executeUpdate();
        }
        try (PreparedStatement credit = conn.prepareStatement(
                "UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
            credit.setBigDecimal(1, new java.math.BigDecimal("100.00"));
            credit.setLong(2, 2L);
            credit.executeUpdate();
        }
        conn.commit();  // both succeed → commit
    } catch (SQLException e) {
        conn.rollback();  // either fails → rollback both
        throw e;
    }
}

// ── Connection Pooling — HikariCP (fastest, standard) ─────────────────────
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/mydb");
config.setUsername("postgres");
config.setPassword("secret");
config.setMaximumPoolSize(10);        // max 10 connections
config.setMinimumIdle(2);
config.setConnectionTimeout(30_000);  // 30s wait for a connection
DataSource ds = new HikariDataSource(config);
// Then: ds.getConnection() — returns a pooled connection`,
  points: [
    'NEVER concatenate user input into SQL strings — use PreparedStatement parameters for ALL user-provided values',
    'Connection pooling is essential in production — creating a JDBC Connection is expensive (TCP handshake, auth). HikariCP is the fastest pool and default in Spring Boot.',
    'Always close Connection, Statement, and ResultSet — use try-with-resources to guarantee cleanup even on exception',
    'ResultSet.next() moves to the next row and returns false when exhausted — the cursor starts BEFORE the first row',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Statement and PreparedStatement?\nA: Statement builds SQL as a string — vulnerable to SQL injection and slow (DB re-parses each time). PreparedStatement uses parameterized queries — ? placeholders are compiled once by the DB engine, values are sent separately. This prevents injection and enables the DB to reuse the query plan for better performance.',
    },
    {
      type: 'gotcha',
      content: 'setAutoCommit(false) starts a transaction — but if you forget to call commit() or rollback(), the connection holds locks until it times out. Always commit or rollback in a finally block (or use try-with-resources with a wrapper).',
    },
  ],
}
