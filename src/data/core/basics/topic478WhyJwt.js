export default {
  id: 'why-jwt',
  title: '478. Why JWT?',
  explanation: `With encryption, hashing, and signatures now understood (see [[encryption-and-decryption]], [[digital-signature]]), this topic makes the actual case for adopting JWT — revisiting the limitations of session-based auth (built across this entire chapter so far) that JWT specifically exists to solve.

**Limitation 1 — sessions require server-side memory for every logged-in user.** Every session (see [[session-id]]) is stored somewhere on the server (in memory, or a shared store like Redis) for as long as it's valid. This scales fine for one server, but becomes a real architectural problem the moment an application runs on **multiple server instances** behind a load balancer — a request landing on a different instance than the one that created the session has no way to find that session data, unless every instance shares a common session store.

**Limitation 2 — Basic Auth (see [[basic-auth-using-postman]]) sends the real password on every request, forever, with no way to revoke access short of changing the password.** There's no concept of a limited-lifetime credential in Basic Auth at all.

**What JWT actually offers, addressing both:**
- **Stateless** — the server stores nothing. Every request carries a self-contained token with everything needed to verify identity (the signature) — any server instance can verify any token independently, with no shared session store required. This is what makes JWT a natural fit for the microservices architecture covered later in the course.
- **Expiring, not permanent** — a JWT carries its own expiration timestamp inside the payload; a stolen token becomes useless after that time passes, unlike a Basic Auth password which remains valid indefinitely until manually changed.
- **Self-describing** — the payload can carry roles/authorities directly, so a receiving service doesn't need to look anything up in a database just to know what the caller is allowed to do (though it still needs to verify the signature).

**The real tradeoff, stated honestly, not just the upside.** Because a JWT is self-contained and stateless, the server *cannot* forcibly invalidate one before its expiration — there's no server-side session to delete. "Logging out" with JWT typically just means the client discards the token; a stolen, still-valid token remains usable until it naturally expires. This is precisely why JWT expiration times are usually kept short (minutes, not days), often paired with a separate, longer-lived "refresh token" mechanism to get a new access token without requiring the user to log in again repeatedly.

**Why this chapter still builds session-based auth first, rather than starting with JWT.** Every concept JWT relies on — \`AuthenticationProvider\`, \`UserDetailsService\`, \`PasswordEncoder\` — is exactly the same infrastructure already built (see [[security-summary-till-now]]); JWT changes only *how the result gets remembered and sent back*, not how a user is authenticated in the first place.`,
  code: `// Session-based (stateful) - requires shared server-side storage across instances:
// Server A creates session -> stored in Server A's memory (or shared Redis)
// Next request lands on Server B -> must check the SAME shared session store

// JWT-based (stateless) - any server instance can verify independently:
// Server A issues a signed JWT to the client
// Next request (with the JWT) lands on Server B
// Server B verifies the signature itself - no shared state needed at all`,
  codeTitle: 'Stateful sessions need shared storage across servers; JWT needs none',
  points: [
    'Session-based auth requires server-side storage for every logged-in user, which becomes an architectural problem across multiple server instances unless they share a session store.',
    'Basic Auth sends the real password on every request indefinitely, with no expiration and no way to revoke access short of changing the password.',
    'JWT is stateless (any server can verify a token independently), carries its own expiration (a stolen token eventually becomes useless), and is self-describing (roles are in the payload).',
    'The real tradeoff: because JWT is stateless, a server cannot forcibly invalidate a single token before it expires - there is no session to delete, so "logout" is really just the client discarding the token.',
    'This is why JWT expiration times are kept short, often paired with a separate refresh token mechanism, rather than issuing long-lived access tokens.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming JWT has a server-side "logout" that immediately invalidates a specific token is a common misunderstanding - without additional infrastructure (a token blocklist, very short expiration times), a stolen JWT remains valid and usable until it naturally expires, regardless of the user "logging out" on their own device.' },
    { type: 'interview', content: 'Q: What specific limitation of session-based authentication does JWT solve, and what does JWT give up in exchange?\nA: JWT removes the need for server-side session storage, since every token is self-contained and independently verifiable - this is what makes it scale cleanly across multiple servers or microservices without a shared session store. In exchange, JWT gives up the ability to instantly revoke a single token before its expiration, since there is no server-side session to delete - this is why JWTs are typically short-lived and often paired with a refresh token mechanism.' },
  ],
}
