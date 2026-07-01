export default {
  id: 'implementing-oauth2',
  title: '488. Implementing OAuth2',
  explanation: `Every authentication mechanism built so far — form login (see [[default-login-form]]), Basic Auth, JWT (see [[jwt-summary]]) — assumes the Job app itself owns and checks a password. **OAuth2** replaces that assumption entirely: instead of the app verifying a password, an external **Authorization Server** (Google, GitHub) does the verifying, and the app only needs to trust the result.

**Why an application would want this, beyond "it's convenient."** Users get to skip creating (and remembering) yet another password specifically for the Job app — they log in with an account they already have and already trust. The Job app, in turn, never sees or stores that password at all, which removes an entire category of risk (a breach of the Job app's database can't leak Google or GitHub passwords, because the app never had them).

**The four roles in OAuth2, mapped onto the Job app concretely:**
- **Resource Owner** — the actual user, deciding whether to grant the Job app access to their Google/GitHub identity
- **Client** — the Job app itself, requesting access
- **Authorization Server** — Google or GitHub, which authenticates the user and issues tokens
- **Resource Server** — the API that holds the actual protected data being requested (here, just the user's basic profile — name, email — from Google/GitHub's own API)

**The Authorization Code flow, at a glance (the flow this course uses, appropriate for a server-rendered or server-backed web app):**
1. User clicks "Login with Google" on the Job app
2. Job app redirects the browser to Google's authorization endpoint
3. User logs in (at Google, not the Job app) and approves the requested permissions
4. Google redirects back to the Job app with a short-lived **authorization code**
5. The Job app's *server* exchanges that code for an access token — a direct server-to-server call, so the code (and the resulting token) never passes through the user's browser as a URL parameter that could leak via browser history or referrer headers
6. The Job app uses the access token to fetch the user's basic profile from Google

**The dependency that makes this "trivial" to wire up in Spring Boot, exactly as the chapter overview promises:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
\`\`\`
Spring Boot auto-configures the entire redirect/callback/token-exchange dance described in steps 2–6 above — the next two topics configure the two concrete providers (Google, then GitHub) this dependency supports out of the box.`,
  code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

// The Authorization Code flow, conceptually:
// 1. User clicks "Login with Google"
// 2. Job app redirects browser -> Google's authorization endpoint
// 3. User logs in + approves at Google (not on the Job app at all)
// 4. Google redirects back with a short-lived authorization code
// 5. Job app SERVER exchanges the code for an access token (server-to-server)
// 6. Job app uses the access token to fetch the user's Google profile`,
  codeTitle: 'Adding OAuth2 client support and the Authorization Code flow it automates',
  points: [
    'OAuth2 shifts password verification entirely to an external Authorization Server (Google, GitHub) - the Job app never sees or stores the actual password of the user.',
    'The four OAuth2 roles map to: Resource Owner (the user), Client (the Job app), Authorization Server (Google/GitHub), and Resource Server (the API holding the profile data of that user).',
    'The Authorization Code flow exchanges a short-lived code for an access token via a direct server-to-server call, so the sensitive token never passes through the browser as a URL parameter.',
    'spring-boot-starter-oauth2-client auto-configures the entire redirect, callback, and token-exchange sequence - only provider-specific configuration (covered in the next two topics) is needed.',
    'This removes a whole category of risk from the Job app: a database breach can no longer leak Google or GitHub passwords, since the app never had them to begin with.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Confusing OAuth2 with a password-replacement scheme the Job app still manages is a common misunderstanding - OAuth2 hands identity verification entirely to the external provider; the Job app has no password of its own to check, reset, or store for an OAuth2-only account, and building a "forgot password" flow for such an account would be meaningless.' },
    { type: 'interview', content: 'Q: In the OAuth2 Authorization Code flow, why is the authorization code exchanged for an access token via a server-to-server call, rather than the browser exchanging it directly?\nA: A direct server-to-server exchange keeps the resulting access token, and the exchange itself, out of the browser entirely - avoiding exposure through browser history, URL logs, or referrer headers. It also allows the exchange to include the client secret safely, since that secret is never sent to or exposed in the browser, only used in the trusted server-to-server request.' },
  ],
}
