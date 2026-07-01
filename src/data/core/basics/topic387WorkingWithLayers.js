export default {
  id: 'job-app-working-with-layers',
  title: '387. Working with Layers',
  explanation: `The Job app (see [[building-job-app]]) is small, but it already follows the standard three-layer web architecture — the same shape every Spring MVC app in this course has used, whether backed by a database or, here, a plain in-memory list:

\`\`\`
Controller layer   HomeController, AddJobController      talks to HTTP, never touches storage directly
      │
Service layer      JobService                            business logic, the one source of truth for storage
      │
Model layer        Job                                   plain data, no logic, no framework dependency
\`\`\`

**Why not let the controller hold the \`List<Job>\` directly?** It would work for this tiny example, but it breaks down immediately in a real app:
- **No reuse** — if a second controller (an admin view, a REST endpoint) needed the job list, the logic would have to be copied or the controllers would have to reach into each other.
- **No single source of truth** — two controllers each holding their own list would drift out of sync.
- **Hard to swap storage** — replacing the in-memory list with a database means rewriting every controller that touched it directly, instead of changing one service class.
- **Hard to test** — a controller with embedded storage logic can't be unit tested without also testing that storage logic; a service the controller only depends on can be mocked.

**The dependency direction always points one way:** controllers depend on the service; the service depends on the model. The model never depends on anything above it, and the service never reaches back up into a controller. This is the same layering already used for database-backed features (see [[student-service-and-repository]]) — the Job app just makes the in-memory case explicit so the pattern is unmistakable before real persistence (Chapter G: REST + Spring Data JPA) replaces the list with a repository.`,
  code: `@Controller
public class HomeController {
    @Autowired
    private JobService jobService;   // depends on the service...

    @RequestMapping("/")
    public String home(Model model) {
        model.addAttribute("jobs", jobService.findAll());  // ...never touches storage directly
        return "home";
    }
}

@Service
public class JobService {
    private List<Job> jobs = new ArrayList<>();  // the one place storage lives
    public List<Job> findAll() { return jobs; }
    public void addJob(Job job) { jobs.add(job); }
}`,
  codeTitle: 'Controller depends on service; service owns storage',
  points: [
    'The Job app follows the standard three-layer shape: Controller -> Service -> Model, same as every earlier database-backed feature.',
    'Controllers never touch storage directly - they only call methods on the service.',
    'Centralizing storage in one service gives a single source of truth, reusable by any number of controllers.',
    'This layering is what makes swapping in-memory storage for a real database later a one-class change, not a rewrite.',
    'Dependencies point one way: controller depends on service, service depends on model - never the reverse.',
  ],
  callouts: [
    { type: 'tip', content: 'A good sanity check for layering: could this class be unit-tested without starting Spring, a servlet container, or a database? JobService can (plain Java, a List). A controller with storage logic embedded in it usually cannot.' },
    { type: 'interview', content: 'Q: What breaks if a controller holds its own List<Job> instead of delegating to a service?\nA: Multiple things: no reuse across controllers, no single source of truth if more than one controller needs the data, harder unit testing since storage logic is entangled with HTTP handling, and a much larger change required later to swap in real persistence, since every controller touching the list would need to change instead of one service class.' },
  ],
}
