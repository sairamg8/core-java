export default {
  id: 'github-login',
  title: '490. GitHub Login',
  explanation: `With Google working (see [[google-oauth2-login]]), adding GitHub as a *second* login provider mostly repeats the same steps — which is exactly the point of this topic: showing how little changes when adding a second OAuth2 provider, and calling out the one place where providers genuinely differ.

**Registering a second provider in \`application.yml\` — same shape, different provider block:**
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
          github:
            client-id: \${GITHUB_CLIENT_ID}
            client-secret: \${GITHUB_CLIENT_SECRET}
            scope: read:user, user:email
\`\`\`
No changes at all to \`SecurityConfig\` are needed — \`.oauth2Login(...)\` (see [[google-oauth2-login]]) already handles *any* number of registered providers; Spring Security auto-generates a login page listing every configured registration, one link per provider.

**The one thing that genuinely differs between providers, and the one real gotcha of supporting more than one: attribute names are provider-specific.**
\`\`\`java
@GetMapping("/dashboard")
public Map<String, Object> dashboard(@AuthenticationPrincipal OAuth2User principal) {
    String name = principal.getAttribute("name");     // Google: "name"; GitHub: null!
    String login = principal.getAttribute("login");   // GitHub: username; Google: null
    // ...
}
\`\`\`
Google's profile response includes a \`name\` attribute; GitHub's does not — GitHub instead provides \`login\` (the username) and may require a *separate* API call to retrieve the user's email if it's marked private on their GitHub account. Code written and tested only against Google will silently get \`null\` for several fields the moment a user logs in via GitHub, unless this difference is handled explicitly (checking which \`registrationId\` was used, and reading the matching attribute names for that specific provider).

**Connecting either provider's identity to a real Job app \`User\` row — the piece both providers still need.** A custom \`AuthenticationSuccessHandler\` is the natural place to do this:
\`\`\`java
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res,
                                          Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        userRepository.findByUsername(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setRole(Role.USER);
            return userRepository.save(newUser);
        });
        res.sendRedirect("/dashboard");
    }
}
\`\`\`
This runs the exact same "look up or create the user" logic regardless of which provider was used — closing the loop back to a real, database-backed \`User\` (see [[creating-user-table-and-db-properties]]) that the rest of the Job app (ownership checks, roles) already knows how to work with.`,
  code: `# application.yml - second provider registered alongside the first
spring:
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: \${GITHUB_CLIENT_ID}
            client-secret: \${GITHUB_CLIENT_SECRET}
            scope: read:user, user:email

// GitHub's attributes differ from Google's - this must be handled explicitly
@GetMapping("/dashboard")
public Map<String, Object> dashboard(@AuthenticationPrincipal OAuth2User principal) {
    String login = principal.getAttribute("login");   // GitHub username - Google has none
    String email = principal.getAttribute("email");   // may be null if private on GitHub
    return Map.of("login", login, "email", email);
}`,
  codeTitle: 'Adding GitHub alongside Google - same config shape, different attribute names',
  points: [
    'Adding a second OAuth2 provider requires only a new registration block in application.yml - no SecurityConfig changes, since .oauth2Login(...) already supports any number of providers.',
    'Spring Security auto-generates a login page listing every configured provider once more than one registration exists.',
    'Provider attribute names differ - Google returns "name"; GitHub returns "login" instead, and may require a separate call for a private email address.',
    'Code that reads attributes by a fixed name (like "name") without checking the registration id will silently get null for users who log in via a different provider.',
    'A single AuthenticationSuccessHandler that looks up-or-creates a User row by email works for any provider, since it operates on OAuth2User uniformly regardless of which provider authenticated the request.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Reading principal.getAttribute("name") without first checking which provider authenticated the request is a common bug once a second OAuth2 provider is added - it works fine for Google-authenticated users and silently returns null for GitHub-authenticated ones, since GitHub does not populate a "name" attribute the same way.' },
    { type: 'interview', content: 'Q: What changes in SecurityConfig when adding a second OAuth2 provider (GitHub) alongside an already-working one (Google), and what is the main risk of supporting more than one provider?\nA: Nothing in SecurityConfig itself needs to change - .oauth2Login(...) already supports any number of registered providers, and only a new registration block is added in application.yml. The main risk is that different providers return user profile data under different attribute names (Google uses "name", GitHub uses "login"), so code that reads a fixed attribute name without checking which provider authenticated the request can silently receive null values for some providers.' },
  ],
}
