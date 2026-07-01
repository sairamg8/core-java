export default {
  id: 'spring-xml-autowiring',
  title: '329. Autowiring',
  explanation: `In classic XML Spring, **autowiring** lets the container wire bean dependencies **automatically** instead of you writing every \`<property ref="...">\` by hand. You enable it with the \`autowire\` attribute on a \`<bean>\`.

**The autowire modes:**
- **\`no\`** (default) — no autowiring; you wire everything explicitly with \`ref\`.
- **\`byName\`** — for each property, Spring looks for a bean whose **id matches the property name**. Property \`course\` → looks for a bean with \`id="course"\` and calls \`setCourse\`.
- **\`byType\`** — Spring looks for a bean whose **type matches the property type**. If exactly one bean of that type exists, it is injected; if **more than one** exists, Spring throws an ambiguity error.
- **\`constructor\`** — like \`byType\` but applied to **constructor arguments**.

\`\`\`
<bean id="course" class="com.example.Course"/>
<bean id="student" class="com.example.Student" autowire="byType"/>
<!-- Spring sees Student needs a Course and injects the course bean automatically -->
\`\`\`

**byName vs byType — the trade-off:**
- \`byName\` is predictable (matches on id) but requires your bean ids to match property names.
- \`byType\` is convenient but breaks when two beans share a type — resolve with \`<qualifier>\` or by making one the primary/autowire-candidate.

**Relation to annotations:** XML \`autowire="byType"\` is the ancestor of the \`@Autowired\` annotation, which also resolves **by type** first and falls back to name. Understanding XML autowiring explains exactly what \`@Autowired\` does under the hood. See [[autowiring-in-spring-boot]].

**Note:** XML autowiring is largely historical; modern code uses \`@Autowired\`/component scanning. But it clarifies the by-name vs by-type resolution rules you meet with annotations.`,
  code: `<!-- Without autowiring: explicit wiring -->
<bean id="course" class="com.example.Course"/>
<bean id="student" class="com.example.Student">
    <property name="course" ref="course"/>       <!-- wired by hand -->
</bean>

<!-- autowire="byType": match a bean whose type is Course -->
<bean id="course" class="com.example.Course"/>
<bean id="student" class="com.example.Student" autowire="byType"/>

<!-- autowire="byName": match a bean whose id equals the property name "course" -->
<bean id="course" class="com.example.Course"/>
<bean id="student" class="com.example.Student" autowire="byName"/>

<!-- autowire="constructor": byType applied to constructor arguments -->
<bean id="student2" class="com.example.Student" autowire="constructor"/>`,
  codeTitle: 'XML autowire modes',
  points: [
    'The autowire attribute lets Spring wire dependencies automatically instead of explicit ref',
    'byName matches a bean whose id equals the property name; byType matches by property type',
    'constructor mode is byType applied to constructor arguments',
    'byType fails with an ambiguity error when two beans share the same type',
    'XML autowiring is the conceptual ancestor of the @Autowired annotation (type-first resolution)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'autowire="byType" throws NoUniqueBeanDefinitionException if two beans of the same type are defined, because Spring cannot decide which one to inject. Either remove the ambiguity, mark one as primary, exclude one from autowire candidacy, or switch to byName so the match is by bean id instead of type.',
    },
    {
      type: 'interview',
      content: 'Q: How does XML byType autowiring relate to the @Autowired annotation?\nA: Both resolve dependencies by type first. @Autowired is essentially the annotation-driven equivalent of autowire="byType": Spring looks for a single bean whose type matches the injection point, and if several match it needs a tiebreaker (@Primary or @Qualifier), just as byType needs disambiguation in XML.',
    },
  ],
}
