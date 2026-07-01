export default {
  id: 'encryption-and-decryption',
  title: '476. Encryption and Decryption',
  explanation: `Everything built so far in this chapter authenticates via a session cookie (see [[session-id]]) — this topic starts a new direction, stateless token-based authentication, and it begins with a distinction that gets confused constantly: **encryption** vs. **hashing**, since JWT (the destination of the next several topics) uses neither in the way most people assume.

**Hashing (already used for passwords, see [[what-is-bcrypt]]) is one-way — there is no decryption step, ever.** BCrypt cannot be "decrypted" back into the original password under any circumstances; verification works by re-hashing and comparing.

**Encryption is different: it's deliberately two-way, using a key.**
- **Symmetric encryption** — the same key both encrypts and decrypts. Fast, but the key must somehow be shared secretly between both parties ahead of time. \`AES\` is the standard modern symmetric algorithm.
- **Asymmetric encryption** — a *pair* of mathematically related keys: a **public key** (safe to share with anyone) encrypts, and only the matching **private key** (kept secret) can decrypt. \`RSA\` is a common asymmetric algorithm. This is also the basis of HTTPS/TLS — a server's public key is what a browser uses to establish a secure connection without ever transmitting a shared secret in the clear.

**A minimal symmetric example, to make "two-way" concrete:**
\`\`\`java
SecretKey key = KeyGenerator.getInstance("AES").generateKey();
Cipher cipher = Cipher.getInstance("AES");
cipher.init(Cipher.ENCRYPT_MODE, key);
byte[] encrypted = cipher.doFinal("hello".getBytes());

cipher.init(Cipher.DECRYPT_MODE, key);
byte[] decrypted = cipher.doFinal(encrypted);
new String(decrypted);   // "hello" - fully recovered, unlike a BCrypt hash
\`\`\`

**Why this distinction matters specifically for what's coming next in this chapter.** JWT's payload (the actual data — username, roles) is only **Base64-encoded**, not encrypted at all — anyone holding a token can decode and read its contents trivially, the same way Basic Auth headers can be decoded (see [[basic-auth-using-postman]]). What actually protects a JWT from tampering is neither encryption nor encoding — it's a **digital signature** (see [[digital-signature]], next), built using exactly the asymmetric- or symmetric-key concepts introduced here. Understanding encryption first is what makes "JWT isn't encrypted, but it's still safe from tampering" make sense rather than sound contradictory.`,
  code: `// Symmetric encryption - same key encrypts and decrypts
SecretKey key = KeyGenerator.getInstance("AES").generateKey();

Cipher cipher = Cipher.getInstance("AES");
cipher.init(Cipher.ENCRYPT_MODE, key);
byte[] encrypted = cipher.doFinal("hello".getBytes());

cipher.init(Cipher.DECRYPT_MODE, key);
byte[] decrypted = cipher.doFinal(encrypted);
System.out.println(new String(decrypted));   // "hello" - fully recovered`,
  codeTitle: 'Symmetric encryption: the same key both encrypts and decrypts',
  points: [
    'Hashing (used for passwords) is strictly one-way - there is no decryption operation at all, ever.',
    'Encryption is deliberately two-way and always involves a key - symmetric encryption uses one shared key for both directions, asymmetric uses a public/private key pair.',
    'Asymmetric encryption lets anyone encrypt with a public key, while only the private key holder can decrypt - this is the basis of HTTPS/TLS.',
    'A JWT payload is only Base64-encoded, not encrypted at all - anyone holding the token can read its contents, the same way a Basic Auth header can be decoded.',
    'What protects a JWT from tampering is a digital signature, not encryption or encoding - understanding encryption first is what makes that distinction make sense rather than sound like a contradiction.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming a JWT is "encrypted" and therefore safe to store sensitive data in its payload is a serious and common misunderstanding - the payload is only Base64-encoded, fully readable by anyone who intercepts the token, regardless of how the token is signed.' },
    { type: 'interview', content: 'Q: What is the fundamental difference between hashing and encryption, and why does that distinction matter for understanding JWT?\nA: Hashing (like BCrypt) is one-way - there is no way to recover the original input from a hash. Encryption is deliberately two-way, using a key to both encrypt and decrypt. JWT payloads are neither hashed nor encrypted - they are only Base64-encoded, which is trivially reversible - so the security JWT provides comes entirely from a separate digital signature, not from the payload being unreadable.' },
  ],
}
