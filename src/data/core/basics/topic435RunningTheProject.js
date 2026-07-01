export default {
  id: 'spring-data-rest-running-the-project',
  title: '435. Running the Project',
  explanation: `With \`spring-boot-starter-data-rest\` added and \`JobRepository\` in place (see [[creating-a-spring-data-rest-project]]), starting the app is enough to get a working API — nothing needs to be triggered manually.

**Discovering the API — start at the root.** \`GET http://localhost:8080/\` returns a HAL document listing every exposed repository as a link:
\`\`\`json
{
  "_links": {
    "jobs": { "href": "http://localhost:8080/jobs{?page,size,sort}", "templated": true }
  }
}
\`\`\`
This root endpoint is itself the starting point for HATEOAS navigation (see [[spring-data-rest-introduction]]) — a client is meant to fetch \`/\` first and follow the \`jobs\` link, rather than hardcoding \`/jobs\`.

**Listing resources.** \`GET /jobs\` returns:
\`\`\`json
{
  "_embedded": {
    "jobs": [
      { "title": "Backend Engineer", "description": "...",
        "_links": { "self": { "href": "http://localhost:8080/jobs/1" } } }
    ]
  },
  "_links": {
    "self": { "href": "http://localhost:8080/jobs" },
    "profile": { "href": "http://localhost:8080/profile/jobs" }
  },
  "page": { "size": 20, "totalElements": 1, "totalPages": 1, "number": 0 }
}
\`\`\`
Two things stand out compared to the hand-written \`JobRestController\` from earlier (see [[creating-a-rest-controller]]): the list lives under \`_embedded.jobs\`, not as a bare JSON array, and pagination metadata (\`page\`) is included automatically — even without writing a \`Pageable\` parameter anywhere.

**Fetching, creating, and inspecting one resource.** \`GET /jobs/1\` returns the single job with its own \`_links.self\`. \`POST /jobs\` with a plain JSON body (\`{"title": "...", "description": "..."}\`) creates a new job and responds \`201 Created\` with a \`Location\` header pointing at the new resource's URL — the client does not need to construct that URL itself.

**Where to look when something seems missing:** the \`profile\` link on every collection (\`/profile/jobs\`) exposes the entity's metadata — field names, types, and which fields are required — useful for confirming what Spring Data REST thinks the entity looks like without reading the Java source.`,
  code: `# Discover the API root
curl http://localhost:8080/

# List all jobs (paginated, HAL-wrapped)
curl http://localhost:8080/jobs

# Fetch a single job
curl http://localhost:8080/jobs/1

# Create a job
curl -X POST http://localhost:8080/jobs \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Backend Engineer", "description": "Spring Boot role"}'`,
  codeTitle: 'Exploring a running Spring Data REST API with curl',
  points: [
    'Starting the app is the entire setup - GET / immediately returns a HAL document linking every exposed repository.',
    'GET /jobs wraps the list under _embedded.jobs rather than returning a bare array, and includes pagination metadata automatically.',
    'POST /jobs responds 201 Created with a Location header pointing at the new resource, so the client never has to build that URL by hand.',
    'Every resource and collection carries a self link plus, for collections, a profile link exposing the entity\'s field metadata.',
    'The intended client pattern is to fetch the root first and follow links, rather than hardcoding paths like /jobs directly.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Testing a Spring Data REST endpoint with a tool or frontend that expects a bare JSON array (as the hand-written JobRestController returned) will fail silently or throw a parsing error, since the real payload is nested under _embedded - always check the actual response shape first with curl or Postman rather than assuming.' },
    { type: 'interview', content: 'Q: If GET /jobs is called on a fresh Spring Data REST project with no controller code written, what response is returned, and why does it look different from a typical @RestController response?\nA: It returns a HAL document with the job list nested under _embedded.jobs, plus _links (self, profile) and page metadata for pagination - all generated automatically from the repository and entity. It looks different from a plain @RestController JSON array because Spring Data REST follows the HAL/HATEOAS convention rather than returning flat JSON.' },
  ],
}
