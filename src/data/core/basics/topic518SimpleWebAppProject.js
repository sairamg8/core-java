export default {
  id: 'simple-web-app-project',
  title: '518. Simple Web App Project',
  explanation: `With IAM and the core services named (see [[aws-services-and-iam]]), this topic gets hands-on with the simplest possible deployment target — a minimal Spring Boot app with no database at all — deliberately kept simple so the *deployment mechanics* (the actual subject of the next topic) aren't tangled up with database configuration yet.

**The minimal app — a single endpoint, no persistence:**
\`\`\`java
@SpringBootApplication
@RestController
public class SimpleWebAppApplication {

    @GetMapping("/")
    public String hello() {
        return "Hello from AWS!";
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleWebAppApplication.class, args);
    }
}
\`\`\`

**Why this deliberately mirrors the very first Spring Boot app most learners ever write.** It's intentional — this topic's entire purpose is isolating *one* new variable (deploying to AWS) by keeping every other variable (the application itself) as simple as it possibly can be. Debugging a deployment failure is far easier when the app being deployed is trivially known to be correct.

**Packaging it exactly as the Docker chapter already established (see [[packing-the-spring-boot-web-app]]):**
\`\`\`bash
./mvnw clean package -DskipTests
java -jar target/simple-web-app-0.0.1-SNAPSHOT.jar
\`\`\`
Confirmed working locally first, for exactly the same reason established back in the Docker chapter: isolating "is the app itself correct" from "is the deployment configuration correct" as two separately debuggable questions.

**What's being deliberately deferred to later topics, and why that's the right call here.** No database connection, no security configuration beyond Spring Boot's defaults, no environment-specific configuration — all of that gets added incrementally in later topics (see [[spring-project-with-database]], [[creating-database-in-aws-rds]]), once the basic "can I deploy anything to AWS at all" question is answered first with this minimal app.`,
  code: `@SpringBootApplication
@RestController
public class SimpleWebAppApplication {

    @GetMapping("/")
    public String hello() {
        return "Hello from AWS!";
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleWebAppApplication.class, args);
    }
}

// Build and verify locally, before touching AWS at all
// ./mvnw clean package -DskipTests
// java -jar target/simple-web-app-0.0.1-SNAPSHOT.jar`,
  codeTitle: 'A deliberately minimal Spring Boot app - the deployment target for the next topic',
  points: [
    'This minimal app has no database and no configuration beyond Spring Boot defaults - deliberately isolating "deploying to AWS" as the one new variable being learned.',
    'Confirming the app runs correctly locally first, before any AWS involvement, mirrors the exact same principle established in the Docker chapter.',
    'Debugging a deployment failure is far easier when the application itself is trivially known to be correct beforehand.',
    'Database connectivity and other real-world configuration are deliberately deferred to later topics, added incrementally once basic deployment to AWS is confirmed working.',
    'This mirrors the general pattern used throughout this course: get the simplest possible version working end to end first, then add complexity one piece at a time.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Attempting a first-ever AWS deployment with the full Job app - database, security, JWT, all of it - at once makes any failure ambiguous between dozens of possible causes; deploying a trivial one-endpoint app first isolates the deployment mechanics themselves as a separately verifiable step.' },
    { type: 'interview', content: 'Q: Why start AWS deployment with a minimal single-endpoint app rather than the full Job app built throughout this course?\nA: It isolates one variable at a time - confirming the deployment mechanics themselves work correctly, independent of database configuration, security setup, or any other application-specific complexity. If a trivial app fails to deploy, the cause is almost certainly in the deployment configuration itself; if the full Job app failed to deploy, the cause could be anywhere across dozens of moving parts.' },
  ],
}
