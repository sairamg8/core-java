export default {
  id: 'job-app-handling-forms',
  title: '386. Handling Forms',
  explanation: `\`addJob.jsp\` uses **Spring's form tag library** rather than plain HTML \`<form>\`/\`<input>\` tags, because the form tags bind directly to the command object placed in the model by \`AddJobController\` (see [[home-and-add-job-controller]]).

\`\`\`jsp
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<form:form modelAttribute="job" method="post" action="addJob">
    Description: <form:input path="description" /><br/>
    URL: <form:input path="url" /><br/>
    Profile: <form:input path="profile" /><br/>
    <input type="submit" value="Add Job" />
</form:form>
\`\`\`

**What each attribute does:**
- **\`modelAttribute="job"\`** — tells the form which object in the model to bind to; it must match the name used in \`model.addAttribute("job", ...)\`.
- **\`path="description"\`** — the property on that object this input reads from and writes to. Spring generates the \`name\` attribute and pre-fills the \`value\` attribute from \`job.getDescription()\` automatically.
- **\`action="addJob"\`** — where the form posts to; matched by \`AddJobController\`'s \`POST /addJob\` handler.

**Why not plain \`<input name="description">\`?** It works too — \`@ModelAttribute\` binds by matching request parameter *names* to property names regardless of which tag produced the input. Spring's form tags add two things plain HTML can't: **automatic value pre-filling** (editing an existing job would show its current values without manual work) and **validation error rendering** (\`<form:errors path="description" />\` shows Bean Validation messages next to the field they belong to, once \`@Valid\` is introduced).

For this simple add-only form, plain HTML would work identically — the form tags are worth learning here because they're the standard approach the moment a form needs pre-filled or validated fields.`,
  code: `<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<html>
<body>
    <h2>Add a Job</h2>
    <form:form modelAttribute="job" method="post" action="addJob">
        Description: <form:input path="description" /><br/>
        URL: <form:input path="url" /><br/>
        Profile: <form:input path="profile" /><br/>
        <input type="submit" value="Add Job" />
    </form:form>
</body>
</html>`,
  codeTitle: 'addJob.jsp: Spring form tags bound to the Job command object',
  points: [
    'Spring\'s <form:form> and <form:input> tags bind directly to the command object placed in the model (modelAttribute="job").',
    'The path attribute on each input maps to a property on that object; Spring generates the name and pre-fills the value automatically.',
    'A plain HTML <input name="description"> would bind identically via @ModelAttribute\'s name matching - form tags add convenience, not a different mechanism.',
    'The two advantages Spring form tags give over plain HTML are automatic value pre-filling and validation error rendering with <form:errors>.',
    'The form\'s action ("addJob") and method ("post") must match the controller\'s @RequestMapping exactly for the submission to be routed correctly.',
  ],
  callouts: [
    { type: 'gotcha', content: 'form:form requires modelAttribute to already exist in the model under that exact name before the JSP renders - it is why the GET handler in AddJobController must add an empty Job before returning the "addJob" view.' },
    { type: 'interview', content: 'Q: What is the actual mechanical difference between <form:input path="description"> and a plain <input name="description">?\nA: Functionally, none for basic submission - both produce a name="description" input, and @ModelAttribute binds either one by matching that name to the Job property. The Spring tag additionally pre-fills the value from the bound object\'s current state and integrates with <form:errors> for validation messages, which plain HTML does not do automatically.' },
  ],
}
