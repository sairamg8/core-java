export default {
  id: 'creating-a-jsp-page',
  title: '362. Creating a JSP Page',
  explanation: `A **JSP (JavaServer Page)** is an HTML page that can contain **dynamic** content. Instead of printing HTML from Java (see [[responding-to-the-client]]), you write the page as HTML and drop in small pieces that pull data from the server. At runtime the container compiles the JSP into a servlet and serves it.

**Where JSPs live in Spring Boot:** put them under \`src/main/webapp/WEB-INF/jsp/\`. Because JSP needs a servlet container to compile them, add the Tomcat Jasper and JSTL dependencies, and configure the view resolver prefix/suffix (see [[setting-prefix-and-suffix]]).

**Dynamic pieces inside a JSP:**
- **Expression Language (EL):** \`\${name}\` reads an attribute the controller put in the model and prints it.
- **Scriptlets:** \`<% ... %>\` embed raw Java (legacy — avoid in new code).
- **Directives:** \`<%@ page ... %>\` set page options; \`<%@ taglib ... %>\` import tag libraries like JSTL.
- **JSTL tags:** \`<c:forEach>\`, \`<c:if>\` add loops and conditions without scriptlets.

**Example page** that greets a user by a model attribute called \`name\`:
\`\`\`jsp
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<body>
  <h1>Hello \${name}</h1>
  <c:if test="\${marks > 40}">
    <p>You passed!</p>
  </c:if>
</body>
</html>
\`\`\`

The \`\${name}\` and \`\${marks > 40}\` are EL — the controller supplies \`name\` and \`marks\` through the model, and the JSP renders them into the HTML.`,
  code: `<%-- src/main/webapp/WEB-INF/jsp/home.jsp --%>
<%@ page contentType="text/html" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<body>
    <h1>Welcome, \${name}</h1>
    <ul>
        <c:forEach var="job" items="\${jobs}">
            <li>\${job.title}</li>
        </c:forEach>
    </ul>
</body>
</html>`,
  codeTitle: 'A JSP with EL and JSTL',
  points: [
    'A JSP is HTML with dynamic parts; the container compiles it into a servlet at runtime.',
    'In Spring Boot, JSPs live under src/main/webapp/WEB-INF/jsp/ and need Tomcat Jasper + JSTL.',
    'EL ${...} reads model attributes and prints them; JSTL tags add loops and conditions.',
    'Scriptlets <% %> embed raw Java but are legacy — prefer EL and JSTL.',
    'The controller supplies the values (name, jobs) through the model for the JSP to render.',
  ],
  callouts: [
    { type: 'gotcha', content: 'JSP support does not work with the default executable JAR packaging for JSPs under WEB-INF — use WAR packaging (or the documented workaround) so the container can compile pages in WEB-INF/jsp. Many beginners see a blank page or a download because of this.' },
    { type: 'tip', content: 'Keep Java out of JSPs: use EL and JSTL instead of scriptlets. It keeps views declarative and testable, and matches the MVC goal of a dumb view.' },
    { type: 'interview', content: 'Q: What does EL ${name} do in a JSP?\nA: It looks up an attribute named name in page/request/session/application scope (in that order) and writes its value into the output — commonly a value the controller placed in the model.' },
  ],
}
