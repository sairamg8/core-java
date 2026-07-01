export default {
  id: 'authenticationprovider',
  title: '463. AuthenticationProvider',
  explanation: `With the \`User\` entity and table in place (see [[creating-user-table-and-db-properties]]), the next question is: what actually performs the username/password check during login, and how does it connect to the database-backed user? That's the job of \`AuthenticationProvider\` — a piece of the security puzzle that's been implicit until now.

**What \`AuthenticationProvider\` is responsible for:** given an \`Authentication\` object holding the submitted username and password, it decides whether those credentials are valid, and if so, returns a fully authenticated \`Authentication\` object (now carrying the user's authorities). Spring Security's default form login already uses a built-in \`AuthenticationProvider\` implementation behind the scenes — \`DaoAuthenticationProvider\` — this topic makes that explicit and wires it to the real database.

**\`DaoAuthenticationProvider\` — the standard implementation, requiring just two collaborators:**
\`\`\`java
@Bean
public AuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService,
        PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
}
\`\`\`
It needs exactly two things: a \`UserDetailsService\` to load a user record by username (built in the next topic, see [[creating-a-userdetailsservice]]), and a \`PasswordEncoder\` to compare the submitted password against the stored hash — the same \`BCryptPasswordEncoder\` bean already declared earlier in this chapter.

**What happens internally when \`DaoAuthenticationProvider\` runs, step by step:**
1. Calls \`userDetailsService.loadUserByUsername(username)\` to fetch the stored \`UserDetails\`
2. Calls \`passwordEncoder.matches(submittedRawPassword, storedHash)\` — **never** decrypts the stored hash (BCrypt cannot be reversed at all, by design — see [[what-is-bcrypt]]) — it re-hashes the submitted password and compares hashes
3. If the match succeeds, builds an authenticated \`Authentication\` object carrying the user's authorities; if it fails, throws \`BadCredentialsException\`

**Why this layer of indirection (\`AuthenticationProvider\` sitting between the filter chain and \`UserDetailsService\`) exists at all**, rather than the filter chain calling \`UserDetailsService\` directly: it separates *how a user is identified* (\`UserDetailsService\`) from *how credentials are actually verified* (\`AuthenticationProvider\`) — the same \`UserDetailsService\` could, in principle, be paired with a completely different verification scheme (an external identity provider, a one-time-code check) by swapping only the \`AuthenticationProvider\`, without touching how users are looked up.`,
  code: `@Bean
public AuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService,
        PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
}

// Internally, on each login attempt:
// 1. UserDetails user = userDetailsService.loadUserByUsername(username);
// 2. boolean matches = passwordEncoder.matches(rawPassword, user.getPassword());
// 3. if (matches) -> authenticated Authentication object with user's authorities
//    else         -> BadCredentialsException`,
  codeTitle: 'DaoAuthenticationProvider wiring UserDetailsService and PasswordEncoder together',
  points: [
    'AuthenticationProvider decides whether submitted credentials are valid and, on success, returns an authenticated Authentication object carrying the authorities of that user.',
    'DaoAuthenticationProvider is the standard implementation, requiring only a UserDetailsService (to load the user) and a PasswordEncoder (to verify the password).',
    'Password verification never decrypts the stored hash - BCrypt cannot be reversed - instead the submitted password is re-hashed and the two hashes are compared via passwordEncoder.matches().',
    'A failed match throws BadCredentialsException, which the surrounding filter chain translates into the appropriate HTTP response (a redirect to login, or a 401/403 for API clients).',
    'Separating AuthenticationProvider from UserDetailsService means the way credentials are verified can change independently of how users are looked up.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting to register the AuthenticationProvider bean (or forgetting to set both its UserDetailsService and PasswordEncoder) means Spring Security falls back to its own default in-memory user, silently ignoring the real database-backed UserDetailsService that was built - login then behaves as if the custom user database does not exist.' },
    { type: 'interview', content: 'Q: How does DaoAuthenticationProvider verify a password without ever decrypting the stored BCrypt hash?\nA: BCrypt is a one-way hash - it cannot be decrypted at all, by design. DaoAuthenticationProvider instead calls passwordEncoder.matches(submittedPassword, storedHash), which internally re-hashes the submitted password using the same salt embedded in the stored hash and compares the two hash outputs for equality, never reversing the original hash.' },
  ],
}
