export default {
  id: 'jsp-tags-web-app',
  title: '257. JSP Tags and Web App using JSP',
  explanation: `JSP Tags replace Java scriptlets with XML-style tags that are cleaner, reusable, and keep JSP focused on presentation. The standard tag library is **JSTL** (JSP Standard Tag Library).

**JSTL Core Tag Library setup:**
Add to pom.xml:
\`\`\`xml
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>jstl</artifactId>
  <version>1.2</version>
</dependency>
\`\`\`
Import in JSP:
\`\`\`jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
\`\`\`

**Essential JSTL core tags:**

\`<c:out value="\${expr}"/>\` — output a value (escapes HTML by default)

\`<c:if test="\${condition}">\` — conditional rendering

\`<c:choose>/<c:when>/<c:otherwise>\` — if/else-if/else

\`<c:forEach var="item" items="\${list}">\` — iterate a collection

\`<c:set var="x" value="5" scope="page"/>\` — set a variable

\`<c:url value="/path"/>\` — build a context-aware URL

\`<c:redirect url="/path"/>\` — redirect from JSP

**Expression Language (EL):**
EL expressions \`\${}\` access scoped variables, request parameters, and session attributes:
\`\`\`jsp
\${user.name}             <!-- bean property -->
\${sessionScope.cart}    <!-- explicit scope -->
\${param.keyword}        <!-- request parameter -->
\${empty list}           <!-- true if null or empty -->
\`\`\`

**Four scopes (searched in order by EL):**
1. \`pageScope\` — current JSP page only
2. \`requestScope\` — current request (set by Servlet via setAttribute)
3. \`sessionScope\` — the user's session
4. \`applicationScope\` — entire web application`,
  code: `<%-- ===== JSP Tags and JSTL Web App ===== --%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt"  prefix="fmt" %>

<!DOCTYPE html>
<html>
<head><title>Employee List</title></head>
<body>

<h2>Employee Directory</h2>

<%-- c:out — safe output with HTML escaping --%>
<p>Page title: <c:out value="\${pageTitle}" default="Employees"/></p>

<%-- c:if — simple conditional --%>
<c:if test="\${not empty loggedInUser}">
  <p>Welcome, <c:out value="\${loggedInUser}"/>!</p>
</c:if>

<c:if test="\${empty loggedInUser}">
  <p><a href="login">Please log in</a></p>
</c:if>

<%-- c:choose — if / else-if / else --%>
<c:choose>
  <c:when test="\${totalCount == 0}">
    <p style="color:red">No employees found.</p>
  </c:when>
  <c:when test="\${totalCount lt 10}">
    <p style="color:orange">Small team: \${totalCount} employee(s)</p>
  </c:when>
  <c:otherwise>
    <p style="color:green">Team size: \${totalCount} employee(s)</p>
  </c:otherwise>
</c:choose>

<%-- c:forEach — iterate a list set by Servlet (req.setAttribute("employees", list)) --%>
<table border="1" cellpadding="8">
  <thead>
    <tr><th>ID</th><th>Name</th><th>Department</th><th>Salary</th></tr>
  </thead>
  <tbody>
    <c:choose>
      <c:when test="\${empty employees}">
        <tr><td colspan="4">No employees to display.</td></tr>
      </c:when>
      <c:otherwise>
        <c:forEach var="emp" items="\${employees}" varStatus="status">
          <tr style="background:\${status.index % 2 == 0 ? '#f9f9f9' : '#ffffff'}">
            <td><c:out value="\${emp.id}"/></td>
            <td><c:out value="\${emp.name}"/></td>
            <td><c:out value="\${emp.department}"/></td>
            <td>
              <%-- fmt:formatNumber — format salary as currency --%>
              <fmt:formatNumber value="\${emp.salary}" type="currency" currencySymbol="$"/>
            </td>
          </tr>
        </c:forEach>
      </c:otherwise>
    </c:choose>
  </tbody>
</table>

<%-- c:url — builds context-aware URL (handles context path automatically) --%>
<p>
  <a href="<c:url value='/employees?action=add'/>">Add Employee</a> |
  <a href="<c:url value='/logout'/>">Logout</a>
</p>

<%-- c:set — set a variable within JSP --%>
<c:set var="threshold" value="80000" scope="page"/>
<p>Employees earning over \${threshold}:</p>
<c:forEach var="emp" items="\${employees}">
  <c:if test="\${emp.salary gt threshold}">
    <span>\${emp.name} (\${emp.salary}) &nbsp;</span>
  </c:if>
</c:forEach>

</body>
</html>`,
  codeTitle: 'JSTL Core Tags — c:if, c:forEach, c:choose, c:url, fmt:formatNumber',
  points: [
    'JSTL (JSP Standard Tag Library) replaces Java scriptlets with reusable XML-style tags — add the jstl dependency in pom.xml',
    'Import JSTL with <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> at the top of each JSP',
    'c:forEach iterates any Iterable (List, Set, array) — varStatus gives index, count, first, and last metadata',
    'c:choose/c:when/c:otherwise is JSP if/else-if/else — use it instead of Java if-else in scriptlets',
    'c:out escapes HTML special characters by default — prevents XSS when displaying user-supplied content',
    'EL ${} automatically searches page, request, session, and application scopes in that order for named attributes',
    'Use c:url for all links in JSP — it automatically prepends the context path so links work regardless of deployment context',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "EL ${user.name} does NOT call getUser().getName() unless 'user' is a Java Bean with a proper getName() method. EL uses reflection to call get+PropertyName(). If your object does not follow Java Bean conventions (public getters with matching property names), EL returns an empty string silently — no exception, just blank output. Always use proper Java Bean naming.",
    },
    {
      type: 'interview',
      content: "Q: What is JSTL and why is it preferred over scriptlets?\nA: JSTL (JSP Standard Tag Library) provides XML-style tags for common operations: conditionals, loops, URL handling, formatting, and internationalization. It is preferred over scriptlets because: (1) it keeps JSPs free of Java code, (2) tags are readable by HTML designers who do not know Java, (3) it enforces a clean view layer in MVC, and (4) JSTL tags are tested and handle edge cases (null safety, HTML escaping) correctly.",
    },
    {
      type: 'tip',
      content: "The fmt taglib (<%@ taglib uri='http://java.sun.com/jsp/jstl/fmt' prefix='fmt' %>) handles number and date formatting. Use <fmt:formatNumber type='currency'/> for prices, <fmt:formatDate pattern='yyyy-MM-dd'/> for dates. This is much cleaner than calling String.format() inside scriptlets.",
    },
  ],
}
