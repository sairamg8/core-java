export default {
  id: 'owasp-top-10',
  title: '446. OWASP Top 10',
  explanation: `Before writing any Spring Security code, it helps to know the shape of the actual threats being defended against (see [[importance-of-security]]). The **OWASP Top 10** is a regularly updated list, published by the Open Web Application Security Project, of the most critical web application security risks — it's the closest thing the industry has to a standard checklist for "what needs to be guarded against."

**The risks most directly relevant to a Spring Boot REST API being built in this course:**
- **Broken Access Control** — the exact gap from the previous topic: endpoints that don't check whether the caller is allowed to perform the action. Consistently the #1 risk in recent OWASP editions.
- **Cryptographic Failures** — storing passwords in plain text or with weak hashing instead of BCrypt (covered later, see [[what-is-bcrypt]]).
- **Injection** — untrusted input reaching a database query unsanitized; largely mitigated already by using JPA/Spring Data repositories (see [[spring-data-jpa-introduction]]) instead of hand-built SQL strings.
- **Security Misconfiguration** — defaults left unchanged: an admin endpoint left open, verbose stack traces exposed to clients, CORS configured too permissively (see [[cross-origin-cors]] later in this chapter).
- **Identification and Authentication Failures** — weak session handling, predictable session IDs, no protection against credential stuffing.
- **Cross-Site Request Forgery (CSRF)** — a specific attack this chapter covers in detail (see [[what-is-csrf]]), where a malicious site tricks a logged-in user's browser into making an unwanted request.

**Why this list matters pedagogically, not just as trivia:** nearly every Spring Security feature introduced in this chapter maps directly to one of these categories — \`SecurityFilterChain\` rules address Broken Access Control, \`BCryptPasswordEncoder\` addresses Cryptographic Failures, CSRF tokens address the CSRF category by name. Recognizing which OWASP category a given piece of configuration defends against makes it much easier to remember *why* that configuration exists, rather than treating it as arbitrary boilerplate to copy.

**A practical habit worth building now:** whenever adding a new REST endpoint to any project, pause and ask "who should be allowed to call this, and have I actually enforced that?" — Broken Access Control persists as the top risk industry-wide specifically because that question gets skipped under time pressure.`,
  code: `// OWASP Top 10 (2021 edition) - the categories this course chapter maps to:
// A01: Broken Access Control        -> SecurityFilterChain authorization rules
// A02: Cryptographic Failures        -> BCryptPasswordEncoder for passwords
// A03: Injection                     -> avoided by using Spring Data JPA repositories
// A04: Insecure Design
// A05: Security Misconfiguration     -> CORS config, disabling stack traces in prod
// A06: Vulnerable and Outdated Components
// A07: Identification and Auth Failures -> session management, JWT validation
// A08: Software and Data Integrity Failures
// A09: Security Logging and Monitoring Failures
// A10: Server-Side Request Forgery`,
  codeTitle: 'OWASP Top 10 categories mapped to this chapter’s topics',
  points: [
    'The OWASP Top 10 is a regularly updated, industry-standard list of the most critical web application security risks.',
    'Broken Access Control - missing or incorrect authorization checks - has consistently ranked as the #1 risk in recent editions.',
    'Using Spring Data JPA repositories rather than hand-built SQL already mitigates most Injection risk without extra effort.',
    'Nearly every Spring Security feature covered in this chapter (password encoding, CSRF tokens, filter chain rules) maps directly to a specific OWASP category.',
    'A practical habit that prevents Broken Access Control: for every new endpoint, explicitly decide and enforce who is allowed to call it, rather than leaving it open by default.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Relying on "the frontend hides the button" as access control is not access control at all - any endpoint reachable over HTTP can be called directly with curl or Postman regardless of what the UI shows or hides, so authorization must be enforced server-side, not just in the client.' },
    { type: 'interview', content: 'Q: Why has Broken Access Control ranked as the top OWASP risk in recent years, ahead of injection or cryptographic issues?\nA: Modern frameworks and ORMs like Spring Data JPA already mitigate injection risk by default, and cryptographic best practices (BCrypt, TLS) are well established and easy to apply. Access control, by contrast, requires deliberate per-endpoint decisions about who is allowed to do what, and it is easy to skip that check under time pressure or simply forget it on a new endpoint - making it the risk most likely to be silently missing.' },
  ],
}
