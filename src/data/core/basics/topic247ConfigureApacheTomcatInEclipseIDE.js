export default {
  id: 'configure-tomcat-eclipse',
  title: '247. Configure Apache Tomcat in Eclipse IDE',
  explanation: `Configuring Tomcat inside Eclipse lets you launch, stop, and debug your web app directly from the IDE without manually copying WAR files.

**Step-by-step setup:**

**1. Open the Servers view:**
Window → Show View → Servers

**2. Add a new server:**
Right-click in the Servers view → New → Server → Apache → Tomcat v9.0 Server → Next

**3. Point to your Tomcat installation:**
Browse to the directory where you extracted Tomcat (e.g., \`C:\\tomcat9\` or \`/opt/tomcat9\`) → Finish

**4. Add your project to the server:**
Right-click the server → Add and Remove → move your project from Available to Configured → Finish

**5. Start the server:**
Right-click the server → Start (or click the green play button in the Servers view)

**6. Access your app:**
\`http://localhost:8080/your-project-name/\`

**Eclipse auto-deploys:**
When you save a Java file, Eclipse recompiles and hot-reloads the class into the running Tomcat. You do not need to restart for class changes. For web.xml or other config changes, a full restart is needed.

**Debug mode:**
Right-click server → Debug → Tomcat starts in debug mode. Set breakpoints in your Servlet — Eclipse pauses execution at the breakpoint when the request hits it.

**Server configuration files:**
Eclipse creates its own Tomcat configuration inside the workspace (not in your Tomcat installation folder). Look in the Servers project in the Project Explorer. You can edit server.xml here without touching the real Tomcat directory.

**Common issues:**
- Port 8080 conflict: double-click the server → change HTTP port
- Project not showing up: make sure it is a Dynamic Web Project (File → New → Dynamic Web Project)`,
  code: `// ===== Eclipse Dynamic Web Project structure =====

// After creating a "Dynamic Web Project" in Eclipse:

/*
YourProject/
  src/
    main/
      java/
        com/example/
          HelloServlet.java     ← your Servlet classes here
      webapp/
        WEB-INF/
          web.xml               ← optional (can use @WebServlet annotation)
          lib/                  ← extra JARs (not provided by Tomcat)
        index.html              ← static welcome page
        result.jsp              ← JSP view files
  WebContent/ (older Eclipse layout)
    WEB-INF/
    *.jsp
    *.html
*/

// HelloServlet.java — minimal Servlet that works right after Tomcat config
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();
        out.println("<html><body>");
        out.println("<h1>Tomcat is working!</h1>");
        out.println("<p>Servlet running at: " + req.getRequestURI() + "</p>");
        out.println("</body></html>");
    }
}

// After saving, Eclipse auto-compiles and Tomcat hot-reloads.
// Visit: http://localhost:8080/YourProject/hello
// Expected: "Tomcat is working!" in the browser`,
  codeTitle: 'Eclipse Tomcat Setup — Dynamic Web Project',
  points: [
    'Configure Tomcat in Eclipse via Window → Show View → Servers → New Server → Apache Tomcat',
    'Point Eclipse to your Tomcat installation folder — Eclipse uses it but creates its own config files in the workspace',
    'Add your Dynamic Web Project to the server in the "Add and Remove" dialog before starting',
    'Eclipse auto-compiles changed Java files and hot-reloads them into the running Tomcat without a full restart',
    'Use Debug mode (right-click server → Debug) to set breakpoints in Servlets and inspect requests at runtime',
    'web.xml is optional when using the @WebServlet annotation — annotations are processed by Tomcat automatically',
    'For web.xml or deployment descriptor changes, a full server restart is needed — class changes can be hot-reloaded',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you run Tomcat as a standalone process AND also have Eclipse managing a Tomcat server, both will try to use port 8080 — one will fail. Always stop the standalone Tomcat before starting the Eclipse-managed one, or change the port on one of them. Check the Eclipse Servers view; if you see a green arrow (running) on the server, Eclipse has Tomcat.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between a Dynamic Web Project and a regular Java project in Eclipse?\nA: A Dynamic Web Project has the project facets and folder structure required for a Java EE web application — it includes the WebContent/webapp folder for JSP/HTML, WEB-INF for web.xml, and is recognized by Tomcat integration. A regular Java project produces a JAR; a Dynamic Web Project produces a WAR for deployment to a servlet container.",
    },
    {
      type: 'tip',
      content: "Enable the Project → Build Automatically option in Eclipse so your Servlet classes are recompiled and hot-reloaded every time you save. Combined with Tomcat in the Servers view, this gives you an almost-instant feedback loop — save the file, refresh the browser, see the change. No manual build or restart needed for class file changes.",
    },
  ],
}
