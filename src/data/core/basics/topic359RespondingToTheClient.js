export default {
  id: 'responding-to-the-client',
  title: '359. Responding to the Client',
  explanation: `A servlet's job is to build the **HTTP response** sent back to the browser. You do this through the **\`HttpServletResponse\`** object handed to \`doGet\`/\`doPost\`.

**Writing the body** — get a \`PrintWriter\` and print to it:
\`\`\`java
PrintWriter out = res.getWriter();
out.println("<h1>Hello</h1>");
\`\`\`

**Set the content type first** so the browser knows how to interpret the bytes:
- \`res.setContentType("text/html")\` — HTML page.
- \`res.setContentType("text/plain")\` — raw text.
- \`res.setContentType("application/json")\` — JSON (for APIs).

**Status codes** communicate the outcome:
- \`res.setStatus(200)\` — OK (default).
- \`res.sendError(404, "Not found")\` — error with a message.
- \`res.sendRedirect("other")\` — tell the browser to go to another URL (302).

**Key rule — order matters:** set the content type and any headers **before** writing to the writer. Once you start writing the body, the response is being **committed** and headers can no longer change.

**Reality check:** hand-building HTML with \`out.println\` gets unmaintainable fast — you are mixing Java and markup. That pain is exactly why **JSP** (see [[creating-a-jsp-page]]) and view technologies exist: they let you write the HTML page and inject data into it, instead of printing tags from Java.`,
  code: `@WebServlet("/greet")
public class GreetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("text/html");      // set type BEFORE writing
        PrintWriter out = res.getWriter();
        out.println("<html><body>");
        out.println("<h1>Welcome</h1>");
        out.println("</body></html>");
    }
}`,
  codeTitle: 'Building a response with HttpServletResponse',
  points: [
    'The response is built through HttpServletResponse passed into doGet/doPost.',
    'res.getWriter() gives a PrintWriter you print the body to.',
    'setContentType tells the browser how to interpret the response (text/html, application/json, ...).',
    'Status codes: setStatus(200), sendError(404, ...), sendRedirect(url) for a 302 redirect.',
    'Set content type and headers BEFORE writing the body — once writing starts, the response is committed.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling setContentType or setHeader after you have already written to the PrintWriter has no effect once the response is committed. Always configure the response first, write last.' },
    { type: 'tip', content: 'Printing HTML from Java is a maintenance nightmare. Use it only for tiny demos; for real pages forward to a JSP or use a Spring view so markup lives in a template, not in string concatenation.' },
    { type: 'interview', content: 'Q: What is the difference between sendRedirect and a request forward?\nA: sendRedirect tells the browser to make a NEW request to another URL (URL changes, 302). A forward (RequestDispatcher.forward) happens server-side to another resource without the browser knowing (URL stays the same).' },
  ],
}
