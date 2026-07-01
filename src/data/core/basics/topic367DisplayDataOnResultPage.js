export default {
  id: 'display-data-on-result-page',
  title: '367. Display Data on Result Page',
  explanation: `After a controller reads the submitted data, it usually needs to **show a result page** that echoes or processes that data — for example, "Welcome, Navin, age 30". The pattern is: controller puts values where the view can see them, then returns the view name.

**Getting data to the view** — the clean Spring way is the **\`Model\`** (see [[model-object]]). Add attributes and return the view name:
\`\`\`java
@RequestMapping("/result")
public String result(HttpServletRequest req, Model model) {
    String name = req.getParameter("name");
    model.addAttribute("name", name);
    return "result";   // -> result.jsp
}
\`\`\`

**Reading it in the JSP** with EL — the key you used in \`addAttribute\` is the key you read:
\`\`\`jsp
<h1>Welcome, \${name}</h1>
<p>Your age is \${age}</p>
\`\`\`

**The full round trip:**
1. User submits the form (see [[sending-data-to-controller]]).
2. Controller reads parameters and adds them to the model.
3. Controller returns the logical view name \`result\`.
4. The view resolver locates \`result.jsp\` (see [[setting-prefix-and-suffix]]).
5. The JSP renders, substituting \`\${name}\` etc. with the model values.
6. The finished HTML goes back to the browser.

**Attribute name = EL name.** Whatever string you pass to \`addAttribute("name", ...)\` is exactly what the JSP reads as \`\${name}\`. Keep them identical or the page shows blanks.`,
  code: `// Controller side
@RequestMapping("/result")
public String result(HttpServletRequest req, Model model) {
    model.addAttribute("name", req.getParameter("name"));
    model.addAttribute("age", req.getParameter("age"));
    return "result";
}

/* result.jsp
<html><body>
    <h1>Welcome, \${name}</h1>
    <p>Age: \${age}</p>
</body></html>
*/`,
  codeTitle: 'Controller adds to model, JSP displays it',
  points: [
    'To show a result, the controller places values in the model, then returns the view name.',
    'model.addAttribute("key", value) exposes data to the view.',
    'The JSP reads those values with EL: ${key}.',
    'The attribute key in addAttribute must match the EL name in the JSP exactly.',
    'Flow: submit -> controller reads params + fills model -> view name -> resolver finds JSP -> JSP renders.',
  ],
  callouts: [
    { type: 'gotcha', content: 'If the result page shows blank where data should be, the usual cause is a name mismatch: addAttribute("name", ...) but the JSP reads ${username}. The keys must be identical.' },
    { type: 'tip', content: 'Escape or sanitize user-supplied values before displaying them to avoid XSS. JSTL <c:out value="${name}"/> HTML-escapes output, unlike a bare ${name}.' },
    { type: 'interview', content: 'Q: How does a value added with model.addAttribute reach a JSP?\nA: Spring exposes model attributes as request-scoped attributes; the JSP reads them with EL (${key}) by the same name used in addAttribute.' },
  ],
}
