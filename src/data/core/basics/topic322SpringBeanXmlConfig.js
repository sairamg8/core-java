export default {
  id: 'spring-bean-xml-config',
  title: '322. Spring Bean Xml Config',
  explanation: `In classic Spring, you tell the IoC container which objects to manage using an **XML configuration file**, conventionally named \`applicationContext.xml\` and placed in \`src/main/resources\`. Each managed object is declared with a \`<bean>\` element.

**Anatomy of a \`<bean>\`:**
- **\`id\`** — a unique name you use to fetch the bean with \`getBean("id")\`.
- **\`class\`** — the fully-qualified class name the container will instantiate.

\`\`\`
<bean id="student" class="com.example.Student"/>
\`\`\`
This tells the container: "create one \`Student\` object and register it under the name \`student\`."

**The root element** is \`<beans>\`, which carries the XML namespaces Spring needs:
\`\`\`
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           https://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="student" class="com.example.Student"/>
</beans>
\`\`\`

**Setting values and wiring dependencies:** inside a \`<bean>\` you add:
- \`<property name="..." value="..."/>\` for a literal value via a setter (see [[setter-injection]]).
- \`<property name="..." ref="..."/>\` to wire in another bean (see [[ref-attribute]]).
- \`<constructor-arg .../>\` for constructor injection (see [[constructor-injection]]).

**Why XML first?** It shows every wiring decision explicitly in one place, which makes the container's job obvious. Modern projects use annotations or Java config instead, but the concepts (id, class, property, ref, constructor-arg) map one-to-one onto the annotations you will use later.`,
  code: `<!-- src/main/resources/applicationContext.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Declare a bean: container will create one Student named "student" -->
    <bean id="student" class="com.example.Student">
        <property name="name" value="Asha"/>     <!-- setter injection of a value -->
        <property name="course" ref="course"/>   <!-- wire in another bean -->
    </bean>

    <bean id="course" class="com.example.Course">
        <property name="title" value="Spring Core"/>
    </bean>
</beans>`,
  codeTitle: 'applicationContext.xml with two beans',
  points: [
    'Classic Spring configures beans in an XML file, conventionally applicationContext.xml in resources',
    'Each <bean> needs an id (name for getBean) and a class (fully-qualified type to instantiate)',
    'The <beans> root element declares the Spring beans XML namespace and schema',
    '<property value="..."> sets a literal via a setter; <property ref="..."> wires another bean',
    'XML config maps directly onto later annotations (@Component, @Autowired, @Value)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The class attribute must be the fully-qualified name (package + class), e.g. com.example.Student, not just Student. A typo or wrong package gives a ClassNotFoundException / CannotLoadBeanClassException when the container starts, because Spring loads the class by name via reflection.',
    },
    {
      type: 'tip',
      content: 'Even though real projects favour annotations, learning the XML form makes annotations click: <bean> equals @Component, <property ref> equals @Autowired, and <property value> equals @Value. The XML simply makes every wiring decision visible in one file.',
    },
  ],
}
