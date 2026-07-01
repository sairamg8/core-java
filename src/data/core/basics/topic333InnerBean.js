export default {
  id: 'inner-bean',
  title: '333. Inner Bean',
  explanation: `An **inner bean** is a bean defined **inside** another bean's \`<property>\` or \`<constructor-arg>\`, instead of being declared as a top-level \`<bean>\` and referenced with \`ref\`.

**Normal (referenced) bean:**
\`\`\`xml
<bean id="address" class="com.example.Address">
  <property name="city" value="Hyderabad"/>
</bean>
<bean id="student" class="com.example.Student">
  <property name="address" ref="address"/>   <!-- reference by id -->
</bean>
\`\`\`

**Inner bean — same result, but Address is nested and has no id:**
\`\`\`xml
<bean id="student" class="com.example.Student">
  <property name="address">
    <bean class="com.example.Address">
      <property name="city" value="Hyderabad"/>
    </bean>
  </property>
</bean>
\`\`\`

**Key characteristics:**
- **No id/name** — an inner bean is anonymous. You cannot look it up with \`getBean\` and nothing else can reference it.
- **Always scoped to its enclosing bean** — it exists only to be injected into the outer bean. Any \`scope\`/\`id\` on it is ignored; it is effectively private.
- **Not reusable** — because it has no id, no other bean can share it. If two beans need the same \`Address\`, use a normal referenced bean instead.

**When to use an inner bean:** the dependency is used by **one** owner and **nowhere else**, so exposing it as a top-level bean with an id would just add noise to the config. Inner beans keep tightly-coupled, single-use collaborators local — much like a private field that is never shared.

This is a purely XML-configuration concept; with annotations/Java config you would simply \`new\` the collaborator or create it inside an \`@Bean\` method (see [[java-based-configuration]]).`,
  code: `<!-- Inner bean: Address is private to Student, has no id -->
<bean id="student" class="com.example.Student">
  <property name="name" value="Asha"/>
  <property name="address">
    <bean class="com.example.Address">
      <property name="city" value="Hyderabad"/>
      <property name="pincode" value="500001"/>
    </bean>
  </property>
</bean>

<!--
  ctx.getBean("student")  -> works
  ctx.getBean(Address.class) -> NoSuchBeanDefinitionException:
     the inner Address is not a registered top-level bean
-->`,
  codeTitle: 'Inner bean nested inside a property',
  points: [
    'An inner bean is declared inside a property or constructor-arg of another bean',
    'It is anonymous — no id or name — so it cannot be fetched with getBean or referenced elsewhere',
    'It is always private to and scoped by its enclosing bean; its own scope setting is ignored',
    'Use it for a single-use collaborator that no other bean needs to share',
    'For shared dependencies use a normal top-level bean referenced with ref instead',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is an inner bean in Spring and when would you use one?\nA: An inner bean is a bean defined directly inside the property or constructor-arg of another bean rather than as a top-level bean referenced by id. It is anonymous, cannot be looked up or shared, and lives only to be injected into its enclosing bean. Use it when a collaborator is needed by exactly one owner and would only clutter the configuration as a named top-level bean.',
    },
    {
      type: 'gotcha',
      content: 'You cannot reuse or retrieve an inner bean. If two beans need the same instance, an inner bean creates two separate copies (or is simply unavailable to the second) — declare it as a normal referenced bean instead.',
    },
  ],
}
