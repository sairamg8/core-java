export default {
  id: 'logging-the-calls',
  title: '438. Logging the Calls',
  explanation: `Before writing an actual \`@Aspect\`, it helps to build the motivating example concretely (see [[spring-aop-introduction]]) — a small \`JobService\` where every method needs entry/exit logging, done first the manual way, so the AOP version that follows has something real to improve on.

**The manual version — logging hand-written into every method:**
\`\`\`java
@Service
public class JobService {
    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    public Job save(Job job) {
        log.info("save() called with job: {}", job);
        Job result = jobRepository.save(job);
        log.info("save() returned: {}", result);
        return result;
    }

    public List<Job> findAll() {
        log.info("findAll() called");
        List<Job> result = jobRepository.findAll();
        log.info("findAll() returned {} jobs", result.size());
        return result;
    }
}
\`\`\`

**What's wrong with this, concretely:**
1. **Duplication scales with method count.** Ten methods means ten copies of nearly identical logging code.
2. **The logging is not optional or centrally controlled.** Turning logging on/off, or changing its format, means editing every method again.
3. **Business logic and infrastructure concern are interleaved.** Reading \`save()\` requires mentally filtering out the logging lines to see what it actually does.
4. **It doesn't scale to new services.** Every new \`@Service\` class written from now on needs the same boilerplate copy-pasted in again.

This is precisely the shape of problem AOP targets: a concern (logging) that needs to apply uniformly to many methods across many classes, without being written into each one. The next topics build the actual \`@Aspect\` that replaces all of this hand-written logging with one reusable rule (see [[aop-concepts]]).`,
  code: `@Service
public class JobService {
    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    public Job save(Job job) {
        log.info("save() called with job: {}", job);
        Job result = jobRepository.save(job);
        log.info("save() returned: {}", result);
        return result;
    }

    public Job findById(Integer id) {
        log.info("findById() called with id: {}", id);
        Job result = jobRepository.findById(id).orElseThrow();
        log.info("findById() returned: {}", result);
        return result;
    }
}`,
  codeTitle: 'Manual entry/exit logging - the boilerplate AOP will remove',
  points: [
    'Manual logging means copy-pasting near-identical log statements into every method of every service class.',
    'Changing the logging format or turning it off requires editing every method individually - there is no single place to control it.',
    'The business logic and the logging concern are interleaved in the same lines, making the actual method harder to read at a glance.',
    'The boilerplate does not scale - every new service class written needs the same manual logging added again.',
    'This exact repeated pattern (something that needs to happen before and after many method calls) is what an @Aspect with @Before/@After/@Around advice replaces with one reusable rule.',
  ],
  callouts: [
    { type: 'gotcha', content: 'It is tempting to solve repeated logging with a shared helper method, but that still requires a call to the helper at the top and bottom of every method by hand - it reduces the amount of code per call site but does not remove the need to remember to add it everywhere. AOP removes the need to touch each method at all.' },
    { type: 'interview', content: 'Q: What specifically is wrong with adding log.info() calls manually to the start and end of every service method, beyond just verbosity?\nA: The logging concern is duplicated across every method, cannot be toggled or reformatted from one place, is interleaved with business logic making methods harder to read, and does not scale - every new method or class needs the same boilerplate copied in again. This is exactly the class of problem cross-cutting concerns/AOP is designed to solve.' },
  ],
}
