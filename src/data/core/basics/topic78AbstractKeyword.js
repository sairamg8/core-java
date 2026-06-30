export default {
  id: 'abstract-keyword',
  title: '78. Abstract Keyword',
  explanation: `The \`abstract\` keyword in Java is used to create **incomplete classes and methods** that subclasses must complete. It is the mechanism behind abstraction — hiding implementation details and exposing only the contract.

**Abstract class:**
- Cannot be instantiated directly (\`new AbstractShape()\` is a compile error)
- May contain both abstract and concrete methods
- Used when you want to share common code across subclasses while forcing them to implement specific behavior

\`\`\`java
abstract class Shape {
    String color; // shared state
    void setColor(String c) { color = c; } // shared method
    abstract double area(); // force each subclass to implement
}
\`\`\`

**Abstract method:**
- Declared without a body (ends with semicolon)
- Implicitly public and without the \`static\` or \`final\` modifiers
- Any class with at least one abstract method MUST be declared abstract
- Subclasses that extend the abstract class must either implement all abstract methods or also be declared abstract

**Abstract vs Interface:**
| Feature | Abstract class | Interface |
|---------|---------------|-----------|
| Instantiation | No | No |
| State (fields) | Yes | Only static final |
| Constructor | Yes | No |
| Multiple inheritance | No | Yes (implements many) |
| Access modifiers | Any | public by default |
| Best for | IS-A with shared state | Pure behavior contract |`,
  code: `public class AbstractKeyword {
    public static void main(String[] args) {
        // new Shape() // COMPILE ERROR: cannot instantiate abstract class

        Shape circle = new Circle(7);
        Shape rect   = new Rectangle(4, 6);

        System.out.println("Circle area:    " + String.format("%.2f", circle.area()));
        System.out.println("Rectangle area: " + rect.area());

        circle.setColor("red");
        System.out.println("Color: " + circle.color);

        // Array of abstract type — polymorphism
        Shape[] shapes = { new Circle(3), new Rectangle(5, 2), new Circle(10) };
        double total = 0;
        for (Shape s : shapes) total += s.area(); // abstract method resolved at runtime
        System.out.printf("Total area: %.2f%n", total);
    }
}

abstract class Shape {
    String color = "none";

    // Concrete method: shared behavior
    void setColor(String color) { this.color = color; }

    // Abstract method: subclasses MUST implement
    abstract double area();

    // Abstract method with common toString pattern
    @Override
    public String toString() {
        return getClass().getSimpleName() + "(area=" + String.format("%.2f", area()) + ")";
    }
}

class Circle extends Shape {
    double radius;
    Circle(double r) { radius = r; }

    @Override
    double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    double width, height;
    Rectangle(double w, double h) { width = w; height = h; }

    @Override
    double area() { return width * height; }
}`,
  codeTitle: 'Abstract Class — Shared State + Forced Contract',
  points: [
    'Abstract classes cannot be instantiated — they exist only to be extended',
    'Abstract methods define a contract (signature only, no body) that all concrete subclasses must fulfill',
    'A class with any abstract method must itself be abstract; a class that extends an abstract class must implement all abstract methods or be abstract itself',
    'Abstract classes can have constructors (called via super() from subclasses), fields, and fully implemented methods',
    'Use abstract classes when subclasses share significant state or concrete behavior; use interfaces when you only need a behavior contract',
    'Polymorphism works with abstract types: Shape[] stores Circle and Rectangle; area() resolves correctly via dynamic dispatch',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A class with an unimplemented abstract method that is NOT declared abstract itself causes a compile error: "class must implement abstract method". Either implement the method or declare the class abstract.',
    },
    {
      type: 'tip',
      content: 'The Template Method Design Pattern relies on abstract classes: define the algorithm skeleton in the abstract class with some steps abstract. Subclasses fill in the steps without changing the overall algorithm.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between an abstract class and an interface?\nA: Abstract class: can have state (fields), constructor, mixed abstract/concrete methods, single inheritance. Interface: no instance state (only static final), no constructor, all methods public/abstract (or default/static from Java 8), multiple implementation.',
    },
  ],
}
