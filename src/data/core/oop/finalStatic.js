export default {
  id: 'final-static',
  title: '6. final, static & this/super Keywords',
  explanation: `These keywords appear in almost every Java interview. Understand each in all contexts.

**final** → prevents change (variable), override (method), or subclassing (class)
**static** → belongs to class, not instance
**this** → reference to current object
**super** → reference to parent class`,
  code: `// final on variable — can assign ONCE only
final int MAX = 100;
// MAX = 200;   ← Compile error

// Blank final — must be assigned in EVERY constructor path
class Config {
    private final String env;
    Config(String e) { this.env = e; }  // must assign here
}

// final on REFERENCE — the reference is fixed, object is mutable!
final List<String> items = new ArrayList<>();
items.add("ok");    // valid — mutating the object
// items = new ArrayList<>();  ← Compile error — reassigning reference

// final method — cannot be overridden
class Base {
    public final void template() { /* locked */ }
}

// final class — cannot be extended (String, Integer, Math are final)
final class Utility {
    private Utility() {}   // combine with private constructor
    public static void doWork() { }
}

// static field & block
class Database {
    private static Connection conn;    // shared

    static {                           // runs once when class loads
        conn = createConnection();
        System.out.println("DB initialized");
    }

    static Connection createConnection() { return new Connection(); }

    // instance initializer block — runs before every constructor
    {
        System.out.println("Instance created");
    }
}

// static inner class — can be instantiated without outer class
class Outer {
    static class Inner {
        void hello() { System.out.println("Static inner"); }
    }
}
Outer.Inner inner = new Outer.Inner();  // no Outer instance needed`,
  points: [
    'Execution order: static blocks (once) → instance initializers → constructor',
    'A static method cannot use this or super — no instance context',
    'Static methods can be called on an object reference but it\'s misleading: obj.staticMethod() compiles but is resolved at compile time based on type',
    'final + static = constant. Convention: UPPER_SNAKE_CASE',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'final on a collection reference does NOT make the collection immutable! It only prevents reassigning the variable. Use Collections.unmodifiableList() or List.of() for true immutability.',
    },
    {
      type: 'interview',
      content: 'Q: Can you override a static method?\nA: No — static methods are class-level. A subclass can DEFINE a static method with the same signature (hiding), but no polymorphism — the reference type determines which version runs at compile time.',
    },
  ],
}
