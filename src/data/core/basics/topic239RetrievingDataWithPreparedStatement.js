export default {
  id: 'retrieving-data-prepared-statement',
  title: '239. Retrieving Data with PreparedStatement',
  explanation: `SELECT with \`PreparedStatement\` is the safe, performant way to run parameterized queries — especially for search, filter, and lookup operations.

**Basic pattern:**
\`\`\`java
String sql = "SELECT id, name, salary FROM employees WHERE department = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "Engineering");
ResultSet rs = ps.executeQuery(); // returns ResultSet, not int
\`\`\`

**executeQuery() vs executeUpdate():**
For SELECT, use \`ps.executeQuery()\` — it returns a \`ResultSet\`.
For INSERT/UPDATE/DELETE, use \`ps.executeUpdate()\` — it returns an int.

**Multiple parameters:**
\`\`\`java
String sql = "SELECT * FROM employees WHERE department = ? AND salary BETWEEN ? AND ?";
ps.setString(1, "Engineering");
ps.setDouble(2, 80000);
ps.setDouble(3, 120000);
\`\`\`

**LIKE with PreparedStatement:**
\`\`\`java
String sql = "SELECT name FROM employees WHERE name LIKE ?";
ps.setString(1, "%" + searchTerm + "%"); // wildcards added in Java, not SQL
\`\`\`
Setting the wildcards in Java (not in the SQL template) keeps the query safe.

**Reusing the same PreparedStatement for repeated lookups:**
Create the PreparedStatement once, then in a loop just change the parameters and call \`executeQuery()\` again. This avoids re-compiling the SQL template on every lookup.

**ResultSet stays valid only while the PreparedStatement is open:**
Do not close the PreparedStatement before you are done reading the ResultSet. Use nested try-with-resources to ensure the correct order of closing.`,
  code: `// ===== Retrieving Data with PreparedStatement =====
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RetrieveWithPreparedStatement {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        findByDepartment("Engineering");
        findBySalaryRange(70000, 100000);
        searchByName("ali");
        findById(1);
        reuseForMultipleLookups(new int[]{1, 2, 3, 4, 5});
    }

    // Filter by one column
    static void findByDepartment(String dept) {
        String sql = "SELECT id, name, salary FROM employees WHERE department = ? ORDER BY name";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, dept);

            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("=== " + dept + " ===");
                while (rs.next()) {
                    System.out.printf("  %d | %-20s | %.2f%n",
                            rs.getInt("id"), rs.getString("name"), rs.getDouble("salary"));
                }
            }

        } catch (SQLException e) {
            System.err.println("Query failed: " + e.getMessage());
        }
    }

    // Filter with a numeric range (two parameters)
    static void findBySalaryRange(double min, double max) {
        String sql = "SELECT name, salary FROM employees WHERE salary BETWEEN ? AND ? ORDER BY salary DESC";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setDouble(1, min);
            ps.setDouble(2, max);

            System.out.println("\\n=== Salary range " + min + " – " + max + " ===");
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    System.out.println("  " + rs.getString("name") + ": " + rs.getDouble("salary"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // LIKE search — wildcards added in Java
    static void searchByName(String searchTerm) {
        String sql = "SELECT id, name FROM employees WHERE name LIKE ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + searchTerm + "%"); // safe — wildcard is part of the value

            System.out.println("\\n=== Name search: '" + searchTerm + "' ===");
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    System.out.println("  " + rs.getInt("id") + ": " + rs.getString("name"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Single-row lookup by primary key
    static void findById(int id) {
        String sql = "SELECT * FROM employees WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    System.out.println("\\nFound: " + rs.getString("name")
                            + " [" + rs.getString("department") + "] salary=" + rs.getDouble("salary"));
                } else {
                    System.out.println("\\nNo employee with id " + id);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Reuse a PreparedStatement for multiple lookups — efficient pattern
    static void reuseForMultipleLookups(int[] ids) {
        String sql = "SELECT name FROM employees WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            System.out.println("\\n=== Batch lookups ===");
            for (int id : ids) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        System.out.println("id=" + id + " → " + rs.getString("name"));
                    } else {
                        System.out.println("id=" + id + " → not found");
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
  codeTitle: 'SELECT with PreparedStatement — Filters, LIKE, Range, Reuse',
  points: [
    'Use ps.executeQuery() (not executeUpdate) for SELECT — it returns a ResultSet',
    'Set LIKE wildcards in the Java string passed to setString(), not in the SQL template — this keeps the query injection-safe',
    'PreparedStatement can be reused across multiple iterations: just set new parameter values and call executeQuery() again',
    'Use if (rs.next()) for single-row lookups by PK; use while (rs.next()) for multi-row results',
    'Close the ResultSet before the PreparedStatement — nested try-with-resources handles this in the correct order',
    'Multiple WHERE conditions each get their own ? placeholder, set by position (1-indexed) in the order they appear',
    'PreparedStatement for SELECT caches the execution plan in the database — repeated parameterized queries are faster than Statement',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "A ResultSet is tied to its PreparedStatement — if you close the PreparedStatement before you finish reading the ResultSet, the ResultSet becomes invalid and subsequent rs.next() calls throw a SQLException. When using nested try-with-resources, the inner resource (ResultSet) is closed before the outer (PreparedStatement), which is the correct order.",
    },
    {
      type: 'interview',
      content: "Q: How do you safely implement a LIKE search using PreparedStatement?\nA: Pass the wildcard characters as part of the Java string value, not in the SQL template. For example: ps.setString(1, '%' + userInput + '%'). The PreparedStatement treats the entire value (including % characters) as data, not SQL. This prevents injection — a user input of '% OR 1=1 -- ' is treated as a literal LIKE pattern, not as SQL logic.",
    },
    {
      type: 'tip',
      content: "When you need to run the same SELECT query many times with different parameters (like a lookup loop), create the PreparedStatement once outside the loop and only change parameter values inside. This is much more efficient than creating a new PreparedStatement for each iteration — the SQL is compiled only once.",
    },
  ],
}
