export default {
  id: 'jwt-authentication',
  title: '2. JWT Authentication',
  explanation: `**JWT (JSON Web Token)** is a compact, self-contained token for stateless authentication. Instead of storing session data on the server, the server issues a signed token to the client. The client sends it with every request, and the server verifies the signature.

**JWT structure (three Base64-encoded parts separated by dots):**
\`header.payload.signature\`
- **Header** — algorithm and token type: \`{"alg":"HS256","typ":"JWT"}\`
- **Payload** — claims (data): \`{"sub":"alice@co.com","roles":["USER"],"iat":...,"exp":...}\`
- **Signature** — HMAC-SHA256(header + "." + payload, secretKey)

**Flow:**
1. Client sends credentials (POST /api/auth/login)
2. Server validates, issues JWT
3. Client stores token (localStorage or cookie)
4. Client sends \`Authorization: Bearer <token>\` header on every subsequent request
5. Server validates signature + expiry, extracts user identity from payload`,
  code: `// pom.xml: add io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.*;
import java.security.*;
import java.util.*;

// 1. JWT utility service
@Component
public class JwtService {

    @Value("\${jwt.secret}")
    private String secret;

    @Value("\${jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .claim("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build()
            .parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }
}

// 2. JWT filter — runs before every request
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null,
                                                            userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}

// 3. Auth controller
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        UserDetails user = userDetailsService.loadUserByUsername(req.getEmail());
        return ResponseEntity.ok(Map.of("token", jwtService.generateToken(user)));
    }
}`,
  points: [
    'JWT is stateless — the server stores no session; the token itself carries all identity information',
    'The secret key must be at least 256 bits for HS256; store it in environment variables, never in code',
    'Always validate the signature AND expiry — a valid-signature expired token must still be rejected',
    'Refresh tokens (long-lived) paired with short-lived access JWTs is the production pattern',
    'JWT payload is Base64-encoded, NOT encrypted — anyone can decode it. Never put sensitive data (password, SSN) in the payload',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What are the advantages and disadvantages of JWT over session-based auth?\nA: Advantages: stateless (no server-side session storage), scales horizontally with no sticky sessions, works across microservices. Disadvantages: tokens cannot be invalidated before expiry (no logout on server side), token size is larger than a session ID, must be stored securely on the client to prevent XSS/CSRF. Sessions are simpler and support instant invalidation; JWTs are better for distributed/stateless architectures.',
    },
    {
      type: 'gotcha',
      content: 'Storing JWTs in localStorage is vulnerable to XSS — any injected script can steal the token. Storing in httpOnly cookies prevents JS access but requires CSRF protection. For most apps, httpOnly cookies with CSRF tokens is the more secure option.',
    },
  ],
}
