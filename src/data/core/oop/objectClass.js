export default {
  id: 'object-class',
  title: 'The Object Class — equals, hashCode & toString',
  explanation: `Every class in Java implicitly extends \`java.lang.Object\`. This means every object inherits a set of methods that you should understand and, in many cases, override.

**The three most important Object methods:**

**\`toString()\`**
Returns a string representation of the object. Default: \`ClassName@hexHashCode\` (useless). Override it to make printing useful.

**\`equals(Object o)\`**
Tests logical equality (same content). Default: reference equality (same as \`==\`). Override it when two distinct objects with the same content should be considered equal.

**\`hashCode()\`**
Returns an integer used by \`HashMap\`, \`HashSet\`, etc. to bucket objects. **The contract:** if \`a.equals(b)\` is true, then \`a.hashCode() == b.hashCode()\` must also be true. If you override equals, you MUST override hashCode too.

**Other key Object methods:**
- \`getClass()\` — returns the runtime \`Class\` object
- \`clone()\` — creates a shallow copy (implement \`Cloneable\` first)
- \`finalize()\` — called before GC (deprecated, avoid)`,
  code: `import java.util.Objects;

public class Point {
    private int x;
    private int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Override toString — called automatically by println / string concat
    @Override
    public String toString() {
        return "Point(" + x + ", " + y + ")";
    }

    // Override equals — two Points are equal if x and y match
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;           // same reference → equal
        if (!(o instanceof Point)) return false; // null-safe type check
        Point other = (Point) o;
        return this.x == other.x && this.y == other.y;
    }

    // Override hashCode — MUST be consistent with equals
    @Override
    public int hashCode() {
        return Objects.hash(x, y);  // combines fields into a good hash
    }
}

// --- demo ---
Point p1 = new Point(3, 4);
Point p2 = new Point(3, 4);

System.out.println(p1);              // Point(3, 4)  ← toString
System.out.println(p1.equals(p2));   // true         ← equals
System.out.println(p1 == p2);        // false        ← different references

// HashSet uses hashCode + equals together
Set<Point> set = new HashSet<>();
set.add(p1);
System.out.println(set.contains(p2)); // true — because equals AND hashCode match`,
  points: [
    'Every class extends Object, so every object has equals(), hashCode(), toString(), getClass()',
    'Default equals() uses reference equality (same as ==) — override for value equality',
    'The equals-hashCode contract: equal objects must have equal hash codes',
    'Breaking the contract causes HashSet/HashMap to silently lose or mis-find objects',
    'Use Objects.hash(field1, field2, ...) from java.util — it handles null safely',
    'Java records (Java 16+) auto-generate correct equals, hashCode, and toString',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What happens if you override equals() but NOT hashCode()?\nA: HashMap and HashSet will malfunction. Two equal objects may end up in different buckets, so contains() returns false even when the object is in the set. This is one of the most common subtle bugs in Java and a top interview question.',
    },
    {
      type: 'gotcha',
      content: 'String already overrides equals() and hashCode(), so "hello".equals("hello") is true. But new String("hello") == new String("hello") is false — they are different objects. Always use equals() for String comparison, never ==.',
    },
    {
      type: 'tip',
      content: 'The Objects utility class (java.util.Objects) has null-safe helpers: Objects.equals(a, b) returns false instead of throwing NullPointerException when a is null. Use it in your equals() override on field comparisons.',
    },
  ],
}
