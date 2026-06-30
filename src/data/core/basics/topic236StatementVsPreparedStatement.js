export default {
  id: 'statement-vs-prepared-statement',
  title: '236. Statement vs PreparedStatement',
  explanation: `Both \`Statement\` and \`PreparedStatement\` execute SQL, but they differ in how SQL is compiled, how values are passed, and whether they are safe against injection.

**Statement:**
- SQL is built as a string, often by concatenation
- The full SQL string (with values embedded) is sent to the database each time
- The database parses and compiles the SQL on every call
- Vulnerable to SQL injection when values come from external input
- Good for: static SQL known at compile time, one-off DDL, admin scripts

**PreparedStatement:**
- SQL template with \`?\` placeholders is sent to the database once and compiled
- On subsequent calls, only the parameter values are sent
- Database reuses the compiled execution plan
- Values are treated as data — SQL injection is not possible
- Good for: any SQL with runtime values, repeated execution, user input

**Performance comparison:**
\`\`\`
Statement (10,000 inserts):      each insert = parse + compile + execute
PreparedStatement (10,000):      first = parse + compile + execute; rest = execute only
\`\`\`
PreparedStatement is significantly faster for repeated SQL with different values.

**Security comparison:**
\`\`\`java
// Statement — VULNERABLE
String sql = "SELECT * FROM users WHERE name = '" + input + "'";
// If input = "' OR '1'='1", all rows are returned

// PreparedStatement — SAFE
String sql = "SELECT * FROM users WHERE name = ?";
ps.setString(1, input); // input is treated as data, not SQL
\`\`\`

**When Statement is still fine:**
- Static SQL with no runtime values (e.g., \`SELECT COUNT(*) FROM employees\`)
- DDL: \`CREATE TABLE\`, \`DROP TABLE\` — PreparedStatement cannot be used for DDL in all drivers
- One-off queries in tests or administrative scripts`,
  code: `// ===== Statement vs PreparedStatement Comparison =====
import java.sql.*;

public class StatementComparison {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) throws SQLException {
        demonstrateSQLInjection();
        comparePerformance();
        showWhenToUseEach();
    }

    // Security: Statement is vulnerable, PreparedStatement is not
    static void demonstrateSQLInjection() throws SQLException {
        // Malicious input — tries to return all rows regardless of password
        String maliciousInput = "' OR '1'='1";

        System.out.println("=== SQL Injection Demo ===");

        // UNSAFE with Statement — DO NOT do this with real user input
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            // This query becomes: SELECT * FROM users WHERE name = '' OR '1'='1'
            // which returns ALL rows regardless of name
            String unsafeSql = "SELECT name FROM employees WHERE name = '" + maliciousInput + "'";
            System.out.println("Unsafe SQL: " + unsafeSql);
            try (ResultSet rs = stmt.executeQuery(unsafeSql)) {
                int count = 0;
                while (rs.next()) count++;
                System.out.println("Statement returned " + count + " row(s) — possible injection!");
            }
        }

        // SAFE with PreparedStatement — malicious input treated as plain data
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(
                     "SELECT name FROM employees WHERE name = ?")) {

            ps.setString(1, maliciousInput); // treated as literal string
            try (ResultSet rs = ps.executeQuery()) {
                int count = 0;
                while (rs.next()) count++;
                System.out.println("PreparedStatement returned " + count + " row(s) — injection blocked!");
            }
        }
    }

    // Performance: PreparedStatement is faster for repeated execution
    static void comparePerformance() throws SQLException {
        int iterations = 1000;

        // Statement: re-parses SQL every time
        long start = System.currentTimeMillis();
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            for (int i = 1; i <= iterations; i++) {
                String sql = "SELECT id FROM employees WHERE id = " + i;
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery(sql)) {
                    while (rs.next()) {} // consume results
                }
            }
        }
        long stmtTime = System.currentTimeMillis() - start;

        // PreparedStatement: compiled once, re-executed with new params
        start = System.currentTimeMillis();
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(
                     "SELECT id FROM employees WHERE id = ?")) {
            for (int i = 1; i <= iterations; i++) {
                ps.setInt(1, i);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {}
                }
            }
        }
        long psTime = System.currentTimeMillis() - start;

        System.out.printf("\\nStatement: %dms | PreparedStatement: %dms (%d iterations)%n",
                stmtTime, psTime, iterations);
    }

    // When each is appropriate
    static void showWhenToUseEach() throws SQLException {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {

            // Statement is fine for static SQL with no parameters
            try (Statement stmt = conn.createStatement();
                 ResultSet rs   = stmt.executeQuery("SELECT COUNT(*) FROM employees")) {
                rs.next();
                System.out.println("\\nEmployee count: " + rs.getInt(1));
            }

            // PreparedStatement is required when values vary at runtime
            String[] departments = {"Engineering", "QA", "DevOps"};
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT COUNT(*) FROM employees WHERE department = ?")) {
                for (String dept : departments) {
                    ps.setString(1, dept);
                    try (ResultSet rs = ps.executeQuery()) {
                        rs.next();
                        System.out.println(dept + ": " + rs.getInt(1) + " employees");
                    }
                }
            }
        }
    }
}`,
  codeTitle: 'Statement vs PreparedStatement — Security and Performance',
  points: [
    'Statement embeds values directly in SQL strings — vulnerable to SQL injection when values come from user input',
    'PreparedStatement uses ? placeholders — the database treats parameter values as data, preventing SQL injection entirely',
    'PreparedStatement SQL is compiled once by the database; subsequent calls skip parsing and reuse the execution plan',
    'PreparedStatement is significantly faster than Statement when the same SQL is executed many times with different values',
    'Statement is appropriate for static SQL known at compile time (e.g., DDL or queries with no runtime parameters)',
    'Both Statement and PreparedStatement should be used with try-with-resources to prevent resource leaks',
    'Prefer PreparedStatement as the default choice — switch to Statement only when PreparedStatement is not supported (rare DDL edge cases)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "String formatting or concatenation for SQL is NEVER safe with user input, even with validation or escaping. Blacklist filtering can be bypassed. The only reliable protection is PreparedStatement with parameterized values. Any code that builds SQL by concatenating user input should be treated as a security vulnerability.",
    },
    {
      type: 'interview',
      content: "Q: What are the two main advantages of PreparedStatement over Statement?\nA: First, security — PreparedStatement prevents SQL injection by treating all parameter values as data, never as SQL. Second, performance — the SQL template is compiled once by the database and the execution plan is cached; subsequent executions with different parameter values skip the parse/compile step. For repeated queries with varying values, PreparedStatement can be substantially faster.",
    },
    {
      type: 'tip',
      content: "Even for queries that currently use only safe, hard-coded values, consider using PreparedStatement anyway. It establishes a consistent pattern in your codebase — when someone later changes the query to accept a runtime value, they are less likely to accidentally introduce a Statement-based injection vulnerability.",
    },
  ],
}
