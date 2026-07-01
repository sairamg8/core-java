export default {
  id: 'spring-data-rest-introduction',
  title: '433. Spring Data Rest Introduction',
  explanation: `Every REST endpoint written so far in this chapter — \`findAll\`, \`findById\`, create, update, delete (see [[creating-a-rest-controller]], [[jpa-update-and-delete]]) — follows the exact same shape: a \`@RestController\` method calls a \`JpaRepository\` method and wraps the result in a \`ResponseEntity\`. **Spring Data REST** notices that this boilerplate is almost entirely mechanical and removes it: given a \`JpaRepository\` interface and an \`@Entity\`, it exposes a full set of REST endpoints automatically, with zero controller code.

**What gets generated for free**, for an entity like \`Job\` with \`JobRepository extends JpaRepository<Job, Integer>\`:
- \`GET /jobs\` — paginated list of all jobs
- \`GET /jobs/{id}\` — a single job
- \`POST /jobs\` — create a job
- \`PUT /jobs/{id}\` and \`PATCH /jobs/{id}\` — update a job
- \`DELETE /jobs/{id}\` — delete a job

No \`@RequestMapping\`, no \`@GetMapping\`, no service call — the repository interface alone is enough.

**The catch: it is not the same JSON shape as a hand-written controller.** Spring Data REST responses follow **HAL** (Hypertext Application Language) — every resource is wrapped with a \`_links\` section containing hypermedia links (self, related resources, pagination), and collections are wrapped in \`_embedded\`. This is deliberate: HAL is what makes the API **HATEOAS**-compliant (Hypermedia As The Engine Of Application State) — a client is meant to navigate the API by following the \`_links\` it receives, rather than hardcoding URL paths.

**Where this fits, and where it does not:** Spring Data REST is a fast way to stand up a working CRUD API directly on top of the repositories already built in this chapter (see [[spring-data-jpa-introduction]]) — genuinely useful for admin tools, internal services, or a backend that a frontend team hasn't started consuming opinions about yet. It is a poor fit once business logic needs to live between the HTTP request and the database write (validation beyond bean validation, authorization checks per field, side effects like sending an email on create) — at that point, a hand-written \`@RestController\` calling a service layer, as built earlier in this chapter, is the better tool. Most real projects use Spring Data REST for a handful of simple, low-logic entities and hand-written controllers for everything else, rather than picking one approach for the whole API.`,
  code: `// A JpaRepository interface is the entire implementation
public interface JobRepository extends JpaRepository<Job, Integer> {
}

// No @RestController needed - Spring Data REST scans this
// repository and exposes it as a full REST API automatically.`,
  codeTitle: 'The whole "controller" for a Spring Data REST resource',
  points: [
    'Spring Data REST turns a JpaRepository interface directly into a REST API - no controller class required.',
    'GET, POST, PUT, PATCH, and DELETE on /{entity} and /{entity}/{id} are generated automatically from the repository and entity alone.',
    'Responses follow the HAL format: resources carry a _links section, collections are wrapped in _embedded - this is not the same shape as a hand-written controller\'s plain JSON.',
    'HAL exists to support HATEOAS - clients are meant to navigate via the links returned in each response rather than hardcoding every URL.',
    'It fits low-logic CRUD entities well; once real business logic needs to sit between the request and the database, a hand-written controller and service layer is the better fit.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A frontend built to expect plain flat JSON (as produced by the hand-written JobRestController earlier in this chapter) will break against a Spring Data REST endpoint, since every field gets wrapped in _embedded/_links - the two are not drop-in replacements for each other.' },
    { type: 'interview', content: 'Q: What does Spring Data REST actually generate, and what does HAL have to do with it?\nA: Given a JpaRepository interface and its entity, Spring Data REST exposes full CRUD REST endpoints with no controller code. The responses use HAL, wrapping each resource with hypermedia _links and collections with _embedded, so the API is HATEOAS-compliant and a client can navigate it by following links rather than hardcoding paths.' },
  ],
}
