export default {
  id: 'servlet-basics',
  title: '1. Java Servlets',
  explanation: `A **Servlet** is a Java class that handles HTTP requests and generates HTTP responses. Servlets run inside a **Servlet Container** (Tomcat, Jetty) which manages the lifecycle.

**Servlet lifecycle (3 methods called by the container):**
1. \`init()\` — called once when the servlet is loaded; initialize resources
2. \`service()\` — called for EVERY request; dispatches to doGet/doPost/etc.
3. \`destroy()\` — called once before the servlet is unloaded; release resources

**HttpServlet** is the class you extend. Override \`doGet()\` or \`doPost()\` (or both).

**Modern alternative:** Spring MVC replaces raw servlets in most production applications. Understanding servlets explains HOW Spring MVC works under the hood.

**Configuration:**
- \`web.xml\` — traditional XML descriptor in \`WEB-INF/\`
- \`@WebServlet\` annotation — modern, no XML needed (Servlet 3.0+)`,
  code: `import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;

// @WebServlet replaces the web.xml mapping
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

    // Called once on first request (or on startup if loadOnStartup >= 0)
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        // initialize DB connections, caches, etc.
    }

    // Handle GET requests
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String name = req.getParameter("name");  // query param: /hello?name=Alice
        if (name == null) name = "World";

        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("<html><body>");
        out.println("<h1>Hello, " + name + "!</h1>");
        out.println("</body></html>");
    }

    // Handle POST requests
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String username = req.getParameter("username");
        String password = req.getParameter("password");

        // Validate, then store in session
        HttpSession session = req.getSession();
        session.setAttribute("user", username);

        // Redirect after POST (Post-Redirect-Get pattern)
        resp.sendRedirect("/dashboard");
    }

    // Called once when servlet is removed from service
    @Override
    public void destroy() {
        // release resources
    }
}`,
  points: [
    'doGet() is called for GET requests (browsing URLs, links); doPost() for form submissions and API calls',
    'Never put HTML string-building logic in servlets — that is what JSP/Thymeleaf/templates are for (Servlet handles logic, JSP renders)',
    'HttpSession stores user state across requests — sessions are backed by a JSESSIONID cookie by default',
    'sendRedirect() sends a 302 response; the browser makes a NEW GET request to the target URL',
    'RequestDispatcher.forward() forwards the request internally — the URL in the browser does not change',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between sendRedirect() and RequestDispatcher.forward()?\nA: sendRedirect() sends a 302 HTTP response to the browser, which then makes a new GET request to the target URL — the URL in the browser changes and you lose the original request data. forward() processes the request internally on the server, passing it to another resource (JSP, Servlet). The browser sees one response, the URL does not change, and request attributes are preserved.',
    },
    {
      type: 'gotcha',
      content: 'Servlets are NOT thread-safe by default. The container calls doGet()/doPost() from multiple threads simultaneously. Never store per-request data in instance fields — use local variables or request attributes instead.',
    },
  ],
}
