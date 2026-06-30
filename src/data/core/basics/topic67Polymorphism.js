export default {
  id: 'polymorphism',
  title: '67. Polymorphism',
  explanation: `**Polymorphism** (Greek: "many forms") means the same code can work with objects of different types. In Java, polymorphism has two flavors:

**1. Compile-time polymorphism (static binding):**
- Achieved via **method overloading**
- The compiler decides which method to call based on argument types at compile time

**2. Runtime polymorphism (dynamic binding):**
- Achieved via **method overriding** + **inheritance or interfaces**
- The JVM decides which method to call at runtime based on the actual object type

**The power of runtime polymorphism:**
\`\`\`java
Shape[] shapes = { new Circle(5), new Rectangle(4, 3), new Triangle(3, 4, 5) };
for (Shape s : shapes) {
    s.area(); // different method executes for each type — runtime decision
}
\`\`\`
New shapes can be added (Triangle, Hexagon) without changing the loop — **Open/Closed Principle** in action.

**IS-A relationship is the prerequisite:**
Polymorphism only works when there is an inheritance (extends) or interface (implements) relationship. An Animal reference can hold a Dog because Dog IS-A Animal.

\`\`\`java
Animal a = new Dog(); // valid: Dog IS-A Animal
a.sound();            // calls Dog.sound() — polymorphic
\`\`\`

**Polymorphism reduces code:**
Without it, you would need separate methods/loops for Dog, Cat, Bird. With it, one method that takes Animal handles all subtypes.`,
  code: `public class Polymorphism {
    public static void main(String[] args) {
        // Runtime polymorphism: one array, many types
        Shape[] shapes = {
            new Circle(5),
            new Rectangle(4, 6),
            new Triangle(3, 4, 5)
        };

        double totalArea = 0;
        for (Shape s : shapes) {
            double a = s.area(); // polymorphic call — JVM picks right version
            System.out.printf("%s area: %.2f%n", s.getClass().getSimpleName(), a);
            totalArea += a;
        }
        System.out.printf("Total area: %.2f%n", totalArea);

        // Compile-time polymorphism (overloading)
        Printer p = new Printer();
        p.print("Hello");   // String version
        p.print(42);        // int version
        p.print(3.14);      // double version
    }
}

abstract class Shape {
    abstract double area(); // each subclass provides its own implementation
}

class Circle extends Shape {
    double radius;
    Circle(double r) { radius = r; }
    @Override double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    @Override double area() { return w * h; }
}

class Triangle extends Shape {
    double a, b, c;
    Triangle(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }
    @Override double area() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s-a) * (s-b) * (s-c));
    }
}

class Printer {
    void print(String s) { System.out.println("String: " + s); }
    void print(int n)    { System.out.println("int: " + n); }
    void print(double d) { System.out.println("double: " + d); }
}`,
  codeTitle: 'Runtime Polymorphism with Shapes + Compile-time via Overloading',
  points: [
    'Runtime polymorphism (dynamic dispatch) selects the correct method at runtime based on the actual object type, not the reference type',
    'Compile-time polymorphism (overloading) is resolved at compile time based on argument types',
    'Polymorphism requires an IS-A relationship — inheritance (extends) or interface implementation (implements)',
    'A parent-type reference (Shape) can hold any subtype (Circle, Rectangle) — enables writing generic algorithms',
    'New subclasses can be added without modifying existing code that uses the parent type — Open/Closed Principle',
    'Polymorphism is the third OOP pillar (after encapsulation and inheritance) and is what makes design patterns like Strategy, Observer, and Command work',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The practical value of polymorphism: a method that accepts Animal handles Dog, Cat, Bird, and any future animal without modification. This is the foundation of extensible software design.',
    },
    {
      type: 'gotcha',
      content: 'Polymorphism works for INSTANCE methods only. Static methods are not polymorphic — they are resolved at compile time based on the reference type. Animal.staticMethod() always calls Animal\'s version, even if the reference holds a Dog.',
    },
    {
      type: 'interview',
      content: 'Q: What is polymorphism and its types in Java?\nA: Polymorphism = same interface, multiple behaviors. Compile-time (static) polymorphism = method overloading, resolved at compile time. Runtime (dynamic) polymorphism = method overriding, resolved at runtime via dynamic dispatch.',
    },
  ],
}
