export default {
  id: 'inserting-data-into-database',
  title: '229. Inserting Data into the Database',
  explanation: `Inserting data with JDBC uses \`Statement.executeUpdate()\`, which returns the number of rows affected. The SQL is a standard INSERT statement passed as a string.

**Basic INSERT with Statement:**
\`\`\`java
Statement stmt = conn.createStatement();
int rows = stmt.executeUpdate(
    "INSERT INTO employees (name, department, salary) VALUES ('Alice', 'Engineering', 95000)"
);
System.out.println("Inserted: " + rows); // prints 1
\`\`\`

**Retrieving the auto-generated key:**
When a table has an \`AUTO_INCREMENT\` primary key, you often need the generated ID after an INSERT. Pass \`Statement.RETURN_GENERATED_KEYS\` to capture it:
\`\`\`java
stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
ResultSet keys = stmt.getGeneratedKeys();
if (keys.next()) {
    long id = keys.getLong(1);
}
\`\`\`

**Why Statement is NOT the right tool for INSERTs with dynamic data:**
String concatenation to build INSERT SQL is a **SQL injection vulnerability**:
\`\`\`java
// DANGEROUS — never do this
String sql = "INSERT INTO users VALUES ('" + name + "')";
// If name = "Alice'); DROP TABLE users; --"  → disaster
\`\`\`
Use \`PreparedStatement\` (covered in topic 235) for any INSERT with variable data. The examples here use hardcoded values to illustrate the Statement API. In practice, always use PreparedStatement for real data.`,
  code: `// ===== Inserting Data with Statement =====
import java.sql.*;

public class InsertData {

    static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
    static final String USER = "javaapp";
    static final String PASS = "SecurePass123";

    public static void main(String[] args) {
        insertSingleRow();
        insertMultipleRows();
        insertAndGetGeneratedKey();
    }

    // Insert one row — executeUpdate returns rows affected
    static void insertSingleRow() {
        String sql = "INSERT INTO employees (name, department, salary, hire_date) " +
                     "VALUES ('Frank Torres', 'Engineering', 88000, '2023-01-10')";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(sql);
            System.out.println("Inserted " + rowsAffected + " row(s)");

        } catch (SQLException e) {
            System.err.println("INSERT failed: " + e.getMessage());
        }
    }

    // Insert multiple rows with multiple executeUpdate calls
    static void insertMultipleRows() {
        String[] sqls = {
            "INSERT INTO products (name, category, price, stock) VALUES ('Python Bible', 'Books', 27.99, 60)",
            "INSERT INTO products (name, category, price, stock) VALUES ('Docker Guide', 'Books', 22.99, 45)",
            "INSERT INTO products (name, category, price, stock) VALUES ('SSD 1TB', 'Hardware', 79.99, 30)",
        };

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            int totalInserted = 0;
            for (String sql : sqls) {
                totalInserted += stmt.executeUpdate(sql);
            }
            System.out.println("Total rows inserted: " + totalInserted);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Retrieve the AUTO_INCREMENT generated key after INSERT
    static void insertAndGetGeneratedKey() {
        String sql = "INSERT INTO employees (name, department, salary, hire_date) " +
                     "VALUES ('Grace Liu', 'Marketing', 76000, '2023-06-01')";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement  stmt = conn.createStatement()) {

            // Pass RETURN_GENERATED_KEYS to capture the auto-generated primary key
            int rowsAffected = stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);

            if (rowsAffected == 1) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        long generatedId = keys.getLong(1);
                        System.out.println("New employee ID: " + generatedId);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

// Key methods summary:
// stmt.executeUpdate(sql)                                  → int (rows affected)
// stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS) → int + generated keys available
// stmt.getGeneratedKeys()                                  → ResultSet of generated keys
// keys.getLong(1)                                          → the auto-increment ID (1-indexed!)`,
  codeTitle: 'INSERT with Statement and Retrieving Generated Keys',
  points: [
    'executeUpdate() returns the number of rows affected — 1 for a successful single INSERT',
    'Pass Statement.RETURN_GENERATED_KEYS as the second argument to capture auto-generated primary keys',
    'getGeneratedKeys() returns a ResultSet — call next() then getLong(1) to get the ID',
    'Statement is only appropriate for INSERT with fully static, hardcoded SQL values',
    'Any INSERT with dynamic user-supplied data must use PreparedStatement to prevent SQL injection',
    'executeUpdate() works for INSERT, UPDATE, and DELETE — it returns row count for all three',
    'If INSERT violates a unique constraint or NOT NULL, executeUpdate() throws SQLException',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Never build INSERT SQL by string concatenation with user input. 'INSERT INTO users VALUES (\\'' + userInput + '\\')' is the textbook SQL injection vulnerability. If userInput is \"Alice'); DROP TABLE users; --\", you've just deleted your table. Always use PreparedStatement with ? parameters for any dynamic data.",
    },
    {
      type: 'tip',
      content: "To insert multiple rows efficiently, use a single INSERT with multiple value tuples: INSERT INTO t VALUES (a,b),(c,d),(e,f). This is one round trip instead of N. Even better for bulk inserts: use batch updates via PreparedStatement.addBatch() / executeBatch() — covered in topic 240.",
    },
    {
      type: 'interview',
      content: "Q: How do you get the auto-generated primary key after a JDBC INSERT?\nA: Pass Statement.RETURN_GENERATED_KEYS as the second argument to executeUpdate(). After the insert succeeds, call stmt.getGeneratedKeys() to get a ResultSet containing the generated key(s). Call keys.next() then keys.getLong(1) to retrieve the ID.",
    },
  ],
}
