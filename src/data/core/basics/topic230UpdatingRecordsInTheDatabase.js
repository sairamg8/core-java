export default {
  id: 'updating-records-in-database',
  title: '230. Updating Records in the Database',
  explanation: `UPDATE with JDBC also uses \`executeUpdate()\`. The return value — the number of rows modified — is essential for confirming the update actually matched rows.

**The critical WHERE clause rule:**
An UPDATE without a WHERE clause updates every row in the table. Always include a WHERE clause in UPDATE statements. The row count return value helps detect accidental mass updates.

**Checking return value:**
\`\`\`java
int rows = stmt.executeUpdate("UPDATE employees SET salary = 100000 WHERE id = 999");
if (rows == 0) {
    System.out.println("No employee with id 999 — nothing updated");
} else {
    System.out.println("Updated " + rows + " employee(s)");
}
\`\`\`

**The "0 rows updated" problem:**
If executeUpdate() returns 0, either:
1. The WHERE clause matched no rows (wrong ID, typo)
2. The new value equals the old value (some databases skip the update)
3. The data type didn't match (numeric column vs string literal)

This is not an exception — no error is thrown. You must check the return value.

**Statement vs PreparedStatement for UPDATE:**
Again, Statement is fine for static SQL in demonstrations. For any update where the new values come from user input or variables, use PreparedStatement to avoid SQL injection.

**Transaction consideration:**
By default JDBC is in auto-commit mode — each executeUpdate() is immediately committed. For updates that must be atomic (update salary AND update bonus atomically), wrap in a transaction: disable auto-commit, execute multiple updates, then commit.`,
  code: `// ===== Updating Records with Statement =====
import java.sql.*;

public class UpdateData {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        updateSingleRecord();
        updateMultipleRecords();
        checkReturnValue();
    }

    // Update one specific row by primary key
    static void updateSingleRecord() {
        String sql = "UPDATE employees SET salary = 98000, department = 'Senior Engineering' WHERE id = 1";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(sql);
            System.out.println("Rows updated: " + rowsAffected);

        } catch (SQLException e) {
            System.err.println("UPDATE failed: " + e.getMessage());
        }
    }

    // Update multiple rows matching a condition
    static void updateMultipleRecords() {
        // Give all Engineering employees a 10% raise
        String sql = "UPDATE employees SET salary = salary * 1.10 WHERE department = 'Engineering'";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(sql);
            System.out.println("Engineering raise applied to " + rowsAffected + " employee(s)");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Always check the return value — 0 means nothing was updated
    static void checkReturnValue() {
        int targetId = 9999;  // ID that doesn't exist
        String sql = "UPDATE employees SET salary = 50000 WHERE id = " + targetId;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(sql);

            if (rowsAffected == 0) {
                System.out.println("Warning: No employee with id " + targetId + " — nothing updated!");
            } else {
                System.out.println("Updated " + rowsAffected + " row(s)");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

// Safe UPDATE pattern — verify what you're about to update first
class SafeUpdatePattern {
    static void safeUpdate(Connection conn, int empId, double newSalary) throws SQLException {
        // Step 1: Verify the record exists
        try (PreparedStatement check = conn.prepareStatement(
                "SELECT COUNT(*) FROM employees WHERE id = ?")) {
            check.setInt(1, empId);
            try (ResultSet rs = check.executeQuery()) {
                rs.next();
                if (rs.getInt(1) == 0) {
                    throw new IllegalArgumentException("Employee " + empId + " not found");
                }
            }
        }

        // Step 2: Perform the update
        try (PreparedStatement update = conn.prepareStatement(
                "UPDATE employees SET salary = ? WHERE id = ?")) {
            update.setDouble(1, newSalary);
            update.setInt(2, empId);
            int rows = update.executeUpdate();
            System.out.println("Updated " + rows + " row(s) for employee " + empId);
        }
    }
}`,
  codeTitle: 'UPDATE with Statement — Checking Return Value',
  points: [
    'executeUpdate() returns the count of rows actually modified — 0 means no rows matched the WHERE clause',
    'Always include a WHERE clause in UPDATE — without it, every row in the table is updated',
    'A return value of 0 is not an exception — you must explicitly check it to detect "not found" cases',
    'Auto-commit is on by default — each executeUpdate() commits immediately unless you manage transactions',
    'For updates involving user-supplied values, always use PreparedStatement to prevent SQL injection',
    'The UPDATE return count is the rows modified, not rows matched — if the value didn\'t change, some DBs report 0',
    'For critical updates, consider reading the current value first to confirm the row exists before updating',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "executeUpdate() returns 0 and throws NO exception when the WHERE clause matches zero rows. This is the most common source of silent data bugs — you call update, nothing happens, and the application continues as if it succeeded. Always check: if (rows == 0) { log a warning or throw an exception. }",
    },
    {
      type: 'interview',
      content: "Q: What does executeUpdate() return for an UPDATE statement, and what does 0 mean?\nA: executeUpdate() returns the number of rows that were modified. For UPDATE, 0 means the WHERE clause matched no rows — no data was changed. This is NOT an error — no exception is thrown. You must check the return value explicitly if you want to detect the 'record not found' case.",
    },
    {
      type: 'tip',
      content: "In MySQL specifically, if you UPDATE a row but the new value is identical to the old value, executeUpdate() returns 0. Add ?useAffectedRows=true to the JDBC URL to make MySQL return the count of rows matched (not modified) — this way you can distinguish 'no row found' from 'row found but value unchanged'.",
    },
  ],
}
