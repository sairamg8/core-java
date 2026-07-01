export default {
  id: 'performance-monitoring-using-around-advice',
  title: '443. Performance Monitoring Using Around Advice',
  explanation: `\`@Around\` is the most powerful of the five advice types (see [[aop-concepts]], [[after-advice]]) because it wraps the *entire* method call — it can run code before, decide whether to call the method at all, run code after, and even change the return value. Measuring how long a method takes is the clearest possible use case, because it inherently needs both a "before" timestamp and an "after" timestamp around the same call.

**The method signature and \`ProceedingJoinPoint\`:** unlike \`@Before\`/\`@After\` which take a plain \`JoinPoint\` (see [[join-point]]), \`@Around\` advice takes a \`ProceedingJoinPoint\` — the one advice type with a \`proceed()\` method, which is what actually invokes the real target method.

\`\`\`java
@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();    // <- actually runs the real method
        long elapsed = System.currentTimeMillis() - start;
        log.info("{} took {} ms", joinPoint.getSignature().getName(), elapsed);
        return result;
    }
}
\`\`\`

**Why \`throws Throwable\` and \`Object\` return type:** \`@Around\` advice must declare \`throws Throwable\` because \`proceed()\` can throw any checked or unchecked exception the real method throws — Spring doesn't narrow this for you. The method returns \`Object\` because the advice has to be generic enough to wrap methods with any return type; it returns whatever \`proceed()\` returned (or whatever the advice chooses to substitute).

**The one rule that must never be broken: always call \`proceed()\` exactly once (unless deliberately retrying), and always return its result (or something derived from it).** Forgetting to call \`proceed()\` means the real method — the actual \`save()\` or \`findAll()\` — never runs at all, silently. Forgetting to \`return\` the result means callers get \`null\` back even though the real method executed and produced a value.

**Measuring time correctly even when the method throws:** the naive version above skips the \`finally\` block, so a thrown exception means \`elapsed\` is never logged. A more correct version wraps \`proceed()\` in \`try/finally\` so timing is captured on both success and failure paths — worth doing for any monitoring aspect meant to catch slow *and* failing calls.`,
  code: `@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            log.info("{} took {} ms", joinPoint.getSignature().getName(), elapsed);
        }
    }
}`,
  codeTitle: '@Around advice measuring elapsed time, including on failure',
  points: [
    '@Around advice receives a ProceedingJoinPoint, whose proceed() method is what actually calls the real target method - the only advice type that can control this.',
    'The advice method must declare throws Throwable since proceed() can rethrow whatever exception the wrapped method throws.',
    'The advice method returns Object and must return the value from proceed() (or a deliberate substitute) - forgetting to return it silently turns every result into null for the caller.',
    'Forgetting to call proceed() at all means the real method body never executes - a silent, hard-to-diagnose bug since no exception is thrown to signal it.',
    'Wrapping proceed() in try/finally (rather than measuring time only after a successful return) ensures timing is captured even when the wrapped method throws.',
  ],
  callouts: [
    { type: 'gotcha', content: 'An @Around aspect that forgets to call proceed() will not throw an error or fail to start - the application runs fine, but every intercepted method silently does nothing and (if the return type is not void) returns null. This is one of the hardest AOP bugs to spot precisely because nothing crashes.' },
    { type: 'interview', content: 'Q: Why must @Around advice explicitly call proceed(), and what happens if that call is forgotten?\nA: proceed() is what actually invokes the real target method - @Around fully controls whether the underlying logic runs at all. If proceed() is never called, the target method body silently never executes; the application keeps running with no errors, but callers receive null (for non-void methods) instead of the real result, since the advice never obtained one to return.' },
  ],
}
