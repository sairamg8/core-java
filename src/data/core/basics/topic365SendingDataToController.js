export default {
  id: 'sending-data-to-controller',
  title: '365. Sending data to Controller',
  explanation: `Real apps need the user to **send data** to the server — a login form, a search box, a new job posting. That data travels from the browser to a controller handler as part of the HTTP request.

**Two common ways the browser sends data:**

**1. Query string (GET):** appended to the URL after \`?\` as \`key=value\` pairs joined by \`&\`:
\`\`\`
http://localhost:8080/result?name=Navin&age=30
\`\`\`
Good for search/filter links; visible in the URL, bookmarkable, limited size.

**2. Form body (POST):** the data is placed in the request **body**, not the URL. Use POST for creating/updating and for anything sensitive:
\`\`\`html
<form action="result" method="post">
    <input name="name">
    <input name="age">
    <button>Submit</button>
</form>
\`\`\`
Each input's \`name\` becomes a request **parameter** key.

**Reading it on the server** — several options, covered in the next topics:
- The raw servlet way via \`HttpServletRequest.getParameter\` (see [[accepting-data-the-servlet-way]]).
- The clean Spring way with \`@RequestParam\` (see [[requestparam]]).
- Binding straight into an object with \`@ModelAttribute\` (see [[using-modelattribute]]).

**Key idea:** the input field's \`name\` attribute is the contract. Whatever you call \`name="age"\` in the form is the exact key you read on the server. Mismatched names are the usual reason data arrives as \`null\`.`,
  code: `<!-- A form that POSTs two fields to /result -->
<form action="result" method="post">
    <input type="text" name="name" placeholder="Name">
    <input type="number" name="age" placeholder="Age">
    <button type="submit">Submit</button>
</form>

<!-- A GET link carrying data in the query string -->
<a href="result?name=Navin&age=30">Show Navin</a>`,
  codeTitle: 'Sending data via form (POST) and query string (GET)',
  points: [
    'Users send data to the server as part of the HTTP request.',
    'GET carries data in the URL query string (?key=value&key2=value2) — visible and bookmarkable.',
    'POST carries data in the request body — used for creating/updating and sensitive data.',
    'Each form input name becomes a request parameter key read on the server.',
    'The server reads it via getParameter, @RequestParam, or @ModelAttribute binding.',
  ],
  callouts: [
    { type: 'gotcha', content: 'The form input name must exactly match the parameter name your controller reads. name="age" in the form and getParameter("age") / @RequestParam("age") on the server — a mismatch yields null or a missing-parameter error.' },
    { type: 'tip', content: 'Use GET for idempotent reads (search, filters) and POST for actions that change state (create, update, delete). This keeps browsers, caches, and the back button behaving correctly.' },
    { type: 'interview', content: 'Q: Where does GET data go versus POST data?\nA: GET puts parameters in the URL query string; POST puts them in the request body. POST is preferred for large or sensitive data since it is not shown in the URL or server logs the same way.' },
  ],
}
