export default {
  id: 'rest-using-spring-boot-introduction',
  title: '390. REST Using Spring Boot: Introduction',
  explanation: `Chapter F built a webapp where the **server rendered HTML** — a controller returned a view name, a JSP produced the page, and the browser just displayed it (see [[summary-for-job-webapp]]). This chapter flips that: the server exposes **data**, and a separate frontend (a React app, see [[understanding-react-ui]]) is responsible for rendering it.

**Why split them?** A JSP-rendered page only works for a browser. A REST API works for *any* client — the same React web app, a mobile app, another backend service, or a script — because it just exchanges data (typically JSON), not markup. This is the dominant style for modern web architecture: a Spring Boot **backend** exposing REST endpoints, and a separate **frontend** (React, Angular, mobile) consuming them.

**What changes, concretely:**
- \`@Controller\` (returns view names) is replaced by **\`@RestController\`** (returns data, serialized straight to JSON).
- There is no view resolver, no JSP, no \`WEB-INF/views\` — a REST controller's return value *is* the response body.
- The frontend and backend typically run as two separate processes during development (React on port 3000, Spring Boot on port 8080) and talk over HTTP.

**This chapter's plan:** build a REST API on top of the Job app's domain (Chapter F) and a new e-commerce-style project, backed by real persistence via **Spring Data JPA** (see [[spring-data-jpa-introduction]]) instead of the in-memory list used earlier — exactly the swap [[summary-for-job-webapp]] said was coming.`,
  code: `// Chapter F: server renders the page
@Controller
public class HomeController {
    @RequestMapping("/")
    public String home(Model model) {
        model.addAttribute("jobs", jobService.findAll());
        return "home";              // -> home.jsp renders HTML
    }
}

// This chapter: server exposes data, frontend renders it
@RestController
public class JobRestController {
    @GetMapping("/jobs")
    public List<Job> getJobs() {
        return jobService.findAll();    // serialized straight to JSON
    }
}`,
  codeTitle: 'View-rendering controller vs REST controller',
  points: [
    'A REST API separates the backend (data + business logic) from the frontend (rendering), unlike the JSP-based apps built in Chapter F.',
    '@RestController replaces @Controller + a view resolver: the return value is serialized directly to the response body (usually JSON).',
    'Separating frontend and backend lets the same API serve a web app, a mobile app, or another service - not just a browser rendering JSPs.',
    'This chapter rebuilds the Job app\'s domain as a REST API and introduces a new Product/Order project, both backed by real persistence via Spring Data JPA.',
    'During development, frontend and backend usually run as separate processes on separate ports and communicate over HTTP.',
  ],
  callouts: [
    { type: 'tip', content: 'Whenever a Spring class is annotated @RestController instead of @Controller, assume every method\'s return value goes straight into the HTTP response body as data - there is no view name being resolved, even if a method happens to return a String.' },
    { type: 'interview', content: 'Q: What is the core architectural difference between the JSP-based Job app (Chapter F) and the REST API version of it?\nA: The JSP app renders HTML server-side and sends a finished page to the browser. The REST API instead returns raw data (JSON) from @RestController endpoints, and a separate frontend (React) is responsible for turning that data into UI - decoupling the backend from any specific client.' },
  ],
}
