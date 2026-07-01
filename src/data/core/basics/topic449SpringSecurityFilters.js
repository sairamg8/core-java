export default {
  id: 'spring-security-filters',
  title: '449. Spring Security Filters',
  explanation: `The login form and the automatic redirect (see [[default-login-form]]) aren't magic — they're the visible effect of a **filter chain** sitting in front of every controller, and understanding that chain is the key to understanding how Spring Security actually works underneath its annotations.

**What a servlet filter is, in plain terms:** a piece of code that intercepts an HTTP request *before* it reaches a servlet (and, in a Spring Boot app, before it reaches a \`@RestController\`). Filters run in an ordered chain — each filter can inspect or modify the request, decide to reject it outright, or pass it along to the next filter, and so on until (if nothing rejects it) the request finally reaches the controller.

**Spring Security is implemented almost entirely as a stack of these filters,** registered automatically once \`spring-boot-starter-security\` is on the classpath (see [[creating-a-spring-security-project]]). Some of the key filters in the default chain, roughly in order:
- \`UsernamePasswordAuthenticationFilter\` — handles the login form submission, checks the submitted credentials
- \`BasicAuthenticationFilter\` — handles the \`Authorization: Basic ...\` header when present (see [[basic-auth-using-postman]])
- \`SecurityContextPersistenceFilter\` (or its Spring Security 6 successor) — loads/saves the authenticated user's identity for the duration of the request
- \`ExceptionTranslationFilter\` — catches security exceptions (like access denied) and converts them into the right HTTP response (redirect to login, or a 403)
- \`FilterSecurityInterceptor\` / \`AuthorizationFilter\` — the final gate that actually enforces the authorization rules configured in \`SecurityFilterChain\`

**Why this matters practically, not just as internals trivia:** understanding that security is a *chain of filters running before the controller* explains several things that otherwise feel mysterious — why a request can be rejected with no controller code ever running, why the order filters are registered in matters (a later filter can't undo what an earlier one already decided), and why custom security logic (like the JWT filter built later in this chapter, see [[creating-a-jwt-filter]]) gets added to this same chain rather than written inside a controller.

**The filter chain is configurable, not fixed** — the \`SecurityFilterChain\` \`@Bean\` seen in the previous topics is exactly where a developer declares which URL patterns need which authorization rules, and this bean is what determines how the built-in filters actually behave for a given application.`,
  code: `// Conceptual order of the default Spring Security filter chain
// (simplified - actual chain has more filters):

// Request arrives
//   -> SecurityContextPersistenceFilter (loads any existing session's auth)
//   -> UsernamePasswordAuthenticationFilter (handles /login POST)
//   -> BasicAuthenticationFilter (handles Authorization: Basic header)
//   -> ExceptionTranslationFilter (catches security exceptions)
//   -> AuthorizationFilter (enforces SecurityFilterChain rules)
// Only if nothing rejected the request:
//   -> DispatcherServlet -> @RestController method runs`,
  codeTitle: 'The conceptual order of Spring Security’s default filter chain',
  points: [
    'A servlet filter intercepts a request before it reaches a controller, and can inspect, modify, reject, or pass it along to the next filter in an ordered chain.',
    'Spring Security is implemented as a stack of such filters, automatically registered once spring-boot-starter-security is added.',
    'UsernamePasswordAuthenticationFilter handles form login submissions; BasicAuthenticationFilter handles the Authorization: Basic header; AuthorizationFilter enforces the actual access rules.',
    'A request rejected by the filter chain never reaches the controller at all - there is no controller code involved in that rejection.',
    'Custom security logic, like the JWT filter added later in this chapter, is added into this same filter chain rather than written as controller logic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Debugging "why is my endpoint returning 403 even though my controller logic looks correct" by reading the controller method is a wasted step if the rejection is actually happening in the filter chain before the controller runs at all - check the SecurityFilterChain configuration and filter order first.' },
    { type: 'interview', content: 'Q: Where does Spring Security actually intercept and reject an unauthorized request - inside the controller, or somewhere else?\nA: Before the controller. Spring Security is implemented as an ordered chain of servlet filters that run ahead of the DispatcherServlet and any controller code. A request that fails authentication or authorization is rejected by one of these filters (like AuthorizationFilter), so the controller method for that endpoint never executes at all.' },
  ],
}
