export default {
  id: 'digital-signature',
  title: '477. Digital Signature',
  explanation: `The previous topic ended by promising that a **digital signature**, not encryption, is what actually protects a JWT from tampering (see [[encryption-and-decryption]]) — this topic explains exactly how that works, since "signature" here means something precise, not just a stamp of approval.

**The problem a signature solves:** a JWT's payload is plainly readable (Base64, not encrypted) — so what stops a client from decoding a token, changing \`"role": "USER"\` to \`"role": "ADMIN"\`, and re-encoding it? Nothing about encoding alone would catch that. A signature is what makes such tampering **detectable** by the server, even though the payload itself was never hidden.

**How signing works, using a secret key (the HMAC approach JWT typically uses):**
\`\`\`
signature = HMAC-SHA256(header + "." + payload, secretKey)
\`\`\`
The server takes the header and payload, runs them through a keyed hash function (HMAC) together with a secret key only the server knows, and the result is the signature — appended as the third part of the token.

**Why tampering with the payload breaks verification, even without touching the signature:** on every request, the server recomputes \`HMAC-SHA256(header + "." + payload, secretKey)\` from the header and payload it actually received, and compares that freshly computed value against the signature that came with the token. If even one character of the payload changed (\`"USER"\` → \`"ADMIN"\`), the recomputed signature comes out completely different — HMAC is designed so that any change to the input, however small, produces a wildly different output. The server rejects the token outright.

**Why the secret key must never leave the server, and what happens if it does.** Anyone who has the secret key can compute a *valid* signature for *any* payload they want — including one claiming to be an admin. This is precisely why the secret key belongs only in server-side configuration (an environment variable, a secrets manager), never in client code, never in a public repository, and never logged.

**The connection back to asymmetric encryption, briefly.** JWT can also be signed with an asymmetric key pair (\`RS256\` instead of \`HS256\`) — the private key signs, and any holder of the public key can verify the signature without being able to forge new ones. This chapter's Job app uses the simpler, symmetric \`HS256\` approach, appropriate for a single server issuing and verifying its own tokens.`,
  code: `// Conceptually, what "signing" and "verifying" actually compute:

// SIGNING (server, at login):
String toSign = header + "." + payload;
String signature = hmacSha256(toSign, secretKey);
String token = header + "." + payload + "." + signature;

// VERIFYING (server, on every later request):
String[] parts = token.split("\\\\.");
String recomputedSignature = hmacSha256(parts[0] + "." + parts[1], secretKey);
boolean valid = recomputedSignature.equals(parts[2]);
// if the payload (parts[1]) was tampered with at all,
// recomputedSignature will not match parts[2] - token rejected`,
  codeTitle: 'Signing at login, and recomputing the signature to verify on every request',
  points: [
    'A JWT payload is readable but a signature makes any tampering with it detectable, even though the payload itself is never hidden.',
    'HMAC-SHA256 combines the header, payload, and a secret key into a signature - any change to the header or payload produces a completely different recomputed signature.',
    'Verification works by recomputing the signature from the received header and payload and comparing it against the signature attached to the token - a mismatch means the token was tampered with or forged.',
    'Anyone holding the secret key can forge a valid signature for any payload they choose - the key must stay server-side only, never in client code, a public repo, or logs.',
    'JWT can also be signed asymmetrically (RS256) - a private key signs and a public key verifies - useful when multiple services need to verify tokens without being able to issue new ones; this chapter uses the simpler symmetric HS256.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A JWT signed with HS256 whose secret key is checked into source control, hardcoded, or otherwise exposed lets anyone forge a token claiming any identity or role - a leaked HS256 secret is a complete authentication bypass, not a minor leak, since it enables both reading and creating valid tokens.' },
    { type: 'interview', content: 'Q: If a JWT payload is just Base64-encoded and readable by anyone, what actually stops a client from modifying it (for example, changing their role to ADMIN) and sending the modified token back?\nA: The signature. The server recomputes the signature from the header and payload it actually receives, using a secret key only the server knows, and compares that against the signature included in the token. Any change to the payload produces a completely different recomputed signature, so a tampered token fails verification and is rejected - the payload does not need to be hidden for tampering to be detectable.' },
  ],
}
