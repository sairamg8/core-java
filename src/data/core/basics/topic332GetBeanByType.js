export default {
  id: 'getbean-by-type',
  title: '332. getBean() by Type',
  explanation: `The \`ApplicationContext\` gives you several overloads of \`getBean\` to fetch a bean from the container. Two are common: **by name** and **by type**.

**By name (String id):**
\`\`\`java
Object o = ctx.getBean("studentService");
StudentService s = (StudentService) o;   // manual cast needed
\`\`\`
You pass the bean id and get back \`Object\`, so you must cast.

**By type (Class):**
\`\`\`java
StudentService s = ctx.getBean(StudentService.class);   // no cast
\`\`\`
Spring finds the single bean assignable to that type and returns it already typed — cleaner and type-safe.

**The rule for by-type lookup:** there must be **exactly one** bean of that type in the container.
- **Zero matches** → \`NoSuchBeanDefinitionException\`.
- **More than one match** → \`NoUniqueBeanDefinitionException\` — Spring cannot decide which one you meant.

**Combine name + type** to be explicit and avoid the cast at the same time:
\`\`\`java
StudentService s = ctx.getBean("studentService", StudentService.class);
\`\`\`

**By-type also matches by interface.** If \`StudentServiceImpl\` implements \`StudentService\`, then \`getBean(StudentService.class)\` returns that implementation. This is the same resolution logic that powers \`@Autowired\` field injection — autowiring is essentially by-type \`getBean\` behind the scenes (see [[autowiring]]).`,
  code: `ApplicationContext ctx =
    new ClassPathXmlApplicationContext("applicationContext.xml");

// 1) By name — returns Object, needs a cast
StudentService a = (StudentService) ctx.getBean("studentService");

// 2) By type — returns the typed bean, no cast
StudentService b = ctx.getBean(StudentService.class);

// 3) By name AND type — explicit id, no cast
StudentService c = ctx.getBean("studentService", StudentService.class);

// If TWO beans implement StudentService, (2) throws:
//   NoUniqueBeanDefinitionException: expected single matching bean but found 2
// Fix: use (1) or (3) with the specific id, or mark one @Primary.`,
  codeTitle: 'getBean by name vs by type',
  points: [
    'getBean(Class) returns an already-typed bean, so no manual cast is needed',
    'By-type lookup requires exactly one matching bean, otherwise it throws',
    'Zero matches throws NoSuchBeanDefinitionException; multiple matches throws NoUniqueBeanDefinitionException',
    'getBean(name, Class) combines an explicit id with a type-safe return',
    'By-type resolution matches implementations of an interface, the same logic used by @Autowired',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between getBean by name and getBean by type?\nA: getBean(String) looks up a bean by its id and returns Object, so the caller must cast. getBean(Class) resolves by type and returns the bean already typed, but it requires exactly one bean assignable to that type in the container. If none match it throws NoSuchBeanDefinitionException, and if several match it throws NoUniqueBeanDefinitionException. getBean(name, Class) combines both for an explicit, cast-free lookup.',
    },
    {
      type: 'gotcha',
      content: 'getBean by type fails when two beans share the same type or interface. Either look them up by name, use the getBean(name, Class) overload, or designate one bean @Primary so it wins the by-type resolution.',
    },
  ],
}
