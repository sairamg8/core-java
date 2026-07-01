export default {
  id: 'setting-username-and-password',
  title: '451. Setting Username And Password',
  explanation: `The auto-generated console password (see [[creating-a-spring-security-project]]) changes on every restart, which is fine for a first look at security but useless for actual development or testing — this topic sets a fixed username and password instead, the simplest possible step before eventually replacing this with a real user database.

**The quickest option — \`application.properties\`:**
\`\`\`properties
spring.security.user.name=admin
spring.security.user.password=secret123
spring.security.user.roles=ADMIN
\`\`\`
Setting these three properties disables the random password generation entirely — restarting the app now always logs in with \`admin\` / \`secret123\`, and the console no longer prints a generated password line.

**The more explicit, code-based option — an \`InMemoryUserDetailsManager\` bean:**
\`\`\`java
@Bean
public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
    UserDetails user = User.builder()
        .username("admin")
        .password(passwordEncoder.encode("secret123"))
        .roles("ADMIN")
        .build();
    return new InMemoryUserDetailsManager(user);
}
\`\`\`
This is more verbose but shows explicitly what's happening: a \`UserDetailsService\` bean is what Spring Security actually consults to find valid users — the \`application.properties\` shortcut is really just a convenience that wires up an equivalent \`InMemoryUserDetailsManager\` behind the scenes.

**Why both of these are still not production-ready, even with an encoded password.** A single hardcoded user — whether in properties or in a Java bean — means there's no way to add a second user, no persistence across restarts of *user data itself* (as opposed to just the fixed credential), and no way for a real person to register an account. This is a deliberate stepping stone: it removes the "password changes every restart" annoyance from local development and testing, while making clear exactly what a \`UserDetailsService\` is for — a concept the chapter later replaces with a database-backed implementation (see [[creating-a-userdetailsservice]]) that supports any number of real users.

**A note on the password encoding shown above:** even for this temporary, hardcoded user, the password is still passed through \`PasswordEncoder.encode(...)\` rather than stored as plain text \`"secret123"\` — establishing the habit of never storing (or even holding in memory, longer than necessary) an unencoded password, a rule that matters even more once real user data is involved (see [[what-is-bcrypt]]).`,
  code: `// Option 1: application.properties - simplest, good for quick local testing
// spring.security.user.name=admin
// spring.security.user.password=secret123
// spring.security.user.roles=ADMIN

// Option 2: explicit UserDetailsService bean - shows what's really happening
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
            .username("admin")
            .password(passwordEncoder.encode("secret123"))
            .roles("ADMIN")
            .build();
        return new InMemoryUserDetailsManager(user);
    }
}`,
  codeTitle: 'Fixed credentials via properties, or explicitly via InMemoryUserDetailsManager',
  points: [
    'Setting spring.security.user.name/password/roles in application.properties replaces the random console-generated password with a fixed, predictable credential.',
    'Under the hood, that properties-based shortcut is equivalent to wiring up an InMemoryUserDetailsManager bean holding one user.',
    'UserDetailsService is the interface Spring Security actually consults to find valid users - both the properties shortcut and the explicit bean satisfy this same interface.',
    'Even a single hardcoded user should have its password passed through PasswordEncoder.encode() rather than stored as plain text, establishing the habit before real user data is involved.',
    'A single fixed user is only a stepping stone - it cannot support multiple real users or registration, which is exactly what a database-backed UserDetailsService is built for later in this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Setting spring.security.user.password in application.properties as plain, unencoded text is common in tutorials and quick demos, but that property value is only used as raw input to the internal encoding step of the framework - it should never be treated as equivalent to storing an already-hashed password for a real user record in a database.' },
    { type: 'interview', content: 'Q: What interface does Spring Security actually rely on to look up valid users, regardless of whether credentials come from application.properties or a custom database?\nA: UserDetailsService. The application.properties shortcut for a single fixed user is implemented internally as an InMemoryUserDetailsManager, which is itself just one implementation of UserDetailsService. A real application later swaps this for a database-backed implementation without changing anything else about how Spring Security consults it.' },
  ],
}
