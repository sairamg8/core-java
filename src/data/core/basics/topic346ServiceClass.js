export default {
  id: 'service-class',
  title: '346. Service Class',
  explanation: `The **service class** is the home of your application's **business logic**. It sits between the controller (web) and the repository (data) layers, orchestrating the work and enforcing the rules. You mark it with **\`@Service\`** so Spring registers it as a bean (see [[different-layers]]).

**What belongs in a service:**
- **Business rules and validation** — "an order over 10,000 needs approval", "a student id must be positive".
- **Orchestration** — call several repositories/other services and combine results.
- **Transaction boundaries** — annotate methods (or the class) with \`@Transactional\` so a unit of work commits or rolls back together.
- **Mapping** between domain entities and DTOs.

**What does NOT belong:** raw SQL / persistence details (that is the repository), and HTTP concerns like status codes or request parsing (that is the controller).

**Structure — interface + implementation (common, optional):**
\`\`\`java
public interface StudentService {
    Student register(Student s);
}

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository repo;
    public StudentServiceImpl(StudentRepository repo) { this.repo = repo; }

    @Override
    public Student register(Student s) {
        if (s.getAge() < 18) throw new IllegalArgumentException("must be 18+");
        return repo.save(s);
    }
}
\`\`\`
Coding to an interface lets you swap or mock the implementation, though for simple apps a single \`@Service\` class is fine.

**Why a dedicated service layer:** it keeps business logic in **one** place — reusable across multiple controllers, independently unit-testable with a mocked repository, and unaffected by changes to the web or persistence layers. \`@Service\` is functionally a \`@Component\`; the distinct annotation documents the class's role and lets tooling/aspects target the business layer.`,
  code: `@Service
public class StudentService {

    private final StudentRepository repo;
    private final EmailService email;

    public StudentService(StudentRepository repo, EmailService email) {
        this.repo = repo;
        this.email = email;
    }

    @Transactional                              // one unit of work
    public Student register(Student student) {
        // business rule
        if (repo.existsByEmail(student.getEmail()))
            throw new IllegalStateException("email already registered");

        Student saved = repo.save(student);     // data access via repository
        email.sendWelcome(saved);               // orchestrate another collaborator
        return saved;
    }
}`,
  codeTitle: '@Service holding business logic',
  points: [
    'The service class holds business logic and sits between the controller and repository layers',
    '@Service registers it as a Spring bean and marks it as the business layer',
    'It handles validation, orchestration across collaborators, and transaction boundaries',
    'It must not contain raw persistence details or HTTP concerns — those belong to other layers',
    'Coding to a service interface allows swapping or mocking the implementation for tests',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the role of a @Service class in Spring?\nA: A @Service class is the business-logic layer. It orchestrates repositories and other services, enforces business rules and validation, and defines transaction boundaries, while staying free of persistence details and HTTP concerns. @Service is technically a @Component, but the specific annotation documents the class as the business layer and keeps that logic in one reusable, testable place.',
    },
    {
      type: 'tip',
      content: 'Put @Transactional on service methods, not on repositories or controllers. The service is the natural transaction boundary because a single business operation often spans several repository calls that must all commit or roll back together.',
    },
  ],
}
