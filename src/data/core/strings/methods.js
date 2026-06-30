export default {
  id: 'string-methods',
  title: '4. Essential String Methods',
  explanation: `String has 60+ methods. These are the ones that appear most in real code and interviews. All return new Strings (immutable).`,
  code: `String s = "  Hello, Java World!  ";

// ── Length & access ──────────────────────────────────────
s.length()                   // 22
s.charAt(2)                  // 'H'
s.indexOf("Java")            // 8
s.lastIndexOf("o")           // 17
s.isEmpty()                  // false (length > 0)
s.isBlank()                  // false (Java 11 — considers whitespace)

// ── Cleaning ─────────────────────────────────────────────
s.trim()                     // "Hello, Java World!"  (remove leading/trailing spaces)
s.strip()                    // "Hello, Java World!"  (Java 11 — Unicode-aware)
s.stripLeading()             // "Hello, Java World!  "
s.stripTrailing()            // "  Hello, Java World!"

// ── Case ─────────────────────────────────────────────────
"hello".toUpperCase()        // "HELLO"
"HELLO".toLowerCase()        // "hello"

// ── Comparison ───────────────────────────────────────────
"hello".equals("HELLO")            // false
"hello".equalsIgnoreCase("HELLO")  // true
"abc".compareTo("abd")             // negative (lexicographic)
"abc".startsWith("ab")             // true
"abc".endsWith("bc")               // true
"abc".contains("bc")               // true

// ── Substring & split ────────────────────────────────────
"Hello World".substring(6)         // "World"
"Hello World".substring(0, 5)      // "Hello"  (end index exclusive)
"a,b,c,d".split(",")               // ["a","b","c","d"]
"a,,b".split(",", -1)              // ["a","","b"]  (-1 keeps trailing empty)

// ── Replace ──────────────────────────────────────────────
"aababab".replace("ab", "X")       // "aXXX" — replaces ALL occurrences
"hello".replaceFirst("[aeiou]", "*") // "h*llo"
"hello".replaceAll("[aeiou]", "*")   // "h*ll*"

// ── Conversion ───────────────────────────────────────────
String.valueOf(42)              // "42"
String.valueOf(3.14)            // "3.14"
"hello".toCharArray()           // ['h','e','l','l','o']
String.join(", ", "a","b","c")  // "a, b, c"
"hello world".repeat(2)         // "hello worldhello world" (Java 11)

// ── Modern Java (11+) ────────────────────────────────────
"  ".isBlank()                  // true
"line1\nline2".lines().count()  // 2 (returns Stream<String>)`,
  points: [
    'substring(start, end) — start is inclusive, end is exclusive. Common off-by-one source!',
    'split() uses regex — split(".") splits on every char (. is regex wildcard). Escape: split("\\\\.")',
    'compareTo() returns 0 if equal, negative if less, positive if greater. Used for sorting.',
    'contains(), startsWith(), endsWith() all delegate to indexOf() internally',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '"abc".substring(1, 3) returns "bc" not "bcd". The end index is EXCLUSIVE. A common mistake is to think length() gives you the last valid index — it doesn\'t. Last valid index is length()-1.',
    },
    {
      type: 'interview',
      content: 'Q: How to reverse a String in Java?\nA: There\'s no built-in reverse() for String. Use: new StringBuilder(str).reverse().toString(). Or convert to char array, swap from both ends, then new String(arr).',
    },
  ],
}
