export default {
  id: 'search-by-keyword',
  title: '410. Search By Keyword',
  explanation: `The last piece for the Job app's REST API: letting a user search jobs by a keyword, using the derived query DSL introduced earlier (see [[jpa-query-dsl]]).

**The repository method — one line, no SQL written:**
\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByDescriptionContaining(String keyword);
}
\`\`\`
\`Containing\` translates to a \`LIKE '%keyword%'\` clause — Spring Data JPA generates \`SELECT * FROM job WHERE description LIKE ?\` with the keyword wrapped in \`%\` wildcards automatically.

**Wiring it through the service and a new REST endpoint:**
\`\`\`java
@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> search(String keyword) {
        return jobRepository.findByDescriptionContaining(keyword);
    }
}

@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @GetMapping("/search")
    public List<Job> search(@RequestParam String keyword) {
        return jobService.search(keyword);
    }
}
\`\`\`

**Why \`@RequestParam\` here, not \`@PathVariable\`:** a search keyword is a *filter* on a collection, not the identity of a single resource (see [[pathvariable]]) — \`GET /jobs/search?keyword=java\` is the idiomatic REST shape, keeping \`/jobs/{id}\` reserved for addressing one specific job by id. \`/jobs/search\` is itself just a fixed path segment; Spring matches it *before* trying to interpret \`search\` as a \`{id}\` path variable, so route ordering (a more specific mapping like \`/search\` vs. a variable \`{id}\`) needs to be unambiguous, or Spring's request mapping may need the more specific path listed to avoid a clash.

**One real limitation worth naming honestly:** \`Containing\` performs a simple substring match, case-sensitive by default in many databases (PostgreSQL's \`LIKE\` is case-sensitive; \`ILIKE\` isn't). \`findByDescriptionContainingIgnoreCase\` is the derived-method equivalent for a case-insensitive search — worth using for anything a real user types, since expecting exact-case input is poor UX.`,
  code: `public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByDescriptionContainingIgnoreCase(String keyword);
}

@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @GetMapping("/search")
    public List<Job> search(@RequestParam String keyword) {
        return jobService.search(keyword);
    }
}`,
  codeTitle: 'GET /jobs/search?keyword=... backed by a derived query',
  points: [
    'findByDescriptionContaining generates a LIKE \'%keyword%\' query automatically, with no SQL written by hand.',
    'A search keyword is a filter on a collection, so it belongs in a @RequestParam, not a @PathVariable.',
    'A fixed path segment like /jobs/search needs to be distinguishable from a variable segment like /jobs/{id} to avoid ambiguous routing.',
    'Containing is case-sensitive on many databases by default; ContainingIgnoreCase is the derived-method equivalent for case-insensitive search.',
    'This single feature ties together derived queries, @RequestParam, and REST endpoint design covered across this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Defining both @GetMapping("/{id}") and @GetMapping("/search") on the same controller can cause a request to /jobs/search to be routed to the {id} handler instead, if Spring cannot unambiguously prefer the more specific literal path - test this route explicitly rather than assuming it resolves correctly.' },
    { type: 'interview', content: 'Q: Why use findByDescriptionContainingIgnoreCase instead of findByDescriptionContaining for a user-facing search feature?\nA: LIKE-based matching is case-sensitive on many databases (PostgreSQL among them) by default. A real user typing a search term is unlikely to match the exact casing stored in the database, so ContainingIgnoreCase - which generates a case-insensitive comparison - produces far better, more forgiving search results for actual users.' },
  ],
}
