export default {
  id: 'dockerfile-for-docker-images',
  title: '509. Dockerfile For Docker Images',
  explanation: `The minimal Dockerfile from the previous topic (see [[running-spring-boot-web-app-on-docker]]) works, but requires a JAR already built on the host, and produces a bigger image than necessary. This topic writes the properly production-shaped version: a **multi-stage build**, which fixes both.

**The full multi-stage Dockerfile:**
\`\`\`dockerfile
# Stage 1 - build the JAR entirely inside Docker (needs the full JDK + Maven)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2 - minimal runtime image (no JDK, no Maven, no source code)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

**Why two \`FROM\` instructions in one file — the core idea of a multi-stage build.** Each \`FROM\` starts a fresh, independent stage. Stage 1 (\`AS builder\`) has the full JDK and Maven, does the actual compiling and packaging — everything needed to *build* the JAR. Stage 2 starts completely fresh from a minimal JRE base and \`COPY --from=builder\` pulls **only the finished JAR** out of stage 1 — none of stage 1's JDK, Maven cache, or source code end up in the final image at all.

**The concrete size difference this produces, and why it matters beyond "smaller is nicer."** A JDK + Maven + full source tree image can easily be several hundred megabytes larger than a JRE-only image with just the final JAR — a smaller final image means faster \`docker push\`/\`pull\` (real time savings in CI/CD and deployment), a smaller attack surface (no compilers or build tools present at runtime for an attacker to potentially abuse), and lower storage cost across every registry and host that stores it.

**Why \`COPY .mvn/ .mvn/\` and \`COPY mvnw pom.xml ./\` happen *before* \`COPY src ./src\`, deliberately in that order — Docker's layer caching, made concrete.** Docker caches each instruction's result as a separate layer; if \`pom.xml\` hasn't changed since the last build, \`RUN ./mvnw dependency:go-offline\` (downloading every dependency) can reuse its cached layer entirely, skipping re-downloading dependencies — even though \`src\` (the actual application code) almost always changes far more often than \`pom.xml\` does. Copying \`src\` last means only the layers *after* it need to be redone on a typical code-only change, not the expensive dependency-download step.

**The one prerequisite this removes, compared to the previous topic's minimal Dockerfile.** \`docker build\` alone now produces a working image from source — no separate \`./mvnw package\` step needs to run on the host first at all; only Docker itself is required, which is exactly the CI/CD-friendly property a real deployment pipeline needs.`,
  code: `# Stage 1 - build (full JDK + Maven, only exists during the build)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2 - runtime (JRE only - JDK, Maven, and source never make it here)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  codeTitle: 'A multi-stage Dockerfile: build with the JDK, ship with only the JRE',
  points: [
    'A multi-stage build uses more than one FROM instruction - each starts a fresh stage, and COPY --from=<stage> pulls only specific files from an earlier stage into a later one.',
    'The build stage needs the full JDK and Maven to compile and package; the final runtime stage starts fresh from a minimal JRE image and receives only the finished JAR.',
    'None of the JDK, Maven cache, or source code from the build stage end up in the final image - only what COPY --from explicitly pulls out.',
    'Copying pom.xml and running dependency:go-offline before copying src (application code) lets the layer cache in Docker reuse the expensive dependency-download step when only source code changes, not the pom.xml.',
    'docker build alone now produces a complete image from source with no separate host-side Maven build step required, unlike the minimal single-stage Dockerfile from the previous topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Copying the entire application source (COPY src ./src) before copying just pom.xml and running dependency resolution defeats the layer caching in Docker almost entirely - any source code change (which happens far more often than dependency changes) would then force a full dependency re-download on every single build, dramatically slowing iteration.' },
    { type: 'interview', content: 'Q: What does a multi-stage Dockerfile actually accomplish that a single-stage Dockerfile referencing a pre-built JAR does not?\nA: It builds the JAR entirely inside Docker (using a full JDK+Maven stage) and then copies only the finished JAR into a separate, minimal JRE-only final stage - so the final image never contains the JDK, Maven, build caches, or source code. This produces a smaller, more secure final image and removes the need for a separate host-side build step, since docker build alone can now go from source to a runnable image.' },
  ],
}
