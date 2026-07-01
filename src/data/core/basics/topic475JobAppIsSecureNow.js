export default {
  id: 'job-app-is-secure-now',
  title: '475. Job App Is Secure Now',
  explanation: `With \`SecurityConfig\` applied (see [[adding-security-configuration]]), this topic actually verifies the plan from earlier (see [[plan-to-secure-job-app-project]]) against the running app — closing the loop on every endpoint the plan identified, and confirming both the positive and negative cases explicitly, exactly as that plan called for.

**Verifying the negative case first — a logged-out request to a now-secured endpoint:**
\`\`\`
GET /jobs   (no Authorization header, no session cookie)
-> 401 Unauthorized (or a redirect to /login for a browser client)
\`\`\`
This is the single most important check: an endpoint that was completely open at the start of this chapter (see [[importance-of-security]]) now genuinely refuses an anonymous request.

**Verifying the positive case — registering, then logging in, then calling a secured endpoint:**
\`\`\`
POST /auth/register  {"username": "alice", "password": "secret123"}
-> 201 Created

POST /login  (form login, or Basic Auth with the same credentials)
-> session established

GET /jobs  (with the session cookie now attached)
-> 200 OK, full job list returned
\`\`\`

**Verifying the endpoint that must stay public — \`/jobs/search\`, even while logged out:**
\`\`\`
GET /jobs/search?keyword=engineer   (no login at all)
-> 200 OK
\`\`\`
Confirming this specifically matters because a slightly wrong rule ordering (see [[security-configuration]]) is exactly the kind of mistake that silently breaks a "should stay public" endpoint without throwing any obvious error — it would just start requiring login unexpectedly.

**What this checkpoint represents for the Job app overall, and what's genuinely still missing.** Every endpoint identified in the plan now has real, tested access control — this is a legitimate, working, session-based secured API, not a toy example. What's still missing is precisely what the rest of this chapter builds: a way to authenticate *without* a browser session at all (JWT), and a way to let users log in via Google or GitHub instead of a password (OAuth2) — both of which build on, rather than replace, the \`AuthenticationProvider\` and \`UserDetailsService\` foundation now fully working.

**Why this is a meaningful milestone, not just "another topic finished."** Every concept from [[importance-of-security]] onward — authentication vs. authorization, filters, sessions, CSRF, a real user database, BCrypt, CORS — has now been applied, together, to one real, working application, closing the arc the entire first half of this chapter was building toward.`,
  code: `# Negative case - must fail
curl -i http://localhost:8080/jobs
# HTTP/1.1 401 Unauthorized

# Register + login + positive case - must succeed
curl -X POST http://localhost:8080/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"username": "alice", "password": "secret123"}'
# HTTP/1.1 201 Created

curl -c cookies.txt -X POST http://localhost:8080/login \\
  -d "username=alice&password=secret123"

curl -b cookies.txt http://localhost:8080/jobs
# HTTP/1.1 200 OK - full job list

# Public endpoint - must succeed even logged out
curl http://localhost:8080/jobs/search?keyword=engineer
# HTTP/1.1 200 OK`,
  codeTitle: 'End-to-end verification: negative, positive, and public-endpoint cases',
  points: [
    'The most important verification is negative: a previously open endpoint like GET /jobs must now genuinely reject a logged-out, unauthenticated request.',
    'The positive case - register, log in, call a secured endpoint - confirms the full AuthenticationProvider/UserDetailsService/UserRepository chain built across this chapter actually works end to end.',
    '/jobs/search must be explicitly re-verified as still public, since a subtle rule-ordering mistake could silently start requiring login on an endpoint meant to stay open.',
    'This checkpoint represents a genuinely secured, working session-based API - not a toy example - with every endpoint from the earlier plan now carrying real, tested access control.',
    'What remains for the rest of this chapter - JWT and OAuth2 - builds on top of this same AuthenticationProvider/UserDetailsService foundation rather than replacing it.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Verifying only that a valid login succeeds, without separately confirming that a logged-out request to the same endpoint fails, leaves the single most important security property - actual access control - completely unverified; a misconfigured permitAll() rule that accidentally matches too broadly would pass a "does login work" test while leaving the app just as open as before this chapter started.' },
    { type: 'interview', content: 'Q: After applying a full SecurityConfig to a previously open REST API, what is the single most important thing to verify before considering it secure?\nA: That a request with no authentication at all is actually rejected on the endpoints meant to be secured - not just that a valid login succeeds. A configuration can pass every positive test (correct credentials work) while still containing a rule-ordering mistake that leaves an endpoint effectively public; explicitly testing the negative, logged-out case is what actually confirms Broken Access Control has been closed.' },
  ],
}
