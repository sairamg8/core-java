export default {
  id: 'creating-a-servlet-project',
  title: '356. Creating A Servlet Project',
  explanation: `To write a plain **Servlet** (no Spring yet), you need a project packaged as a **WAR** (Web Application Archive) with the Servlet API on the classpath and a servlet container to run it.

**Project setup (Maven):**
- Set packaging to \`war\` in \`pom.xml\`.
- Add the **Jakarta Servlet API** dependency with scope \`provided\` — the container supplies it at runtime, so you compile against it but do not bundle it:
\`\`\`xml
<packaging>war</packaging>
...
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.0.0</version>
    <scope>provided</scope>
</dependency>
\`\`\`

**Writing the servlet:** extend \`HttpServlet\` and override \`doGet\` (or \`doPost\`). Map it to a URL either with the \`@WebServlet\` annotation or in \`web.xml\`:
\`\`\`java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.getWriter().println("Hello from Servlet");
    }
}
\`\`\`

**Folder layout:** web resources (JSPs, \`web.xml\`) live under \`src/main/webapp\`, with \`web.xml\` inside \`src/main/webapp/WEB-INF\`.

**Note on Jakarta vs javax:** since Jakarta EE 9 the package is \`jakarta.servlet.*\` (older tutorials use \`javax.servlet.*\`). Match the package to your Tomcat version — Tomcat 10+ uses \`jakarta\`.`,
  code: `<!-- pom.xml (key parts) -->
<packaging>war</packaging>

<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.0.0</version>
    <scope>provided</scope>
</dependency>

// src/main/java/.../HelloServlet.java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("text/html");
        res.getWriter().println("<h1>Hello from Servlet</h1>");
    }
}`,
  codeTitle: 'WAR project + first servlet',
  points: [
    'Package the project as a WAR and add jakarta.servlet-api with scope provided.',
    'provided scope means you compile against the API but the container supplies it at runtime.',
    'Extend HttpServlet and override doGet/doPost to handle requests.',
    'Map the servlet to a URL with @WebServlet("/path") or an entry in web.xml.',
    'Web resources and WEB-INF/web.xml live under src/main/webapp.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Tomcat 10+ requires the jakarta.servlet package; Tomcat 9 and earlier use javax.servlet. Mixing them (jakarta code on a javax container) means your servlet is never found — a very common beginner trap.' },
    { type: 'tip', content: 'Use provided scope, not compile, for the servlet API. Bundling it in your WAR can clash with the containers own copy and cause ClassCastExceptions.' },
    { type: 'interview', content: 'Q: Why is the servlet-api dependency marked provided?\nA: Because the servlet container (Tomcat) already provides the servlet API at runtime; you only need it to compile, so it should not be packaged into the WAR.' },
  ],
}
