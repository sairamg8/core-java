export default {
  id: 'token-generation-flow',
  title: '483. Token Generation Flow',
  explanation: `\`generateToken()\` (see [[generating-token]]) is one method call away from \`AuthController.login()\` (see [[custom-login]]) — this topic traces the *entire* request end to end, connecting every piece built across this whole chapter into one sequence, before the next topics move to the other half of the story: verifying a token on later requests.

**The full sequence, from HTTP request to JWT response, step by step:**
1. **Client sends** \`POST /auth/login\` with \`{"username": "alice", "password": "secret123"}\`.
2. **\`AuthController.login()\`** builds a \`UsernamePasswordAuthenticationToken\` and hands it to \`AuthenticationManager.authenticate(...)\`.
3. **\`AuthenticationManager\`** delegates to \`AuthenticationProvider\` (\`DaoAuthenticationProvider\`, see [[authenticationprovider]]).
4. **\`DaoAuthenticationProvider\`** calls \`UserDetailsServiceImpl.loadUserByUsername("alice")\` (see [[creating-a-userdetailsservice]]), which uses \`UserRepository\` (see [[user-repository]]) to fetch the real \`User\` row.
5. **\`PasswordEncoder.matches(...)\`** compares the submitted password against the stored BCrypt hash (see [[what-is-bcrypt]]) — never decrypting anything.
6. **On success**, step 3 returns a fully authenticated \`Authentication\` object, carrying the \`UserDetails\` (or \`UserPrincipal\`, see [[userdetails-and-userprincipal]]) and its authorities.
7. **\`AuthController\`** extracts that principal and calls \`jwtService.generateToken(principal)\`.
8. **\`JwtService\`** builds the header, payload (subject, roles, timestamps), and signature, then returns the compact \`header.payload.signature\` string.
9. **The controller responds** with \`{"token": "eyJhbGc..."}\`, and the flow ends — no session, no cookie, nothing stored server-side about this login.

**Why steps 2 through 6 are identical to the session-based login flow covered earlier in this chapter (see [[security-summary-till-now]]), and only steps 7 through 9 are new.** This is the concrete proof of the claim made a few topics ago (see [[why-jwt]]): JWT changes *what happens after* successful authentication, not authentication itself. Every credential-checking concern (BCrypt, database lookup, account status) is fully reused, unchanged.

**What the client does with the response, setting up the next several topics.** The client stores this token (commonly in memory or \`localStorage\` for a web app) and must attach it as \`Authorization: Bearer <token>\` on every subsequent request to a protected endpoint — the server-side mechanism that reads and verifies that header is exactly what the next topic, the JWT filter, implements (see [[creating-a-jwt-filter]]).`,
  code: `// The full flow, end to end:

// 1. POST /auth/login  {"username": "alice", "password": "secret123"}
// 2. AuthController -> AuthenticationManager.authenticate(...)
// 3. AuthenticationManager -> DaoAuthenticationProvider
// 4. DaoAuthenticationProvider -> UserDetailsServiceImpl -> UserRepository -> DB
// 5. PasswordEncoder.matches(raw, storedHash) -> true
// 6. Authenticated Authentication object returned, carrying UserPrincipal + authorities
// 7. AuthController -> jwtService.generateToken(principal)
// 8. JwtService builds header + payload + signature -> compact JWT string
// 9. Response: {"token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSJ9.signature..."}`,
  codeTitle: 'The complete login-to-token flow, nine steps end to end',
  points: [
    'Steps 2 through 6 of the login flow (AuthenticationManager, AuthenticationProvider, UserDetailsService, UserRepository, PasswordEncoder) are exactly the same machinery already built for session-based login.',
    'Only steps 7 through 9 are new for JWT: extracting the authenticated principal and generating a signed token instead of establishing a session.',
    'This is the concrete demonstration that JWT changes what happens after successful authentication, not the authentication check itself.',
    'The response contains only the token - no Set-Cookie header, no server-side session created anywhere in this flow.',
    'The client is now responsible for storing the token and attaching it as an Authorization: Bearer header on every future request - the server-side counterpart (reading and verifying that header) is built in the next topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'It is easy to assume switching to JWT requires rewriting the credential-checking logic - it does not. If a bug appears in the "who is allowed to log in" check after adding JWT, the bug is almost certainly in the same AuthenticationProvider/UserDetailsService code that was already working for session-based login, not in anything JWT-specific.' },
    { type: 'interview', content: 'Q: Walking through a JWT login request end to end, which parts of the flow are identical to session-based login, and which parts are genuinely new?\nA: Everything up through verifying the username and password - AuthenticationManager, AuthenticationProvider, UserDetailsService, UserRepository, and PasswordEncoder - is identical to session-based login and fully reused. What is new is entirely what happens after a successful credential check: instead of establishing a session and setting a cookie, the controller extracts the authenticated principal and uses JwtService to build and return a signed token.' },
  ],
}
