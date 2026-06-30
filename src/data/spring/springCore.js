export default {
  id: 'spring-core',
  title: '1. Spring Core — IoC & Dependency Injection',
  explanation: `**Spring** is built around one idea: **Inversion of Control (IoC)** — instead of your code creating its own dependencies, Spring creates and injects them.

The **IoC Container** (ApplicationContext) manages the lifecycle of all Spring-managed objects called **Beans**.

**Dependency Injection (DI)** is how the container wires beans together. The three forms:
- **Constructor injection** — preferred (dependencies explicit, immutable, testable)
- **Setter injection** — optional dependencies
- **Field injection** (@Autowired on field) — avoid in production code (hard to test)`,
  table: {
    headers: ['Annotation', 'Layer', 'Purpose'],
    rows: [
      ['@Component', 'Any', 'Generic Spring-managed bean'],
      ['@Service', 'Business logic', '@Component + semantic meaning'],
      ['@Repository', 'Data access', '@Component + exception translation'],
      ['@Controller', 'Web layer', '@Component + request handling'],
      ['@RestController', 'Web/REST', '@Controller + @ResponseBody on all methods'],
      ['@Configuration', 'Config', 'Class whose @Bean methods define beans'],
      ['@Bean', 'Method', 'Declares a bean (in @Configuration classes)'],
    ],
  },
  code: `import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;

// ── Component scanning — Spring auto-discovers @Component classes ──────────
@Service
public class EmailService {
    public void send(String to, String subject) {
        System.out.println("Sending email to " + to);
    }
}

@Repository
public class UserRepository {
    public User findById(Long id) { return new User(id, "Alice"); }
    record User(Long id, String name) {}
}

// ── Constructor injection (preferred) ─────────────────────────────────────
@Service
public class UserService {
    private final UserRepository repo;
    private final EmailService emailService;

    // @Autowired is optional when there's only one constructor (Spring 4.3+)
    public UserService(UserRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public void registerUser(Long id) {
        var user = repo.findById(id);
        emailService.send(user.name() + "@example.com", "Welcome!");
    }
}

// ── @Configuration — define beans explicitly ──────────────────────────────
@Configuration
public class AppConfig {
    @Bean
    public java.time.Clock clock() {
        return java.time.Clock.systemUTC();  // testable — can swap in tests
    }

    @Bean
    @Primary  // used when multiple beans of the same type exist
    public EmailService productionEmailService() {
        return new EmailService();
    }

    @Bean
    @Qualifier("mock")
    public EmailService mockEmailService() {
        return new EmailService() {
            @Override public void send(String to, String subject) {}
        };
    }
}

// ── @Qualifier — pick between multiple beans of same type ─────────────────
@Service
public class NotificationService {
    private final EmailService emailService;

    public NotificationService(@Qualifier("mock") EmailService emailService) {
        this.emailService = emailService;
    }
}

// ── @Value — inject properties ────────────────────────────────────────────
@Service
public class PaymentService {
    @Value("\${payment.api.url}")
    private String apiUrl;

    @Value("\${payment.timeout:30}")   // default 30 if not set
    private int timeout;
}

// ── Bean Scope ────────────────────────────────────────────────────────────
@Component
@Scope("singleton")   // DEFAULT — one instance per container
class SingletonBean {}

@Component
@Scope("prototype")   // new instance on every injection/getBean()
class PrototypeBean {}

// Request/Session scope — only in web context
// @Scope("request")  — one per HTTP request
// @Scope("session")  — one per HTTP session`,
  points: [
    'Prefer constructor injection over field injection — it makes dependencies explicit, allows immutability (final fields), and makes the class testable without a Spring context',
    '@Autowired on a constructor is optional since Spring 4.3 when there is only one constructor — Spring injects automatically',
    '@Primary marks the default bean when multiple candidates exist; @Qualifier specifies by name when you need a specific one',
    'Spring component scan searches the package of the main class and all sub-packages — keep your main class at the root package',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between @Component, @Service, and @Repository?\nA: All three are @Component specializations — they register a bean in the Spring container. @Service and @Repository add semantic meaning (your code communicates intent). @Repository additionally enables Spring\'s persistence exception translation — DataAccessException wraps vendor-specific SQL exceptions into a consistent hierarchy.',
    },
    {
      type: 'gotcha',
      content: 'Circular dependencies with constructor injection fail at startup with BeanCurrentlyInCreationException. This is Spring telling you the design is wrong — two classes should not depend on each other. Refactor to remove the cycle (extract a shared dependency, use events, etc.). Field injection hides circular dependencies but they still exist.',
    },
  ],
}
