export default {
  id: 'job-app-source-code',
  title: '381. Job App Source Code',
  explanation: `The next several topics build one small, complete webapp: a **Job Application tracker** — a page listing jobs applied to, and a form to add a new one. It uses every piece assembled so far: the manually configured Spring MVC project (see [[spring-mvc-manual-setup-summary]]), \`@ModelAttribute\` form binding (see [[using-modelattribute]]), and JSP views resolved through \`InternalResourceViewResolver\`.

**The domain model — \`Job\`:**
\`\`\`java
public class Job {
    private String description;
    private String url;
    private String profile;
    // getters, setters, toString()
}
\`\`\`

**Planned structure of the source code:**
\`\`\`
com.example.jobapp
├── Job.java                  the model
├── JobService.java           in-memory storage + business logic
├── HomeController.java       lists all jobs on "/"
└── AddJobController.java     shows the add-job form, handles submission

src/main/webapp/WEB-INF/views/
├── home.jsp                  lists jobs, link to add a new one
└── addJob.jsp                 the submission form
\`\`\`

**Why an in-memory list instead of a database?** The point of this project is to practice the **web layer** — controllers, forms, binding, views — without database setup adding noise. \`JobService\` will hold jobs in a simple \`List<Job>\`, exactly the way earlier database-backed features (see [[student-service-and-repository]]) used a repository interface — here it is intentionally the simplest possible stand-in, easy to later swap for JDBC or JPA without touching the controllers at all.`,
  code: `public class Job {
    private String description;
    private String url;
    private String profile;

    public Job() {}

    public Job(String description, String url, String profile) {
        this.description = description;
        this.url = url;
        this.profile = profile;
    }

    // getters and setters ...

    @Override
    public String toString() {
        return "Job [description=" + description + ", url=" + url + ", profile=" + profile + "]";
    }
}`,
  codeTitle: 'The Job domain object',
  points: [
    'This chapter\'s running example is a Job Application tracker: list jobs, add new ones through a form.',
    'The project reuses everything built so far: manual Spring MVC config, @ModelAttribute binding, JSP views.',
    'The source is organized into a model (Job), a service (JobService), and two controllers (Home, AddJob).',
    'Storage is a simple in-memory List<Job> rather than a database, to keep the focus on the web layer.',
    'The service-layer boundary means swapping in-memory storage for a real database later would not require touching the controllers.',
  ],
  callouts: [
    { type: 'tip', content: 'Notice the shape is identical to earlier database-backed features: a plain model, a service that owns storage, and controllers that only talk to the service - never directly to storage. That separation is what makes swapping the storage implementation later painless. See [[job-app-working-with-layers]].' },
    { type: 'interview', content: 'Q: Why use an in-memory list instead of a database for this example project?\nA: The goal of the exercise is the web layer - controllers, form binding, and view rendering - not persistence. Keeping storage as a simple in-memory list removes database setup as a distraction while still modeling a realistic service-layer boundary that could later be swapped for JDBC or JPA.' },
  ],
}
