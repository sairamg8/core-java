export default {
  id: 'logging',
  title: '1. Logging — SLF4J, Log4j2 & Logback',
  explanation: `**Never use System.out.println() in production code.** A proper logging framework provides:
- Log **levels** so you can control verbosity in production
- Log **formatting** (timestamps, thread names, class names)
- **Appenders** to send logs to files, databases, or log aggregators
- **Async logging** so logging doesn't block the application thread

**The logging stack:**
- **SLF4J** — a logging facade/API (\`org.slf4j.Logger\`). Your code imports only SLF4J — not the underlying implementation.
- **Logback** — the default SLF4J implementation in Spring Boot (used automatically)
- **Log4j2** — Apache's implementation; faster async logging than Logback

**Log levels (lowest → highest severity):**
TRACE < DEBUG < INFO < WARN < ERROR

Setting the level to INFO means TRACE and DEBUG messages are suppressed.`,
  code: `// Using SLF4J in your code (implementation-agnostic)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderService {
    // One logger per class — use the class itself as the name
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    public Order processOrder(Long orderId, String userId) {
        log.debug("processOrder called: orderId={}, userId={}", orderId, userId);

        try {
            Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

            log.info("Processing order {} for user {}", orderId, userId);
            // ... business logic ...
            log.info("Order {} processed successfully", orderId);
            return order;

        } catch (OrderNotFoundException e) {
            log.warn("Order not found: {}", orderId);
            throw e;
        } catch (Exception e) {
            // Always log the exception object as the last argument — prints stack trace
            log.error("Unexpected error processing order {}", orderId, e);
            throw new RuntimeException("Order processing failed", e);
        }
    }
}

// --- Logback configuration (src/main/resources/logback-spring.xml) ---
/*
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/app.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{ISO8601} [%thread] %-5level %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="FILE" />
    </root>

    <logger name="com.example.service" level="DEBUG" />
</configuration>
*/`,
  points: [
    'Use parameterized logging: log.info("User {} logged in", userId) — NOT string concatenation. The string is only built if that level is enabled.',
    'Log levels: TRACE/DEBUG for development detail, INFO for business events, WARN for recoverable problems, ERROR for failures',
    'Always pass the exception as the LAST argument to log.error() — SLF4J prints the full stack trace automatically',
    'Spring Boot auto-configures Logback; set log levels in application.properties: logging.level.com.example=DEBUG',
    'In production, ship logs to a centralized system (ELK stack, Splunk, Datadog) — do not rely on reading files on servers',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why use SLF4J instead of Log4j2 or Logback directly?\nA: SLF4J is a facade — your application code depends on the API only. The actual logging implementation (Logback, Log4j2) is a runtime dependency that can be swapped without changing a single line of application code. This is especially important in library development: you log against SLF4J and let the application developer choose the implementation.',
    },
    {
      type: 'gotcha',
      content: 'log.info("User " + user.getName() + " logged in") always builds the string, even if INFO level is disabled. log.info("User {} logged in", user.getName()) only formats when INFO is enabled. On high-throughput paths with DEBUG logging, the string concatenation approach can add measurable overhead.',
    },
  ],
}
