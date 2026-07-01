export default {
  id: 'join-point',
  title: '441. Join Point',
  explanation: `\`JoinPoint\` was introduced briefly as the parameter type for \`@Before\` advice (see [[before-advice]]) — this topic looks at what it actually exposes and how to use it well, since almost every non-trivial aspect needs to inspect the call it's wrapping.

**What a \`JoinPoint\` represents:** the specific method invocation currently being intercepted. Every time \`JobService.save(job)\` is called and a pointcut matches it, Spring creates one \`JoinPoint\` object describing exactly that call.

**Key methods on \`JoinPoint\`:**
- \`getSignature()\` — returns a \`Signature\` object; \`.getName()\` gives the method name, \`.getDeclaringType()\` gives the class
- \`getArgs()\` — returns \`Object[]\` of the actual arguments passed to this call
- \`getTarget()\` — returns the actual object the method is being called on (the real bean, not the proxy)
- \`getThis()\` — returns the proxy object itself
- \`toString()\` — a readable one-line summary of the call, useful for quick logging

**Using it for argument-aware logging:**
\`\`\`java
@Before("execution(* com.example.service.*.*(..))")
public void logArgs(JoinPoint joinPoint) {
    String methodName = joinPoint.getSignature().getName();
    String className = joinPoint.getTarget().getClass().getSimpleName();
    Object[] args = joinPoint.getArgs();
    log.info("{}.{}({})", className, methodName, Arrays.toString(args));
}
\`\`\`
This produces output like \`JobService.save([Job{title=Backend Engineer}])\` — far more useful for debugging than a bare "method called" message, because it shows exactly which class, which method, and what was passed.

**\`JoinPoint\` vs \`ProceedingJoinPoint\`:** \`@Before\`, \`@After\`, \`@AfterReturning\`, and \`@AfterThrowing\` all receive a plain \`JoinPoint\` — read-only, observation only. \`@Around\` advice receives a \`ProceedingJoinPoint\` instead (see [[performance-monitoring-using-around-advice]]), which extends \`JoinPoint\` with one crucial extra method: \`proceed()\`, the ability to actually continue the call. This is the one method that separates "can only watch" advice from "can control" advice.`,
  code: `@Before("execution(* com.example.service.*.*(..))")
public void logDetailed(JoinPoint joinPoint) {
    Signature signature = joinPoint.getSignature();
    log.info("Class: {}", signature.getDeclaringType().getSimpleName());
    log.info("Method: {}", signature.getName());
    log.info("Args: {}", Arrays.toString(joinPoint.getArgs()));
    log.info("Target: {}", joinPoint.getTarget());
}`,
  codeTitle: 'Extracting method name, arguments, class, and target from a JoinPoint',
  points: [
    'A JoinPoint represents one specific matched method invocation, created fresh by Spring each time a pointcut matches a call.',
    'getSignature() gives the method name and declaring class; getArgs() gives the actual arguments passed to this specific call.',
    'getTarget() returns the real underlying bean, while getThis() returns the proxy object wrapping it - these are different objects.',
    'Every observation-only advice type (@Before, @After, @AfterReturning, @AfterThrowing) receives a plain JoinPoint.',
    '@Around advice receives a ProceedingJoinPoint instead, which adds the one extra method - proceed() - that lets the advice actually continue or skip the call.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling toString() on getArgs() results directly in a log statement can leak sensitive data (passwords, tokens) if any intercepted method happens to take them as parameters - be deliberate about which pointcuts get argument logging applied, rather than logging arguments for every method in the application blindly.' },
    { type: 'interview', content: 'Q: What is the key difference between the JoinPoint given to @Before advice and the ProceedingJoinPoint given to @Around advice?\nA: JoinPoint is read-only - it lets advice inspect the method name, arguments, and target, but not affect the call. ProceedingJoinPoint extends JoinPoint with a proceed() method, which is what actually lets @Around advice control whether, when, and how many times the underlying method executes.' },
  ],
}
