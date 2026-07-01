export default {
  id: 'aop-concepts',
  title: '439. AOP Concepts',
  explanation: `Spring AOP has its own vocabulary, and each term maps to a precise, distinct idea. Getting them straight up front makes every later AOP topic (Before/After/Around advice) much easier to follow, since they're really just variations on these same five concepts.

**Aspect** — the class that holds the cross-cutting logic itself. Annotated \`@Aspect\` and registered as a Spring bean with \`@Component\`. The \`LoggingAspect\` from the earlier example (see [[spring-aop-introduction]]) is an aspect.

**Advice** — the actual code that runs, and *when* it runs relative to the target method. There are five kinds:
- \`@Before\` — runs before the method executes
- \`@After\` — runs after the method completes (success or exception)
- \`@AfterReturning\` — runs only after the method completes successfully
- \`@AfterThrowing\` — runs only if the method throws
- \`@Around\` — wraps the method entirely, can run code before *and* after, and controls whether the method runs at all

**Join Point** — a specific point in program execution where advice *could* be applied — in Spring AOP, this is always a method call. \`JobService.save(job)\` being invoked is a join point.

**Pointcut** — an expression that selects *which* join points a piece of advice applies to. \`execution(* com.example.service.*.*(..))\` is a pointcut expression meaning "any method, in any class, in the \`service\` package, with any return type and any arguments."

**Weaving** — the process of actually combining the aspect with the target class to produce the proxied behavior. Spring AOP does this at runtime (not compile-time, unlike some other AOP frameworks like AspectJ) — the proxy is created when the application context starts.

**Putting them together in one aspect:**
\`\`\`java
@Aspect
@Component
public class LoggingAspect {                                    // <- the Aspect

    @Before("execution(* com.example.service.*.*(..))")         // <- Pointcut expression
    public void logBefore(JoinPoint joinPoint) {                 // <- Before Advice, given the Join Point
        log.info("About to call: " + joinPoint.getSignature());
    }
}
\`\`\`
Weaving happens automatically once this class is a Spring bean — no extra configuration is needed to trigger it.`,
  code: `@Aspect
@Component
public class LoggingAspect {

    // Pointcut: any method in any class under com.example.service
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Entering: {}", joinPoint.getSignature().getName());
    }

    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("{} returned: {}", joinPoint.getSignature().getName(), result);
    }
}`,
  codeTitle: 'Aspect, Advice, Join Point, and Pointcut expression together',
  points: [
    'An Aspect is a @Component class annotated @Aspect that holds cross-cutting logic - it is a normal Spring bean.',
    'Advice is the code that runs and its timing relative to the target method: @Before, @After, @AfterReturning, @AfterThrowing, or @Around.',
    'A Join Point is a specific point during execution where advice can apply - in Spring AOP this is always a method call.',
    'A Pointcut is the expression (e.g. execution(...)) that selects which join points a given piece of advice actually applies to.',
    'Weaving is the process of combining aspect and target to produce the proxied behavior - Spring AOP does this at runtime when the application context starts, not at compile time.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A pointcut expression that is too broad (e.g. matching every method in the whole application, not just a specific package) can silently apply logging or other advice to code where it was never intended, including framework-internal calls - always scope execution(...) expressions to a specific package or annotation rather than using overly wide wildcards.' },
    { type: 'interview', content: 'Q: What is the difference between a Join Point and a Pointcut in Spring AOP?\nA: A Join Point is a concrete point in execution where advice could run - in Spring AOP, always a method invocation. A Pointcut is an expression that selects which join points a particular piece of advice should actually apply to. Every method call is a potential join point; a pointcut expression narrows that down to the ones that matter for a given aspect.' },
  ],
}
