export default {
  id: 'connecting-react-and-spring',
  title: '396. Connecting React and Spring',
  explanation: `With the API confirmed working in Postman (see [[working-with-postman]]), the next step is letting the actual React app (see [[understanding-react-ui]]) call it. The one problem that always appears the first time: **CORS**.

**The problem:** the React dev server runs on \`http://localhost:3000\`; Spring Boot runs on \`http://localhost:8080\`. From the browser's point of view, those are two different **origins** (different ports count as different origins). Browsers block JavaScript from making requests to a different origin unless that origin explicitly allows it — this is **CORS** (Cross-Origin Resource Sharing), a browser security feature, not a Spring or Java restriction.

**The fix — allow the frontend's origin explicitly:**
\`\`\`java
@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobRestController {
    // ... same methods as before
}
\`\`\`
\`@CrossOrigin\` adds the response headers (\`Access-Control-Allow-Origin\`, etc.) that tell the browser "this origin is permitted to read the response." Without it, Postman still works fine (Postman isn't a browser and doesn't enforce CORS), but the React app's \`fetch()\` call fails silently in the browser console with a CORS error — a classic source of confusion, since the request often *did* reach the server and even ran successfully; only the browser's reading of the *response* was blocked.

**A global alternative** (instead of annotating every controller) configures CORS once for the whole app:
\`\`\`java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:3000");
    }
}
\`\`\`

**In production**, the allowed origin is the real deployed frontend URL, not \`localhost:3000\` — always update it before deploying.`,
  code: `@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobRestController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> findAll() {
        return jobService.findAll();
    }
}`,
  codeTitle: '@CrossOrigin: allowing the React dev server\'s origin',
  points: [
    'CORS is a browser security mechanism, not a Spring restriction - it blocks JavaScript from reading responses from a different origin unless explicitly allowed.',
    'Different ports (localhost:3000 vs localhost:8080) count as different origins for CORS purposes, even on the same machine.',
    '@CrossOrigin on a controller (or class) adds the response headers that permit a specific frontend origin to read the API\'s responses.',
    'Postman is unaffected by CORS since it is not a browser - a working Postman test does not guarantee the browser-based frontend will work.',
    'A global CorsConfig bean is the alternative to annotating every controller individually with @CrossOrigin.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A CORS error in the browser console can be misleading: the server often did process the request successfully (check the backend logs) - it is only the browser refusing to let JavaScript read the response, not a failure on the backend itself.' },
    { type: 'interview', content: 'Q: The Postman test for GET /jobs works fine, but the React app fails with a CORS error calling the same endpoint. What is happening?\nA: CORS is enforced by browsers, not by Postman. The request itself may well be reaching Spring Boot and succeeding, but without @CrossOrigin (or an equivalent CORS configuration) permitting the React app\'s origin, the browser blocks JavaScript from reading the response - so the failure is a browser-side read restriction, not a backend error.' },
  ],
}
