export default {
  id: 'mutable-vs-immutable-strings',
  title: '47. Mutable vs. Immutable Strings',
  explanation: `**Immutable strings (String):**
Once a \`String\` object is created, its character array cannot be changed. Methods like \`replace()\`, \`toUpperCase()\`, and \`+\` always return a **new** String object — the original is untouched.

\`\`\`java
String s = "hello";
s.toUpperCase(); // returns "HELLO" but s is still "hello"
s = s.toUpperCase(); // now s points to the new "HELLO" object
\`\`\`

**Why immutability matters:**
- Thread-safe by default (no synchronization needed)
- Can be shared in the String Pool
- HashCode can be cached (Strings are frequent HashMap keys)

**Mutable alternatives:**

**StringBuilder** (not thread-safe, faster in single-threaded code):
\`\`\`java
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(", ").append("World");
String result = sb.toString(); // convert back to String
\`\`\`

**StringBuffer** (thread-safe, synchronized methods, slightly slower):
\`\`\`java
StringBuffer sb = new StringBuffer("Hello");
sb.append(" World");
\`\`\`

**When to use which:**
| Class | Mutable | Thread-safe | Use case |
|-------|---------|------------|---------|
| String | No | Yes | Fixed text, keys, constants |
| StringBuilder | Yes | No | Single-threaded string building |
| StringBuffer | Yes | Yes | Multi-threaded string building |

**Performance:**
String concatenation in a loop: O(n²) — each iteration copies all previous characters.
StringBuilder in a loop: O(n) — amortized constant-time append.`,
  code: `public class MutableVsImmutable {
    public static void main(String[] args) {
        // String is immutable — methods return new objects
        String s = "hello";
        s.toUpperCase();           // result discarded; s unchanged
        System.out.println(s);    // hello (still lowercase!)
        String upper = s.toUpperCase();
        System.out.println(upper); // HELLO (new object)

        // Performance comparison: String concatenation in loop (bad)
        long t1 = System.currentTimeMillis();
        String result = "";
        for (int i = 0; i < 10_000; i++) result += i; // O(n²)
        System.out.println("String concat: " + (System.currentTimeMillis() - t1) + "ms");

        // StringBuilder (good — single thread)
        long t2 = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10_000; i++) sb.append(i);
        String sbResult = sb.toString();                // O(n)
        System.out.println("StringBuilder: " + (System.currentTimeMillis() - t2) + "ms");

        // Method chaining with StringBuilder
        String chain = new StringBuilder()
            .append("Java")
            .append(" ")
            .append("Bible")
            .insert(0, "The ")
            .reverse()
            .toString();
        System.out.println(chain);

        // StringBuffer: same API, thread-safe
        StringBuffer buf = new StringBuffer("Hello");
        buf.append(" World");
        System.out.println(buf); // Hello World
    }
}`,
  codeTitle: 'String vs StringBuilder vs StringBuffer',
  points: [
    'String methods never modify the original — they always return a new String; assign the result back if you want to "change" the variable',
    'StringBuilder is the go-to for building strings in loops or when many modifications are needed in single-threaded code',
    'StringBuffer has the same API as StringBuilder but every method is synchronized — use only when multiple threads share the buffer',
    'In modern single-threaded code, always prefer StringBuilder over StringBuffer — StringBuffer\'s synchronization is a performance cost with no benefit',
    'String concatenation in a loop creates O(n) intermediate objects and copies O(n²) characters total — a classic performance pitfall',
    'The Java compiler automatically converts simple string concatenation (outside loops) to StringBuilder.append() calls as an optimization',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'str.toUpperCase() does not modify str — it returns a new String. Always capture the return value: str = str.toUpperCase(). This is the most common String beginner mistake.',
    },
    {
      type: 'tip',
      content: 'StringBuilder supports method chaining: sb.append("a").append("b").delete(0,1). Chaining works because each method returns the same StringBuilder instance.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between String, StringBuilder, and StringBuffer?\nA: String is immutable. StringBuilder is mutable and not thread-safe (prefer in single-threaded code). StringBuffer is mutable and thread-safe (synchronized) but slower. All three represent character sequences, but only String is hashable as a map key.',
    },
  ],
}
