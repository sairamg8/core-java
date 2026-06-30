export default {
  id: 'deleting-records-from-database',
  title: '232. Deleting Records from the Database',
  explanation: `Deleting rows uses \`executeUpdate()\` with a DELETE statement. Like UPDATE, it returns the number of rows deleted.

**DELETE basics:**
\`\`\`java
String sql = "DELETE FROM employees WHERE id = 5";
int rowsDeleted = stmt.executeUpdate(sql);
\`\`\`

**The missing WHERE clause — catastrophic:**
\`DELETE FROM employees\` deletes every row in the table instantly. There is no undo in auto-commit mode. Always include a WHERE clause. Always double-check it.

**Return value matters:**
- Returns 0: the WHERE clause matched nothing — the row did not exist.
- Returns 1: expected for a primary key delete.
- Returns >1: your WHERE clause matched multiple rows — verify this was intentional.

**Cascading deletes:**
If foreign key constraints with ON DELETE CASCADE are defined, deleting a parent row will automatically delete related child rows. You may delete more rows than you expect. Check your schema constraints.

**Soft delete pattern:**
Many production systems never physically delete rows. Instead they add an \`is_deleted\` boolean column and run UPDATE to set it to true. Queries include WHERE is_deleted = false. This preserves audit trails and allows recovery.

**Hard delete pattern:**
Physical DELETE is appropriate when data truly has no retention requirement. Add logging before the delete so you have a record of what was removed.`,
  code: `// ===== Deleting Records with Statement =====
import java.sql.*;

public class DeleteData {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        deleteById(5);
        deleteByDepartment("Temp");
        checkBeforeDelete(10);
    }

    // Delete a single row by primary key
    static void deleteById(int id) {
        String sql = "DELETE FROM employees WHERE id = " + id;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsDeleted = stmt.executeUpdate(sql);

            if (rowsDeleted == 0) {
                System.out.println("No employee with id " + id + " — nothing deleted");
            } else {
                System.out.println("Deleted employee with id " + id);
            }

        } catch (SQLException e) {
            System.err.println("DELETE failed: " + e.getMessage());
        }
    }

    // Delete all rows matching a condition
    static void deleteByDepartment(String dept) {
        String sql = "DELETE FROM employees WHERE department = '" + dept + "'";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsDeleted = stmt.executeUpdate(sql);
            System.out.println("Deleted " + rowsDeleted + " employee(s) from " + dept + " department");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Best practice: verify the record exists before deleting
    static void checkBeforeDelete(int id) {
        String checkSql  = "SELECT name FROM employees WHERE id = " + id;
        String deleteSql = "DELETE FROM employees WHERE id = " + id;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            // Step 1: confirm the record exists
            try (ResultSet rs = stmt.executeQuery(checkSql)) {
                if (!rs.next()) {
                    System.out.println("Employee " + id + " not found — skipping delete");
                    return;
                }
                System.out.println("About to delete: " + rs.getString("name"));
            }

            // Step 2: perform the delete
            int rows = stmt.executeUpdate(deleteSql);
            System.out.println("Deleted " + rows + " row(s)");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

// Soft-delete pattern — mark as deleted instead of removing
class SoftDelete {
    static void softDelete(Connection conn, int empId) throws SQLException {
        String sql = "UPDATE employees SET is_deleted = true, deleted_at = NOW() WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, empId);
            int rows = ps.executeUpdate();
            System.out.println("Soft-deleted " + rows + " row(s)");
        }
    }
}`,
  codeTitle: 'DELETE with Statement — Safe Deletion Pattern',
  points: [
    'executeUpdate() with DELETE returns the count of rows deleted — 0 means the WHERE clause matched nothing',
    'A DELETE without a WHERE clause removes every row in the table — this cannot be undone in auto-commit mode',
    'Always check the return value: 0 means record not found, 1 is normal for PK delete, >1 means multiple rows matched',
    'ON DELETE CASCADE foreign key constraints can cause child rows to be deleted automatically when a parent row is removed',
    'Consider the soft-delete pattern in production — set an is_deleted flag instead of physically removing rows',
    'Log what you are about to delete before issuing the statement — you cannot recover deleted rows without a backup',
    'Use PreparedStatement for deletes where the criteria come from user input to prevent SQL injection',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "DELETE FROM table; (no WHERE clause) is the most destructive SQL statement you can write in a JDBC app. It runs instantly, affects every row, and cannot be undone if auto-commit is on. Always include a WHERE clause. If you intentionally need to remove all rows, use TRUNCATE TABLE — it is clearer in intent and usually faster.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between DELETE and TRUNCATE in the context of JDBC?\nA: DELETE is a DML statement that can be filtered with WHERE, fires triggers, and participates in transactions. executeUpdate() returns the rows affected. TRUNCATE is a DDL statement that removes all rows, typically cannot be rolled back, does not fire row-level triggers, and is faster. In JDBC, TRUNCATE is executed with executeUpdate() or execute() but cannot be rolled back in most databases.",
    },
    {
      type: 'tip',
      content: "Before issuing a potentially wide DELETE (e.g., deleting by department), run a SELECT COUNT(*) with the same WHERE clause first. If the count is larger than expected, investigate before proceeding. This two-step pattern catches mistakes before data is lost.",
    },
  ],
}
