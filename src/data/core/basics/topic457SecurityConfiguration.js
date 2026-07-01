export default {
  id: 'security-configuration',
  title: '457. Security Configuration',
  explanation: `Every prior topic in this chapter touched a piece of security configuration in isolation — the filter chain bean (see [[spring-security-filters]]), a fixed user (see [[setting-username-and-password]]), CSRF settings (see [[sending-csrf-token]]). This topic assembles them into one coherent \`SecurityConfig\` class, the shape a real project actually uses.

**A consolidated configuration class:**
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/jobs/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/jobs/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
\`\`\`

**Reading this configuration top to bottom, in the order it actually gets evaluated:** \`authorizeHttpRequests\` rules are matched **in the order they're declared**, and the **first match wins** — this is why the specific \`/jobs/search\` rule comes before the broader \`/jobs/**\` pattern; if the order were reversed, the more general rule would match first and the specific exemption would never be reached.

**\`@EnableWebSecurity\`** — activates Spring Security's web security support and registers the filter chain built by the \`SecurityFilterChain\` bean. Without it, a \`SecurityFilterChain\` bean alone in modern Spring Boot auto-configuration is often already sufficient (Boot auto-detects it), but declaring it explicitly is still common practice for clarity and to enable further customization (like method-level security).

**Why one centralized \`SecurityConfig\` class, rather than settings scattered across multiple files.** Every rule that decides who can call what lives in one place, readable top to bottom — this matters enormously for security specifically, because a rule buried in an unexpected file is a rule that's easy to miss during a review, and access control (see [[owasp-top-10]]) is exactly the risk category most likely to slip through unnoticed.`,
  code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/jobs/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/jobs/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`,
  codeTitle: 'One consolidated SecurityConfig with ordered authorization rules',
  points: [
    'authorizeHttpRequests rules are evaluated in declaration order, and the first matching rule wins - specific rules must come before broader ones that would otherwise match first.',
    '@EnableWebSecurity activates Spring Security web support; in modern Spring Boot, a SecurityFilterChain bean is often auto-detected regardless, but the annotation is still common for clarity and further customization.',
    'PasswordEncoder is declared as its own bean so it can be injected anywhere a password needs encoding (registration, seed data, credential updates) rather than instantiated repeatedly.',
    'Consolidating every authorization rule into one SecurityConfig class makes the full set of access rules reviewable in one place, rather than scattered and easy to miss.',
    'formLogin(Customizer.withDefaults()) keeps the default login form active while the rest of the chain is explicitly configured around it.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Placing a broad rule like anyRequest().authenticated() before a more specific permitAll() rule for a public endpoint means the broad rule wins first, silently blocking the endpoint that was meant to be public - always order authorizeHttpRequests rules from most specific to most general.' },
    { type: 'interview', content: 'Q: In a SecurityFilterChain with multiple authorizeHttpRequests rules, which rule applies if a request matches more than one of them?\nA: The first matching rule, in declaration order, wins - rules are not merged or resolved by specificity automatically. This is why a specific rule for a public endpoint must be declared before a broader rule that would otherwise match the same path and require authentication.' },
  ],
}
