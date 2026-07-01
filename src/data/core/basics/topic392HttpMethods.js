export default {
  id: 'http-methods-rest',
  title: '392. HTTP Methods',
  explanation: `REST (see [[what-is-rest]]) leans on the HTTP methods that were always part of the protocol — this topic looks at what each one means, and the guarantees Spring Boot expects a well-behaved REST API to honor.

**The methods used in this course's REST APIs:**
- **\`GET\`** — read a resource. Never changes server state. Safe to call any number of times, safe to cache, safe to retry.
- **\`POST\`** — create a new resource. Each call typically creates a *new* thing (\`POST /jobs\` twice with the same body creates two jobs).
- **\`PUT\`** — replace a resource entirely at a known URL (\`PUT /jobs/5\` replaces job 5's full representation).
- **\`PATCH\`** — partially update a resource (only the given fields change). Less common in this course than \`PUT\`, but the distinction matters: \`PUT\` implies "here is the whole new state," \`PATCH\` implies "here are just the changes."
- **\`DELETE\`** — remove a resource at a known URL.

**Two properties every method either has or lacks — and why they matter:**
- **Safe** (no state change): only \`GET\` (and \`HEAD\`, \`OPTIONS\`) are safe. A safe method can be prefetched, cached, or retried freely because it never modifies anything.
- **Idempotent** (calling it N times has the same effect as calling it once): \`GET\`, \`PUT\`, and \`DELETE\` are idempotent — \`PUT /jobs/5\` with the same body twice leaves job 5 in the same final state either time; \`DELETE /jobs/5\` twice leaves it deleted either time. \`POST\` is **not** idempotent — calling it twice usually creates two resources, which is exactly why retrying a failed \`POST\` is risky (a form resubmission could double-create data, the same problem [[home-and-add-job-controller]]'s redirect pattern was designed to avoid).

**Mapping methods in Spring Boot** uses one annotation per method: \`@GetMapping\`, \`@PostMapping\`, \`@PutMapping\`, \`@DeleteMapping\`, \`@PatchMapping\` — each a shorthand for \`@RequestMapping(method = RequestMethod.X)\`.`,
  code: `@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @GetMapping                 // GET /jobs
    public List<Job> findAll() { return jobService.findAll(); }

    @GetMapping("/{id}")        // GET /jobs/5
    public Job findById(@PathVariable int id) { return jobService.findById(id); }

    @PostMapping                // POST /jobs
    public Job create(@RequestBody Job job) { return jobService.save(job); }

    @PutMapping("/{id}")        // PUT /jobs/5
    public Job update(@PathVariable int id, @RequestBody Job job) { return jobService.update(id, job); }

    @DeleteMapping("/{id}")     // DELETE /jobs/5
    public void delete(@PathVariable int id) { jobService.delete(id); }
}`,
  codeTitle: 'One HTTP method annotation per CRUD operation',
  points: [
    'GET is safe (no state change) and idempotent - it can be retried or cached without side effects.',
    'POST creates a new resource and is not idempotent - calling it twice typically creates two resources.',
    'PUT replaces a resource entirely and is idempotent - repeating the same PUT leaves the resource in the same final state.',
    'DELETE removes a resource and is idempotent - deleting an already-deleted resource has no additional effect.',
    'Spring Boot provides one shorthand annotation per method (@GetMapping, @PostMapping, etc.), each equivalent to @RequestMapping with a method attribute.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Using GET for an operation that changes data (a common shortcut when testing quickly) breaks the safe/idempotent contract - browsers, proxies, and crawlers may prefetch or retry GET requests, silently triggering the change multiple times.' },
    { type: 'interview', content: 'Q: Why is POST not considered idempotent, but PUT is?\nA: PUT replaces a resource\'s state at a specific, known URL - sending the same PUT request multiple times results in the same final state. POST typically creates a brand-new resource each time it is called with no client-specified identity, so calling it twice with identical data usually produces two separate resources instead of one.' },
  ],
}
