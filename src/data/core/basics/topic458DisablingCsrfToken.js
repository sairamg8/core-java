export default {
  id: 'disabling-csrf-token',
  title: '458. Disabling CSRF Token',
  explanation: `Sending a CSRF token correctly (see [[sending-csrf-token]]) is the right fix for a browser-based, cookie-authenticated frontend. But this course's Job app also needs to support pure API clients like Postman during development, and — more importantly — the rest of this chapter moves toward JWT, a **stateless** authentication scheme that doesn't use cookies at all. This topic covers *when* disabling CSRF protection outright is the correct, deliberate choice, not a shortcut.

**The configuration:**
\`\`\`java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .anyRequest().authenticated());
    return http.build();
}
\`\`\`

**Why disabling CSRF is actually correct once cookies leave the picture entirely.** CSRF exists specifically because browsers automatically attach cookies to requests regardless of which site initiated them (see [[what-is-csrf]]). A stateless API authenticated via a bearer token in an \`Authorization\` header — the JWT approach this chapter builds toward — has nothing for a forged cross-site request to exploit: a malicious page cannot make the victim's browser magically attach an \`Authorization: Bearer <token>\` header the way it can attach a cookie. **No cookie-based session means no CSRF attack surface to defend in the first place** — disabling the protection isn't removing a safeguard, it's recognizing that the specific threat it defends against no longer applies.

**The rule that actually decides whether disabling CSRF is safe:** does the application authenticate requests using a cookie that the browser sends automatically? If yes, CSRF protection must stay enabled. If authentication instead requires an explicit header value the client must construct itself (Basic Auth, Bearer tokens, API keys) — never automatically attached by the browser — CSRF protection is genuinely unnecessary, not just inconvenient to configure.

**Why this matters as a deliberate decision, not a reflex.** Disabling CSRF the moment the 403 error appears (see [[error-without-csrf-token]]), without first checking whether the app is still cookie-authenticated, removes a real protection while the actual vulnerability it guards against still exists. This topic's configuration is only correct in the context of where this chapter is heading — a fully stateless, JWT-secured API — and should be revisited if the app ever adds back cookie-based session authentication for any part of it.`,
  code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // Safe to disable ONLY because authentication will use a stateless
        // bearer token (JWT) in an Authorization header, not a cookie.
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .anyRequest().authenticated());
    return http.build();
}`,
  codeTitle: 'Disabling CSRF alongside a stateless session policy - correct for token auth',
  points: [
    'Disabling CSRF is correct specifically for applications that no longer authenticate via a cookie the browser attaches automatically.',
    'A stateless bearer-token scheme (JWT in an Authorization header) gives a forged cross-site request nothing to exploit, since the browser cannot be tricked into attaching that header the way it attaches cookies.',
    'The deciding question is whether authentication relies on an automatically-attached cookie (keep CSRF enabled) or an explicit client-constructed header value (CSRF protection becomes unnecessary).',
    'Disabling CSRF as a reflex the moment the 403 error appears, without checking whether the app is still cookie-authenticated, removes real protection while the underlying risk still exists.',
    'This decision is tied to sessionCreationPolicy(STATELESS) - the two typically go together, since a stateless, token-authenticated API is exactly the case where CSRF protection is no longer needed.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Disabling CSRF while still authenticating with a session cookie (rather than a token) reopens the exact vulnerability this chapter spent several topics explaining - CSRF disabling is only safe once cookie-based authentication is genuinely removed, not just alongside it as an unrelated convenience change.' },
    { type: 'interview', content: 'Q: Under what condition is it actually safe to disable CSRF protection in a Spring Security application, rather than just convenient?\nA: When authentication no longer relies on a cookie the browser attaches automatically - for example, a stateless JWT scheme where the client must explicitly construct an Authorization header. A malicious cross-site request cannot force the browser to add that header the way it can attach a cookie, so the underlying CSRF attack surface simply does not exist in that case, and disabling the protection reflects that reality rather than removing a needed safeguard.' },
  ],
}
