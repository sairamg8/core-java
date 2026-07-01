export default {
  id: 'summary-for-job-webapp',
  title: '389. Summary for Job Webapp',
  explanation: `The Job Application tracker is complete. Every piece from this sub-chapter came together into one small, working app:

- **[[job-app-source-code]]** — the domain model, \`Job\`, and the planned file layout.
- **[[building-job-app]]** and **[[job-app-creating-project]]** — the build order, and reusing the manual Spring MVC project setup (see [[spring-mvc-manual-setup-summary]]) with a component scan pointed at the app's own package.
- **[[job-app-working-with-layers]]** — \`JobService\` as the single owner of storage; controllers never touch it directly.
- **[[home-and-add-job-controller]]** — \`HomeController\` for listing, \`AddJobController\` split into a \`GET\` (show form) and \`POST\` (handle submission) pair, using Post/Redirect/Get.
- **[[job-app-understanding-views]]** and **[[job-app-handling-forms]]** — \`home.jsp\` iterating the job list with JSTL, \`addJob.jsp\` bound to the \`Job\` command object with Spring's form tags.
- **[[job-app-view-data]]** — how data moves through the \`Model\` in both directions: one-way for the list, round-trip for the form.

**The end-to-end flow, once more, concretely:**
1. \`GET /\` → \`HomeController\` loads all jobs from \`JobService\`, model gets \`"jobs"\`, \`home.jsp\` renders the table.
2. User clicks "Add a new job" → \`GET /addJob\` → \`AddJobController\` adds an empty \`Job\` under \`"job"\`, \`addJob.jsp\` renders the bound form.
3. User submits → \`POST /addJob\` → \`@ModelAttribute Job job\` binds the filled-in fields, \`jobService.addJob(job)\` stores it, controller returns \`"redirect:/"\`.
4. Browser follows the redirect → back to step 1, now showing the new job.

**What comes next:** the in-memory \`List<Job>\` inside \`JobService\` is the one deliberately simplified piece — everything else here (controllers, views, layering) is exactly how a production app is structured. Chapter G picks up from here and swaps that list for real persistence: **REST APIs and Spring Data JPA**, replacing hand-rolled storage with a proper repository backed by a database.`,
  code: `1. GET  /        -> HomeController    -> model["jobs"]  -> home.jsp    (list)
2. GET  /addJob   -> AddJobController  -> model["job"]   -> addJob.jsp  (empty form)
3. POST /addJob   -> AddJobController  -> jobService.addJob(job) -> redirect:/
4. GET  /  (again, via the redirect)   -> home.jsp shows the newly added job`,
  codeTitle: 'The full Job app request cycle',
  points: [
    'The Job app exercises the full Spring MVC stack: DispatcherServlet, handler mapping, controllers, view resolution, and JSP rendering.',
    'Layering (Controller -> Service -> Model) was kept strict even for an in-memory store, which is exactly why swapping storage later is low-risk.',
    'Post/Redirect/Get in AddJobController prevents duplicate submissions on refresh, and is worth reusing in any form-handling controller.',
    'Model attribute names ("jobs", "job") are the contract between controller and JSP - get them wrong and the view silently shows nothing.',
    'The only intentionally simplified piece is storage; the next chapter replaces it with Spring Data JPA without touching the web layer\'s shape.',
  ],
  callouts: [
    { type: 'tip', content: 'Before moving on, trace all four steps of the request cycle above without looking back at earlier topics - if any step is fuzzy, that is the one worth re-reading, since Chapter G builds directly on this same controller/service/view shape.' },
    { type: 'interview', content: 'Q: Which part of this Job app would change if the in-memory list were replaced with a real database, and which parts would not?\nA: Only JobService\'s internals would change - swapping the List<Job> for a Spring Data JPA repository call. HomeController, AddJobController, and both JSPs would not need to change at all, because they depend only on JobService\'s public methods (addJob, findAll), not on how it stores data.' },
  ],
}
