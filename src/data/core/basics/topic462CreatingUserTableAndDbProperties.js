export default {
  id: 'creating-user-table-and-db-properties',
  title: '462. Creating User Table and DB Properties',
  explanation: `With the design questions settled (see [[working-with-multiple-users]]), this topic writes the actual \`User\` entity and its database configuration — following the exact same JPA pattern already used for \`Job\` (see [[spring-data-jpa-introduction]]), with one addition specific to security.

**The \`User\` entity:**
\`\`\`java
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;   // stores the BCrypt HASH, never plain text

    @Enumerated(EnumType.STRING)
    private Role role;         // e.g. USER, ADMIN

    // getters and setters
}

enum Role { USER, ADMIN }
\`\`\`

**Why the table is named \`app_user\`, not \`user\`.** \`USER\` is a reserved keyword in several SQL databases (including PostgreSQL) — using it directly as a table name causes confusing syntax errors on some queries. \`@Table(name = "app_user")\` sidesteps this entirely by giving the table an explicit, unambiguous name while keeping the Java class named the natural \`User\`.

**\`@Enumerated(EnumType.STRING)\`** — stores the role as the readable string \`"ADMIN"\` in the database rather than an ordinal integer (\`EnumType.ORDINAL\`, the alternative). This matters specifically because ordinal storage breaks silently if the \`enum\`'s value order ever changes (inserting a new role in the middle shifts every ordinal that follows) — string storage is immune to that entire class of bug, at a negligible storage cost.

**Database properties, same pattern as the rest of the app:**
\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobapp
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
\`\`\`
No new datasource is needed — \`User\` lives in the same database as \`Job\`, using the connection already configured earlier in the JPA chapter. \`ddl-auto=update\` (already established) creates the \`app_user\` table automatically the first time the app starts with this entity present.`,
  code: `@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // getters and setters omitted
}

public enum Role {
    USER, ADMIN
}`,
  codeTitle: 'The User entity, using @Table to avoid the reserved word "user"',
  points: [
    'The User entity follows the same JPA pattern as Job - @Entity, @Id with GenerationType.IDENTITY, and standard column mappings.',
    '@Table(name = "app_user") avoids naming the actual database table "user", which is a reserved keyword in several SQL databases including PostgreSQL.',
    'The password field stores the BCrypt hash, never plain text - this constraint shapes every part of the entity and its surrounding code from this point forward.',
    '@Enumerated(EnumType.STRING) stores role names as readable strings rather than ordinal integers, avoiding a subtle bug class where inserting a new enum value shifts every ordinal after it.',
    'No new datasource configuration is needed - User lives in the same database as Job, using the connection properties already established in the JPA chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Using @Enumerated(EnumType.ORDINAL) (or omitting @Enumerated entirely, which defaults to ORDINAL) on the role field means inserting a new value into the middle of the enum later silently reassigns every existing user’s stored role to a different value - EnumType.STRING avoids this entirely and should be the default choice for any persisted enum.' },
    { type: 'interview', content: 'Q: Why is the User table explicitly named app_user rather than letting it default to user, and why store the role as EnumType.STRING instead of the default ordinal?\nA: user is a reserved SQL keyword in databases like PostgreSQL, so using it directly as a table name risks syntax errors on certain queries - @Table(name = "app_user") avoids that. EnumType.STRING stores the role as a readable string rather than a numeric ordinal, which prevents a subtle bug where inserting a new enum value in the middle of the declaration silently changes the meaning of every previously stored ordinal value.' },
  ],
}
