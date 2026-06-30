export default {
  id: 'spring-security-basics',
  title: '1. Spring Security — Authentication & Authorization',
  explanation: `**Spring Security** handles authentication (who are you?) and authorization (what are you allowed to do?) in Spring applications.

**Core concepts:**
- **Authentication** — verifying identity (username + password, token, OAuth2)
- **Authorization** — checking permissions (roles, authorities)
- **Security Filter Chain** — a chain of servlet filters that intercept every HTTP request before it reaches your controller

**Key components:**
- \`UserDetailsService\` — interface you implement to load user by username from your database
- \`UserDetails\` — the user object returned by UserDetailsService (holds username, password, authorities)
- \`PasswordEncoder\` — hashes passwords; always use \`BCryptPasswordEncoder\`
- \`SecurityFilterChain\` — Spring Boot 3.x configuration bean (replaces extending \`WebSecurityConfigurerAdapter\`)`,
  code: `// pom.xml dependency
// <dependency>spring-boot-starter-security</dependency>

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.*;

// 1. Security configuration (Spring Boot 3.x / Spring Security 6)
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                   // disable for REST APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // public endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()               // everything else requires login
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // for JWT
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();   // cost factor 10 by default
    }
}

// 2. UserDetailsService — load user from database
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPasswordHash())  // already BCrypt hashed in DB
            .roles(user.getRole().name())       // e.g., "USER", "ADMIN"
            .build();
    }
}

// 3. Register a new user — hash password before saving
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest req) {
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword())); // ALWAYS hash
        userRepo.save(user);
    }
}`,
  points: [
    'NEVER store plain-text passwords — always encode with BCryptPasswordEncoder before saving to the database',
    'BCrypt is deliberately slow (work factor) — this is intentional to resist brute-force attacks',
    'hasRole("ADMIN") automatically adds the "ROLE_" prefix — the stored role must be "ROLE_ADMIN" or just use hasAuthority("ROLE_ADMIN")',
    'Spring Security 6 (Spring Boot 3) deprecated WebSecurityConfigurerAdapter — use the SecurityFilterChain @Bean approach',
    'The filter chain runs BEFORE your controllers — a blocked request never reaches @RestController',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between authentication and authorization?\nA: Authentication answers "Who are you?" — verifying identity via credentials (username/password, token). Authorization answers "What are you allowed to do?" — checking permissions after identity is confirmed. In Spring Security: the AuthenticationManager handles authentication; AccessDecisionManager (or authorization rules in SecurityFilterChain) handles authorization.',
    },
    {
      type: 'gotcha',
      content: 'Disabling CSRF (.csrf(csrf -> csrf.disable())) is appropriate for stateless REST APIs using JWT or API keys. Do NOT disable CSRF for traditional web apps with session-based authentication — it opens you up to cross-site request forgery attacks.',
    },
  ],
}
