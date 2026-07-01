export default {
  id: 'different-layers',
  title: '345. Different Layers',
  explanation: `A well-structured Spring application is split into **layers**, each with one responsibility. Requests flow **down** through the layers and data flows **back up**. This separation keeps code testable, swappable, and easy to reason about.

**The classic three-layer (plus one) architecture:**
- **Controller / Web layer** (\`@Controller\`, \`@RestController\`) — handles HTTP: reads the request, calls the service, returns a response/view. **No business logic here.**
- **Service layer** (\`@Service\`) — the **business logic**: rules, validation, orchestration, transactions. It knows *what* to do, not *how* data is stored.
- **Repository / DAO layer** (\`@Repository\`) — **data access** only: talks to the database, hides SQL/ORM details.
- **Model / Domain layer** — the plain objects (entities, DTOs) that move between layers.

**The dependency direction:** Controller → Service → Repository. Each layer depends **only on the one below it**, through an **interface** where possible, and Spring injects the collaborator:
\`\`\`java
@RestController class StudentController { StudentService service; }   // -> Service
@Service        class StudentService    { StudentRepository repo; }   // -> Repository
@Repository     class StudentRepository { /* DB access */ }
\`\`\`

**Why layer at all?**
- **Separation of concerns** — each layer changes for one reason (UI change vs rule change vs DB change).
- **Testability** — test the service with a mock repository, no database needed.
- **Swappability** — replace a JDBC repository with a JPA one without touching the service.
- **Readability** — a new developer knows exactly where each kind of code lives.

The stereotypes (\`@Controller\`/\`@Service\`/\`@Repository\`) map one-to-one onto these layers (see [[component-stereotype-annotation]]), which is exactly why Spring provides distinct annotations.`,
  code: `// WEB LAYER — HTTP only
@RestController
public class StudentController {
    private final StudentService service;
    public StudentController(StudentService service) { this.service = service; }

    @GetMapping("/students/{id}")
    public Student get(@PathVariable int id) { return service.getStudent(id); }
}

// SERVICE LAYER — business logic
@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) { this.repo = repo; }

    public Student getStudent(int id) {
        if (id <= 0) throw new IllegalArgumentException("bad id");
        return repo.findById(id);
    }
}

// REPOSITORY LAYER — data access only
@Repository
public class StudentRepository {
    public Student findById(int id) { /* query DB */ return new Student(); }
}`,
  codeTitle: 'Controller to Service to Repository',
  points: [
    'Applications split into web/controller, service, repository, and model layers, each with one responsibility',
    'The controller handles HTTP, the service holds business logic, the repository handles data access',
    'Dependencies flow one way: controller depends on service, service depends on repository',
    'Layering enables testing a service with a mock repository and swapping implementations freely',
    'The @Controller, @Service, and @Repository stereotypes map directly onto these layers',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why is a Spring application split into controller, service, and repository layers?\nA: Each layer has a single responsibility — the controller deals with HTTP, the service holds business logic and transactions, and the repository handles data access — and dependencies flow only downward. This separation of concerns makes the code testable (mock the repository to test the service), swappable (change the persistence layer without touching business logic), and easy to navigate.',
    },
    {
      type: 'gotcha',
      content: 'A common anti-pattern is leaking business logic into the controller or SQL into the service. Keep controllers thin (translate HTTP to a service call and back) and repositories dumb (just data access) so the service layer remains the single home for business rules.',
    },
  ],
}
