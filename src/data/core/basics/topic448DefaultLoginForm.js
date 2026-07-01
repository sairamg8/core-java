export default {
  id: 'default-login-form',
  title: '448. Default Login Form',
  explanation: `With \`spring-boot-starter-security\` on the classpath (see [[creating-a-spring-security-project]]), opening any secured endpoint in a browser — rather than a tool like curl — reveals something not obvious from the console output alone: Spring Security auto-generates an actual HTML login page, with zero configuration or template files written.

**What happens when a browser hits a secured page.** Navigating to \`http://localhost:8080/jobs\` redirects to \`http://localhost:8080/login\`, showing a plain HTML form with username and password fields and a "Sign in" button. This page is generated entirely by Spring Security itself — no controller, no HTML template, no static resource was created for it anywhere in the project.

**Why a browser sees a form but a tool like Postman does not (yet).** Browsers automatically follow redirects and render HTML, so the redirect-to-\`/login\` flow feels natural there. A raw HTTP client just receives a \`302 Found\` redirect response pointing at \`/login\` and a login page it has no way to "fill in" — this distinction between browser-friendly form login and API-friendly authentication becomes important later in this chapter when Basic Auth (see [[basic-auth-using-postman]]) and eventually JWT are introduced specifically because REST clients need an authentication style that doesn't depend on rendering HTML.

**What actually happens after logging in via the default form:** on successful login, Spring Security establishes an HTTP session (see [[session-id]]) and redirects back to the originally requested page. From that point, the browser's session cookie authenticates subsequent requests automatically — no need to log in again on every request, as long as the session remains valid.

**Why this default form exists at all, given it's not what a real production API would use.** It exists purely to make Spring Security usable and testable the moment the dependency is added — a working, if unstyled, security flow with no configuration required. Nearly every real Spring Security setup replaces this default form with either a custom login page, a stateless token scheme (JWT), or delegates to an external identity provider (OAuth2) — all covered later in this chapter — but understanding the default form first makes clear exactly what those later approaches are replacing.`,
  code: `// No code is written to get this - it is 100% automatic once
// spring-boot-starter-security is on the classpath.

// GET http://localhost:8080/jobs  (in a browser, not logged in)
//   -> 302 redirect to http://localhost:8080/login
//   -> Spring Security's auto-generated HTML login form is rendered

// After submitting username "user" and the console-generated password:
//   -> Spring Security establishes an HTTP session
//   -> browser is redirected back to /jobs, now authenticated`,
  codeTitle: 'The default login form appears with no controller or template written',
  points: [
    'Spring Security auto-generates a working HTML login page with zero configuration - no controller, template, or static file is created for it in the project.',
    'A browser hitting a secured endpoint is redirected to /login and shown this form; a raw HTTP client instead just receives a 302 redirect response with no form to submit.',
    'This browser-vs-API distinction is exactly why REST clients eventually move to Basic Auth or JWT instead of form login - those do not depend on rendering or submitting HTML.',
    'A successful login establishes an HTTP session, and the browser session cookie authenticates further requests automatically without logging in again each time.',
    'The default form exists to make security usable immediately with no setup; almost every real application later replaces it with a custom login page, JWT, or OAuth2.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Testing a secured endpoint with curl and expecting the same behavior as a browser is a common early mistake - curl does not automatically follow the redirect to /login or render a form, so a plain unauthenticated curl request just returns a 302 response with no visible error explaining why.' },
    { type: 'interview', content: 'Q: Where does the Spring Security login form shown to a browser actually come from, and why does a plain API client not see the same thing?\nA: Spring Security auto-generates the login page itself when secured and no custom login configuration exists - no HTML template is written by the developer. A plain HTTP client (unlike a browser) does not automatically follow the redirect to /login or render HTML, so it just receives a 302 response - this gap is exactly why REST APIs eventually move to Basic Auth or JWT instead of relying on form-based login.' },
  ],
}
