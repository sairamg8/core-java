export default {
  id: 'jpa-creating-tables-and-inserting-data',
  title: '403. Creating Tables and Inserting Data',
  explanation: `Before \`JobRepository\` (see [[spring-data-jpa-introduction]]) can do anything, a real database and a matching table need to exist. Spring Boot + JPA offers two ways to get there.

**1. Let Hibernate generate the schema automatically** — the fastest path for development, via \`application.properties\`:
\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobapp
spring.datasource.username=postgres
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update
\`\`\`
\`ddl-auto=update\` tells Hibernate: look at every \`@Entity\` class, and create or alter tables to match. Add a field to \`Job\`, restart the app, and the column appears — no SQL written by hand. Convenient during development; risky in production, since Hibernate is making structural changes to a live schema.

**2. Define the schema explicitly** with a \`schema.sql\` (and optionally \`data.sql\`) on the classpath — the same pattern used earlier for JDBC (see [[schema-and-data-files]]):
\`\`\`sql
-- schema.sql
CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    url VARCHAR(255),
    profile VARCHAR(255)
);
\`\`\`
Spring Boot runs \`schema.sql\` (and \`data.sql\`, for seed rows) automatically on startup when \`spring.jpa.hibernate.ddl-auto\` is *not* set to \`create\`/\`update\`, avoiding a conflict between hand-written and auto-generated DDL.

**The \`@Entity\` class itself, mapped to that table:**
\`\`\`java
@Entity
@Table(name = "job")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String description;
    private String url;
    private String profile;
}
\`\`\`
\`@GeneratedValue(strategy = GenerationType.IDENTITY)\` delegates id generation to the database's auto-increment column (\`SERIAL\` in PostgreSQL) — the id is assigned on insert, not chosen by the application.`,
  code: `-- schema.sql: explicit, versioned, production-safe
CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    url VARCHAR(255),
    profile VARCHAR(255)
);

-- data.sql: optional seed data, runs after schema.sql
INSERT INTO job (description, url, profile) VALUES ('Java Developer', 'https://...', 'Backend');`,
  codeTitle: 'schema.sql + data.sql: explicit table and seed data',
  points: [
    'spring.jpa.hibernate.ddl-auto=update lets Hibernate generate/alter tables automatically from @Entity classes - convenient for development.',
    'schema.sql (and data.sql) on the classpath define the schema and seed data explicitly, run automatically by Spring Boot on startup.',
    '@GeneratedValue(strategy = GenerationType.IDENTITY) delegates id assignment to the database\'s auto-increment column.',
    'Auto-generated schema (ddl-auto=update) and hand-written schema.sql should not be relied on together - decide on one approach per environment.',
    'ddl-auto=update (or create/create-drop) is a development convenience; production databases are typically managed with an explicit, versioned schema.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Leaving ddl-auto=update (or worse, create-drop, which wipes the schema on every restart) enabled in a production configuration risks silent, unreviewed structural changes to a live database - production profiles should use ddl-auto=validate or none, with schema changes managed through migration tools.' },
    { type: 'interview', content: 'Q: What does spring.jpa.hibernate.ddl-auto=update actually do, and why is it discouraged in production?\nA: It tells Hibernate to inspect all @Entity classes at startup and automatically create or alter database tables to match them. It is convenient for development since schema changes happen automatically, but in production it means an application restart can silently modify a live database schema with no review step, migration history, or rollback plan - explicit, versioned schema management is preferred there.' },
  ],
}
