export default {
  id: 'need-for-modelattribute',
  title: '372. Need for ModelAttribute',
  explanation: `So far, form data has been read one field at a time with **\`@RequestParam\`** (see [[requestparam]]): \`@RequestParam String name, @RequestParam int age\`. That works for a field or two, but a real form — a \`Job\` with a description, a URL, a profile, a company — has many fields. Reading each with its own \`@RequestParam\` and manually building the object is repetitive and easy to get wrong (typo a name, forget a field, forget a type conversion).

**\`@ModelAttribute\`** solves this by binding *all* matching request parameters onto a single Java object in one shot. Spring looks at the object's setters, matches request parameter names to property names, and populates the object automatically — then hands it to the controller already built.

**Before — manual, one parameter per field:**
\`\`\`java
@RequestMapping(value = "/addJob", method = RequestMethod.POST)
public String addJob(@RequestParam String description,
                      @RequestParam String url,
                      @RequestParam String profile) {
    Job job = new Job();
    job.setDescription(description);
    job.setUrl(url);
    job.setProfile(profile);
    // ... save job
    return "redirect:/";
}
\`\`\`

**After — one bound object:**
\`\`\`java
@RequestMapping(value = "/addJob", method = RequestMethod.POST)
public String addJob(@ModelAttribute Job job) {
    // job.description, job.url, job.profile are already set
    // ... save job
    return "redirect:/";
}
\`\`\`

The second version scales to any number of fields without touching the controller signature — add a field to \`Job\` and the matching form input, and binding just works.`,
  code: `public class Job {
    private String description;
    private String url;
    private String profile;
    // getters and setters ...
}

@Controller
public class AddJobController {

    @RequestMapping(value = "/addJob", method = RequestMethod.POST)
    public String addJob(@ModelAttribute Job job) {
        System.out.println(job.getDescription() + " - " + job.getProfile());
        return "redirect:/";
    }
}`,
  codeTitle: 'Binding a form to a Job object',
  points: [
    '@RequestParam does not scale: one annotation per field becomes unmanageable as forms grow.',
    'Manually copying request parameters into a new object by hand is repetitive and error-prone.',
    '@ModelAttribute matches request parameter names to a class’s property names and binds them automatically.',
    'The bound object is also registered in the Model, so it is immediately available to the view.',
    'It works in both directions: binding incoming form data, and exposing outgoing model data to JSPs.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Binding relies on getter/setter naming. A form field named "profile" only binds if Job has getProfile()/setProfile(String) - a mismatched name silently leaves the field null instead of throwing an error.' },
    { type: 'interview', content: 'Q: What problem does @ModelAttribute solve compared to @RequestParam?\nA: @RequestParam requires one annotated parameter per form field, which does not scale. @ModelAttribute binds all matching request parameters onto a single command object in one step, using setter-based property matching.' },
  ],
}
