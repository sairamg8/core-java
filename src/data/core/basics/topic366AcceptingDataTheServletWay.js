export default {
  id: 'accepting-data-the-servlet-way',
  title: '366. Accepting Data the Servlet Way',
  explanation: `Before using Spring's conveniences, it helps to see how request data is read the **raw servlet way** — because Spring MVC is built on top of it. A controller handler can still ask Spring for the underlying **\`HttpServletRequest\`** and pull parameters directly.

**The core method** is \`request.getParameter("key")\`, which returns the value as a \`String\` (or \`null\` if absent):
\`\`\`java
@RequestMapping("/result")
public String result(HttpServletRequest request) {
    String name = request.getParameter("name");
    int age = Integer.parseInt(request.getParameter("age"));
    ...
}
\`\`\`

**Related methods:**
- \`getParameter(name)\` — one value as a String.
- \`getParameterValues(name)\` — a \`String[]\` for multi-valued fields (checkboxes).
- \`getParameterMap()\` — all parameters as a \`Map<String, String[]>\`.

**Passing data to the view the servlet way** — put attributes on the request and forward:
\`\`\`java
request.setAttribute("name", name);
\`\`\`
The JSP then reads \`\${name}\` from request scope.

**Why this is the "hard way":**
- Everything comes back as \`String\` — you must **manually parse** \`age\` to \`int\`, handle \`null\`, and catch \`NumberFormatException\`.
- It couples your controller to the servlet API.

Spring's \`@RequestParam\` (see [[requestparam]]) removes all this boilerplate — it reads the parameter, converts the type, and can enforce required/default values for you. Learn the servlet way once to understand the plumbing, then use \`@RequestParam\` in real code.`,
  code: `@Controller
public class ResultController {

    @RequestMapping("/result")
    public String result(HttpServletRequest request) {
        String name = request.getParameter("name");
        String ageStr = request.getParameter("age");
        int age = (ageStr != null) ? Integer.parseInt(ageStr) : 0;

        request.setAttribute("name", name);
        request.setAttribute("age", age);
        return "result";   // forwards to result.jsp
    }
}`,
  codeTitle: 'Reading parameters via HttpServletRequest',
  points: [
    'A handler can accept HttpServletRequest and read data the raw servlet way.',
    'request.getParameter("key") returns the value as a String, or null if missing.',
    'getParameterValues returns a String[] for multi-valued fields; getParameterMap returns them all.',
    'request.setAttribute(...) passes data to the JSP, which reads it via EL from request scope.',
    'Everything is a String — you must manually parse types and handle null.',
  ],
  callouts: [
    { type: 'gotcha', content: 'getParameter always returns String or null. Calling Integer.parseInt on a null or non-numeric value throws NumberFormatException — guard against missing/blank parameters before parsing.' },
    { type: 'tip', content: 'Use this approach only to understand the mechanics. In real Spring code prefer @RequestParam or @ModelAttribute, which handle type conversion, defaults, and required checks for you.' },
    { type: 'interview', content: 'Q: What type does HttpServletRequest.getParameter return and why does that matter?\nA: Always String (or null). It matters because you must convert to the target type yourself and handle nulls — exactly the boilerplate @RequestParam eliminates.' },
  ],
}
