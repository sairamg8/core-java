export default {
  id: 'spring-prerequisites',
  title: '314. Prerequisites',
  explanation: `Before starting Spring, you need a solid grip on a few foundations. Spring builds directly on these, and gaps here cause most beginner confusion.

**Core Java (essential):**
- **Classes, objects, interfaces, and inheritance** — Spring beans are just Java objects, and injecting by interface is central to how Spring works. See [[creating-interface]].
- **Annotations** — Spring is annotation-driven (\`@Component\`, \`@Autowired\`, \`@Bean\`). You should understand what an annotation is and that it is metadata read at compile time or runtime.
- **Collections, generics, and exceptions** — used everywhere in Spring APIs.
- **Interfaces vs implementations** — you will constantly code against an interface while Spring injects a concrete implementation.

**Build tools — Maven (or Gradle):**
Spring projects pull in many libraries. A build tool manages those **dependencies** and packages your app. You should know what a \`pom.xml\` is, what a dependency coordinate (groupId/artifactId/version) means, and how to run \`mvn\` commands.

**Basic understanding helps:**
- **The database / SQL** (for the JDBC and JPA parts later).
- **HTTP basics** (for the web/REST parts later) — requests, responses, status codes, GET/POST.
- **How a JVM app runs** — a \`main\` method is still the entry point, even in Spring Boot.

**Tooling:**
- A **JDK** installed (Java 17+ is the safe baseline for modern Spring Boot 3).
- An **IDE** (IntelliJ IDEA or Eclipse/STS). See [[ide-for-spring]].

You do **not** need to know Hibernate, servlets, or web frameworks in advance — Spring will teach those in context. The non-negotiables are core Java OOP, annotations, and comfort with a build tool.`,
  code: `// The two OOP habits Spring relies on the most:

// 1) Program to an interface, not an implementation
interface PaymentGateway { void charge(double amount); }
class StripeGateway implements PaymentGateway {
    public void charge(double amount) { /* ... */ }
}

// 2) Understand annotations as metadata (Spring reads these at runtime)
// @Component  -> "container, please manage an instance of this class"
// @Autowired  -> "container, please inject the dependency here"
//
// If interfaces + annotations feel natural, you are ready for Spring.`,
  codeTitle: 'The prerequisites Spring leans on most',
  points: [
    'Solid core Java OOP: classes, objects, interfaces, inheritance, and coding against interfaces',
    'Understanding annotations as metadata is essential — Spring is annotation-driven',
    'Comfort with a build tool (Maven or Gradle) for managing dependencies and packaging',
    'A JDK (Java 17+ for modern Spring Boot 3) and an IDE (IntelliJ or Eclipse/STS) installed',
    'Basic SQL and HTTP knowledge help later, but Hibernate/servlets are taught in context',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The single most useful habit before Spring is "program to an interface." Spring injects dependencies by type, and injecting an interface lets you swap implementations (real vs mock, one vendor vs another) without changing the code that uses it. If that idea is shaky, review interfaces first.',
    },
  ],
}
