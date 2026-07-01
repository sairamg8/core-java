export default {
  id: 'understanding-react-ui',
  title: '393. Understanding the React UI',
  explanation: `This chapter's REST API is paired with a **React** frontend that already exists as a separate project — the Spring Boot side only needs to serve data in the shape the React components expect. Understanding the frontend's shape (without needing to write React) makes it far easier to design the right endpoints.

**What React needs from the backend, conceptually:**
- A **list view** (e.g. showing all jobs) needs a \`GET\` endpoint returning an array of objects — one object per row.
- A **detail or edit view** needs a \`GET\` endpoint for a single item, addressed by id (see [[pathvariable]]).
- A **form submission** (add/update) needs a \`POST\`/\`PUT\` endpoint accepting a JSON body matching the form's fields (see [[sending-data-and-requestbody]]).
- Every response needs to be **JSON**, since that's what a JavaScript \`fetch()\` call parses natively — this is why \`@RestController\` (not \`@Controller\`) is used for the whole chapter.

**The shape of a typical response the React list component expects:**
\`\`\`json
[
  { "id": 1, "description": "Java Developer", "url": "https://...", "profile": "Backend" },
  { "id": 2, "description": "React Developer", "url": "https://...", "profile": "Frontend" }
]
\`\`\`
This is exactly the \`List<Job>\` from \`JobService\` (see [[job-app-working-with-layers]]), serialized automatically by Spring's default JSON converter (Jackson) — no manual JSON-building code is needed; returning a Java object or list from a \`@RestController\` method is enough.

**Two processes, one browser session:** during development the React dev server (typically \`localhost:3000\`) and the Spring Boot server (\`localhost:8080\`) run side by side. The browser loads the UI from React's server, and the UI's JavaScript makes HTTP calls *to* the Spring Boot server for data — which is exactly why CORS configuration becomes necessary (covered when connecting the two, see [[connecting-react-and-spring]]).`,
  code: `// React's fetch call, from the frontend's perspective
fetch('http://localhost:8080/jobs')
  .then(response => response.json())
  .then(jobs => setJobs(jobs));   // jobs is now the array below

// What the Spring Boot endpoint needs to return
[
  { "id": 1, "description": "Java Developer", "profile": "Backend" },
  { "id": 2, "description": "React Developer", "profile": "Frontend" }
]`,
  codeTitle: 'What the React side expects from GET /jobs',
  points: [
    'The backend\'s job is to return data shaped exactly the way the React components expect - usually a JSON array for list views, a single JSON object for detail views.',
    '@RestController automatically serializes returned Java objects/lists to JSON via Jackson - no manual JSON string building required.',
    'React and Spring Boot typically run as two separate processes on separate ports during development.',
    'A form in React (add/edit) needs a matching POST/PUT endpoint that accepts a JSON body shaped like that form\'s fields.',
    'Running frontend and backend on different origins (ports) is exactly why CORS configuration becomes necessary once they are connected.',
  ],
  callouts: [
    { type: 'tip', content: 'When designing a new endpoint, work backwards from the UI: sketch what JSON shape the screen needs first, then write the @RestController method that returns exactly that shape - it keeps endpoints focused on real needs instead of over-designing the response format.' },
    { type: 'interview', content: 'Q: How does a Java List<Job> returned from a @RestController method end up as a JSON array in the browser?\nA: Spring Boot auto-configures Jackson as the default HTTP message converter. When a @RestController method returns an object, Jackson serializes it to JSON automatically based on the object\'s getters, and Spring writes that JSON directly into the HTTP response body - no manual conversion code is needed.' },
  ],
}
