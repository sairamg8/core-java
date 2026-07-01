export default {
  id: 'ioc-and-di',
  title: '316. IoC and DI',
  explanation: `**Inversion of Control (IoC)** and **Dependency Injection (DI)** are the heart of Spring. Understanding them clearly is the single most important step in learning the framework.

**The problem: who creates the objects?**
In ordinary code, an object creates its own collaborators with \`new\`. That means the object is in control of building its dependencies — and it is tightly coupled to specific classes.

**Inversion of Control (IoC)** means flipping that responsibility. Instead of your object creating what it needs, an external **container** creates and supplies those objects. Control over object creation and wiring is *inverted* — moved from your code to the framework. Spring's container is the **ApplicationContext**.

**Dependency Injection (DI)** is *how* IoC is achieved. The container **injects** an object's dependencies into it rather than the object fetching or building them. There are three injection styles:
- **Constructor injection** — dependencies passed via the constructor (preferred). See [[constructor-injection]].
- **Setter injection** — dependencies set via setter methods. See [[setter-injection]].
- **Field injection** — injected directly into a field (convenient but harder to test).

**IoC vs DI — the relationship:** IoC is the *principle* (framework controls creation); DI is the *technique* Spring uses to implement it. People often use the terms interchangeably, but IoC is the broader idea and DI is the concrete mechanism.

**Why it matters:**
- **Loose coupling** — a class depends on an interface, not a concrete class; the container decides the implementation.
- **Testability** — inject a mock in tests instead of the real dependency.
- **Configurability** — change wiring without changing code.
- **Single responsibility** — classes focus on their job, not on assembling dependencies.`,
  code: `// WITHOUT IoC: the class controls creation (tight coupling)
class OrderService {
    private final PaymentGateway gateway = new StripeGateway(); // hard-wired
}

// WITH IoC + DI: the container controls creation and injects the dependency
class OrderService {
    private final PaymentGateway gateway;              // depends on an interface

    // Constructor injection: Spring passes in whatever PaymentGateway it manages
    OrderService(PaymentGateway gateway) {
        this.gateway = gateway;
    }
}

/* IoC  = Spring's container, not OrderService, decides which gateway to build.
   DI   = the gateway is handed ("injected") into OrderService's constructor.
   Result: swap StripeGateway for a MockGateway in tests, no code change. */`,
  codeTitle: 'IoC and DI in action',
  points: [
    'IoC = the framework (container), not your code, controls object creation and wiring',
    'DI = the mechanism for IoC — dependencies are injected into an object instead of built by it',
    'Three injection types: constructor (preferred), setter, and field injection',
    "Spring's IoC container is the ApplicationContext, which creates and manages beans",
    'Benefits: loose coupling, testability (mock injection), configurability, and single responsibility',
  ],
  callouts: [
    {
      type: 'interview',
      content: "Q: What is the difference between IoC and DI?\nA: IoC (Inversion of Control) is the broad principle that the framework, not your code, controls the creation and lifecycle of objects. DI (Dependency Injection) is the specific technique Spring uses to implement IoC — it supplies an object's dependencies to it (via constructor, setter, or field) instead of the object creating them itself. IoC is the goal; DI is the means.",
    },
    {
      type: 'gotcha',
      content: 'IoC does not mean "Spring runs your whole program." It specifically means Spring controls object creation and dependency wiring. Your business logic still runs your way — Spring just assembles the objects and hands them over ready to use.',
    },
  ],
}
