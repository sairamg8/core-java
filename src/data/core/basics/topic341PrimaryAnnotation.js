export default {
  id: 'primary-annotation',
  title: '341. @Primary Annotation',
  explanation: `**\`@Primary\`** marks one bean as the **preferred candidate** when several beans of the same type exist. Whenever Spring must autowire that type and no \`@Qualifier\` narrows the choice, the \`@Primary\` bean wins — so autowiring succeeds instead of throwing \`NoUniqueBeanDefinitionException\`.

**Where it goes:** on the **bean definition** — the \`@Component\` class or the \`@Bean\` method.
\`\`\`java
@Component
@Primary
public class MySqlStudentRepository implements StudentRepository { }

@Component
public class MongoStudentRepository implements StudentRepository { }

@Autowired
private StudentRepository repo;   // injects MySqlStudentRepository
\`\`\`

Or on a \`@Bean\` method:
\`\`\`java
@Bean
@Primary
public DataSource primaryDataSource() { ... }
\`\`\`

**Key points:**
- Exactly **one** bean of a given type should be \`@Primary\`. Two \`@Primary\` beans of the same type bring the ambiguity back — Spring cannot pick between two defaults.
- \`@Primary\` is only consulted when there **is** ambiguity. With a single candidate it has no effect.
- It is a **default**, not a lock — an injection point using \`@Qualifier("mongoStudentRepository")\` still overrides it (see [[primary-and-qualifier]]).

**When to use it:** you have one "normal" implementation used almost everywhere and one or two special cases. Mark the normal one \`@Primary\` so most injections need no annotation, and use \`@Qualifier\` only at the few points that want the alternative. This keeps the common path clean while leaving room for exceptions.`,
  code: `public interface StudentRepository { }

@Component
@Primary                                   // the default implementation
public class MySqlStudentRepository implements StudentRepository { }

@Component
public class MongoStudentRepository implements StudentRepository { }

@Service
public class StudentService {
    private final StudentRepository repo;
    // No @Qualifier -> Spring injects the @Primary (MySql) bean
    public StudentService(StudentRepository repo) { this.repo = repo; }
}

@Service
public class MigrationService {
    private final StudentRepository repo;
    // Explicit override of the primary for this one injection
    public MigrationService(@Qualifier("mongoStudentRepository") StudentRepository repo) {
        this.repo = repo;
    }
}`,
  codeTitle: '@Primary as the default candidate',
  points: [
    '@Primary designates the preferred bean when several beans share a type',
    'It sits on the bean definition — the @Component class or the @Bean method',
    'It only matters under ambiguity; with a single candidate it has no effect',
    'Only one bean per type should be @Primary, or the ambiguity returns',
    '@Qualifier at an injection point overrides @Primary because an explicit choice wins',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What does @Primary do in Spring?\nA: @Primary marks one bean of a given type as the default candidate for autowiring. When multiple beans match and no @Qualifier is given, Spring injects the @Primary bean instead of throwing NoUniqueBeanDefinitionException. It is placed on the bean definition, applies only when there is ambiguity, and can still be overridden at a specific injection point with @Qualifier.',
    },
    {
      type: 'gotcha',
      content: 'Do not mark two beans of the same type @Primary — Spring then has two defaults and raises the ambiguity error again. There must be exactly one primary per type for it to resolve the conflict.',
    },
  ],
}
