export default {
  id: 'servlet-doget-vs-dopost',
  title: '251. Servlet doGet() vs doPost()',
  explanation: `\`doGet()\` and \`doPost()\` are the two most-used methods in an HttpServlet. They correspond directly to the HTTP GET and POST methods.

**doGet() — for reading:**
- Triggered when the browser navigates to a URL or clicks a link
- Form data is appended to the URL as a query string: \`/search?q=java\`
- URL length limit (varies by browser/server, ~2000 chars for safety)
- Requests are cached, bookmarkable, and idempotent (repeating produces same result)
- Use for: search, filtering, navigation, any read-only operation

**doPost() — for writing:**
- Triggered by a form with \`method="post"\`
- Form data is in the request body — not visible in the URL
- No practical size limit (large file uploads use POST/multipart)
- Not cached, not bookmarkable, not idempotent (repeating creates duplicates)
- Use for: form submission, login, creating/updating/deleting data

**Both methods in one Servlet:**
\`\`\`java
// GET /products → show the search form
doGet() { show form }

// POST /products → process the search
doPost() { read parameters, query DB, show results }
\`\`\`

**Sharing logic between doGet and doPost:**
\`\`\`java
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ... {
    processRequest(req, res);  // delegate to shared method
}

@Override
protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ... {
    processRequest(req, res);  // same logic for both
}

private void processRequest(HttpServletRequest req, HttpServletResponse res) throws ... {
    // shared implementation
}
\`\`\`

**Default behavior (not overriding):**
If you do not override \`doGet()\`, and a GET request comes in, HttpServlet's default \`doGet()\` sends a \`405 Method Not Allowed\` response. Same for \`doPost()\`. Override only the methods your Servlet needs to handle.`,
  code: `// ===== doGet vs doPost — ProductServlet Example =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {

    // doGet — handles: GET /products and GET /products?category=Electronics
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String category = req.getParameter("category"); // from URL query string

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<!DOCTYPE html><html><body>");
        out.println("<h2>Products" + (category != null ? " — " + category : "") + "</h2>");

        // Show search form
        out.println("<form method='post' action='products'>");
        out.println("  Search: <input type='text' name='keyword'>");
        out.println("  <button type='submit'>Search</button>");
        out.println("</form>");

        // Show product list (in real app: from DB)
        if (category != null) {
            out.println("<p>Showing products in: " + category + "</p>");
            out.println("<ul><li>Laptop</li><li>Monitor</li></ul>"); // from DB
        } else {
            out.println("<p>Showing all products</p>");
            out.println("<ul><li>All products here</li></ul>");
        }

        out.println("</body></html>");
    }

    // doPost — handles: POST /products (form submission with keyword)
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        String keyword = req.getParameter("keyword");
        if (keyword == null || keyword.isBlank()) keyword = "";

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<!DOCTYPE html><html><body>");
        out.println("<h2>Search Results for: " + keyword + "</h2>");

        // In real app: query DB with keyword
        if (!keyword.isEmpty()) {
            out.println("<ul>");
            out.println("  <li>Java Programming Book (matched: " + keyword + ")</li>");
            out.println("  <li>Java Notebook (matched: " + keyword + ")</li>");
            out.println("</ul>");
        } else {
            out.println("<p>Please enter a search keyword.</p>");
        }

        out.println("<p><a href='products'>Back to all products</a></p>");
        out.println("</body></html>");
    }
}

// ===== HTML forms that trigger each method =====
/*
<!-- GET form — keyword appears in URL: /products?keyword=java -->
<form method="get" action="products">
  <input type="text" name="keyword">
  <button>Search (GET)</button>
</form>

<!-- POST form — keyword in request body, not in URL -->
<form method="post" action="products">
  <input type="text" name="keyword">
  <button>Search (POST)</button>
</form>
*/`,
  codeTitle: 'doGet() vs doPost() — ProductServlet with Search Form',
  points: [
    'doGet() handles HTTP GET requests — data is in the URL query string, visible, bookmarkable, and idempotent',
    'doPost() handles HTTP POST requests — data is in the request body, not visible in the URL, not cached',
    'Use GET for read-only operations (search, display); use POST for write operations (login, create, update, delete)',
    'Both methods have the same signature (HttpServletRequest, HttpServletResponse) and are called by Tomcat automatically',
    'If you do not override doGet() and a GET arrives, the default HttpServlet implementation returns 405 Method Not Allowed',
    'A single Servlet can handle both GET and POST on the same URL — very common for form pages (GET shows form, POST processes it)',
    'To share logic between doGet and doPost, extract it into a private processRequest() method and call it from both',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Never use GET for operations that change server state (creating, updating, deleting). If a user bookmarks a GET URL that deletes a record, or a search engine crawls it, the deletion runs every time. POST is not bookmarkable and not auto-crawled, making it the correct choice for all mutating operations.",
    },
    {
      type: 'interview',
      content: "Q: Can you send a body in a GET request? Can a POST have query parameters?\nA: Technically yes to both, but: GET requests conventionally have no body and most frameworks ignore it. POST can have query parameters in the URL AND a body at the same time — req.getParameter() reads from both. In practice, POST data goes in the body and GET data goes in the URL — mixing them is non-standard and should be avoided for clarity.",
    },
    {
      type: 'tip',
      content: "For REST-style Servlets (APIs), also override doPut() and doDelete() for update and delete operations respectively. This maps the HTTP verb to the action semantically: GET=read, POST=create, PUT=update, DELETE=delete. Frameworks like Spring MVC build on this exact convention.",
    },
  ],
}
