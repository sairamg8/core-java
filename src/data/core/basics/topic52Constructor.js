export default {
  id: 'constructor',
  title: '52. Constructor',
  explanation: `A **constructor** is a special method that is automatically called when an object is created with \`new\`. Its purpose is to **initialize** the new object's state.

**Constructor rules:**
- Same name as the class
- No return type (not even \`void\`)
- Can be \`public\`, \`protected\`, \`private\`, or package-private
- Can be overloaded (multiple constructors with different parameter lists)
- Cannot be \`static\`, \`final\`, or \`abstract\`

**Default constructor:**
If you write NO constructor, the compiler provides a zero-argument default constructor that calls \`super()\` and leaves all fields at their default values. As soon as you write any constructor yourself, the compiler stops generating the default.

**Explicit no-arg constructor:**
\`\`\`java
class Car {
    String model;
    Car() { model = "Unknown"; } // explicit no-arg
    Car(String model) { this.model = model; }
}
\`\`\`

**Constructor body:**
1. Implicit \`super()\` call (or explicit \`super(...)\` / \`this(...)\`) happens first
2. Instance initializer blocks run
3. Constructor body executes

**Purpose vs method:**
Constructors exist to establish the **invariants** of an object — ensure it is in a valid state from the moment it is created. Regular methods then operate on that already-valid state.`,
  code: `public class Constructor {
    public static void main(String[] args) {
        // No-arg constructor
        Box b1 = new Box();
        System.out.println(b1); // Box[0.0 × 0.0 × 0.0]

        // Parameterized constructor
        Box b2 = new Box(3, 4, 5);
        System.out.println(b2); // Box[3.0 × 4.0 × 5.0]
        System.out.println("Volume: " + b2.volume());

        // Copy constructor
        Box b3 = new Box(b2);
        b3.width = 99;
        System.out.println(b2.width + " vs " + b3.width); // 3.0 vs 99.0
    }
}

class Box {
    double width, height, depth;

    // No-arg: default dimensions
    Box() {
        this(0, 0, 0); // chain to parameterized
    }

    // Parameterized: validate and assign
    Box(double w, double h, double d) {
        if (w < 0 || h < 0 || d < 0) throw new IllegalArgumentException("Dimensions must be non-negative");
        this.width = w;
        this.height = h;
        this.depth = d;
    }

    // Copy constructor
    Box(Box other) {
        this(other.width, other.height, other.depth);
    }

    double volume() { return width * height * depth; }

    @Override
    public String toString() {
        return "Box[" + width + " × " + height + " × " + depth + "]";
    }
}`,
  codeTitle: 'No-arg, Parameterized, and Copy Constructors',
  points: [
    'A constructor has the same name as the class and no return type — not even void',
    'If you write no constructor, the compiler generates a default no-arg constructor; it disappears as soon as you write any constructor',
    'Constructor overloading allows different ways to create objects: Box(), Box(w, h, d), Box(otherBox)',
    'this() calls another constructor in the same class; super() calls the parent class constructor — both must be the first statement',
    'Copy constructors (Box(Box other)) are a common pattern for creating independent copies of objects',
    'Use constructors to enforce invariants: throw exceptions for invalid arguments rather than allowing invalid state',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Once you write any constructor (even a parameterized one), the compiler NO LONGER generates a default no-arg constructor. If other code (like Spring or Hibernate) needs new MyClass(), you must write the no-arg constructor explicitly.',
    },
    {
      type: 'tip',
      content: 'Throw IllegalArgumentException (unchecked) in constructors for invalid arguments. This is the Java convention for programmer errors. For checked conditions (file not found), throw checked exceptions.',
    },
    {
      type: 'interview',
      content: 'Q: Can a constructor return a value?\nA: No — constructors have no return type, not even void. They implicitly return the newly created object. Specifying a return type would make it a regular method, not a constructor.',
    },
  ],
}
