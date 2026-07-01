export default {
  id: 'custom-login',
  title: '481. Custom Login',
  explanation: `With \`jjwt\` in place (see [[project-setup-for-jwt]]), this topic writes the actual login endpoint that authenticates a user and returns a JWT — replacing the default form login (see [[default-login-form]]) used throughout the rest of this chapter with something a REST client can actually call.

**Why a dedicated \`/auth/login\` endpoint is needed, rather than relying on Spring Security's default form-based \`/login\`.** The default login processing filter is built for browsers submitting an HTML form and redirecting afterward — a REST client sending JSON and expecting a JSON response back (with a token in it) needs a real \`@RestController\` endpoint under application control, not the framework's built-in redirect-based flow.

**The endpoint itself, reusing \`AuthenticationManager\` — the same authentication machinery already built in this chapter:**
\`\`\`java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
\`\`\`

**Why this still relies on \`AuthenticationManager\` (and, underneath it, the exact same \`AuthenticationProvider\`/\`UserDetailsService\`/\`PasswordEncoder\` chain, see [[security-summary-till-now]]) rather than writing username/password checking logic from scratch.** JWT changes *how the result of a successful login gets communicated back to the client* — a token instead of a session cookie — but *verifying the username and password* is exactly the same problem already solved. Reusing \`AuthenticationManager\` here means every piece of infrastructure built earlier in this chapter (BCrypt password checking, the database-backed \`UserDetailsService\`) continues to work unchanged.

**What happens on invalid credentials.** \`authenticationManager.authenticate(...)\` throws \`BadCredentialsException\` on a failed match — this needs an \`@ExceptionHandler\` (or equivalent) to turn that into a clean \`401 Unauthorized\` JSON response rather than letting a raw exception leak to the client as an unhandled \`500\`.

**\`AuthenticationManager\` needs to be exposed as a \`@Bean\` for this to work:**
\`\`\`java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
\`\`\``,
  code: `@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}`,
  codeTitle: 'A custom /auth/login endpoint returning a JWT, reusing AuthenticationManager',
  points: [
    'A dedicated /auth/login REST endpoint is needed because the default Spring Security form login is built for browser redirects, not JSON request/response.',
    'The endpoint reuses AuthenticationManager - the same underlying AuthenticationProvider, UserDetailsService, and PasswordEncoder chain already built in this chapter - to verify credentials.',
    'JWT changes how a successful login result is communicated back (a token instead of a session cookie), not how the username and password are actually verified.',
    'AuthenticationManager must be exposed as its own @Bean (via AuthenticationConfiguration) for it to be injectable into a controller.',
    'A failed authentication throws BadCredentialsException, which needs an explicit @ExceptionHandler to return a clean 401 response rather than an unhandled 500.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting to add an @ExceptionHandler for BadCredentialsException means a wrong password results in a generic, unhandled 500 Internal Server Error rather than a clear 401 - the difference matters both for API consumers and for not leaking internal exception details to clients.' },
    { type: 'interview', content: 'Q: Why does a custom JWT login endpoint still use AuthenticationManager instead of directly querying the database and comparing passwords itself?\nA: AuthenticationManager, along with the AuthenticationProvider, UserDetailsService, and PasswordEncoder wired earlier in this chapter, already correctly implements credential verification including proper BCrypt comparison. JWT only changes what happens after a successful login - issuing a token instead of establishing a session - so reusing this existing machinery avoids duplicating (and potentially getting wrong) security-critical logic that already works.' },
  ],
}
