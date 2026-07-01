export default {
  id: 'jpa-in-job-app',
  title: '408. JPA In Job App',
  explanation: `Time to actually make the swap [[summary-for-job-webapp]] promised: replace \`JobService\`'s in-memory \`List<Job>\` with a real, JPA-backed \`JobRepository\` (see [[spring-data-jpa-introduction]]) — and confirm exactly how little else has to change.

**Step 1 — make \`Job\` a real JPA entity** (see [[what-is-orm-and-jpa]]):
\`\`\`java
@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String description;
    private String url;
    private String profile;
    // getters, setters, no-arg constructor (JPA requires one)
}
\`\`\`

**Step 2 — declare the repository:**
\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
}
\`\`\`

**Step 3 — rewire \`JobService\` to delegate instead of storing:**
\`\`\`java
@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> findAll() { return jobRepository.findAll(); }
    public Job addJob(Job job) { return jobRepository.save(job); }
    public Job findById(int id) { return jobRepository.findById(id).orElseThrow(); }
}
\`\`\`

**What did NOT change:** \`HomeController\`, \`AddJobController\`, \`home.jsp\`, \`addJob.jsp\` (see [[home-and-add-job-controller]], [[job-app-handling-forms]]) — not one line. They call \`jobService.findAll()\` and \`jobService.addJob(job)\` exactly as before; \`JobService\`'s *internals* changed completely (list → database), but its *public contract* didn't move at all.

**One real behavior change worth noticing:** with the in-memory list, restarting the app wiped every added job. With a real database behind \`JobRepository\`, jobs added through the form now **persist across restarts** — the most visible, tangible proof the swap actually worked.`,
  code: `// Before: JobService owned storage directly
private List<Job> jobs = new ArrayList<>();
public void addJob(Job job) { jobs.add(job); }

// After: JobService delegates to a JPA repository - same method signature
@Autowired
private JobRepository jobRepository;
public Job addJob(Job job) { return jobRepository.save(job); }

// Controllers, unchanged either way:
jobService.addJob(job);`,
  codeTitle: 'The swap: same JobService method signatures, real storage underneath',
  points: [
    'Making Job a JPA entity requires @Entity, @Id, @GeneratedValue, and a no-arg constructor - a small, mechanical change.',
    'JobRepository extends JpaRepository<Job, Integer>, providing full CRUD with no method bodies written.',
    'JobService is rewired to delegate to the repository instead of managing a list - its public method signatures stay identical.',
    'HomeController, AddJobController, and both JSPs require zero changes - proof the earlier layering discipline paid off exactly as designed.',
    'Data now persists across application restarts, unlike the in-memory list - the most visible confirmation the swap succeeded.',
  ],
  callouts: [
    { type: 'tip', content: 'After making this change, the fastest sanity check is restarting the app after adding a job through the form: with the old in-memory list it would vanish; with JobRepository backing it, it survives the restart - a simple, concrete test that the persistence swap actually worked.' },
    { type: 'interview', content: 'Q: What specifically had to change in the Job app to move from in-memory storage to a real database, and what stayed the same?\nA: The Job class became a JPA @Entity, a JobRepository interface was added extending JpaRepository, and JobService\'s internals were rewired to call the repository instead of managing a List directly - but JobService\'s public method signatures (findAll, addJob) stayed the same. Both controllers and both JSPs required zero changes, because they only ever depended on JobService\'s public contract, never its storage implementation.' },
  ],
}
