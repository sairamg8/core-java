export default {
  id: 'default-vs-parameterized-constructor',
  title: '53. Default vs. Parameterized Constructor',
  explanation: `Understanding the difference between default and parameterized constructors is fundamental to object initialization in Java.

**Default Constructor:**
- Zero parameters
- If you write NONE, the compiler provides one automatically
- The compiler-generated default calls \`super()\` and leaves all fields at default values (0, false, null)
- If you write ANY constructor, the compiler's free default disappears

\`\`\`java
class Animal {
    // No constructors written → compiler generates:
    // Animal() { super(); }
}
Animal a = new Animal(); // works
\`\`\`

**Parameterized Constructor:**
- Takes one or more arguments
- You must write it explicitly
- Allows immediate initialization of fields with meaningful values

\`\`\`java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
}
Animal a = new Animal("Leo");
// Animal a2 = new Animal(); // COMPILE ERROR — no default constructor!
\`\`\`

**Best practice:**
Always provide both when objects can be meaningfully created with or without initial data:
\`\`\`java
Animal() { this("Unknown"); } // chains to parameterized
Animal(String name) { this.name = name; }
\`\`\`

**Frameworks and the default constructor:**
Spring, Hibernate, and Jackson use reflection to instantiate objects via \`Class.newInstance()\`, which requires a no-arg constructor. If your class is managed by a framework, always include an explicit no-arg constructor.`,
  code: `public class DefaultVsParameterized {
    public static void main(String[] args) {
        // Default constructor: fields get language defaults
        Point p1 = new Point();
        System.out.println(p1); // Point(0, 0)

        // Parameterized: fields initialized with supplied values
        Point p2 = new Point(3, 4);
        System.out.println(p2); // Point(3, 4)
        System.out.println("Distance from origin: " + p2.distanceFromOrigin());

        // Constructor chaining: no-arg calls parameterized
        Rectangle r1 = new Rectangle();
        System.out.println(r1); // Rectangle[1 × 1]

        Rectangle r2 = new Rectangle(5, 3);
        System.out.println(r2); // Rectangle[5 × 3]
    }
}

class Point {
    int x, y;

    Point() { } // explicit no-arg: x=0, y=0 by default

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }

    @Override public String toString() { return "Point(" + x + ", " + y + ")"; }
}

class Rectangle {
    int width, height;

    Rectangle() { this(1, 1); } // default 1×1 square

    Rectangle(int width, int height) {
        if (width <= 0 || height <= 0) throw new IllegalArgumentException("Positive dimensions required");
        this.width = width;
        this.height = height;
    }

    @Override public String toString() { return "Rectangle[" + width + " × " + height + "]"; }
}`,
  codeTitle: 'Default and Parameterized Constructors',
  points: [
    'Default constructor (no-arg) is auto-generated ONLY if you write no constructors at all; add a parameterized one and the free default vanishes',
    'Always re-add an explicit no-arg constructor when you have parameterized constructors and need default-construction to work (frameworks, serialization)',
    'Use constructor chaining (this()) so no-arg defaults delegate to the parameterized one — avoids duplicating initialization logic',
    'Fields not set in a constructor get language defaults: 0 for int, 0.0 for double, false for boolean, null for objects',
    'Parameterized constructors make invalid state impossible by validating at construction time (fail fast)',
    'Hibernate, Spring, and Jackson need a no-arg constructor to instantiate objects via reflection; forgetting it causes runtime errors',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Writing only a parameterized constructor silently removes the default constructor. Code that previously worked with new MyClass() will now fail to compile. Add Rectangle() { this(1, 1); } explicitly to restore default construction.',
    },
    {
      type: 'tip',
      content: 'Chain no-arg to parameterized using this() so there is one place where fields are assigned. Copy-pasting initialization into every constructor creates maintenance debt — changing the logic later requires updating every constructor.',
    },
    {
      type: 'interview',
      content: 'Q: Does Java always provide a default constructor?\nA: No — only when no constructor is defined at all. The moment you define ANY constructor, Java stops generating the default. This catches many beginners off guard when they add a parameterized constructor and then new MyClass() stops compiling.',
    },
  ],
}
