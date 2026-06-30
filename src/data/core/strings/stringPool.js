export default {
  id: 'string-pool',
  title: '2. String Pool & == vs .equals()',
  explanation: `The **String Pool** (interned string pool) is a special memory area in the heap (moved from PermGen to Heap in Java 7) where string LITERALS are stored and reused.

When you write \`"hello"\`, Java checks if "hello" already exists in the pool. If yes, it reuses that object. If no, it creates a new one in the pool.

\`new String("hello")\` ALWAYS creates a new object in the heap, bypassing the pool.

**== vs .equals():**
- \`==\` compares references (memory address)
- \`.equals()\` compares content (value)`,
  code: `// String literals go to pool — same literal = same object
String a = "hello";
String b = "hello";
System.out.println(a == b);       // true  — same pooled object!
System.out.println(a.equals(b));  // true  — same content

// new String bypasses pool — always a new heap object
String c = new String("hello");
String d = new String("hello");
System.out.println(c == d);       // false — different objects
System.out.println(c.equals(d));  // true  — same content

System.out.println(a == c);       // false — pool vs heap
System.out.println(a.equals(c));  // true  — same content

// intern() — puts a string into the pool (or returns existing pool string)
String e = c.intern();
System.out.println(a == e);       // true  — e now points to pool object

// Concatenation at runtime — creates new heap object (NOT in pool)
String name = "hel" + "lo";         // compile-time constant → goes to pool
String x = "hel";
String y = x + "lo";                // runtime concat → heap (NOT pool)
System.out.println("hello" == y);  // false!

// Safe pattern — ALWAYS use equals() for String comparison
if ("hello".equals(userInput)) { }   // NPE-safe: literal on left
if (userInput != null && userInput.equals("hello")) { } // alternative`,
  points: [
    'String Pool is also called "interned string pool" or "string literal pool"',
    'String.intern() can cause memory leaks if used with many unique strings — pool never GC\'s them',
    'Java 7+ moved the pool to the heap so it can be GC\'d — previously it was in PermGen (never GC\'d)',
    '"hello".equals(var) is safer than var.equals("hello") — avoids NPE if var is null',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Runtime string concatenation (variables + variables) creates a new heap object NOT in the pool. Only compile-time constant expressions (literals + literals) result in pool strings. This is why "hel" + "lo" == "hello" is true but (var + "lo") == "hello" is false.',
    },
    {
      type: 'interview',
      content: 'Q: How many String objects does `String s = new String("abc")` create?\nA: Up to 2. One in the String Pool (if "abc" doesn\'t already exist there), and one new object on the heap. If "abc" is already in the pool, only 1 new heap object is created.',
    },
  ],
}
