export default {
  id: 'spring-object-creation',
  title: '323. Object Creation',
  explanation: `A key question: **when and how does Spring actually create the objects** for your beans? Understanding the timing removes a lot of confusion.

**The container creates beans, not you.** Once you declare \`<bean id="student" class="com.example.Student"/>\`, the container calls \`new Student()\` (via reflection) for you. You never write \`new\` — you call \`getBean("student")\` to receive the instance the container already built.

**When are singletons created? Eagerly, at startup.** By default every bean is a **singleton** (see [[spring-scopes]]), and Spring's \`ApplicationContext\` creates all singleton beans **eagerly** — the moment the context is initialised, *before* you ever call \`getBean\`. So this line alone triggers construction of every singleton:
\`\`\`
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
\`\`\`

**Proof:** put a print statement in a bean's constructor. You will see it fire during context creation, not when you call \`getBean\`.

**How the object is created — the default is the no-arg constructor.** Spring instantiates the bean using its default constructor unless you specify \`<constructor-arg>\` (constructor injection) or a factory method. That is why a bean class typically needs a public no-arg constructor when you use setter injection.

**One instance, reused.** Because singletons are cached, calling \`getBean("student")\` twice returns the **same** object. The container builds it once and hands out the same reference.

**Why eager creation is good:** configuration errors (missing dependency, wrong class) surface immediately at startup rather than later when a request first needs the bean. You can opt out per bean with lazy initialisation. See [[lazy-init-bean]].`,
  code: `public class Student {
    public Student() {                          // default no-arg constructor
        System.out.println("Student object created by Spring");
    }
}

public class App {
    public static void main(String[] args) {
        System.out.println("Before creating context");

        ApplicationContext ctx =
            new ClassPathXmlApplicationContext("applicationContext.xml");
        // ^ "Student object created by Spring" ALREADY printed here (eager singleton)

        System.out.println("After context, before getBean");

        Student a = ctx.getBean("student", Student.class);
        Student b = ctx.getBean("student", Student.class);
        System.out.println(a == b);   // true — same singleton instance returned twice
    }
}`,
  codeTitle: 'Eager singleton creation at context startup',
  points: [
    'The container instantiates beans for you via reflection — you call getBean, never new',
    'By default beans are singletons and are created eagerly when the ApplicationContext is initialised',
    'Bean constructors run during context creation, before any getBean call (verify with a print)',
    'Spring uses the no-arg constructor by default unless constructor-arg or a factory method is given',
    'getBean returns the same cached singleton instance every time (a == b is true)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: When does Spring create singleton beans — lazily on first use, or eagerly at startup?\nA: Eagerly. ApplicationContext instantiates all singleton beans when the context is initialised, before any getBean call. This surfaces configuration errors immediately at startup. You can override this per bean with lazy-init (or @Lazy) so the bean is created only on first request.',
    },
    {
      type: 'gotcha',
      content: 'If a singleton bean uses setter injection, its class usually needs a public no-arg constructor, because Spring first creates the object with new and then calls the setters. Removing the no-arg constructor (e.g. by adding only a parameterised one) will break setter-based beans with an instantiation error.',
    },
  ],
}
