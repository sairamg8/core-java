export default {
  id: 'introduction-to-spring',
  title: '312. Introduction to Spring',
  explanation: `**Spring** is the most widely used **application framework** for building Java applications — from small console tools to large enterprise systems and microservices. It was created by Rod Johnson in 2003 as a lighter, simpler alternative to the heavyweight J2EE/EJB model of that era.

**What problem does Spring solve?**
In plain Java, your objects create and wire up their own dependencies with the \`new\` keyword. This makes classes tightly coupled, hard to test, and hard to change. Spring flips this around: instead of your code creating objects, a central **container** creates them, configures them, and hands them to you already wired together. This idea is called **Inversion of Control (IoC)**, and the mechanism is **Dependency Injection (DI)**. See [[ioc-and-di]].

**Spring is modular.** You use only the parts you need:
- **Spring Core / Beans / Context** — the IoC container and dependency injection.
- **Spring AOP** — cross-cutting concerns (logging, security, transactions) without cluttering business code.
- **Spring JDBC / ORM** — cleaner database access on top of JDBC and Hibernate/JPA.
- **Spring MVC** — build web applications and REST APIs.
- **Spring Data, Spring Security, Spring Boot** — data repositories, authentication, and auto-configuration.

**The big picture:**
- **Spring Framework** is the foundation — the IoC container plus all the modules above.
- **Spring Boot** sits on top and removes the tedious setup (no XML, embedded server, sensible defaults) so you can start a project in minutes. See [[spring-vs-spring-boot]].

**Why it dominates:** loose coupling, testability, a huge ecosystem, and strong community/enterprise support. Almost every Java backend job expects Spring knowledge.`,
  code: `// Plain Java — tight coupling: the class creates its own dependency
class OrderService {
    private EmailSender sender = new EmailSender();   // hard-wired, hard to test
    void placeOrder() { sender.send("Order placed"); }
}

// Spring style — the dependency is injected; OrderService no longer builds it
class OrderService {
    private final EmailSender sender;
    OrderService(EmailSender sender) {   // Spring provides the EmailSender
        this.sender = sender;
    }
    void placeOrder() { sender.send("Order placed"); }
}
// Spring's container decides which EmailSender to inject, so you can swap
// a real sender for a mock in tests without touching OrderService.`,
  codeTitle: 'From tight coupling to Spring-style injection',
  points: [
    'Spring is a modular Java application framework built around Inversion of Control (IoC) and Dependency Injection (DI)',
    'Instead of objects creating their own dependencies with new, a central container creates and wires them for you',
    'Core modules: Core/Beans/Context (IoC), AOP, JDBC/ORM, MVC, plus Spring Data, Security, and Boot',
    'Spring Framework is the foundation; Spring Boot layers auto-configuration and embedded servers on top',
    'Benefits: loose coupling, easy testing (mock injection), a rich ecosystem, and strong enterprise adoption',
  ],
  callouts: [
    {
      type: 'note',
      content: 'Spring and Spring Boot are not competitors. Spring Boot IS Spring — it is a convenience layer that configures the Spring Framework for you with sensible defaults, an embedded server, and starter dependencies so you write far less boilerplate.',
    },
    {
      type: 'interview',
      content: 'Q: In one sentence, what does the Spring Framework do?\nA: It provides an IoC container that creates, configures, and wires your application objects (beans) for you, so your classes depend on abstractions rather than constructing their own dependencies, which makes the code loosely coupled and easy to test.',
    },
  ],
}
