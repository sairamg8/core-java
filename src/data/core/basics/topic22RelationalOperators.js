export default {
  id: 'relational-operators',
  title: '22. Relational Operators',
  explanation: `Relational operators compare two values and always produce a \`boolean\` result (\`true\` or \`false\`). They are used in conditions for \`if\` statements, loops, and other control structures.

**The six relational operators:**

| Operator | Meaning                | Example    | Result  |
|----------|------------------------|------------|---------|
| \`==\`     | Equal to               | \`5 == 5\`   | \`true\`  |
| \`!=\`     | Not equal to           | \`5 != 3\`   | \`true\`  |
| \`<\`      | Less than              | \`3 < 5\`    | \`true\`  |
| \`>\`      | Greater than           | \`5 > 3\`    | \`true\`  |
| \`<=\`     | Less than or equal to  | \`5 <= 5\`   | \`true\`  |
| \`>=\`     | Greater than or equal to | \`5 >= 6\` | \`false\` |

**Critical: == on primitives vs == on objects**

For **primitives**: \`==\` compares the actual values.
\`\`\`java
int a = 5, b = 5;
a == b  // true — values match
\`\`\`

For **objects**: \`==\` compares **references** (memory addresses), not content.
\`\`\`java
String s1 = new String("hello");
String s2 = new String("hello");
s1 == s2    // FALSE — different objects
s1.equals(s2) // TRUE — same content
\`\`\`

**The equals() method**
All objects inherit \`equals()\` from the \`Object\` class. For \`String\`, \`Integer\`, and most JDK classes, \`equals()\` is overridden to compare content.

**Comparing String content — always use equals():**
\`\`\`java
"hello".equals(s)           // safe
Objects.equals(s1, s2)     // null-safe comparison (Java 7+)
\`\`\`

**String literal vs new String():**
String literals come from the String Pool and may share references, so \`==\` can be \`true\` for literals. But it is never safe to rely on this.`,
  code: `import java.util.Objects;

public class RelationalOperatorsDemo {
    public static void main(String[] args) {

        // ===== Primitives — == compares values =====
        int a = 10, b = 20, c = 10;

        System.out.println("a == c : " + (a == c));   // true
        System.out.println("a == b : " + (a == b));   // false
        System.out.println("a != b : " + (a != b));   // true
        System.out.println("a <  b : " + (a <  b));   // true
        System.out.println("a >  b : " + (a >  b));   // false
        System.out.println("a <= c : " + (a <= c));   // true
        System.out.println("a >= b : " + (a >= b));   // false

        // ===== Objects — == compares REFERENCES =====
        String s1 = new String("hello");
        String s2 = new String("hello");
        String s3 = s1;  // same reference

        System.out.println("\\n--- String comparisons ---");
        System.out.println("s1 == s2        : " + (s1 == s2));         // false (different objects)
        System.out.println("s1 == s3        : " + (s1 == s3));         // true  (same reference)
        System.out.println("s1.equals(s2)   : " + s1.equals(s2));      // true  (same content)

        // String pool — literals MAY share reference
        String lit1 = "hello";
        String lit2 = "hello";
        System.out.println("lit1 == lit2    : " + (lit1 == lit2));     // true (pool optimization)
        System.out.println("lit1.equals(lit2): " + lit1.equals(lit2)); // true

        // ===== Null-safe comparison =====
        String x = null;
        String y = "hello";
        // x.equals(y) would throw NullPointerException!
        System.out.println("Objects.equals(null, y): " + Objects.equals(x, y)); // false (safe)
        System.out.println("Objects.equals(null, null): " + Objects.equals(null, null)); // true

        // ===== equalsIgnoreCase =====
        String upper = "HELLO";
        System.out.println(s1.equalsIgnoreCase(upper));  // true

        // ===== Comparing numbers stored as objects =====
        Integer n1 = 127;
        Integer n2 = 127;
        Integer n3 = 200;
        Integer n4 = 200;
        System.out.println("\\n--- Integer == (cache range) ---");
        System.out.println("127 == 127  : " + (n1 == n2)); // true  (cached -128 to 127)
        System.out.println("200 == 200  : " + (n3 == n4)); // false (outside cache, new objects)
        System.out.println("200.equals(200): " + n3.equals(n4)); // true (always use equals!)
    }
}`,
  codeTitle: '== on Primitives vs Objects, equals(), Null-Safe',
  points: [
    '== on objects compares memory addresses (references), not content. This is the most common source of bugs for beginners. Always use .equals() to compare String, Integer, and other object contents.',
    'equalsIgnoreCase() compares Strings ignoring uppercase/lowercase. "HELLO".equalsIgnoreCase("hello") is true. Use it for user input comparison.',
    'The Integer cache: Java caches Integer objects for values -128 to 127. Integer a = 100; Integer b = 100; — a == b is true because both point to the cached object. Integer a = 200; Integer b = 200; — a == b is false because 200 is outside the cache. This is a classic interview trap — always use .equals() for Integer comparison.',
    'Objects.equals(a, b) from java.util.Objects handles null safely: if both are null returns true, if one is null returns false, otherwise calls a.equals(b). Prefer this over manual null checks.',
    'compareTo() returns an int: negative if less, zero if equal, positive if greater. Use it for sorting: String.compareTo(), Integer.compareTo().',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'if (name == "Alice") — this compares reference addresses, not content. It may return true when "Alice" comes from the String pool (literal), but will return false when it comes from user input (new String). Always use if ("Alice".equals(name)) — put the known string literal first to avoid NullPointerException if name is null.',
    },
    {
      type: 'interview',
      content: 'Q: Why does Integer cache values from -128 to 127?\nA: The Java spec mandates caching Integer objects for values in [-128, 127] for performance (these small numbers are used very frequently). For values outside this range, each autoboxed Integer is a new heap object. This means == between two Integer variables can return different results depending on the value — always use .equals() for Integer (and all object) comparisons.',
    },
    {
      type: 'tip',
      content: 'Put the non-null value first in equals(): "expected".equals(userInput) instead of userInput.equals("expected"). If userInput is null, the first form returns false safely. The second form throws NullPointerException.',
    },
  ],
}
