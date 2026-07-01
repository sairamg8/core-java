export default {
  id: 'what-is-jwt',
  title: '479. What Is JWT?',
  explanation: `With the *why* established (see [[why-jwt]]), this topic defines **JWT (JSON Web Token)** precisely — its structure, encoding, and exactly what each of its three parts contains, since every later topic in this chapter builds directly on this shape.

**A JWT is three Base64URL-encoded segments joined by dots:**
\`\`\`
header.payload.signature

eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsInJvbGVzIjpbIlVTRVIiXX0.4rN1J...
\`\`\`

**Header — identifies the algorithm and token type:**
\`\`\`json
{ "alg": "HS256", "typ": "JWT" }
\`\`\`
This tells a verifier exactly which algorithm to use when recomputing the signature (see [[digital-signature]]) — \`HS256\` here means HMAC-SHA256 with a symmetric secret key.

**Payload — the actual claims (data) about the authenticated user:**
\`\`\`json
{
  "sub": "alice",
  "roles": ["USER"],
  "iat": 1719800000,
  "exp": 1719803600
}
\`\`\`
\`sub\` (subject) identifies who the token is about — typically the username. \`iat\` (issued at) and \`exp\` (expiration) are Unix timestamps controlling the token's validity window (see [[why-jwt]] for why expiration matters). Custom claims like \`roles\` can be added freely — this is exactly what lets a JWT be self-describing.

**Signature — computed over the header and payload, proving they haven't been tampered with** (the full mechanism from [[digital-signature]]), not a separate encoded blob of new information.

**Why "Base64URL," not plain Base64.** Standard Base64 can include \`+\`, \`/\`, and \`=\` characters, which have special meaning in URLs (and can require escaping). Base64URL is a minor variant that replaces those characters (\`+\`→\`-\`, \`/\`→\`_\`, and typically omits \`=\` padding) so a JWT can be safely placed directly into a URL or an HTTP header with no additional encoding needed.

**The one fact worth internalizing before moving forward: decoding is not decrypting.** Pasting any JWT's header or payload segment into a Base64 decoder (no secret key, no tool beyond a text editor, really) reveals the full JSON content instantly — this is expected, by design, and exactly why sensitive data must never go in a JWT payload (see [[encryption-and-decryption]]).`,
  code: `// A real (shortened) JWT, split into its three parts:
// header:    eyJhbGciOiJIUzI1NiJ9
// payload:   eyJzdWIiOiJhbGljZSIsInJvbGVzIjpbIlVTRVIiXX0
// signature: 4rN1J8k2p...

// Decoding just the header (no secret key needed - it's only encoded):
// echo "eyJhbGciOiJIUzI1NiJ9" | base64 -d
// {"alg":"HS256","typ":"JWT"}

// Decoding the payload (same - instantly readable, no key required):
// echo "eyJzdWIiOiJhbGljZSIsInJvbGVzIjpbIlVTRVIiXX0" | base64 -d
// {"sub":"alice","roles":["USER"]}`,
  codeTitle: 'Decoding a JWT header and payload - no secret key required, by design',
  points: [
    'A JWT is header.payload.signature - three Base64URL-encoded segments joined by dots.',
    'The header identifies the signing algorithm (e.g. HS256); the payload holds claims like sub (subject/username), iat (issued at), exp (expiration), and any custom claims like roles.',
    'The signature is computed over the header and payload to detect tampering - it is not a separately encoded blob of extra data.',
    'Base64URL differs from standard Base64 by replacing characters that have special meaning in URLs, so a JWT can be placed directly into a URL or header without extra encoding.',
    'Decoding a JWT header or payload requires no secret key at all - any Base64 decoder reveals the content instantly, which is exactly why sensitive data must never be placed in the payload.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Confusing "the token looks like random characters" with "the token is encrypted and unreadable" is a common misconception - a JWT payload can be decoded by anyone in seconds with no key or special tool, since Base64URL encoding is fully reversible without any secret.' },
    { type: 'interview', content: 'Q: What are the three parts of a JWT, and can any of them be read without a secret key?\nA: A JWT consists of a header, payload, and signature, joined by dots. The header and payload are both just Base64URL-encoded, not encrypted, so both can be decoded and read by anyone without any secret key. Only the signature verification step (recomputing and comparing the signature) requires the secret key - the confidentiality of the data itself is never protected by a JWT, only its integrity.' },
  ],
}
