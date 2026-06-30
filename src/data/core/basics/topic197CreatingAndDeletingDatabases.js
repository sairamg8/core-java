export default {
  id: 'creating-and-deleting-databases',
  title: '197. Creating and Deleting Databases',
  explanation: `In MySQL, a database (also called a schema) is a named container that holds tables, views, and other objects. You create and delete databases with DDL commands.

**Creating a Database:**
\`\`\`sql
CREATE DATABASE database_name;
CREATE DATABASE IF NOT EXISTS database_name;
\`\`\`
\`IF NOT EXISTS\` prevents an error if the database already exists.

You can also specify a character set and collation at creation time:
\`\`\`sql
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`
\`utf8mb4\` is the correct charset for full Unicode (including emojis). \`utf8\` in MySQL is actually 3-byte and will break on 4-byte characters — always use \`utf8mb4\` for modern apps.

**Selecting a Database:**
\`\`\`sql
USE database_name;
\`\`\`
Every subsequent SQL statement runs against this database until you \`USE\` another one or disconnect.

**Viewing Databases:**
\`\`\`sql
SHOW DATABASES;
SELECT DATABASE();  -- shows currently selected database
\`\`\`

**Deleting a Database:**
\`\`\`sql
DROP DATABASE database_name;
DROP DATABASE IF EXISTS database_name;
\`\`\`
This is permanent — all tables and data inside are destroyed. There is no undo in MySQL by default.

**Important rules:**
- Database names are case-sensitive on Linux (case-insensitive on Windows/macOS by default).
- Avoid spaces in database names — use underscores: \`my_app_db\`.
- You need the CREATE and DROP privileges to create or delete databases.`,
  code: `-- ===== Creating and Deleting Databases =====

-- 1. Create a new database
CREATE DATABASE java_course;

-- 2. Safe version (no error if it already exists)
CREATE DATABASE IF NOT EXISTS java_course;

-- 3. Create with full Unicode support (recommended for production)
CREATE DATABASE java_course
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 4. View all databases on the server
SHOW DATABASES;
-- Output includes: information_schema, mysql, performance_schema, sys, java_course

-- 5. Select (use) the database
USE java_course;

-- 6. Confirm which database is active
SELECT DATABASE();
-- Output: java_course

-- 7. Inspect the database definition
SHOW CREATE DATABASE java_course;
-- Output:
-- CREATE DATABASE \`java_course\`
--   DEFAULT CHARACTER SET utf8mb4
--   DEFAULT COLLATE utf8mb4_unicode_ci

-- 8. Delete the database (PERMANENT — destroys all tables and data)
DROP DATABASE java_course;

-- 9. Safe version (no error if it doesn't exist)
DROP DATABASE IF EXISTS java_course;`,
  codeTitle: 'Creating and Deleting MySQL Databases',
  points: [
    'CREATE DATABASE creates a new named container for tables; IF NOT EXISTS avoids duplicate errors',
    'Always specify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci for full Unicode support in production',
    'USE database_name sets the active database for all subsequent statements in the session',
    'SHOW DATABASES lists all databases the current user has access to',
    'DROP DATABASE permanently deletes the database and ALL its tables and data — there is no undo',
    'Database names are case-sensitive on Linux — use lowercase with underscores as a convention',
    'SELECT DATABASE() returns the currently active database (useful in scripts to confirm context)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'DROP DATABASE is irreversible in standard MySQL. Before dropping a production database, always take a backup with mysqldump first. Many teams restrict the DROP privilege on production servers so this command cannot be run accidentally.',
    },
    {
      type: 'tip',
      content: 'Use utf8mb4 instead of utf8 in MySQL. MySQL\'s "utf8" is a non-standard 3-byte encoding that silently drops 4-byte Unicode characters (like emojis and some Chinese characters). utf8mb4 is the proper 4-byte implementation and should always be preferred.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a database and a schema in MySQL?\nA: In MySQL, the terms "database" and "schema" are synonymous — CREATE DATABASE and CREATE SCHEMA do exactly the same thing. In other database systems like PostgreSQL or Oracle, a schema is a namespace inside a database, which is a different concept.',
    },
  ],
}
