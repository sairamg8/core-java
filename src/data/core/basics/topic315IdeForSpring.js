export default {
  id: 'ide-for-spring',
  title: '315. IDE for Spring',
  explanation: `An **IDE (Integrated Development Environment)** makes Spring development far smoother by handling dependencies, autocompletion, running the app, and debugging. You can write Spring in any editor, but a good IDE saves enormous time.

**The main choices:**
- **IntelliJ IDEA** — the most popular choice for Spring today. The **Ultimate** edition has first-class Spring support (bean navigation, auto-config hints, endpoint views), while the free **Community** edition works fine for most learning (you just lose some Spring-specific tooling).
- **Spring Tool Suite (STS)** — a free, Eclipse-based IDE from the Spring team, pre-loaded with Spring tooling. A solid free option with strong Spring integration.
- **Eclipse + Spring Tools plugin** — plain Eclipse with the Spring Tools 4 plugin added.
- **VS Code + Spring Boot Extension Pack** — lightweight and popular; good if you prefer VS Code.

**What good Spring tooling gives you:**
- **Bean and dependency navigation** — jump from an \`@Autowired\` field to the bean that satisfies it.
- **application.properties / .yml autocompletion** — suggestions and validation for configuration keys.
- **Run / Debug support** — start the app, hit breakpoints, hot-reload with DevTools.
- **Spring Initializr integration** — create a new Boot project directly inside the IDE.
- **Maven/Gradle integration** — automatic dependency downloads and refresh.

**Recommendation for beginners:** IntelliJ IDEA (Community is free and enough to learn) or Spring Tool Suite if you want free, Spring-specialised tooling out of the box. Whichever you pick, make sure a **JDK 17+** is configured as the project SDK.`,
  code: `// Whatever IDE you choose, the essentials to configure:
//
// 1) Project SDK  -> JDK 17 or newer (required by Spring Boot 3.x)
// 2) Build tool   -> import as a Maven (or Gradle) project so
//                    dependencies download automatically
// 3) Run config   -> run the class annotated with @SpringBootApplication
//
// In IntelliJ:  File > New > Project > Spring Initializr
// In STS:       File > New > Spring Starter Project
// Both talk to start.spring.io under the hood.`,
  codeTitle: 'Baseline IDE setup for Spring',
  points: [
    'IntelliJ IDEA is the most popular Spring IDE; Community edition is free and fine for learning',
    'Spring Tool Suite (STS) is a free, Eclipse-based IDE pre-loaded with Spring tooling',
    'VS Code with the Spring Boot Extension Pack is a lightweight alternative',
    'Good tooling adds bean navigation, properties autocompletion, run/debug, and Initializr integration',
    'Whatever you choose, configure a JDK 17+ as the project SDK for modern Spring Boot 3',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'IntelliJ Community edition can absolutely build and run Spring Boot apps — the paid Ultimate edition mainly adds convenience features like bean diagrams and endpoint views, not required functionality. Do not let the "Ultimate needed" myth stop you from learning on the free edition.',
    },
  ],
}
