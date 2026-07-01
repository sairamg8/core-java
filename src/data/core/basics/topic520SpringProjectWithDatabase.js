export default {
  id: 'spring-project-with-database',
  title: '520. Spring Project with Database',
  explanation: `The minimal app deployed so far has no database at all (see [[deploying-on-elastic-beanstalk]]) — deliberately so, per the earlier decision to isolate variables (see [[simple-web-app-project]]). This topic adds the one piece of complexity most real applications, including the Job app, actually need: a database, prepared for AWS specifically, before actually creating it in the next topic.

**Extending the minimal app with Spring Data JPA — the same dependency and pattern already established throughout this course (see [[spring-data-jpa-introduction]]):**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
\`\`\`

**The one deliberate, important change from every earlier database configuration in this course: no hardcoded connection details, anywhere.**
\`\`\`properties
spring.datasource.url=\${DB_URL}
spring.datasource.username=\${DB_USERNAME}
spring.datasource.password=\${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
\`\`\`
Every earlier chapter used a fixed \`localhost\` connection string, since the database always ran on the same machine as the app during local development. Deploying to AWS breaks that assumption entirely — the actual database (created in the next topic, see [[creating-database-in-aws-rds]]) will have its own AWS-assigned hostname, completely unknown at the time this code is written. Environment variable placeholders are how Spring Boot resolves this: read from the actual runtime environment (set later, in Elastic Beanstalk's configuration) rather than baked into the code or a checked-in properties file.

**Why this specific pattern — externalized configuration — is not new to this chapter, only newly essential.** The exact same principle already governed the JWT signing secret (see [[project-setup-for-jwt]]) and the OAuth2 client secret (see [[google-oauth2-login]]) earlier in this course: anything that differs between environments, or is sensitive, belongs in configuration read at runtime, never hardcoded in source. A database connection string that includes a real hostname and password is exactly this kind of value.

**What this topic deliberately leaves unfinished, on purpose.** The \`\${DB_URL}\` placeholders have nothing to resolve to yet — no RDS database exists — which is exactly why the next topic creates one, and the topic after that wires the resulting real values into Elastic Beanstalk's environment configuration.`,
  code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

# application.properties - externalized, no hardcoded values
# spring.datasource.url=\${DB_URL}
# spring.datasource.username=\${DB_USERNAME}
# spring.datasource.password=\${DB_PASSWORD}
# spring.jpa.hibernate.ddl-auto=update`,
  codeTitle: 'Adding JPA/PostgreSQL with fully externalized connection configuration',
  points: [
    'Adding a database follows the same Spring Data JPA pattern already established throughout this course - the new part is preparing the app for a database whose hostname is not yet known.',
    'Every connection detail (URL, username, password) is externalized to environment variable placeholders, not hardcoded - a fixed localhost connection string, correct for local development, cannot work once deployed.',
    'This is the same externalized-configuration principle already applied to the JWT signing secret and OAuth2 client secret earlier in this course, now applied to database credentials.',
    'The environment variables referenced here have nothing to resolve to yet, since no actual database exists - creating one is the very next topic.',
    'Once a real RDS database exists, its actual connection details get set as environment variables in the Elastic Beanstalk environment configuration, not edited into the code.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Hardcoding a real database hostname, username, or password directly into application.properties and committing it, even temporarily "to get it working," means that credential is now in version control history permanently - exactly the same class of mistake already flagged for the JWT secret and OAuth2 client secret earlier in this course, now equally applicable to database credentials.' },
    { type: 'interview', content: 'Q: Why must database connection details for a cloud-deployed application be read from environment variables rather than hardcoded in application.properties, even though hardcoding worked fine throughout local development in this course?\nA: Local development always ran the database on the same known localhost address, but a cloud database has its own provider-assigned hostname that is not known when the code is written, and differs between environments (dev, staging, production). Environment variables let the exact same code run correctly against different databases in different environments, and also avoid committing sensitive credentials into source control - the same principle already applied to the JWT secret and OAuth2 client secret.' },
  ],
}
