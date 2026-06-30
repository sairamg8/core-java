export default {
  id: 'introduction-to-jsp',
  title: '256. Introduction to JSP',
  explanation: `JSP (JavaServer Pages) is a technology for creating dynamic web pages by embedding Java code inside HTML. The container compiles each JSP into a Servlet automatically.

**Why JSP exists:**
Writing HTML inside a Servlet (PrintWriter + out.println) is painful:
\`\`\`java
out.println("<table><tr><td>" + name + "</td></tr></table>"); // ugly, error-prone
\`\`\`
JSP flips this: HTML is the document; Java is embedded where needed:
\`\`\`jsp
<table><tr><td><%= name %></td></tr></table>  <!-- much cleaner -->
\`\`\`

**JSP scripting elements (legacy, avoid in new code):**

| Element | Syntax | Purpose |
|---------|--------|---------|
| Scriptlet | \`<% Java code %>\` | Executable statements |
| Expression | \`<%= value %>\` | Output a value |
| Declaration | \`<%! field/method %>\` | Declare a field or method |
| Directive | \`<%@ directive %>\` | Page config, imports, taglibs |
| Comment | \`<%-- text --%>\` | Comment not sent to browser |

**JSP directives:**
\`\`\`jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
\`\`\`

**Implicit objects (available in every JSP without declaration):**
| Object | Type | Description |
|--------|------|-------------|
| \`request\` | HttpServletRequest | The HTTP request |
| \`response\` | HttpServletResponse | The HTTP response |
| \`session\` | HttpSession | The user session |
| \`application\` | ServletContext | The web app context |
| \`out\` | JspWriter | Output stream |
| \`pageContext\` | PageContext | Access to all scopes |

**JSP is compiled to a Servlet:**
When Tomcat first receives a request for a JSP, it compiles it into a Servlet class and caches it. Subsequent requests use the cached Servlet — no re-compilation unless the JSP file changes.

**Modern approach — EL + JSTL:**
Avoid scriptlets (\`<% %>\`). Use Expression Language (EL: \`\${}\`) and JSTL tags instead. Much cleaner and less error-prone.`,
  code: `<%-- ===== Introduction to JSP — All Scripting Elements ===== --%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List, java.util.Arrays" %>

<%-- Declaration: defines a method at the Servlet class level --%>
<%!
    private String greet(String name) {
        return "Hello, " + (name != null ? name : "World") + "!";
    }
    private int pageCount = 0; // class-level field (shared across requests — be careful)
%>

<!DOCTYPE html>
<html>
<head><title>JSP Introduction</title></head>
<body>

<h2>JSP Scripting Elements Demo</h2>

<%-- Expression: outputs a value directly --%>
<p>Server time: <%= new java.util.Date() %></p>

<%-- Scriptlet: executable Java code --%>
<%
    pageCount++;
    String userName = request.getParameter("name"); // implicit 'request' object
    List<String> items = Arrays.asList("Java", "Spring", "Servlet", "JSP");
%>

<%-- Expression using scriptlet variable --%>
<p><%= greet(userName) %></p>

<%-- Scriptlet with HTML loop (old way — avoid in new code) --%>
<ul>
  <% for (String item : items) { %>
    <li><%= item %></li>
  <% } %>
</ul>

<p>This page has been rendered <%= pageCount %> time(s) since Tomcat started.</p>

<hr>
<h3>Implicit Objects Demo</h3>
<p>Request URI: <%= request.getRequestURI() %></p>
<p>Session ID: <%= session.getId() %></p>
<p>Context path: <%= application.getContextPath() %></p>

<hr>
<%-- Reading a request attribute set by a Servlet (from forward()) --%>
<h3>Model Data from Servlet</h3>
<%
    String servletMessage = (String) request.getAttribute("message");
    if (servletMessage != null) {
%>
    <p>Message from Servlet: <%= servletMessage %></p>
<% } else { %>
    <p>No attribute set (access this JSP via a Servlet forward for model data)</p>
<% } %>

<%-- The modern way: Expression Language (EL) — use this instead of scriptlets --%>
<hr>
<h3>Modern EL Syntax (preferred)</h3>
<p>Name from URL: \${param.name}</p>
<p>Message attribute: \${message}</p>
<p>Session user: \${sessionScope.loggedInUser}</p>

</body>
</html>`,
  codeTitle: 'JSP Scripting Elements, Implicit Objects, and EL',
  points: [
    'JSP lets you write HTML with embedded Java — it is compiled by the container into a Servlet the first time it is requested',
    'Scriptlets (<% %>) contain executable Java statements; Expressions (<%= %>) output a single value',
    'Declarations (<%! %>) define class-level methods and fields — be careful, fields are shared across requests',
    'JSP directives (<%@ page %>, <%@ taglib %>) configure the page and import libraries',
    'JSP implicit objects (request, response, session, out, application) are available in every JSP without declaration',
    'Expression Language (EL: ${}) is the modern replacement for scriptlets — cleaner, less error-prone, preferred',
    'Avoid scriptlets in new JSP code — use JSTL tags and EL expressions for all logic and output',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "JSP declarations (<%! %>) create class-level fields in the generated Servlet — they are shared across ALL concurrent requests. This is the same singleton/thread-safety problem as Servlet instance variables. A pageCount field declared in JSP is shared by all users. Only use declarations for stateless utility methods, never for per-request state.",
    },
    {
      type: 'interview',
      content: "Q: How is a JSP different from a Servlet? How are they related?\nA: A JSP is HTML with embedded Java; a Servlet is Java that generates HTML. They are functionally equivalent — the container compiles each JSP file into a Servlet class before executing it. JSP is easier to write for view/presentation because the HTML structure is natural. Servlet is better for controller logic. In MVC, Servlets act as controllers and JSPs as views.",
    },
    {
      type: 'tip',
      content: "In modern JSP development, write ZERO lines of Java in your JSP files. All logic stays in the Servlet (or service layer). The JSP only uses EL (${}) to display values and JSTL (<c:forEach>, <c:if>) for simple iteration and conditionals. This enforces the separation of concerns that MVC requires and makes JSPs much easier to maintain.",
    },
  ],
}
