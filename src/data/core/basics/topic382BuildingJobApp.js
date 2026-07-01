export default {
  id: 'building-job-app',
  title: '382. Building Job App',
  explanation: `With the domain model settled (see [[job-app-source-code]]), here is the build order for the Job Application tracker — the same order the following topics walk through:

1. **[[job-app-creating-project]]** — set up the dynamic web project (or reuse the one from [[creating-spring-mvc-project-part1]]) with the \`Job\` class and package layout in place.
2. **\`JobService\`** — a Spring-managed bean holding an in-memory \`List<Job>\`, with \`addJob(Job)\` and \`findAll()\`.
3. **[[home-and-add-job-controller]]** — \`HomeController\` (\`GET /\`) lists jobs; \`AddJobController\` shows the form (\`GET /addJob\`) and handles submission (\`POST /addJob\`).
4. **[[job-app-understanding-views]]** and **[[job-app-handling-forms]]** — \`home.jsp\` renders the list; \`addJob.jsp\` renders the form using Spring's form tag library.
5. **[[job-app-view-data]]** — wiring the job list into the model so \`home.jsp\` can iterate it with JSTL's \`<c:forEach>\`.

**\`JobService\` — the storage layer:**
\`\`\`java
@Service
public class JobService {
    private List<Job> jobs = new ArrayList<>();

    public void addJob(Job job) {
        jobs.add(job);
    }

    public List<Job> findAll() {
        return jobs;
    }
}
\`\`\`

Marking it \`@Service\` (a specialization of \`@Component\`) means component scanning picks it up automatically as long as the base package is scanned (see [[configuring-dispatcherservlet]]) — no manual bean declaration needed. Both controllers can then \`@Autowired\` it directly.`,
  code: `@Service
public class JobService {

    private List<Job> jobs = new ArrayList<>();

    public void addJob(Job job) {
        jobs.add(job);
    }

    public List<Job> findAll() {
        return jobs;
    }

    public int getJobCount() {
        return jobs.size();
    }
}`,
  codeTitle: 'JobService: in-memory storage as a Spring bean',
  points: [
    'The build order is: project setup, JobService, the two controllers, then the two JSP views.',
    '@Service marks JobService as a Spring-managed component, picked up automatically by component scanning.',
    'JobService exposes addJob and findAll - controllers depend only on this interface, never on the List directly.',
    'Both HomeController and AddJobController @Autowired the same JobService instance (a Spring-managed singleton by default).',
    'This build order mirrors the layered architecture: model, then service, then controller, then view - each step depends only on the one before it.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A plain List<Job> field on a singleton @Service bean is shared across every request. That is fine for a single-user demo, but in a real multi-user app it needs proper persistence (or thread-safety) - not a shared mutable in-memory list.' },
    { type: 'interview', content: 'Q: Why is JobService annotated with @Service rather than @Component?\nA: @Service is a specialization of @Component that documents the class as belonging to the service layer. Functionally it behaves identically to @Component for component scanning, but the more specific annotation communicates intent to other developers and tools.' },
  ],
}
