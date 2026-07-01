export default {
  id: 'jpa-findall',
  title: '404. findAll()',
  explanation: `\`findAll()\` is the simplest method \`JpaRepository\` (see [[spring-data-jpa-introduction]]) provides — and it's already fully implemented the moment \`JobRepository\` extends it:

\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
}

// usage:
List<Job> allJobs = jobRepository.findAll();
\`\`\`

**What happens underneath a single call:** Spring Data JPA generates a proxy implementation of \`JobRepository\` at startup. Calling \`findAll()\` on that proxy delegates to Hibernate, which issues \`SELECT * FROM job\`, maps each row to a \`Job\` object using the \`@Entity\` mapping (see [[jpa-creating-tables-and-inserting-data]]), and returns them as a \`List<Job>\`. None of that SQL, none of that row-mapping code, was written by hand — compare this to \`RowMapper\`-based JDBC (see [[row-mapper]]), where mapping each column to a field was explicit, manual code.

**Wiring it into \`JobService\`, replacing the in-memory list:**
\`\`\`java
@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> findAll() {
        return jobRepository.findAll();
    }
}
\`\`\`

**A subtlety worth noting:** \`findAll()\` returns *every* row with no pagination or ordering by default. For a small demo table that's fine; for a table with thousands of rows, an unbounded \`findAll()\` in a REST endpoint (\`GET /jobs\`) can become a real performance and memory concern — a problem large-scale APIs solve with pagination (\`Pageable\`, a topic for later REST/JPA work), not covered by the plain \`findAll()\` shown here.`,
  code: `public interface JobRepository extends JpaRepository<Job, Integer> {
}

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> findAll() {
        return jobRepository.findAll();   // SELECT * FROM job, mapped to List<Job>
    }
}

@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.findAll();
    }
}`,
  codeTitle: 'findAll() end to end: repository -> service -> controller',
  points: [
    'findAll() is provided automatically by JpaRepository - no method body or implementation needs to be written.',
    'Under the hood, Spring Data JPA generates a proxy that delegates to Hibernate, which issues a SELECT and maps rows to entity objects.',
    'This removes the manual RowMapper-style code JDBC-based data access required.',
    'JobService.findAll() now delegates to jobRepository.findAll() - the controller and everything above it is unchanged.',
    'findAll() with no arguments fetches every row unbounded - fine for small tables, a real concern for large ones without pagination.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling findAll() on a table with a very large number of rows loads every row into memory as objects in one shot - for a growing production table this becomes a real performance and memory problem, which is exactly why paginated queries (Pageable) exist for larger datasets.' },
    { type: 'interview', content: 'Q: How does JobRepository.findAll() work when the interface has no method body at all?\nA: Spring Data JPA generates a runtime proxy implementation of the JobRepository interface at application startup. That proxy\'s findAll() implementation delegates to the underlying JPA provider (Hibernate), which issues a SELECT statement and maps each resulting row to a Job entity instance automatically, based on the entity\'s @Entity/@Column mappings.' },
  ],
}
