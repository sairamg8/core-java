export default {
  id: 'plan-to-secure-job-app-project',
  title: '472. Plan To Secure Job App Project',
  explanation: `Every piece needed to secure the Job app has now been built as a standalone concept — filters, \`UserDetailsService\`, \`AuthenticationProvider\`, BCrypt, registration. This topic is the planning step before actually wiring all of it onto the Job app's real endpoints, listing exactly what needs to change and in what order — mirroring the same "plan before building" approach used earlier in the course for Spring Data REST (see [[getting-ready-for-user-database]]).

**The Job app endpoints as they stand right now, and the access rule each one needs:**
| Endpoint | Current state | Target rule |
|---|---|---|
| \`GET /jobs\`, \`GET /jobs/{id}\` | Open | Requires authentication (any logged-in user) |
| \`GET /jobs/search\` | Open | Stays open (public search, see [[search-by-keyword]]) |
| \`POST /jobs\` | Open | Requires authentication |
| \`PUT/PATCH /jobs/{id}\`, \`DELETE /jobs/{id}\` | Open | Requires authentication **and** ownership (see [[working-with-multiple-users]]) |
| \`POST /auth/register\` | Doesn't exist until now | Public, no authentication (see [[user-registration]]) |

**The concrete steps, in the order they need to happen:**
1. Add \`spring-boot-starter-security\` (already covered, see [[creating-a-spring-security-project]]) — this alone locks everything down as a safe starting point.
2. Wire the real \`SecurityConfig\` — \`PasswordEncoder\`, \`AuthenticationProvider\`, and the \`authorizeHttpRequests\` rules from the table above, ordered from most specific path to least (see [[security-configuration]]).
3. Add the \`/auth/register\` endpoint and confirm it's genuinely reachable without a login.
4. Decide, and configure, CORS — since the Job app's React frontend (see [[connecting-react-and-spring]]) runs on a different origin (port) than the Spring Boot backend during development, and browsers block cross-origin requests by default unless the server explicitly allows them (covered next, see [[cross-origin-cors]]).
5. Test every row of the table above explicitly — a logged-out request to each secured endpoint should fail, a logged-in request should succeed, and (for the ownership-restricted rows) a logged-in *non-owner* request should specifically fail.

**Why testing the *negative* cases (row 5) matters as much as testing that a valid login works.** A security configuration that lets legitimate requests through but never verifies that illegitimate ones are actually rejected has only been half-tested — exactly the kind of gap the OWASP Top 10's Broken Access Control category warns about (see [[owasp-top-10]]).`,
  code: `// The concrete plan, as a checklist:
// 1. spring-boot-starter-security added (already done)
// 2. SecurityConfig: PasswordEncoder + AuthenticationProvider + ordered rules
//    - /jobs/search           -> permitAll()
//    - /auth/**               -> permitAll()
//    - GET  /jobs, /jobs/{id} -> authenticated()
//    - POST /jobs             -> authenticated()
//    - PUT/PATCH/DELETE /jobs/{id} -> authenticated() + ownership check in service layer
//    - anyRequest()           -> authenticated()
// 3. /auth/register endpoint added and verified reachable while logged out
// 4. CORS configured for the React frontend's origin
// 5. Explicit tests: logged-out fails, logged-in succeeds, non-owner fails on write`,
  codeTitle: 'The concrete, ordered plan for securing every existing Job app endpoint',
  points: [
    'Every endpoint in the Job app needs an explicit target access rule decided before writing any SecurityConfig code - public, authenticated, or authenticated-plus-ownership.',
    'Path-specific rules (like /jobs/search staying public) must be ordered before broader catch-all rules in authorizeHttpRequests, since the first match wins.',
    'CORS has to be planned for explicitly because the React frontend and Spring Boot backend run on different origins during development, and browsers block cross-origin requests by default.',
    'The plan explicitly calls for testing negative cases (logged-out requests, non-owner requests) - not just confirming that valid logins succeed.',
    'This plan-first approach mirrors how earlier chapters (Spring Data REST) were built - list the concrete target state before writing the configuration that gets there.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Testing a newly secured Job app only by confirming that a logged-in admin can still do everything is an incomplete test - the far more important check is confirming that a logged-out request, or a request from a different non-owning user, is actually rejected; passing security tests should focus on the rejection paths, not just the success paths.' },
    { type: 'interview', content: 'Q: When planning to secure an existing set of REST endpoints, why does the order of rules in authorizeHttpRequests matter, and what should be tested beyond "does login work"?\nA: authorizeHttpRequests rules are matched in declaration order, with the first match winning, so a specific public rule (like a search endpoint) must be declared before a broader authenticated() catch-all, or the broad rule would incorrectly apply first. Beyond confirming login works, testing must explicitly verify negative cases - logged-out requests to secured endpoints, and logged-in requests from a non-owning user to an ownership-restricted endpoint - since these are the paths Broken Access Control vulnerabilities hide in.' },
  ],
}
