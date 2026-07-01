export default {
  id: 'model-object',
  title: '369. Model Object',
  explanation: `The **\`Model\`** is Spring MVC's container for the data you want to pass from a **controller to a view**. Instead of the servlet's \`request.setAttribute\`, you declare a \`Model\` parameter and add attributes to it — Spring makes them available to the JSP.

**Using it:** add a \`Model\` argument to your handler; Spring injects it. Call \`addAttribute(key, value)\`:
\`\`\`java
@RequestMapping("/home")
public String home(Model model) {
    model.addAttribute("name", "Navin");
    model.addAttribute("jobs", jobService.findAll());
    return "home";
}
\`\`\`
The JSP then reads \`\${name}\` and loops over \`\${jobs}\`.

**Related types:**
- **\`Model\`** — the common interface; \`addAttribute\` is the main method.
- **\`ModelMap\`** — a \`Map\`-like implementation.
- **\`Map<String,Object>\`** — you can even accept a plain map; Spring treats its entries as model attributes.

**Single vs multiple attributes:** \`addAttribute("k", v)\` adds one; \`addAllAttributes(map)\` adds many. If you add an attribute without a name, Spring derives the name from its type.

**Model vs @ModelAttribute vs ModelAndView:**
- **\`Model\`** — add data, return the view name as a separate \`String\` (most common).
- **\`@ModelAttribute\`** — bind form fields *into* an object, and/or add common data to the model (see [[using-modelattribute]]).
- **\`ModelAndView\`** — bundle the model **and** the view name into one returned object (see [[modelandview]]).

The \`Model\` is **request-scoped** — its attributes live for that single request/response, exactly what a result page needs.`,
  code: `@Controller
public class HomeController {

    @RequestMapping("/home")
    public String home(Model model) {
        model.addAttribute("name", "Navin");
        model.addAttribute("count", 3);
        return "home";      // home.jsp reads \${name} and \${count}
    }
}`,
  codeTitle: 'Passing data with Model',
  points: [
    'Model carries data from the controller to the view, replacing request.setAttribute.',
    'Declare a Model parameter (Spring injects it) and call addAttribute(key, value).',
    'The JSP reads model attributes by the same key using EL (${key}).',
    'addAllAttributes adds many at once; an unnamed attribute is named from its type.',
    'Model attributes are request-scoped — they live for one request/response cycle.',
  ],
  callouts: [
    { type: 'tip', content: 'Prefer Model over the raw HttpServletRequest for passing data to views — it is cleaner, decoupled from the servlet API, and works uniformly across JSP and other view technologies.' },
    { type: 'interview', content: 'Q: What is the scope of data added to the Model?\nA: Request scope — the attributes are available only during the current request and its forwarded view. For data that must survive a redirect, use RedirectAttributes/flash attributes instead.' },
  ],
}
