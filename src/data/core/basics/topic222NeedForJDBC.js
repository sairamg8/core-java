export default {
  id: 'need-for-jdbc',
  title: '222. Need for JDBC',
  explanation: `Before JDBC existed, Java developers had to use vendor-specific, proprietary APIs to talk to each database. Connecting to Oracle required Oracle-specific code; connecting to MySQL required completely different MySQL-specific code. Switching databases meant rewriting the entire data access layer.

**The problem JDBC solves:**

Without JDBC:
\`\`\`
Java App ──── Oracle-specific API ───▶ Oracle DB
Java App ──── MySQL-specific API  ───▶ MySQL DB
Java App ──── DB2-specific API    ───▶ DB2
\`\`\`
Changing the database = rewriting application code.

With JDBC:
\`\`\`
Java App ──── JDBC API ──── Oracle Driver ───▶ Oracle DB
                      ├─── MySQL Driver  ───▶ MySQL DB
                      └─── DB2 Driver    ───▶ DB2
\`\`\`
Changing the database = swap the driver JAR + change the connection URL. Application code unchanged.

**What JDBC gives you:**

1. **Database independence** — write once, run against any JDBC-compliant database
2. **Standard SQL execution** — execute DDL, DML, stored procedures through one unified API
3. **Transaction management** — commit, rollback, savepoints through standard methods
4. **Metadata access** — query the database schema programmatically
5. **Connection pooling support** — the \`DataSource\` interface (javax.sql) plugs into pools like HikariCP

**JDBC versions:**
| Version | Java Version | Key additions |
|---------|-------------|---------------|
| JDBC 1.0 | JDK 1.1 | Core API |
| JDBC 2.0 | Java 2 | Scrollable ResultSet, batch updates, DataSource |
| JDBC 3.0 | Java 1.4 | Savepoints, ParameterMetaData |
| JDBC 4.0 | Java 6 | Auto-loading drivers, try-with-resources, SQLXML |
| JDBC 4.3 | Java 9 | Sharding support, enhanced enquoting |`,
  code: `// ===== Need for JDBC =====

// WITHOUT JDBC — hypothetical vendor-specific APIs (fictional, but illustrates the problem)
//
// For Oracle:
// OracleConnection conn = new OracleDriver().connect(...);
// OracleStatement  stmt = conn.createOracleStatement();
//
// For MySQL:
// MySQLConnection conn = new MySQLDriver().connect(...);
// MySQLStatement  stmt = conn.createMySQLStatement();
//
// Each database required completely different classes, imports, and logic.
// Switching vendors meant rewriting all data access code.

// WITH JDBC — same interface for every database
import java.sql.*;

public class NeedForJDBC {

    // This method works with ANY JDBC-compliant database
    // Just change the URL and driver JAR
    public static void listUsers(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement();
             ResultSet rs   = stmt.executeQuery("SELECT id, name FROM users")) {
            while (rs.next()) {
                System.out.println(rs.getInt("id") + " | " + rs.getString("name"));
            }
        }
    }

    public static void main(String[] args) throws Exception {

        // MySQL connection
        String mysqlUrl = "jdbc:mysql://localhost:3306/mydb";
        try (Connection conn = DriverManager.getConnection(mysqlUrl, "root", "pass")) {
            listUsers(conn);  // same method, works with MySQL
        }

        // PostgreSQL connection — same listUsers() method, no code change
        String pgUrl = "jdbc:postgresql://localhost:5432/mydb";
        try (Connection conn = DriverManager.getConnection(pgUrl, "postgres", "pass")) {
            listUsers(conn);  // same method, works with PostgreSQL
        }

        // H2 in-memory (for tests) — same method again
        String h2Url = "jdbc:h2:mem:testdb";
        try (Connection conn = DriverManager.getConnection(h2Url, "sa", "")) {
            listUsers(conn);  // same method, works with H2
        }
    }
}

// Key insight: listUsers() has ZERO database-specific code.
// Database independence achieved through the JDBC abstraction layer.`,
  codeTitle: 'Why JDBC Exists — Database Independence',
  points: [
    'Before JDBC, every database required proprietary vendor-specific Java APIs — switching databases meant rewriting code',
    'JDBC defines a standard interface; vendor drivers implement it — your code stays database-agnostic',
    'Switching databases only requires changing the connection URL and the driver JAR — no application code changes',
    'JDBC provides: SQL execution, transaction management, metadata access, and DataSource for connection pooling',
    'JDBC 4.0 (Java 6+) added automatic driver loading — no more Class.forName() required',
    'All major ORM frameworks (JPA, Hibernate, Spring JDBC) are built on top of JDBC',
    'Database independence is the core value proposition — write once, connect to any SQL database',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The single biggest benefit of JDBC for testing: you can use an in-memory database like H2 for unit tests (fast, no external dependency) and the exact same code works against MySQL in production. Just change the connection URL and swap the JAR in test scope.',
    },
    {
      type: 'interview',
      content: "Q: Why was JDBC created?\nA: Before JDBC, every Java application that needed a database had to use that database's proprietary API. Code written for Oracle couldn't work with MySQL without a full rewrite. JDBC (introduced in JDBC 1.0 with JDK 1.1) solved this by defining a standard set of interfaces that all database vendors implement. Application code writes to the JDBC interfaces; the vendor-specific driver handles the wire protocol.",
    },
    {
      type: 'gotcha',
      content: "JDBC gives you database independence at the SQL level, but not at the SQL dialect level. MySQL's AUTO_INCREMENT vs PostgreSQL's SERIAL vs Oracle's SEQUENCE are all different. True database portability also requires writing ANSI-standard SQL and avoiding vendor-specific extensions.",
    },
  ],
}
