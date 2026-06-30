export default {
  id: 'need-for-database-specific-jar',
  title: '223. Need for a Database-Specific JAR in a JDBC App',
  explanation: `The JDBC API (in \`java.sql\`) is part of the Java standard library — you don't download it. But the API is just interfaces. There are no concrete implementations in the JDK that know how to talk to MySQL, PostgreSQL, or Oracle.

Each database vendor ships a **JDBC driver** — a JAR file containing the concrete classes that implement the JDBC interfaces for their specific database protocol.

**Why you need the driver JAR:**
\`\`\`
java.sql.Connection     ← interface (in JDK, free)
       ↓ implemented by
com.mysql.cj.jdbc.ConnectionImpl  ← in mysql-connector-j-8.x.jar (download this)
\`\`\`

When you call \`DriverManager.getConnection("jdbc:mysql://...")\`, the DriverManager finds the MySQL driver on the classpath, instantiates it, and returns a \`Connection\` backed by \`ConnectionImpl\`. You only ever hold the \`java.sql.Connection\` interface — the MySQL-specific class is hidden.

**Common driver JARs:**
| Database | Artifact | Maven Dependency |
|----------|----------|-----------------|
| MySQL | mysql-connector-j | com.mysql:mysql-connector-j:8.x |
| PostgreSQL | postgresql | org.postgresql:postgresql:42.x |
| H2 (in-memory) | h2 | com.h2database:h2:2.x |
| Oracle | ojdbc | com.oracle.database.jdbc:ojdbc8 |
| SQLite | sqlite-jdbc | org.xerial:sqlite-jdbc:3.x |

**With Maven (pom.xml):**
\`\`\`xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
\`\`\`

**JDBC 4.0 automatic driver loading (Java 6+):**
Older code required \`Class.forName("com.mysql.cj.jdbc.Driver")\` to manually load the driver. JDBC 4.0 introduced automatic loading via the ServiceLoader mechanism — if the driver JAR is on the classpath, it's loaded automatically. You no longer need Class.forName().`,
  code: `<!-- pom.xml — add the MySQL driver dependency -->
<dependencies>
    <!-- MySQL JDBC Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.3.0</version>
    </dependency>
</dependencies>

// ===== Using the driver in code =====
import java.sql.*;

public class DriverJarDemo {

    public static void main(String[] args) {
        // JDBC 4.0+: driver auto-loaded from classpath. No Class.forName() needed.
        String url  = "jdbc:mysql://localhost:3306/java_course?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pass = "password";

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Driver: " + conn.getMetaData().getDriverName());
            System.out.println("DB:     " + conn.getMetaData().getDatabaseProductName() +
                               " "         + conn.getMetaData().getDatabaseProductVersion());
        } catch (SQLException e) {
            System.err.println("Connection failed: " + e.getMessage());
            System.err.println("SQLState: " + e.getSQLState());
            System.err.println("Error code: " + e.getErrorCode());
        }
    }
}

// JDBC URL formats for common databases:
// MySQL:      jdbc:mysql://host:3306/dbname?useSSL=false&serverTimezone=UTC
// PostgreSQL: jdbc:postgresql://host:5432/dbname
// H2 in-mem:  jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
// H2 file:    jdbc:h2:./data/testdb
// SQLite:     jdbc:sqlite:./data/mydb.sqlite
// Oracle:     jdbc:oracle:thin:@host:1521:SID

// What's inside the driver JAR (you never write this, but useful to know):
// META-INF/services/java.sql.Driver — tells ServiceLoader which class to load
// com.mysql.cj.jdbc.Driver           — the Driver implementation
// com.mysql.cj.jdbc.ConnectionImpl   — implements java.sql.Connection
// com.mysql.cj.jdbc.StatementImpl    — implements java.sql.Statement
// (hundreds more internal classes)`,
  codeTitle: 'JDBC Driver JAR — Why Every App Needs One',
  points: [
    'The JDBC API (java.sql) is in the JDK — the driver JAR is what connects to a specific database',
    'Each database vendor ships a JAR implementing the JDBC interfaces for their wire protocol',
    'Add the driver as a Maven/Gradle dependency — never add it to the JDK itself',
    'JDBC 4.0+ auto-loads the driver from the classpath via ServiceLoader — Class.forName() is obsolete',
    'The driver JAR contains META-INF/services/java.sql.Driver for automatic discovery',
    'Your code only uses java.sql interfaces — the vendor implementation classes are never referenced directly',
    'H2 is popular for test environments — fast, embedded, in-memory, no external database needed',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "A common beginner error: writing perfect JDBC code but getting ClassNotFoundException or No suitable driver found at runtime. This almost always means the driver JAR is not on the classpath. Check: is the dependency in pom.xml? Did you run mvn install? Is the JAR in the correct scope (not test-only when used in main)?",
    },
    {
      type: 'tip',
      content: "Use H2 in-memory database for unit tests: add com.h2database:h2 as a test-scope dependency. Your JDBC code is identical — just change the URL to jdbc:h2:mem:testdb. Tests run without any external database, are blazing fast, and reset automatically between test runs.",
    },
    {
      type: 'interview',
      content: "Q: Why do you need to add a database-specific JAR even though JDBC is in the JDK?\nA: The JDK's java.sql package contains only interfaces (Connection, Statement, etc.) — there are no implementations. Each database speaks a different wire protocol. The vendor-specific JAR contains the concrete classes that implement those interfaces for that specific protocol. Without the driver JAR, DriverManager has nothing to create a real Connection with.",
    },
  ],
}
