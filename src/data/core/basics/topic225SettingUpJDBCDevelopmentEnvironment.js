export default {
  id: 'setting-up-jdbc-development-environment',
  title: '225. Setting Up JDBC Development Environment',
  explanation: `To write and run a JDBC application you need three things: a JDK, a database server, and the driver JAR. Here is how to set each up.

**1. JDK (Java Development Kit)**
Any JDK 8+ works. Verify with:
\`\`\`
java -version
javac -version
\`\`\`

**2. Database Server — MySQL**
- Download MySQL Community Server from mysql.com
- Or install via package manager:
  - macOS: \`brew install mysql\`
  - Ubuntu: \`sudo apt install mysql-server\`
  - Windows: MySQL Installer
- Start the server: \`sudo systemctl start mysql\` (Linux) or from Services (Windows)
- Secure: \`sudo mysql_secure_installation\`
- Connect to verify: \`mysql -u root -p\`

**3. Driver JAR — Two options:**

**Option A: Maven project (recommended)**
Create a Maven project and add to \`pom.xml\`:
\`\`\`xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
\`\`\`
Maven downloads and manages the JAR automatically.

**Option B: Manual JAR download**
Download \`mysql-connector-j-8.x.x.jar\` from dev.mysql.com/downloads/connector/j/
Add to project classpath in your IDE.

**4. IDE Setup**
- **IntelliJ IDEA**: Create a Maven project → add dependency → Maven auto-downloads
- **Eclipse**: Create Maven project → edit pom.xml → right-click → Maven → Update Project
- **VS Code**: Install "Extension Pack for Java" → create Maven project

**5. Verify your setup:**
\`\`\`java
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "pass");
System.out.println("Connected: " + conn.getMetaData().getDatabaseProductName());
\`\`\`
If this prints "Connected: MySQL" — your environment is ready.`,
  code: `<!-- pom.xml for a JDBC project -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>jdbc-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- MySQL JDBC Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>
    </dependencies>
</project>

// ===== Setup Verification — src/main/java/SetupCheck.java =====
import java.sql.*;

public class SetupCheck {
    public static void main(String[] args) {
        String url  = "jdbc:mysql://localhost:3306/";  // no database name yet
        String user = "root";
        String pass = "your_password_here";

        System.out.println("Java version: " + System.getProperty("java.version"));

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            DatabaseMetaData meta = conn.getMetaData();
            System.out.println("✓ Connected successfully");
            System.out.println("  Database:      " + meta.getDatabaseProductName() +
                               " " + meta.getDatabaseProductVersion());
            System.out.println("  Driver:        " + meta.getDriverName() +
                               " " + meta.getDriverVersion());
            System.out.println("  JDBC version:  " + meta.getJDBCMajorVersion() +
                               "." + meta.getJDBCMinorVersion());

            // Create a test database
            try (Statement stmt = conn.createStatement()) {
                stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS jdbc_demo");
                System.out.println("✓ Database 'jdbc_demo' ready");
            }

        } catch (SQLException e) {
            System.err.println("✗ Connection failed");
            System.err.println("  " + e.getMessage());
            System.err.println("  Check: Is MySQL running? Is the password correct?");
        }
    }
}

// MySQL CLI commands to create a user for your app (safer than using root):
// CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'SecurePass123';
// GRANT ALL PRIVILEGES ON jdbc_demo.* TO 'appuser'@'localhost';
// FLUSH PRIVILEGES;`,
  codeTitle: 'Setting Up the JDBC Development Environment',
  points: [
    'You need: JDK 8+, a running MySQL server, and the mysql-connector-j JAR on the classpath',
    'Maven is the easiest way to manage the driver JAR — add the dependency and Maven handles the download',
    'The connection URL format: jdbc:mysql://localhost:3306/database_name?useSSL=false&serverTimezone=UTC',
    'Always create a dedicated database user for your app — never use root in production',
    'DatabaseMetaData (conn.getMetaData()) is useful for verifying connection info and driver version',
    'If you get Access denied, check the MySQL username, password, and that the user has privileges on the database',
    'Use mysql -u root -p at the command line to verify MySQL is running before testing JDBC',
  ],
  callouts: [
    {
      type: 'tip',
      content: "Add ?useSSL=false&serverTimezone=UTC to your MySQL JDBC URL during development to suppress SSL warnings and timezone errors. In production, configure SSL properly and set the timezone explicitly in MySQL server config instead.",
    },
    {
      type: 'gotcha',
      content: "MySQL 8.x changed the default authentication plugin to caching_sha2_password. If you get 'Public Key Retrieval is not allowed', add &allowPublicKeyRetrieval=true to the JDBC URL, or change the user's auth plugin: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';",
    },
    {
      type: 'interview',
      content: "Q: What do you need to run a JDBC application?\nA: Three things: (1) JDK — for compiling and running Java; (2) a running database server — MySQL, PostgreSQL, etc.; (3) the driver JAR on the classpath — the vendor-specific implementation of java.sql interfaces. Without the driver JAR, Java has no way to speak the database's wire protocol.",
    },
  ],
}
