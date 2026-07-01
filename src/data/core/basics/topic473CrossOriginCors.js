export default {
  id: 'cross-origin-cors',
  title: '473. Cross-Origin (CORS)',
  explanation: `The plan from the previous topic flagged CORS as a required step (see [[plan-to-secure-job-app-project]]) because the Job app's React frontend (typically \`http://localhost:3000\` in development) and its Spring Boot backend (\`http://localhost:8080\`) run on **different origins** — and once Spring Security is enabled, this stops being a minor inconvenience and becomes an actual blocker.

**What "origin" means precisely, and why \`localhost:3000\` and \`localhost:8080\` count as different origins despite both being "localhost."** An origin is the combination of scheme, host, *and port* — \`http://localhost:3000\` and \`http://localhost:8080\` differ only in port number, but that's enough for the browser to treat them as completely separate origins for security purposes.

**The Same-Origin Policy, and what CORS actually is.** Browsers enforce the Same-Origin Policy by default: JavaScript running on one origin cannot read responses from a different origin, unless that other origin explicitly opts in. **CORS (Cross-Origin Resource Sharing)** is exactly that opt-in mechanism — a set of response headers the *server* sends, telling the browser "responses to this origin are allowed to be read by that other origin."

**Configuring it in Spring Security:**
\`\`\`java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);   // needed if the frontend sends cookies

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
\`\`\`

**Why CORS misconfiguration specifically becomes visible only in the browser console, not as an obvious server error.** The actual HTTP request often still reaches the server and gets a real response — the browser itself blocks the *frontend JavaScript* from reading that response, and reports it as a CORS error in dev tools. This is why a request that "works fine in Postman" can still fail entirely from the React app: Postman is not a browser and doesn't enforce Same-Origin Policy at all.

**Why \`setAllowCredentials(true)\` and a wildcard \`setAllowedOrigins(List.of("*"))\` cannot be combined** — the CORS spec explicitly forbids it, since allowing credentialed requests (cookies, session auth) from literally any origin would defeat the entire point of the policy; \`allowCredentials(true)\` requires an explicit, named list of allowed origins.`,
  code: `@Bean
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

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
    return http.build();
}`,
  codeTitle: 'CORS configuration allowing the React dev server origin, with credentials',
  points: [
    'An origin is scheme + host + port together - localhost:3000 and localhost:8080 are different origins despite sharing the same hostname.',
    'The Same-Origin Policy blocks JavaScript on one origin from reading responses from another by default; CORS is the server-side opt-in mechanism that relaxes this for named origins.',
    'A CORS failure typically means the request reached the server and got a real response - the browser blocks the frontend JavaScript from reading that response, and only reports the failure in the browser console.',
    'A request that works fine in Postman can still fail from a React app, because Postman is not a browser and does not enforce Same-Origin Policy or CORS at all.',
    'allowCredentials(true) cannot be combined with a wildcard allowed-origins list ("*") - the CORS spec requires an explicit, named origin list whenever credentials (cookies, session auth) are allowed.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Debugging a "CORS error" by inspecting server logs is often unproductive, since the request may have reached the server and returned a perfectly valid response - the rejection happens entirely in the browser after the fact; the browser’s network/console tab, not server logs, is where a CORS problem is actually diagnosed.' },
    { type: 'interview', content: 'Q: Why can a request to a Spring Boot API succeed when tested in Postman but fail when made from a React app running on a different port?\nA: Postman does not enforce the browser Same-Origin Policy at all, so it can read any response regardless of origin. A browser, by contrast, blocks frontend JavaScript from reading a cross-origin response unless the server explicitly allows it via CORS headers - if the backend has not configured CORS for the frontend origin, the request may still reach the server and succeed, but the browser prevents the React app from reading that response.' },
  ],
}
