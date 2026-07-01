export default {
  id: 'constructor-injection',
  title: '327. Constructor Injection',
  explanation: `**Constructor injection** supplies a bean's dependencies through its **constructor** at creation time. The container reads the \`<constructor-arg>\` elements, builds the argument list, and calls the matching constructor — so the object is **fully initialised the moment it exists**.

**In XML** you use \`<constructor-arg>\` instead of \`<property>\`:
- \`<constructor-arg value="literal"/>\` — a literal argument.
- \`<constructor-arg ref="otherBean"/>\` — inject another bean.

\`\`\`
<bean id="student" class="com.example.Student">
    <constructor-arg value="Asha"/>
    <constructor-arg ref="course"/>
</bean>
\`\`\`

**Resolving multiple arguments.** With several constructor args, order can be ambiguous. You can pin them down with:
- **\`index\`** — \`<constructor-arg index="0" value="Asha"/>\` (zero-based position).
- **\`name\`** — \`<constructor-arg name="course" ref="course"/>\` (matches the parameter name).
- **\`type\`** — \`<constructor-arg type="int" value="3"/>\` (matches by parameter type).

**Why constructor injection is preferred (the modern default):**
- **Immutability** — dependencies can be \`final\`; they cannot be changed after construction.
- **Guaranteed completeness** — the object cannot be created without its required dependencies, so there is no half-initialised state.
- **Easier testing** — in a unit test you just call \`new Student("Asha", mockCourse)\`; no Spring context needed.
- **Clear contract** — the constructor signature documents exactly what the class requires.

**Setter vs constructor:** use **constructor** injection for **mandatory** dependencies and **setter** injection for **optional** ones. See [[setter-injection]].`,
  code: `// The bean exposes a constructor that takes its dependencies
public class Student {
    private final String name;      // final -> immutable, set once
    private final Course course;

    public Student(String name, Course course) {   // no no-arg constructor needed
        this.name = name;
        this.course = course;
    }
}

<bean id="course" class="com.example.Course">
    <constructor-arg value="Spring Core"/>
</bean>

<bean id="student" class="com.example.Student">
    <constructor-arg index="0" value="Asha"/>   <!-- name -->
    <constructor-arg index="1" ref="course"/>   <!-- course bean -->
</bean>

// Unit test needs no Spring at all:
//   Student s = new Student("Asha", new Course("Spring Core"));`,
  codeTitle: 'Constructor injection via <constructor-arg>',
  points: [
    'Constructor injection passes dependencies through the constructor with <constructor-arg>',
    'Use value="..." for literals and ref="..." to inject another bean, just like <property>',
    'Disambiguate multiple args with index, name, or type attributes',
    'Preferred style: allows final fields, guarantees a fully-initialised object, and is easy to test',
    'Use constructor injection for mandatory dependencies, setter injection for optional ones',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why is constructor injection generally preferred over setter or field injection?\nA: Because it guarantees the object is fully initialised with all required dependencies the moment it is created (no half-built state), it lets dependency fields be final and therefore immutable, it makes the class contract explicit in the constructor signature, and it makes unit testing trivial since you just pass mocks to the constructor with plain new — no Spring context required.',
    },
    {
      type: 'gotcha',
      content: 'With multiple constructor arguments of similar types, Spring can mis-match them by position. If you see the wrong value landing in the wrong parameter, add index (index="0") or name/type attributes to <constructor-arg> to make the mapping explicit rather than relying on declaration order.',
    },
  ],
}
