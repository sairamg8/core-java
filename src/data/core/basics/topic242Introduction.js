export default {
  id: 'servlet-jsp-introduction',
  title: '242. Introduction',
  explanation: `Servlet & JSP is Java's server-side web technology — the foundation that all Java web frameworks (Spring MVC, Struts, JSF) are built on.

**What problem does Servlet & JSP solve?**
The web works on HTTP: a browser sends a request, a server sends a response. For static files (HTML, images), a plain web server suffices. But when the response must be dynamic — showing a user's name, querying a database, processing a form — you need server-side code. Servlet & JSP is how Java does this.

**Servlet:**
A Servlet is a Java class that runs inside a servlet container (like Apache Tomcat). It receives HTTP requests and produces HTTP responses — typically HTML, JSON, or XML.

\`\`\`java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");
        res.getWriter().println("<h1>Hello from Servlet!</h1>");
    }
}
\`\`\`

**JSP (JavaServer Pages):**
JSP is an HTML file with Java code embedded using special tags. The container compiles JSP into a Servlet automatically. JSP is easier to write for view/presentation than generating HTML strings in Java.

\`\`\`jsp
<!-- hello.jsp -->
<html>
<body>
  <h1>Hello, <%= request.getParameter("name") %>!</h1>
</body>
</html>
\`\`\`

**The combination:**
Modern Java web apps separate concerns:
- Servlet handles the request, processes business logic, queries the database
- JSP renders the response (the view)
This is the MVC pattern.

**Why learn it now (even with Spring)?**
Spring MVC is built on top of Servlet. Understanding Servlet makes Spring internals transparent — you will understand DispatcherServlet, HttpServletRequest, filters, and session management without mystery.`,
  code: `// ===== Minimal end-to-end Servlet & JSP example =====

// 1. The Servlet (Controller) — handles the request
// File: src/main/java/com/example/GreetServlet.java
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/greet")
public class GreetServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Get input from the URL: /greet?name=Alice
        String name = request.getParameter("name");
        if (name == null || name.isBlank()) name = "World";

        // Pass data to the JSP view
        request.setAttribute("visitorName", name);

        // Forward to the JSP for rendering
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/greet.jsp");
        rd.forward(request, response);
    }
}

/* 2. The JSP (View) — renders the response
   File: src/main/webapp/WEB-INF/greet.jsp */

/*
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head><title>Greeting</title></head>
<body>
  <h1>Hello, ${visitorName}!</h1>
  <p>This response was generated dynamically by a Servlet + JSP.</p>
</body>
</html>
*/

// 3. Test:
// Start Tomcat, deploy WAR, visit http://localhost:8080/myapp/greet?name=Alice
// Browser shows: Hello, Alice!`,
  codeTitle: 'Hello World — Servlet Forwards to JSP',
  points: [
    'A Servlet is a Java class that handles HTTP requests and produces HTTP responses inside a servlet container like Tomcat',
    'JSP (JavaServer Pages) is an HTML file with embedded Java — the container compiles it into a Servlet automatically',
    'The @WebServlet annotation maps a URL pattern to a Servlet class, replacing the need for web.xml URL mappings',
    'Servlets extend HttpServlet and override doGet() or doPost() to handle the respective HTTP methods',
    'Spring MVC is built on top of Servlet — understanding Servlet makes all Spring web concepts transparent',
    'The Servlet + JSP combination naturally implements MVC: Servlet = Controller, JSP = View, data = Model',
    'HttpServletRequest carries all request data (parameters, headers, session); HttpServletResponse is the output channel',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "JSP files placed directly in src/main/webapp (outside WEB-INF) are accessible directly by URL — users can request the JSP directly and bypass the Servlet. Place JSP files inside WEB-INF/ so they can only be accessed via a RequestDispatcher forward from a Servlet, which enforces your MVC flow.",
    },
    {
      type: 'interview',
      content: "Q: What is the role of a Servlet container and name one example?\nA: A Servlet container (also called a web container) is the runtime environment that manages Servlet lifecycle, handles HTTP connections, maps URLs to Servlet classes, manages sessions, and provides the javax.servlet API. Apache Tomcat is the most widely used Servlet container. Others include Jetty, WildFly, and GlassFish.",
    },
    {
      type: 'tip',
      content: "Even if you will only ever use Spring Boot in your career, spend time understanding raw Servlet & JSP. When a Spring request fails, the error stack trace will mention HttpServlet, FilterChain, and DispatcherServlet. Knowing what those are turns cryptic errors into understandable ones.",
    },
  ],
}
