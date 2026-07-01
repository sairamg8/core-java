export default {
  id: 'sending-data-and-requestbody',
  title: '398. Sending Data and RequestBody',
  explanation: `Creating or updating a resource means the client sends structured data — a whole \`Job\` object — not a handful of individual parameters. **\`@RequestBody\`** is how a controller method receives that: it reads the entire HTTP request body (typically JSON) and deserializes it into a Java object in one step.

\`\`\`java
@PostMapping
public Job create(@RequestBody Job job) {
    return jobService.save(job);
}
\`\`\`

A request like:
\`\`\`json
POST /jobs
Content-Type: application/json

{ "description": "Java Developer", "url": "https://...", "profile": "Backend" }
\`\`\`
arrives as a fully-populated \`Job job\` parameter — Spring uses **Jackson** (the same library that serializes responses, see [[understanding-react-ui]]) in reverse: JSON text in, Java object out.

**\`@RequestBody\` vs \`@ModelAttribute\` (see [[using-modelattribute]]):** both bind incoming data to an object, but from different sources and formats. \`@ModelAttribute\` reads traditional form-encoded data (\`application/x-www-form-urlencoded\`, the format an HTML \`<form>\` submits) field by field. \`@RequestBody\` reads a single structured payload (usually JSON) and parses the whole thing as one document. REST APIs consumed by JavaScript clients almost always use \`@RequestBody\`, since \`fetch()\`/\`axios\` send JSON, not form-encoded data.

**Combining with \`@PathVariable\` for updates:**
\`\`\`java
@PutMapping("/{id}")
public Job update(@PathVariable int id, @RequestBody Job job) {
    return jobService.update(id, job);
}
\`\`\`
Here \`id\` (identity) comes from the URL, and the new data comes from the body — a common and idiomatic combination for \`PUT\`/\`PATCH\` endpoints.`,
  code: `@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @PostMapping
    public Job create(@RequestBody Job job) {
        return jobService.save(job);
    }

    @PutMapping("/{id}")
    public Job update(@PathVariable int id, @RequestBody Job job) {
        return jobService.update(id, job);
    }
}`,
  codeTitle: '@RequestBody deserializes JSON into a Java object',
  points: [
    '@RequestBody reads the entire HTTP request body and deserializes it (via Jackson) into a Java object in one step.',
    'It is the REST-API equivalent of @ModelAttribute, but for structured JSON payloads instead of form-encoded fields.',
    'JavaScript clients (fetch, axios) send JSON bodies, which is why REST controllers consumed by React use @RequestBody, not @ModelAttribute.',
    'Combining @PathVariable (identity, from the URL) with @RequestBody (new data, from the body) is the standard shape for PUT/PATCH update endpoints.',
    'The request needs a Content-Type: application/json header for Spring to correctly select the JSON message converter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A field present in the incoming JSON but absent from the Job class (or misspelled) is silently ignored by default rather than causing an error - useful for forward compatibility, but it can hide a typo in a client\'s request body during debugging.' },
    { type: 'interview', content: 'Q: Why does a REST API consumed by a React frontend use @RequestBody instead of @ModelAttribute for create/update endpoints?\nA: @ModelAttribute expects traditional form-encoded data, matching how an HTML <form> submits. A React app using fetch or axios sends a JSON payload instead, so @RequestBody is needed to deserialize that single JSON document into a Java object via Jackson.' },
  ],
}
