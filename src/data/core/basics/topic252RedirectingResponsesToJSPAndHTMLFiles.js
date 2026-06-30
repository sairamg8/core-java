export default {
  id: 'redirecting-to-jsp-html',
  title: '252. Redirecting Responses to JSP and HTML files',
  explanation: `Instead of generating HTML inside the Servlet using \`PrintWriter\`, you can redirect or forward the request to a JSP or HTML file. This keeps your Servlet clean and separates concerns.

**Two mechanisms — redirect vs forward:**

**1. sendRedirect() — tells the browser to go to a new URL:**
\`\`\`java
response.sendRedirect("result.jsp");         // relative URL
response.sendRedirect("/myapp/result.jsp");  // absolute URL
response.sendRedirect("https://example.com"); // external URL
\`\`\`
- Causes a second HTTP request from the browser
- URL in browser address bar changes
- Request attributes are lost (new request object)
- Works for JSP, HTML, or external URLs

**2. RequestDispatcher.forward() — server-side forward (covered in next topic):**
\`\`\`java
RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/result.jsp");
rd.forward(request, response);
\`\`\`
- No second request — same request continues
- URL in browser does NOT change
- Request attributes are preserved
- Only works within the same web application

**When to use each:**
| Scenario | Use |
|----------|-----|
| Redirect after POST (avoid double-submit) | sendRedirect() |
| Pass data to JSP view | forward() |
| Redirect to external site | sendRedirect() |
| Show JSP with model data | forward() |

**Redirecting to a static HTML page:**
\`\`\`java
response.sendRedirect(request.getContextPath() + "/thankyou.html");
\`\`\`

**Common pattern — redirect after POST:**
\`\`\`java
@Override
protected void doPost(...) {
    // process form...
    response.sendRedirect("success.html"); // Post-Redirect-Get
}
\`\`\``,
  code: `// ===== Redirect vs Forward to JSP/HTML =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

// ===== Servlet using sendRedirect() to JSP =====
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    // doGet: show login form
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        // Redirect to a static HTML login page
        res.sendRedirect(req.getContextPath() + "/login.html");
    }

    // doPost: process login
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        String user = req.getParameter("username");
        String pass = req.getParameter("password");

        if ("admin".equals(user) && "password".equals(pass)) {
            // Success — redirect to dashboard (PRG pattern)
            // sendRedirect: browser makes a NEW GET request to /dashboard
            res.sendRedirect(req.getContextPath() + "/dashboard");
        } else {
            // Failure — redirect back to login page with error indicator
            res.sendRedirect(req.getContextPath() + "/login.html?error=1");
        }
    }
}

// ===== Servlet using forward() to pass data to JSP =====
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Set data as request attributes — available in JSP via \${name}
        req.setAttribute("welcomeMsg", "Welcome back!");
        req.setAttribute("serverTime", java.time.LocalTime.now().toString());
        req.setAttribute("itemCount", 42);

        // Forward to JSP — same request, URL stays /dashboard
        RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/views/dashboard.jsp");
        rd.forward(req, res);
    }
}

/* ===== WEB-INF/views/dashboard.jsp =====
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head><title>Dashboard</title></head>
<body>
  <h2>\${welcomeMsg}</h2>
  <p>Server time: \${serverTime}</p>
  <p>Items in cart: \${itemCount}</p>
</body>
</html>
*/

/* ===== login.html (static file in webapp root) =====
<!DOCTYPE html>
<html>
<body>
  <h2>Login</h2>
  <form method="post" action="login">
    User: <input type="text" name="username"><br>
    Pass: <input type="password" name="password"><br>
    <button type="submit">Login</button>
  </form>
</body>
</html>
*/`,
  codeTitle: 'sendRedirect() to HTML and forward() to JSP',
  points: [
    'sendRedirect() tells the browser to make a new GET request to the specified URL — the address bar changes',
    'RequestDispatcher.forward() passes the same request to another resource (JSP/HTML) server-side — the URL does not change',
    'Request attributes set with req.setAttribute() are preserved through a forward() but lost through a sendRedirect()',
    'Use sendRedirect() after POST (Post-Redirect-Get pattern) to prevent form re-submission on browser refresh',
    'Use forward() to pass model data from a Servlet to a JSP view — the JSP reads attributes with EL expressions like \${name}',
    'JSP files in WEB-INF/ are protected — access them only via forward(), never directly from a browser URL',
    'req.getContextPath() returns the web app root prefix — prepend it to relative redirects to build correct URLs',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "After calling res.sendRedirect() or rd.forward(), do NOT write to the response or set headers — the response is already committed. Also, do not call both in the same request handler. A common mistake is calling sendRedirect() and then continuing to execute code that also calls forward() — this throws an IllegalStateException.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between sendRedirect() and RequestDispatcher.forward()?\nA: sendRedirect() sends an HTTP 302 response to the browser, which then makes a new GET request to the new URL. The address bar changes, and it's a separate request — attributes from the original request are gone. forward() transfers control server-side within the same request — the URL stays the same, request attributes are preserved, and the browser never knows a forward happened. Use forward() for MVC view rendering; use sendRedirect() for Post-Redirect-Get.",
    },
    {
      type: 'tip',
      content: "Always use req.getContextPath() when building redirect URLs: res.sendRedirect(req.getContextPath() + '/success'). Hard-coding '/myapp/success' breaks if the app is deployed under a different context path. getContextPath() always returns the correct prefix dynamically.",
    },
  ],
}
