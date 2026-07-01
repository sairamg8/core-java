export default {
  id: 'spring-first-project',
  title: '321. Spring First Project',
  explanation: `Now we step back to the **classic Spring Framework** (without Boot) to understand what Boot does for you under the hood. Building a plain Spring project makes the **IoC container** concrete.

**What a classic (non-Boot) Spring project needs:**
1. **Dependencies** — add \`spring-context\` (which brings in core, beans, and the container) to your \`pom.xml\`.
2. **Bean configuration** — tell the container which objects to create. Classically this is an XML file, \`applicationContext.xml\`, placed in \`src/main/resources\`. See [[spring-bean-xml-config]].
3. **A main class** that **bootstraps the container**, loads the configuration, and asks it for a bean.

**Bootstrapping the container:** you create an \`ApplicationContext\` from the config file, then call \`getBean(...)\` to retrieve a fully-wired object. The container reads the config, instantiates each declared bean, injects their dependencies, and hands them to you ready to use.

\`\`\`
ApplicationContext context =
    new ClassPathXmlApplicationContext("applicationContext.xml");
Student s = context.getBean("student", Student.class);
\`\`\`

**The mental model:** the XML (or Java) config is the *recipe*; the \`ApplicationContext\` is the *kitchen* that follows the recipe to produce ready objects; \`getBean\` is you *collecting the finished dish*. You never call \`new Student()\` — the container does.

**Why do this the hard way once?** Spring Boot hides all three steps (auto-config replaces the XML, and it bootstraps the context for you). Seeing the manual version demystifies Boot: you understand that \`SpringApplication.run\` is just creating an ApplicationContext and scanning for beans.`,
  code: `// Classic Spring (no Boot): manually bootstrap the container in main()
public class App {
    public static void main(String[] args) {

        // 1) Create the IoC container from the XML config (the "recipe")
        ApplicationContext context =
            new ClassPathXmlApplicationContext("applicationContext.xml");

        // 2) Ask the container for a fully-built, fully-wired bean
        Student student = context.getBean("student", Student.class);

        // 3) Use it — you never called new Student() yourself
        student.study();

        // 4) Close the context to release resources
        ((ClassPathXmlApplicationContext) context).close();
    }
}`,
  codeTitle: 'Bootstrapping the IoC container by hand',
  points: [
    'A classic Spring project needs spring-context, a bean config (applicationContext.xml), and a bootstrap main',
    'ApplicationContext is the IoC container that reads the config and builds the beans',
    'Create it with new ClassPathXmlApplicationContext("applicationContext.xml")',
    'Retrieve a fully-wired object with context.getBean(name, Type.class) — never new',
    'Spring Boot hides all of this: SpringApplication.run creates the context and scans for beans',
  ],
  callouts: [
    {
      type: 'note',
      content: 'ApplicationContext is the IoC container. Its older, more basic cousin is BeanFactory; ApplicationContext extends it and adds enterprise features (event publishing, internationalisation, annotation processing, and eager bean creation). In practice you always use ApplicationContext.',
    },
    {
      type: 'tip',
      content: 'Building one classic XML-based project by hand is worth the effort even though you will use Boot in real work. It makes "the container creates and wires beans" tangible, so annotations and auto-configuration later feel like shortcuts rather than magic.',
    },
  ],
}
