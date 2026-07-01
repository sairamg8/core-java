export default {
  id: 'spring-docs',
  title: '313. Spring Docs',
  explanation: `Spring is large, and the **official documentation** at **spring.io** is your primary reference. Knowing how to navigate it is a real skill — the docs are excellent but vast.

**Key places to know:**
- **spring.io/projects** — the catalog of every Spring project (Framework, Boot, Data, Security, Cloud, etc.). Each project has its own reference manual and version list.
- **Reference documentation** — the long-form manual for a project (e.g. the "Spring Framework Reference" or "Spring Boot Reference"). This explains concepts with prose and examples.
- **API / Javadoc** — the class-and-method-level reference. Use it to look up a specific annotation, interface, or method signature.
- **Guides (spring.io/guides)** — short, task-focused "Getting Started" tutorials ("Building a RESTful Web Service", "Accessing Data with JPA"). Great for learning by doing.
- **start.spring.io (Spring Initializr)** — not docs exactly, but the tool that generates a ready-to-run Boot project with the dependencies you pick. See [[first-spring-boot-app]].

**How to read version-specific docs:** Spring evolves quickly. Always confirm you are reading the docs for the version you actually use (the version selector is usually at the top of the reference manual). A feature or property in one version may differ or not exist in another.

**Practical workflow:**
1. Learning a concept → read the **Reference** section for it.
2. Need a specific annotation's attributes or a method signature → check the **Javadoc/API**.
3. Want a working starting point → follow a **Getting Started guide** or generate a project on **Initializr**.

Getting comfortable with the docs early pays off constantly, because no course covers every property, annotation, or edge case you will meet in real projects.`,
  code: `// Typical documentation entry points (bookmark these):
//
// https://spring.io/projects            -> all Spring projects
// https://spring.io/guides              -> short getting-started tutorials
// https://start.spring.io               -> Spring Initializr project generator
// https://docs.spring.io/spring-boot/   -> Spring Boot reference + Javadoc
// https://docs.spring.io/spring-framework/reference/  -> core framework manual
//
// Tip: when Googling, add the version, e.g.
//   "spring boot 3 @ConfigurationProperties reference"
// so you land on docs matching the code you actually run.`,
  codeTitle: 'Where to find things in the Spring docs',
  points: [
    'spring.io/projects lists every Spring project, each with its own reference manual and Javadoc',
    'Reference docs explain concepts in prose; Javadoc/API docs give class and method details',
    'spring.io/guides offers short, task-focused Getting Started tutorials',
    'start.spring.io (Spring Initializr) generates a ready-to-run project with your chosen dependencies',
    'Always match the docs version to the Spring/Boot version you are actually using',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'When searching online for Spring help, include the major version (e.g. "Spring Boot 3") in your query. Spring changed a lot between versions (Java EE to Jakarta EE package renames, new property names), and following an old tutorial against a new version is a common source of confusing errors.',
    },
  ],
}
