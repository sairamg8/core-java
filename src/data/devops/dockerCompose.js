export default {
  id: 'docker-compose',
  title: '2. Docker Compose — Multi-Service Apps',
  explanation: `**Docker Compose** defines and runs multi-container applications using a single YAML file (\`docker-compose.yml\`). Instead of running multiple \`docker run\` commands with dozens of flags, you declare all services, networks, and volumes in one place.

**Common use: run your Spring Boot app + MySQL + Redis together locally.**

**Key docker-compose concepts:**
- **services** — each service becomes one or more containers
- **networks** — Compose creates a default network; services can reach each other by service name
- **volumes** — persistent storage that survives container restarts
- **depends_on** — start order (does not wait for health, only for container start)
- **healthcheck** — polls a command to determine if a service is truly ready`,
  code: `# docker-compose.yml — Spring Boot + MySQL + Redis

version: '3.9'

services:

  # Spring Boot application
  app:
    build: .                          # build from Dockerfile in current directory
    # image: myapp:1.0               # OR pull a pre-built image
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb
      - SPRING_DATASOURCE_USERNAME=appuser
      - SPRING_DATASOURCE_PASSWORD=secret
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
    depends_on:
      db:
        condition: service_healthy    # wait until db is healthy
    networks:
      - backend

  # MySQL database
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: mydb
      MYSQL_USER: appuser
      MYSQL_PASSWORD: secret
    volumes:
      - mysql_data:/var/lib/mysql     # persist data across restarts
    ports:
      - "3306:3306"                   # expose for local tools (optional in prod)
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpassword"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Redis cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - backend

volumes:
  mysql_data:                         # named volume persists after 'down'

networks:
  backend:
    driver: bridge

# === Common Compose commands ===
# docker compose up -d               # start all services in background
# docker compose up --build -d       # rebuild images before starting
# docker compose down                # stop and remove containers (volumes preserved)
# docker compose down -v             # stop + remove containers AND volumes (data lost!)
# docker compose logs -f app         # follow logs for 'app' service
# docker compose ps                  # see status of all services
# docker compose exec app sh         # shell into the 'app' container
# docker compose restart app         # restart one service`,
  points: [
    'Services in the same Compose network can reach each other using the service name as hostname (db, redis) — no IP addresses needed',
    'Named volumes (mysql_data) survive docker compose down; anonymous volumes and bind mounts do not',
    'condition: service_healthy requires a healthcheck on the dependency — better than just depends_on which only waits for container start',
    'Never put production secrets in docker-compose.yml — use .env files, Docker secrets, or an external secrets manager',
    'In production use Kubernetes (k8s) or AWS ECS instead of Compose — Compose is primarily a local development tool',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How does networking work in Docker Compose?\nA: Compose creates a default bridge network and attaches all services to it. Services can reach each other using their service name as a DNS hostname — the app container connects to MySQL at jdbc:mysql://db:3306/... where "db" is the service name. No manual IP addresses or hosts file entries are needed.',
    },
    {
      type: 'tip',
      content: 'Use a .env file alongside docker-compose.yml to store sensitive values (passwords, API keys). Docker Compose automatically loads .env and substitutes ${VARIABLE} references. Add .env to .gitignore and share a .env.example with placeholder values in the repo.',
    },
  ],
}
