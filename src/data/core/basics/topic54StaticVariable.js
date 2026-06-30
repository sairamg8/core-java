export default {
  id: 'static-variable',
  title: '54. Static Variable',
  explanation: `A **static variable** (also called a class variable) belongs to the **class**, not to any specific instance. There is exactly one copy of a static variable, shared across all instances of the class.

**Syntax:**
\`\`\`java
class Counter {
    static int count = 0; // one copy, shared by all Counter objects
    int id;
}
\`\`\`

**Access:**
- Via class name: \`Counter.count\` (preferred — makes it clear it is static)
- Via instance: \`obj.count\` (works but misleading — avoid)

**Memory location:**
Static variables are stored in the **Method Area** (Metaspace since Java 8), not on the heap with instance data. They are initialized when the class is loaded by the JVM and exist until the class is unloaded.

**Common use cases:**
- **Counter:** track total instances created
- **Constants:** \`static final int MAX = 100;\`
- **Shared config:** a connection pool size, a base URL
- **Singleton pattern:** \`static MyClass instance;\`

**Initialization order:**
1. Static variables initialized in declaration order
2. Static initializer blocks run in declaration order
3. Then instance creation (when \`new\` is called)

**Static final (constants):**
\`\`\`java
static final double PI = 3.14159; // naming convention: ALL_CAPS
\`\`\`
\`static final\` fields are constants — initialized once, never changed.`,
  code: `public class StaticVariable {
    public static void main(String[] args) {
        // Static variable: shared counter
        System.out.println("Before creating: " + Car.totalCars); // 0

        Car c1 = new Car("Toyota");
        Car c2 = new Car("Honda");
        Car c3 = new Car("BMW");

        System.out.println("After creating 3: " + Car.totalCars); // 3
        System.out.println(c1.id + " " + c2.id + " " + c3.id);   // 1 2 3

        // Static final constant
        System.out.println("Max cars: " + Car.MAX_CARS);

        // Modifying static via class name
        Car.totalCars = 0; // reset
        System.out.println(Car.totalCars); // 0
        // c1.totalCars is also 0 — same variable!
        System.out.println(c1.totalCars == Car.totalCars); // true — same memory location
    }
}

class Car {
    static int totalCars = 0;         // class variable
    static final int MAX_CARS = 1000; // constant

    int id;       // instance variable: each Car has its own
    String model;

    Car(String model) {
        this.model = model;
        totalCars++;       // increment shared counter
        this.id = totalCars;
    }
}`,
  codeTitle: 'Static Variable — Shared Counter and Constants',
  points: [
    'Static variables have exactly one copy, shared by all instances — changing it through any instance or the class name affects all',
    'Access static variables via the class name (Car.count), not through an instance — this clarifies the static nature to readers',
    'Static variables are stored in the Method Area (Metaspace), initialized when the class loads, and persist for the JVM lifetime',
    'static final variables are compile-time constants — naming convention is ALL_CAPS_WITH_UNDERSCORES',
    'Static variables are initialized before any instance is created — safe to use in constructors',
    'Common pitfall in multi-threaded code: multiple threads modifying a static variable without synchronization causes race conditions',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Accessing a static variable via an instance reference (c1.totalCars) is misleading and warns you with "static access via instance". The compiler allows it but it is a style error — always use ClassName.staticVar.',
    },
    {
      type: 'tip',
      content: 'For thread-safe counters, use AtomicInteger instead of a plain static int. static int count++ is NOT atomic and will give wrong results under concurrent access.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between instance variables and static variables?\nA: Each instance has its own copy of an instance variable; all instances share one copy of a static variable. Instance variables live on the heap with the object; static variables live in the Method Area.',
    },
  ],
}
