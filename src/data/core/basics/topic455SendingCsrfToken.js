export default {
  id: 'sending-csrf-token',
  title: '455. Sending CSRF Token',
  explanation: `The previous topic reproduced a 403 on any state-changing request made without a CSRF token (see [[error-without-csrf-token]]) — this topic actually obtains and sends that token correctly, the first of two realistic ways to move past that error.

**Where the token comes from.** Once CSRF protection is enabled (the default), Spring Security exposes the current token via an endpoint (or, in a browser flow, a cookie/meta-tag pattern) so a client can read it before making a state-changing request. For a stateless test with Postman, the simplest approach is calling a \`GET\` endpoint first — \`GET\` is CSRF-exempt (see [[what-is-csrf]]) — and reading the token from the response.

**With cookie-based CSRF token repository (a common configuration):**
\`\`\`java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    );
    return http.build();
}
\`\`\`
\`withHttpOnlyFalse()\` is deliberate here — unlike the session cookie (which should stay \`HttpOnly\`, see [[session-id]]), the CSRF token cookie (\`XSRF-TOKEN\`) must be readable by client-side JavaScript, because the client needs to copy its value into a request header on the next call.

**The actual request, with the token attached:**
\`\`\`
GET /jobs  (any GET request)
  -> Set-Cookie: XSRF-TOKEN=a1b2c3d4-...

POST /jobs
Cookie: JSESSIONID=...; XSRF-TOKEN=a1b2c3d4-...
X-XSRF-TOKEN: a1b2c3d4-...
{"title": "Backend Engineer", ...}
\`\`\`
The token must be sent **twice** — once automatically as a cookie, once explicitly as the \`X-XSRF-TOKEN\` header, copied from the cookie value by the client. This is the entire mechanism: a malicious cross-site page can trigger the browser to attach the cookie automatically (that's the CSRF problem), but it has no way to *read* that cookie's value to also set the matching header — same-origin policy blocks it from reading cookies belonging to a different site.

**Why sending the token twice, rather than once, is the actual security mechanism** — this "double submit" pattern is precisely what closes the CSRF gap: proving the client can *read* a value only the real origin's JavaScript could access, not just that a cookie got attached automatically.`,
  code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    );
    return http.build();
}

// Step 1: any GET request returns a fresh CSRF cookie
// GET /jobs -> Set-Cookie: XSRF-TOKEN=a1b2c3d4-e5f6-...

// Step 2: read the cookie value, send it back as a header on the POST
// POST /jobs
// Cookie: JSESSIONID=...; XSRF-TOKEN=a1b2c3d4-e5f6-...
// X-XSRF-TOKEN: a1b2c3d4-e5f6-...
// {"title": "Backend Engineer", "description": "..."}`,
  codeTitle: 'Reading the XSRF-TOKEN cookie and resending it as a header',
  points: [
    'CookieCsrfTokenRepository.withHttpOnlyFalse() exposes the CSRF token as a readable cookie (XSRF-TOKEN), unlike the session cookie which should stay HttpOnly.',
    'A GET request (CSRF-exempt) is a simple way to obtain a fresh CSRF token before making a state-changing request.',
    'The token must be sent twice on the actual request - automatically as a cookie, and explicitly as the X-XSRF-TOKEN header copied from that cookie value.',
    'A malicious cross-site page can trigger a cookie to be attached automatically, but same-origin policy blocks it from reading that cookie to also set the matching header - this double-submit is the actual protection mechanism.',
    'This is the realistic path for any browser-based frontend still using session/cookie authentication - the alternative, disabling CSRF entirely, only makes sense for stateless token-based (JWT) APIs, covered next.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Sending the CSRF token only as a cookie, without also setting the X-XSRF-TOKEN header, still results in a 403 - the whole point of the double-submit pattern is that both values must be present and match, so forgetting the header entirely defeats the purpose of reading the cookie in the first place.' },
    { type: 'interview', content: 'Q: Why does a correct CSRF defense require sending the token both as a cookie and as a request header, rather than just checking the cookie is present?\nA: A cross-site attacker can trigger a browser into automatically attaching a cookie, but same-origin policy prevents that attacker from reading the cookie value to also construct a matching header. Requiring both the cookie and a header with the same value proves the request originated from code that could actually read data belonging to the legitimate origin, closing the gap a cookie-only check would leave open.' },
  ],
}
