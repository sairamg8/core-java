export default {
  id: 'oauth2',
  title: '3. OAuth2 & Social Login',
  explanation: `**OAuth2** is an authorization framework that lets users grant third-party applications access to their resources (e.g., "Login with Google") without sharing their password.

**Key roles:**
- **Resource Owner** — the user
- **Client** — your application
- **Authorization Server** — issues tokens (Google, GitHub, your own Keycloak)
- **Resource Server** — the API that serves protected data (could be your own API)

**Authorization Code Flow (most secure, use for web apps):**
1. User clicks "Login with Google"
2. Your app redirects to Google's authorization endpoint
3. User logs in and grants permission at Google
4. Google redirects back with an **authorization code**
5. Your server exchanges the code for an **access token** (server-to-server, code not exposed)
6. Your server uses the access token to fetch user profile from Google

**Spring Boot makes OAuth2 login trivial** — just add a dependency and 3 config lines.`,
  code: `// pom.xml
// <dependency>spring-boot-starter-oauth2-client</dependency>

// application.yml — register Google as OAuth2 client
/*
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
*/

// Security config — enable OAuth2 login
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
            );
        return http.build();
    }
}

// Access the authenticated user in a controller
import org.springframework.security.oauth2.core.user.*;

@RestController
public class UserController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(
            @AuthenticationPrincipal OAuth2User principal) {

        String name  = principal.getAttribute("name");
        String email = principal.getAttribute("email");
        // GitHub gives "login" not "name"
        return Map.of("name", name, "email", email);
    }
}

// Custom OAuth2 success handler — save/update user in your DB after login
@Component
public class OAuth2LoginSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req,
                                         HttpServletResponse res,
                                         Authentication auth)
            throws IOException {
        OAuth2User oauthUser = (OAuth2User) auth.getPrincipal();
        String email = oauthUser.getAttribute("email");

        userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, oauthUser.getAttribute("name"));
            return userRepo.save(newUser);
        });

        res.sendRedirect("/dashboard");
    }
}`,
  points: [
    'Spring Boot auto-configures Google, GitHub, Facebook, and Okta providers — just supply client-id and client-secret',
    'The client-secret must NEVER be in source code — use environment variables or a secrets manager',
    'OAuth2 handles authentication (who the user is); your app still handles authorization (what they can do)',
    'The authorization code is single-use and short-lived — exchanging it for a token happens server-to-server for security',
    'PKCE (Proof Key for Code Exchange) is now required for public clients (SPAs, mobile apps) — Spring Security supports it out of the box',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between OAuth2 and OpenID Connect (OIDC)?\nA: OAuth2 is an authorization framework — it gives your app an access token to call APIs on the user\'s behalf. It does NOT define how to get user identity. OpenID Connect is a thin layer on top of OAuth2 that adds an ID token (a JWT) containing user identity information (sub, email, name). When you use "Login with Google," you are using OIDC (OAuth2 + identity layer).',
    },
    {
      type: 'gotcha',
      content: 'Different providers return user attributes under different names: Google uses "email" and "name", GitHub uses "login" and "email" (email may need a separate API call if it is private). Always check the provider-specific attribute map when accessing OAuth2 user data.',
    },
  ],
}
