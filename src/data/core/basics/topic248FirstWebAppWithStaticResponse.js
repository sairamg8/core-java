export default {
  id: 'first-web-app-static-response',
  title: '248. First Web App with Static Response',
  explanation: `The first web app exercise creates a Servlet that returns a hard-coded (static) HTML response — no database, no parameters, just verifying that the Servlet setup works end-to-end.

**Goal:** Write a Servlet, deploy it to Tomcat, and confirm it responds to a browser request.

**What "static response" means here:**
The Servlet produces the same HTML every time — the response text is hard-coded in the Java code. It demonstrates the Servlet lifecycle and response writing mechanism before adding any dynamic behavior.

**Steps:**

1. Create a Dynamic Web Project in Eclipse
2. Add servlet-api.jar to the build path (or use Maven with provided scope)
3. Write the Servlet class
4. Map it with \`@WebServlet\`
5. Run on Tomcat server
6. Open browser at the mapped URL

**Writing the response:**
\`\`\`java
res.setContentType("text/html");        // 1. tell the browser the format
PrintWriter out = res.getWriter();      // 2. get the output channel
out.println("<html><body>");            // 3. write HTML
out.println("<h1>Hello!</h1>");
out.println("</body></html>");
// 4. connection closes automatically — no out.close() needed
\`\`\`

**The full request-response flow:**
1. Browser navigates to \`http://localhost:8080/myapp/hello\`
2. Tomcat receives the GET request
3. Tomcat finds the Servlet mapped to \`/hello\`
4. Tomcat calls \`doGet(request, response)\`
5. Servlet writes HTML to the response
6. Tomcat sends the response back to the browser
7. Browser renders the HTML`,
  code: `// ===== First Web App — Static Response Servlet =====
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

        // Step 1: Set the content type BEFORE getting the writer
        res.setContentType("text/html; charset=UTF-8");

        // Step 2: Set an HTTP response header (optional but good practice)
        res.setHeader("X-App-Version", "1.0");

        // Step 3: Get the output writer
        PrintWriter out = res.getWriter();

        // Step 4: Write the static HTML response
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'>");
        out.println("  <title>First Servlet</title>");
        out.println("  <style>body { font-family: Arial; margin: 40px; }</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("  <h1>Hello from Servlet!</h1>");
        out.println("  <p>This is a static response — same HTML every time.</p>");
        out.println("  <p>Served by Apache Tomcat via Java Servlet.</p>");
        out.println("  <hr>");
        out.println("  <small>URL: " + req.getRequestURI() + "</small>");
        out.println("</body>");
        out.println("</html>");

        // No need to call out.close() — Tomcat manages the connection
    }
}

// ===== Deployment checklist =====
// 1. Right-click project → Run As → Run on Server
// 2. Select your Tomcat server → Finish
// 3. Open browser: http://localhost:8080/<project-name>/hello
// 4. Expected: a styled HTML page saying "Hello from Servlet!"

// ===== Equivalent web.xml mapping (if not using @WebServlet) =====
/*
<servlet>
  <servlet-name>HelloServlet</servlet-name>
  <servlet-class>com.example.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>HelloServlet</servlet-name>
  <url-pattern>/hello</url-pattern>
</servlet-mapping>
*/`,
  codeTitle: 'First Servlet — Static HTML Response',
  points: [
    'Call res.setContentType() before res.getWriter() — setting it after the writer is obtained has no effect in some containers',
    'PrintWriter from res.getWriter() writes character data; use res.getOutputStream() for binary data (images, PDFs)',
    'The @WebServlet annotation maps the URL pattern "/hello" to this Servlet class — no web.xml mapping needed',
    'Tomcat calls doGet() automatically when a browser makes a GET request to the mapped URL pattern',
    'Do not close the PrintWriter — Tomcat manages the response lifecycle and closes it after doGet() returns',
    'The project name becomes the web application context path — access it at http://localhost:8080/projectname/pattern',
    'A "static response" Servlet is the first validation that the entire setup (Eclipse, Tomcat, Servlet) is working correctly',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you call res.getWriter() before res.setContentType(), the content type defaults to text/plain on some containers and the browser may not render HTML correctly. Always set setContentType('text/html') first. Similarly, once you have written output, calling setContentType() or setStatus() will have no effect — response headers must be set before any output is written.",
    },
    {
      type: 'interview',
      content: "Q: What is the context path of a web application in Tomcat?\nA: The context path is the prefix in the URL that identifies your web application, typically the name of your WAR file or project. For a WAR named 'myapp.war', the context path is '/myapp', and all URLs for that app start with http://localhost:8080/myapp/. The servlet path is added after the context path, so a @WebServlet('/hello') is accessed at http://localhost:8080/myapp/hello.",
    },
    {
      type: 'tip',
      content: "When testing your first Servlet, always check three things if the page does not load: (1) Is Tomcat running? (check the Servers view or catalina.out log); (2) Is the project deployed? (check the Servers view shows your project); (3) Is the URL correct? (context path + servlet pattern, case-sensitive on Linux). Most first-time issues are URL typos.",
    },
  ],
}
