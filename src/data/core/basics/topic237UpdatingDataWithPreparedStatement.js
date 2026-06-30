export default {
  id: 'updating-data-prepared-statement',
  title: '237. Updating Data with PreparedStatement',
  explanation: `UPDATE with \`PreparedStatement\` follows the same pattern as INSERT — use \`?\` placeholders for all runtime values including the WHERE clause value.

**Why PreparedStatement matters for UPDATE:**
\`\`\`java
// VULNERABLE — never do this with user-supplied input
String sql = "UPDATE employees SET salary = " + salary + " WHERE id = " + id;

// SAFE — use PreparedStatement
String sql = "UPDATE employees SET salary = ? WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setDouble(1, salary);
ps.setInt(2, id);
int rows = ps.executeUpdate();
\`\`\`

**Return value is critical:**
\`executeUpdate()\` returns the number of rows modified. For an UPDATE targeting a specific ID, a return value of 0 means the record was not found. Treat this as an application-level error.

**Partial update pattern:**
When only some fields need updating, list only those columns:
\`\`\`java
String sql = "UPDATE employees SET department = ?, salary = ? WHERE id = ?";
\`\`\`
Do not update columns that did not change — it triggers row-level logging/auditing unnecessarily.

**Transaction for atomic multi-row updates:**
\`\`\`java
conn.setAutoCommit(false);
try {
    ps1.executeUpdate(); // update row A
    ps2.executeUpdate(); // update row B
    conn.commit();
} catch (SQLException e) {
    conn.rollback(); // undo both if either fails
}
\`\`\`

**Optimistic locking pattern:**
Include a version column in the WHERE clause to prevent lost updates when multiple users update the same row concurrently:
\`\`\`java
String sql = "UPDATE items SET price = ?, version = version + 1 WHERE id = ? AND version = ?";
\`\`\`
If another user updated the row first, the version number changed and this UPDATE returns 0.`,
  code: `// ===== Updating Data with PreparedStatement =====
import java.sql.*;

public class UpdateWithPreparedStatement {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        updateSalary(1, 95000.00);
        updateDepartmentAndSalary(2, "Senior Engineering", 105000.00);
        atomicMultipleUpdates();
    }

    // Update a single field for a specific employee
    static void updateSalary(int empId, double newSalary) {
        String sql = "UPDATE employees SET salary = ? WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setDouble(1, newSalary);
            ps.setInt(2, empId);

            int rowsAffected = ps.executeUpdate();

            if (rowsAffected == 0) {
                System.out.println("No employee with id " + empId + " — nothing updated");
            } else {
                System.out.println("Updated salary for employee " + empId + " to " + newSalary);
            }

        } catch (SQLException e) {
            System.err.println("UPDATE failed: " + e.getMessage());
        }
    }

    // Update multiple fields at once
    static void updateDepartmentAndSalary(int empId, String newDept, double newSalary) {
        String sql = "UPDATE employees SET department = ?, salary = ? WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newDept);
            ps.setDouble(2, newSalary);
            ps.setInt(3, empId);

            int rows = ps.executeUpdate();
            System.out.println("Department+salary update: " + rows + " row(s) affected");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Transaction: update two rows atomically — both succeed or both fail
    static void atomicMultipleUpdates() {
        String giveRaise   = "UPDATE employees SET salary = salary * ? WHERE department = ?";
        String logActivity = "INSERT INTO audit_log (action, detail) VALUES ('RAISE', ?)";

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASS);
            conn.setAutoCommit(false); // start transaction

            // Give Engineering a 10% raise
            try (PreparedStatement ps = conn.prepareStatement(giveRaise)) {
                ps.setDouble(1, 1.10);
                ps.setString(2, "Engineering");
                int raised = ps.executeUpdate();
                System.out.println("Engineering raise applied to " + raised + " employees");
            }

            // Log the activity
            try (PreparedStatement ps = conn.prepareStatement(logActivity)) {
                ps.setString(1, "10% raise to Engineering department");
                ps.executeUpdate();
            }

            conn.commit(); // both succeed — commit
            System.out.println("Transaction committed");

        } catch (SQLException e) {
            System.err.println("Transaction failed: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); System.out.println("Rolled back"); }
                catch (SQLException ex) { ex.printStackTrace(); }
            }
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
        }
    }
}`,
  codeTitle: 'UPDATE with PreparedStatement — Single Field, Multi-Field, Transaction',
  points: [
    'Use PreparedStatement for UPDATE whenever the WHERE clause or SET values come from variables or user input',
    'executeUpdate() returns 0 when the WHERE clause matches no rows — check this to detect "record not found"',
    'Update only the columns that changed — unnecessary updates can trigger auditing, replication overhead, and index updates',
    'Wrap related updates in a transaction (setAutoCommit(false), commit, rollback) to ensure they succeed or fail together',
    'The optimistic locking pattern adds a version column to the WHERE clause to detect concurrent modifications',
    'PreparedStatement can be reused across a loop to update many rows with different values without re-compiling',
    'Always set all placeholder values before calling executeUpdate() — un-set parameters throw a SQLException at execution time',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "When a PreparedStatement is reused in a loop, parameters from the previous iteration are NOT automatically cleared. If your loop only sets some parameters conditionally and forgets to set others, the stale values from the previous iteration are used silently. Always explicitly set every parameter on every iteration, or call ps.clearParameters() at the top of the loop.",
    },
    {
      type: 'interview',
      content: "Q: How do you perform a transactional UPDATE in JDBC — one that rolls back if it fails?\nA: Call conn.setAutoCommit(false) before the first executeUpdate(). Execute all updates. If all succeed, call conn.commit(). If any throws a SQLException, catch it and call conn.rollback(). This reverts all changes made in the transaction. Use a try/catch/finally block (or try-with-resources with a helper) to ensure rollback happens on failure and the connection is always closed.",
    },
    {
      type: 'tip',
      content: "For high-throughput scenarios where you update many rows, combine PreparedStatement with batch updates: call ps.addBatch() after setting each row's parameters, then call ps.executeBatch() once to send all updates to the database in a single round trip. This drastically reduces network overhead compared to calling executeUpdate() once per row.",
    },
  ],
}
