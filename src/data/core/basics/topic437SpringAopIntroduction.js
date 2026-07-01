export default {
  id: 'spring-aop-introduction',
  title: '437. Spring AOP Introduction',
  explanation: `Every feature built so far — REST controllers (see [[creating-a-rest-controller]]), services, repositories — solves one clean business problem each. But some concerns cut across *all* of them: logging every method call, timing how long each one takes, checking security before letting a call through, retrying on failure. Writing that logic by hand inside every method means the same boilerplate repeated dozens of times, tangled in with the actual business logic.

**Aspect-Oriented Programming (AOP)** is a programming paradigm for exactly this problem: it lets a "cross-cutting concern" (logging, timing, security, transactions) be written *once*, in one place, and applied automatically to many methods — without touching those methods' source code at all.

**Spring AOP** is Spring's implementation of this idea, built on top of the same IoC container and bean model already in use (see [[ioc-and-di]]). It works by wrapping a Spring-managed bean's method calls with extra behavior at runtime — the bean itself never knows this wrapping exists.

**A concrete motivating case:** imagine wanting to log the entry and exit of every method in \`JobService\`. Without AOP, that means adding a \`log.info(...)\` line at the start and end of every single method, by hand, in every service class in the app — the actual business logic (calculating, saving, searching) gets buried under repeated logging statements. AOP separates that logging concern into its own class entirely, leaving \`JobService\` untouched.

**How Spring achieves this:** Spring AOP uses **proxies** — when a bean is annotated as an AOP target, Spring does not hand callers a direct reference to the real object. Instead, it hands out a proxy object that has the same public methods. Calling a method on the proxy runs the extra AOP logic first (or after, or around), then delegates to the real object's method. This is exactly the same proxy mechanism Spring already uses elsewhere (e.g. for \`@Transactional\`) — AOP is not a special case, it's the general tool those other features are built on top of.`,
  code: `// Without AOP - logging tangled into business logic, repeated everywhere
@Service
public class JobService {
    public Job save(Job job) {
        log.info("Entering save()");
        Job result = jobRepository.save(job);
        log.info("Exiting save()");
        return result;
    }
    // Every other method needs the same two log lines copy-pasted...
}

// With AOP - logging concern lives in exactly one place
@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object logMethodCall(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("Entering " + joinPoint.getSignature());
        Object result = joinPoint.proceed();
        log.info("Exiting " + joinPoint.getSignature());
        return result;
    }
}`,
  codeTitle: 'The problem AOP solves: cross-cutting logging, before and after',
  points: [
    'AOP separates cross-cutting concerns (logging, timing, security) from business logic, writing each concern exactly once instead of repeating it in every method.',
    'Spring AOP works by proxying beans - callers get a proxy that runs extra logic around the real method call, without the real class knowing the proxy exists.',
    'This is the same proxy-based mechanism Spring already uses for @Transactional - AOP is the general-purpose tool, not a separate special case.',
    'A cross-cutting concern written as an aspect can be applied to many classes and methods at once, based on a rule rather than being copy-pasted into each one.',
    'AOP complements the layered service/repository/controller structure already built - it does not replace it, it adds behavior around it.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Since Spring AOP works through proxies, calling one method on a bean from another method on the same bean (a self-invocation) bypasses the proxy entirely, so the aspect logic never runs - this is one of the most common Spring AOP surprises.' },
    { type: 'interview', content: 'Q: How does Spring AOP apply cross-cutting logic to a bean without modifying that bean\'s source code?\nA: Spring wraps the target bean in a proxy at runtime. Callers receive the proxy instead of the real object; calling a method on the proxy runs the aspect\'s logic (before, after, or around the call) and then delegates to the real method. The target class itself is never changed.' },
  ],
}
