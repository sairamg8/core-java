export default {
  id: 'dispatcherservlet',
  title: '377. DispatcherServlet',
  explanation: `The **\`DispatcherServlet\`** is the **front controller** of every Spring MVC app: a single servlet that every incoming request passes through first, which then delegates the real work out to the right handler.

**What it does, in order, for every request:**
1. Receives the raw \`HttpServletRequest\`.
2. Consults **handler mappings** to find which \`@Controller\` method matches the request URL (and HTTP method).
3. Invokes that controller method, which returns a logical view name (or a \`ModelAndView\`, see [[model-and-view]]).
4. Hands the view name to the configured **view resolver** (see [[internal-resource-view-resolver]]) to turn it into an actual JSP path.
5. Renders that JSP, using the model data the controller populated, and writes the result back to the response.

**Why one servlet for everything?** Without it, each URL would need its own hand-registered servlet (the raw way, see [[introduction-to-servlet]]) — no shared request handling, no consistent model/view plumbing. The DispatcherServlet centralizes all of that: one servlet, backed by a Spring \`ApplicationContext\`, that fans requests out to plain Java methods annotated with \`@RequestMapping\`.

In Spring Boot, this servlet is registered and configured automatically. In plain Spring MVC, it must be registered by hand in \`web.xml\` — the next topic covers exactly that.`,
  code: `Browser  ──▶  DispatcherServlet  ──▶  HandlerMapping   (which controller method?)
                     │
                     ▼
              Controller method       (business logic, returns view name + model)
                     │
                     ▼
              ViewResolver            (view name -> actual JSP path)
                     │
                     ▼
              JSP renders            ──▶  response sent to browser`,
  codeTitle: 'The DispatcherServlet request lifecycle',
  points: [
    'DispatcherServlet is the single front controller every Spring MVC request passes through first.',
    'It uses handler mappings to find which @Controller method should handle a given URL.',
    'After the controller runs, it hands the returned view name to a view resolver to locate the actual JSP.',
    'This centralizes request routing instead of needing one hand-registered servlet per URL.',
    'Spring Boot registers and configures it automatically; plain Spring MVC requires explicit registration in web.xml.',
  ],
  callouts: [
    { type: 'tip', content: 'Mentally split every request into the same five stops: DispatcherServlet -> HandlerMapping -> Controller -> ViewResolver -> View. Debugging a broken page usually means figuring out which stop failed.' },
    { type: 'interview', content: 'Q: What design pattern does DispatcherServlet implement, and why?\nA: The Front Controller pattern - a single entry point receives all requests and delegates to the appropriate handler, centralizing cross-cutting concerns like routing, view resolution, and exception handling instead of duplicating them across many servlets.' },
  ],
}
