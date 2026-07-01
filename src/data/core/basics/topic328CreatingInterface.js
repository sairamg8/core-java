export default {
  id: 'spring-creating-interface',
  title: '328. Creating Interface',
  explanation: `The real power of Spring DI shows up when you **inject an interface** rather than a concrete class. This is the "program to an interface" principle put into practice, and it is why Spring makes code loosely coupled.

**The pattern:**
1. Define an **interface** describing a capability (e.g. \`PaymentGateway\`).
2. Write one or more **implementations** (\`StripeGateway\`, \`PaypalGateway\`).
3. Have consumers depend on the **interface type**, not any implementation.
4. Let Spring inject a concrete implementation bean at runtime.

\`\`\`
public interface MessageService {
    void send(String msg);
}

public class EmailService implements MessageService {
    public void send(String msg) { /* send email */ }
}
\`\`\`

**Wiring by interface (XML):** the consumer's property/constructor-arg refers to a bean that *implements* the interface. The consumer field is typed as the interface:
\`\`\`
<bean id="emailService" class="com.example.EmailService"/>
<bean id="notifier" class="com.example.Notifier">
    <constructor-arg ref="emailService"/>   <!-- injected as MessageService -->
</bean>
\`\`\`

**Why this matters:**
- **Swappable implementations** — change one XML line (or one \`@Qualifier\`) to switch from email to SMS; the consumer code never changes.
- **Testability** — inject a mock \`MessageService\` in tests.
- **Open/closed design** — add new implementations without touching existing consumers.

**With annotations:** mark each implementation \`@Component\`/\`@Service\` and autowire the interface. If several implementations exist, Spring needs help choosing — use \`@Primary\` (see [[primary-bean]]) or \`@Qualifier\`. See [[autowiring-in-spring-boot]].`,
  code: `// 1) The interface — consumers depend on THIS type
public interface MessageService {
    void send(String msg);
}

// 2) An implementation
public class EmailService implements MessageService {
    public void send(String msg) { System.out.println("Email: " + msg); }
}

// 3) Consumer depends on the interface, not EmailService
public class Notifier {
    private final MessageService service;         // interface type
    public Notifier(MessageService service) {     // Spring injects an implementation
        this.service = service;
    }
    public void notifyUser() { service.send("Welcome!"); }
}

<!-- 4) Wire the implementation in; Notifier never names EmailService -->
<bean id="emailService" class="com.example.EmailService"/>
<bean id="notifier" class="com.example.Notifier">
    <constructor-arg ref="emailService"/>
</bean>`,
  codeTitle: 'Injecting an interface, not an implementation',
  points: [
    'Define an interface, write implementations, and have consumers depend on the interface type',
    'Spring injects a concrete implementation bean wherever the interface is required',
    'Swapping implementations means changing one wiring line, not the consumer code',
    'Coding to an interface enables mocking in tests and open/closed extensibility',
    'With annotations, multiple implementations need @Primary or @Qualifier to resolve the choice',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'This is the single most valuable Spring habit: type your fields and constructor parameters as interfaces, not concrete classes. It lets the container (and your tests) supply any implementation, which is exactly what makes Spring applications loosely coupled and easy to change.',
    },
    {
      type: 'interview',
      content: 'Q: Why do Spring applications inject dependencies by interface type?\nA: So the consuming class depends only on a contract, not a specific implementation. The container decides which implementation bean to inject, so you can swap implementations, provide mocks in tests, and add new implementations without modifying existing code — achieving loose coupling and adherence to the dependency-inversion principle.',
    },
  ],
}
