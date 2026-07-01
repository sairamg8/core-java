export default {
  id: 'creating-a-rest-controller',
  title: '395. Creating a REST Controller',
  explanation: `A **\`@RestController\`** looks almost identical to the \`@Controller\` classes from Chapter F, with one crucial difference: there is no view resolution step. Every method's return value is serialized directly into the HTTP response body.

\`\`\`java
@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> findAll() {
        return jobService.findAll();
    }
}
\`\`\`

**\`@RestController\` is actually shorthand** for two annotations combined: \`@Controller\` + \`@ResponseBody\`. \`@ResponseBody\` is what tells Spring "don't treat this return value as a view name — write it straight into the response." Without it (plain \`@Controller\`), returning a \`List<Job>\` from a method would make Spring try to resolve \`"[Job{...}, Job{...}]"\` as a *view name* and fail, since there's no such JSP.

**\`@RequestMapping("/jobs")\` at the class level** sets a shared URL prefix for every method in the controller — combined with each method's own mapping (e.g. \`@GetMapping("/{id}")\`), the full path becomes \`/jobs/{id}\`. This keeps a controller focused on one resource type and avoids repeating the prefix on every method.

**No \`Model\` parameter needed here.** Chapter F's controllers took a \`Model\` to pass data to a JSP. A REST controller has no view to pass data to — the return value *is* the entire response, so there's nothing to populate separately.`,
  code: `@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> findAll() {
        return jobService.findAll();
    }

    @GetMapping("/{id}")
    public Job findById(@PathVariable int id) {
        return jobService.findById(id);
    }
}`,
  codeTitle: 'A minimal @RestController for the Job resource',
  points: [
    '@RestController is shorthand for @Controller + @ResponseBody, meaning every method\'s return value is written directly to the response body.',
    'Without @ResponseBody, a plain @Controller would try to resolve a returned object as a view name and fail.',
    'A class-level @RequestMapping sets a shared URL prefix, combined with each method\'s own mapping to form the full path.',
    'REST controller methods have no Model parameter, since there is no view to populate - the return value is the entire response.',
    'The controller still delegates all business logic to the service layer (JobService), keeping the same layering established in Chapter F.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Mixing @Controller and manually adding @ResponseBody to only some methods in a class is legal but confusing - if a REST-style class needs some methods to return views and others to return raw data, prefer being explicit with @ResponseBody per method rather than assuming @RestController\'s blanket behavior.' },
    { type: 'interview', content: 'Q: What exactly does @RestController add on top of @Controller?\nA: @RestController is a convenience annotation that combines @Controller with @ResponseBody. @ResponseBody tells Spring to write a method\'s return value directly into the HTTP response body (serialized, typically to JSON) rather than treating it as a logical view name to resolve.' },
  ],
}
