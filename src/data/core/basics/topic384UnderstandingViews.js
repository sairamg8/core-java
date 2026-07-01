export default {
  id: 'job-app-understanding-views',
  title: '384. Understanding Views',
  explanation: `The Job app (see [[job-app-creating-project]]) needs exactly two views, both plain JSPs under \`WEB-INF/views/\` (see [[internal-resource-view-resolver]]):

- **\`home.jsp\`** — the landing page. Lists every job currently in \`JobService\`, and links to the add-job form.
- **\`addJob.jsp\`** — the submission form. Collects a description, URL, and profile, and posts them back to \`/addJob\`.

**How a controller connects to a view — nothing new, just the same flow (see [[dispatcherservlet]]) applied here:**
\`\`\`java
@RequestMapping("/")
public String home(Model model) {
    model.addAttribute("jobs", jobService.findAll());
    return "home";              // -> /WEB-INF/views/home.jsp
}
\`\`\`

**\`home.jsp\` sketch — iterating model data with JSTL:**
\`\`\`jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<h2>Jobs Applied To</h2>
<table>
    <c:forEach var="job" items="\${jobs}">
        <tr>
            <td>\${job.description}</td>
            <td>\${job.profile}</td>
        </tr>
    </c:forEach>
</table>
<a href="addJob">Add a new job</a>
\`\`\`

The \`\${jobs}\` expression reads straight from the model the controller populated — no extra plumbing. \`<c:forEach>\` is JSTL's loop tag (see [[jsp-tags-web-app]]), the standard way to iterate a collection without dropping into scriptlet Java code inside the JSP.

The next few topics build \`HomeController\`/\`AddJobController\` (see [[home-and-add-job-controller]]), the form itself (see [[job-app-handling-forms]]), and the model wiring in full (see [[job-app-view-data]]).`,
  code: `<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<body>
    <h2>Jobs Applied To</h2>
    <table border="1">
        <tr><th>Description</th><th>Profile</th><th>URL</th></tr>
        <c:forEach var="job" items="\${jobs}">
            <tr>
                <td>\${job.description}</td>
                <td>\${job.profile}</td>
                <td>\${job.url}</td>
            </tr>
        </c:forEach>
    </table>
    <a href="addJob">Add a new job</a>
</body>
</html>`,
  codeTitle: 'home.jsp: rendering the job list',
  points: [
    'The app needs exactly two views: home.jsp (the job list) and addJob.jsp (the submission form).',
    'A controller populates the Model, returns a logical view name, and the JSP reads that data through EL expressions like ${jobs}.',
    '<c:forEach> is JSTL\'s loop tag - the standard way to iterate a collection in a JSP without scriptlet Java code.',
    'Views live under WEB-INF/views/, unreachable directly by URL, exactly as configured by InternalResourceViewResolver.',
    'Nothing new is introduced at the view-resolution level here - this is the same DispatcherServlet flow applied to a real example.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting the taglib directive (<%@ taglib ... prefix="c" %>) makes <c:forEach> render as literal text instead of executing, since the JSP engine has no idea what the "c" prefix means without it.' },
    { type: 'interview', content: 'Q: How does a value placed in the Model by a controller become accessible inside a JSP?\nA: The DispatcherServlet passes the Model\'s attributes into the request scope before forwarding to the view. Inside the JSP, they are then readable via EL expressions like ${attributeName}, and JSTL tags such as <c:forEach> can iterate collection-typed attributes directly.' },
  ],
}
