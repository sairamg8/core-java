export default {
  id: 'session-id',
  title: '450. Session ID',
  explanation: `The previous topic mentioned that logging in via the default form establishes an HTTP session (see [[default-login-form]]) — this topic looks at exactly what that session is, and where it lives, since it's the mechanism every request after login relies on to stay authenticated.

**What a session actually is:** since HTTP itself has no memory between requests, Spring (via the underlying servlet container) creates a small server-side storage area, identified by a unique **session ID**, the first time a client needs one. That session ID is sent to the browser as a cookie (typically named \`JSESSIONID\`) and the browser automatically re-sends it with every subsequent request to the same host.

**How the server uses it:** on each incoming request, the servlet container reads the \`JSESSIONID\` cookie, looks up the matching server-side session, and — for a Spring Security-secured app — finds the authenticated user's identity stored inside that session (in the \`SecurityContext\`). This is how a user only has to log in once, even though HTTP requests are otherwise completely stateless and disconnected from each other.

**Seeing it directly:** opening browser dev tools after logging in via the default form shows a cookie named \`JSESSIONID\` with a long random value like \`5A79FBF221CD16C0F1D53BE4F5A93A2C\`. This value is the session ID — it identifies which server-side session belongs to this browser, nothing more; it contains no user data itself, just a reference/lookup key.

**Why the session ID must be unpredictable and protected.** If an attacker could guess or steal a valid session ID (session hijacking), they could impersonate that logged-in user without ever knowing their password — simply by sending requests with the stolen \`JSESSIONID\` cookie. This is exactly why session IDs are long, random, and why cookies carrying them should be marked \`HttpOnly\` (unreadable by JavaScript) and \`Secure\` (only sent over HTTPS) in production.

**Where this fits going forward in this chapter:** session-based authentication (what's built so far) requires the server to keep session state in memory (or a shared session store) for every logged-in user — this is called *stateful* authentication. Later in this chapter, JWT-based authentication is introduced specifically as a *stateless* alternative, where no server-side session is kept at all — understanding sessions now makes that contrast, and the tradeoffs it involves, much clearer later.`,
  code: `// After a successful login via the default form, inspect the response headers:
// Set-Cookie: JSESSIONID=5A79FBF221CD16C0F1D53BE4F5A93A2C; Path=/; HttpOnly

// Every subsequent request from this browser automatically includes:
// Cookie: JSESSIONID=5A79FBF221CD16C0F1D53BE4F5A93A2C

// Server-side (conceptually):
// sessionStore["5A79FBF221CD16C0F1D53BE4F5A93A2C"] = {
//   authenticatedUser: "user",
//   authorities: ["ROLE_USER"],
// }`,
  codeTitle: 'The JSESSIONID cookie links a stateless request back to server-side session data',
  points: [
    'A session is server-side storage, identified by a unique session ID, created because HTTP requests are otherwise stateless and have no memory of each other.',
    'The session ID is sent to the browser as a cookie (typically JSESSIONID) and automatically re-sent by the browser with every later request to the same host.',
    'The session ID itself carries no user data - it is only a lookup key the server uses to find the actual authenticated identity stored in its own session store.',
    'A stolen or guessed session ID lets an attacker impersonate a logged-in user without ever knowing their password - this is why session IDs must be long, random, and cookies should be HttpOnly and Secure in production.',
    'Session-based auth is stateful - the server must keep session data for every logged-in user - which is exactly the tradeoff JWT-based authentication, introduced later in this chapter, is designed to remove.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A missing HttpOnly flag on the session cookie means client-side JavaScript can read document.cookie and access the session ID directly - if the app has any XSS vulnerability elsewhere, that combination lets an attacker steal a live session; HttpOnly alone closes off that specific theft path.' },
    { type: 'interview', content: 'Q: What information does the JSESSIONID cookie actually contain, and what happens on the server when a request arrives with it?\nA: The cookie contains only the session ID itself - a random string with no embedded user data. On each request, the server uses that ID as a lookup key into its own server-side session store to find the matching session, which holds the actual authenticated user identity. If the ID does not match any stored session, the request is treated as unauthenticated.' },
  ],
}
