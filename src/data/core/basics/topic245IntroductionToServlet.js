export default {
  id: 'introduction-to-servlet',
  title: '245. Introduction to Servlet',
  explanation: `A **Servlet** is a Java class that handles HTTP requests and generates HTTP responses on the server side. It runs inside a **servlet container** (like Apache Tomcat) that manages its lifecycle.

**Servlet class hierarchy:**
\`\`\`
javax.servlet.Servlet (interface)
  └── javax.servlet.GenericServlet (abstract — protocol-independent)
        └── javax.servlet.http.HttpServlet (abstract — HTTP-specific)
              └── YourServlet (your class)
\`\`\`
You always extend \`HttpServlet\` for web applications.

**Minimum Servlet:**
\`\`\`java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.getWriter().println("Hello, World!");
    }
}
\`\`\`

**Key methods you override:**
- \`doGet()\` — handles HTTP GET (browser URL navigation, links)
- \`doPost()\` — handles HTTP POST (form submissions)
- \`doPut()\`, \`doDelete()\` — for REST APIs
- \`init()\` — called once on startup (setup/initialization)
- \`destroy()\` — called once on shutdown (cleanup)

**URL mapping:**
The \`@WebServlet("/pattern")\` annotation maps URLs to your Servlet. Patterns can be:
- Exact: \`"/login"\`
- Wildcard suffix: \`"*.do"\`
- Prefix wildcard: \`"/api/*"\`

**HttpServletRequest — what you receive:**
- \`getParameter("name")\` — URL param or form field
- \`getHeader("User-Agent")\` — request header
- \`getSession()\` — the user's HttpSession
- \`getInputStream()\` — raw request body

**HttpServletResponse — what you send back:**
- \`setContentType("text/html")\` — set MIME type
- \`setStatus(200)\` — set HTTP status code
- \`getWriter()\` — write text response
- \`sendRedirect("/other")\` — redirect the browser`,
  code: `// ===== Complete Servlet with all key parts =====
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet(
    name        = "EmployeeServlet",
    urlPatterns = {"/employees", "/emp/*"}   // maps two URL patterns
)
public class EmployeeServlet extends HttpServlet {

    // init() — called ONCE when Tomcat first loads this Servlet
    @Override
    public void init() throws ServletException {
        System.out.println("EmployeeServlet initialized");
        // Good place for: opening a DB connection pool, loading config
    }

    // doGet() — handles GET requests: /employees or /employees?id=5
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String idParam = req.getParameter("id");

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<html><body>");

        if (idParam != null) {
            // Show one employee
            int id = Integer.parseInt(idParam);
            out.println("<h2>Employee #" + id + "</h2>");
            out.println("<p>Name: Alice (from DB)</p>");  // in real app: query DB
        } else {
            // Show all employees
            out.println("<h2>All Employees</h2>");
            out.println("<ul><li>Alice</li><li>Bob</li></ul>"); // from DB in real app
        }

        out.println("</body></html>");
    }

    // doPost() — handles POST requests: form submissions
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8"); // handle special chars in POST body

        String name   = req.getParameter("name");
        String dept   = req.getParameter("department");
        double salary = Double.parseDouble(req.getParameter("salary"));

        // In a real app: insert into DB via DAO
        System.out.println("New employee: " + name + ", " + dept + ", " + salary);

        // Redirect to the list page (Post-Redirect-Get pattern)
        res.sendRedirect(req.getContextPath() + "/employees");
    }

    // destroy() — called ONCE when Tomcat shuts down
    @Override
    public void destroy() {
        System.out.println("EmployeeServlet destroyed — cleanup here");
        // Good place for: closing connection pools, releasing resources
    }
}`,
  codeTitle: 'Full Servlet — init, doGet, doPost, destroy',
  points: [
    'A Servlet is a Java class that extends HttpServlet and overrides doGet()/doPost() to handle HTTP requests',
    'The @WebServlet annotation maps one or more URL patterns to the Servlet class, replacing web.xml URL mappings',
    'init() is called once when the Servlet is first loaded; destroy() is called once when the container shuts down',
    'doGet() handles GET requests (URL navigation, links); doPost() handles POST requests (form submissions)',
    'HttpServletRequest provides getParameter(), getHeader(), getSession(), and getInputStream() to read request data',
    'HttpServletResponse provides setContentType(), setStatus(), getWriter(), and sendRedirect() to build the response',
    'A Servlet is a singleton — one instance shared by all threads; never store user-specific data in instance variables',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Servlets are singletons — Tomcat creates ONE instance and uses it to handle ALL concurrent requests using multiple threads. If you store user-specific data in a Servlet instance variable (e.g., private String username), it will be shared and overwritten by concurrent requests. All user state belongs in HttpServletRequest, HttpSession, or local variables inside the method.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between GenericServlet and HttpServlet?\nA: GenericServlet is a protocol-independent abstract class that implements the Servlet interface. It provides a generic service() method. HttpServlet extends GenericServlet and adds HTTP-specific behavior — it parses the HTTP method from the request and dispatches to doGet(), doPost(), doPut(), doDelete(), etc. For web applications, you always extend HttpServlet.",
    },
    {
      type: 'tip',
      content: "Use the Post-Redirect-Get (PRG) pattern with doPost(): after processing a form submission, call res.sendRedirect() to redirect the browser to a GET endpoint. This prevents the browser from re-submitting the form if the user presses the back button or refreshes the page — a common source of duplicate submissions.",
    },
  ],
}
