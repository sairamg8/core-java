export default {
  id: 'request-dispatching-forward-include',
  title: '253. Request Dispatching and forward() vs include()',
  explanation: `A \`RequestDispatcher\` lets a Servlet pass control (or include content) from another resource — a JSP, HTML file, or another Servlet — without a browser redirect.

**Getting a RequestDispatcher:**
\`\`\`java
// From request (relative to current servlet)
RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/result.jsp");

// From ServletContext (absolute path from webapp root)
RequestDispatcher rd = getServletContext().getRequestDispatcher("/WEB-INF/result.jsp");
\`\`\`

**Two methods:**

**forward(request, response):**
- Transfers complete control to the target resource
- The target handles the entire response
- The calling Servlet must NOT have written to the response yet (or only buffered output)
- URL in browser stays at the Servlet's URL
- Use this to delegate rendering to a JSP

**include(request, response):**
- Includes the output of the target resource into the current response
- The calling Servlet retains control and can write more output after include
- Both the Servlet and the included JSP contribute to the response
- Use this for reusable page fragments (headers, footers, menus)

**forward — full control transfer:**
\`\`\`java
req.setAttribute("data", myObject);
RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/view.jsp");
rd.forward(req, res);  // Servlet is done — JSP writes the whole response
// Do NOT write to res after this
\`\`\`

**include — insert a fragment:**
\`\`\`java
res.getWriter().println("<html><body>");
RequestDispatcher header = req.getRequestDispatcher("/WEB-INF/header.jsp");
header.include(req, res); // insert header fragment

res.getWriter().println("<main>Page content here</main>");

RequestDispatcher footer = req.getRequestDispatcher("/WEB-INF/footer.jsp");
footer.include(req, res); // insert footer fragment
res.getWriter().println("</body></html>");
\`\`\``,
  code: `// ===== RequestDispatcher — forward() and include() =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

// ===== Servlet using forward() to render a JSP view =====
@WebServlet("/employees")
public class EmployeeListServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // Step 1: Load model data (in real app: from DB)
        List<String> employees = Arrays.asList("Alice", "Bob", "Carol", "Dave");
        int total = employees.size();

        // Step 2: Put data into request attributes
        req.setAttribute("employeeList", employees);
        req.setAttribute("totalCount", total);
        req.setAttribute("pageTitle", "Employee Directory");

        // Step 3: Forward to JSP — JSP writes the entire HTML response
        RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/views/employees.jsp");
        rd.forward(req, res);

        // IMPORTANT: Do NOT write to res after forward() — it will throw IllegalStateException
        // Do NOT: res.getWriter().println("anything"); // wrong!
    }
}

// ===== Servlet using include() for page fragments (header/footer) =====
@WebServlet("/product-detail")
public class ProductDetailServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String productId = req.getParameter("id");

        res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        // Include shared header fragment
        RequestDispatcher header = req.getRequestDispatcher("/WEB-INF/fragments/header.jsp");
        header.include(req, res);

        // Main content from this Servlet
        out.println("<main class='content'>");
        out.println("  <h2>Product Details — ID: " + productId + "</h2>");
        out.println("  <p>Name: Java Programming Book</p>");  // from DB in real app
        out.println("  <p>Price: $49.99</p>");
        out.println("</main>");

        // Include shared footer fragment
        RequestDispatcher footer = req.getRequestDispatcher("/WEB-INF/fragments/footer.jsp");
        footer.include(req, res);
    }
}

/* ===== WEB-INF/views/employees.jsp =====
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head><title>\${pageTitle}</title></head>
<body>
  <h2>\${pageTitle} (\${totalCount} employees)</h2>
  <ul>
    <c:forEach var="emp" items="\${employeeList}">
      <li>\${emp}</li>
    </c:forEach>
  </ul>
</body>
</html>
*/`,
  codeTitle: 'RequestDispatcher — forward() for MVC and include() for Fragments',
  points: [
    'RequestDispatcher is obtained from request.getRequestDispatcher(path) or getServletContext().getRequestDispatcher(path)',
    'forward() transfers complete control to the target — the calling Servlet must not write response output before calling it',
    'include() inserts the target resource output into the current response — the Servlet retains control and can write more after',
    'Request attributes set with req.setAttribute() are visible in the forwarded/included JSP via EL expressions',
    'Use forward() for the MVC pattern: Servlet sets model data as attributes, then forwards to JSP for rendering',
    'Use include() for reusable page components like headers, footers, and navigation menus shared across pages',
    'Paths starting with / are relative to the webapp root; paths without / are relative to the current Servlet',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Calling rd.forward() after already writing output to the response throws an IllegalStateException: Cannot forward after response has been committed. If the output buffer is full and Tomcat has already flushed it to the client, the response is committed and you cannot forward. Call forward() before writing ANY output, or use include() if you need to write some content first.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between RequestDispatcher.forward() and RequestDispatcher.include()?\nA: forward() gives complete control of the response to the target resource — the source Servlet cannot write anything after calling forward(). include() inserts the target resource's output into the current response at the point of the call — the source Servlet can write content before and after the include. Use forward() for MVC rendering (Servlet sets model, JSP writes everything). Use include() for inserting reusable fragments.",
    },
    {
      type: 'tip',
      content: "In a standard MVC Servlet pattern: always call req.setAttribute() to set model data, then rd.forward() as the last line in doGet(). Never put code after forward() — it will execute but the output will be lost (or cause IllegalStateException if the response is already committed). Return immediately after forward() to make the intent clear.",
    },
  ],
}
