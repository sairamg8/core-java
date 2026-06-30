export default {
  id: 'what-is-interface',
  title: '82. What Is an Interface?',
  explanation: `An interface in Java is a contract — a blueprint of methods that any implementing class must provide. It defines WHAT a class should do, not HOW. Before Java 8, interfaces could only contain abstract method signatures and constants (public static final fields). Since Java 8, interfaces can also contain default methods (with a body) and static methods. Since Java 9, they can have private methods too.

Declaring an interface uses the \`interface\` keyword. A class implements an interface using \`implements\`. Unlike class inheritance (\`extends\`), a class can implement multiple interfaces, solving Java's single-inheritance limitation.

All methods in an interface are implicitly \`public abstract\` (pre-Java 8). All fields are implicitly \`public static final\`. The implementing class must provide concrete implementations for all abstract methods, or declare itself abstract.

Interfaces enable loose coupling and polymorphism: you can write code against an interface type and swap implementations freely without changing the calling code.`,
  code: `// Declaring an interface
interface Printable {
    // implicitly public static final
    int MAX_PAGES = 100;

    // implicitly public abstract
    void print();

    // default method (Java 8+)
    default void printInfo() {
        System.out.println("Printable document, max pages: " + MAX_PAGES);
    }

    // static method (Java 8+)
    static void about() {
        System.out.println("Printable interface v1.0");
    }
}

// Implementing the interface
class Document implements Printable {
    private String content;

    Document(String content) {
        this.content = content;
    }

    @Override
    public void print() {
        System.out.println("Printing: " + content);
    }
}

public class Demo {
    public static void main(String[] args) {
        Printable doc = new Document("Hello World");
        doc.print();       // Printing: Hello World
        doc.printInfo();   // Printable document, max pages: 100
        Printable.about(); // Printable interface v1.0

        System.out.println(Printable.MAX_PAGES); // 100
    }
}`,
  codeTitle: 'Interface Declaration and Implementation',
  points: [
    'An interface is declared with the interface keyword and implemented with implements',
    'All interface methods are implicitly public; all fields are implicitly public static final',
    'A class can implement multiple interfaces (unlike class inheritance which is single)',
    'Java 8 added default and static methods to interfaces, reducing the need for abstract adapter classes',
    'Java 9 added private methods in interfaces to share helper code between default methods',
    'Interface references can hold objects of any implementing class — a key form of polymorphism',
    'If a class does not implement all abstract methods, it must be declared abstract itself',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Interface fields are always public static final — you cannot declare instance variables in an interface. Any field you declare, even without modifiers, becomes a constant shared across all implementors.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between an abstract class and an interface?\nA: An abstract class can have instance variables, constructors, and both abstract and concrete methods. A class can extend only one abstract class. An interface (pre-Java 8) has only abstract methods and constants; a class can implement many interfaces. Java 8+ blurs the line with default methods, but interfaces still cannot have instance state.',
    },
    {
      type: 'tip',
      content: 'Program to the interface, not the implementation. Declare variables as the interface type (e.g., List instead of ArrayList) so you can swap implementations without changing dependent code.',
    },
  ],
}
