export default {
  id: 'steps-involved-in-jdbc-app-practical',
  title: '227. Steps Involved in a JDBC App (Practical)',
  explanation: `Now that the database is set up, here is the complete practical implementation of a JDBC application — all 7 steps in working code.

**The canonical JDBC pattern:**
\`\`\`java
String url = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";

try (Connection conn = DriverManager.getConnection(url, "javaapp", "SecurePass123");
     Statement stmt = conn.createStatement();
     ResultSet rs   = stmt.executeQuery("SELECT * FROM employees")) {

    while (rs.next()) {
        System.out.println(rs.getInt("id") + " | " + rs.getString("name"));
    }
} catch (SQLException e) {
    e.printStackTrace();
}
\`\`\`

**Key ResultSet getter methods:**
| Method | SQL Type |
|--------|----------|
| \`getInt("col")\` | INT, SMALLINT, TINYINT |
| \`getString("col")\` | VARCHAR, CHAR, TEXT |
| \`getDouble("col")\` | DECIMAL, FLOAT, DOUBLE |
| \`getBoolean("col")\` | TINYINT(1), BOOLEAN |
| \`getDate("col")\` | DATE |
| \`getTimestamp("col")\` | DATETIME, TIMESTAMP |
| \`getLong("col")\` | BIGINT |

**Column access — name vs index:**
\`\`\`java
rs.getString("name")   // by column name — safer, readable
rs.getString(2)        // by column position (1-indexed) — fragile
\`\`\`
Always prefer column names over indexes.

**ResultSet metadata:**
\`\`\`java
ResultSetMetaData meta = rs.getMetaData();
int cols = meta.getColumnCount();
for (int i = 1; i <= cols; i++) {
    System.out.println(meta.getColumnName(i) + ": " + meta.getColumnTypeName(i));
}
\`\`\``,
  code: `// ===== JDBC App — Complete Practical Example =====
import java.sql.*;

public class JdbcPractical {

    // Centralize connection info (in real apps, use a config file or env vars)
    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        listAllEmployees();
        System.out.println("---");
        showColumnMetadata();
    }

    static void listAllEmployees() {
        String sql = "SELECT id, name, department, salary, hire_date FROM employees ORDER BY salary DESC";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement();
             ResultSet  rs   = stmt.executeQuery(sql)) {

            System.out.printf("%-4s %-20s %-15s %10s  %s%n",
                "ID", "Name", "Department", "Salary", "Hire Date");
            System.out.println("-".repeat(65));

            while (rs.next()) {
                int    id     = rs.getInt("id");
                String name   = rs.getString("name");
                String dept   = rs.getString("department");
                double salary = rs.getDouble("salary");
                Date   hired  = rs.getDate("hire_date");

                System.out.printf("%-4d %-20s %-15s %10.2f  %s%n",
                    id, name, dept, salary, hired);
            }

        } catch (SQLException e) {
            System.err.println("Query failed: " + e.getMessage());
            System.err.println("SQLState: " + e.getSQLState() + " | Code: " + e.getErrorCode());
        }
    }

    static void showColumnMetadata() {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement();
             ResultSet  rs   = stmt.executeQuery("SELECT * FROM employees LIMIT 0")) {

            // LIMIT 0 fetches no rows but gives us the metadata
            ResultSetMetaData meta = rs.getMetaData();
            System.out.println("Columns in employees table:");
            for (int i = 1; i <= meta.getColumnCount(); i++) {
                System.out.printf("  %d. %-20s  type=%-15s  nullable=%b%n",
                    i,
                    meta.getColumnName(i),
                    meta.getColumnTypeName(i),
                    meta.isNullable(i) == ResultSetMetaData.columnNullable
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

// Expected output:
// ID   Name                 Department      Salary  Hire Date
// ----------------------------------------------------------------
// 3    Carol White          Engineering  105000.00  2019-03-10
// 1    Alice Johnson        Engineering   95000.00  2020-01-15
// 5    Eve Kim              Marketing     78000.00  2021-11-05
// 2    Bob Smith            Marketing     72000.00  2021-06-01
// 4    David Lee            HR            68000.00  2022-09-20`,
  codeTitle: 'JDBC Practical — SELECT, ResultSet, and Metadata',
  points: [
    'Store connection constants in a central location — not scattered across every method',
    'try-with-resources with three resources auto-closes ResultSet → Statement → Connection',
    'ResultSet.next() returns false when there are no more rows — used as the while-loop condition',
    'Access columns by name (getString("name")) rather than index — safer when columns are reordered',
    'Each getXxx() method maps to a Java type — use getDouble() for DECIMAL, getDate() for DATE',
    'ResultSetMetaData provides column names, types, and nullability — useful for generic code',
    'SQLState and getErrorCode() help diagnose specific database errors beyond the message',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "ResultSet column indexes are 1-based, not 0-based. rs.getString(1) gets the first column, rs.getString(0) throws an exception. Java arrays are 0-based, but JDBC ResultSet and PreparedStatement parameters are both 1-based. This is a constant source of off-by-one errors.",
    },
    {
      type: 'tip',
      content: "Use SELECT * FROM table LIMIT 0 with ResultSetMetaData to inspect column names and types without fetching any rows. This is useful for writing generic result processors that work with any table.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between getInt('col') and getInt(1) in ResultSet?\nA: getInt('col') accesses a column by name — it's readable and safe if column order changes. getInt(1) accesses by 1-based position — faster but fragile: adding or reordering columns in the SELECT breaks the index. Always prefer column names in application code; use indexes only in performance-critical inner loops where you've verified the column order.",
    },
  ],
}
