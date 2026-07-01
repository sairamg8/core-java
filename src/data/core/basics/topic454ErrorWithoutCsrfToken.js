export default {
  id: 'error-without-csrf-token',
  title: '454. Error Without CSRF Token',
  explanation: `With CSRF understood conceptually (see [[what-is-csrf]]), this topic reproduces the actual error a developer hits the first time they test a state-changing endpoint with Postman after adding \`spring-boot-starter-security\` — a moment that confuses almost everyone until they know what's happening.

**Reproducing it:** with a login-based session established (see [[session-id]]), sending \`POST /jobs\` with a valid JSON body and valid session cookie:
\`\`\`
POST /jobs
Cookie: JSESSIONID=5A79FBF221CD16C0F1D53BE4F5A93A2C
Content-Type: application/json

{"title": "Backend Engineer", "description": "..."}
\`\`\`
returns:
\`\`\`
HTTP/1.1 403 Forbidden
{"error": "Forbidden", "status": 403}
\`\`\`
even though the exact same session cookie works fine for \`GET /jobs\`.

**Why this happens: Spring Security's default CSRF protection is enabled automatically**, and it specifically requires a valid CSRF token to be present on any state-changing request (\`POST\`, \`PUT\`, \`PATCH\`, \`DELETE\`) that relies on session/cookie-based authentication. \`GET\` requests are exempt by design, since CSRF protection exists to guard against *unwanted changes*, not reads — this is exactly why \`GET /jobs\` succeeded while \`POST /jobs\` was rejected with the same cookie.

**Why the framework rejects this by default, rather than trusting a valid session cookie alone:** a valid session cookie is precisely what a forged cross-site request (see [[what-is-csrf]]) also carries — the cookie proves the request came from the victim's browser, not that the victim actually intended to send it. A CSRF token is a separate, unpredictable value the server issues and expects back on the request; a malicious page tricking the browser into sending a request has no way to know or attach that token, since it can't read cookies or page content from the Job app's own origin.

**What this means practically, right now:** this 403 is not a bug in the Job app or a misconfiguration — it's the intended, secure-by-default behavior. The next few topics in this chapter cover the two realistic paths forward: actually sending a valid CSRF token with each request (see [[sending-csrf-token]]), or explicitly disabling CSRF protection for APIs that use stateless, cookie-free authentication instead (see [[disabling-csrf-token]]) — a decision that depends entirely on whether the API is cookie/session-based or token-based (JWT), a distinction the rest of this chapter builds toward.`,
  code: `# This request fails with 403, even with a valid session cookie:
curl -X POST http://localhost:8080/jobs \\
  -H "Cookie: JSESSIONID=5A79FBF221CD16C0F1D53BE4F5A93A2C" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Backend Engineer", "description": "..."}'

# Response:
# HTTP/1.1 403 Forbidden
# {"error":"Forbidden","status":403}

# The identical GET request, with the same cookie, succeeds fine:
curl http://localhost:8080/jobs \\
  -H "Cookie: JSESSIONID=5A79FBF221CD16C0F1D53BE4F5A93A2C"
# -> 200 OK`,
  codeTitle: 'POST rejected with 403 while GET succeeds, using the identical session cookie',
  points: [
    'A state-changing request (POST/PUT/PATCH/DELETE) made with a valid session cookie but no CSRF token is rejected with 403 Forbidden by default.',
    'GET requests are exempt from CSRF protection by design, since the protection specifically guards against unwanted changes, not reads.',
    'This rejection happens because a valid session cookie alone is exactly what a forged cross-site request would also carry - it cannot by itself prove the actual user intended the request.',
    'A CSRF token is a separate, unpredictable value the server expects back with the request - something a malicious cross-site page has no way to read or attach.',
    'This 403 is intended, secure-by-default behavior, not a bug - the next topics cover either sending a real CSRF token, or disabling CSRF protection entirely for token-based (JWT) APIs that do not rely on cookies.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Reflexively disabling CSRF protection the moment this 403 is hit, just to make the error go away, removes real protection for any application that continues to use session/cookie-based authentication - disabling CSRF is only appropriate once the app has actually moved to a stateless, cookie-free authentication scheme like JWT.' },
    { type: 'interview', content: 'Q: Why does a POST request with a valid session cookie get rejected with 403 by default, while an identical GET request with the same cookie succeeds?\nA: Spring Security enables CSRF protection by default, and it applies specifically to state-changing requests (POST, PUT, PATCH, DELETE) that rely on cookie-based session authentication - GET requests are exempt since they should not change state. A valid session cookie alone cannot prove the request was actually intended by the user rather than forged by a malicious page, so a separate CSRF token is required for anything that modifies data.' },
  ],
}
