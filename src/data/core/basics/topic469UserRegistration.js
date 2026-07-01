export default {
  id: 'user-registration',
  title: '469. User Registration',
  explanation: `Every prior topic assumed a \`User\` row already existed in the database — this topic closes the actual gap identified in the chapter summary (see [[security-summary-till-now]]): a real endpoint for creating a new account.

**The registration endpoint — deliberately separate from the secured \`/jobs\` endpoints:**
\`\`\`java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));   // never store raw
        user.setRole(Role.USER);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
\`\`\`

**Why \`/auth/register\` must be reachable *without* being logged in — a genuinely different rule from every other endpoint in this chapter.** Every other secured endpoint requires an existing authenticated identity; registration, by definition, is how someone *becomes* a user in the first place — requiring login to reach a registration endpoint would make it permanently unreachable. This means \`SecurityConfig\` (see [[security-configuration]]) needs an explicit \`.requestMatchers("/auth/**").permitAll()\` rule, ordered before any catch-all \`authenticated()\` rule.

**Why the uniqueness check happens before the save, not as a database constraint alone.** A unique constraint on the \`username\` column (already declared via \`@Column(unique = true)\`, see [[creating-user-table-and-db-properties]]) is the actual last line of defense against a duplicate — but catching it explicitly first, and returning a clear \`409 Conflict\`, gives a far better error than letting a raw \`DataIntegrityViolationException\` from the database bubble up as an ugly, generic \`500\` error.

**Why the role is always hardcoded to \`Role.USER\` here, never taken from the request body.** Accepting a client-supplied \`role\` field on a public, unauthenticated registration endpoint would let anyone register as \`ADMIN\` simply by setting that field — a direct privilege escalation. Role assignment beyond the default should only ever happen through a separate, properly authorized admin action, never through self-service registration.`,
  code: `@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);   // never taken from the request body
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}`,
  codeTitle: 'A registration endpoint - public, encodes the password, hardcodes the role',
  points: [
    'Registration is the missing piece from the chapter summary - the actual place a User row gets created rather than assumed to already exist.',
    '/auth/register must be reachable without authentication, requiring an explicit permitAll() rule ordered before any catch-all authenticated() rule in SecurityConfig.',
    'The submitted password is passed through passwordEncoder.encode() before being stored - the raw password is never persisted or logged.',
    'Checking for an existing username before saving, rather than relying only on the database unique constraint, produces a clean 409 Conflict instead of a raw database exception surfacing as a 500 error.',
    'The role is always hardcoded to Role.USER on self-service registration - accepting a client-supplied role field would let anyone register as an admin, a direct privilege escalation.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Accepting a role field directly from the registration request body and passing it straight to user.setRole() is a serious, easy-to-miss vulnerability - it lets any anonymous caller register an ADMIN account by simply including that field, bypassing all of the authorization work done elsewhere in this chapter.' },
    { type: 'interview', content: 'Q: Why should a public user registration endpoint never accept a role value directly from the client, even if the field is validated?\nA: Because registration is reachable by anyone without authentication, accepting a client-supplied role would let any caller assign themselves elevated privileges (such as ADMIN) simply by setting that field in the request - a direct privilege escalation. The server should always hardcode new self-registered accounts to the lowest-privilege role, with any elevation handled through a separate, properly authorized admin action.' },
  ],
}
