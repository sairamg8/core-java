export default {
  id: 'what-is-bcrypt',
  title: '468. What Is BCrypt?',
  explanation: `\`BCryptPasswordEncoder\` has been used as a bean throughout this chapter (see [[authenticationprovider]]) without explaining what BCrypt actually does — this topic fills that gap, since understanding *why* it works the way it does explains several behaviors that otherwise look strange (like the same password producing a different stored value every time it's hashed).

**BCrypt is a one-way hashing algorithm, specifically designed for passwords** — not a general-purpose hash like MD5 or SHA-256, and not encryption (which is reversible with a key). "One-way" means there is no operation that takes a BCrypt hash and recovers the original password — verification instead works by hashing the *submitted* password the same way and comparing the two hash outputs (see [[authenticationprovider]]).

**Why BCrypt specifically, rather than a faster hash like SHA-256:** BCrypt is deliberately, tunably **slow** — it has a configurable "cost factor" (commonly 10-12) that determines how many rounds of internal hashing it performs. A fast hash like SHA-256 can be computed billions of times per second on modern hardware, making brute-force password guessing (trying every possible password) practical; BCrypt's deliberate slowness — computing only thousands of hashes per second even on fast hardware — makes brute-forcing computationally impractical at scale, without meaningfully slowing down the one-time cost of hashing a single login attempt.

**Why the same password produces a different-looking hash every time — the role of the salt.** Every BCrypt hash embeds a random **salt** — a random value mixed into the hashing process — directly inside the output string itself:
\`\`\`
$2a$10$N9qo8uLOickgx2ZMRZoMye/IjPeqRoM3wjJXK7A9dqiGLLbYsGXaW
 └┬┘└┬┘└──────────┬───────────┘└───────────────┬────────────┘
version cost         salt (22 chars)              actual hash (31 chars)
\`\`\`
Two users with the identical password \`"password123"\` get two completely different stored hash strings, because each hash uses its own random salt. This defeats **rainbow table attacks** — precomputed tables mapping common passwords to their hash — since a precomputed table for one salt is useless against a hash using a different salt, and every BCrypt hash carries a unique one.

**Why verification still works despite the random salt — the salt isn't secret, it's just unpredictable.** \`passwordEncoder.matches(raw, storedHash)\` reads the salt directly out of the stored hash string itself (it's right there in the output format above), reapplies it to the submitted password, and compares results — the salt only needs to be unique per hash, not hidden from anyone, to defeat rainbow tables.`,
  code: `// The same password, hashed twice, produces two different strings -
// this is expected and correct, not a bug:

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash1 = encoder.encode("password123");
String hash2 = encoder.encode("password123");
// hash1 != hash2 - different random salts

// But both still verify correctly against the original password:
encoder.matches("password123", hash1);   // true
encoder.matches("password123", hash2);   // true

// Anatomy of a BCrypt hash:
// $2a$10$N9qo8uLOickgx2ZMRZoMye/IjPeqRoM3wjJXK7A9dqiGLLbYsGXaW
//  \\_/\\/ \\____________________/\\_______________________/
// vers cost      salt (embedded)         actual hash output`,
  codeTitle: 'BCrypt: same password, different hash each time, salt embedded in the output',
  points: [
    'BCrypt is a one-way hashing algorithm designed specifically for passwords - there is no operation to recover the original password from a hash, unlike encryption which is reversible with a key.',
    'BCrypt is deliberately slow (a tunable cost factor), making large-scale brute-force password guessing computationally impractical, unlike fast general-purpose hashes such as SHA-256.',
    'Every BCrypt hash embeds a random salt directly in its output string, which is why the same password produces a different-looking hash each time it is encoded.',
    'The embedded salt defeats rainbow table attacks (precomputed hash-to-password lookups), since each hash effectively needs its own precomputed table.',
    'Verification works despite the random salt because the salt is stored directly inside the hash string itself, not hidden - matches() extracts it, reapplies it to the submitted password, and compares results.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Comparing two BCrypt hashes of the same password with a simple string equality check (hash1.equals(hash2)) will always return false, even for the correct password - this looks like a bug the first time it is encountered, but it is expected behavior caused by the random salt; always use passwordEncoder.matches(), never direct string comparison.' },
    { type: 'interview', content: 'Q: Why does encoding the same password twice with BCryptPasswordEncoder produce two different hash strings, and does this break password verification?\nA: Each BCrypt hash embeds its own random salt directly in the output, so hashing the same password twice with different salts produces different results - this is intentional and defeats precomputed rainbow table attacks. Verification is not broken because passwordEncoder.matches() reads the salt out of the stored hash itself, reapplies it to the freshly submitted password, and compares the resulting hashes for equality.' },
  ],
}
