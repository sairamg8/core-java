export default {
  id: 'retrieving-records-from-database',
  title: '231. Retrieving Records from the Database',
  explanation: `Retrieving records uses \`executeQuery()\` which returns a \`ResultSet\` — a cursor that points to rows returned by a SELECT statement.

**How ResultSet works:**
The cursor starts before the first row. You call \`rs.next()\` to move to the next row. It returns \`true\` if there was a row, \`false\` when rows are exhausted. You read columns by name or by 1-based index.

**Reading columns:**
\`\`\`java
while (rs.next()) {
    int id        = rs.getInt("id");
    String name   = rs.getString("name");
    double salary = rs.getDouble("salary");
}
\`\`\`

Column getters match the SQL type:
- \`getInt()\`, \`getLong()\` — integer types
- \`getDouble()\`, \`getBigDecimal()\` — decimal types
- \`getString()\` — VARCHAR, CHAR, TEXT
- \`getDate()\`, \`getTimestamp()\` — date/time types

**ResultSet must be closed:**
ResultSet, Statement, and Connection are all \`AutoCloseable\`. Use try-with-resources to guarantee all three are closed even if an exception is thrown.

**SELECT with WHERE:**
Narrow results at the database level — not in Java. Fetching 10,000 rows and filtering in a loop wastes bandwidth and memory.

**Column index vs column name:**
Indexes are 1-based. Prefer column names for readability (\`rs.getString("name")\` not \`rs.getString(2)\`). Index-based access is fractionally faster but breaks silently if the column order changes.`,
  code: `// ===== Retrieving Records with Statement =====
import java.sql.*;

public class RetrieveData {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        retrieveAll();
        retrieveByDepartment("Engineering");
        retrieveSingle(1);
    }

    // Retrieve all rows
    static void retrieveAll() {
        String sql = "SELECT id, name, department, salary FROM employees ORDER BY id";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement();
             ResultSet  rs   = stmt.executeQuery(sql)) {

            System.out.println("=== All Employees ===");
            while (rs.next()) {
                System.out.printf("ID: %d | Name: %-20s | Dept: %-20s | Salary: %.2f%n",
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("department"),
                    rs.getDouble("salary"));
            }

        } catch (SQLException e) {
            System.err.println("SELECT failed: " + e.getMessage());
        }
    }

    // Retrieve rows matching a condition
    static void retrieveByDepartment(String dept) {
        String sql = "SELECT id, name, salary FROM employees WHERE department = '" + dept + "'";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement();
             ResultSet  rs   = stmt.executeQuery(sql)) {

            System.out.println("\\n=== Employees in " + dept + " ===");
            int count = 0;
            while (rs.next()) {
                System.out.println(rs.getInt("id") + " | " + rs.getString("name")
                        + " | " + rs.getDouble("salary"));
                count++;
            }
            System.out.println("Total: " + count);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Retrieve a single row by primary key
    static void retrieveSingle(int id) {
        String sql = "SELECT * FROM employees WHERE id = " + id;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement();
             ResultSet  rs   = stmt.executeQuery(sql)) {

            if (rs.next()) {
                System.out.println("\\nFound: " + rs.getString("name")
                        + ", salary=" + rs.getDouble("salary"));
            } else {
                System.out.println("No employee with id " + id);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
  codeTitle: 'SELECT with Statement — ResultSet Iteration',
  points: [
    'executeQuery() returns a ResultSet — a cursor positioned before the first row; call rs.next() to advance',
    'rs.next() returns true while rows remain and false when the result set is exhausted',
    'Column getters are type-specific: getInt(), getString(), getDouble(), getDate() — choose the one matching the SQL column type',
    'Column references can be by name (rs.getString("name")) or by 1-based index (rs.getString(2)) — prefer names for safety',
    'ResultSet, Statement, and Connection must all be closed — use try-with-resources to ensure cleanup even on exceptions',
    'Filter rows in SQL (WHERE clause), not in Java code — fetching unneeded rows wastes memory and network bandwidth',
    'Check rs.next() before reading from it — calling getters without calling next() first throws a SQLException',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The ResultSet cursor starts BEFORE the first row, not ON the first row. A common mistake is to call rs.getString() immediately without calling rs.next() first — this throws a SQLException. Always call rs.next() at least once before reading any column values.",
    },
    {
      type: 'interview',
      content: "Q: What is a ResultSet and how do you iterate through it?\nA: ResultSet is a table of data representing the rows returned by a SELECT query. It maintains a cursor that initially points before the first row. You iterate by calling rs.next() in a while loop — it returns true for each row and false when there are no more rows. Within the loop, you use getXxx() methods (getInt, getString, etc.) to read column values by name or 1-based index.",
    },
    {
      type: 'tip',
      content: "When you only expect one row (like a lookup by primary key), use if (rs.next()) rather than while (rs.next()). This makes your intent explicit and avoids processing multiple rows when you only need the first one.",
    },
  ],
}
