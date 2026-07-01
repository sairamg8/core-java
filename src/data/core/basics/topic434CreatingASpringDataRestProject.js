export default {
  id: 'creating-a-spring-data-rest-project',
  title: '434. Creating a Spring Data REST Project',
  explanation: `Turning the existing Job app's repositories (see [[jpa-in-job-app]]) into a Spring Data REST API takes one dependency and zero new classes — this is where that setup happens, on top of the entity and repository already built earlier in this chapter.

**Step 1 — add the starter.** In \`pom.xml\`:
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
\`\`\`
This pulls in Spring Data REST on top of the \`spring-boot-starter-data-jpa\` dependency already present from earlier chapters — it does not replace Spring Data JPA, it builds on it.

**Step 2 — the entity is unchanged.** \`Job\` still needs \`@Entity\`, an \`@Id\` field, and the usual JPA annotations (see [[spring-data-jpa-introduction]]) — nothing extra is required here.

**Step 3 — the repository is unchanged, and that is the point.**
\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
}
\`\`\`
This is the exact same interface already written for the manual \`JobRestController\` (see [[creating-a-rest-controller]]). Spring Data REST does not need a separate repository — it scans the application context for every \`JpaRepository\` (and \`CrudRepository\`/\`PagingAndSortingRepository\`) bean on startup and exposes each one as a REST resource collection, deriving the URL path from the entity name (\`Job\` → \`/jobs\`) unless told otherwise.

**Step 4 — remove or keep the hand-written controller.** \`JobRestController\` from earlier in this chapter still works and still responds on the same paths — Spring Data REST endpoints and hand-written \`@RestController\` endpoints can coexist in the same application, mapped to the same repository, as long as their URL paths do not collide. For a project that wants to fully hand CRUD off to Spring Data REST, the manual controller can be deleted entirely; for a project that wants to keep some hand-written endpoints (custom search logic, for example) alongside auto-generated CRUD, both can stay side by side on different paths.`,
  code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>

// Job.java - unchanged
@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;
    // getters and setters
}

// JobRepository.java - unchanged, no new methods needed
public interface JobRepository extends JpaRepository<Job, Integer> {
}`,
  codeTitle: 'Adding Spring Data REST to the existing Job app',
  points: [
    'spring-boot-starter-data-rest is added on top of the existing spring-boot-starter-data-jpa dependency, not instead of it.',
    'The @Entity class and the JpaRepository interface need no changes - the exact same repository already written for the manual controller is reused.',
    'Spring Data REST scans the application context on startup for JpaRepository beans and exposes each one automatically, deriving the URL path from the entity name.',
    'A hand-written @RestController and Spring Data REST-generated endpoints can coexist in the same app as long as their paths do not collide.',
    'No new Java classes are required to get a working CRUD API - the dependency addition alone is the entire change.',
  ],
  callouts: [
    { type: 'gotcha', content: 'If a manual controller and Spring Data REST both try to serve the same path (for example both mapping /jobs), Spring will fail to start with an ambiguous mapping error - decide up front which one owns which paths, or remove the manual controller for entities fully handed to Spring Data REST.' },
    { type: 'interview', content: 'Q: What has to change in the entity or repository classes to enable Spring Data REST?\nA: Nothing. Spring Data REST only requires adding the spring-boot-starter-data-rest dependency; it then scans the application context for existing JpaRepository beans on startup and exposes each one as a REST resource automatically, using the same entity and repository classes already written.' },
  ],
}
