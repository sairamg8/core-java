export default {
  id: 'running-spring-boot-web-app-on-docker',
  title: '508. Running Spring Boot Web App On Docker',
  explanation: `With a working JAR confirmed on the host machine (see [[packing-the-spring-boot-web-app]]), this topic writes the simplest possible Dockerfile that actually runs it inside a container — deliberately basic, as the foundation the next topic (see [[dockerfile-for-docker-images]]) builds a properly optimized version on top of.

**The minimal Dockerfile:**
\`\`\`dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/job-app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

**Reading each instruction, connecting directly back to concepts already covered in this chapter:**
- \`FROM eclipse-temurin:21-jre-alpine\` — starts from an existing image (see [[what-is-docker]], [[running-jdk-docker-container]]) as the base layer; **\`jre\`, not \`jdk\`** here specifically, since running the already-built JAR needs the Java Runtime, not the full Development Kit (compilers, build tools) the JDK image carries — a smaller image for exactly the same reason \`-DskipTests\` was scoped narrowly in the previous topic: only include what's actually needed for this specific job.
- \`WORKDIR /app\` — sets the working directory inside the container for every instruction that follows
- \`COPY target/job-app-0.0.1-SNAPSHOT.jar app.jar\` — copies the JAR built on the host machine into the image, renaming it to a fixed, predictable \`app.jar\`
- \`EXPOSE 8080\` — documents which port the container listens on (the Job app's default Spring Boot port); this is documentation for humans and tooling, not what actually makes the port reachable — that's still \`-p\` at \`docker run\` time (see [[running-first-container]])
- \`ENTRYPOINT ["java", "-jar", "app.jar"]\` — the command that runs when the container starts, exactly mirroring the \`java -jar\` command already verified working on the host

**Building and running it:**
\`\`\`bash
docker build -t job-app .
docker run -d -p 8080:8080 job-app
\`\`\`
\`http://localhost:8080/jobs\` now serves the Job app's REST API, running entirely inside a container — the concrete milestone this entire Docker chapter has been building toward.

**Why this specific Dockerfile is intentionally not yet production-optimal, and what that means for the next topic.** It requires the JAR to already exist on the host (built via \`./mvnw package\` first, as a separate manual step) — a real production setup instead builds the JAR *inside* Docker itself, so the only prerequisite for building the image is Docker, not a correctly configured local Maven/JDK setup — exactly the improvement the next topic makes.`,
  code: `# Minimal Dockerfile - references a JAR already built on the host
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/job-app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build and run
docker build -t job-app .
docker run -d -p 8080:8080 job-app
# http://localhost:8080/jobs now serves the Job app from inside a container`,
  codeTitle: 'The minimal Dockerfile that first gets the Job app running in a container',
  points: [
    'jre-alpine (not jdk) is the correct base image for running an already-built JAR - only the runtime is needed, not compilers or build tools, keeping the image smaller.',
    'EXPOSE 8080 documents the port the container listens on for humans and tooling - it does not itself make the port reachable, which still requires -p at docker run time.',
    'ENTRYPOINT ["java", "-jar", "app.jar"] is the command run on container start, directly mirroring the java -jar command already confirmed working on the host in the previous topic.',
    'This minimal Dockerfile requires the JAR to already be built on the host before docker build runs - a real limitation the next topic removes by building the JAR inside Docker itself.',
    'Reaching http://localhost:8080/jobs from a running container is the concrete milestone this entire Docker chapter has been building toward since the first topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker build without first running ./mvnw package (or with an outdated JAR from a previous build still sitting in target/) silently packages a stale or missing JAR into the image - COPY has no way to know the JAR is outdated, so the container may start successfully but run old code, or fail if no JAR exists at all.' },
    { type: 'interview', content: 'Q: Why does this Dockerfile use eclipse-temurin:21-jre-alpine rather than the JDK image used earlier in this chapter to verify java -version?\nA: Running an already-built JAR only requires the Java Runtime Environment, not the full Java Development Kit with its compilers and build tooling - using the smaller JRE-based image keeps the resulting container image size down while still providing everything actually needed to execute the JAR at runtime.' },
  ],
}
