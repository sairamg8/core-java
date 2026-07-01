export default {
  id: 'what-is-rest',
  title: '391. What Is REST?',
  explanation: `**REST** (REpresentational State Transfer) is an architectural style for designing web APIs — a set of conventions, not a framework or protocol of its own. A REST API models everything as **resources**, identified by URLs, manipulated with standard **HTTP methods** (see [[http-methods-rest]]).

**Core REST conventions:**
- **Resources are nouns, not verbs.** \`/jobs\` (a collection of jobs) and \`/jobs/5\` (one specific job) — never \`/getJobs\` or \`/deleteJob\`. The *action* comes from the HTTP method, not the URL.
- **HTTP methods map to CRUD actions:** \`GET\` reads, \`POST\` creates, \`PUT\`/\`PATCH\` updates, \`DELETE\` removes. The same URL (\`/jobs/5\`) means different things depending on the method used against it.
- **Statelessness.** Each request carries everything the server needs to process it (auth token, parameters); the server does not remember anything about the client between requests — no server-side session tied to a specific client's flow.
- **Uniform representation.** Resources are typically represented as **JSON**, a text format both browsers and backends parse natively, though REST does not mandate JSON specifically (XML works too, JSON just won).

**REST vs the JSP-based approach from Chapter F:** in the Job app's \`HomeController\`, the URL \`/\` returned a rendered page. In REST, \`GET /jobs\` returns the *data* for jobs — no HTML, no view name, just a JSON array the frontend then renders however it wants. The underlying HTTP request/response cycle is unchanged; only what flows over it, and how the URL is designed, changes.

**Why "stateless" matters for scaling:** since no request depends on server memory of previous ones, any server instance can handle any request — which is exactly what makes REST APIs easy to scale horizontally (multiple identical server instances behind a load balancer, see [[microservices-concepts]]).`,
  code: `GET    /jobs        -> list all jobs
GET    /jobs/5       -> get job with id 5
POST   /jobs         -> create a new job (data in the request body)
PUT    /jobs/5       -> replace job 5 entirely (data in the request body)
DELETE /jobs/5       -> delete job 5

// The URL never changes meaning based on intent - only the HTTP method does`,
  codeTitle: 'REST resource URLs: nouns + HTTP methods',
  points: [
    'REST is an architectural style (a set of conventions), not a specific technology or protocol.',
    'URLs identify resources (nouns, e.g. /jobs/5), not actions - the HTTP method conveys the action.',
    'Standard HTTP methods map to CRUD: GET reads, POST creates, PUT/PATCH updates, DELETE removes.',
    'REST APIs are stateless: each request is self-contained, and the server keeps no per-client session state between requests.',
    'JSON is the de facto standard representation format for REST resources, though REST itself does not require it.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A URL like "/deleteJob/5" or "/getAllJobs" is not RESTful - it bakes the action into the URL as a verb. The RESTful equivalent is DELETE /jobs/5 and GET /jobs, letting the HTTP method carry the verb.' },
    { type: 'interview', content: 'Q: Why is statelessness considered a core principle of REST, and what does it enable?\nA: A stateless API means every request carries all the information the server needs, with no reliance on server-side memory of prior requests from that client. This lets any server instance handle any request interchangeably, which is what makes REST APIs straightforward to scale horizontally behind a load balancer.' },
  ],
}
