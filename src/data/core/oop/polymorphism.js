export default {
  id: 'polymorphism',
  title: '4. Polymorphism',
  explanation: `**Polymorphism** = "many forms." One interface, multiple implementations.

**Compile-time polymorphism (Static Dispatch):** Method **Overloading** — same name, different parameters. Resolved by compiler based on argument types.

**Runtime polymorphism (Dynamic Dispatch):** Method **Overriding** — child overrides parent method. JVM uses the actual object type (vtable lookup) at runtime to decide which method to call.`,
  code: `// ---- OVERLOADING (compile-time) ----
class Printer {
    void print(int n)    { System.out.println("int: " + n); }
    void print(double d) { System.out.println("double: " + d); }
    void print(String s) { System.out.println("String: " + s); }
    // Cannot overload by return type alone — compile error
}

Printer p = new Printer();
p.print(42);       // calls print(int)   — resolved at compile time
p.print(3.14);     // calls print(double)
p.print("hello");  // calls print(String)

// ---- OVERRIDING (runtime) ----
class Shape {
    public double area() { return 0; }
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override public double area() { return Math.PI * r * r; }
}

class Rectangle extends Shape {
    double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    @Override public double area() { return w * h; }
}

// The ACTUAL type decides which method runs — not the reference type
Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };
for (Shape s : shapes) {
    System.out.printf("Area = %.2f%n", s.area());  // Circle/Rectangle.area()
}

// Downcasting — safely done with instanceof check
Shape s = new Circle(3);
if (s instanceof Circle c) {         // Java 16+ pattern matching
    System.out.println("Radius: " + c.r);
}`,
  points: [
    'Overloading resolution uses WIDENING for numeric types: print(42) matches print(long) if no print(int) exists',
    'Varargs (int... nums) participate in overloading but are lowest priority in method resolution',
    'Overriding is the mechanism behind frameworks like Spring — one interface, many implementing classes injected at runtime',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Can you overload main()?\nA: Yes — you can define main(int x) or main(String... args) etc. But the JVM entry point is always main(String[] args). Others must be called manually.',
    },
    {
      type: 'gotcha',
      content: 'Overloading is resolved at COMPILE TIME based on the declared type, not runtime type. If you pass a Dog reference typed as Animal to an overloaded method, the Animal version is called. This differs from overriding which uses runtime type.',
    },
  ],
}
