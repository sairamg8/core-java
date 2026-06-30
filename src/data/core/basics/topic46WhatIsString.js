export default {
  id: 'what-is-a-string',
  title: '46. What Is a String?',
  explanation: `A **String** in Java is an object of the \`java.lang.String\` class that represents a sequence of characters. Unlike most languages, Java Strings are **immutable** — once created, the character sequence cannot be changed.

**Creating Strings:**
\`\`\`java
String s1 = "Hello";           // string literal → uses String Pool
String s2 = new String("Hello"); // always creates a new heap object
\`\`\`

**The String Pool:**
Java maintains a pool of unique string literals on the heap (the String Pool / String Intern Pool). When you write \`"Hello"\`, Java checks the pool first:
- If \`"Hello"\` already exists in the pool → return that reference
- If not → create it in the pool and return the reference

This is why \`s1 == s1copy\` is \`true\` for two literals, but \`s1 == new String("Hello")\` is \`false\` (the \`new\` always creates a new heap object outside the pool).

**Key String methods:**
| Method | Purpose |
|--------|---------|
| \`length()\` | number of characters |
| \`charAt(i)\` | character at index i |
| \`substring(s, e)\` | slice from s (inclusive) to e (exclusive) |
| \`toUpperCase()\` / \`toLowerCase()\` | case conversion |
| \`contains("x")\` | substring check |
| \`equals("x")\` | value equality (use this, not ==) |
| \`split(",")\` | split by delimiter → String[] |
| \`trim()\` | remove leading/trailing whitespace |`,
  code: `public class WhatIsString {
    public static void main(String[] args) {
        // Literal vs new
        String a = "Java";
        String b = "Java";
        String c = new String("Java");

        System.out.println(a == b);       // true  (same pool object)
        System.out.println(a == c);       // false (c is a new heap object)
        System.out.println(a.equals(c));  // true  (same characters)

        // Basic methods
        String s = "  Hello, World!  ";
        System.out.println(s.length());            // 18
        System.out.println(s.trim());              // "Hello, World!"
        System.out.println(s.trim().toUpperCase()); // "HELLO, WORLD!"
        System.out.println(s.trim().charAt(0));    // H
        System.out.println(s.trim().substring(7)); // "World!"
        System.out.println(s.contains("World"));   // true
        System.out.println(s.trim().replace("World", "Java")); // Hello, Java!

        // Split
        String csv = "Alice,Bob,Carol";
        String[] parts = csv.split(",");
        for (String p : parts) System.out.println(p);

        // Concatenation creates a NEW String object
        String x = "Hello";
        x = x + " World"; // 'x' now points to a new String; "Hello" still exists
        System.out.println(x);
    }
}`,
  codeTitle: 'String Basics — Literal, Pool, and Core Methods',
  points: [
    'String is an immutable class in java.lang — every "modification" creates a new String object',
    'String literals are interned in the String Pool; new String("...") creates a separate heap object outside the pool',
    'Always use equals() (or equalsIgnoreCase()) to compare String values — == compares references, not content',
    'String concatenation with + is convenient but creates a new object each time — use StringBuilder for loops',
    'charAt(i), substring(), indexOf(), replace(), split() are the most commonly tested String methods',
    'Strings can be used in switch expressions (Java 7+) and pattern matching (Java 21+)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never use == to compare String values. It compares memory addresses, not characters. "hello" == new String("hello") is false even though they contain the same text. Always use .equals().',
    },
    {
      type: 'tip',
      content: 'String concatenation in a loop (s = s + item) creates a new String object every iteration — O(n²) total work. Use StringBuilder.append() inside loops for O(n) performance.',
    },
    {
      type: 'interview',
      content: 'Q: Why are Strings immutable in Java?\nA: For security (hash codes, network parameters), thread-safety (shared without synchronization), and String Pool efficiency (literals can be safely shared). Immutability is a deliberate design decision.',
    },
  ],
}
