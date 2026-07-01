export default {
  id: 'pathvariable',
  title: '397. PathVariable',
  explanation: `REST URLs embed a resource's identity directly in the path: \`/jobs/5\` means "the job with id 5" (see [[what-is-rest]]). **\`@PathVariable\`** is how a controller method reads that embedded value.

\`\`\`java
@GetMapping("/{id}")
public Job findById(@PathVariable int id) {
    return jobService.findById(id);
}
\`\`\`

The \`{id}\` in \`@GetMapping("/{id}")\` is a **URI template variable** — a placeholder segment of the path. \`@PathVariable int id\` binds it to the method parameter, converting the string segment to an \`int\` automatically. A request to \`GET /jobs/5\` matches this method with \`id = 5\`.

**Multiple path variables** work the same way, matched by name:
\`\`\`java
@GetMapping("/{jobId}/applicants/{applicantId}")
public Applicant findApplicant(@PathVariable int jobId, @PathVariable int applicantId) {
    return applicantService.find(jobId, applicantId);
}
\`\`\`

**\`@PathVariable\` vs \`@RequestParam\`:** both extract a value from the request, but from different places. \`@PathVariable\` reads from the URL *path* (\`/jobs/5\`) — used for identifying *which* resource. \`@RequestParam\` reads from the query string (\`/jobs?status=open\`) — used for *filtering, sorting, or paging* a collection, not identifying a single resource. Mixing them up produces a URL that doesn't match REST conventions: \`/jobs?id=5\` works technically but \`/jobs/5\` is the idiomatic REST form for "this specific resource."

**Explicit name binding** when the variable name and parameter name differ:
\`\`\`java
@GetMapping("/{jobId}")
public Job findById(@PathVariable("jobId") int id) { ... }
\`\`\``,
  code: `@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @GetMapping("/{id}")
    public Job findById(@PathVariable int id) {
        return jobService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        jobService.delete(id);
    }
}`,
  codeTitle: 'Binding a URL segment with @PathVariable',
  points: [
    '@PathVariable extracts a value from a URI template segment, like {id} in "/jobs/{id}".',
    'Spring automatically converts the path segment string to the parameter\'s declared type (e.g. int).',
    'Multiple {placeholders} in a mapping bind to multiple @PathVariable parameters, matched by name.',
    '@PathVariable identifies which resource is being addressed; @RequestParam filters or configures a query against a collection.',
    'An explicit name, @PathVariable("jobId"), is needed only when the URI template variable name differs from the method parameter name.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Requesting /jobs/abc against a method with @PathVariable int id throws a type conversion error (400 Bad Request) since "abc" cannot convert to an int - path variable types should match what the URL can realistically contain, and callers need to handle the error response.' },
    { type: 'interview', content: 'Q: What is the difference between @PathVariable and @RequestParam, and when would you use each?\nA: @PathVariable extracts a value embedded in the URL path itself (e.g. the 5 in /jobs/5), used to identify a specific resource. @RequestParam extracts a value from the query string (e.g. ?status=open), used for optional filtering, sorting, or pagination parameters on a collection endpoint.' },
  ],
}
