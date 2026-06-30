export default {
  id: 'handling-exceptions-better-jdbc-code',
  title: '234. Handling Exceptions and Writing Better Code',
  explanation: `Early JDBC examples used hard-coded credentials and scattered try/catch blocks. Production JDBC code is structured differently.

**Problems with naive JDBC code:**
1. Credentials in source files (security risk)
2. Connection details scattered across methods (hard to change)
3. Manual close() calls — easy to forget, leading to connection leaks
4. Swallowed exceptions (empty catch blocks lose the error)
5. No reuse — each method opens its own connection

**Solution 1 — try-with-resources:**
\`\`\`java
try (Connection conn = DriverManager.getConnection(url, user, pass);
     Statement  stmt = conn.createStatement();
     ResultSet  rs   = stmt.executeQuery(sql)) {
    // resources closed automatically even if exception thrown
}
\`\`\`

**Solution 2 — constants or config for credentials:**
Store connection parameters in a single class or a properties file. Never commit credentials to source control.

**Solution 3 — re-throw or log meaningfully:**
Do not swallow exceptions. Either:
- Re-throw as a domain exception: \`throw new DataAccessException("Query failed", e)\`
- Log with full details: \`logger.error("Query failed: " + sql, e)\`

**Solution 4 — separate concerns:**
- Connection creation: \`DBUtil.getConnection()\`
- SQL execution: DAO methods (Data Access Object pattern)
- Business logic: Service layer

**SQLException structure:**
\`SQLException\` has \`getSQLState()\` (standard 5-char code) and \`getErrorCode()\` (vendor-specific). Use these to distinguish "connection refused" from "duplicate key" from "syntax error".`,
  code: `// ===== Clean JDBC Code Structure =====

// Step 1: Centralize connection details
class DBUtil {
    private static final String URL  = "jdbc:mysql://localhost:3306/jdbc_demo"
                                     + "?useSSL=false&serverTimezone=UTC";
    private static final String USER = "javaapp";
    private static final String PASS = "SecurePass123";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}

// Step 2: DAO pattern — one class per table
class EmployeeDAO {

    // Insert — returns generated primary key
    public int insert(String name, String dept, double salary) throws SQLException {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, name);
            ps.setString(2, dept);
            ps.setDouble(3, salary);
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) return keys.getInt(1);
            }
            return -1;
        }
    }

    // Query — returns a list, never null
    public List<String> findByDepartment(String dept) throws SQLException {
        String sql = "SELECT name FROM employees WHERE department = ?";
        List<String> names = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, dept);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) names.add(rs.getString("name"));
            }
        }
        return names;
    }
}

// Step 3: Main — calls DAO, handles exceptions at the boundary
public class BetterJDBCCode {
    public static void main(String[] args) {
        EmployeeDAO dao = new EmployeeDAO();

        try {
            int newId = dao.insert("Frank", "DevOps", 95000);
            System.out.println("Inserted employee with id: " + newId);

            List<String> names = dao.findByDepartment("Engineering");
            System.out.println("Engineering team: " + names);

        } catch (SQLException e) {
            // Log structured info — SQLState identifies the error category
            System.err.println("DB error: " + e.getMessage());
            System.err.println("SQLState:  " + e.getSQLState());
            System.err.println("ErrorCode: " + e.getErrorCode());
            // In real apps: logger.error("DB error", e); or throw new ServiceException(e);
        }
    }
}`,
  codeTitle: 'Clean JDBC Code — DBUtil, DAO, Proper Exception Handling',
  points: [
    'Always use try-with-resources for Connection, Statement, and ResultSet — they are AutoCloseable and must be closed',
    'Centralize connection parameters in a DBUtil class or properties file — never scatter credentials across methods',
    'The DAO (Data Access Object) pattern separates SQL/JDBC code from business logic — one DAO class per database table',
    'Never swallow exceptions with an empty catch block — log them with SQLState and ErrorCode or re-throw as domain exceptions',
    'SQLException.getSQLState() returns a standard 5-character code; getErrorCode() returns a vendor-specific integer error code',
    'Return generated keys after INSERT by passing Statement.RETURN_GENERATED_KEYS to prepareStatement()',
    'Return empty collections (not null) from DAO methods — null forces null checks everywhere in the calling code',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Connection leaks are the most common JDBC bug in production. If you open a Connection in a try block and an exception is thrown before you call conn.close(), the connection stays open. With a connection pool, this exhausts the pool under load. Use try-with-resources — it guarantees close() is called even when exceptions occur.",
    },
    {
      type: 'interview',
      content: "Q: What is the DAO pattern and why is it used with JDBC?\nA: DAO (Data Access Object) is a design pattern that isolates database access code in dedicated classes — typically one per table or entity. The DAO handles SQL, ResultSet processing, and JDBC boilerplate. The rest of the application calls DAO methods without knowing the SQL behind them. This separation makes it easier to switch databases, mock the DAO in tests, and maintain SQL in one place.",
    },
    {
      type: 'tip',
      content: "Store JDBC credentials in a .properties file (db.properties) and load it with Properties.load(). This keeps credentials out of source code and makes environment-specific configuration easy. For production, use environment variables or a secrets manager rather than checked-in properties files.",
    },
  ],
}
