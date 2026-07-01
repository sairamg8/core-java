export default {
  id: 'adding-security-configuration',
  title: '474. Adding Security Configuration',
  explanation: `This topic executes the plan from two topics ago (see [[plan-to-secure-job-app-project]]) — assembling every piece built across this entire chapter into one final \`SecurityConfig\` class actually applied to the real Job app, including the CORS setup from the previous topic (see [[cross-origin-cors]]).

**The complete, final \`SecurityConfig\` for the Job app:**
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())   // acceptable for now; revisited when JWT lands
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/jobs/search").permitAll()
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
\`\`\`

**A deliberate, temporary decision worth naming explicitly: CSRF is disabled here even though this is still session/form-login-based auth.** Per the earlier rule (see [[disabling-csrf-token]]), this is normally *not* correct for cookie-based authentication — it's accepted here specifically because this configuration is an intermediate step on the way to JWT, covered in the very next topics of this chapter, at which point the authentication model genuinely becomes stateless and disabling CSRF becomes the correct choice rather than a shortcut. Leaving CSRF enabled through this transition would mean re-implementing the CSRF token flow (see [[sending-csrf-token]]) only to remove it again a few topics later.

**Why rule ordering matters here specifically:** \`/jobs/search\` needs its own \`permitAll()\` line, distinct from and ordered before \`anyRequest().authenticated()\` — exactly the ordering principle established earlier in the chapter (see [[security-configuration]]), now applied to the app's actual, final endpoint list.`,
  code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/jobs/search").permitAll()
            .anyRequest().authenticated())
        .formLogin(Customizer.withDefaults());
    return http.build();
}`,
  codeTitle: 'The final SecurityConfig applied to the Job app, before JWT replaces form login',
  points: [
    'The final SecurityConfig combines every piece built in this chapter: PasswordEncoder, AuthenticationProvider, ordered authorization rules, and CORS.',
    '/auth/** and GET /jobs/search each get explicit permitAll() rules, ordered before the anyRequest().authenticated() catch-all.',
    'CSRF is disabled here as a deliberate, temporary decision - normally incorrect for cookie-based auth, but accepted because this configuration is an intermediate step before JWT makes the app genuinely stateless a few topics later.',
    'CORS is wired in via .cors(cors -> cors.configurationSource(...)), referencing the CorsConfigurationSource bean built in the previous topic.',
    'This configuration is not the final state of the app - it is the deliberate midpoint between the original open API and the eventual JWT-secured, fully stateless version built later in this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Treating this configuration as a permanent end state, rather than the deliberate midpoint it actually is, would leave a cookie-authenticated app with CSRF disabled indefinitely - a real vulnerability. This setup is only acceptable because JWT is the very next major topic in this chapter, genuinely removing the cookie-based session this exception was made for.' },
    { type: 'interview', content: 'Q: Why is it acceptable to disable CSRF in this SecurityConfig even though the app is still using session/form-login-based authentication at this point?\nA: It is a deliberate, temporary tradeoff - this configuration is an intermediate step on the way to JWT-based authentication, which is genuinely stateless and where disabling CSRF becomes the correct choice rather than a shortcut. Implementing full CSRF token handling for a configuration that is about to be replaced by a stateless scheme a few topics later would be wasted effort; the exception is scoped specifically to this transitional state, not treated as a permanent decision.' },
  ],
}
