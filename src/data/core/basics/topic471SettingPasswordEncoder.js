export default {
  id: 'setting-password-encoder',
  title: '471. Setting Password Encoder',
  explanation: `\`PasswordEncoder\` has been referenced constantly throughout this chapter as a \`@Bean\`, but always as a given — this topic looks at where that bean is actually declared, why it must be a single shared bean rather than a \`new BCryptPasswordEncoder()\` created wherever needed, and what the alternative encoder options look like.

**The bean declaration, in \`SecurityConfig\` alongside everything else (see [[security-configuration]]):**
\`\`\`java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
\`\`\`

**Why this must be a Spring-managed \`@Bean\`, injected wherever needed, rather than instantiated freshly in each class that needs it.** Both the registration endpoint (see [[bcrypt-encoding-for-user-registration]]) and \`DaoAuthenticationProvider\` (see [[authenticationprovider]]) need to use the *exact same* \`PasswordEncoder\` configuration — same algorithm, same cost factor. \`new BCryptPasswordEncoder()\` with no arguments happens to default to the same cost factor every time it's constructed, so this specific mistake wouldn't immediately break anything today — but relying on that coincidence is fragile; a single shared \`@Bean\` is the correct, explicit way to guarantee consistency, and becomes essential the moment the cost factor is ever tuned intentionally (see below).

**Tuning the cost factor explicitly, rather than accepting the default:**
\`\`\`java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);   // higher cost = slower = more brute-force resistant
}
\`\`\`
A higher cost factor means each hash takes longer to compute — intentionally, to resist brute-force attacks (see [[what-is-bcrypt]]) — but it also means every login takes proportionally longer. This is a genuine tradeoff, tuned based on the server's available compute and how many logins per second the application needs to handle, not a value to maximize blindly.

**\`DelegatingPasswordEncoder\` — Spring Security's actual default \`PasswordEncoder\` since Spring Security 5, worth knowing about even though this course sticks with plain \`BCryptPasswordEncoder\`.** It prefixes stored hashes with an identifier (e.g. \`{bcrypt}$2a$10$...\`) and can support *multiple* encoding schemes at once, decoding based on that prefix — this makes it possible to migrate from an older algorithm to a newer one gradually, verifying against the old scheme for existing users while encoding all new passwords with the new one, without needing a disruptive one-time migration of every stored hash.`,
  code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);   // explicit cost factor
    }

    // Both of these consume the SAME bean - guaranteed consistency:
    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService uds, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}

// AuthController also receives the same bean via constructor/field injection
// - never "new BCryptPasswordEncoder()" scattered across multiple classes`,
  codeTitle: 'One shared PasswordEncoder bean, consumed everywhere passwords are checked or set',
  points: [
    'PasswordEncoder is declared once as a @Bean and injected wherever needed - registration, AuthenticationProvider - rather than instantiated separately in each class.',
    'A shared bean guarantees every part of the app uses the exact same algorithm and cost factor, rather than relying on the coincidence that a default constructor happens to match elsewhere.',
    'The cost factor (BCryptPasswordEncoder(12) vs. the default) trades hashing speed against brute-force resistance - a genuine tuning decision based on server capacity and expected login volume.',
    'DelegatingPasswordEncoder, Spring Security’s actual default since version 5, prefixes stored hashes with a scheme identifier and can verify against multiple algorithms at once, enabling gradual migration between hashing schemes.',
    'Explicitly declaring BCryptPasswordEncoder (as this chapter does) rather than relying on DelegatingPasswordEncoder’s defaults is a simplification appropriate for a single, fixed hashing scheme without a migration need.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Increasing the BCrypt cost factor dramatically (e.g. from 10 to 16) without testing real login latency under load can turn each login into a multi-second operation server-side - the cost factor is a real production tuning parameter, not a value to maximize purely for theoretical security.' },
    { type: 'interview', content: 'Q: Why should PasswordEncoder be declared as a single shared @Bean rather than instantiated with "new BCryptPasswordEncoder()" in each class that needs it?\nA: Every part of the application that hashes or verifies a password - registration, AuthenticationProvider, any future password-change endpoint - must use the exact same algorithm and cost factor, or verification could fail or become inconsistent. A single shared bean guarantees that consistency explicitly, rather than relying on multiple independently created instances happening to use the same default configuration.' },
  ],
}
