export default {
  id: 'spring-boot',
  title: '1. Spring Boot — Auto-Configuration & Starters',
  explanation: `**Spring Boot** removes the XML configuration and boilerplate of classic Spring. You get a runnable application with a single annotation and an embedded server (Tomcat by default).

**Three core ideas:**
1. **Auto-configuration** — Spring Boot detects what's on the classpath and configures it automatically (found Jackson? Configure ObjectMapper. Found HikariCP + JPA? Configure DataSource and EntityManagerFactory.)
2. **Starters** — curated dependency bundles (spring-boot-starter-web pulls in Tomcat, Spring MVC, Jackson)
3. **Convention over configuration** — sane defaults everywhere; you only configure what you need to change`,
  code: `// ── Minimal Spring Boot application ──────────────────────────────────────
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
        // Starts embedded Tomcat on port 8080
        // Scans components in com.example and sub-packages
    }
}

// ── application.properties / application.yaml ─────────────────────────────
/*
# application.properties
server.port=8080
server.servlet.context-path=/api

# DataSource — auto-configures HikariCP + JPA
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update      # create/update/validate/none
spring.jpa.show-sql=true                  # log all SQL

# App custom properties
app.email.from=no-reply@example.com
app.max-upload-size=10MB

# Logging
logging.level.root=INFO
logging.level.com.mycompany=DEBUG
*/

// ── Profiles — different config per environment ───────────────────────────
// application-dev.properties    (used when: --spring.profiles.active=dev)
// application-prod.properties   (used when: --spring.profiles.active=prod)
// application-test.properties   (used in tests: @ActiveProfiles("test"))

import org.springframework.context.annotation.*;

@Configuration
@Profile("dev")  // only active in dev profile
class DevConfig {
    @Bean public DataSource embeddedH2() { return null; /* H2 in-memory */ }
}

// ── @ConfigurationProperties — type-safe config binding ──────────────────
import org.springframework.boot.context.properties.*;

@ConfigurationProperties(prefix = "app.email")
@Component
class EmailProperties {
    private String from;            // app.email.from
    private int maxRetries = 3;     // app.email.max-retries
    // getters/setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public int getMaxRetries() { return maxRetries; }
    public void setMaxRetries(int n) { this.maxRetries = n; }
}

// ── Spring Boot Actuator — production monitoring ──────────────────────────
// Add: spring-boot-starter-actuator
// Exposes HTTP endpoints:
//   GET /actuator/health   → {"status":"UP"} (for load balancers)
//   GET /actuator/info     → app version, git commit
//   GET /actuator/metrics  → JVM memory, HTTP latency, DB pool
//   GET /actuator/env      → all config properties

// application.properties:
// management.endpoints.web.exposure.include=health,info,metrics
// management.endpoint.health.show-details=when-authorized

// ── Common starters ───────────────────────────────────────────────────────
/*
spring-boot-starter-web         → Tomcat + Spring MVC + Jackson
spring-boot-starter-data-jpa    → Hibernate + Spring Data JPA + HikariCP
spring-boot-starter-security    → Spring Security
spring-boot-starter-test        → JUnit 5 + Mockito + AssertJ + MockMvc
spring-boot-starter-validation  → Hibernate Validator (Bean Validation)
spring-boot-starter-mail        → JavaMail (email sending)
spring-boot-starter-cache       → Spring Cache abstraction
spring-boot-starter-actuator    → Production monitoring endpoints
*/

interface DataSource {}`,
  points: [
    '@SpringBootApplication(scanBasePackages = "com.other") if your components are in a different package than the main class',
    'spring.jpa.hibernate.ddl-auto=update in production is dangerous — it can alter your schema. Use validate in prod and manage schema with Flyway/Liquibase.',
    '@ConfigurationProperties is type-safe and IDE-friendly — prefer it over @Value for groups of related properties',
    'The fat JAR (executable JAR) created by mvn package contains all dependencies and the embedded server — deploy with java -jar app.jar',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How does Spring Boot auto-configuration work?\nA: Spring Boot includes META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports in each starter JAR. This lists @Configuration classes annotated with @ConditionalOnClass, @ConditionalOnMissingBean etc. For example, DataSourceAutoConfiguration activates only when HikariCP is on the classpath AND no DataSource bean is already defined — allowing you to override any default.',
    },
    {
      type: 'gotcha',
      content: 'spring.jpa.open-in-view=true (default) keeps the EntityManager open for the entire HTTP request, enabling lazy loading in the view layer. This causes extra DB queries and performance issues. Set spring.jpa.open-in-view=false and handle lazy loading in the service layer instead.',
    },
  ],
}
