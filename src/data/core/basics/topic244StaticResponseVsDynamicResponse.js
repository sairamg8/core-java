export default {
  id: 'static-vs-dynamic-response',
  title: '244. Static Response vs Dynamic Response',
  explanation: `Understanding the difference between static and dynamic responses is fundamental to understanding why Servlets exist.

**Static Response:**
A static response is a fixed file served directly from disk — the same content every time, regardless of who requests it or what they ask for.

Examples: HTML files, CSS, JavaScript files, images, PDFs.

\`\`\`
Browser: GET /about.html
Server:  reads about.html from disk, sends its bytes
         (identical for every user, every time)
\`\`\`

Static files can be served by a plain web server (Apache HTTP Server, Nginx) with no Java involved.

**Dynamic Response:**
A dynamic response is generated at request time — the content varies based on who is asking, what they submitted, or what is currently in the database.

Examples: a user's account page (shows their name), search results (depends on the query), a shopping cart (depends on session).

\`\`\`
Browser: GET /account?userId=42
Server:  queries DB for user 42, builds personalized HTML, sends it
         (different for user 42 vs user 99)
\`\`\`

This is where Servlets (and JSP) come in — they execute Java code to generate the response dynamically.

**Why Servlets instead of static files:**
| Aspect | Static File | Servlet (Dynamic) |
|--------|-------------|-------------------|
| Content | Fixed | Generated per-request |
| Data source | File on disk | Database, APIs, logic |
| Personalization | None | Full |
| Speed | Very fast | Slightly slower (computation) |
| Use case | CSS, images, docs | User pages, search, forms |

**In practice:** Web apps serve static assets (CSS/JS/images) directly and generate dynamic pages via Servlets or JSP. Modern frameworks like Spring Boot follow the same pattern.`,
  code: `// ===== Static vs Dynamic in the same web app =====

// 1. Static files go directly in src/main/webapp/
//    No Servlet needed — Tomcat serves them automatically:
//    http://localhost:8080/myapp/style.css
//    http://localhost:8080/myapp/logo.png
//    http://localhost:8080/myapp/index.html

// 2. Dynamic pages require a Servlet

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.time.*;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Dynamic: content changes per request (user, time, DB state)
        String user       = req.getParameter("user");
        String serverTime = LocalDateTime.now().toString();
        int    visitCount = getVisitCount(user); // hypothetical DB call

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        // Generated HTML — different for every user and every moment
        out.println("<!DOCTYPE html><html><body>");
        out.println("<h1>Welcome, " + user + "!</h1>");
        out.println("<p>Server time: " + serverTime + "</p>");
        out.println("<p>Your visit count: " + visitCount + "</p>");
        out.println("</body></html>");
    }

    private int getVisitCount(String user) {
        // In a real app: query the database
        return (int)(Math.random() * 100); // placeholder
    }
}

// Compare: a truly static version (no Servlet needed)
// File: src/main/webapp/about.html
/*
<!DOCTYPE html>
<html>
<body>
  <h1>About Us</h1>
  <p>This content never changes. No Servlet needed.</p>
</body>
</html>
*/`,
  codeTitle: 'Static File vs Dynamic Servlet Response',
  points: [
    'A static response serves the same file content for every request — HTML, CSS, images, JS served directly from disk by Tomcat',
    'A dynamic response is generated at runtime by a Servlet — content varies based on user, request parameters, database state, or time',
    'Tomcat serves static files in src/main/webapp automatically, without a Servlet — just put them there and they are accessible by URL',
    'Servlets exist specifically to generate dynamic responses — they read request parameters, query databases, and build the response programmatically',
    'Static responses are faster (just file I/O); dynamic responses are slightly slower but essential for personalized or data-driven content',
    'In production, static files are typically served by a CDN or Nginx, while dynamic requests are proxied to the Java application server',
    'Both static and dynamic content can be combined in one web app — a typical page loads static CSS/JS and dynamic HTML from the same app',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Do not put sensitive files (config files, properties files with credentials, internal JSPs) in the webapp root (outside WEB-INF). Files in the root are directly accessible via URL by anyone. Files inside WEB-INF/ are protected by Tomcat — they can only be accessed programmatically via a RequestDispatcher, never directly by a browser.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between a static and a dynamic web page?\nA: A static page is a pre-written HTML file that the server sends unchanged — the same content for every user. A dynamic page is generated at request time by server-side code (like a Servlet) — the content is built based on the request, user session, database queries, or business logic. Dynamic pages can be personalized and data-driven.",
    },
    {
      type: 'tip',
      content: "For best performance in a Servlet & JSP app, offload static assets to a CDN or configure Tomcat's DefaultServlet with caching headers. Only dynamic requests should go through your Servlet code. Serving static files through a Servlet wastes server resources.",
    },
  ],
}
