export default {
  id: 'using-modelattribute',
  title: '373. Using ModelAttribute',
  explanation: `\`@ModelAttribute\` (see [[need-for-modelattribute]]) has two distinct uses in a controller: on a **method parameter**, to bind incoming form data to an object; and on a **method itself**, to pre-populate the model with data before every request handler in that controller runs.

**1. On a parameter — binds request data to a command object:**
\`\`\`java
@RequestMapping(value = "/addJob", method = RequestMethod.POST)
public String addJob(@ModelAttribute Job job) {
    jobService.addJob(job);
    return "redirect:/";
}
\`\`\`
Spring creates a \`Job\` with its no-arg constructor, then calls the matching setter for each request parameter whose name matches a property. The fully populated object is also added to the model under the name \`"job"\` (the class name, lower-cased) unless a different name is given: \`@ModelAttribute("newJob") Job job\`.

**2. On a method — pre-populates the model for every handler:**
\`\`\`java
@ModelAttribute
public void addCommonAttributes(Model model) {
    model.addAttribute("todaysDate", new Date());
}
\`\`\`
This method runs *before* every \`@RequestMapping\` method in the same controller, so \`todaysDate\` ends up in the model for every view that controller renders — handy for data every page in a section needs (a header, a count, a today's-date banner).

**Binding gotchas:**
- The object must have a public no-arg constructor.
- Nested objects work too — a form field named \`address.city\` binds to \`job.getAddress().setCity(...)\`.
- Combine with \`@Valid\` to run Bean Validation on the bound object before the handler body runs.`,
  code: `@Controller
public class AddJobController {

    @Autowired
    private JobService jobService;

    // Parameter-level: bind the submitted form to a Job
    @RequestMapping(value = "/addJob", method = RequestMethod.POST)
    public String addJob(@ModelAttribute Job job) {
        jobService.addJob(job);
        return "redirect:/";
    }

    // Method-level: runs before every handler in this controller
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("appName", "Job Application Tracker");
    }
}`,
  codeTitle: 'Parameter-level vs method-level @ModelAttribute',
  points: [
    'Parameter-level @ModelAttribute binds request parameters onto a command object using setter matching.',
    'The bound object is auto-added to the model under a name derived from the class (lower-camel-case), or a name given explicitly.',
    'Method-level @ModelAttribute (no return type consumed as a view) runs before every handler in the controller and adds shared model data.',
    'Binding requires a no-arg constructor and standard getter/setter pairs on the target class.',
    'Nested properties (e.g. "address.city") bind through dotted request parameter names.',
    'Pair with @Valid to trigger Bean Validation on the bound object automatically.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A method-level @ModelAttribute method runs for every request handler in the controller, even ones unrelated to the data it adds. Keep it cheap - it executes on every hit.' },
    { type: 'interview', content: 'Q: What is the difference between using @ModelAttribute on a parameter versus on a method?\nA: On a parameter, it binds incoming request data to a command object. On a method, it pre-populates the model with data before any handler method in that controller executes.' },
  ],
}
