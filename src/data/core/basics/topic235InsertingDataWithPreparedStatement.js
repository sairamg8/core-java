export default {
  id: 'inserting-data-prepared-statement',
  title: '235. Inserting Data with PreparedStatement',
  explanation: `\`PreparedStatement\` is a precompiled SQL template with placeholders (\`?\`) for parameter values. It is the correct way to insert data when any values come from variables or user input.

**Creating a PreparedStatement:**
\`\`\`java
String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
\`\`\`

**Setting parameter values:**
Parameters are 1-indexed. Each column type has a corresponding setter:
\`\`\`java
ps.setString(1, "Alice");      // position 1 → name
ps.setString(2, "Engineering");// position 2 → department
ps.setDouble(3, 85000.00);     // position 3 → salary
ps.executeUpdate();
\`\`\`

**Why PreparedStatement prevents SQL injection:**
With Statement, this is dangerous:
\`\`\`java
// name = "Alice'); DROP TABLE employees; --"  — catastrophic!
stmt.executeUpdate("INSERT INTO emp (name) VALUES ('" + name + "')");
\`\`\`
With PreparedStatement, the database treats the value as pure data — it never interprets it as SQL:
\`\`\`java
ps.setString(1, name); // safe — no matter what name contains
\`\`\`

**Reusing a PreparedStatement:**
You can clear parameters and re-execute with new values without re-preparing:
\`\`\`java
ps.clearParameters(); // optional — setters overwrite anyway
ps.setString(1, "Bob");
ps.setDouble(2, 90000);
ps.executeUpdate();
\`\`\`

**Getting the generated key:**
\`\`\`java
PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
ps.executeUpdate();
try (ResultSet keys = ps.getGeneratedKeys()) {
    if (keys.next()) System.out.println("New ID: " + keys.getInt(1));
}
\`\`\``,
  code: `// ===== Inserting Data with PreparedStatement =====
import java.sql.*;
import java.util.List;

public class InsertWithPreparedStatement {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        insertSingle("Alice", "Engineering", 85000.00);
        insertMultiple();
        insertAndGetKey("Bob", "QA", 72000.00);
    }

    // Insert a single row
    static void insertSingle(String name, String dept, double salary) {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, dept);
            ps.setDouble(3, salary);

            int rows = ps.executeUpdate();
            System.out.println("Inserted " + rows + " row(s)");

        } catch (SQLException e) {
            System.err.println("INSERT failed: " + e.getMessage());
        }
    }

    // Reuse the same PreparedStatement to insert multiple rows efficiently
    static void insertMultiple() {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        // Sample data
        String[][] data = {
            {"Carol", "Marketing", "68000"},
            {"Dave",  "DevOps",    "91000"},
            {"Eve",   "Legal",     "78000"},
        };

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            for (String[] row : data) {
                ps.setString(1, row[0]);
                ps.setString(2, row[1]);
                ps.setDouble(3, Double.parseDouble(row[2]));
                ps.executeUpdate();
                System.out.println("Inserted: " + row[0]);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Insert and retrieve the auto-generated primary key
    static void insertAndGetKey(String name, String dept, double salary) {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, name);
            ps.setString(2, dept);
            ps.setDouble(3, salary);
            ps.executeUpdate();

            // Retrieve the auto-generated ID
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    int generatedId = keys.getInt(1);
                    System.out.println("Inserted " + name + " with auto-generated ID: " + generatedId);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
  codeTitle: 'INSERT with PreparedStatement — Single, Multiple, and Generated Keys',
  points: [
    'PreparedStatement uses ? placeholders for parameters — values are set with type-specific setters (setString, setInt, setDouble)',
    'Parameters are 1-indexed — the first ? is position 1, the second is position 2, and so on',
    'PreparedStatement prevents SQL injection because the database treats parameter values as data, never as SQL',
    'A PreparedStatement is compiled once and can be reused for multiple inserts — more efficient than Statement for repeated inserts',
    'Pass Statement.RETURN_GENERATED_KEYS to prepareStatement() to retrieve auto-incremented primary keys after INSERT',
    'getGeneratedKeys() returns a ResultSet — call rs.getInt(1) or rs.getLong(1) to get the new ID',
    'setNull(position, java.sql.Types.VARCHAR) is used to insert NULL values for nullable columns',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "PreparedStatement parameter positions are 1-indexed, NOT 0-indexed. Passing the wrong index (like 0) throws an SQLException: parameter index out of range. Count your ? placeholders from left to right starting at 1 and make sure each setXxx() call uses the correct number.",
    },
    {
      type: 'interview',
      content: "Q: Why should you use PreparedStatement instead of Statement for INSERT with user input?\nA: PreparedStatement separates SQL structure from data. The SQL template is compiled once, and values are passed as typed parameters. The database never treats a parameter value as SQL — so even if a user enters a string like '); DROP TABLE users; --, it is inserted as a literal string, not executed. Statement concatenates values directly into the SQL string, making it vulnerable to SQL injection.",
    },
    {
      type: 'tip',
      content: "When inserting many rows in a loop, create the PreparedStatement once outside the loop and just change the parameter values inside the loop. This avoids the overhead of re-parsing and re-compiling the SQL template on every iteration. For very large volumes, combine this with batch inserts (addBatch/executeBatch).",
    },
  ],
}
