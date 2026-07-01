export default {
  id: 'jpa-findbyid',
  title: '405. findById()',
  explanation: `Fetching a single row by its primary key is the other CRUD basic \`JpaRepository\` provides for free (see [[jpa-findall]]) — but its return type has a shape worth understanding carefully: **\`Optional<Job>\`**, not \`Job\`.

\`\`\`java
Optional<Job> maybeJob = jobRepository.findById(5);
\`\`\`

**Why \`Optional\` instead of returning \`Job\` (or \`null\`)?** A lookup by id might legitimately find nothing — id 5 might not exist. Returning \`null\` in that case is exactly the pattern that leads to \`NullPointerException\` if a caller forgets to check. \`Optional<Job>\` makes the "might not be there" case impossible to ignore silently — the caller must explicitly unwrap it.

**Handling the \`Optional\` in \`JobService\`, translating "not found" into something the REST layer can respond to:**
\`\`\`java
public Job findById(int id) {
    return jobRepository.findById(id)
        .orElseThrow(() -> new JobNotFoundException(id));
}
\`\`\`
Throwing a custom exception here (rather than returning \`null\` or an empty \`Job\`) lets a \`@ControllerAdvice\` (see [[configuring-dispatcherservlet]]-style centralized handling, covered more later) translate it into a proper \`404 Not Found\` response for the client — a well-behaved REST API returns *the right status code*, not just a "found nothing" placeholder object.

**Simpler alternatives when a full 404 flow isn't set up yet:**
\`\`\`java
public Job findById(int id) {
    return jobRepository.findById(id).orElse(null);   // caller must still check for null
}
\`\`\`

Either way, the key discipline \`Optional\` enforces is: **the possibility of "not found" is visible in the method's return type**, not hidden as an implicit null that's easy to forget to check.`,
  code: `public interface JobRepository extends JpaRepository<Job, Integer> {
}

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Job findById(int id) {
        return jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found: " + id));
    }
}

@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @GetMapping("/{id}")
    public Job getJob(@PathVariable int id) {
        return jobService.findById(id);
    }
}`,
  codeTitle: 'findById() returns Optional<Job> - unwrap it deliberately',
  points: [
    'findById(id) returns Optional<Job>, not Job directly, because the lookup might legitimately find nothing.',
    'Optional forces the caller to explicitly handle the "not found" case, instead of silently risking a NullPointerException.',
    'orElseThrow(...) is a common pattern: convert an empty Optional into a specific exception that upstream code (or a REST controller advice) can translate to a proper HTTP status.',
    'orElse(null) is simpler but reintroduces the null-checking burden on the caller - useful only when a full error-handling flow is not yet in place.',
    'A well-designed REST API returns 404 Not Found for a missing resource, not a 200 with a null or empty body.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling .get() directly on the Optional from findById() without checking isPresent() first defeats the entire purpose of Optional - it throws NoSuchElementException on a missing id, which is really just a null pointer exception with a different name.' },
    { type: 'interview', content: 'Q: Why does JpaRepository.findById() return Optional<T> instead of just T or null?\nA: A lookup by id can legitimately fail to find anything, and returning null for that case is exactly the pattern that leads to unchecked NullPointerExceptions. Optional makes the possibility of absence explicit in the method\'s return type, forcing the caller to consciously decide how to handle a missing result rather than silently risking a crash.' },
  ],
}
