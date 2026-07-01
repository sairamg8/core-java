export default {
  id: 'from-spring-to-spring-boot',
  title: '343. From Spring to Spring Boot',
  explanation: `Plain Spring is powerful but demands a lot of **manual setup**: XML or \`@Configuration\` classes, explicit dependency versions, a servlet container to deploy to, and hand-written boilerplate for common infrastructure. **Spring Boot** is a layer on top of Spring that removes that friction — same core container, far less ceremony.

**What Spring Boot adds:**
- **Auto-configuration** — Boot inspects the classpath and configures sensible beans automatically. See a JDBC driver? It configures a \`DataSource\`. See Spring MVC? It sets up the dispatcher and view resolver. You override only what you need.
- **Starter dependencies** — curated dependency bundles like \`spring-boot-starter-web\` or \`spring-boot-starter-data-jpa\` pull in a compatible set of libraries so you stop hand-picking versions.
- **Embedded server** — an embedded Tomcat (or Jetty/Undertow) is built in, so the app runs as a plain \`java -jar app.jar\`. No external server to install and deploy a WAR to.
- **\`@SpringBootApplication\`** — one annotation that combines \`@Configuration\`, \`@EnableAutoConfiguration\`, and \`@ComponentScan\`.
- **Sensible defaults + easy overrides** — everything is preconfigured but a single line in \`application.properties\` changes it.
- **Production features** — Actuator health checks, metrics, and externalised configuration out of the box.

**What stays the same:** IoC/DI, beans, \`@Component\`/\`@Service\`/\`@Repository\`, \`@Autowired\`, scopes — Boot **is** Spring underneath. Nothing you learned about the container is thrown away; Boot just wires it for you.

**The mindset shift:** in plain Spring you **declare** infrastructure; in Boot you **rely on convention** and only declare the exceptions. See [[using-annotations-in-spring-boot]] for the annotation set and [[spring-vs-spring-boot]] for the point-by-point comparison.`,
  code: `// Plain Spring: you build and start the context yourself
@Configuration
@ComponentScan("com.example")
public class AppConfig { }

public class Main {
    public static void main(String[] args) {
        ApplicationContext ctx =
            new AnnotationConfigApplicationContext(AppConfig.class);
        // ...deploy a WAR to an external Tomcat for a web app
    }
}

// Spring Boot: one annotation + one line, embedded server included
@SpringBootApplication              // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);   // starts embedded Tomcat
    }
}`,
  codeTitle: 'Plain Spring bootstrap vs Spring Boot',
  points: [
    'Spring Boot is a convention-over-configuration layer on top of the same Spring container',
    'Auto-configuration creates sensible beans based on what it finds on the classpath',
    'Starter dependencies bundle compatible libraries so you stop managing versions by hand',
    'An embedded server lets a Boot app run as a self-contained java -jar with no external container',
    '@SpringBootApplication bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What does Spring Boot add over plain Spring?\nA: Spring Boot keeps the same IoC container but removes boilerplate through auto-configuration (beans configured based on the classpath), starter dependencies (curated, version-aligned library bundles), an embedded server so the app runs as an executable jar, and the @SpringBootApplication meta-annotation. You still use beans, DI, and stereotypes — Boot just applies sensible defaults you override only when needed.',
    },
    {
      type: 'tip',
      content: 'Moving from Spring to Boot is not relearning the framework — the container, DI, and annotations are identical. What changes is that you stop declaring infrastructure explicitly and instead lean on convention, declaring only the exceptions in application.properties or a config class.',
    },
  ],
}
