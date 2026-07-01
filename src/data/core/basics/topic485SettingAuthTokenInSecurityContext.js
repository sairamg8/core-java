export default {
  id: 'setting-auth-token-in-securitycontext',
  title: '485. Setting Auth Token in SecurityContext',
  explanation: `\`JwtAuthFilter\` (see [[creating-a-jwt-filter]]) currently extracts the username from a valid token but does nothing with it — this topic finishes the filter, completing the piece marked "covered in the next topic," by actually telling Spring Security that this request is authenticated.

**The completed \`doFilterInternal\`:**
\`\`\`java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    String token = authHeader.substring(7);
    String username = jwtService.extractUsername(token);

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (jwtService.isTokenValid(token, userDetails)) {
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
    filterChain.doFilter(request, response);
}
\`\`\`

**Why \`SecurityContextHolder.getContext().getAuthentication() == null\` is checked before doing any work.** This guards against redundant processing if something upstream in the chain already established authentication for this request — an unnecessary check in a simple setup, but a defensive habit that matters once multiple authentication mechanisms could coexist in the same filter chain (form login and JWT together, for instance).

**Why a \`UsernamePasswordAuthenticationToken\` is constructed here even though no password is being checked at this point.** This is exactly the same \`Authentication\` implementation used throughout this chapter's session-based flow (see [[authenticationprovider]]) — reusing it means every downstream part of Spring Security (authorization checks, \`@AuthenticationPrincipal\`, \`SecurityContextHolder\` reads elsewhere in the app) works identically regardless of whether the original login used a session or a JWT. The second constructor argument (credentials) is \`null\` specifically because the password was already verified once, back when the token was originally issued (see [[token-generation-flow]]) — there's nothing left to re-check here.

**Why this only sets the \`SecurityContext\` for the current request, not for a "session."** With \`sessionCreationPolicy(STATELESS)\` (see [[creating-a-jwt-filter]]), nothing persists between requests — this exact same filter logic runs again, independently, on every single subsequent request, re-verifying the token each time from scratch. There is no "remembering" across requests at all — which is precisely the stateless property JWT was chosen for (see [[why-jwt]]).`,
  code: `if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

    if (jwtService.isTokenValid(token, userDetails)) {
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}`,
  codeTitle: 'Populating SecurityContext once a token is confirmed valid',
  points: [
    'The null check on getAuthentication() avoids redundant work if authentication was already established upstream in the filter chain.',
    'UsernamePasswordAuthenticationToken is reused here (with null credentials, since the password was already verified when the token was issued) so every downstream part of Spring Security works identically regardless of session or JWT auth.',
    'SecurityContextHolder.getContext().setAuthentication(authToken) is the actual moment this request becomes "authenticated" from Spring Security’s point of view.',
    'This SecurityContext population happens fresh on every single request - nothing persists between requests under a stateless (STATELESS) session policy.',
    'This is precisely the JWT tradeoff from earlier in this chapter made concrete: no server-side memory of "being logged in" exists anywhere - only independent, per-request token verification.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Setting the second UsernamePasswordAuthenticationToken constructor argument (credentials) to anything other than null here would be misleading and unnecessary - the password was already verified once at token issuance time; there is no password available or needed at this point, and passing null is the correct, expected pattern for this exact scenario.' },
    { type: 'interview', content: 'Q: Once JwtAuthFilter sets the SecurityContext for the current request, does that authentication persist for the user’s next request?\nA: No. Under a stateless session policy, nothing is remembered between requests - the entire filter, including token extraction, validation, and SecurityContext population, runs again independently on every single subsequent request. This is the defining property of JWT-based stateless authentication: identity is re-derived from the token itself each time, not remembered server-side.' },
  ],
}
