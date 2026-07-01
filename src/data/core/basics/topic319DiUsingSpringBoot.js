export default {
  id: 'di-using-spring-boot',
  title: '319. DI Using Spring Boot',
  explanation: `Now let us do **Dependency Injection** the Spring Boot way — with annotations and component scanning, no XML at all.

**Two ingredients:**
1. **Mark classes as beans** so the container manages them. The generic stereotype is \`@Component\`; more specific variants are \`@Service\` (business logic), \`@Repository\` (data access), and \`@Controller\`/\`@RestController\` (web). They all register the class as a bean.
2. **Ask for a dependency** where you need it. Spring finds a matching bean and injects it.

**How Boot discovers beans:** \`@SpringBootApplication\` includes \`@ComponentScan\`, which scans the main class's package and sub-packages for stereotype-annotated classes and registers each as a bean.

**Injecting a dependency:** declare it as a constructor parameter. Spring sees \`OrderService\` needs a \`PaymentGateway\`, finds the bean that implements it, and passes it in. As of modern Spring, \`@Autowired\` on a single constructor is **optional** — Spring injects automatically. See [[autowiring-in-spring-boot]].

**The typical layered flow:** a \`@RestController\` depends on a \`@Service\`, which depends on a \`@Repository\`. Each layer just declares what it needs in its constructor; Spring wires the whole chain.

**Why constructor injection is preferred:** dependencies can be \`final\` (immutable), the object is always fully initialised, and it is trivial to unit-test by passing mocks directly to the constructor — no Spring needed in the test.`,
  code: `// 1) A dependency, registered as a bean
@Service
public class EmailService {
    public void send(String msg) { System.out.println("Email: " + msg); }
}

// 2) A consumer that declares what it needs in its constructor
@Service
public class OrderService {
    private final EmailService emailService;

    // No @Autowired needed on a single constructor — Spring injects it
    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void placeOrder() {
        emailService.send("Your order is confirmed");
    }
}

// 3) A controller that depends on the service — Spring wires the whole chain
@RestController
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @GetMapping("/order")
    public String order() { orderService.placeOrder(); return "Order placed"; }
}`,
  codeTitle: 'Annotation-based DI across layers',
  points: [
    'Mark classes as beans with @Component or its specialisations @Service, @Repository, @Controller',
    '@SpringBootApplication includes @ComponentScan, which auto-discovers those beans in your package tree',
    'Declare a dependency as a constructor parameter and Spring injects a matching bean',
    '@Autowired is optional on a single constructor — Spring injects it automatically',
    'Constructor injection allows final fields, guarantees full initialisation, and is easy to unit-test',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Use the specific stereotype that matches the role: @Service for business logic, @Repository for data access (it also translates persistence exceptions), and @Controller/@RestController for web endpoints. They behave like @Component for injection but document intent and enable role-specific features.',
    },
    {
      type: 'interview',
      content: "Q: How does Spring Boot know which classes to manage as beans?\nA: @SpringBootApplication includes @ComponentScan, which scans the main application class's package and its sub-packages for classes annotated with @Component or its stereotypes (@Service, @Repository, @Controller). Each such class is registered as a bean and becomes eligible for injection.",
    },
  ],
}
