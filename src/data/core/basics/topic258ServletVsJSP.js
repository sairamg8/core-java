export default {
  id: 'servlet-vs-jsp',
  title: '258. Servlet vs JSP',
  explanation: `Servlet and JSP solve the same problem (dynamic HTTP responses) but are optimized for different roles. In a well-designed app, they complement each other.

**Servlet strengths:**
- Pure Java — full IDE support, refactoring, autocomplete
- Better for control logic: routing, validation, DB calls, security checks
- Easier to test (just a Java class)
- Better for binary responses (file downloads, images)
- Better for REST APIs (JSON output)

**JSP strengths:**
- HTML-centric — natural to write page structure
- Easier for designers who know HTML but not Java
- EL and JSTL make displaying collections and conditionals clean
- Automatically compiled to Servlet by the container
- Less boilerplate for HTML-heavy pages

**Comparison table:**

| Aspect | Servlet | JSP |
|--------|---------|-----|
| Primary role | Controller / API | View / Presentation |
| Language | Java | HTML + EL/JSTL |
| HTML output | out.println() (ugly) | Natural HTML (clean) |
| Java logic | Native | Scriptlets (avoid) |
| Testing | Easy (unit testable) | Hard to unit test |
| Compilation | Explicit (you write .java) | Implicit (container compiles) |
| Binary output | res.getOutputStream() | Not suitable |

**Why use both together (MVC):**
\`\`\`
HTTP Request
    ↓
Servlet (Controller)        — validates, calls DB, sets model
    ↓ forward()
JSP (View)                  — renders model data as HTML
    ↓
HTTP Response
\`\`\`
This is the Model-View-Controller pattern. Servlet is the glue between HTTP and business logic; JSP is the template for output.

**When to use only Servlet:**
- REST APIs returning JSON (no HTML)
- File download endpoints
- Simple 1-line responses (health check, status)

**When to use only JSP:**
- Prototype or teaching example (not recommended for production)
- Very simple static-ish pages with minor dynamic bits`,
  code: `// ===== Same feature: Servlet vs JSP approach =====

// ===== OPTION 1: Pure Servlet (all HTML in Java — messy) =====
@WebServlet("/users-servlet")
public class UserListServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<String> users = List.of("Alice", "Bob", "Carol");

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();

        // Writing HTML in Java is painful — error-prone, hard to maintain
        out.println("<!DOCTYPE html><html><head><title>Users</title></head><body>");
        out.println("<h2>User List (" + users.size() + " users)</h2>");
        out.println("<ul>");
        for (String u : users) {
            out.println("<li>" + u + "</li>");  // XSS risk if u has < or >
        }
        out.println("</ul></body></html>");
    }
}

// ===== OPTION 2: Servlet + JSP (Servlet does logic, JSP does HTML) =====
@WebServlet("/users")
public class UserMvcServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Servlet: do the logic
        List<String> users = List.of("Alice", "Bob", "Carol"); // from DB in real app

        // Pass model to JSP
        req.setAttribute("users", users);
        req.setAttribute("count", users.size());

        // Forward to JSP for rendering
        req.getRequestDispatcher("/WEB-INF/views/users.jsp").forward(req, res);
        // Servlet is done — JSP renders the HTML
    }
}

/* WEB-INF/views/users.jsp — clean, designer-friendly HTML */
/*
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head><title>Users</title></head>
<body>
  <h2>User List (\${count} users)</h2>
  <ul>
    <c:forEach var="user" items="\${users}">
      <li><c:out value="\${user}"/></li>   <!-- auto-escapes HTML, safe from XSS -->
    </c:forEach>
  </ul>
</body>
</html>
*/

// ===== REST API — Servlet only (no JSP needed) =====
@WebServlet("/api/users")
public class UserApiServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        // For JSON APIs: Servlet only — no JSP
        res.setContentType("application/json; charset=UTF-8");
        PrintWriter out = res.getWriter();
        out.println("[{\\"name\\":\\"Alice\\"},{\\"name\\":\\"Bob\\"}]");
    }
}`,
  codeTitle: 'Servlet vs JSP — Pure Servlet, MVC Combo, REST API',
  points: [
    'Servlet is best for controller logic (routing, validation, DB calls); JSP is best for HTML view rendering',
    'Writing HTML via PrintWriter in a Servlet is error-prone and hard to maintain — use JSP or a template engine instead',
    'JSP EL and JSTL make data display (loops, conditionals) much cleaner than scriptlets or Servlet PrintWriter',
    'JSP is automatically compiled to a Servlet — they are equivalent at the bytecode level',
    'For REST APIs returning JSON, use only a Servlet (or Spring MVC @RestController) — no JSP needed',
    'The Servlet + JSP MVC pattern: Servlet handles request, sets model attributes, forwards to JSP which renders HTML',
    'Unit testing a Servlet is straightforward; unit testing a JSP requires a running container — another reason to keep logic in Servlets',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Writing user-supplied data directly with out.println(userInput) in a Servlet (or <%= userInput %> in JSP) is an XSS vulnerability — the browser will execute any <script> tags in the output. Always use c:out in JSTL (which escapes HTML) or manually call Encode.forHtml(userInput) (OWASP Java Encoder). Never echo raw user input directly into HTML output.",
    },
    {
      type: 'interview',
      content: "Q: When would you use a Servlet instead of a JSP in an MVC application?\nA: In MVC, Servlets are always the controller — they handle routing, input validation, business logic calls, and session management. JSPs are the view — they only render model data as HTML. Servlets are also used exclusively for REST API endpoints (returning JSON/XML) where there is no HTML view. You would never put database calls or business logic in a JSP in a properly structured MVC application.",
    },
    {
      type: 'tip',
      content: "A quick rule: if a file ends in .java — it is the Servlet (controller); if it ends in .jsp — it is the view. Enforce this boundary strictly. A JSP that calls a DAO directly, or a Servlet that writes 50 lines of HTML with PrintWriter, are both violations of MVC that make the app harder to test and maintain.",
    },
  ],
}
