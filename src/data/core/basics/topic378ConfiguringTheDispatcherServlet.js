export default {
  id: 'configuring-dispatcherservlet',
  title: '378. Configuring the DispatcherServlet',
  explanation: `Registering the \`DispatcherServlet\` (see [[dispatcherservlet]]) by hand means telling the servlet container two things: **which URLs it should handle**, and **where its Spring configuration lives**.

**web.xml — the classic way:**
\`\`\`xml
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/dispatcher-servlet.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
\`\`\`

- **\`servlet-name\`** (\`dispatcher\` here) determines the *default* name of its config file: \`dispatcher-servlet.xml\` in \`WEB-INF\`, unless overridden with \`contextConfigLocation\`.
- **\`url-pattern\` of \`/\`** means every request goes through this servlet (except requests explicitly handled by the container, like static file mappings) — that is what makes it a front controller.
- **\`load-on-startup\`** makes the container instantiate the servlet at deploy time rather than lazily on the first request, so startup errors surface immediately instead of on a user's first hit.

**The referenced config file** (\`dispatcher-servlet.xml\`) declares the beans the servlet needs: component scanning for \`@Controller\` classes, and the view resolver (next topic).

\`\`\`xml
<context:component-scan base-package="com.example.job" />
<mvc:annotation-driven />
\`\`\`

**Java-based alternative:** instead of \`web.xml\`, a class implementing \`WebApplicationInitializer\` can register the servlet programmatically — the modern, XML-free approach, and closer to what Spring Boot generates for you automatically.`,
  code: `public class AppInitializer implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext container) {
        AnnotationConfigWebApplicationContext context =
            new AnnotationConfigWebApplicationContext();
        context.register(WebConfig.class);

        ServletRegistration.Dynamic dispatcher =
            container.addServlet("dispatcher", new DispatcherServlet(context));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}`,
  codeTitle: 'Java-based DispatcherServlet registration (no web.xml)',
  points: [
    'web.xml registers the DispatcherServlet with a name, its config file location, and a url-pattern.',
    'A url-pattern of "/" routes every request through the DispatcherServlet, making it the front controller.',
    'load-on-startup forces eager instantiation so configuration errors are caught at deploy time.',
    'The servlet\'s Spring config file declares component scanning and the view resolver bean.',
    'WebApplicationInitializer offers a Java-only alternative to web.xml, registering the servlet programmatically.',
  ],
  callouts: [
    { type: 'gotcha', content: 'If contextConfigLocation is omitted, Spring looks for a file named "<servlet-name>-servlet.xml" in WEB-INF. Naming the servlet "dispatcher" but forgetting to create "dispatcher-servlet.xml" (or misnaming it) fails the deploy with a FileNotFoundException at startup.' },
    { type: 'interview', content: 'Q: What does the url-pattern "/" on the DispatcherServlet mapping actually do?\nA: It tells the servlet container to route every request that does not match a more specific mapping through the DispatcherServlet, which is what allows it to act as a single front controller for the whole application.' },
  ],
}
