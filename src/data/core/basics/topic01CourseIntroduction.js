export default {
  id: 'course-introduction',
  title: '1. Course Introduction',
  explanation: `Welcome to the **Complete Java Developer Course** — one of the most comprehensive Java learning paths available, taking you from absolute beginner to enterprise-level development.

**What this course covers:**
- Core Java: variables, types, OOP, exceptions, collections, generics, streams, lambdas
- Advanced Java: multithreading, JVM internals, file I/O, serialization
- Build tools: Maven
- Databases: SQL/MySQL, JDBC, Hibernate/JPA
- Web & Framework: Servlet/JSP, Spring Boot, Spring MVC, REST APIs
- Security: Spring Security, JWT, OAuth2
- DevOps: Docker, AWS (EC2, RDS, ECS, Elastic Beanstalk)
- Modern AI: Spring AI with OpenAI and Ollama
- Microservices: Service discovery, Feign, API Gateway

**Why Java in 2024+?**
Java has been a top-2 language for 25+ years. It powers Android, Netflix, Amazon, LinkedIn, and most enterprise banking systems. Java 21 (LTS) brings modern features like records, sealed classes, pattern matching, and virtual threads — making Java more expressive and performant than ever.

The **WORA principle** (Write Once, Run Anywhere) means Java compiles to platform-neutral bytecode. A JAR built on macOS runs identically on Windows, Linux, or a cloud container.`,
  points: [
    'Java was created by James Gosling at Sun Microsystems in 1995 and is now maintained by Oracle. Java 17 and Java 21 are current LTS releases used in production.',
    'Java is statically typed: every variable must declare its type at compile time. This catches entire classes of bugs before the program runs.',
    'The JVM (Java Virtual Machine) is what makes WORA possible — it translates bytecode into native machine instructions at runtime on any platform.',
    'The Java ecosystem has 500,000+ libraries on Maven Central. Whatever you need to build, a vetted library almost certainly exists.',
    'Kotlin, Scala, and Groovy all run on the JVM and interoperate with Java — mastering Java gives you a foundation for all of them.',
  ],
  callouts: [
    {
      type: 'note',
      content: 'Recommended approach: Watch the video → read this section → type out code examples yourself (never copy-paste) → experiment with variations. Active coding beats passive watching by a factor of 10 for retention.',
    },
    {
      type: 'interview',
      content: 'Q: Why is Java still relevant when Kotlin, Go, and Rust exist?\nA: Java has the largest enterprise codebase on earth. Banks and governments run billions of lines of Java. Kotlin compiles to JVM bytecode and interoperates fully with Java — it makes Java better, not obsolete. Go and Rust target systems programming; Java dominates enterprise services.',
    },
  ],
}
