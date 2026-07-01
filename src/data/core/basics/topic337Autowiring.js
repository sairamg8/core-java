export default {
  id: 'annotation-autowiring',
  title: '337. Autowiring',
  explanation: `**Autowiring** lets Spring **inject dependencies automatically** instead of you wiring them by hand in XML. With annotations you mark an injection point with **\`@Autowired\`** and Spring finds a matching bean and plugs it in.

**Where \`@Autowired\` can go:**
- **Constructor** (preferred) — Spring passes the dependencies as constructor arguments.
- **Setter** — Spring calls the setter with the matching bean.
- **Field** — Spring sets the field directly via reflection.

\`\`\`java
@Component
public class StudentService {
    private final StudentRepository repo;

    @Autowired                                  // constructor injection
    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }
}
\`\`\`

**How matching works — by type:** Spring looks for a bean **assignable to the required type**. If \`StudentRepository\` has one implementation bean, it is injected. This is the same by-type resolution as \`getBean(Class)\` (see [[getbean-by-type]]).

**Resolution outcomes:**
- **Exactly one match** → injected.
- **No match** → \`NoSuchBeanDefinitionException\` (unless \`@Autowired(required = false)\`, which leaves it null).
- **Several matches** → \`NoUniqueBeanDefinitionException\`; break the tie with \`@Primary\` or \`@Qualifier\` (see [[primary-and-qualifier]]).

**Constructor injection is preferred** because it makes dependencies **final** and **mandatory**, allows the object to be fully valid the moment it is built, and keeps it testable (just \`new\` it with mocks). Since Spring 4.3, if a class has **one constructor** you can even **omit \`@Autowired\`** — Spring autowires it implicitly.`,
  code: `@Component
public class StudentRepository { }

@Component
public class StudentService {
    private final StudentRepository repo;

    // Single constructor: @Autowired is optional since Spring 4.3
    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }
}

// Field injection (works, but harder to test — no way to set repo without Spring)
@Component
class NotificationService {
    @Autowired
    private StudentRepository repo;
}

// Optional dependency: stays null if no matching bean exists
@Autowired(required = false)
private AuditLogger auditLogger;`,
  codeTitle: 'Constructor vs field autowiring',
  points: [
    '@Autowired tells Spring to inject a matching bean automatically at construction, setter, or field',
    'Matching is by type — Spring finds a bean assignable to the required type',
    'No matching bean throws NoSuchBeanDefinitionException unless required=false is set',
    'Multiple matching beans throw NoUniqueBeanDefinitionException, resolved with @Primary or @Qualifier',
    'Constructor injection is preferred: dependencies become final, mandatory, and easy to test',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is autowiring and how does Spring decide what to inject?\nA: Autowiring is Spring injecting dependencies automatically at points marked @Autowired (constructor, setter, or field). By default it resolves by type, finding a bean assignable to the required type. One match is injected, no match throws NoSuchBeanDefinitionException (unless required=false), and several matches throw NoUniqueBeanDefinitionException, which you resolve with @Primary or @Qualifier.',
    },
    {
      type: 'tip',
      content: 'Prefer constructor injection: it lets you mark fields final, guarantees the bean is fully initialised once constructed, and makes the class trivially unit-testable by passing mocks to the constructor without any Spring container.',
    },
  ],
}
