export default {
  id: 'servlet-mapping',
  title: '358. Servlet Mapping',
  explanation: `**Servlet mapping** is how the container knows *which* servlet should handle a given URL. When a request for \`/hello\` arrives, Tomcat looks up the servlet mapped to that pattern and calls it.

**Two ways to declare a mapping:**

**1. Annotation — \`@WebServlet\`** (modern, in-code):
\`\`\`java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet { ... }
\`\`\`
You can map multiple patterns: \`@WebServlet({"/hello", "/hi"})\`.

**2. \`web.xml\`** (deployment descriptor, XML) — two linked blocks: \`<servlet>\` gives the servlet a logical name and its class, and \`<servlet-mapping>\` binds that name to a URL pattern:
\`\`\`xml
<servlet>
  <servlet-name>hello</servlet-name>
  <servlet-class>com.example.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>hello</servlet-name>
  <url-pattern>/hello</url-pattern>
</servlet-mapping>
\`\`\`

**URL pattern styles:**
- **Exact:** \`/hello\` — matches only that path.
- **Path/directory:** \`/admin/*\` — matches everything under \`/admin\`.
- **Extension:** \`*.do\` — matches any URL ending in \`.do\`.
- **Default:** \`/\` — the catch-all (this is what Spring's DispatcherServlet uses, see [[dispatcherservlet]]).

Annotation and \`web.xml\` can coexist, but do not map the **same** servlet twice with conflicting rules.`,
  code: `// Annotation style — single and multiple patterns
@WebServlet("/hello")
public class HelloServlet extends HttpServlet { }

@WebServlet({"/list", "/all", "/students/*"})
public class ListServlet extends HttpServlet { }

/* web.xml equivalent
<servlet>
  <servlet-name>hello</servlet-name>
  <servlet-class>com.example.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>hello</servlet-name>
  <url-pattern>/hello</url-pattern>
</servlet-mapping>
*/`,
  codeTitle: 'Mapping a servlet to a URL',
  points: [
    'Servlet mapping binds a URL pattern to the servlet that should handle it.',
    '@WebServlet("/path") maps in code; web.xml maps via linked <servlet> and <servlet-mapping> blocks.',
    'The servlet-name in web.xml links the class declaration to its URL mapping.',
    'Patterns: exact (/hello), path (/admin/*), extension (*.do), and default (/).',
    'One servlet can answer multiple patterns: @WebServlet({"/a", "/b"}).',
  ],
  callouts: [
    { type: 'gotcha', content: 'The URL pattern must start with a slash for path mappings (/hello, not hello). A missing leading slash or a typo in servlet-name (it must match exactly between the two web.xml blocks) leaves the servlet unmapped and you get a 404.' },
    { type: 'interview', content: 'Q: What is the difference between the url-pattern / and /*?\nA: /* matches every request path (including forwards to JSPs); / is the default servlet mapping that handles requests not matched by any other servlet and does not override the JSP handler. Spring MVC uses /.' },
  ],
}
