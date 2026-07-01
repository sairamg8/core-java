export default {
  id: 'home-and-add-job-controller',
  title: '385. Home and Add Job Controller',
  explanation: `Two controllers drive the Job app (see [[job-app-understanding-views]]), each with a single, focused responsibility:

**\`HomeController\` — lists jobs:**
\`\`\`java
@Controller
public class HomeController {

    @Autowired
    private JobService jobService;

    @RequestMapping("/")
    public String home(Model model) {
        model.addAttribute("jobs", jobService.findAll());
        return "home";
    }
}
\`\`\`

**\`AddJobController\` — shows the form, then handles its submission. Two handler methods, same URL, different HTTP methods:**
\`\`\`java
@Controller
public class AddJobController {

    @Autowired
    private JobService jobService;

    @RequestMapping(value = "/addJob", method = RequestMethod.GET)
    public String showForm(Model model) {
        model.addAttribute("job", new Job());
        return "addJob";
    }

    @RequestMapping(value = "/addJob", method = RequestMethod.POST)
    public String submitForm(@ModelAttribute Job job) {
        jobService.addJob(job);
        return "redirect:/";
    }
}
\`\`\`

**Why the GET handler adds an empty \`Job\` to the model:** Spring's form tag library (see [[job-app-handling-forms]]) needs a command object to bind the \`<form:form>\` to, even before anything has been typed — the empty \`new Job()\` is that placeholder, with every field \`null\` until submitted.

**Why the POST handler returns \`"redirect:/"\` instead of \`"home"\`:** returning \`"home"\` directly would *render* the home view as the response to the POST — refreshing the page would then resubmit the form (the classic "confirm form resubmission" browser warning). \`redirect:\` issues an HTTP redirect instead, so the browser makes a fresh \`GET /\`, and refreshing afterwards is harmless. This is the **Post/Redirect/Get** pattern.`,
  code: `@Controller
public class AddJobController {

    @Autowired
    private JobService jobService;

    @RequestMapping(value = "/addJob", method = RequestMethod.GET)
    public String showForm(Model model) {
        model.addAttribute("job", new Job());
        return "addJob";
    }

    @RequestMapping(value = "/addJob", method = RequestMethod.POST)
    public String submitForm(@ModelAttribute Job job) {
        jobService.addJob(job);
        return "redirect:/";
    }
}`,
  codeTitle: 'AddJobController: GET shows the form, POST handles it',
  points: [
    'HomeController has one responsibility: load all jobs from JobService and expose them to home.jsp.',
    'AddJobController splits the add-job flow into two handlers on the same URL, distinguished by HTTP method.',
    'The GET handler adds an empty Job to the model so Spring\'s form tags have a command object to bind to.',
    'The POST handler binds the submission with @ModelAttribute, saves it, then redirects rather than rendering directly.',
    'Returning "redirect:/" instead of "home" implements Post/Redirect/Get, preventing duplicate submissions on page refresh.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Skipping model.addAttribute("job", new Job()) in the GET handler causes an error when addJob.jsp\'s <form:form modelAttribute="job"> renders, since Spring\'s form tags require the named command object to already exist in the model.' },
    { type: 'interview', content: 'Q: Why does the POST handler return "redirect:/" instead of directly returning "home"?\nA: Returning "home" would render the view as the direct response to the POST request. If the user then refreshes the page, the browser resubmits the POST, duplicating the action. Returning a redirect makes the browser issue a fresh GET request instead, so a refresh afterwards is harmless - the Post/Redirect/Get pattern.' },
  ],
}
