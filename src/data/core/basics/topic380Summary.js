export default {
  id: 'spring-mvc-manual-setup-summary',
  title: '380. Summary',
  explanation: `A recap of the manual Spring MVC setup built over the last few topics, before putting it to use in a real project:

- **[[spring-mvc-introduction]]** — plain Spring MVC does by hand what Spring Boot auto-configures: no embedded server, no auto-wired view resolver.
- **[[creating-spring-mvc-project-part1]]** — a WAR-packaged project with \`spring-webmvc\` and a \`provided\`-scope Servlet API dependency.
- **[[running-tomcat-in-eclipse]]** — a standalone Tomcat, managed from Eclipse's Servers view, hosting the deployed WAR.
- **[[dispatcherservlet]]** — the front controller that every request passes through: handler mapping, controller invocation, view resolution, rendering.
- **[[configuring-dispatcherservlet]]** — registering it in \`web.xml\` (or a \`WebApplicationInitializer\`) with a \`url-pattern\` of \`/\` and a pointer to its Spring config.
- **[[internal-resource-view-resolver]]** — turning a logical view name into a real JSP path with a prefix/suffix bean, keeping JSPs safely under \`WEB-INF\`.

**The full request path, end to end:**
Browser hits a URL → Tomcat routes it to the \`DispatcherServlet\` (because of the \`/\` mapping) → the servlet asks its handler mapping which \`@Controller\` method matches → that method runs, returns a view name → the \`InternalResourceViewResolver\` turns the name into \`/WEB-INF/views/<name>.jsp\` → the JSP renders using the model data the controller populated → the response goes back to the browser.

Every one of these pieces is something Spring Boot would otherwise configure invisibly. With the manual version understood, the next topics use exactly this setup to build a small, complete webapp: a **Job Application tracker**, with a home page listing jobs and a form to add new ones.`,
  code: `web.xml           →  registers DispatcherServlet, url-pattern "/"
dispatcher-servlet.xml →  component-scan + InternalResourceViewResolver bean
Controller classes →  @RequestMapping methods, return logical view names
WEB-INF/views/*.jsp →  actual templates, unreachable by direct URL`,
  codeTitle: 'The pieces, in one picture',
  points: [
    'Manual Spring MVC setup mirrors exactly what Spring Boot auto-configures - nothing here is extra machinery.',
    'The request path is always: DispatcherServlet -> HandlerMapping -> Controller -> ViewResolver -> JSP.',
    'web.xml (or WebApplicationInitializer) wires the DispatcherServlet into the container.',
    'InternalResourceViewResolver keeps JSPs under WEB-INF, reachable only through a controller.',
    'This foundation is now ready to host a real project: the Job Application tracker webapp.',
  ],
  callouts: [
    { type: 'tip', content: 'When something in a Spring MVC app "does nothing," check the pieces in request order: is the URL even reaching the DispatcherServlet? Does a handler mapping match it? Did the controller return the view name you expect? Is the resolver\'s prefix/suffix correct? Most bugs live at one of these four checkpoints.' },
    { type: 'interview', content: 'Q: Trace a single request through a manually configured Spring MVC app, naming every component involved.\nA: Tomcat receives the request and routes it to the DispatcherServlet via its url-pattern. The DispatcherServlet consults its handler mapping to find the matching @Controller method, invokes it, and receives a logical view name. The InternalResourceViewResolver turns that name into a JSP path under WEB-INF using its configured prefix/suffix, and the JSP renders using the model data the controller populated.' },
  ],
}
