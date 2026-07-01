export default {
  id: 'schema-and-data-files',
  title: '352. Schema and Data Files',
  explanation: `When you use Spring Boot with a SQL database, you often want the **tables to exist** and some **seed rows** to be present the moment the app starts — especially for demos, tests, and local development. Spring Boot does this automatically with two special files on the classpath:

**\`schema.sql\`** — DDL: the \`CREATE TABLE\` / \`ALTER TABLE\` statements that define the structure.

**\`data.sql\`** — DML: the \`INSERT\` statements that populate initial rows.

Put both in \`src/main/resources\`. On startup Spring Boot runs \`schema.sql\` first, then \`data.sql\`, against the configured \`DataSource\`.

**When does it run?**
- For an **embedded** database (H2, HSQLDB, Derby) initialization is **on by default**.
- For a **real** database (PostgreSQL, MySQL) you must opt in with \`spring.sql.init.mode=always\`, otherwise Boot assumes the schema is managed elsewhere (Flyway/Liquibase/Hibernate).

**Interaction with Hibernate:** if JPA/Hibernate is also creating tables (\`spring.jpa.hibernate.ddl-auto=create\`), you can get conflicts. A common combo is \`ddl-auto=none\` + your own \`schema.sql\`, or \`ddl-auto=create\` (let Hibernate build tables) + \`data.sql\` only for seed rows. Use \`spring.jpa.defer-datasource-initialization=true\` so \`data.sql\` runs **after** Hibernate has created the tables.`,
  code: `-- src/main/resources/schema.sql
CREATE TABLE IF NOT EXISTS student (
    id    INT PRIMARY KEY,
    name  VARCHAR(50),
    marks INT
);

-- src/main/resources/data.sql
INSERT INTO student (id, name, marks) VALUES (1, 'Navin', 78);
INSERT INTO student (id, name, marks) VALUES (2, 'Kiran', 65);
INSERT INTO student (id, name, marks) VALUES (3, 'Harsh', 88);`,
  codeTitle: 'schema.sql and data.sql',
  points: [
    'schema.sql holds CREATE/ALTER (structure); data.sql holds INSERT (seed rows). Both live in src/main/resources.',
    'Spring Boot runs schema.sql then data.sql against the configured DataSource at startup.',
    'Embedded DBs (H2) initialize by default; for PostgreSQL/MySQL set spring.sql.init.mode=always.',
    'CREATE TABLE IF NOT EXISTS avoids errors when the table already exists on restart.',
    'When Hibernate also builds tables, set spring.jpa.defer-datasource-initialization=true so data.sql runs after them.',
  ],
  callouts: [
    { type: 'gotcha', content: 'On a non-embedded database, schema.sql and data.sql are IGNORED unless you set spring.sql.init.mode=always. Many beginners wonder why their seed data never loads against PostgreSQL — this is why.' },
    { type: 'tip', content: 'For real migrations in production, prefer Flyway or Liquibase over schema.sql. schema.sql/data.sql are best for demos, tests, and quick local setups.' },
    { type: 'interview', content: 'Q: In what order does Spring Boot run schema.sql and data.sql?\nA: schema.sql first (create structure), then data.sql (insert rows).' },
  ],
}
