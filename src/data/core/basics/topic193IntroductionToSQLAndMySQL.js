export default {
  id: 'introduction-to-sql-and-mysql',
  title: '193. Introduction to SQL and MySQL',
  explanation: `MySQL is the world's most popular open-source relational database. Understanding its architecture helps you work with it effectively from Java.

**MySQL Overview:**
- Created by Michael Widenius (Monty) and David Axmark in 1995
- Acquired by Sun Microsystems in 2008, then Oracle in 2010
- Open source (GPL) community edition + commercial Oracle editions
- Used by: Facebook, Twitter, YouTube, Wikipedia, Airbnb, GitHub
- Current version: MySQL 8.0+ (as of 2024)

**MySQL Architecture:**
  Client → MySQL Server (mysqld daemon) → Storage Engine (InnoDB)

- **SQL layer:** parses queries, optimizes them, manages connections
- **Storage engine layer:** actual data storage — InnoDB (default), MyISAM, Memory
- **InnoDB:** ACID-compliant, row-level locking, foreign keys, crash-recovery

**Connecting to MySQL:**
  Command line: mysql -u root -p
  JDBC URL: jdbc:mysql://localhost:3306/mydb

**MySQL vs PostgreSQL:**
| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| License | GPL / Oracle commercial | BSD (fully free) |
| ACID | InnoDB: yes | Yes |
| JSON support | Yes (MySQL 5.7+) | Advanced (JSONB) |
| Full-text search | Limited | Advanced |
| Stored procedures | Yes | Yes (PL/pgSQL) |
| Community | Huge (web hosting) | Growing (developers) |

**MySQL in Java (Spring Boot):**
  # application.properties:
  spring.datasource.url=jdbc:mysql://localhost:3306/mydb
  spring.datasource.username=root
  spring.datasource.password=yourpassword
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

**MySQL Workbench:**
Official GUI for MySQL — run queries, view tables, design schemas visually.`,
  code: `-- ===== MySQL Introduction =====

-- 1. Connect from command line:
-- mysql -u root -p
-- Enter password: ****

-- 2. Show all databases
SHOW DATABASES;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | sys                |
-- +--------------------+

-- 3. Create a database
CREATE DATABASE java_course;
USE java_course;

-- 4. MySQL-specific data types
CREATE TABLE demo (
    id          INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  -- MySQL uses UNSIGNED
    name        VARCHAR(100) NOT NULL,
    score       DECIMAL(5,2),                             -- 999.99
    is_active   TINYINT(1) DEFAULT 1,                     -- boolean in MySQL
    notes       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME ON UPDATE CURRENT_TIMESTAMP      -- MySQL auto-update
);

-- 5. Show table structure
DESCRIBE demo;
-- Or:
SHOW CREATE TABLE demo;

-- 6. MySQL version and settings
SELECT VERSION();           -- 8.0.35
SELECT DATABASE();          -- current database
SELECT USER();              -- current user
SHOW VARIABLES LIKE 'max_connections';

-- 7. MySQL AUTO_INCREMENT
INSERT INTO demo (name, score) VALUES ('Alice', 95.5);
INSERT INTO demo (name, score) VALUES ('Bob', 87.0);
SELECT LAST_INSERT_ID();    -- returns last auto-generated id

-- 8. MySQL-specific: LIMIT and OFFSET (for pagination)
SELECT * FROM demo ORDER BY score DESC LIMIT 10 OFFSET 0;   -- page 1
SELECT * FROM demo ORDER BY score DESC LIMIT 10 OFFSET 10;  -- page 2

-- 9. Useful MySQL admin commands
SHOW TABLES;
SHOW INDEX FROM demo;
SHOW PROCESSLIST;   -- running queries

-- 10. JDBC URL format for Java:
-- jdbc:mysql://hostname:3306/database?useSSL=false&serverTimezone=UTC
-- Modern connector: com.mysql.cj.jdbc.Driver (MySQL 8+)`,
  codeTitle: 'MySQL Introduction and Key Features',
  points: [
    'MySQL is the most popular open-source RDBMS, used by major tech companies and supported by most Java frameworks',
    'MySQL architecture: SQL layer (query parser + optimizer) + Storage Engine (InnoDB for production)',
    'InnoDB is the default storage engine — provides ACID, row-level locking, foreign keys, crash recovery',
    'MySQL uses AUTO_INCREMENT for auto-generated primary keys; LAST_INSERT_ID() returns the last generated ID',
    'DESCRIBE tablename shows column definitions; SHOW CREATE TABLE shows the full CREATE statement',
    'Java connects to MySQL via JDBC driver (com.mysql.cj.jdbc.Driver) and URL jdbc:mysql://host:3306/db',
    'MySQL 8.0+ features: window functions, CTEs, JSON functions, invisible indexes, atomic DDL',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'MySQL old connector class was com.mysql.jdbc.Driver (MySQL 5.x). For MySQL 8+, use com.mysql.cj.jdbc.Driver. Also add serverTimezone=UTC to your JDBC URL to avoid timezone-related warnings: jdbc:mysql://localhost:3306/db?serverTimezone=UTC',
    },
    {
      type: 'interview',
      content: 'Q: What is the default storage engine in MySQL and why does it matter?\nA: InnoDB is the default. It provides full ACID compliance, row-level locking (better concurrent writes than MyISAM table-level locking), foreign key enforcement, and crash recovery via redo logs. Always use InnoDB for production data. MyISAM lacks transactions and foreign keys.',
    },
    {
      type: 'tip',
      content: 'Install MySQL Workbench alongside the MySQL server — it gives you a visual query editor, schema designer, and server health monitor. For Java development, also add the MySQL JDBC connector to your pom.xml: mysql:mysql-connector-java:8.0.33',
    },
  ],
}
