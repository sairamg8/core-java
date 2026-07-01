export default {
  id: 'put-and-delete-mapping',
  title: '399. PUT and DELETE Mapping',
  explanation: `The remaining two CRUD operations, wired the same way \`@GetMapping\`/\`@PostMapping\` were (see [[http-methods-rest]]): **\`@PutMapping\`** for full replacement, **\`@DeleteMapping\`** for removal — both identifying the target resource with \`@PathVariable\` (see [[pathvariable]]).

\`\`\`java
@PutMapping("/{id}")
public Job update(@PathVariable int id, @RequestBody Job job) {
    return jobService.update(id, job);
}

@DeleteMapping("/{id}")
public void delete(@PathVariable int id) {
    jobService.delete(id);
}
\`\`\`

**\`update\` needs both pieces:** the \`id\` says *which* job (from the URL), and \`@RequestBody Job job\` carries the *new* full state (from the body, see [[sending-data-and-requestbody]]). A common implementation looks up the existing job by id, copies over the new field values, and saves — or, with JPA (see [[jpa-update-and-delete]]), simply sets the id on the incoming object and calls save, letting the ORM decide insert vs update.

**\`delete\` needs nothing back.** \`void\` return type maps to an empty response body — the client only needs to know the operation succeeded (via the HTTP status code, typically \`200 OK\` or \`204 No Content\`), not any data.

**Idempotency in practice (see [[http-methods-rest]]):** calling \`DELETE /jobs/5\` twice is not an error the second time in a strict REST sense — the resource is gone either way, so the *end state* is identical. Many implementations return \`404\` on the second call since the resource is no longer found, which is also a reasonable, common choice; either way, the important property is that neither call corrupts data or has an unexpected side effect from being repeated.

**Testing both with Postman** (see [[working-with-postman]]): \`PUT\` needs a body and the \`Content-Type\` header just like \`POST\`; \`DELETE\` needs neither — just the correct URL and method.`,
  code: `@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @PutMapping("/{id}")
    public Job update(@PathVariable int id, @RequestBody Job job) {
        return jobService.update(id, job);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        jobService.delete(id);
    }
}`,
  codeTitle: 'Full CRUD: update and delete endpoints',
  points: [
    '@PutMapping combines @PathVariable (which resource) with @RequestBody (its new full state) to implement full replacement.',
    '@DeleteMapping typically needs only @PathVariable to identify the resource to remove; no request body is required.',
    'A void return type on a REST endpoint results in an empty response body, relying on the HTTP status code to convey success.',
    'Both PUT and DELETE are idempotent: repeating either leaves the resource in the same end state as calling it once.',
    'Deleting an already-deleted resource can reasonably return either a success status or 404 - both honor idempotency, since the outcome (resource absent) is unchanged.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A PUT endpoint that only updates fields present in the request body (instead of replacing the entire resource) is actually behaving like PATCH, not PUT - if a client omits a field expecting it to stay unchanged, that mismatch between PUT\'s "full replace" contract and partial-update behavior causes silent data loss.' },
    { type: 'interview', content: 'Q: Is it acceptable for DELETE /jobs/5 to behave differently (e.g. return 404) the second time it is called, given that DELETE is supposed to be idempotent?\nA: Yes - idempotency is about the resulting server state being the same regardless of how many times the request is made, not about the response being identical every time. After the first DELETE, the resource is gone; a second call finding nothing to delete and returning 404 is consistent with that same end state, so idempotency still holds.' },
  ],
}
