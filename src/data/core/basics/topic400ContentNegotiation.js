export default {
  id: 'content-negotiation',
  title: '400. Content Negotiation',
  explanation: `A REST resource's *data* is one thing; the *format* it's serialized into is another. **Content negotiation** is how the client and server agree on that format — JSON, XML, or something else — for a given request.

**The client asks via the \`Accept\` header:**
\`\`\`
GET /jobs/5 HTTP/1.1
Accept: application/json
\`\`\`
This tells the server "send me JSON if you can." Spring Boot inspects the \`Accept\` header, finds a registered \`HttpMessageConverter\` that can produce that format (Jackson for JSON, out of the box), and uses it to serialize the response.

**Why this matters even though this course only uses JSON:** most of the time, \`Accept: application/json\` is the default a browser or \`fetch()\` sends anyway, so content negotiation is invisible — it "just works" without any explicit configuration. But understanding it explains real behavior that otherwise looks mysterious:
- A request with \`Accept: application/xml\` against an endpoint that only has a JSON converter returns **406 Not Acceptable** — the server genuinely cannot satisfy what was asked for.
- Adding XML support (e.g. \`jackson-dataformat-xml\` on the classpath) lets the *same* endpoint, with the *same* code, return XML instead of JSON purely based on what the client requests — no \`if\` statement needed in the controller.

**The request body's format is a separate negotiation**, via \`Content-Type\` (see [[sending-data-and-requestbody]]) — \`Accept\` says what the client wants *back*, \`Content-Type\` says what format the client is *sending*. A request can send JSON (\`Content-Type: application/json\`) and ask for XML back (\`Accept: application/xml\`) — the two are independent.

**Postman makes both explicit** (see [[working-with-postman]]): the request's \`Content-Type\` header describes the body being sent; adding an \`Accept\` header lets you directly observe negotiation by requesting a format and checking whether the server honors it or returns 406.`,
  code: `# Client asks for JSON explicitly
GET /jobs/5 HTTP/1.1
Accept: application/json
-> 200 OK, body is JSON

# Client asks for a format with no registered converter
GET /jobs/5 HTTP/1.1
Accept: application/xml
-> 406 Not Acceptable   (if no XML converter is on the classpath)`,
  codeTitle: 'Content negotiation via the Accept header',
  points: [
    'Content negotiation is how client and server agree on a response format, driven by the Accept request header.',
    'Spring Boot picks a registered HttpMessageConverter matching the Accept header; Jackson (JSON) is included by default.',
    'A request asking for a format with no matching converter available gets a 406 Not Acceptable response.',
    'Accept (response format desired) and Content-Type (request body format sent) are independent, negotiated separately.',
    'Adding a new format (e.g. XML support) can let existing endpoints serve it automatically, with no controller code changes.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A 406 error is easy to misdiagnose as a broken endpoint or bad data, when the actual cause is simply an Accept header requesting a format the server has no converter for - always check the Accept header first when an otherwise-correct request returns 406.' },
    { type: 'interview', content: 'Q: What is the difference between the Accept and Content-Type headers in an HTTP request?\nA: Content-Type describes the format of the data being sent in the request body (what the client is providing). Accept describes the format the client wants the response to be in (what the client is requesting back). They are negotiated independently - a client can send JSON and ask for XML in return, or any other combination the server supports.' },
  ],
}
