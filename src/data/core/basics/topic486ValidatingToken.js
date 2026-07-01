export default {
  id: 'validating-token',
  title: '486. Validating Token',
  explanation: `The previous topic called \`jwtService.isTokenValid(token, userDetails)\` without showing what it actually checks (see [[setting-auth-token-in-securitycontext]]) — this topic writes that method, along with the supporting extraction helpers, completing \`JwtService\` on the verification side (mirroring \`generateToken()\` from earlier, see [[generating-token]]).

**The full verification-side of \`JwtService\`:**
\`\`\`java
public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
}

private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
}

private <T> T extractClaim(String token, Function<Claims, T> resolver) {
    Claims claims = Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
    return resolver.apply(claims);
}

public boolean isTokenValid(String token, UserDetails userDetails) {
    try {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    } catch (JwtException e) {
        return false;
    }
}

private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
}
\`\`\`

**Why \`.verifyWith(getSigningKey())\` is the step that actually matters most here, not just a formality.** \`Jwts.parser().verifyWith(key).build().parseSignedClaims(token)\` recomputes the signature internally and compares it against the one embedded in the token (see [[digital-signature]]) — if they don't match (a tampered payload, or a token signed with a different secret entirely), this call throws a \`JwtException\` (specifically \`SignatureException\`) *before* any claim can even be read. A token that fails signature verification never gets far enough to have its username or expiration inspected at all.

**Why \`isTokenValid\` checks *two separate things*, not just the signature.** A structurally valid, correctly-signed token can still be **expired** — signature validity and expiration are independent properties, and both must hold. It also re-confirms the username in the token matches the \`userDetails\` being checked against — defending against a scenario where a valid token for one user is somehow being validated in the context of a different user's session state.

**Why every JWT exception is caught broadly and converted to \`return false\`, rather than letting specific exceptions propagate.** \`ExpiredJwtException\`, \`SignatureException\`, \`MalformedJwtException\` are all different failure modes with the same practical consequence here — the token isn't usable, and the filter should simply treat the request as unauthenticated and move on (see [[creating-a-jwt-filter]]), not crash the request with an unhandled exception.`,
  code: `public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
}

private <T> T extractClaim(String token, Function<Claims, T> resolver) {
    Claims claims = Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)   // throws JwtException if signature is invalid
        .getPayload();
    return resolver.apply(claims);
}

public boolean isTokenValid(String token, UserDetails userDetails) {
    try {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername())
            && !extractExpiration(token).before(new Date());
    } catch (JwtException e) {
        return false;   // any signature/format/expiry failure -> simply invalid
    }
}`,
  codeTitle: 'JwtService verification: signature check happens before any claim is trusted',
  points: [
    'parseSignedClaims(token) internally recomputes and verifies the signature - it throws before any claim can be read if the signature does not match.',
    'isTokenValid checks two independent properties: the token is correctly signed and unexpired, and separately that its username matches the userDetails being validated against.',
    'A structurally valid, correctly-signed token can still be expired - signature validity and expiration are separate checks, and both must pass.',
    'All JWT-related exceptions (expired, malformed, bad signature) are caught broadly and converted to a simple false, since the practical consequence is the same in every case - the token is not usable.',
    'This mirrors generateToken() from earlier - together the two halves of JwtService form a complete, self-contained token issue-and-verify implementation.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Extracting and trusting a claim (like username) before verifying the signature would be a serious vulnerability - it would let a client submit a completely unsigned or wrongly-signed token with a forged username and have it accepted. parseSignedClaims() is specifically designed so signature verification happens as an inseparable first step, not an optional check performed afterward.' },
    { type: 'interview', content: 'Q: Why does isTokenValid() check both the signature/expiration AND that the token username matches the provided userDetails, rather than just checking the signature?\nA: A correctly signed, unexpired token is still only proof that the server itself issued it at some point - checking that its username matches the userDetails being validated against guards against edge cases where a valid token intended for one user context ends up being checked against a different user’s state. Expiration is also checked separately because a token can be validly signed yet simply too old to still be trusted, which the signature check alone would not catch.' },
  ],
}
