export default {
  id: 'project-setup-for-jwt',
  title: '480. Project Setup for JWT',
  explanation: `With JWT understood conceptually (see [[what-is-jwt]]), this topic adds the actual dependency and configuration needed to generate and verify tokens in the Job app — the practical starting point for every JWT topic that follows.

**Adding the JWT library — this course uses \`jjwt\`, one of the most widely used Java JWT libraries:**
\`\`\`xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
\`\`\`
Three separate artifacts because \`jjwt\` deliberately splits its public API (\`jjwt-api\`, what application code compiles against) from its implementation (\`jjwt-impl\`) and JSON handling (\`jjwt-jackson\`) — application code should generally only import from \`io.jsonwebtoken\` (the API package), never the implementation classes directly.

**Generating a secret key — never hand-write a "secret" string.**
\`\`\`properties
jwt.secret=U29tZVJhbmRvbUJhc2U2NEVuY29kZWRTZWNyZXRLZXlGb3JIUzI1Ng==
jwt.expiration-ms=3600000
\`\`\`
The secret must be Base64-encoded and long enough for the chosen algorithm — HS256 requires a key of at least 256 bits. Generating one properly (rather than typing a memorable phrase and hoping it's long enough):
\`\`\`java
SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
String base64Secret = Base64.getEncoder().encodeToString(key.getEncoded());
\`\`\`

**Why this secret must live in \`application.properties\` (or better, an environment variable / secrets manager), never hardcoded in a Java class.** A secret compiled directly into source code ends up in version control history forever, readable to anyone with repository access — exactly the leak scenario flagged as catastrophic in the signature topic (see [[digital-signature]]), since anyone with this value can forge tokens for any user or role.

**\`jwt.expiration-ms\`** — the token lifetime in milliseconds (\`3600000\` = 1 hour here). This single property is where the "short-lived token" tradeoff from the previous topic (see [[why-jwt]]) becomes a concrete, tunable number rather than an abstract concern.`,
  code: `<!-- pom.xml -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

// application.properties
// jwt.secret=<a properly generated, Base64-encoded 256-bit+ key>
// jwt.expiration-ms=3600000

// Generating a proper secret once, offline:
SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
String base64Secret = Base64.getEncoder().encodeToString(key.getEncoded());`,
  codeTitle: 'jjwt dependencies and a properly generated, externally configured secret',
  points: [
    'jjwt splits into three artifacts: jjwt-api (what application code compiles against), jjwt-impl and jjwt-jackson (runtime-only implementation details).',
    'The signing secret must be properly generated (at least 256 bits for HS256), Base64-encoded, and stored in application.properties or an environment variable - never hardcoded in a Java class.',
    'A hardcoded secret ends up permanently in version control history, readable to anyone with repository access - exactly the leak scenario that lets an attacker forge tokens for any user or role.',
    'jwt.expiration-ms turns the "keep tokens short-lived" principle from the previous topic into a concrete, tunable configuration value.',
    'Generating the secret via Keys.secretKeyFor(SignatureAlgorithm.HS256) guarantees it meets the algorithm’s minimum key length, rather than relying on a manually typed string that may be too short.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Typing a short, memorable string like "mysecretkey123" as the JWT secret will either fail outright (jjwt validates minimum key length for HS256) or, if it happens to pass, be trivially brute-forceable - always generate the secret programmatically rather than hand-typing one.' },
    { type: 'interview', content: 'Q: Why does jjwt split its dependency into jjwt-api, jjwt-impl, and jjwt-jackson instead of one single artifact, and which one should application code import from?\nA: The split separates the public API contract (jjwt-api) from its implementation details (jjwt-impl) and JSON serialization (jjwt-jackson) - impl and jackson are marked runtime-scope specifically so application code cannot accidentally compile against implementation internals. Application code should only import from the io.jsonwebtoken API package, keeping the implementation swappable without changing calling code.' },
  ],
}
