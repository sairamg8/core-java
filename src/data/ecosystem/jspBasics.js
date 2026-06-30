export default {
  id: 'jsp-basics',
  title: '2. JavaServer Pages (JSP)',
  explanation: `**JSP (JavaServer Pages)** is a server-side technology for generating dynamic HTML. A JSP file is essentially an HTML file with Java code embedded in it. The container compiles JSPs into Servlets automatically.

**JSP Syntax:**
| Tag | Meaning |
|---|---|
| \`<% code %>\` | Scriptlet — Java code executed on each request |
| \`<%= expr %>\` | Expression — evaluates and prints result |
| \`<%! decl %>\` | Declaration — instance variable or method |
| \`<%@ directive %>\` | Directive — page settings, imports, includes |

**Expression Language (EL):**
Cleaner syntax for accessing data: \`\${variable}\`, \`\${bean.property}\`, \`\${map.key}\`

**JSTL (JSP Standard Tag Library):**
Replaces Java scriptlets with tags: \`<c:forEach>\`, \`<c:if>\`, \`<c:out>\`

**Modern reality:** In production Spring Boot apps, **Thymeleaf** or **React/Angular** replaces JSP. JSP is important for interviews and legacy system maintenance.`,
  code: `<%-- WEB-INF/views/greeting.jsp --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt"  prefix="fmt" %>
<!DOCTYPE html>
<html>
<head><title>User Dashboard</title></head>
<body>

<%-- EL — access request attribute set by the servlet --%>
<h1>Welcome, \${user.name}!</h1>

<%-- EL with safe output (escapes HTML special chars) --%>
<p>Your email: <c:out value="\${user.email}" /></p>

<%-- Conditional rendering --%>
<c:if test="\${user.admin}">
    <a href="/admin">Admin Panel</a>
</c:if>

<%-- Choose / When / Otherwise (if-else) --%>
<c:choose>
    <c:when test="\${user.salary gt 100000}">
        <span class="badge">Senior</span>
    </c:when>
    <c:otherwise>
        <span class="badge">Junior</span>
    </c:otherwise>
</c:choose>

<%-- Loop over a list --%>
<table>
    <c:forEach var="item" items="\${orderList}" varStatus="status">
        <tr>
            <td>\${status.index + 1}</td>
            <td><c:out value="\${item.product}" /></td>
            <td><fmt:formatNumber value="\${item.price}" type="currency" /></td>
        </tr>
    </c:forEach>
</table>

<%-- Scriptlet (avoid in real code — use EL/JSTL instead) --%>
<%
    String legacyVar = "old style";
    out.println("Avoid this: " + legacyVar);
%>

</body>
</html>`,
  points: [
    'Scriptlets (<% %>) mix Java and HTML — hard to maintain. Prefer EL (${}) and JSTL tags',
    'EL automatically calls getters: ${user.name} calls user.getName() via reflection',
    'JSTL must be added as a dependency (jakarta.servlet.jsp.jstl) and declared with <%@ taglib %>',
    'JSPs in WEB-INF/ are not directly accessible by URL — they can only be forwarded to by a Servlet (protects them)',
    'Spring MVC uses InternalResourceViewResolver to forward to JSPs; Thymeleaf does the same with HTML files',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the MVC pattern in Servlet + JSP applications?\nA: Model-View-Controller: the Servlet is the Controller (handles request, runs business logic, prepares data), the JSP is the View (renders HTML using request attributes set by the servlet), and the Model is a POJO (plain Java object) or DAO holding the data. The Servlet sets the model as a request attribute then forwards to the JSP to render it.',
    },
    {
      type: 'gotcha',
      content: '<%= expr %> does NOT escape HTML — if expr contains user input with <script> tags, you have an XSS vulnerability. Always use <c:out value="${expr}"/> or EL ${fn:escapeXml(expr)} when displaying user-supplied data.',
    },
  ],
}
