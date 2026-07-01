export default {
  id: 'component-stereotype-annotation',
  title: '339. Component Stereotype Annotation',
  explanation: `**Stereotype annotations** are markers that tell Spring "this class is a bean — please detect and manage it." The base one is **\`@Component\`**; the others are **specialisations** of it for specific layers.

**The stereotype family:**
- **\`@Component\`** — generic Spring-managed bean, no layer meaning.
- **\`@Service\`** — a bean holding **business logic** (the service layer).
- **\`@Repository\`** — a bean for **data access** (the DAO layer). Adds a bonus: it **translates** persistence exceptions into Spring's \`DataAccessException\` hierarchy.
- **\`@Controller\`** — a web **MVC controller**; enables request-mapping handling.

Functionally \`@Service\`, \`@Repository\`, and \`@Controller\` are all \`@Component\` under the hood — Spring registers them as beans the same way. They differ in **intent** (documentation of the layer) and a few **layer-specific bonuses** (exception translation, MVC handling).

**They need component scanning to work.** A stereotype only becomes a bean if a \`@ComponentScan\` (or Spring Boot's \`@SpringBootApplication\`, which includes it) covers the class's package:
\`\`\`java
@Configuration
@ComponentScan("com.example.app")   // finds all stereotypes under this package
public class AppConfig { }
\`\`\`

**Why use the specific ones instead of plain \`@Component\`?**
- **Readability** — the annotation announces the class's role at a glance.
- **Behaviour** — \`@Repository\` gives free exception translation; \`@Controller\` plugs into Spring MVC.
- **Targeted config** — aspects/pointcuts can match all \`@Service\` beans, for example.

This layered stereotype set maps directly onto the classic **controller → service → repository** architecture (see [[different-layers]]).`,
  code: `@Repository                    // data-access bean + exception translation
public class StudentRepository {
    public Student findById(int id) { return null; }
}

@Service                       // business-logic bean
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) { this.repo = repo; }
    public Student get(int id) { return repo.findById(id); }
}

@Controller                    // web MVC handler
public class StudentController {
    private final StudentService service;
    public StudentController(StudentService service) { this.service = service; }
}

// All three are detected because a scan covers their package:
@Configuration
@ComponentScan("com.example")
class AppConfig { }`,
  codeTitle: 'The stereotype family across layers',
  points: [
    '@Component is the base stereotype marking any class as a Spring-managed bean',
    '@Service, @Repository, and @Controller are specialisations of @Component for specific layers',
    '@Repository adds automatic translation of persistence exceptions into DataAccessException',
    '@Controller integrates the bean into Spring MVC request handling',
    'Stereotypes only become beans when a @ComponentScan covers their package',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between @Component, @Service, @Repository, and @Controller?\nA: All four are stereotype annotations that register a class as a Spring bean, and @Service, @Repository, and @Controller are specialisations of @Component. They are functionally similar for bean registration but convey layer intent and add bonuses: @Repository translates persistence exceptions into Spring DataAccessException, and @Controller wires the class into Spring MVC. Plain @Component is used when no specific layer role applies.',
    },
    {
      type: 'gotcha',
      content: 'A stereotype annotation alone does nothing — the class must lie within a package covered by @ComponentScan (or @SpringBootApplication, which includes a scan of its own package downward). If your bean is not being created, the usual cause is that component scanning does not reach its package.',
    },
  ],
}
