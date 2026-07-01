export default {
  id: 'spring-mvc-introduction',
  title: '374. Spring MVC Introduction',
  explanation: `Every web app built so far in this chapter used **Spring Boot**, which auto-configures the pieces of Spring MVC (see [[introduction-to-mvc]]) behind the scenes: the \`DispatcherServlet\` is registered automatically, a view resolver is wired from \`application.properties\`, and Tomcat is embedded in the app itself.

This topic starts a short detour into **plain Spring MVC without Boot** — the way Spring web apps were built before Spring Boot existed, and still how many legacy or highly-customized deployments work today. Nothing here is optional plumbing Boot happened to skip; it is the same machinery Boot configures *for* you, done *by hand*:

- A standalone **Tomcat server** (not embedded) that the app is deployed onto as a WAR.
- The **\`DispatcherServlet\`** registered explicitly in \`web.xml\` (or a Java-based initializer), with its own Spring configuration.
- A **view resolver bean** declared explicitly (\`InternalResourceViewResolver\`) instead of picked up from properties.

**Why learn this at all if Boot exists?** Two reasons: (1) understanding what Boot auto-configures makes debugging Boot apps far easier when the defaults don't fit, and (2) plenty of real-world systems predate Boot or intentionally avoid it, and knowing the manual setup means those codebases aren't a mystery.

The next few topics build a small Spring MVC project this way, step by step: create the project, run Tomcat, register the \`DispatcherServlet\`, configure a view resolver — then use it all to build a working "Job Application" tracker webapp.`,
  code: `<!-- The pieces Spring Boot auto-configures, made explicit -->

<!-- 1. web.xml registers the DispatcherServlet -->
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
</servlet>

<!-- 2. A Spring config file wires an InternalResourceViewResolver -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/" />
    <property name="suffix" value=".jsp" />
</bean>`,
  codeTitle: 'What Spring Boot auto-configures for you',
  points: [
    'Everything Spring Boot auto-configures for web apps is real Spring MVC configuration - Boot just writes it for you with sensible defaults.',
    'Plain Spring MVC apps are deployed as WAR files onto a standalone Tomcat, rather than running an embedded server.',
    'The DispatcherServlet must be registered by hand, typically in web.xml or a WebApplicationInitializer.',
    'The view resolver is an explicit bean (InternalResourceViewResolver) instead of being derived from properties.',
    'Learning the manual setup demystifies what Boot is doing and helps when working with pre-Boot codebases.',
  ],
  callouts: [
    { type: 'tip', content: 'Think of this detour as "Spring Boot with the hood open." Every property in application.properties for MVC (view prefix/suffix, servlet mapping) corresponds to a bean or XML entry you are about to write by hand.' },
    { type: 'interview', content: 'Q: What does Spring Boot actually add on top of plain Spring MVC?\nA: Auto-configuration (DispatcherServlet registration, view resolver setup from properties) and an embedded server, so a Spring MVC app can run as a plain executable JAR instead of requiring a WAR deployed to standalone Tomcat.' },
  ],
}
