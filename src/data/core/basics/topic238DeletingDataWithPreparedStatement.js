export default {
  id: 'deleting-data-prepared-statement',
  title: '238. Deleting Data with PreparedStatement',
  explanation: `DELETE with \`PreparedStatement\` is the safe, parameterized way to remove rows when the criteria come from runtime values.

**Basic pattern:**
\`\`\`java
String sql = "DELETE FROM employees WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setInt(1, targetId);
int rows = ps.executeUpdate();
\`\`\`

**Why not Statement for DELETE:**
\`\`\`java
// DANGEROUS — if targetId is crafted maliciously:
// input = "1 OR 1=1" → deletes EVERY row
stmt.executeUpdate("DELETE FROM employees WHERE id = " + targetId);
\`\`\`
PreparedStatement makes this injection impossible.

**Checking the result:**
- 0 returned: no row matched the WHERE clause — the record did not exist
- >0 returned: rows were deleted

**Conditional delete — multiple criteria:**
\`\`\`java
String sql = "DELETE FROM employees WHERE department = ? AND salary < ?";
ps.setString(1, dept);
ps.setDouble(2, threshold);
\`\`\`

**Transactional delete:**
For operations that delete rows across multiple tables (parent + children without CASCADE), use a transaction:
\`\`\`java
conn.setAutoCommit(false);
deleteChildren(conn, parentId); // delete child rows first
deleteParent(conn, parentId);   // then delete the parent
conn.commit();
\`\`\`

**Bulk delete with IN clause:**
PreparedStatement does not natively support IN (?, ?, ?) with a dynamic list. You must build the SQL string with the right number of ? and set each one:
\`\`\`java
String placeholders = "?,".repeat(ids.size());
String sql = "DELETE FROM employees WHERE id IN ("
           + placeholders.substring(0, placeholders.length() - 1) + ")";
\`\`\``,
  code: `// ===== Deleting Data with PreparedStatement =====
import java.sql.*;
import java.util.List;

public class DeleteWithPreparedStatement {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        deleteById(5);
        deleteByDepartmentAndThreshold("Temp", 50000);
        deleteBulk(List.of(10, 11, 12));
        deleteWithTransaction(3);
    }

    // Delete a single row by primary key
    static void deleteById(int id) {
        String sql = "DELETE FROM employees WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            int rows = ps.executeUpdate();

            if (rows == 0) {
                System.out.println("No employee with id " + id + " — nothing deleted");
            } else {
                System.out.println("Deleted employee with id " + id);
            }

        } catch (SQLException e) {
            System.err.println("DELETE failed: " + e.getMessage());
        }
    }

    // Delete with multiple conditions
    static void deleteByDepartmentAndThreshold(String dept, double salaryThreshold) {
        String sql = "DELETE FROM employees WHERE department = ? AND salary < ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, dept);
            ps.setDouble(2, salaryThreshold);
            int rows = ps.executeUpdate();
            System.out.println("Deleted " + rows + " low-salary " + dept + " employee(s)");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Bulk delete with dynamic IN clause
    static void deleteBulk(List<Integer> ids) {
        if (ids.isEmpty()) return;

        // Build the right number of ? placeholders
        String placeholders = "?,".repeat(ids.size());
        String sql = "DELETE FROM employees WHERE id IN ("
                   + placeholders.substring(0, placeholders.length() - 1) + ")";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            for (int i = 0; i < ids.size(); i++) {
                ps.setInt(i + 1, ids.get(i));
            }

            int rows = ps.executeUpdate();
            System.out.println("Bulk deleted " + rows + " row(s) from ids: " + ids);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Delete parent + related children transactionally (no CASCADE)
    static void deleteWithTransaction(int deptId) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASS);
            conn.setAutoCommit(false);

            // Delete children first (foreign key constraint)
            try (PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM employees WHERE department_id = ?")) {
                ps.setInt(1, deptId);
                int empRows = ps.executeUpdate();
                System.out.println("Deleted " + empRows + " employee(s) in dept " + deptId);
            }

            // Then delete the parent
            try (PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM departments WHERE id = ?")) {
                ps.setInt(1, deptId);
                ps.executeUpdate();
            }

            conn.commit();
            System.out.println("Department " + deptId + " and all employees deleted");

        } catch (SQLException e) {
            System.err.println("Transaction failed: " + e.getMessage());
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
        } finally {
            try { if (conn != null) conn.close(); } catch (SQLException ex) { ex.printStackTrace(); }
        }
    }
}`,
  codeTitle: 'DELETE with PreparedStatement — Single, Conditional, Bulk, Transactional',
  points: [
    'PreparedStatement for DELETE prevents SQL injection in the WHERE clause criteria, just as it does for INSERT and UPDATE',
    'executeUpdate() returns 0 when no rows matched — this is not an exception but should be treated as a warning',
    'Delete child rows before parent rows when foreign key constraints exist without ON DELETE CASCADE',
    'For deleting by a dynamic list of IDs, build a SQL string with the right number of ? placeholders and set each one by index',
    'Wrap multi-table deletes in a transaction to ensure all-or-nothing atomicity — rollback if any step fails',
    'Never pass raw user input into a DELETE SQL string — always use PreparedStatement placeholders',
    'Consider logging the record details before deleting — once committed in auto-commit mode, deletion cannot be reversed',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Foreign key constraint violations throw a SQLException when you try to DELETE a parent row that still has referencing child rows (and no ON DELETE CASCADE is defined). The fix is to delete child rows first, then the parent — in the same transaction so both either succeed or fail together. Always check your schema for FK relationships before writing delete logic.",
    },
    {
      type: 'interview',
      content: "Q: How would you safely delete a list of records by their IDs using PreparedStatement?\nA: Build the SQL with the right number of ? placeholders: 'DELETE FROM table WHERE id IN (?,?,?)'. Then loop through the ID list and call ps.setInt(i+1, ids.get(i)) for each one. This is safe against injection and more efficient than executing a separate DELETE for each ID. For very large lists, split into batches to avoid database limits on IN clause size.",
    },
    {
      type: 'tip',
      content: "Before executing a wide DELETE (one that could affect many rows), run a SELECT COUNT(*) with the same WHERE clause and log the count. If the count is larger than expected, stop and investigate. This two-step pattern has saved many production databases from accidental mass deletion.",
    },
  ],
}
