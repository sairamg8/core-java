export default {
  id: 'bean-name',
  title: '335. Bean Name',
  explanation: `Every bean in the container has at least one **name** (also called its **id**). The name is how you refer to the bean — for \`getBean("name")\`, for \`ref="name"\` in XML, and for \`@Qualifier("name")\` in annotations.

**How the name is decided:**
- **\`@Bean\` method** → the **method name** is the bean id. \`public StudentService studentService()\` → id \`studentService\`.
- **\`@Component\` class** → the **class name with a lowercase first letter**. \`class StudentService\` → id \`studentService\`. (\`URLParser\` is a special case kept as \`URLParser\`.)
- **XML \`<bean>\`** → the explicit \`id\` (or \`name\`) attribute.

**Overriding the default name:**
\`\`\`java
@Bean(name = "primaryStudentService")
public StudentService studentService() { ... }

@Component("studentSvc")
public class StudentService { ... }
\`\`\`

**Aliases — one bean, several names:** a bean can have multiple names. The first is the id, the rest are aliases; any of them resolves to the same instance.
\`\`\`java
@Bean(name = {"studentService", "svc", "studentSvc"})
\`\`\`
\`\`\`xml
<bean id="studentService" name="svc,studentSvc" class="..."/>
\`\`\`

**Why the name matters:**
- It disambiguates when several beans share a type — \`@Qualifier("studentSvc")\` picks one (see [[primary-and-qualifier]]).
- It must be **unique**; two beans with the same id cause a conflict / override at startup.
- Prefer resolving by type where you can, and reach for explicit names only when a type is ambiguous or you want a stable, readable handle.`,
  code: `// Default name = method name -> "studentService"
@Bean
public StudentService studentService() { return new StudentService(); }

// Explicit single name
@Bean(name = "primaryStudentService")
public StudentService buildService() { return new StudentService(); }

// Multiple names: first is id, rest are aliases
@Bean(name = {"studentService", "svc", "studentSvc"})
public StudentService svc() { return new StudentService(); }

// @Component default name = class name, first letter lowercased -> "orderService"
@Component
public class OrderService { }

// Override the component name
@Component("orders")
public class OrderService2 { }`,
  codeTitle: 'Default and explicit bean names',
  points: [
    'A @Bean method takes the method name as its bean id by default',
    'A @Component class takes the class name with a lowercased first letter as its id',
    'Override the id with @Bean(name=...) or @Component("...") or the XML id attribute',
    'A bean may have several names — the first is the id and the rest are aliases resolving to the same instance',
    'Bean names must be unique and are used by getBean, ref, and @Qualifier to select a specific bean',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How is a bean name determined in Spring?\nA: For a @Bean method the id defaults to the method name; for a @Component class it defaults to the simple class name with a lowercased first letter; for an XML bean it is the id attribute. You can override any of these, and a bean can carry multiple names where the first is the id and the others are aliases. Names must be unique and are used to fetch or qualify a specific bean.',
    },
    {
      type: 'gotcha',
      content: 'Two beans with the same name collide — depending on configuration Spring either overrides one silently or throws at startup. Give beans distinct ids, and remember renaming a @Bean method or @Component class changes its default id, which can break @Qualifier("oldName") references.',
    },
  ],
}
