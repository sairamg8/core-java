export default {
  id: 'after-advice',
  title: '442. After Advice',
  explanation: `\`@After\` is the counterpart to \`@Before\` (see [[before-advice]]) — it runs once the target method finishes, but the precise meaning of "finishes" matters, because Spring AOP actually offers three distinct "after" advice types, not one.

**\`@After\` (a.k.a. "finally" advice) — runs no matter what happens.** Whether the target method returns normally or throws an exception, \`@After\` advice runs, exactly like a \`finally\` block:
\`\`\`java
@After("execution(* com.example.service.*.*(..))")
public void logAfter(JoinPoint joinPoint) {
    log.info("Finished: {}", joinPoint.getSignature().getName());
}
\`\`\`
It cannot see the return value or the exception — it only knows the method has finished, one way or another.

**\`@AfterReturning\` — runs only if the method completed successfully**, and *can* access the return value via the \`returning\` attribute:
\`\`\`java
@AfterReturning(pointcut = "execution(* com.example.service.JobService.save(..))", returning = "result")
public void logSuccess(JoinPoint joinPoint, Object result) {
    log.info("save() succeeded, returned: {}", result);
}
\`\`\`
The \`returning = "result"\` attribute name must exactly match the advice method's parameter name — Spring wires them together by that string, not by type alone.

**\`@AfterThrowing\` — runs only if the method threw**, and can access the exception via the \`throwing\` attribute:
\`\`\`java
@AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "ex")
public void logFailure(JoinPoint joinPoint, Exception ex) {
    log.error("{} threw: {}", joinPoint.getSignature().getName(), ex.getMessage());
}
\`\`\`
This does **not** swallow or handle the exception — after this advice runs, the exception continues to propagate up to the caller exactly as if the advice weren't there. It's for observing failures (logging, alerting), not for recovering from them.

**Choosing between the three:** \`@After\` for guaranteed cleanup-style logging regardless of outcome; \`@AfterReturning\` for logic that specifically needs the success result; \`@AfterThrowing\` for failure-specific logging or alerting. All three can coexist on the same aspect, targeting the same pointcut, each firing under its own specific condition.`,
  code: `@Aspect
@Component
public class ResultLoggingAspect {

    @After("execution(* com.example.service.*.*(..))")
    public void logFinished(JoinPoint joinPoint) {
        log.info("{} finished (success or failure)", joinPoint.getSignature().getName());
    }

    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void logResult(JoinPoint joinPoint, Object result) {
        log.info("{} returned: {}", joinPoint.getSignature().getName(), result);
    }

    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "ex")
    public void logException(JoinPoint joinPoint, Exception ex) {
        log.error("{} threw: {}", joinPoint.getSignature().getName(), ex.getMessage());
    }
}`,
  codeTitle: '@After, @AfterReturning, and @AfterThrowing on the same aspect',
  points: [
    '@After runs regardless of outcome (like a finally block) - it cannot see the return value or exception, only that the method has finished.',
    '@AfterReturning runs only on successful completion and can access the return value through the returning attribute.',
    '@AfterThrowing runs only when an exception is thrown and can access it through the throwing attribute.',
    'The returning/throwing attribute value must exactly match the corresponding advice method parameter name - Spring wires them by name, not type alone.',
    '@AfterThrowing observes a failure but does not swallow it - the exception still propagates to the caller after the advice runs, unlike a try/catch.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Expecting @AfterThrowing to stop an exception from reaching the caller is a common mistake - it only lets an aspect react to (log, alert on) a failure. To actually change or suppress the exception seen by the caller, @Around advice with its own try/catch around proceed() is required.' },
    { type: 'interview', content: 'Q: What is the difference between @After, @AfterReturning, and @AfterThrowing, and can any of them handle (swallow) an exception thrown by the target method?\nA: @After runs regardless of outcome, @AfterReturning only on success (with access to the return value), and @AfterThrowing only on failure (with access to the exception). None of them can swallow or replace the exception - after @AfterThrowing runs, the exception still propagates normally to the caller. Only @Around advice, by wrapping proceed() in its own try/catch, can actually intercept and change that outcome.' },
  ],
}
