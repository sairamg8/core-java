export default {
  id: 'google-oauth2-login',
  title: '489. Google OAuth2 Login',
  explanation: `With \`spring-boot-starter-oauth2-client\` added (see [[implementing-oauth2]]), this topic wires up Google specifically as a real, working login provider for the Job app — the first of the two providers this chapter configures.

**Step 1 — register the Job app with Google, outside of any code.** Every OAuth2 provider requires the client application to be registered ahead of time, at Google Cloud Console, producing a **client ID** and **client secret**, plus a configured **redirect URI** (where Google sends the user back after login — typically \`http://localhost:8080/login/oauth2/code/google\` for local development).

**Step 2 — configure the registration in \`application.yml\`:**
\`\`\`yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: \${GOOGLE_CLIENT_ID}
            client-secret: \${GOOGLE_CLIENT_SECRET}
            scope: openid, email, profile
\`\`\`
The \`\${...}\` placeholders pull from environment variables (see [[project-setup-for-jwt]] for the same principle applied to the JWT secret) — the client secret must never be hardcoded, for exactly the same reason a JWT signing secret never should be.

**Step 3 — enable OAuth2 login in \`SecurityConfig\`:**
\`\`\`java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/", "/error").permitAll()
            .anyRequest().authenticated())
        .oauth2Login(oauth2 -> oauth2
            .defaultSuccessUrl("/dashboard", true));
    return http.build();
}
\`\`\`
\`.oauth2Login(...)\` is the one line that activates the entire redirect/callback/token-exchange flow from the previous topic — Spring Security auto-generates a "Login with Google" link and handles every step of the Authorization Code flow without further code.

**Step 4 — reading the logged-in user's Google profile in a controller:**
\`\`\`java
@GetMapping("/dashboard")
public Map<String, Object> dashboard(@AuthenticationPrincipal OAuth2User principal) {
    String name = principal.getAttribute("name");
    String email = principal.getAttribute("email");
    return Map.of("name", name, "email", email);
}
\`\`\`
\`OAuth2User\` here plays the same role \`UserDetails\`/\`UserPrincipal\` played for form and JWT login (see [[userdetails-and-userprincipal]]) — the authenticated identity for the current request, just sourced from Google's profile response instead of the Job app's own \`app_user\` table.

**What's still needed after this: connecting the Google identity to a real \`User\` row**, so the rest of the Job app (ownership checks, roles) has something to work with — covered as part of GitHub login next, since the same pattern applies to both providers.`,
  code: `# application.yml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: \${GOOGLE_CLIENT_ID}
            client-secret: \${GOOGLE_CLIENT_SECRET}
            scope: openid, email, profile

# SecurityConfig
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/", "/error").permitAll()
            .anyRequest().authenticated())
        .oauth2Login(oauth2 -> oauth2
            .defaultSuccessUrl("/dashboard", true));
    return http.build();
}`,
  codeTitle: 'Registering Google as an OAuth2 provider and enabling oauth2Login()',
  points: [
    'Every OAuth2 provider requires pre-registration outside the app itself (Google Cloud Console), producing a client ID, client secret, and a configured redirect URI.',
    'The client-id and client-secret belong in environment variables referenced via ${...} placeholders in application.yml, never hardcoded, for the same reason a JWT signing secret must not be.',
    '.oauth2Login(...) is the single configuration line that activates the full auto-generated Authorization Code flow in Spring Security - login link, redirect, callback, token exchange.',
    'OAuth2User plays the same role UserDetails/UserPrincipal played for form and JWT login - the authenticated identity for the current request - just sourced from the profile response of the external provider.',
    'Reading attributes like name and email from OAuth2User works immediately after login, but connecting that external identity to a real Job app User row (for roles, ownership) is a separate step covered next.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A mismatch between the redirect URI configured in Google Cloud Console and the actual URI Spring Security generates (which depends on the registration id, "google" here, and the base URL of the app) causes Google to reject the login with a redirect_uri_mismatch error - this must match exactly, including scheme, host, port, and path.' },
    { type: 'interview', content: 'Q: What does the .oauth2Login(...) configuration line in SecurityFilterChain actually set up, and what does OAuth2User represent afterward?\nA: It activates the full Authorization Code flow implementation in Spring Security - generating the "Login with Google" redirect, handling the callback with the authorization code, exchanging that code for tokens, and fetching the profile of the user - all without additional code. OAuth2User is then the authenticated principal for the request, holding the attributes (name, email, etc.) returned by the provider, playing the same role UserDetails plays for form/JWT-based login.' },
  ],
}
