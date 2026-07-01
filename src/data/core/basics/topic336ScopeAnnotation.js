export default {
  id: 'scope-annotation',
  title: '336. Scope Annotation',
  explanation: `A bean's **scope** decides **how many instances** the container creates and **how long** each lives. With annotations you set it using **\`@Scope\`** on the \`@Component\` or \`@Bean\` — the annotation-based equivalent of the XML \`scope\` attribute (see [[spring-scopes]]).

**The two core scopes:**
- **\`singleton\`** (default) — **one** shared instance per container. Every injection and every \`getBean\` returns the **same** object.
- **\`prototype\`** — a **new** instance **every time** the bean is requested (injected or fetched).

**Usage:**
\`\`\`java
@Component
@Scope("prototype")
public class ReportBuilder { }

// or with a @Bean method
@Bean
@Scope("singleton")
public StudentService studentService() { return new StudentService(); }
\`\`\`

**Web-only scopes** (available in a web application context): \`request\` (one bean per HTTP request), \`session\` (one per HTTP session), \`application\` (one per \`ServletContext\`).

**Singleton vs prototype behaviour:**
\`\`\`java
ReportBuilder a = ctx.getBean(ReportBuilder.class);
ReportBuilder b = ctx.getBean(ReportBuilder.class);
// singleton: a == b   (same object)
// prototype: a != b   (two different objects)
\`\`\`

**Gotchas:**
- **Default is singleton** — most beans (services, repositories) are stateless and singleton is correct.
- **Prototype lifecycle is partial** — Spring creates and wires a prototype but does **not** manage its destruction; \`@PreDestroy\` is not called on prototypes.
- **Prototype inside a singleton** — a singleton captures **one** prototype instance at construction, defeating "new every time". To get a fresh one per call, use a provider/lookup rather than a plain injected field.`,
  code: `@Component
@Scope("prototype")
public class ReportBuilder {
    public ReportBuilder() { System.out.println("new ReportBuilder"); }
}

ApplicationContext ctx =
    new AnnotationConfigApplicationContext(AppConfig.class);

ReportBuilder a = ctx.getBean(ReportBuilder.class);  // prints "new ReportBuilder"
ReportBuilder b = ctx.getBean(ReportBuilder.class);  // prints again -> new object
System.out.println(a == b);   // false for prototype, true for singleton

// Constant-based, refactor-safe form:
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)`,
  codeTitle: '@Scope on a component',
  points: [
    '@Scope sets how many instances Spring creates and how long they live',
    'singleton (the default) shares one instance per container across all injections',
    'prototype produces a brand-new instance on every request or injection',
    'Web contexts add request, session, and application scopes',
    'Spring does not destroy prototype beans, so @PreDestroy is never called on them',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What does @Scope("prototype") do and how does it differ from the default?\nA: The default scope is singleton — one shared instance per container returned on every request. @Scope("prototype") tells Spring to create a fresh instance each time the bean is injected or fetched. Spring fully manages singleton lifecycle including destruction, but for prototypes it only creates and wires the bean and does not call destruction callbacks.',
    },
    {
      type: 'gotcha',
      content: 'Injecting a prototype bean into a singleton does not give you a new instance per method call — the singleton is built once and keeps the single prototype it received. Use a provider (ObjectProvider, @Lookup, or ApplicationContext.getBean) when you truly need a fresh prototype on each use.',
    },
  ],
}
