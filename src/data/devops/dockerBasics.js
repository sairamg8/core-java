export default {
  id: 'docker-basics',
  title: '1. Docker — Images, Containers & Dockerfile',
  explanation: `**Docker** packages an application and ALL its dependencies (JDK, libraries, config) into a **container** — a lightweight, isolated, reproducible unit that runs the same way everywhere.

**Key concepts:**
- **Image** — a read-only template (built from a Dockerfile). Think of it as a snapshot.
- **Container** — a running instance of an image. Multiple containers can run from the same image.
- **Dockerfile** — a recipe (text file with instructions) for building an image
- **Registry** — a repository for storing and sharing images (Docker Hub, AWS ECR, GitHub Container Registry)

**Why Docker for Java?**
- Eliminates "works on my machine" — the JDK version and OS are locked in the image
- Standardized deployment — the same artifact runs in dev, staging, and production
- Fast horizontal scaling — spin up more containers in seconds`,
  code: `# === Dockerfile for a Spring Boot app ===

# Multi-stage build: separate build stage from runtime stage
# Stage 1 — build the JAR
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline        # cache deps separately (layer caching)
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2 — minimal runtime image (no JDK, only JRE)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# === Common Docker commands ===
# Build an image (tag it as myapp:1.0)
docker build -t myapp:1.0 .
docker build -t myapp:latest .         # latest tag is the default

# Run a container
docker run -p 8080:8080 myapp:1.0      # map host port 8080 to container port 8080
docker run -d -p 8080:8080 myapp:1.0   # -d = detached (background)
docker run -e DB_URL=jdbc://... -p 8080:8080 myapp:1.0  # pass env vars

# Container management
docker ps                              # list running containers
docker ps -a                           # list all containers (including stopped)
docker stop <container-id>
docker rm <container-id>               # remove stopped container
docker logs <container-id>             # see stdout/stderr
docker exec -it <container-id> sh      # get a shell inside the container

# Image management
docker images                          # list local images
docker pull eclipse-temurin:21-jre-alpine  # pull from Docker Hub
docker rmi myapp:1.0                   # remove local image
docker push myapp:1.0                  # push to registry (must be logged in)`,
  points: [
    'Multi-stage builds keep the production image small — the final image gets only the JRE and the JAR, not the full JDK + Maven',
    'Layer caching: copy pom.xml and run mvn dependency:go-offline BEFORE copying src — dependencies are cached separately and only re-downloaded when pom.xml changes',
    'Use EXPOSE to document which port the container listens on; use -p to actually bind it to the host',
    'Environment variables (-e) are the standard way to pass config (DB URLs, secrets) to containers — never bake secrets into the image',
    'eclipse-temurin is the recommended OpenJDK distribution for Docker; use Alpine variants for smaller images',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between a Docker image and a container?\nA: An image is a static, read-only snapshot built from a Dockerfile — like a class in Java. A container is a running instance of an image — like an object instantiated from that class. You can run many containers from one image. Containers are ephemeral: stopping and removing a container discards its writable layer. Data that must persist goes in a volume.',
    },
    {
      type: 'gotcha',
      content: 'Running as root inside a Docker container is a security risk. Add USER 1001 before the ENTRYPOINT to run as a non-root user. Many base images (eclipse-temurin) include a non-root user; check the image docs.',
    },
  ],
}
