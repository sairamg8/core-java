export default {
  id: 'validating-input-using-around-advice',
  title: '444. Validating Input Using Around Advice',
  explanation: `The previous topic used \`@Around\`'s \`proceed()\` to always call the real method, just with timing wrapped around it (see [[performance-monitoring-using-around-advice]]). This topic uses the other half of \`@Around\`'s power: the ability to **not** call \`proceed()\` at all — rejecting a call outright based on its arguments, before the real method ever runs.

**The pattern: inspect arguments via the \`ProceedingJoinPoint\`, decide, then either \`proceed()\` or throw.**
\`\`\`java
@Aspect
@Component
public class ValidationAspect {

    @Around("execution(* com.example.service.JobService.save(..)) && args(job)")
    public Object validateJob(ProceedingJoinPoint joinPoint, Job job) throws Throwable {
        if (job.getTitle() == null || job.getTitle().isBlank()) {
            throw new IllegalArgumentException("Job title must not be blank");
        }
        return joinPoint.proceed();
    }
}
\`\`\`
The \`args(job)\` addition to the pointcut expression binds the method's actual argument to the advice method's \`job\` parameter — this is how \`@Around\` advice gets typed access to arguments, rather than pulling them out of \`joinPoint.getArgs()\` and casting manually.

**Why this differs from \`@Before\`-based validation (see [[before-advice]]):** \`@Before\` can also throw to reject a call, so for pure "reject or allow, no other decision" validation, \`@Before\` is simpler and should be preferred. \`@Around\` becomes necessary when validation needs to do more than reject — for example, *modifying* the arguments before letting the call through, or returning an early, synthetic result without ever calling the real method (a lightweight caching pattern: check a cache, return the cached value directly without calling \`proceed()\` if present, call \`proceed()\` only on a cache miss).

**A concrete "short-circuit" example — returning early without proceeding:**
\`\`\`java
@Around("execution(* com.example.service.JobService.findById(..)) && args(id)")
public Object cacheAwareFind(ProceedingJoinPoint joinPoint, Integer id) throws Throwable {
    if (cache.containsKey(id)) {
        return cache.get(id);          // never calls proceed() - real method skipped entirely
    }
    Object result = joinPoint.proceed();
    cache.put(id, result);
    return result;
}
\`\`\`
This is the key capability \`@Before\`/\`@After\` fundamentally cannot offer: deciding, per call, whether the underlying method executes at all.`,
  code: `@Aspect
@Component
public class ValidationAspect {

    @Around("execution(* com.example.service.JobService.save(..)) && args(job)")
    public Object validateJob(ProceedingJoinPoint joinPoint, Job job) throws Throwable {
        if (job.getTitle() == null || job.getTitle().isBlank()) {
            throw new IllegalArgumentException("Job title must not be blank");
        }
        if (job.getDescription() == null || job.getDescription().length() < 10) {
            throw new IllegalArgumentException("Job description must be at least 10 characters");
        }
        return joinPoint.proceed();
    }
}`,
  codeTitle: '@Around advice validating arguments before calling proceed()',
  points: [
    'args(job) in the pointcut expression binds the target method argument directly to a typed parameter on the advice method, avoiding manual casting from getArgs().',
    'Throwing before calling proceed() rejects the call entirely - the real method never runs, and the exception propagates to the original caller.',
    'For simple reject-or-allow validation, @Before is usually simpler and should be preferred over @Around.',
    '@Around becomes necessary when validation needs to do more than reject - such as modifying arguments, or returning an early result without ever calling the real method.',
    'A cache-aware advice that returns a cached value without calling proceed() on a hit demonstrates the one thing only @Around can do: skip the underlying method entirely, per call, based on a runtime decision.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Using args(job) in a pointcut expression requires the parameter name in the expression to match the advice method parameter name exactly (both named "job" here) - a mismatch causes a pointcut parsing error at application startup, not a silent runtime bug, so it fails fast at least.' },
    { type: 'interview', content: 'Q: Why choose @Around advice over @Before for input validation that rejects a bad call?\nA: For simple reject-or-allow validation, @Before is usually preferred since it is simpler and sufficient - throwing from @Before advice already prevents the target method from running. @Around becomes necessary specifically when the validation logic needs to do more than reject: modifying arguments, returning an early result without calling the real method (like a cache check), or otherwise making a runtime decision about whether and how the underlying call proceeds.' },
  ],
}
