export default {
  id: 'crud-with-execute-method',
  title: '233. CRUD Operations with a Single execute() Method',
  explanation: `The \`Statement\` interface has three execution methods. Most code uses the specialized ones, but \`execute()\` is the universal fallback.

**Three Statement execution methods:**

| Method | Returns | Use for |
|--------|---------|---------|
| \`executeQuery()\` | ResultSet | SELECT only |
| \`executeUpdate()\` | int (row count) | INSERT / UPDATE / DELETE / DDL |
| \`execute()\` | boolean | Anything — when you don't know the SQL type at compile time |

**How execute() works:**
\`execute()\` returns \`true\` if the first result is a ResultSet (i.e., a SELECT), or \`false\` if it is an update count or there are no results.

\`\`\`java
boolean hasResultSet = stmt.execute(sql);
if (hasResultSet) {
    ResultSet rs = stmt.getResultSet();
    // process rows
} else {
    int count = stmt.getUpdateCount();
    // count is -1 if there are no results
}
\`\`\`

**When to use execute():**
- Building a generic SQL tool (e.g., a query console) where the SQL comes from user input
- Stored procedures that can return either result sets or update counts
- DDL statements (CREATE TABLE, DROP TABLE) — these return \`false\` and an update count of -1

**Still prefer specialized methods:**
For code where you know the SQL type, use \`executeQuery()\` for SELECT and \`executeUpdate()\` for DML. They are clearer in intent and give you direct access to the return value without the extra boolean check.`,
  code: `// ===== Using execute() for Any SQL Type =====
import java.sql.*;

public class ExecuteMethod {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) throws Exception {
        // execute() works for SELECT
        runSql("SELECT id, name FROM employees LIMIT 3");

        // execute() works for INSERT
        runSql("INSERT INTO employees (name, department, salary) VALUES ('Eve', 'QA', 72000)");

        // execute() works for UPDATE
        runSql("UPDATE employees SET salary = 75000 WHERE name = 'Eve'");

        // execute() works for DELETE
        runSql("DELETE FROM employees WHERE name = 'Eve'");

        // execute() works for DDL
        runSql("CREATE TABLE IF NOT EXISTS temp_log (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(200))");
    }

    // Generic SQL runner — useful for tools and admin consoles
    static void runSql(String sql) {
        System.out.println("\\nExecuting: " + sql);

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            boolean hasResultSet = stmt.execute(sql);

            if (hasResultSet) {
                // It was a SELECT — get and process the ResultSet
                try (ResultSet rs = stmt.getResultSet()) {
                    ResultSetMetaData meta = rs.getMetaData();
                    int colCount = meta.getColumnCount();

                    // Print column headers
                    for (int i = 1; i <= colCount; i++) {
                        System.out.print(meta.getColumnName(i) + "\\t");
                    }
                    System.out.println();

                    // Print rows
                    int rowCount = 0;
                    while (rs.next()) {
                        for (int i = 1; i <= colCount; i++) {
                            System.out.print(rs.getString(i) + "\\t");
                        }
                        System.out.println();
                        rowCount++;
                    }
                    System.out.println("[" + rowCount + " row(s) returned]");
                }
            } else {
                // It was DML or DDL
                int updateCount = stmt.getUpdateCount();
                if (updateCount == -1) {
                    System.out.println("[DDL executed — no row count]");
                } else {
                    System.out.println("[" + updateCount + " row(s) affected]");
                }
            }

        } catch (SQLException e) {
            System.err.println("SQL error: " + e.getMessage());
        }
    }
}`,
  codeTitle: 'execute() — Universal SQL Execution Method',
  points: [
    'execute() is the universal Statement method — it works for SELECT, INSERT, UPDATE, DELETE, and DDL statements',
    'execute() returns true if the first result is a ResultSet (SELECT), false if it is an update count (DML/DDL)',
    'After execute(), call stmt.getResultSet() to retrieve the ResultSet when it returned true',
    'After execute(), call stmt.getUpdateCount() to get rows affected when it returned false; -1 means no result (DDL)',
    'Prefer executeQuery() for SELECT and executeUpdate() for DML when the SQL type is known — they are clearer',
    'execute() is most useful in generic SQL tools, admin consoles, and stored procedure calls that can return either type',
    'ResultSetMetaData (from rs.getMetaData()) lets you inspect column names and types dynamically — useful in generic runners',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Calling executeQuery() on an INSERT/UPDATE/DELETE throws a SQLException in most JDBC drivers. Conversely, calling executeUpdate() on a SELECT also throws. If you mix them up, the error message can be confusing. Use execute() when the SQL type is determined at runtime.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between execute(), executeQuery(), and executeUpdate()?\nA: executeQuery() is for SELECT and returns a ResultSet. executeUpdate() is for INSERT/UPDATE/DELETE/DDL and returns an int (rows affected). execute() is the general-purpose method for any SQL — it returns a boolean: true means a ResultSet is available (call getResultSet()), false means an update count is available (call getUpdateCount()). Use execute() when the SQL type is not known at compile time.",
    },
    {
      type: 'tip',
      content: "When building a general-purpose SQL tool with execute(), use ResultSetMetaData to discover column names and types at runtime — you don't need to hard-code column names. This lets you print any query result without knowing the table schema in advance.",
    },
  ],
}
