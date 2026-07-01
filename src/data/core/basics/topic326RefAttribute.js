export default {
  id: 'ref-attribute',
  title: '326. Ref Attribute',
  explanation: `When one bean depends on **another bean**, you wire them together with the **\`ref\`** attribute. This is how Spring injects object dependencies (as opposed to \`value\`, which injects literals).

**value vs ref — the key distinction:**
- \`<property name="title" value="Spring Core"/>\` → injects the **literal string** "Spring Core".
- \`<property name="course" ref="course"/>\` → injects the **bean whose id is \`course\`**.

So \`ref\` holds the **id of another \`<bean>\`** declared in the same context. Spring looks up that bean and passes the actual object reference to the setter (or constructor-arg).

**Wiring a dependency graph:** a \`Student\` needs a \`Course\`; a \`Course\` might need an \`Instructor\`. Each relationship is a \`ref\` pointing at the collaborating bean's id. The container resolves the whole graph and injects real, fully-built objects.

\`\`\`
<bean id="instructor" class="com.example.Instructor"/>
<bean id="course" class="com.example.Course">
    <property name="instructor" ref="instructor"/>
</bean>
<bean id="student" class="com.example.Student">
    <property name="course" ref="course"/>
</bean>
\`\`\`

**\`ref\` works for both injection styles:**
- Setter injection: \`<property name="course" ref="course"/>\`.
- Constructor injection: \`<constructor-arg ref="course"/>\`. See [[constructor-injection]].

**Common mistake:** the value of \`ref\` must exactly match an existing bean \`id\`. A mismatch (typo, or the target bean not declared) produces \`NoSuchBeanDefinitionException\` at startup — Spring cannot find a bean with that id to inject.`,
  code: `<!-- value = literal;  ref = another bean's id -->
<bean id="instructor" class="com.example.Instructor">
    <property name="name" value="Dr. Rao"/>        <!-- literal string -->
</bean>

<bean id="course" class="com.example.Course">
    <property name="title" value="Spring Core"/>   <!-- literal string -->
    <property name="instructor" ref="instructor"/> <!-- inject the instructor bean -->
</bean>

<bean id="student" class="com.example.Student">
    <property name="name" value="Asha"/>           <!-- literal string -->
    <property name="course" ref="course"/>         <!-- inject the course bean -->
</bean>

<!-- Spring resolves the graph: student -> course -> instructor -->`,
  codeTitle: 'Wiring beans together with ref',
  points: [
    'Use value="..." to inject a literal and ref="..." to inject another bean',
    'The ref attribute holds the id of another <bean> in the same context',
    'Spring looks up that bean and injects the actual object reference',
    'ref works with both <property> (setter) and <constructor-arg> (constructor)',
    'ref must exactly match an existing bean id, or startup fails with NoSuchBeanDefinitionException',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A frequent beginner bug is using value where ref is needed. <property name="course" value="course"/> injects the literal string "course" (and fails type conversion or gives wrong data), whereas <property name="course" ref="course"/> injects the actual Course bean. Remember: value = plain data, ref = a bean reference.',
    },
    {
      type: 'interview',
      content: "Q: What is the difference between the value and ref attributes in a Spring bean's <property>?\nA: value injects a literal (a string, number, or boolean) that Spring converts to the property type, while ref injects a reference to another bean by its id. Use value for simple data and ref to wire one bean into another to build the object dependency graph.",
    },
  ],
}
