export default {
  id: 'working-with-postman',
  title: '394. Working with Postman',
  explanation: `Before a React frontend exists to test against, or whenever isolating whether a bug is in the backend or the frontend, **Postman** (a standalone API client) is the standard tool for exercising a REST API directly — no browser, no UI, just the raw request and response.

**What Postman lets you set on a request:**
- **Method** — \`GET\`, \`POST\`, \`PUT\`, \`DELETE\`, etc. (see [[http-methods-rest]]).
- **URL** — including path variables, e.g. \`http://localhost:8080/jobs/5\`.
- **Headers** — e.g. \`Content-Type: application/json\` to tell the server the body is JSON.
- **Body** — for \`POST\`/\`PUT\`, the raw JSON payload matching the resource shape (see [[sending-data-and-requestbody]]).

**A typical test session against the Job REST API:**
1. \`GET http://localhost:8080/jobs\` → confirms the endpoint responds and returns the expected JSON array.
2. \`POST http://localhost:8080/jobs\` with body \`{"description": "Java Developer", "profile": "Backend"}\` and header \`Content-Type: application/json\` → confirms creation works and returns the new resource (often with an assigned \`id\`).
3. \`GET http://localhost:8080/jobs/5\` → confirms the created resource can be fetched by id.
4. \`DELETE http://localhost:8080/jobs/5\` → confirms removal, then a repeat \`GET\` on the same id should now return a 404.

**Why test with Postman before wiring up React?** It isolates the backend completely — if Postman gets the right JSON back, any bug afterward is in the frontend's request or rendering, not the API. It also catches configuration mistakes (wrong URL, wrong method, missing \`Content-Type\` header) far faster than debugging through a full UI.`,
  code: `# A Postman request, described as raw HTTP for reference:
POST /jobs HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "description": "Java Developer",
  "url": "https://example.com/careers/java-dev",
  "profile": "Backend"
}

# Expected response: 201 Created (or 200), with the saved Job as JSON`,
  codeTitle: 'A POST request as Postman would send it',
  points: [
    'Postman lets you construct and send arbitrary HTTP requests (method, URL, headers, body) without any frontend or browser involved.',
    'Testing an endpoint with Postman first isolates backend correctness before a frontend is wired up.',
    'A JSON request body for POST/PUT must be paired with a Content-Type: application/json header, or Spring may fail to parse it.',
    'A typical CRUD test cycle: GET the collection, POST a new item, GET it by id, then DELETE it and confirm a subsequent GET 404s.',
    'When a bug appears through the UI, retesting the same call in Postman quickly narrows whether the problem is the API or the frontend.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Sending a POST/PUT body without setting Content-Type: application/json often causes Spring to silently fail to bind the request body to the target object (or throw an unsupported media type error), even though the JSON itself is perfectly well-formed.' },
    { type: 'interview', content: 'Q: Why test an endpoint with Postman before connecting it to a React frontend?\nA: It isolates the backend from the frontend entirely. If Postman receives the correct response, the API is confirmed working, so any issue found afterward through the UI must be in the frontend\'s request construction or rendering - narrowing debugging effort considerably.' },
  ],
}
