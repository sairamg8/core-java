export default {
  id: 'steps-involved-in-developing-jdbc-app-theory',
  title: '224. Steps Involved in Developing a JDBC App (Theory)',
  explanation: `Every JDBC application follows the same sequence of steps. Understanding this flow theoretically first makes the practical implementation much clearer.

**The 7 steps of a JDBC application:**

**Step 1: Add the driver JAR to the classpath**
Add the database-specific dependency (MySQL connector, PostgreSQL JDBC, etc.) via Maven/Gradle.

**Step 2: Import java.sql classes**
\`\`\`java
import java.sql.*;
\`\`\`

**Step 3: Load the driver (JDBC 4.0+: automatic)**
Pre-JDBC 4.0: \`Class.forName("com.mysql.cj.jdbc.Driver")\`
JDBC 4.0+: automatic via ServiceLoader when JAR is on classpath.

**Step 4: Establish a Connection**
\`\`\`java
Connection conn = DriverManager.getConnection(url, user, password);
\`\`\`
This opens a TCP connection to the database and authenticates.

**Step 5: Create a Statement or PreparedStatement**
\`\`\`java
Statement stmt = conn.createStatement();
// or
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
\`\`\`

**Step 6: Execute SQL**
\`\`\`java
ResultSet rs = stmt.executeQuery("SELECT * FROM users"); // for SELECT
int rows = stmt.executeUpdate("INSERT INTO ...");         // for INSERT/UPDATE/DELETE
\`\`\`

**Step 7: Process ResultSet and Close resources**
\`\`\`java
while (rs.next()) { ... }
rs.close(); stmt.close(); conn.close();
\`\`\`
Use try-with-resources to auto-close.

**Resource closing order:** ResultSet → Statement → Connection (reverse of opening order).`,
  code: `// ===== JDBC App — All 7 Steps =====
import java.sql.*;

public class JdbcStepsTheory {

    public static void main(String[] args) {

        // STEP 1: Driver JAR added via pom.xml (mysql-connector-j)
        // STEP 2: Imports at the top of the file

        // STEP 3: Driver auto-loaded (JDBC 4.0+, no Class.forName needed)

        // STEP 4: Establish Connection
        String url  = "jdbc:mysql://localhost:3306/java_course?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pass = "password";

        // try-with-resources auto-closes all three in reverse order
        try (
            // STEP 4: Connection
            Connection conn = DriverManager.getConnection(url, user, pass);

            // STEP 5: Statement
            Statement stmt = conn.createStatement();

            // STEP 6a: Execute SELECT → ResultSet
            ResultSet rs = stmt.executeQuery("SELECT id, name, salary FROM employees")

        ) {
            // STEP 7: Process ResultSet
            System.out.printf("%-5s %-20s %10s%n", "ID", "Name", "Salary");
            System.out.println("-".repeat(38));
            while (rs.next()) {
                System.out.printf("%-5d %-20s %10.2f%n",
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDouble("salary")
                );
            }
            // Resources auto-closed: rs → stmt → conn

        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
            System.err.println("SQLState: " + e.getSQLState());
        }

        // STEP 6b: Execute DML (INSERT/UPDATE/DELETE) — separate try block
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt  = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(
                "INSERT INTO employees (name, salary) VALUES ('Alice', 75000)"
            );
            System.out.println("Inserted rows: " + rowsAffected);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

/*
 Summary of the 7 steps:
 1. Add driver JAR (pom.xml)
 2. Import java.sql.*
 3. Load driver (automatic in JDBC 4.0+)
 4. DriverManager.getConnection(url, user, pass)
 5. conn.createStatement() or conn.prepareStatement(sql)
 6. stmt.executeQuery(sql) → ResultSet
    stmt.executeUpdate(sql) → int (rows affected)
 7. Process ResultSet → close all resources (try-with-resources)
*/`,
  codeTitle: 'JDBC App — The 7 Steps End to End',
  points: [
    'Every JDBC application follows 7 steps: add JAR → import → (load driver) → connect → create statement → execute SQL → process + close',
    'JDBC 4.0+ auto-loads the driver — Class.forName() is no longer needed',
    'DriverManager.getConnection() opens a TCP connection to the database and authenticates',
    'executeQuery() is for SELECT (returns ResultSet); executeUpdate() is for INSERT/UPDATE/DELETE (returns row count)',
    'ResultSet.next() advances a cursor row by row — returns false when exhausted',
    'Close resources in reverse order: ResultSet → Statement → Connection',
    'try-with-resources (Java 7+) is the standard pattern — auto-closes in correct reverse order',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Wrap all three resources (Connection, Statement, ResultSet) in a single try-with-resources block. Java closes them in the reverse of declaration order — ResultSet first, then Statement, then Connection — which is exactly the right order.',
    },
    {
      type: 'gotcha',
      content: "Never call executeQuery() for INSERT/UPDATE/DELETE — it throws an exception in many drivers. And never call executeUpdate() for SELECT. Use executeQuery() for statements that return rows, executeUpdate() for statements that modify data, and execute() when you don't know which type it is.",
    },
    {
      type: 'interview',
      content: "Q: What are the steps to write a JDBC application?\nA: (1) Add driver JAR to classpath; (2) import java.sql.*; (3) get a Connection via DriverManager.getConnection(); (4) create a Statement or PreparedStatement; (5) execute SQL with executeQuery() or executeUpdate(); (6) iterate the ResultSet if applicable; (7) close all resources — preferably with try-with-resources.",
    },
  ],
}
