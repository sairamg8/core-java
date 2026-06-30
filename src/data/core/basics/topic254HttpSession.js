export default {
  id: 'http-session',
  title: '254. HttpSession',
  explanation: `HTTP is stateless — each request is independent and the server forgets the previous one. \`HttpSession\` provides a way to maintain state across multiple requests from the same user.

**Getting the session:**
\`\`\`java
// Get existing session or create a new one
HttpSession session = request.getSession();

// Get existing session only (null if no session exists)
HttpSession session = request.getSession(false);
\`\`\`

**Storing and reading data:**
\`\`\`java
// Store (in Servlet)
session.setAttribute("loggedInUser", username);
session.setAttribute("cartSize", 3);

// Read (in Servlet or JSP)
String user = (String) session.getAttribute("loggedInUser");
\`\`\`

**How sessions work under the hood:**
1. First request: Tomcat creates a session object with a unique ID (JSESSIONID)
2. Tomcat sends the JSESSIONID back in a cookie: \`Set-Cookie: JSESSIONID=ABC123\`
3. Browser includes the cookie on every subsequent request: \`Cookie: JSESSIONID=ABC123\`
4. Tomcat matches the cookie to the session object in memory
5. Your code reads session attributes

**Session timeout:**
Sessions expire after inactivity (default 30 minutes in Tomcat). Configure in web.xml:
\`\`\`xml
<session-config>
  <session-timeout>30</session-timeout> <!-- minutes -->
</session-config>
\`\`\`
Or programmatically:
\`\`\`java
session.setMaxInactiveInterval(1800); // seconds
\`\`\`

**Invalidating the session (logout):**
\`\`\`java
session.invalidate(); // destroys session and all attributes
\`\`\`

**What to store in session:**
- Logged-in user identity
- Shopping cart
- User preferences
- Multi-step wizard state

**What NOT to store:**
- Large objects (consumes server memory per user)
- Sensitive data if the session is not encrypted
- Data that belongs in the database`,
  code: `// ===== HttpSession — Login, Cart, Logout =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

// Login Servlet — creates the session
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        // In real app: verify against DB
        if ("admin".equals(username) && "secret".equals(password)) {

            // Create (or get) a session
            HttpSession session = req.getSession();

            // Store user info in session
            session.setAttribute("loggedInUser", username);
            session.setAttribute("loginTime", new java.util.Date().toString());
            session.setAttribute("cart", new ArrayList<String>());

            // Set session to expire after 30 minutes of inactivity
            session.setMaxInactiveInterval(30 * 60);

            // Redirect to dashboard (PRG pattern)
            res.sendRedirect(req.getContextPath() + "/dashboard");
        } else {
            res.sendRedirect(req.getContextPath() + "/login.html?error=invalid");
        }
    }
}

// Dashboard Servlet — reads from session
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Get existing session — don't create a new one
        HttpSession session = req.getSession(false);

        if (session == null || session.getAttribute("loggedInUser") == null) {
            // Not logged in — redirect to login
            res.sendRedirect(req.getContextPath() + "/login.html");
            return;
        }

        String user      = (String) session.getAttribute("loggedInUser");
        String loginTime = (String) session.getAttribute("loginTime");
        String sessionId = session.getId();

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();
        out.println("<html><body>");
        out.println("<h2>Dashboard — Welcome, " + user + "!</h2>");
        out.println("<p>Logged in at: " + loginTime + "</p>");
        out.println("<p>Session ID: " + sessionId + "</p>");
        out.println("<p>Session expires after: " + (session.getMaxInactiveInterval() / 60) + " minutes of inactivity</p>");
        out.println("<a href='logout'>Logout</a>");
        out.println("</body></html>");
    }
}

// Logout Servlet — invalidates the session
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        HttpSession session = req.getSession(false);
        if (session != null) {
            System.out.println("Invalidating session for: " + session.getAttribute("loggedInUser"));
            session.invalidate(); // destroys session and all attributes
        }

        // Redirect to login page after logout
        res.sendRedirect(req.getContextPath() + "/login.html");
    }
}`,
  codeTitle: 'HttpSession — Login, Session Attributes, Logout',
  points: [
    'HttpSession stores user-specific state across multiple HTTP requests — obtained via request.getSession()',
    'Tomcat assigns each session a unique JSESSIONID and sends it as a cookie to the browser',
    'setAttribute() stores objects in the session; getAttribute() retrieves them (requires a cast)',
    'request.getSession(false) returns null if no session exists — use this to check login status without creating a new session',
    'session.invalidate() destroys the session and all its attributes — always call this on logout',
    'Sessions expire after inactivity — configure timeout in web.xml (session-timeout) or via setMaxInactiveInterval(seconds)',
    'Store minimal data in the session — every active user has a session in Tomcat memory, so large objects increase memory usage',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "request.getSession() (no argument) ALWAYS creates a new session if one does not exist. If you are checking whether a user is logged in, use request.getSession(false) instead — if it returns null, the user has no session and is not logged in. Using request.getSession() for an auth check accidentally creates sessions for every unauthenticated visitor.",
    },
    {
      type: 'interview',
      content: "Q: How does HttpSession maintain state in a stateless HTTP protocol?\nA: Tomcat assigns a unique session ID (JSESSIONID) to each session and stores the session object in server memory. The JSESSIONID is sent to the browser as a cookie. On every subsequent request, the browser includes the cookie, and Tomcat uses the ID to look up the session object. This turns stateless HTTP into a stateful conversation without the browser needing to re-send user data on every request.",
    },
    {
      type: 'tip',
      content: "Always check if session.getAttribute() returns null before casting. Session attributes can be null if the key was never set or if the session was created but the attribute not yet stored. A NullPointerException from an unchecked session attribute cast is a very common bug in Servlet applications.",
    },
  ],
}
