export default {
  id: 'internal-resource-view-resolver',
  title: '379. Internal Resource View Resolver',
  explanation: `A controller method returns a **logical view name** — a plain string like \`"home"\` — never a file path. Something has to turn \`"home"\` into an actual resource the container can render. That something is the **view resolver**.

**\`InternalResourceViewResolver\`** is the standard view resolver for JSP-based apps: it takes the logical name and wraps it with a configured **prefix** and **suffix** to build the real path.

\`\`\`xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/" />
    <property name="suffix" value=".jsp" />
</bean>
\`\`\`

With this configuration, a controller returning \`"home"\` resolves to \`/WEB-INF/views/home.jsp\`. This is the same mechanism Spring Boot configures via \`spring.mvc.view.prefix\` / \`spring.mvc.view.suffix\` in \`application.properties\` (see [[setting-prefix-and-suffix]]) — here it is an explicit bean instead of a property.

**Why \`/WEB-INF/\`?** Anything under \`WEB-INF\` is *not* directly reachable by URL — the servlet container blocks direct requests to it. That forces every JSP to be reached **through** a controller (and therefore through the DispatcherServlet), rather than a user typing a JSP's URL directly and bypassing all the model-building logic the controller was responsible for. This is a deliberate security and architecture boundary, not an accident of folder naming.

**Java-based equivalent:**
\`\`\`java
@Bean
public ViewResolver viewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix("/WEB-INF/views/");
    resolver.setSuffix(".jsp");
    return resolver;
}
\`\`\``,
  code: `// Controller returns a logical name, never a path
@RequestMapping("/")
public String home() {
    return "home";   // resolver turns this into /WEB-INF/views/home.jsp
}

// Resolver bean (XML)
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/" />
    <property name="suffix" value=".jsp" />
</bean>`,
  codeTitle: 'From logical view name to JSP path',
  points: [
    'Controllers return a logical view name (a plain string) - never a file path or URL.',
    'InternalResourceViewResolver builds the actual path by concatenating a configured prefix, the view name, and a suffix.',
    'Placing JSPs under WEB-INF blocks direct URL access to them, forcing all requests through a controller.',
    'This is the same mechanism Spring Boot configures via spring.mvc.view.prefix / spring.mvc.view.suffix properties.',
    'A Java @Bean method is a drop-in equivalent to the XML bean declaration.',
  ],
  callouts: [
    { type: 'gotcha', content: 'If the prefix/suffix bean is missing or misconfigured, Spring throws a 404 with a message like "Circular view path" or simply cannot find the JSP - always check the resolver\'s prefix/suffix first when a returned view name "does nothing."' },
    { type: 'interview', content: 'Q: Why are JSP files typically placed under WEB-INF rather than the webapp root?\nA: Resources under WEB-INF cannot be requested directly by URL - the servlet container blocks it. This forces every JSP to be reached only through a controller and the DispatcherServlet, so the model-building logic in the controller can never be bypassed.' },
  ],
}
