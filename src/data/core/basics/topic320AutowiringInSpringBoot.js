export default {
  id: 'autowiring-in-spring-boot',
  title: '320. Autowiring in Spring Boot',
  explanation: `**Autowiring** is Spring automatically supplying a bean's dependencies for you, so you do not manually look them up or construct them. The \`@Autowired\` annotation marks an injection point.

**Three places you can autowire:**
- **Constructor injection (preferred):** \`@Autowired\` on the constructor. On a class with a *single* constructor, \`@Autowired\` is **optional** — Spring uses that constructor automatically.
- **Setter injection:** \`@Autowired\` on a setter method; Spring calls it after construction. Good for optional dependencies.
- **Field injection:** \`@Autowired\` directly on a field. Concise but discouraged — you cannot make the field \`final\`, and testing requires reflection or a Spring context.

**How Spring resolves what to inject — by type first:** Spring looks for a bean whose type matches the parameter/field. Three outcomes:
- **Exactly one match** → inject it.
- **No match** → \`NoSuchBeanDefinitionException\` (unless you mark it \`@Autowired(required = false)\` or use \`Optional\`).
- **Multiple matches** → ambiguity error, unless you disambiguate with \`@Primary\` (see [[primary-bean]]) or \`@Qualifier("beanName")\`.

**@Qualifier** names exactly which bean to inject when several of the same type exist:
\`\`\`
public OrderService(@Qualifier("stripeGateway") PaymentGateway gateway) { ... }
\`\`\`

**Best practice:** prefer constructor injection with \`final\` fields. It documents required dependencies, guarantees the object is fully built, and makes unit testing trivial.`,
  code: `// Constructor injection — @Autowired optional on a single constructor
@Service
public class ReportService {
    private final DataSource dataSource;
    public ReportService(DataSource dataSource) {   // auto-injected
        this.dataSource = dataSource;
    }
}

// Setter injection — good for optional dependencies
@Service
public class NotificationService {
    private SmsSender smsSender;
    @Autowired(required = false)   // app still starts if no SmsSender bean exists
    public void setSmsSender(SmsSender smsSender) { this.smsSender = smsSender; }
}

// Disambiguating when multiple beans of the same type exist
@Service
public class CheckoutService {
    private final PaymentGateway gateway;
    public CheckoutService(@Qualifier("stripeGateway") PaymentGateway gateway) {
        this.gateway = gateway;   // pick the Stripe bean specifically
    }
}`,
  codeTitle: '@Autowired: constructor, setter, and @Qualifier',
  points: [
    '@Autowired tells Spring to inject a matching bean at a constructor, setter, or field',
    'On a class with a single constructor, @Autowired is optional — Spring uses it automatically',
    'Spring resolves dependencies by type first; no bean throws NoSuchBeanDefinitionException',
    'Multiple beans of the same type cause ambiguity — resolve with @Primary or @Qualifier("name")',
    'Prefer constructor injection with final fields; field injection is concise but hard to test',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Field injection (@Autowired on a private field) looks the cleanest but is the weakest choice: the field cannot be final, hidden dependencies are easy to overlook, and unit tests need reflection or a full Spring context to set it. Prefer constructor injection so dependencies are explicit and testable with plain new.',
    },
    {
      type: 'interview',
      content: "Q: What happens if Spring finds two beans of the same type for one @Autowired point?\nA: It throws a NoUniqueBeanDefinitionException because the injection is ambiguous. You resolve it by marking one bean @Primary (the default winner) or by adding @Qualifier(\"beanName\") at the injection point to name exactly which bean to use.",
    },
  ],
}
