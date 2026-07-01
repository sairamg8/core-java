export default {
  id: 'jwt-summary',
  title: '487. JWT Summary',
  explanation: `Every JWT topic since [[why-jwt]] built one piece of a complete stateless authentication system — this topic connects them into one picture, the same kind of checkpoint the chapter used earlier for session-based auth (see [[security-summary-till-now]]).

**The complete JWT flow, issuing and verifying, side by side:**

**Issuing (once, at login):**
1. \`POST /auth/login\` with credentials (see [[custom-login]])
2. \`AuthenticationManager\` verifies via the *same* \`AuthenticationProvider\`/\`UserDetailsService\`/\`PasswordEncoder\` chain used for session-based auth (see [[token-generation-flow]])
3. \`JwtService.generateToken()\` builds and signs a token (see [[generating-token]])
4. Client receives and stores the token — no session, no cookie

**Verifying (on every subsequent request, independently, every time):**
5. \`JwtAuthFilter\` extracts the \`Bearer\` token from the \`Authorization\` header (see [[creating-a-jwt-filter]])
6. \`JwtService.isTokenValid()\` checks the signature and expiration (see [[validating-token]])
7. On success, \`SecurityContextHolder\` is populated for this request only (see [[setting-auth-token-in-securitycontext]])
8. The existing \`authorizeHttpRequests\` rules (see [[security-configuration]]) then decide, as always, whether this specific authenticated request is allowed through

**What changed from session-based auth, and what stayed exactly the same — the single most important takeaway from this entire arc.** Steps 2 and 8 are **unchanged** from the rest of this chapter — the actual credential verification and the actual authorization rules. What's genuinely new is *only* how the result of authentication gets carried between requests: a signed, self-contained token instead of a server-side session plus a cookie. This is worth restating precisely because it's easy to come away thinking JWT is a wholesale replacement for everything in this chapter, when it's actually a swap of one specific layer.

**The tradeoffs, restated now that the full implementation exists to point to concretely.** Stateless and horizontally scalable (any server instance can run \`isTokenValid()\` independently, see [[why-jwt]]) — at the cost of no server-side revocation before expiration, which is exactly why \`jwt.expiration-ms\` (see [[project-setup-for-jwt]]) is kept short rather than treated as a one-time setting to ignore afterward.

**Where this leads next in the chapter.** OAuth2 (the next few topics) builds a *different* way to obtain that initial authenticated identity — via Google or GitHub rather than a locally-stored password — but once obtained, the same JWT issuance and verification pipeline built here applies unchanged. Everything from this JWT arc is reused, not replaced, one more time.`,
  code: `// The complete picture, issuing and verifying:

// ISSUE (once):
// POST /auth/login -> AuthenticationManager (existing chain, unchanged)
//   -> JwtService.generateToken() -> signed token returned to client

// VERIFY (every request, independently, from scratch):
// Authorization: Bearer <token>
//   -> JwtAuthFilter extracts token
//   -> JwtService.isTokenValid() checks signature + expiration
//   -> SecurityContextHolder populated for this request only
//   -> authorizeHttpRequests rules (unchanged) decide access`,
  codeTitle: 'The complete JWT arc: issue once, verify independently on every request',
  points: [
    'Credential verification (AuthenticationManager chain) and authorization rules (authorizeHttpRequests) are exactly the same as session-based auth - JWT does not replace either.',
    'What JWT actually changes is only how authentication results are carried between requests: a signed, self-contained token instead of a server-side session plus cookie.',
    'The tradeoff is concrete now: statelessness and horizontal scalability, at the cost of no server-side revocation before a token naturally expires.',
    'Short expiration times (jwt.expiration-ms) are the practical mitigation for that lack of revocation, not an arbitrary configuration value.',
    'OAuth2, covered next, changes only how the initial identity is established (via Google/GitHub instead of a local password) - the JWT issuance and verification pipeline built in this arc is reused unchanged afterward.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Treating JWT as a replacement for the entire Spring Security setup built earlier in this chapter, rather than a replacement for just the session/cookie layer, leads to unnecessary rework - the AuthenticationProvider, UserDetailsService, PasswordEncoder, and authorization rules are all still exactly as needed and should not be rebuilt.' },
    { type: 'interview', content: 'Q: Summarize precisely what JWT changes and what it does not change, relative to the session-based authentication built earlier in this chapter.\nA: JWT does not change how credentials are verified (still AuthenticationManager, AuthenticationProvider, UserDetailsService, PasswordEncoder) or how authorization rules are enforced (still authorizeHttpRequests). What it changes is exclusively how the result of authentication is carried across requests - a signed, stateless, self-contained token verified independently on every request, instead of a server-side session referenced by a cookie.' },
  ],
}
