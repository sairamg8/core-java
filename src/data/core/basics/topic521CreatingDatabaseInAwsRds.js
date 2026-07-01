export default {
  id: 'creating-database-in-aws-rds',
  title: '521. Creating Database in AWS RDS',
  explanation: `The previous topic prepared the app with environment-variable placeholders for database configuration, with nothing yet to resolve them to (see [[spring-project-with-database]]) — this topic creates the actual database those placeholders will eventually point at, using **RDS (Relational Database Service)**.

**What RDS actually is, precisely: a managed relational database, not a self-managed one running on a rented server.** Running PostgreSQL on a raw EC2 instance would mean personally handling OS patching, PostgreSQL version upgrades, backup scheduling, and failover — RDS handles all of that automatically, in exchange for somewhat less low-level control than a self-managed installation would offer.

**Creating an RDS PostgreSQL instance via the AWS Console, the essential choices:**
1. Choose the engine: **PostgreSQL**
2. Choose an instance size — \`db.t3.micro\` is Free Tier eligible, the right choice for this course's purposes
3. Set the initial database name, master username, and master password
4. Configure network access — critically, **which resources are allowed to connect** (covered specifically below)
5. Launch — RDS provisions the actual database server, a process that typically takes several minutes

**The one security decision in this list that matters most, and is worth calling out explicitly: network access should be scoped narrowly, not opened to the entire internet.** By default, RDS instances are placed inside a private network (VPC) not directly reachable from the public internet — and that's the correct, secure default. Access should be granted specifically to the resources that legitimately need it (the Elastic Beanstalk environment running the Job app, in this chapter's case), not opened broadly "to make development easier" — a database exposed to \`0.0.0.0/0\` (any IP address) is a real, common, and completely avoidable security incident.

**Retrieving the connection details this database creation produces — exactly what the previous topic's environment variables need to resolve to.** Once created, RDS provides an **endpoint** (the actual hostname, something like \`job-app-db.abc123xyz.us-east-1.rds.amazonaws.com\`) and the port (\`5432\` for PostgreSQL) — combined with the master username/password chosen during creation, these are the real values for \`DB_URL\`, \`DB_USERNAME\`, and \`DB_PASSWORD\` (see [[spring-project-with-database]]) — set in the Elastic Beanstalk environment configuration, covered in the very next topic, never hardcoded into the application itself.`,
  code: `# The essential RDS creation choices (via AWS Console):
# Engine: PostgreSQL
# Instance size: db.t3.micro (Free Tier eligible)
# Initial database name: jobapp
# Master username / password: set during creation
# Network access: scoped to specific resources only - NOT 0.0.0.0/0

# After creation, RDS provides:
# Endpoint:  job-app-db.abc123xyz.us-east-1.rds.amazonaws.com
# Port:      5432

# These become the real values behind the environment variables
# referenced in application.properties from the previous topic:
# DB_URL      = jdbc:postgresql://job-app-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/jobapp
# DB_USERNAME = <master username chosen during creation>
# DB_PASSWORD = <master password chosen during creation>`,
  codeTitle: 'RDS creation choices, and the endpoint/port they produce',
  points: [
    'RDS is a managed relational database - AWS handles OS patching, engine version upgrades, backups, and failover automatically, unlike self-managing PostgreSQL on a raw EC2 instance.',
    'db.t3.micro is the Free Tier eligible instance size, appropriate for learning and small workloads.',
    'RDS network access should be scoped narrowly to specific resources that need it, never opened broadly to the entire internet (0.0.0.0/0) - the private-network default is the correct, secure starting point.',
    'RDS produces an endpoint (hostname) and port once created - these are the real values that resolve the DB_URL/DB_USERNAME/DB_PASSWORD environment variable placeholders from the previous topic.',
    'These real connection values get set in the Elastic Beanstalk environment configuration in the next topic, never hardcoded into the application source code.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Opening RDS network access to 0.0.0.0/0 "just to make local testing easier" exposes the database directly to the entire internet, where automated scanning bots routinely probe for exactly this misconfiguration - this is one of the most common, avoidable real-world cloud security incidents, and network access should always be scoped to specific known resources instead.' },
    { type: 'interview', content: 'Q: What does RDS actually manage on behalf of the developer compared to running PostgreSQL manually on an EC2 instance, and what is the most important security decision when creating an RDS instance?\nA: RDS handles OS patching, database engine version upgrades, automated backups, and failover, none of which need to be configured or maintained manually as they would on a self-managed EC2 database. The most important security decision is scoping network access narrowly to only the specific resources (like the application server) that need to connect, rather than opening it broadly to the internet, which would expose the database to automated attacks.' },
  ],
}
