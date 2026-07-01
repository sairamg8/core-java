export default {
  id: 'spring-data-jpa-introduction',
  title: '401. Spring Data JPA Introduction',
  explanation: `Every persistence example so far in this REST chapter has assumed \`JobService\` still holds an in-memory \`List<Job>\` (see [[job-app-working-with-layers]]) — exactly as intentionally simplified in Chapter F. **Spring Data JPA** is what finally replaces it with a real database, and it does so with dramatically less boilerplate than raw Hibernate (see [[hibernate-configuration-using-java-without-xml]]) or JDBC (see [[jdbc-template]]).

**The core idea:** instead of writing a DAO class with methods like \`findAll()\`, \`findById()\`, \`save()\` by hand (as \`StudentRepository\` did, see [[student-service-and-repository]]), Spring Data JPA lets you **declare an interface**, and Spring generates the implementation at runtime:

\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
    // that's it - no method bodies needed for basic CRUD
}
\`\`\`

\`JpaRepository<Job, Integer>\` says "this repository manages \`Job\` entities, whose id type is \`Integer\`." Just extending it hands you \`findAll()\`, \`findById()\`, \`save()\`, \`deleteById()\`, \`count()\`, and more — fully implemented, with zero code written.

**How this replaces \`JobService\`'s list:**
\`\`\`java
@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> findAll() {
        return jobRepository.findAll();   // was: return jobs;
    }

    public Job addJob(Job job) {
        return jobRepository.save(job);   // was: jobs.add(job);
    }
}
\`\`\`

Nothing above \`JobService\` changes — not the controllers, not the views or REST endpoints — exactly the payoff [[summary-for-job-webapp]] promised the layered architecture would deliver. Spring Data JPA sits *underneath* the service, translating repository calls into real SQL against a real database using JPA/Hibernate under the hood (see [[what-is-orm-and-jpa]]).`,
  code: `// The entire repository - Spring generates the implementation
public interface JobRepository extends JpaRepository<Job, Integer> {
}

// JobService barely changes shape - only where the data comes from
@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> findAll() { return jobRepository.findAll(); }
    public Job addJob(Job job) { return jobRepository.save(job); }
    public Job findById(int id) { return jobRepository.findById(id).orElse(null); }
}`,
  codeTitle: 'JpaRepository: CRUD with zero implementation code',
  points: [
    'Spring Data JPA generates a repository\'s implementation at runtime from a declared interface - no method bodies needed for standard CRUD.',
    'Extending JpaRepository<Job, Integer> immediately provides findAll, findById, save, deleteById, count, and more.',
    'This directly replaces the in-memory List<Job> inside JobService with real, database-backed persistence.',
    'Controllers and views above JobService require zero changes - the layered architecture from Chapter F pays off exactly as designed.',
    'Under the hood, Spring Data JPA still uses JPA/Hibernate to translate repository calls into SQL against the configured database.',
  ],
  callouts: [
    { type: 'tip', content: 'The two generic parameters on JpaRepository<Job, Integer> are easy to forget which is which: the first is the entity type being managed, the second is the type of that entity\'s primary key (@Id field).' },
    { type: 'interview', content: 'Q: Why does swapping JobService\'s in-memory list for a JpaRepository require no changes to the controllers?\nA: Because the controllers only ever depended on JobService\'s public methods (findAll, addJob), never on how it stored data internally. That dependency-direction discipline, established from the start in Chapter F, is exactly what makes the storage implementation swappable without touching any layer above the service.' },
  ],
}
