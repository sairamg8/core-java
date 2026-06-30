export default {
  id: 'string-immutability',
  title: '1. String Immutability',
  explanation: `**String is immutable** — once created, its value cannot be changed. Every operation that appears to "modify" a String actually creates a NEW String object.

Why immutable?
- **Thread safety** — shared Strings need no synchronization
- **Security** — passwords, file paths, class names cannot be tampered with in transit
- **String Pool** — enables safe sharing/caching of literals
- **Hashing** — hashCode can be cached (computed once, reused as HashMap key)`,
  code: `String s1 = "Hello";
String s2 = s1.concat(" World");   // s1 is UNCHANGED — new object returned

System.out.println(s1);  // "Hello"   — s1 still points to original
System.out.println(s2);  // "Hello World" — new object

// Demonstrating immutability with reference
String original = "Java";
String modified = original.toUpperCase();
System.out.println(original);  // "Java"  — NOT changed
System.out.println(modified);  // "JAVA"

// String concatenation in a loop creates N intermediate objects
String result = "";
for (int i = 0; i < 10000; i++) {
    result += i;   // BAD: creates 10000 intermediate String objects!
}

// Fix: use StringBuilder (discussed in section 3)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result2 = sb.toString();   // single final String

// Java compiler optimizes string literal concatenation at compile time
String greeting = "Hello" + " " + "World"; // compiled to "Hello World" — one object`,
  points: [
    'String class is declared final — no subclassing allowed',
    'The internal char[] (or byte[] in Java 9+ with Compact Strings) is also private final',
    'String hashCode is lazily computed and cached in a private field — safe because value never changes',
    'Java compiler optimizes: s = "a" + "b" + "c" becomes "abc" at compile time (constant folding)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why is String immutable in Java?\nA: Thread safety (no sync needed), security (no tampering with class names, passwords), caching (hashCode computed once), and String Pool (safe sharing of literals).',
    },
    {
      type: 'gotcha',
      content: 'Even though String is immutable, the VARIABLE is not. String s = "Hello"; s = "World"; is fine — you\'re just pointing the variable to a different String object. The old "Hello" object is unchanged and becomes eligible for GC.',
    },
  ],
}
