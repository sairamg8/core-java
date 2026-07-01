export default {
  id: 'packing-the-spring-boot-web-app',
  title: '507. Packing The Spring Boot Web App',
  explanation: `Every Docker command so far has run someone else's image (\`nginx\`, an official JDK — see [[running-jdk-docker-container]]) — this topic takes the actual first step toward containerizing the Job app itself: packaging it as a runnable JAR, the artifact a Dockerfile will wrap in the next few topics.

**Building the Job app into an executable JAR — Spring Boot's Maven plugin, already present from way back in the Maven chapter, is what makes this a single command:**
\`\`\`bash
./mvnw clean package -DskipTests
\`\`\`
This produces \`target/job-app-0.0.1-SNAPSHOT.jar\` — an executable "fat JAR" containing not just the Job app's own compiled classes, but every dependency it needs bundled inside it (Spring Boot, the web server, the JDBC driver) — genuinely runnable with nothing else installed except a JDK.

**Confirming it works exactly as it would eventually run inside a container, before Docker is involved at all:**
\`\`\`bash
java -jar target/job-app-0.0.1-SNAPSHOT.jar
\`\`\`
This is a deliberate, important intermediate check: if the JAR doesn't run correctly here, on the host machine directly, it will not magically start working once wrapped in a Docker container — Docker changes *where* the JAR runs, not *whether* the JAR itself is correctly built.

**\`-DskipTests\` — why it's included here specifically, and what it trades away.** Running the full test suite on every build adds real time, and for the purpose of this chapter (getting a container running), the Job app's tests were already verified passing in earlier chapters — skipping them here is a deliberate, scoped optimization for iterating on Docker configuration quickly, not a general recommendation to skip tests in a real CI/CD pipeline (which absolutely should run them).

**What's deliberately *not* covered in this topic, on purpose: any \`Dockerfile\` content at all.** This topic's entire scope is producing a working JAR, confirmed runnable outside a container first — a clean, explicit prerequisite before the next topic writes the actual Dockerfile that wraps it (see [[running-spring-boot-web-app-on-docker]]), keeping "is the JAR itself correct" and "is the Dockerfile correct" as two separately debuggable questions rather than one tangled one.`,
  code: `# Build the executable JAR
./mvnw clean package -DskipTests

# Confirm it works outside Docker first - isolates JAR problems
# from Dockerfile problems before Docker is even involved
java -jar target/job-app-0.0.1-SNAPSHOT.jar

# Expected: the Job app starts normally, exactly as it does when run from an IDE`,
  codeTitle: 'Building and verifying the Job app JAR before any Docker involvement',
  points: [
    'The Maven plugin in Spring Boot produces a "fat JAR" bundling the application and every dependency it needs - genuinely runnable with just a JDK installed, nothing else.',
    'Confirming java -jar works on the host machine directly, before writing any Dockerfile, isolates "is the JAR itself correct" from "is the Docker packaging correct" as separate, independently debuggable questions.',
    'Docker changes where a correctly built JAR runs - it does not fix a JAR that does not already run correctly on its own.',
    '-DskipTests is a deliberate, scoped shortcut for quickly iterating on Docker configuration in this chapter, not a general recommendation for a real CI/CD pipeline, which should run the full test suite.',
    'This topic deliberately stops short of writing any Dockerfile content - that is the very next topic, keeping the two concerns cleanly separated.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Skipping the "run the JAR directly with java -jar first" verification step and jumping straight to writing a Dockerfile means any failure inside the resulting container could be caused by either a broken JAR or a broken Dockerfile - with no way to tell which without backtracking. Verifying the JAR runs standalone first eliminates one of those two possibilities up front.' },
    { type: 'interview', content: 'Q: Before writing a Dockerfile for a Spring Boot application, why is it worth running the built JAR directly with java -jar on the host machine first?\nA: It confirms the JAR itself is correctly built and runnable, independent of any Docker packaging - Docker only changes where a JAR runs, not whether that JAR is correct in the first place. If a container later fails to run the application properly, having already confirmed the JAR works standalone rules out the JAR itself as the cause, narrowing the problem down to the Dockerfile or container configuration.' },
  ],
}
