export default {
  id: 'generating-token',
  title: '482. Generating Token',
  explanation: `\`AuthController.login()\` (see [[custom-login]]) calls \`jwtService.generateToken(...)\` — this topic writes that method, the piece that actually builds a JWT using the \`jjwt\` library added earlier (see [[project-setup-for-jwt]]).

**The \`JwtService\` — generation side:**
\`\`\`java
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
}
\`\`\`

**Reading this method call by call, matching directly to the JWT structure already covered (see [[what-is-jwt]]):**
- \`.subject(userDetails.getUsername())\` — sets the \`sub\` claim in the payload
- \`.claim("roles", ...)\` — adds a custom claim; here, the user's authorities, mapped to plain strings
- \`.issuedAt(new Date())\` — sets \`iat\`
- \`.expiration(new Date(System.currentTimeMillis() + expirationMs))\` — sets \`exp\`, computed from the configured lifetime (see [[project-setup-for-jwt]])
- \`.signWith(getSigningKey())\` — computes the signature (see [[digital-signature]]) using the configured secret
- \`.compact()\` — serializes everything into the final \`header.payload.signature\` string

**Why \`getSigningKey()\` decodes the secret from Base64 before using it.** The secret is stored as a Base64 string in configuration (readable, safe to put in a properties file or environment variable as text) — \`Keys.hmacShaKeyFor(keyBytes)\` needs the actual raw key *bytes*, not the Base64 text representation of them, so decoding is a required step, not an optional safety measure.

**Why authorities are mapped to plain strings (\`GrantedAuthority::getAuthority\`) rather than serializing the \`GrantedAuthority\` objects directly.** \`GrantedAuthority\` is a Spring Security interface, not something meaningful outside the JVM that created it — the JWT payload needs to be plain JSON, so extracting just the string authority name (\`"ROLE_USER"\`, \`"ROLE_ADMIN"\`) is what actually serializes cleanly and is meaningful to any verifier, including one that isn't even written in Java.`,
  code: `@Component
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
}`,
  codeTitle: 'JwtService.generateToken() - building each part of the JWT explicitly',
  points: [
    'Jwts.builder() maps directly onto JWT structure: .subject() sets sub, .claim() adds custom data like roles, .issuedAt()/.expiration() set iat/exp, .signWith() computes the signature.',
    'getSigningKey() decodes the configured secret from Base64 into raw bytes, since Keys.hmacShaKeyFor() requires the actual key bytes, not their Base64 text representation.',
    'Authorities are mapped to plain strings via GrantedAuthority::getAuthority before being added as a claim, since GrantedAuthority itself is a Spring Security-specific type not meaningful in serialized JSON.',
    'expiration-ms from configuration is added to the current time to compute the exp timestamp, directly implementing the short-lived-token principle from earlier in this chapter.',
    '.compact() is the final step - it serializes the header, payload, and computed signature into the actual header.payload.signature string returned to the client.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Passing the raw Base64 string secret directly into a key constructor (skipping Base64.getDecoder().decode()) either throws an error or silently produces a weaker key than intended, since the signing algorithm expects actual key bytes, not the encoded text representation of those bytes.' },
    { type: 'interview', content: 'Q: Why does generateToken() map each GrantedAuthority to a plain string before adding it as a claim, rather than storing the GrantedAuthority objects directly?\nA: GrantedAuthority is a Spring Security Java interface, not a serializable data format meaningful outside the JVM. The JWT payload must be plain JSON that any verifier - including one not written in Java - can read, so only the authority name itself (like "ROLE_USER") is extracted and stored as a plain string claim.' },
  ],
}
