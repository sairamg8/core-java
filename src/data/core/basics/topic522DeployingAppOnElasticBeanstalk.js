export default {
  id: 'deploying-app-on-elastic-beanstalk',
  title: '522. Deploying App on Elastic Beanstalk',
  explanation: `Every piece is now in place separately: a database-ready app with externalized configuration (see [[spring-project-with-database]]), and a real RDS database with actual connection details (see [[creating-database-in-aws-rds]]). This topic connects them — deploying the database-backed app to Elastic Beanstalk, the same platform used earlier for the no-database version (see [[deploying-on-elastic-beanstalk]]), but now with real environment variables wired in.

**Setting environment variables in the Elastic Beanstalk environment configuration — not in the code, not in a properties file committed to the repository.** In the AWS Console, under the environment's **Configuration → Software** settings, environment variables can be set directly:
\`\`\`
DB_URL = jdbc:postgresql://job-app-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/jobapp
DB_USERNAME = <the master username chosen during RDS creation>
DB_PASSWORD = <the master password chosen during RDS creation>
\`\`\`
Spring Boot's \`\${DB_URL}\` placeholders (see [[spring-project-with-database]]) resolve these from the actual runtime environment the moment the app starts inside Elastic Beanstalk — no code change, and no rebuild of the JAR, is needed to supply them.

**Redeploying the updated application version** — the same upload flow as the first deployment (see [[deploying-on-elastic-beanstalk]]), just with the database-enabled JAR this time:
\`\`\`bash
./mvnw clean package -DskipTests
# Upload target/simple-web-app-0.0.1-SNAPSHOT.jar as a new application version
\`\`\`

**Why this specific ordering — database and environment variables configured *before* the new deploy, not after — matters.** If the app starts up and tries to connect to a database using an unresolved or missing \`\${DB_URL}\` placeholder, it fails immediately at startup with a connection error — configuring the environment variables first, confirming they're actually set, and *then* deploying the database-dependent code avoids a predictable, easily-avoided failure sequence.

**What this topic represents as a milestone for the whole AWS chapter so far.** A real Spring Boot application, backed by a real managed PostgreSQL database, running on real AWS infrastructure, with credentials read from environment configuration rather than hardcoded — genuinely production-shaped, even though it's a small example app. Everything from here in this chapter (ECS, containers) builds toward alternative or more advanced ways of achieving this same end state, not a fundamentally different goal.`,
  code: `# 1. Set environment variables in Elastic Beanstalk (Console -> Configuration -> Software):
# DB_URL      = jdbc:postgresql://job-app-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/jobapp
# DB_USERNAME = <master username>
# DB_PASSWORD = <master password>

# 2. Build the updated, database-enabled JAR
./mvnw clean package -DskipTests

# 3. Upload target/simple-web-app-0.0.1-SNAPSHOT.jar as a new application version
#    Elastic Beanstalk redeploys automatically once uploaded

# 4. Confirm: the app starts, connects to RDS, and serves requests successfully`,
  codeTitle: 'Wiring real RDS credentials into Elastic Beanstalk before redeploying',
  points: [
    'Environment variables are set in the Elastic Beanstalk environment configuration itself (Console -> Configuration -> Software), not in code or a committed properties file.',
    'The ${...} placeholders in Spring Boot resolve these values from the actual runtime environment the moment the app starts - no code change or rebuild is needed to supply them.',
    'Configuring environment variables before deploying the database-dependent code avoids a predictable startup failure where the app tries to connect using an unresolved placeholder.',
    'Redeploying uses the same upload flow as the original no-database deployment, just with the updated JAR built after adding JPA/PostgreSQL support.',
    'This milestone represents a genuinely production-shaped setup: a real app, a real managed database, and credentials read from environment configuration rather than hardcoded anywhere.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Deploying the database-enabled JAR before setting the DB_URL/DB_USERNAME/DB_PASSWORD environment variables in Elastic Beanstalk causes the app to fail immediately on startup with an unresolved placeholder or connection error - always confirm environment variables are set correctly first, then deploy the code that depends on them.' },
    { type: 'interview', content: 'Q: After creating an RDS database with real connection details, where do those details actually get configured so the deployed Spring Boot app can use them?\nA: In the Elastic Beanstalk environment configuration itself (under Configuration -> Software -> Environment properties), not in the application code or any file committed to source control. The ${...} placeholders in application.properties resolve these values from the actual runtime environment when the app starts, which is exactly what lets the same JAR run correctly against different databases in different environments without any code change.' },
  ],
}
