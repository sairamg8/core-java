export default {
  id: 'running-multiple-containers',
  title: '512. Running Multiple Containers',
  explanation: `With Compose managing two services already (see [[docker-compose-topic]]), this topic scales up to a more realistic setup — adding a third service, and covering the operational commands needed to manage several running containers together rather than one at a time.

**Adding a third service — Redis, for caching, alongside the existing \`app\` and \`db\`:**
\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/jobapp
      - SPRING_REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=jobapp
      - POSTGRES_PASSWORD=postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
\`\`\`
Adding a service is purely additive — one more block in the same file, reachable by \`redis\` the same way \`db\` already was, with no change needed to how the other two services are configured.

**Managing several containers as a group, rather than individually — commands that only make sense once multiple containers are involved:**
\`\`\`bash
docker compose ps              # status of every service in this compose file
docker compose logs             # combined logs from ALL services, interleaved
docker compose logs app          # logs from just the app service
docker compose restart app        # restart just one service, leaving others running
docker compose up -d --scale app=3  # run THREE instances of the app service
\`\`\`

**Why \`docker compose logs\` (with no service name) interleaving output from every container at once is genuinely useful, not just noisy.** A request that touches the app, then the database, then Redis produces log lines from all three around the same time — seeing them interleaved chronologically often reveals the actual sequence of what happened across services, which reading each container's logs in isolation (via plain \`docker logs\`) would make much harder to piece back together.

**\`--scale app=3\` — running multiple instances of the same service, and the immediate question it raises.** With three \`app\` containers all trying to bind the same host port \`8080\`, they can't all succeed — this specific problem (multiple instances, one entry point) is exactly what a load balancer or reverse proxy exists to solve, previewing the kind of architecture the Microservices chapter later in this course builds on directly.`,
  code: `# docker-compose.yml with a third service added
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/jobapp
      - SPRING_REDIS_HOST=redis
    depends_on: [db, redis]

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=jobapp
      - POSTGRES_PASSWORD=postgres

  redis:
    image: redis:7-alpine

# Managing multiple running containers as a group
docker compose ps
docker compose logs
docker compose logs app
docker compose restart app`,
  codeTitle: 'A three-service Compose file, and commands for managing them as a group',
  points: [
    'Adding a service to docker-compose.yml is purely additive - one more block, reachable by name like any existing service, with no change to the others.',
    'docker compose ps shows the status of every service defined in the file at once, rather than checking each container individually.',
    'docker compose logs (no service name) interleaves output from every service chronologically, which often reveals the real sequence of events across services more clearly than checking each container log separately.',
    'docker compose restart <service> restarts just one service, leaving the rest of the multi-container setup running untouched.',
    '--scale app=3 runs multiple instances of one service, immediately raising the question of how multiple instances share one entry point - the problem a load balancer solves, previewed here before the Microservices chapter covers it directly.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker compose up -d --scale app=3 with a fixed host port mapping like "8080:8080" on the app service fails, since three containers cannot all bind the same host port simultaneously - scaling a service typically requires either a dynamic port range or, more realistically, a load balancer in front of the multiple instances.' },
    { type: 'interview', content: 'Q: What advantage does docker compose logs (without specifying a service) have over checking the logs of each container separately with plain docker logs?\nA: It interleaves log output from every service in the compose file chronologically, in one combined stream. Since a single request often touches multiple services in sequence (an app, a database, a cache), seeing their log lines interleaved by actual timestamp frequently makes the real sequence of what happened much easier to reconstruct than reading the logs of each service in isolation and manually correlating timestamps.' },
  ],
}
