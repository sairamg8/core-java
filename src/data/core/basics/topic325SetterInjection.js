export default {
  id: 'setter-injection',
  title: '325. Setter Injection',
  explanation: `**Setter injection** is dependency injection performed through a class's **setter methods**. The container first creates the object with its no-arg constructor, then calls each setter to supply values and dependencies.

**In XML** you use \`<property>\` inside the \`<bean>\`:
- \`<property name="x" value="literal"/>\` — injects a literal value.
- \`<property name="y" ref="otherBean"/>\` — injects another bean. See [[ref-attribute]].

The \`name\` attribute maps to the **setter, not the field**: \`name="course"\` calls \`setCourse(...)\`. Spring uses JavaBean naming conventions, so the class must expose a matching public setter.

**How it works step by step:**
1. Container calls \`new Student()\` (no-arg constructor).
2. For each \`<property>\`, it calls the matching setter, e.g. \`setName("Asha")\`, \`setCourse(courseBean)\`.
3. The fully-populated bean is registered and returned by \`getBean\`.

**When to use setter injection:**
- **Optional dependencies** — the object is valid without them; the setter may or may not be called.
- **Reconfigurable dependencies** — a value that might legitimately change.
- Working with legacy code that already exposes setters.

**Trade-offs vs constructor injection:** setters cannot be \`final\`, and the object can exist in a partially-initialised state (created but setters not yet all called), so a required dependency could be missing. For **mandatory** dependencies, prefer constructor injection (see [[constructor-injection]]); use setters for genuinely optional ones.`,
  code: `// The bean needs a no-arg constructor and public setters
public class Student {
    private String name;
    private Course course;

    public Student() { }                       // Spring calls this first
    public void setName(String name) { this.name = name; }      // then this
    public void setCourse(Course course) { this.course = course; }  // and this
}

<!-- XML: property name maps to the SETTER (setName, setCourse) -->
<bean id="course" class="com.example.Course">
    <property name="title" value="Spring Core"/>
</bean>

<bean id="student" class="com.example.Student">
    <property name="name" value="Asha"/>       <!-- calls setName("Asha") -->
    <property name="course" ref="course"/>     <!-- calls setCourse(courseBean) -->
</bean>`,
  codeTitle: 'Setter injection via <property>',
  points: [
    'Setter injection supplies dependencies by calling the setter methods after construction',
    'Container flow: no-arg constructor first, then each <property> maps to a setter call',
    '<property name="x"> targets setX(...), following JavaBean naming — not the field directly',
    'Use value="..." for literals and ref="..." to inject another bean',
    'Best for optional/reconfigurable dependencies; use constructor injection for mandatory ones',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The property name must match the setter name, not the field name. <property name="course"> calls setCourse(...) regardless of what the private field is called. If the setter is missing or misnamed, Spring throws "Invalid property" / NotWritablePropertyException even though the field exists.',
    },
    {
      type: 'interview',
      content: 'Q: With setter injection, can a bean be in an incompletely initialised state?\nA: Yes. Spring first constructs the object with its no-arg constructor and then calls the setters, so between construction and the setter calls a dependency is null. Because setters are optional to call, a required dependency could be forgotten. That is why constructor injection is preferred for mandatory dependencies — the object cannot be created without them.',
    },
  ],
}
