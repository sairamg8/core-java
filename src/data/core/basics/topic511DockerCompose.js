export default {
  id: 'docker-compose-topic',
  title: '511. Docker Compose',
  explanation: `The previous topic manually created a network and ran two long \`docker run\` commands to connect the Job app and PostgreSQL (see [[web-app-with-postgresql]]) — **Docker Compose** replaces all of that with one declarative file, describing the whole multi-container setup at once.

**The same two-container setup from the previous topic, expressed as \`docker-compose.yml\`:**
\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/jobapp
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=postgres
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=jobapp
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
\`\`\`

**Running the entire multi-container setup with one command:**
\`\`\`bash
docker compose up
\`\`\`
No manual \`docker network create\`, no separately typed \`docker run\` commands for each container — Compose reads the file, creates a network automatically, builds the \`app\` image from the local \`Dockerfile\` (see [[dockerfile-for-docker-images]]), pulls \`postgres:16\` if needed, and starts both containers already connected.

**Why \`db\` (the service name) works exactly like \`job-db\` (the \`--name\`) did in the manual version, with no extra networking step required.** Compose automatically creates a shared network for every service defined in the same file and makes each one reachable by its service name — \`jdbc:postgresql://db:5432/jobapp\` in the \`app\` service resolves \`db\` the same way \`job-db\` resolved manually before, just without a separate \`docker network create\` command needed at all.

**\`depends_on\` — controlling startup order, and its real limitation, stated honestly.** \`depends_on: [db]\` makes Compose start \`db\` before \`app\` — but it only waits for the \`db\` **container to start**, not for PostgreSQL *inside* it to actually finish initializing and be ready to accept connections. A Spring Boot app that tries to connect the instant its container starts can still fail if PostgreSQL hasn't finished booting yet — a real gap that \`healthcheck\` configuration (a further Compose feature beyond this introductory topic) exists specifically to close, by letting \`depends_on\` wait for an actual readiness check rather than just "the container process exists."

**Stopping everything, symmetrically simple:**
\`\`\`bash
docker compose down
\`\`\`
Tears down every container, and the network Compose created for them, in one command — the same multi-step teardown from the manual version, collapsed to one line.`,
  code: `# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/jobapp
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=postgres
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=jobapp
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"

# Start everything with one command
docker compose up

# Stop and remove everything with one command
docker compose down`,
  codeTitle: 'The whole Job app + PostgreSQL setup, declared in one docker-compose.yml',
  points: [
    'docker-compose.yml declares multiple services (containers), their configuration, and how they relate, replacing separately typed docker run commands and manual network setup.',
    'docker compose up creates a shared network automatically, builds/pulls every needed image, and starts all defined services already connected - no manual docker network create required.',
    'Services reference each other by service name (db, app) exactly like containers referenced each other by --name in the manual setup, just without an explicit networking step.',
    'depends_on controls startup order but only waits for a container to start, not for the application inside it (like PostgreSQL) to actually finish initializing and become ready.',
    'docker compose down tears down every container and the associated network in one command, symmetric with how docker compose up started everything.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Relying on depends_on alone to guarantee a database is ready before the app tries to connect is a common source of intermittent startup failures - depends_on only waits for the database container to start, not for PostgreSQL inside it to finish initializing; a proper healthcheck is needed to actually wait for readiness rather than just container existence.' },
    { type: 'interview', content: 'Q: What does depends_on in docker-compose.yml actually guarantee, and what does it not guarantee?\nA: It guarantees start order - the container of the depended-on service is started before the container of the dependent service. It does not guarantee that the depended-on service is actually ready to accept requests or connections yet - a database container can be "started" while PostgreSQL inside it is still initializing. A healthcheck, combined with condition: service_healthy, is what actually makes depends_on wait for real readiness rather than just container start.' },
  ],
}
