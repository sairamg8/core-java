export default {
  id: 'final-keyword',
  title: '69. final Keyword',
  explanation: `The \`final\` keyword in Java prevents modification. Its meaning depends on what it is applied to.

**final variable:**
Once assigned, cannot be reassigned. Must be assigned exactly once.
\`\`\`java
final int MAX = 100;
MAX = 200; // COMPILE ERROR
\`\`\`
- Local final variables can be assigned once (declaration or later, but only once)
- Final instance fields must be assigned in the declaration or in every constructor
- \`static final\` = constant (e.g., \`Math.PI\`)

**final method:**
Cannot be overridden by subclasses.
\`\`\`java
class Animal { final void breathe() { ... } }
class Dog extends Animal {
    @Override void breathe() { ... } // COMPILE ERROR
}
\`\`\`
Use when the method encodes a fixed algorithm that subclasses must not change (Template Method with fixed steps).

**final class:**
Cannot be extended (subclassed).
\`\`\`java
final class ImmutablePoint { int x, y; }
class SpecialPoint extends ImmutablePoint { } // COMPILE ERROR
\`\`\`
Examples: \`String\`, \`Integer\`, all wrapper classes, \`Math\`.

**final parameter:**
The method parameter cannot be reassigned inside the method body:
\`\`\`java
void process(final int n) { n = 5; } // COMPILE ERROR
\`\`\`

**Why make a class final?**
- Security: prevent untrusted subclasses from overriding security-sensitive methods
- Immutability: ensure the class cannot be extended to break immutability (String)
- Performance: JVM can inline final methods (devirtualize)`,
  code: `public class FinalKeyword {
    // Static final constant
    static final double TAX_RATE = 0.18;
    static final String APP_NAME = "JavaBible";

    // Final instance field (set in constructor, never changed)
    final int id;
    String name;

    FinalKeyword(int id, String name) {
        this.id = id;       // assigned exactly once — OK
        this.name = name;
    }

    // Final method: cannot be overridden
    final void displayId() {
        System.out.println("ID: " + id);
    }

    public static void main(String[] args) {
        FinalKeyword obj = new FinalKeyword(42, "Test");
        // obj.id = 99; // COMPILE ERROR: id is final

        System.out.println(TAX_RATE); // 0.18
        // TAX_RATE = 0.20; // COMPILE ERROR: static final constant

        // Local final variable
        final int MAX = 100;
        // MAX = 200; // COMPILE ERROR

        // Final in for-each: good practice for loop variables
        for (final int n : new int[]{1, 2, 3}) {
            System.out.print(n + " ");
        }

        // Blank final field (assigned later in constructor — valid)
        ImmutableBox box = new ImmutableBox(10, 20);
        System.out.println(box);
    }
}

final class ImmutableBox { // cannot be subclassed
    final int width, height;
    ImmutableBox(int w, int h) { width = w; height = h; }
    @Override public String toString() { return "Box[" + width + "x" + height + "]"; }
}`,
  codeTitle: 'final Variable, Method, and Class',
  points: [
    'final variable: assigned once, never reassigned — use for constants (static final), immutable fields, and defensive local variables',
    'final method: prevents subclasses from overriding — use when you want to lock in an algorithm',
    'final class: prevents subclassing entirely — used in String, Integer, and all wrapper types for security and immutability',
    'static final fields are constants — the convention is ALL_CAPS_SNAKE_CASE naming',
    'final does NOT make an object immutable — only the reference. The object itself can still be mutated: final List<String> list = new ArrayList<>(); list.add("ok");',
    'Blank final: a final field not initialized in the declaration must be assigned in every constructor path',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'final on an object reference means the reference cannot be reassigned — not that the object is immutable. final List<String> list = new ArrayList<>(); list.add("hello") is perfectly legal. To make the contents immutable use Collections.unmodifiableList() or List.of().',
    },
    {
      type: 'tip',
      content: 'Use final liberally for local variables you do not intend to reassign — it signals intent to readers and prevents accidental reassignment bugs. Some teams require all non-reassigned locals to be final.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between final, finally, and finalize?\nA: final = keyword to prevent modification (variable/method/class). finally = block in try-catch that always runs. finalize() = deprecated Object method called by GC before collection. Three unrelated things with similar names.',
    },
  ],
}
