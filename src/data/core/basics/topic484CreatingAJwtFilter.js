export default {
  id: 'creating-a-jwt-filter',
  title: '484. Creating a JWT Filter',
  explanation: `Every topic so far in this JWT arc covered *issuing* a token (see [[token-generation-flow]]) — this topic covers the other half: **verifying** a token on every subsequent request. This is done with a custom filter, plugged into the same filter chain concept covered earlier in this chapter (see [[spring-security-filters]]).

**\`JwtAuthFilter\` — extends \`OncePerRequestFilter\`, a Spring convenience base class guaranteeing the filter runs exactly once per request:**
\`\`\`java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);   // no token - let other rules decide
            return;
        }
        String token = authHeader.substring(7);   // strip "Bearer "
        String username = jwtService.extractUsername(token);

        // authentication logic continues in the next topic
        filterChain.doFilter(request, response);
    }
}
\`\`\`

**Why extend \`OncePerRequestFilter\` specifically, rather than implementing the raw servlet \`Filter\` interface directly.** A single HTTP request can, in some servlet container configurations, be internally forwarded/dispatched multiple times (error pages, \`RequestDispatcher.forward()\`) — a naive \`Filter\` could run its logic more than once for what the application considers a single logical request. \`OncePerRequestFilter\` guarantees exactly-once execution per request, which matters here since re-parsing and re-validating a token twice is wasted work at best and a source of subtle bugs at worst.

**Why the filter checks for \`Bearer \` and passes the request through unmodified when the header is missing or malformed**, rather than immediately rejecting the request. Not every endpoint requires authentication (\`/auth/login\`, \`/auth/register\`, \`/jobs/search\` — see [[plan-to-secure-job-app-project]]) — this filter's job is only to *populate* the security context *if* a valid token is present; whether the request is actually allowed through is still decided afterward by the \`authorizeHttpRequests\` rules in \`SecurityConfig\`, exactly as before.

**Registering the filter into the chain — added before \`UsernamePasswordAuthenticationFilter\`:**
\`\`\`java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
\`\`\`
\`.addFilterBefore(...)\` places the custom filter earlier in the chain than the default form-login filter — necessary because the JWT filter needs to establish authentication *before* the framework's own authorization checks run later in the same chain.`,
  code: `@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

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
        // setting the SecurityContext is covered in the next topic
        filterChain.doFilter(request, response);
    }
}`,
  codeTitle: 'JwtAuthFilter - extracting the Bearer token before establishing authentication',
  points: [
    'OncePerRequestFilter guarantees the filter runs exactly once per logical HTTP request, even across internal servlet forwards/dispatches - important since a token should not be parsed and validated more than once.',
    'A missing or malformed Authorization header passes the request through unmodified rather than rejecting it - whether the request is ultimately allowed is still decided by authorizeHttpRequests rules afterward.',
    'The filter is registered with addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class), placing it earlier in the chain than the default form-login filter.',
    'sessionCreationPolicy(STATELESS) is set alongside this filter, since JWT-based auth deliberately keeps no server-side session at all.',
    'substring(7) strips the literal "Bearer " prefix (7 characters including the space) from the header value to isolate the raw token string.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Rejecting the request outright (rather than just passing it through) when the Authorization header is missing would break every public endpoint, since this filter runs on every request regardless of whether that endpoint actually requires authentication - the only job of this filter is to populate authentication when a valid token is present, not to enforce access control itself.' },
    { type: 'interview', content: 'Q: Why does JwtAuthFilter extend OncePerRequestFilter instead of implementing the raw Filter interface, and why does it pass requests through unmodified when no Authorization header is present?\nA: OncePerRequestFilter guarantees the filter logic runs exactly once per request even if the servlet container internally forwards or dispatches the request multiple times, avoiding redundant token parsing. Passing an unauthenticated request through unmodified (rather than rejecting it) is correct because not every endpoint requires authentication - this filter only establishes identity when a valid token is present, while the actual access decision is still made separately by the authorizeHttpRequests rules.' },
  ],
}
