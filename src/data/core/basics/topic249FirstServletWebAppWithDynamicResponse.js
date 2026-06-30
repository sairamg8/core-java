export default {
  id: 'first-servlet-dynamic-response',
  title: '249. First Servlet Web App with Dynamic Response',
  explanation: `A dynamic response uses data from the HTTP request — URL parameters, form inputs — to generate different output for different inputs.

**Adding dynamism:**
\`\`\`java
String name = req.getParameter("name"); // reads from URL: /greet?name=Alice
out.println("<h1>Hello, " + name + "!</h1>"); // changes per request
\`\`\`

**Full flow with an HTML form:**
1. User fills out an HTML form and clicks Submit
2. Browser sends a POST request with form field values
3. Servlet reads the values with \`req.getParameter()\`
4. Servlet generates a response based on those values

**HTML form → Servlet:**
\`\`\`html
<!-- Form sends POST to /greet -->
<form method="post" action="/myapp/greet">
  <input type="text" name="username" placeholder="Your name">
  <button type="submit">Greet Me</button>
</form>
\`\`\`

**Reading form parameters:**
\`\`\`java
String username = req.getParameter("username");
// "username" matches the name attribute of the input
\`\`\`

**Null safety:**
\`req.getParameter()\` returns \`null\` if the parameter is absent. Always null-check before using:
\`\`\`java
if (username == null || username.trim().isEmpty()) {
    username = "Guest";
}
\`\`\`

**Encoding note:**
For POST requests with special characters, call:
\`\`\`java
req.setCharacterEncoding("UTF-8");
\`\`\`
This must be called before the first \`getParameter()\` call.`,
  code: `// ===== Dynamic Response — Two Servlets: Form + Result =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

// Servlet 1: Displays the HTML form (GET /greet)
@WebServlet("/greet")
public class GreetServlet extends HttpServlet {

    // doGet: show the input form
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<!DOCTYPE html><html><body>");
        out.println("<h2>Enter your details</h2>");
        out.println("<form method='post' action='greet'>");
        out.println("  Name:  <input type='text' name='name'><br><br>");
        out.println("  Email: <input type='email' name='email'><br><br>");
        out.println("  Age:   <input type='number' name='age'><br><br>");
        out.println("  <button type='submit'>Submit</button>");
        out.println("</form>");
        out.println("</body></html>");
    }

    // doPost: process the form and respond dynamically
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Must call BEFORE getParameter() for proper UTF-8 decoding
        req.setCharacterEncoding("UTF-8");

        // Read form parameters
        String name  = req.getParameter("name");
        String email = req.getParameter("email");
        String ageStr= req.getParameter("age");

        // Null-safe defaults
        if (name  == null || name.isBlank())  name  = "Guest";
        if (email == null || email.isBlank()) email = "not provided";

        int age = 0;
        try {
            if (ageStr != null) age = Integer.parseInt(ageStr.trim());
        } catch (NumberFormatException e) {
            age = -1; // invalid
        }

        // Generate dynamic response
        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<!DOCTYPE html><html><body>");
        out.println("<h2>Welcome, " + name + "!</h2>");
        out.println("<p>Email: " + email + "</p>");

        if (age > 0) {
            out.println("<p>Age: " + age + " years old</p>");
            if (age >= 18) {
                out.println("<p style='color:green'>You are an adult.</p>");
            } else {
                out.println("<p style='color:orange'>You are a minor.</p>");
            }
        } else {
            out.println("<p>Age: not provided or invalid</p>");
        }

        out.println("<p><a href='greet'>Back to form</a></p>");
        out.println("</body></html>");
    }
}`,
  codeTitle: 'Dynamic Servlet — HTML Form POST + Personalized Response',
  points: [
    'req.getParameter("fieldName") reads URL query parameters (GET) and form body fields (POST) — same method for both',
    'Always call req.setCharacterEncoding("UTF-8") before the first getParameter() call to correctly decode special characters',
    'getParameter() returns null when the parameter is absent — always null-check before using the value',
    'The name attribute of an HTML <input> is the key used with getParameter() — they must match exactly',
    'doGet() serves the form; doPost() processes the form submission — this is the typical pattern for form-based web pages',
    'The form action attribute is the URL the browser sends the POST to — it must match the @WebServlet pattern',
    'Dynamic means the response HTML is built at runtime using request data — different input produces different output',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "req.setCharacterEncoding() must be called BEFORE the first call to getParameter(). Once Tomcat reads the request body to extract the first parameter, it is decoded — calling setCharacterEncoding() after that point has no effect and you get garbled special characters (especially non-ASCII: accented letters, CJK characters). Put it as the very first line in doPost().",
    },
    {
      type: 'interview',
      content: "Q: How does a browser send form data to a Servlet?\nA: For method='get', the browser appends form field names and values to the URL as a query string: /path?name=Alice&age=25. For method='post', the browser encodes the fields in the HTTP request body (as application/x-www-form-urlencoded by default). The Servlet reads both via req.getParameter() — the API is identical regardless of whether the data came from the URL or the body.",
    },
    {
      type: 'tip',
      content: "Generate form HTML in the Servlet's doGet() and process submissions in doPost(). This single URL (/greet) serves both the form (GET) and handles submission (POST). After processing POST, redirect with res.sendRedirect() to avoid double-submission on browser refresh (Post-Redirect-Get pattern).",
    },
  ],
}
