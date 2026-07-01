export default {
  id: 'spring-scopes',
  title: '324. Scopes',
  explanation: `A bean's **scope** controls **how many instances** the container creates and **how long each lives**. Choosing the right scope matters for correctness and performance.

**The two core scopes:**
- **singleton (default):** exactly **one** shared instance per container. Every injection and every \`getBean\` returns the same object. Created eagerly at startup. Ideal for stateless services (\`@Service\`, \`@Repository\`) — the vast majority of beans.
- **prototype:** a **new** instance every time the bean is requested (each \`getBean\` or injection point). Use it for stateful objects that must not be shared.

**Web-only scopes** (available in a web application context):
- **request** — one instance per HTTP request.
- **session** — one instance per HTTP session.
- **application** — one instance per servlet context.
- **websocket** — one instance per WebSocket session.

**Declaring a scope:**
\`\`\`
<bean id="cart" class="com.example.Cart" scope="prototype"/>
\`\`\`
With annotations: \`@Scope("prototype")\` alongside \`@Component\`.

**Singleton vs prototype — the practical difference:** with \`singleton\`, two \`getBean\` calls return the same object (\`a == b\` is \`true\`); with \`prototype\`, they return different objects (\`a == b\` is \`false\`).

**Important prototype caveat:** Spring creates a prototype bean and hands it over, but does **not** manage its full lifecycle afterwards — it does **not** call destroy methods on prototypes. Also, a prototype injected into a singleton is created **only once** (when the singleton is built), so it is effectively shared unless you use a provider/lookup to get fresh instances.`,
  code: `<!-- Singleton (default): one shared instance -->
<bean id="appConfig" class="com.example.AppConfig"/>

<!-- Prototype: a fresh instance on every request -->
<bean id="cart" class="com.example.Cart" scope="prototype"/>

// Behaviour difference:
Cart c1 = ctx.getBean("cart", Cart.class);
Cart c2 = ctx.getBean("cart", Cart.class);
System.out.println(c1 == c2);   // false  -> prototype gives new instances

AppConfig a1 = ctx.getBean("appConfig", AppConfig.class);
AppConfig a2 = ctx.getBean("appConfig", AppConfig.class);
System.out.println(a1 == a2);   // true   -> singleton reuses one instance

// Annotation form:
// @Component @Scope("prototype")
// public class Cart { ... }`,
  codeTitle: 'Singleton vs prototype scope',
  points: [
    'Scope controls how many instances exist and how long they live',
    'singleton (default): one shared instance per container, created eagerly — best for stateless services',
    'prototype: a new instance on every request — use for stateful, non-shareable objects',
    'Web scopes (request, session, application, websocket) exist only in a web context',
    'Set scope with scope="prototype" in XML or @Scope("prototype") with annotations',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Injecting a prototype bean into a singleton does NOT give you a fresh instance each time you use it. The prototype is injected once, when the singleton is created, and that same instance is reused. To get new prototypes on demand from a singleton, use ObjectProvider, a @Lookup method, or an explicit getBean call.',
    },
    {
      type: 'interview',
      content: 'Q: What is the default bean scope in Spring, and how does prototype differ?\nA: The default is singleton — one shared instance per container, created eagerly at startup and returned for every request. prototype creates a new instance every time the bean is requested. Spring also fully manages the singleton lifecycle (including destroy callbacks) but does not call destroy methods on prototype beans.',
    },
  ],
}
