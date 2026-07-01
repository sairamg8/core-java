export default {
  id: 'before-advice',
  title: '440. Before Advice',
  explanation: `\`@Before\` is the simplest of the five advice types (see [[aop-concepts]]) — it runs immediately before the matched method executes, always, with no way to see the method's return value (it hasn't run yet) and no way to prevent the method from running.

**Basic form:**
\`\`\`java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.JobService.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Calling {} with args: {}",
            joinPoint.getSignature().getName(),
            Arrays.toString(joinPoint.getArgs()));
    }
}
\`\`\`
When any method on \`JobService\` is called, this advice runs first, then the real method executes — the caller sees no difference in behavior except the log entry.

**What \`JoinPoint\` gives access to:** the parameter to a \`@Before\` method (of type \`JoinPoint\`) exposes the method's name (\`getSignature()\`), its arguments (\`getArgs()\`), and the target object (\`getTarget()\`) — everything needed to log or inspect the call, but not to change it.

**\`@Before\` cannot stop the method from running or alter its arguments.** If \`logBefore\` throws an exception, the target method never runs — but that's an accident of exception propagation, not a deliberate control mechanism. For advice that needs to *decide* whether the method runs at all, or *change* its arguments or return value, \`@Around\` is the right tool (see [[performance-monitoring-using-around-advice]]) — \`@Before\` is specifically for "do this first, unconditionally, without touching the call."

**A realistic use case beyond logging:** validating that a required precondition is met, and throwing before wasted work happens — e.g. checking that a request is authenticated before letting a service method run, logging that check as a side effect without changing the method's normal behavior.`,
  code: `@Aspect
@Component
public class AuditAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void auditCall(JoinPoint joinPoint) {
        String method = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.info("AUDIT: {} called with {}", method, Arrays.toString(args));
    }
}

// Calling jobService.save(job) transparently triggers:
// "AUDIT: save called with [Job{title=Backend Engineer, ...}]"
// before save() actually runs - JobService itself is unmodified.`,
  codeTitle: '@Before advice auditing every service call',
  points: [
    '@Before advice runs immediately before the matched method, unconditionally, on every matching call.',
    'The JoinPoint parameter exposes the method name, arguments, and target object - enough to log or inspect the call, but not to change it.',
    '@Before cannot stop the target method from running or modify its arguments - it only observes and runs code alongside the call.',
    'If @Before advice throws, the target method never executes - but this is a side effect of exception propagation, not a deliberate control feature the way @Around provides.',
    'A common real use is auditing or precondition checks that should always happen before a method runs, without altering that method\'s behavior.',
  ],
  callouts: [
    { type: 'gotcha', content: 'It is easy to assume @Before can validate input and reject a bad call by "not proceeding" - it cannot skip the method. The only way for @Before advice to prevent the target method from running is by throwing an exception, which is a much blunter tool than the explicit proceed control that @Around advice provides.' },
    { type: 'interview', content: 'Q: Can @Before advice modify the arguments passed to the method it is watching, or prevent the method from running?\nA: No. @Before advice only runs code before the target method executes - it cannot change the arguments or stop the call. The only way it can prevent execution is indirectly, by throwing an exception. For advice that needs to control whether the call proceeds or change its inputs/outputs, @Around is the correct choice.' },
  ],
}
