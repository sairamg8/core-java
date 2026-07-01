export default {
  id: 'what-is-csrf',
  title: '453. What Is CSRF?',
  explanation: `Every authentication method covered so far in this chapter (form login, session cookies, Basic Auth) protects against someone with no credentials at all reaching a secured endpoint. **Cross-Site Request Forgery (CSRF)** is a different, subtler attack — one that exploits an *already logged-in* user, without ever needing to steal their credentials or session ID.

**The attack, step by step:** imagine a user is logged into the Job app in one browser tab, with a valid \`JSESSIONID\` session cookie (see [[session-id]]) already set. In another tab, they visit a malicious website. That malicious page contains a hidden auto-submitting form:
\`\`\`html
<form action="http://localhost:8080/jobs/1" method="POST" id="evil">
  <input type="hidden" name="title" value="HACKED" />
</form>
<script>document.getElementById('evil').submit()</script>
\`\`\`
The browser, having no concept of "which tab is trustworthy," automatically attaches the Job app's \`JSESSIONID\` cookie to this request too — because cookies are sent based on the target domain, not on which site initiated the request. The Job app's server sees what looks like a perfectly normal, authenticated request from that user's own browser, and processes it.

**Why this is possible at all: the "confused deputy" problem.** The server correctly verifies the user is logged in (the session cookie is genuine), but has no way to verify that the *user themselves* intended to make this specific request, as opposed to a malicious page silently triggering their browser to make it on their behalf. The user's browser is being used as a "confused deputy" — tricked into carrying out an action using credentials it legitimately holds.

**What makes CSRF specifically dangerous for state-changing requests** — creating, updating, or deleting data (\`POST\`, \`PUT\`, \`DELETE\`) — rather than for simple reads (\`GET\`). A forged \`GET /jobs\` just leaks a response the attacker likely can't even read (due to the browser's same-origin policy blocking cross-site response reading); a forged \`DELETE /jobs/1\` or \`POST /jobs\` actually changes data on the victim's behalf, with real consequences.

**Where this leads next in this chapter:** Spring Security enables CSRF protection by default for exactly this reason, which is why testing state-changing endpoints without understanding CSRF tokens produces a confusing error (see [[error-without-csrf-token]]) the first time it's encountered.`,
  code: `<!-- A malicious page relying on the victim already being logged into the Job app -->
<html>
<body>
  <form action="http://localhost:8080/jobs/1" method="POST" id="evil">
    <input type="hidden" name="title" value="HACKED" />
  </form>
  <script>
    document.getElementById('evil').submit();
    // The browser automatically attaches the victim's real JSESSIONID cookie
    // for localhost:8080 - the attacker's page never sees or needs the cookie itself
  </script>
</body>
</html>`,
  codeTitle: 'A minimal CSRF attack: a hidden auto-submitting form on another site',
  points: [
    'CSRF exploits an already-authenticated user - it does not require stealing a password or session ID at all, unlike most other attacks in this chapter so far.',
    'Browsers attach cookies based on the target domain of a request, not on which page or site initiated it - this is exactly the behavior CSRF abuses.',
    'The server sees a genuinely authenticated request (valid session cookie) but cannot tell whether the actual logged-in user intended to send it, or whether their browser was tricked into sending it - the "confused deputy" problem.',
    'CSRF is a real risk mainly for state-changing requests (POST, PUT, DELETE); a forged GET request typically cannot even have its response read back by the attacker due to same-origin policy.',
    'Spring Security enables CSRF protection by default, which is exactly why state-changing requests fail with a specific error until a CSRF token is included correctly.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming that requiring a login protects an endpoint from CSRF is a common misunderstanding - CSRF specifically targets users who are already logged in; requiring authentication is necessary but does nothing on its own to stop a forged request riding on that same authenticated session.' },
    { type: 'interview', content: 'Q: How can an attacker make an authenticated request to an API on behalf of a victim, without ever knowing that victim’s password or session ID?\nA: By hosting a page that submits a form (or triggers a request) targeting the app while the victim is already logged in elsewhere in their browser. Because browsers attach cookies based on the target domain rather than the origin of the request, the real session cookie gets sent automatically, and the server sees what looks like a legitimate, authenticated request - this is Cross-Site Request Forgery.' },
  ],
}
