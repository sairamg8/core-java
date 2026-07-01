export default {
  id: 'spring-data-rest-update-and-delete',
  title: '436. Update and Delete Operations',
  explanation: `Spring Data REST also generates \`PUT\`, \`PATCH\`, and \`DELETE\` on \`/jobs/{id}\` for free (see [[spring-data-rest-running-the-project]]), but \`PUT\` behaves differently here than the hand-written \`updateJob\` written earlier in this chapter (see [[jpa-update-and-delete]]) — that difference is the one gotcha worth understanding precisely before relying on it.

**\`PUT /jobs/{id}\` replaces the whole resource.** Per HTTP semantics, \`PUT\` means "this is the complete new representation" — any field left out of the request body is treated as absent, not "leave unchanged." Sending \`PUT /jobs/1\` with only \`{"title": "New Title"}\` will **null out** \`description\` and every other field not included in the body. This surprises developers coming from the earlier hand-written \`updateJob\`, which only ever set fields explicitly passed by the caller in Java code.

**\`PATCH /jobs/{id}\` does a partial update — this is usually what "update a field" actually means.** Sending \`PATCH /jobs/1\` with \`{"title": "New Title"}\` updates only \`title\` and leaves every other field untouched. For "update this one field" use cases, \`PATCH\` is the correct verb, not \`PUT\`.

\`\`\`
PUT    /jobs/1   { "title": "X" }   -> description (and all other fields) become null
PATCH  /jobs/1   { "title": "X" }   -> description (and all other fields) unchanged
\`\`\`

**\`DELETE /jobs/{id}\`** removes the resource and responds \`204 No Content\` — same behavior as the hand-written \`deleteJob\` (see [[jpa-update-and-delete]]), just without any controller code.

**Restricting which operations are exposed.** Not every entity should allow every verb through Spring Data REST — a lookup-only entity should not be deletable via a bare HTTP call. \`@RepositoryRestResource\` can disable specific operations on an exported repository:
\`\`\`java
@RepositoryRestResource(exported = false)
public interface JobRepository extends JpaRepository<Job, Integer> {
}
\`\`\`
\`exported = false\` removes the repository from the REST API entirely, while individual methods can be excluded with \`@RestResource(exported = false)\` on the method itself — useful when only some operations (say, delete) should never be reachable over HTTP, while list/create/update remain available.`,
  code: `// PUT replaces the entire resource - missing fields become null
// PUT /jobs/1  { "title": "New Title" }
//   -> description is set to null

// PATCH updates only the fields provided
// PATCH /jobs/1  { "title": "New Title" }
//   -> description is left unchanged

// Restricting exposure on the repository
@RepositoryRestResource(exported = false)
public interface JobRepository extends JpaRepository<Job, Integer> {
}

// Or restrict just one operation, e.g. disable delete only
public interface JobRepository extends JpaRepository<Job, Integer> {
    @Override
    @RestResource(exported = false)
    void deleteById(Integer id);
}`,
  codeTitle: 'PUT vs PATCH semantics, and restricting exposed operations',
  points: [
    'PUT /jobs/{id} replaces the entire resource - any field omitted from the request body is nulled out, per standard HTTP PUT semantics.',
    'PATCH /jobs/{id} performs a true partial update - only the fields present in the request body are changed, everything else is left as-is.',
    'DELETE /jobs/{id} behaves the same as the hand-written deleteJob from earlier in this chapter, just generated automatically.',
    '@RepositoryRestResource(exported = false) removes an entire repository from the REST API.',
    '@RestResource(exported = false) on a single overridden method disables just that operation while leaving the rest of the repository exposed.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Using PUT to update just one field, out of habit from a hand-written controller that only updates fields explicitly passed in, will silently null out every other field on the entity - this is the single most common Spring Data REST mistake. Use PATCH for partial updates.' },
    { type: 'interview', content: 'Q: A client sends PUT /jobs/1 with only {"title": "New Title"} to a Spring Data REST endpoint. What happens to the description field, and why?\nA: description gets set to null. PUT is defined by HTTP semantics as replacing the entire resource with the given representation, so any field the client omits is treated as absent, not "leave unchanged." PATCH is the correct verb for a true partial update, since it only touches the fields present in the request body.' },
  ],
}
