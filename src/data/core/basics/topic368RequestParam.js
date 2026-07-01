export default {
  id: 'requestparam',
  title: '368. RequestParam',
  explanation: `**\`@RequestParam\`** is Spring's clean way to read request parameters — it replaces the manual \`request.getParameter\` boilerplate (see [[accepting-data-the-servlet-way]]). You declare a method parameter, annotate it, and Spring reads the value **and converts the type** for you.

**Basic use:**
\`\`\`java
@RequestMapping("/result")
public String result(@RequestParam("name") String name,
                     @RequestParam("age") int age) {
    ...
}
\`\`\`
Spring finds the \`age\` parameter, converts \`"30"\` to \`int\` automatically — no \`Integer.parseInt\`, no null-check needed for the common case.

**Handy attributes:**
- **Name inference:** if the parameter name matches the method argument name, you can omit the value: \`@RequestParam String name\`.
- **\`required\`:** by default a \`@RequestParam\` is **required** — a missing parameter causes a 400 error. Set \`required = false\` to allow it to be absent (then the value is \`null\`).
- **\`defaultValue\`:** supply a fallback used when the parameter is missing (this also implies \`required = false\`):
\`\`\`java
@RequestParam(name = "page", defaultValue = "1") int page
\`\`\`

**Type conversion** works for primitives, wrappers, enums, and even \`List\`/arrays for multi-valued params:
\`\`\`java
@RequestParam List<String> hobbies   // ?hobbies=a&hobbies=b
\`\`\`

Use \`@RequestParam\` for a **handful of individual fields**. When a form maps neatly onto an object with many fields, prefer \`@ModelAttribute\` (see [[using-modelattribute]]) which binds them all at once.`,
  code: `@Controller
public class ResultController {

    @RequestMapping("/result")
    public String result(
            @RequestParam("name") String name,
            @RequestParam(name = "age", defaultValue = "0") int age,
            @RequestParam(name = "city", required = false) String city,
            Model model) {

        model.addAttribute("name", name);
        model.addAttribute("age", age);
        return "result";
    }
}`,
  codeTitle: '@RequestParam with defaults and optional values',
  points: [
    '@RequestParam reads a request parameter and converts it to the declared type automatically.',
    'Omit the name when the parameter matches the argument name: @RequestParam String name.',
    'Parameters are required by default; a missing one causes a 400 Bad Request.',
    'required=false allows absence (value becomes null); defaultValue supplies a fallback.',
    'It converts primitives, wrappers, enums, and List/array for multi-valued params.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A @RequestParam is required by default. If the client might omit it, set required=false or a defaultValue — otherwise the request fails with 400 Bad Request instead of passing null.' },
    { type: 'tip', content: 'Use @RequestParam for a few loose fields; switch to @ModelAttribute when a form maps to an object with many properties so Spring binds them in one shot.' },
    { type: 'interview', content: 'Q: What is the difference between @RequestParam and @PathVariable?\nA: @RequestParam reads query-string or form parameters (?id=5); @PathVariable reads a value embedded in the URL path itself (/user/5). Both convert types automatically.' },
  ],
}
