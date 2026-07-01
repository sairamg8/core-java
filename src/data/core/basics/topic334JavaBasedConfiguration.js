export default {
  id: 'java-based-configuration',
  title: '334. Java-Based Configuration',
  explanation: `**Java-based configuration** replaces the XML \`applicationContext.xml\` with a plain Java class. Instead of \`<bean>\` elements you write \`@Bean\` methods inside an \`@Configuration\` class — everything is type-checked by the compiler and refactor-friendly.

**The two annotations:**
- **\`@Configuration\`** — marks a class as a source of bean definitions.
- **\`@Bean\`** — put on a method; the object the method **returns** becomes a bean in the container. The **method name** is the bean id by default.

**Bootstrapping:** load it with \`AnnotationConfigApplicationContext\` instead of \`ClassPathXmlApplicationContext\`:
\`\`\`java
ApplicationContext ctx =
    new AnnotationConfigApplicationContext(AppConfig.class);
\`\`\`

**Wiring dependencies:** call one \`@Bean\` method from another, or take the dependency as a method parameter — Spring injects the matching bean:
\`\`\`java
@Bean
public StudentService studentService() {
    return new StudentService(studentRepository());  // wired by method call
}
\`\`\`
Even though \`studentRepository()\` looks like a normal call, Spring intercepts it (the \`@Configuration\` class is proxied) so you get the **same singleton**, not a new object each time.

**XML vs Java config:**
- XML: external, no recompile to change wiring, but no compile-time safety.
- Java: type-safe, IDE navigation and refactoring, real code (loops, conditionals) to build beans; the modern default and the foundation Spring Boot builds on (see [[using-annotations-in-spring-boot]]).

Java config and component scanning (\`@Component\` + \`@ComponentScan\`) are complementary: \`@Bean\` methods are ideal for third-party classes you cannot annotate, while \`@Component\` suits your own classes.`,
  code: `@Configuration
public class AppConfig {

    @Bean
    public StudentRepository studentRepository() {
        return new StudentRepository();
    }

    @Bean
    public StudentService studentService() {
        // Calling studentRepository() returns the SAME singleton,
        // because @Configuration classes are proxied by Spring.
        return new StudentService(studentRepository());
    }
}

public class App {
    public static void main(String[] args) {
        ApplicationContext ctx =
            new AnnotationConfigApplicationContext(AppConfig.class);
        StudentService s = ctx.getBean(StudentService.class);
        s.printAll();
    }
}`,
  codeTitle: '@Configuration class with @Bean methods',
  points: [
    '@Configuration marks a class that supplies bean definitions in pure Java',
    '@Bean on a method registers the returned object as a bean; the method name is the bean id',
    'Load it with AnnotationConfigApplicationContext instead of ClassPathXmlApplicationContext',
    'Wire dependencies by calling other @Bean methods or by declaring them as method parameters',
    'Calls between @Bean methods return the same singleton because the config class is proxied',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How does Java-based configuration work and why prefer it over XML?\nA: You annotate a class with @Configuration and define @Bean methods whose return values become container beans, then bootstrap with AnnotationConfigApplicationContext. It is preferred because it is type-safe, refactorable, navigable in the IDE, and lets you build beans with real code. Spring proxies the @Configuration class so that calls between @Bean methods still yield singletons rather than new instances.',
    },
    {
      type: 'tip',
      content: 'Use @Bean methods for classes you cannot annotate (third-party libraries) and @Component with component scanning for your own classes — the two styles mix freely in the same application.',
    },
  ],
}
