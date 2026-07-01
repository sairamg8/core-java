export default {
  id: 'spring-vs-spring-boot',
  title: '317. Spring vs Spring Boot',
  explanation: `Beginners often ask "should I learn Spring or Spring Boot?" The answer: they are not alternatives. **Spring Boot is built on top of the Spring Framework** to make it dramatically easier to use.

**Spring Framework** gives you the IoC container and all the modules (Core, AOP, MVC, JDBC, ORM, etc.). It is powerful but historically required a lot of **manual configuration** — XML files or Java config classes, choosing and aligning library versions yourself, and setting up an external server (like Tomcat) to deploy a WAR.

**Spring Boot** keeps all of that power and removes the tedium:
- **Auto-configuration** — Boot inspects what is on the classpath and configures sensible defaults automatically (see a database driver? configure a DataSource).
- **Starter dependencies** — one dependency like \`spring-boot-starter-web\` pulls in a curated, version-aligned set of libraries. No more dependency-version guesswork.
- **Embedded server** — Tomcat (or Jetty/Undertow) is bundled, so your app runs as a plain \`java -jar\` — no external server needed.
- **Opinionated defaults** — good defaults you can override, so you start fast.
- **Production-ready features** — Actuator adds health checks, metrics, and monitoring endpoints.
- **No XML required** — configuration is annotation- and property-file based.

**Comparison at a glance:**
| Aspect | Spring Framework | Spring Boot |
|---|---|---|
| Configuration | Manual (XML/Java config) | Auto-configured |
| Dependencies | You align versions | Starters align them |
| Server | External (deploy WAR) | Embedded (run JAR) |
| Setup time | Slower | Minutes |
| Under the hood | The framework itself | Uses the framework |

**Bottom line:** learn the Spring *concepts* (IoC, DI, beans) because Boot uses them — but build real apps with Spring **Boot**, because it removes the boilerplate. See [[first-spring-boot-app]].`,
  code: `// Spring Boot's single entry point replaces pages of XML setup:
@SpringBootApplication            // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);   // starts container + embedded server
    }
}

// The classic Spring Framework way needed something like:
//   - an applicationContext.xml (or a @Configuration class)
//   - manual bean and DataSource declarations
//   - an external Tomcat to deploy the built WAR
// Boot's auto-configuration + starters + embedded server collapse all of that.`,
  codeTitle: 'Spring Boot removes the manual setup',
  points: [
    'Spring Boot is NOT a replacement for Spring — it is built on top of the Spring Framework',
    'Auto-configuration sets sensible defaults based on what is on the classpath',
    'Starter dependencies bundle curated, version-aligned libraries (e.g. spring-boot-starter-web)',
    'An embedded server (Tomcat) lets you run the app as a plain executable JAR — no external server',
    'Learn Spring concepts (IoC/DI/beans); build apps with Boot to skip the boilerplate',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What does Spring Boot add over the plain Spring Framework?\nA: Auto-configuration (sensible defaults based on the classpath), starter dependencies (curated, version-aligned libraries), an embedded server so the app runs as an executable JAR, opinionated defaults, and production features via Actuator. It does not replace Spring — it configures the same Spring Framework for you so you write far less boilerplate.',
    },
    {
      type: 'note',
      content: '@SpringBootApplication is a convenience annotation that combines @Configuration, @EnableAutoConfiguration, and @ComponentScan. That one annotation is what triggers auto-configuration and component scanning of your package.',
    },
  ],
}
