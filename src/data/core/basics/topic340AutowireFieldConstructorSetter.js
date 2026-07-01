export default {
  id: 'autowire-field-constructor-setter',
  title: '340. Autowire Field, Constructor, Setter',
  explanation: `\`@Autowired\` can be applied at **three** injection points. They all end up with the same wired bean, but they differ in **safety, testability, and lifecycle**.

**1. Constructor injection (preferred):**
\`\`\`java
@Service
public class StudentService {
    private final StudentRepository repo;      // can be final
    public StudentService(StudentRepository repo) { this.repo = repo; }
}
\`\`\`
- Dependencies are **final** and **mandatory** — the object cannot exist half-built.
- Trivial to unit test: \`new StudentService(mockRepo)\`.
- Since Spring 4.3, a single constructor needs **no** \`@Autowired\`.

**2. Setter injection:**
\`\`\`java
@Autowired
public void setRepo(StudentRepository repo) { this.repo = repo; }
\`\`\`
- Good for **optional** or **reconfigurable** dependencies.
- Field cannot be \`final\`; the bean briefly exists without the dependency.

**3. Field injection:**
\`\`\`java
@Autowired private StudentRepository repo;
\`\`\`
- Shortest to write, but the field cannot be \`final\`, and you **cannot** set it in a test without reflection or the Spring container.

**Why constructor injection is recommended:**
- **Immutability** — final fields, no accidental reassignment.
- **Fail-fast** — a missing dependency fails at construction, not at first use.
- **Testability** — no framework needed to build the object with fakes.
- **No hidden mutable state** — dependencies are visible in the constructor signature.

**Rule of thumb:** constructor for **required** collaborators, setter for genuinely **optional** ones, field injection only in throwaway code. See [[annotation-autowiring]] for the by-type matching that feeds all three.`,
  code: `// CONSTRUCTOR — preferred, final + mandatory
@Service
public class OrderService {
    private final PaymentGateway gateway;
    private final OrderRepository repo;
    public OrderService(PaymentGateway gateway, OrderRepository repo) {
        this.gateway = gateway;
        this.repo = repo;
    }
}

// SETTER — good for optional / swappable dependencies
@Service
public class ReportService {
    private MailSender mail;
    @Autowired(required = false)
    public void setMail(MailSender mail) { this.mail = mail; }
}

// FIELD — concise but hard to test
@Service
public class AuditService {
    @Autowired private Clock clock;
}`,
  codeTitle: 'The three injection points',
  points: [
    'Constructor injection makes dependencies final and mandatory and needs no @Autowired for a single constructor',
    'Setter injection suits optional or reconfigurable dependencies but cannot use final fields',
    'Field injection is the shortest but blocks final fields and is hard to test without reflection',
    'Constructor injection fails fast: a missing dependency errors at construction rather than first use',
    'Prefer constructor for required collaborators, setter for optional ones, and avoid field injection in real code',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What are the three ways to autowire in Spring and which is best?\nA: You can autowire via the constructor, a setter, or directly on a field. Constructor injection is best because it allows final fields, guarantees required dependencies are present when the object is built, fails fast on misconfiguration, and makes the class testable without the container. Setter injection fits optional dependencies, while field injection is concise but hinders immutability and testing.',
    },
    {
      type: 'gotcha',
      content: 'Field injection makes unit testing painful: because there is no constructor or setter to pass a mock, tests must use reflection or spin up a Spring context. It can also hide too many dependencies, letting a class quietly accumulate collaborators that a constructor signature would have made obvious.',
    },
  ],
}
