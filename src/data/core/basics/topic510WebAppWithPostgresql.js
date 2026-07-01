export default {
  id: 'web-app-with-postgresql',
  title: '510. Web App with PostgreSQL',
  explanation: `The containerized Job app (see [[dockerfile-for-docker-images]]) still connects to a PostgreSQL database running directly on the host machine, outside Docker entirely — this topic runs PostgreSQL itself in a container too, and confronts the first genuinely new problem that creates: **how do two separate containers find each other?**

**Running PostgreSQL in its own container:**
\`\`\`bash
docker run -d --name job-db \\
  -e POSTGRES_DB=jobapp \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=postgres \\
  -p 5432:5432 \\
  postgres:16
\`\`\`
\`-e\` (environment variables) here configures PostgreSQL's own startup — the database name, user, and password to initialize with — the official \`postgres\` image is specifically built to read these on first startup and set itself up accordingly, with no manual SQL needed.

**The problem: the Job app container's \`application.properties\` currently points at \`localhost:5432\` — and that's wrong the moment both are containers.** Inside the Job app's own container, \`localhost\` refers to *that container itself*, not the host machine, and not the separate PostgreSQL container — each container has its own isolated network namespace by default (see [[solution-with-containerization]]), so \`localhost\` inside one container has no way to reach a process running inside a different container.

**The fix: Docker networks, letting containers reach each other by name.**
\`\`\`bash
docker network create job-network
docker run -d --name job-db --network job-network -e POSTGRES_DB=jobapp \\
  -e POSTGRES_PASSWORD=postgres postgres:16
docker run -d --name job-app --network job-network -p 8080:8080 \\
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://job-db:5432/jobapp job-app
\`\`\`
Both containers join the same custom network (\`job-network\`); Docker's built-in DNS then lets one container reach another by its \`--name\` — \`jdbc:postgresql://job-db:5432/jobapp\` resolves \`job-db\` to the actual PostgreSQL container's address automatically, with no IP addresses hardcoded anywhere.

**Why this container-to-container networking problem is exactly the kind of coordination that becomes tedious to manage by hand with plain \`docker run\` commands, once more than two containers are involved.** Creating the network, remembering to attach every related container to it, and wiring environment variables correctly across multiple long \`docker run\` invocations is precisely the tedium the next topic, Docker Compose, exists to eliminate.`,
  code: `# Create a shared network so containers can reach each other by name
docker network create job-network

# Run PostgreSQL on that network
docker run -d --name job-db --network job-network \\
  -e POSTGRES_DB=jobapp -e POSTGRES_PASSWORD=postgres \\
  postgres:16

# Run the Job app on the same network, pointing at "job-db" not "localhost"
docker run -d --name job-app --network job-network -p 8080:8080 \\
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://job-db:5432/jobapp \\
  job-app`,
  codeTitle: 'Two containers on a shared Docker network, connecting by container name',
  points: [
    'The official postgres image reads POSTGRES_DB/POSTGRES_USER/POSTGRES_PASSWORD environment variables on first startup to initialize itself, with no manual SQL required.',
    'localhost inside a container refers to that container itself, not the host machine and not a separate container - each container has its own isolated network namespace by default.',
    'A custom Docker network (docker network create) plus --network on each container lets containers reach each other by their --name via the built-in DNS in Docker.',
    'jdbc:postgresql://job-db:5432/jobapp resolves job-db to the actual database container automatically, with no hardcoded IP address anywhere in configuration.',
    'Manually creating networks and wiring environment variables across multiple long docker run commands becomes tedious once more than two containers are involved - the exact problem Docker Compose (next) solves.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Leaving SPRING_DATASOURCE_URL pointed at jdbc:postgresql://localhost:5432/jobapp after moving PostgreSQL into its own container is a very common mistake - the app container fails to connect, since localhost inside a container never refers to a different container, only to itself.' },
    { type: 'interview', content: 'Q: Why does jdbc:postgresql://localhost:5432/jobapp stop working once both the Spring Boot app and PostgreSQL are running in separate Docker containers?\nA: localhost inside a container always refers to that same container, not the host machine or any other container - each container has its own isolated network namespace by default. The fix is to put both containers on a shared custom Docker network and reference the database container by its --name (e.g. job-db) instead of localhost, letting the built-in DNS in Docker resolve that name to the correct container.' },
  ],
}
