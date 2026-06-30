export default {
  id: 'static-method',
  title: '55. Static Method',
  explanation: `A **static method** belongs to the class rather than to any instance. You can call it without creating an object.

**Syntax:**
\`\`\`java
static returnType methodName(params) { ... }
ClassName.methodName(args); // call via class name
\`\`\`

**Rules for static methods:**
- Can access **only static fields and other static methods** directly
- Cannot use \`this\` or \`super\` (no implicit object)
- Cannot be overridden (only hidden — different from overriding)
- Can be called via a class name or an instance reference (latter is poor style)

**When to use static methods:**
- **Utility/helper:** \`Math.sqrt()\`, \`Collections.sort()\`, \`Arrays.fill()\`
- **Factory methods:** \`Integer.valueOf()\`, \`List.of()\`
- **Main entry point:** \`public static void main(String[] args)\`
- **Pure functions** that depend only on their input (no object state needed)

**Static vs instance method:**
| | Static | Instance |
|--|--------|----------|
| Belongs to | Class | Object |
| Access \`this\` | No | Yes |
| Can access instance fields | No | Yes |
| Called via | ClassName or instance | Only instance |
| Overridable | No (hidden) | Yes |

**Static imports:**
\`\`\`java
import static java.lang.Math.sqrt;
sqrt(16); // instead of Math.sqrt(16)
\`\`\``,
  code: `public class StaticMethod {
    public static void main(String[] args) {
        // Call utility static methods directly via class name
        System.out.println(MathUtils.square(5));        // 25
        System.out.println(MathUtils.isPrime(17));      // true
        System.out.println(MathUtils.factorial(6));     // 720

        // No need to create a MathUtils object — none needed
        // MathUtils m = new MathUtils(); m.square(5); // works but bad style

        // Static method in the same class
        int[] arr = {5, 1, 3, 2, 4};
        bubbleSort(arr);
        for (int x : arr) System.out.print(x + " "); // 1 2 3 4 5
        System.out.println();

        // Cannot call instance method from static context without an object:
        // instance variable or method require an object reference
    }

    // Static in same class: accessed directly without ClassName.
    static void bubbleSort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j+1]) {
                    int tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp;
                }
            }
        }
    }
}

class MathUtils {
    // Utility class: all static, no state
    static int square(int n)   { return n * n; }
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
    private MathUtils() {} // prevent instantiation of utility class
}`,
  codeTitle: 'Static Methods — Utility Class and Main Pattern',
  points: [
    'Static methods belong to the class — no object needed to call them; use ClassName.method()',
    'Cannot access instance fields or call instance methods directly inside a static method',
    'Main method (public static void main) is static so the JVM can call it without creating an instance of your class',
    'Utility classes (Math, Arrays, Collections) use only static methods — they are not meant to be instantiated',
    'Private constructor + all-static methods is the standard pattern for utility classes to prevent accidental instantiation',
    'Static methods can be overloaded but not overridden — a static method in a subclass hides (not overrides) the parent\'s version',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '"non-static method cannot be referenced from a static context" — this compile error means you tried to call an instance method or access an instance field directly from a static method. You need an object reference first.',
    },
    {
      type: 'tip',
      content: 'Use static factory methods (e.g., Person.of("Alice", 30)) instead of constructors when the creation logic is complex, when you want named construction (which constructor does what), or when you might return a cached instance.',
    },
    {
      type: 'interview',
      content: 'Q: Can a static method be overridden?\nA: No — static methods cannot be overridden, only hidden. If a subclass defines a static method with the same signature, it hides the parent method; the choice is made at compile time based on the reference type, not at runtime (no polymorphism).',
    },
  ],
}
