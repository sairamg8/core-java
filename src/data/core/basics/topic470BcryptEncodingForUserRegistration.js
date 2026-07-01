export default {
  id: 'bcrypt-encoding-for-user-registration',
  title: '470. BCrypt Encoding for User Registration',
  explanation: `The registration endpoint from the previous topic (see [[user-registration]]) already calls \`passwordEncoder.encode(...)\` — this topic looks closer at that one line, since it's the single most consequential line in the entire registration flow, and getting the surrounding details wrong is a common source of real vulnerabilities.

**The one non-negotiable rule: the raw password must never touch storage, logging, or a response, even transiently.**
\`\`\`java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // ...
    String hashed = passwordEncoder.encode(request.getPassword());
    user.setPassword(hashed);
    userRepository.save(user);
    // request.getPassword() (the raw value) is never stored, logged, or returned from here on
    return ResponseEntity.status(HttpStatus.CREATED).build();   // no password in the response
}
\`\`\`

**Why the response body deliberately returns nothing about the created user, not even the username.** Echoing back \`{"username": "...", "password": "..."}\` — even with the *hashed* password — is unnecessary exposure: the client already has the username it just submitted, and returning any password-shaped field, hashed or not, trains client code (and developers reading logs) to treat that field as safe to display or transmit, which it never is.

**A subtlety worth calling out: request logging frameworks can accidentally log the raw password before this code ever runs.** A common real-world mistake is a global request/response logging filter (for debugging or monitoring) that logs the full request body — including the plaintext password from a registration or login request — to application logs, completely bypassing BCrypt entirely, since the logging happens before or independent of the encoding step. This is why registration and login request bodies specifically need to be excluded from generic request-logging middleware, not just relying on the database layer being secure.

**Where BCrypt encoding must happen consistently — registration is not the only place.** Any code path that ever sets a \`User\`'s password — registration, a future "change password" endpoint, an admin-created account, a password reset flow — must call \`passwordEncoder.encode()\` before persisting. A single code path that accidentally saves a raw password (a "quick fix" seed script is a common culprit) undermines the guarantee everywhere else in the app relies on.`,
  code: `// The one line that matters most in the entire registration flow:
String hashed = passwordEncoder.encode(request.getPassword());
user.setPassword(hashed);

// What must NEVER happen, in registration or anywhere else:
// log.info("Registering user: {}", request);          // logs the raw password!
// user.setPassword(request.getPassword());              // stores plain text!
// return ResponseEntity.ok(user);                       // echoes the hash back to the client!

// The safe response - acknowledges success, exposes nothing sensitive:
return ResponseEntity.status(HttpStatus.CREATED).build();`,
  codeTitle: 'What must happen (encode before save) and what must never happen (log/echo raw data)',
  points: [
    'passwordEncoder.encode() must run before the password is ever persisted, and the raw value must never be stored, logged, or returned in a response, even transiently.',
    'The registration response deliberately returns no user data at all, including hashed fields - there is nothing the client needs back that it did not already have.',
    'Generic request/response logging middleware can accidentally log a raw password from a registration or login request body, completely bypassing BCrypt - these endpoints often need explicit exclusion from such logging.',
    'BCrypt encoding must be applied consistently everywhere a password is ever set - registration, password changes, admin-created accounts, password resets - not just at the one endpoint written first.',
    'A single overlooked code path (a seed script, an admin tool, a "quick fix") that stores a raw password undermines the security guarantee the rest of the application assumes holds everywhere.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A debug-only logging statement like log.info("Registration request: {}", request) added temporarily during development, then forgotten and shipped to production, can log plaintext passwords to application logs indefinitely - treat any code that logs a raw request body touching authentication endpoints as a serious risk, not a harmless debugging aid.' },
    { type: 'interview', content: 'Q: Beyond calling passwordEncoder.encode() in the registration endpoint itself, what other parts of an application need to guarantee the same thing, and why?\nA: Every code path that can ever set a password - password change endpoints, admin-created accounts, password reset flows, and seed/migration scripts - must apply the same encoding before persisting. If even one of these paths stores a raw password, it silently breaks the security guarantee the rest of the application (and every later authentication check) assumes holds for every stored password.' },
  ],
}
