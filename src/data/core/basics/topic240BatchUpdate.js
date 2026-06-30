export default {
  id: 'batch-update',
  title: '240. Batch Update',
  explanation: `Batch updates let you send multiple SQL statements to the database in a single round trip instead of one at a time — dramatically reducing network overhead for bulk operations.

**The problem with one-at-a-time inserts:**
\`\`\`java
// 10,000 inserts = 10,000 round trips to the database
for (Employee e : employees) {
    ps.setString(1, e.getName());
    ps.executeUpdate(); // network round trip per row — slow
}
\`\`\`

**Batch solution:**
\`\`\`java
for (Employee e : employees) {
    ps.setString(1, e.getName());
    ps.addBatch();     // queue this set of parameters
}
int[] counts = ps.executeBatch(); // ONE network round trip for all rows
\`\`\`

**executeBatch() return value:**
Returns an \`int[]\` where each element is the rows affected by that batch entry. Some drivers return \`Statement.SUCCESS_NO_INFO\` (-2) for each entry instead of a specific count.

**Chunking large batches:**
Sending 100,000 rows in one batch can exhaust memory. Break large datasets into chunks:
\`\`\`java
for (int i = 0; i < rows.size(); i++) {
    // set params and addBatch...
    if ((i + 1) % 500 == 0) {  // every 500 rows
        ps.executeBatch();
        ps.clearBatch();
    }
}
ps.executeBatch(); // flush remaining rows
\`\`\`

**Batch with transaction:**
Wrap the entire batch in a transaction. If any row fails, roll back all rows:
\`\`\`java
conn.setAutoCommit(false);
// ... addBatch in loop ...
try {
    ps.executeBatch();
    conn.commit();
} catch (BatchUpdateException e) {
    conn.rollback();
}
\`\`\`

**BatchUpdateException:**
If a batch fails mid-way, a \`BatchUpdateException\` is thrown. Its \`getUpdateCounts()\` array shows which rows succeeded (count >= 0 or SUCCESS_NO_INFO) and which failed (EXECUTE_FAILED = -3) before the exception.`,
  code: `// ===== Batch Update with PreparedStatement =====
import java.sql.*;
import java.util.List;
import java.util.ArrayList;

public class BatchUpdate {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        simpleBatch();
        chunkedBatch(generateLargeDataset(10000), 500);
        batchWithTransaction(generateLargeDataset(1000));
    }

    // Basic batch insert
    static void simpleBatch() {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            // Queue all inserts
            ps.setString(1, "Alice");  ps.setString(2, "Eng");  ps.setDouble(3, 85000); ps.addBatch();
            ps.setString(1, "Bob");    ps.setString(2, "QA");   ps.setDouble(3, 72000); ps.addBatch();
            ps.setString(1, "Carol");  ps.setString(2, "PM");   ps.setDouble(3, 95000); ps.addBatch();
            ps.setString(1, "Dave");   ps.setString(2, "Ops");  ps.setDouble(3, 88000); ps.addBatch();

            // Execute all at once
            int[] results = ps.executeBatch();
            System.out.println("Batch inserted " + results.length + " rows");

        } catch (BatchUpdateException e) {
            System.err.println("Batch failed: " + e.getMessage());
            System.err.println("Rows processed before failure: " + e.getUpdateCounts().length);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Chunked batch for large datasets — avoids OOM
    static void chunkedBatch(List<String[]> data, int chunkSize) {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";
        int totalInserted = 0;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            conn.setAutoCommit(false);

            for (int i = 0; i < data.size(); i++) {
                String[] row = data.get(i);
                ps.setString(1, row[0]);
                ps.setString(2, row[1]);
                ps.setDouble(3, Double.parseDouble(row[2]));
                ps.addBatch();

                // Flush every chunkSize rows
                if ((i + 1) % chunkSize == 0) {
                    int[] counts = ps.executeBatch();
                    totalInserted += counts.length;
                    ps.clearBatch();
                    System.out.println("Flushed chunk — total so far: " + totalInserted);
                }
            }

            // Flush any remaining rows
            int[] counts = ps.executeBatch();
            totalInserted += counts.length;

            conn.commit();
            System.out.println("Chunked batch complete. Total inserted: " + totalInserted);

        } catch (SQLException e) {
            System.err.println("Chunked batch failed: " + e.getMessage());
        }
    }

    // Batch wrapped in a transaction — all-or-nothing
    static void batchWithTransaction(List<String[]> data) {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASS);
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                for (String[] row : data) {
                    ps.setString(1, row[0]);
                    ps.setString(2, row[1]);
                    ps.setDouble(3, Double.parseDouble(row[2]));
                    ps.addBatch();
                }
                int[] results = ps.executeBatch();
                conn.commit();
                System.out.println("Transactional batch committed: " + results.length + " rows");
            }

        } catch (BatchUpdateException e) {
            System.err.println("Batch failed mid-way: " + e.getMessage());
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
        } catch (SQLException e) {
            e.printStackTrace();
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
        } finally {
            try { if (conn != null) conn.close(); } catch (SQLException ex) { ex.printStackTrace(); }
        }
    }

    // Helper — generate sample data
    static List<String[]> generateLargeDataset(int count) {
        List<String[]> data = new ArrayList<>();
        String[] depts = {"Engineering", "QA", "DevOps", "Marketing", "Legal"};
        for (int i = 1; i <= count; i++) {
            data.add(new String[]{"Employee" + i, depts[i % depts.length], String.valueOf(50000 + (i % 50000))});
        }
        return data;
    }
}`,
  codeTitle: 'Batch Update — Simple, Chunked, and Transactional',
  points: [
    'addBatch() queues a set of parameters without executing; executeBatch() sends all queued statements in one round trip',
    'Batch updates are dramatically faster than executing one statement per row — ideal for bulk inserts/updates of hundreds or thousands of rows',
    'executeBatch() returns an int[] where each element is the rows affected by that batch entry (or Statement.SUCCESS_NO_INFO = -2)',
    'Chunk large batches — call executeBatch() + clearBatch() every N rows to avoid loading all data in memory before sending',
    'Wrap the batch in a transaction so all rows either succeed or all are rolled back; without a transaction, successful rows before a failure are committed',
    'BatchUpdateException is thrown when the batch fails mid-way; getUpdateCounts() reveals which rows succeeded before the failure',
    'Always set rewriteBatchedStatements=true in the MySQL JDBC URL to enable true batch rewriting for maximum performance',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Without conn.setAutoCommit(false), each executeBatch() call automatically commits all rows in that chunk. If a later chunk fails, the already-committed chunks cannot be rolled back. For all-or-nothing bulk imports, always disable auto-commit and manage the transaction manually around the entire batch operation.",
    },
    {
      type: 'interview',
      content: "Q: What is the advantage of batch updates over individual executeUpdate() calls?\nA: Batch updates reduce network round trips. Instead of sending N SQL statements to the database (N round trips), addBatch() queues them locally and executeBatch() sends them all at once (1 round trip). For 10,000 inserts, this can reduce execution time from minutes to seconds. The database also processes them more efficiently without the per-statement overhead of individual connections.",
    },
    {
      type: 'tip',
      content: "For MySQL specifically, add rewriteBatchedStatements=true to the JDBC URL: jdbc:mysql://host/db?rewriteBatchedStatements=true. Without it, MySQL still sends statements one at a time even when you use addBatch/executeBatch. With it, MySQL rewrites the batch into a single multi-row INSERT statement, achieving maximum throughput.",
    },
  ],
}
