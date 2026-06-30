export default {
  id: 'client-server-architecture',
  title: '243. Fundamentals of Client - Server Architecture',
  explanation: `Client-Server architecture is the model behind every web application. Understanding it is prerequisite to understanding how Servlets work.

**The two roles:**

**Client** — the entity that initiates a request. In web apps, this is typically a browser (Chrome, Firefox). The client sends an HTTP request and waits for a response.

**Server** — the entity that listens for requests and sends responses. In Java web apps, this is Tomcat running your Servlet.

**HTTP — the protocol:**
The web runs on HTTP (HyperText Transfer Protocol). Every interaction is a request-response pair:

\`\`\`
Client → HTTP Request → Server
Client ← HTTP Response ← Server
\`\`\`

**HTTP Request structure:**
\`\`\`
GET /employees?dept=Engineering HTTP/1.1
Host: example.com
Accept: text/html
User-Agent: Mozilla/5.0
\`\`\`
- **Method:** GET, POST, PUT, DELETE, PATCH
- **URL:** the resource path
- **Headers:** metadata (content type, auth tokens, cookies)
- **Body:** payload for POST/PUT requests

**HTTP Response structure:**
\`\`\`
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024

<html>...</html>
\`\`\`
- **Status code:** 200 OK, 404 Not Found, 500 Internal Server Error, 302 Redirect
- **Headers:** metadata about the response
- **Body:** the actual content (HTML, JSON, image bytes)

**Stateless nature:**
HTTP is stateless — each request is independent. The server has no memory of previous requests from the same client. Sessions and cookies are the mechanisms used to maintain state across requests.

**In Java web apps:**
- Tomcat is the server-side HTTP engine
- Your Servlet class is the application code that Tomcat calls for each matching URL
- HttpServletRequest wraps the incoming HTTP request
- HttpServletResponse wraps the outgoing HTTP response`,
  code: `// ===== Inspecting the HTTP Request inside a Servlet =====
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

@WebServlet("/request-info")
public class RequestInspectorServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<html><body><h2>HTTP Request Details</h2><pre>");

        // HTTP method and URL
        out.println("Method:      " + req.getMethod());
        out.println("Request URI: " + req.getRequestURI());
        out.println("Query String:" + req.getQueryString());
        out.println("Protocol:    " + req.getProtocol());
        out.println("Remote IP:   " + req.getRemoteAddr());
        out.println("Server Port: " + req.getServerPort());

        // URL parameters
        out.println("\\n--- Query Parameters ---");
        req.getParameterMap().forEach((name, values) ->
            out.println(name + " = " + Arrays.toString(values)));

        // Request headers
        out.println("\\n--- Request Headers ---");
        Enumeration<String> headers = req.getHeaderNames();
        while (headers.hasMoreElements()) {
            String name = headers.nextElement();
            out.println(name + ": " + req.getHeader(name));
        }

        out.println("</pre></body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();

        // Read POST body parameter (from an HTML form)
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        out.println("<html><body>");
        out.println("<h2>POST Received</h2>");
        out.println("<p>Username: " + username + "</p>");
        // Never echo passwords in real apps — this is just for illustration
        out.println("<p>Password length: " + (password != null ? password.length() : 0) + " chars</p>");
        out.println("</body></html>");
    }
}`,
  codeTitle: 'RequestInspectorServlet — Reading HTTP Request Details',
  points: [
    'Client-Server architecture: the client (browser) sends HTTP requests; the server (Tomcat + Servlet) processes them and sends responses',
    'HTTP is a stateless request-response protocol — each request is independent; the server has no memory of previous requests',
    'An HTTP request has a method (GET/POST/PUT/DELETE), a URL, headers, and optionally a body',
    'An HTTP response has a status code (200/404/500/302), headers, and a body (HTML, JSON, bytes)',
    'HttpServletRequest wraps the incoming request — use getMethod(), getParameter(), getHeader(), getRequestURI()',
    'HttpServletResponse wraps the outgoing response — use setContentType(), setStatus(), getWriter() to write the body',
    'Sessions and cookies are the mechanisms built on top of stateless HTTP to maintain user state across requests',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "HTTP is stateless — after the server sends the response, it has no memory of that request. If your Servlet reads a value from the request and you need it in the next request (like a logged-in user), you must store it in an HttpSession or a cookie. Storing user state in a Servlet instance variable is a bug — Servlets are singletons shared by all threads.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between HTTP GET and POST?\nA: GET appends parameters in the URL query string — visible, bookmarkable, cacheable, and limited in length. POST sends parameters in the request body — not visible in the URL, not cached, and with no practical size limit. Use GET for reading/querying data and POST for creating or modifying data (form submissions, login, uploads).",
    },
    {
      type: 'tip',
      content: "Open your browser DevTools (F12) and go to the Network tab while loading a page. Every request and response is shown — method, URL, status code, headers, and body. This is the single most valuable tool for understanding HTTP and debugging web apps. Use it constantly while learning Servlet & JSP.",
    },
  ],
}
