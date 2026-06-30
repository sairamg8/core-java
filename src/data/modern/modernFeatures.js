export default {
  id: 'modern-java-features',
  title: '1. Java 9–21 Feature Highlights',
  explanation: `Java releases every 6 months since Java 9. These are the most impactful additions:

**Java 9:** Modules, collection factory methods (\`List.of\`, \`Map.of\`)
**Java 10:** \`var\` — local variable type inference
**Java 11:** \`String\` additions (\`isBlank\`, \`strip\`, \`lines\`, \`repeat\`)
**Java 14:** Switch expressions (standard), helpful NullPointerExceptions
**Java 15:** Text blocks (standard)
**Java 16:** Records (standard), pattern matching for \`instanceof\`
**Java 17:** Sealed classes (LTS)
**Java 21:** Virtual threads (LTS), pattern matching in switch (standard)`,
  code: `// ── var — local type inference (Java 10) ────────────────────────────────
var name = "Alice";                     // inferred: String
var list = new java.util.ArrayList<String>(); // inferred: ArrayList<String>
// var x;                 ← must have initializer
// var names = null;      ← can't infer from null
// Rules: only for local variables, not fields, method params, or return types

// ── Text Blocks (Java 15) ────────────────────────────────────────────────
String json = """
        {
          "name": "Alice",
          "age": 30
        }
        """;  // leading whitespace stripped to the minimum indentation level

String html = """
        <html>
          <body>Hello</body>
        </html>""";
// Closing """ position controls stripping — tab/space consistent

// ── Records (Java 16) ────────────────────────────────────────────────────
// Immutable data carriers — auto-generates constructor, getters, equals, hashCode, toString
record Point(int x, int y) {
    // Compact constructor — validate or normalize
    Point {
        if (x < 0 || y < 0) throw new IllegalArgumentException("Negative coord");
    }

    // Custom methods allowed
    double distance() {
        return Math.sqrt(x * x + y * y);
    }
}

Point p = new Point(3, 4);
p.x();           // 3   (accessor, NOT getX())
p.y();           // 4
p.distance();    // 5.0
// p.x = 5;     ← compile error — records are immutable

// ── Pattern Matching instanceof (Java 16) ────────────────────────────────
Object obj = "Hello World";

// OLD
if (obj instanceof String) {
    String s = (String) obj;     // explicit cast
    System.out.println(s.length());
}

// NEW
if (obj instanceof String s) {   // bind pattern variable s
    System.out.println(s.length());  // s is in scope
}
if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}

// ── Sealed Classes (Java 17) ─────────────────────────────────────────────
// Restrict which classes can extend/implement
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius)           implements Shape {}
record Rectangle(double w, double h)  implements Shape {}
record Triangle(double base, double h) implements Shape {}
// Any other subclass → compile error

// ── Switch Expressions (Java 14) ─────────────────────────────────────────
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Other";
};
// Arrow form — no fall-through, each arm is an expression

// ── Pattern Matching in Switch (Java 21) ─────────────────────────────────
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.w() * r.h();
        case Triangle t  -> 0.5 * t.base() * t.h();
    };  // compiler knows all cases covered (sealed!) — no default needed
}

// ── Virtual Threads (Java 21) ────────────────────────────────────────────
// Lightweight threads managed by JVM — millions can exist simultaneously
Thread vt = Thread.ofVirtual().start(() -> {
    System.out.println("Virtual thread: " + Thread.currentThread().isVirtual());
});
// Use with Executors.newVirtualThreadPerTaskExecutor() for high-throughput servers
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        executor.submit(() -> { Thread.sleep(100); return null; });
    }
}  // handles 10,000 tasks without 10,000 OS threads

double area(Object shape) { return 0; }`,
  points: [
    '`var` improves readability for complex generic types but hurts it for simple ones — only use where the type is obvious from context',
    'Records are not just POJOs — they express VALUE semantics: two Point(3,4) are equal. They cannot extend classes but can implement interfaces.',
    'Sealed classes + pattern matching switch = exhaustive type checking by the compiler. Add a new Shape subclass → every switch on Shape fails to compile.',
    'Virtual threads are for I/O-bound tasks (HTTP calls, DB queries). For CPU-bound work, they offer no advantage over platform threads.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between a record and a regular class?\nA: Records are immutable data carriers with auto-generated accessors (x(), not getX()), equals(), hashCode(), and toString(). They cannot extend classes, and all fields are final. Use records when you need pure data with value semantics, regular classes when you need mutability or inheritance.',
    },
    {
      type: 'gotcha',
      content: 'Text block indentation is determined by the position of the closing """. If the closing """ is on its own line with no indentation, NO whitespace is stripped. Move the closing """ to match the content indentation to get clean stripping.',
    },
  ],
}
