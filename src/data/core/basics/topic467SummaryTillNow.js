export default {
  id: 'security-summary-till-now',
  title: '467. Summary Till Now',
  explanation: `Before moving to registration and BCrypt encoding in the next few topics, it's worth stepping back and connecting every piece built so far in this chapter into one coherent picture — the individual topics can each feel like a small, isolated detail, but they form exactly one working authentication pipeline.

**The full chain, end to end, as it stands right now:**
1. **A request arrives** and passes through the Spring Security filter chain (see [[spring-security-filters]]) before reaching any controller.
2. **For login**, \`UsernamePasswordAuthenticationFilter\` hands the submitted credentials to \`AuthenticationProvider\` (see [[authenticationprovider]]).
3. **\`DaoAuthenticationProvider\`** calls \`UserDetailsServiceImpl.loadUserByUsername()\` (see [[creating-a-userdetailsservice]]), which uses \`UserRepository\` (see [[user-repository]]) to fetch the real \`User\` row from the \`app_user\` table (see [[creating-user-table-and-db-properties]]).
4. **The result** is wrapped as a \`UserPrincipal\` (see [[userdetails-and-userprincipal]]) implementing \`UserDetails\`, carrying the user's authorities derived from their \`Role\`.
5. **Password verification** compares the submitted password against the stored BCrypt hash via \`PasswordEncoder.matches()\` — never decrypting anything.
6. **On success**, a session is established (see [[session-id]]) and the \`SecurityContext\` holds the authenticated \`UserPrincipal\` for the rest of that session's requests.
7. **For state-changing requests**, a CSRF token must also be present (see [[sending-csrf-token]]) since this flow is still cookie/session-based.
8. **Authorization rules** declared in \`SecurityConfig\` (see [[security-configuration]]) decide, per-endpoint, who is allowed through — role-based checks, plus any explicit ownership checks written in service code (see [[working-with-multiple-users]]).

**What's still missing, deliberately, at this point in the chapter.** There's no way for a new user to actually create an account yet — every \`User\` row so far would have to be inserted manually or seeded. There's also no path from this session-based flow to a stateless one; everything so far assumes a browser holding a session cookie. Both gaps are addressed next: registration (with BCrypt encoding applied at signup, see [[user-registration]]) and, later in this chapter, JWT as the stateless alternative to everything built here.

**Why this checkpoint matters pedagogically.** Each individual topic so far introduced exactly one new piece and deliberately deferred the next — that's the right way to *learn* the material, but it can obscure how few genuinely distinct concepts are actually involved. This summary is a chance to see that the whole system is really just: a filter chain, a way to look up a user, a way to verify a password, and a way to remember the result — everything else is a variation or extension of those four ideas.`,
  code: `// The full authentication chain assembled across this chapter so far:

// Filter chain (SecurityFilterChain)
//   -> UsernamePasswordAuthenticationFilter (handles POST /login)
//     -> AuthenticationProvider (DaoAuthenticationProvider)
//       -> UserDetailsServiceImpl.loadUserByUsername()
//         -> UserRepository.findByUsername()
//           -> app_user table (real database row)
//       -> wrapped as UserPrincipal implements UserDetails
//     -> PasswordEncoder.matches(rawPassword, storedHash)
//   -> on success: session established, SecurityContext holds UserPrincipal
// -> AuthorizationFilter enforces SecurityConfig rules on every later request`,
  codeTitle: 'The full authentication and authorization chain, assembled',
  points: [
    'Every piece built so far - filters, AuthenticationProvider, UserDetailsService, UserRepository, UserPrincipal, PasswordEncoder, session, CSRF, authorization rules - connects into exactly one working login and access-control pipeline.',
    'The system reduces to four genuinely distinct ideas: intercepting requests (filter chain), looking up a user (UserDetailsService/UserRepository), verifying a password (PasswordEncoder), and remembering the result (session/SecurityContext).',
    'What is still missing at this checkpoint: a way for new users to actually register, and a stateless alternative to the session-based flow built so far.',
    'User registration (with BCrypt applied at signup) is the very next topic, closing the "how does a User row get created in the first place" gap.',
    'JWT, covered later in this chapter, replaces the session-based pieces of this chain (steps 6 and 7 above) with a stateless token instead - everything upstream of that (filters, AuthenticationProvider, UserDetailsService) stays conceptually the same.',
  ],
  callouts: [
    { type: 'gotcha', content: 'It is easy to come away from a long sequence of small topics thinking Spring Security is a large, sprawling system - in reality nearly everything built so far is a variation on four ideas (filter chain, user lookup, password verification, remembering the result); recognizing that makes later topics like JWT easier to place, since JWT changes only how the "remembering" step works.' },
    { type: 'interview', content: 'Q: If asked to summarize the Spring Security authentication flow built up to this point in one sentence, what is the core chain of responsibility?\nA: A request passes through a filter chain, which for login delegates to an AuthenticationProvider; the provider uses a UserDetailsService (backed by a UserRepository) to look up the user, verifies the submitted password against the stored hash via PasswordEncoder, and on success stores the authenticated principal in the session so later requests do not need to re-authenticate.' },
  ],
}
