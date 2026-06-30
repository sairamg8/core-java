export default {
  id: 'complete-setup-installation-for-windows',
  title: '195. Complete Setup Installation for Windows',
  explanation: `Installing MySQL on Windows requires the MySQL Installer — a guided setup that installs the server, Workbench, and connectors together.

**What you need:**
1. MySQL Community Server — the database engine
2. MySQL Workbench — GUI for writing queries and managing databases
3. MySQL Shell (optional) — modern command-line client
4. MySQL JDBC Connector/J — for Java applications

**Installation Steps:**

**Step 1: Download MySQL Installer**
Go to dev.mysql.com/downloads/installer/ → choose "MySQL Installer for Windows" → download the web installer or full installer.

**Step 2: Choose Setup Type**
- Developer Default: installs server + Workbench + connectors + Shell
- Server Only: just the MySQL server
- Full: everything

**Step 3: Product Configuration**
- Type: Development Computer (appropriate for local dev)
- Port: 3306 (default — do not change unless 3306 is occupied)
- Authentication: Use Strong Password Encryption (MySQL 8+ default)

**Step 4: Set root password**
Choose a strong password. This is your superuser (root) account.

**Step 5: Windows Service**
MySQL installs as a Windows Service named "MySQL80" — starts automatically with Windows.

**Step 6: Verify installation**
Open MySQL Workbench → connect to localhost → run SELECT VERSION()

**Environment variables:**
Add MySQL bin to PATH: C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin
This lets you run mysql and mysqladmin from the command prompt.

**Connecting from command line:**
  mysql -u root -p
  Enter password: [your root password]`,
  code: `-- ===== MySQL Windows Setup Verification =====

-- After installation, connect to MySQL:
-- Option 1: MySQL Workbench (GUI)
-- Option 2: Command Line:
-- Start > MySQL 8.0 Command Line Client
-- OR: open cmd.exe and run:
-- mysql -u root -p

-- Verify the server is running:
SELECT VERSION();
-- Expected: 8.0.35 (or whichever version you installed)

SELECT CURRENT_USER();
-- Expected: root@localhost

-- See all databases that came pre-installed:
SHOW DATABASES;
-- information_schema  (metadata about all databases)
-- mysql               (user accounts, privileges)
-- performance_schema  (performance monitoring)
-- sys                 (helper views for performance_schema)

-- Create your first database:
CREATE DATABASE my_first_db;
USE my_first_db;

-- Create a simple test table:
CREATE TABLE hello_sql (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(255) NOT NULL
);

INSERT INTO hello_sql (message) VALUES ('Hello from MySQL on Windows!');

SELECT * FROM hello_sql;
-- | id | message                         |
-- |----|--------------------------------|
-- |  1 | Hello from MySQL on Windows!  |

-- If you need to reset the root password:
-- Run MySQL Installer again → Reconfigure → change root password

-- Check the Windows service:
-- Press Win+R → services.msc → find "MySQL80"
-- Start/Stop/Restart MySQL from here

-- Start/stop MySQL from command line (run as Administrator):
-- net start MySQL80
-- net stop MySQL80`,
  codeTitle: 'MySQL Windows Installation and Verification',
  points: [
    'Download MySQL Installer from dev.mysql.com — it installs Server + Workbench + JDBC Connector in one package',
    'Choose "Developer Default" setup type for Java development — includes all components you need',
    'Port 3306 is the MySQL default — only change if you have a conflict with another service',
    'The root account is the MySQL superuser — set a strong password and use it only for administration',
    'MySQL installs as a Windows Service (MySQL80) — starts automatically with Windows by default',
    'Add C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin to PATH for command-line access',
    'Verify installation with SELECT VERSION() in MySQL Workbench or the command-line client',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'On Windows, if port 3306 is already in use (by another MySQL version or Skype), the installer will fail silently or on a different port. Before installing, check: netstat -ano | findstr 3306 in Command Prompt to see if 3306 is occupied.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between MySQL Community Edition and MySQL Enterprise Edition?\nA: Community Edition is free, open-source (GPL), and is what most developers and startups use. Enterprise Edition is Oracle-commercial with additional features: enterprise audit, thread pool, encryption at rest, and official Oracle support. For learning and most applications, Community Edition is sufficient.',
    },
    {
      type: 'tip',
      content: 'Create a dedicated non-root MySQL user for your Java application: CREATE USER "appuser"@"localhost" IDENTIFIED BY "password"; GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO "appuser"@"localhost"; Never connect your application using the root account — principle of least privilege.',
    },
  ],
}
