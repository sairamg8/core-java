export default {
  id: 'job-app-view-data',
  title: '388. View Data',
  explanation: `Every piece of data a JSP displays has to arrive there through the **\`Model\`** — there is no other channel. This topic ties together exactly how data moves from \`JobService\` (see [[job-app-working-with-layers]]) through the controllers into both views.

**Home page — a collection flows into the model:**
\`\`\`java
@RequestMapping("/")
public String home(Model model) {
    model.addAttribute("jobs", jobService.findAll());  // List<Job>
    return "home";
}
\`\`\`
\`home.jsp\` reads it back with \`\${jobs}\` and iterates with \`<c:forEach>\` (see [[job-app-understanding-views]]).

**Add-job form — a single command object flows both ways:**
\`\`\`java
@RequestMapping(value = "/addJob", method = RequestMethod.GET)
public String showForm(Model model) {
    model.addAttribute("job", new Job());   // empty, for the form to bind to
    return "addJob";
}
\`\`\`
On \`GET\`, an *empty* \`Job\` goes into the model so \`<form:form modelAttribute="job">\` (see [[job-app-handling-forms]]) has something to bind its inputs to. On \`POST\`, the *same-named* object comes back **out** of the request via \`@ModelAttribute\` — the round trip is: empty object into the model → user fills the form → filled object bound back out of the request.

**Two attribute names, two different lifetimes:**
- \`"jobs"\` — read-only display data, added fresh on every \`GET /\`.
- \`"job"\` — a two-way command object: written by the GET handler (empty), read by the framework on POST (from the request), and available again in the model automatically after binding, which is why \`\${job.description}\` would work even inside \`addJob.jsp\` if the form needed to redisplay a partially-filled value after a validation error.

**Model attribute names are just keys in a map** (\`ModelMap\` under the hood) — \`model.addAttribute("jobs", ...)\` and \`\${jobs}\` in the JSP are the same string, by convention, not by any magic; get the name wrong on either side and the JSP silently sees nothing (EL evaluates an unknown expression to empty string, not an error).`,
  code: `// Model is a simple key -> value map, populated in the controller...
model.addAttribute("jobs", jobService.findAll());
model.addAttribute("job", new Job());

// ...and read back in the JSP by the same key
// \${jobs}   -> the List<Job>
// \${job}    -> the command object bound to the form`,
  codeTitle: 'Model attributes: the same key on both sides',
  points: [
    'All data a JSP can display arrives through the Model - there is no other channel between controller and view.',
    'Collection data ("jobs") flows one way: controller populates it fresh on every GET request.',
    'The form\'s command object ("job") flows both ways: an empty instance goes in on GET, a filled one comes back out via @ModelAttribute on POST.',
    'Model attribute names are plain string keys - the name used in addAttribute must exactly match the EL expression in the JSP.',
    'A mismatched attribute name fails silently: EL evaluates an unknown expression to an empty string rather than throwing an error.',
  ],
  callouts: [
    { type: 'gotcha', content: 'model.addAttribute("Job", new Job()) (capital J) and <form:form modelAttribute="job"> (lowercase) look almost identical but are different keys entirely - the mismatch fails silently rather than with a clear error, since EL simply renders nothing for an unresolved expression.' },
    { type: 'interview', content: 'Q: Why does the GET handler for the add-job form add an empty Job to the model, when the user has not entered anything yet?\nA: Spring\'s form tags need an existing command object under the given modelAttribute name to bind their inputs to, even before any values are filled in. Without it, the form tags have nothing to read property values or generate input names from, and the JSP fails when it renders.' },
  ],
}
