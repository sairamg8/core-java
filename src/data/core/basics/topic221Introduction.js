export default {
  id: 'jdbc-introduction',
  title: '221. Introduction',
  explanation: `JDBC (Java Database Connectivity) is the standard Java API for connecting to and executing SQL on relational databases. It is part of the Java SE standard library — no external library is needed to use the API itself.

**The big picture:**
Java code → JDBC API → JDBC Driver → Database

The JDBC API (in \`java.sql\` and \`javax.sql\`) defines interfaces like \`Connection\`, \`Statement\`, and \`ResultSet\`. Each database vendor (MySQL, PostgreSQL, Oracle, etc.) provides a driver — a JAR that implements these interfaces for their specific database protocol.

**What JDBC lets you do:**
- Connect to any SQL database
- Execute SQL: SELECT, INSERT, UPDATE, DELETE, DDL
- Retrieve and process results
- Manage transactions (commit, rollback)
- Execute stored procedures
- Batch multiple statements for performance

**JDBC in the Java ecosystem:**
JDBC is the foundation of the Java data access stack. Higher-level tools (Spring JDBC Template, JPA, Hibernate, MyBatis) are all built on top of JDBC. Understanding raw JDBC makes you a better user of all of them — you understand what they're doing under the hood.

**Package locations:**
\`\`\`
java.sql        — core interfaces: Connection, Statement, PreparedStatement,
                  ResultSet, DriverManager, SQLException
javax.sql       — advanced: DataSource, connection pooling, rowsets
\`\`\`

**Key interfaces (not classes):**
JDBC is interface-based — your code compiles against the interfaces, and the driver provides concrete implementations at runtime. This is why you can swap databases without changing application code.`,
  code: `// ===== JDBC Introduction — Key Interfaces =====

// All in java.sql package
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// The 5 core JDBC objects every Java developer must know:

// 1. DriverManager — creates Connection objects
//    DriverManager.getConnection(url, user, password)

// 2. Connection — represents one session with the database
//    Stays open while you work; close it when done
//    conn.createStatement()
//    conn.prepareStatement(sql)
//    conn.commit() / conn.rollback()

// 3. Statement — sends a static SQL string
//    stmt.executeQuery(sql)  → ResultSet (for SELECT)
//    stmt.executeUpdate(sql) → int (rows affected, for INSERT/UPDATE/DELETE)
//    stmt.execute(sql)       → boolean (for unknown return type)

// 4. PreparedStatement — pre-compiled SQL with parameters (preferred over Statement)
//    PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
//    ps.setInt(1, 42);
//    ResultSet rs = ps.executeQuery();

// 5. ResultSet — cursor over rows returned by a query
//    rs.next()        → advance to next row, returns false when exhausted
//    rs.getString(col)
//    rs.getInt(col)
//    rs.getDouble(col)

// The flow every JDBC program follows:
public class JdbcIntro {
    public static void main(String[] args) {
        // URL format: jdbc:<driver>://<host>:<port>/<database>
        String url  = "jdbc:mysql://localhost:3306/java_course";
        String user = "root";
        String pass = "password";

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected: " + conn.getMetaData().getDatabaseProductName());
            // Create statement → execute SQL → process results → close (auto via try-with-resources)
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
  codeTitle: 'JDBC — Key Interfaces and the Basic Flow',
  points: [
    'JDBC is Java\'s standard API for SQL database connectivity — in java.sql and javax.sql packages',
    'The JDBC API defines interfaces; each database vendor ships a driver JAR implementing them',
    'Core objects: DriverManager → Connection → Statement/PreparedStatement → ResultSet',
    'JDBC is the foundation of all Java ORM tools (Hibernate, Spring Data JPA, MyBatis)',
    'Code compiles against JDBC interfaces — swapping databases requires changing only the driver JAR and connection URL',
    'Always close Connection, Statement, and ResultSet to release database resources',
    'try-with-resources (Java 7+) is the standard pattern for auto-closing JDBC resources',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'JDBC is the foundation. Even if you end up using JPA or Hibernate in production, understanding raw JDBC is essential — it teaches you what ORMs do under the hood, helps you debug connection pool exhaustion, and lets you write raw SQL when the ORM gets in the way.',
    },
    {
      type: 'interview',
      content: 'Q: What is JDBC and why does Java need it?\nA: JDBC (Java Database Connectivity) is the standard API for connecting Java applications to relational databases. Java needs it because every database has a different wire protocol — MySQL, PostgreSQL, Oracle all communicate differently. JDBC defines a common interface; each vendor ships a driver JAR that handles their specific protocol. Your code stays database-agnostic.',
    },
    {
      type: 'gotcha',
      content: 'Forgetting to close JDBC resources (Connection, Statement, ResultSet) causes connection pool exhaustion — the application runs out of database connections and new requests block or fail. Always use try-with-resources or close in a finally block.',
    },
  ],
}
