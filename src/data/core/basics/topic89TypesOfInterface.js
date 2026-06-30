export default {
  id: 'types-of-interface',
  title: '89. Types of Interface',
  explanation: `Java interfaces can be categorized by their structure and purpose into several types:

1. **Normal Interface** — Has two or more abstract methods. Any class implementing it must provide bodies for all of them. These define a full contract, like \`Comparable\`, \`Iterable\`, or custom service interfaces.

2. **Functional Interface (SAM Interface)** — Has exactly one abstract method. Can optionally be annotated with \`@FunctionalInterface\`. Lambda expressions and method references can be assigned to functional interfaces. Examples: \`Runnable\`, \`Callable\`, \`Comparator\`, \`Predicate\`, \`Function\`.

3. **Marker Interface** — Has zero abstract methods. Its presence on a class serves as a flag or tag. Examples: \`Serializable\`, \`Cloneable\`, \`Remote\`. Frameworks and the JVM check for these with \`instanceof\`.

4. **Constant Interface (anti-pattern)** — Only contains public static final constants with no methods. Using it to import constants is considered bad practice. Use a final class with constants instead.

Understanding these categories helps you choose the right tool when designing APIs.`,
  code: `import java.util.function.*;

// 1. Normal Interface — multiple abstract methods
interface Shape {
    double area();
    double perimeter();
    default void describe() {
        System.out.printf("Area=%.2f, Perimeter=%.2f%n", area(), perimeter());
    }
}

// 2. Functional Interface — exactly one abstract method
@FunctionalInterface
interface Transformer {
    String transform(String input);
    // default methods are fine — still functional
    default String transformAndWrap(String input) {
        return "[" + transform(input) + "]";
    }
}

// 3. Marker Interface — no methods
interface Auditable { }   // signals that objects should be logged

class PaymentService implements Auditable {
    void pay(double amount) { System.out.println("Paid: " + amount); }
}

// 4. Constant Interface (anti-pattern — avoid)
interface MathConstants {
    double PI = 3.14159;   // public static final
    double E  = 2.71828;
}

public class Demo {
    public static void main(String[] args) {
        // Normal interface
        Shape rect = new Shape() {
            public double area() { return 5 * 3; }
            public double perimeter() { return 2 * (5 + 3); }
        };
        rect.describe();  // Area=15.00, Perimeter=16.00

        // Functional interface with lambda
        Transformer upper = s -> s.toUpperCase();
        System.out.println(upper.transform("hello"));           // HELLO
        System.out.println(upper.transformAndWrap("hello"));    // [HELLO]

        // Built-in functional interfaces
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Function<String, Integer> length = String::length;
        System.out.println(isEven.test(4));                     // true
        System.out.println(length.apply("Java"));               // 4

        // Marker interface check
        Object obj = new PaymentService();
        if (obj instanceof Auditable) {
            System.out.println("This object is auditable");
        }
    }
}`,
  codeTitle: 'Types of Interface: Normal, Functional, Marker, Constant',
  points: [
    'Normal interfaces define a multi-method contract; implementing classes must fulfill every abstract method',
    'Functional interfaces have exactly one abstract method and can be implemented with a lambda expression',
    '@FunctionalInterface is optional but recommended — it causes a compile error if you add a second abstract method accidentally',
    'java.util.function package provides general-purpose functional interfaces: Predicate, Function, Consumer, Supplier, BiFunction, etc.',
    'Marker interfaces have no methods; instanceof checks at runtime distinguish marked objects',
    'Constant interfaces (interface with only constants) are an anti-pattern — they pollute the implementing class namespace; use a final utility class instead',
    'A single interface can be normal or functional — the distinction depends on its abstract method count',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Adding a second abstract method to a @FunctionalInterface causes a compile error. Default and static methods do NOT count toward the one-abstract-method limit — an interface with one abstract method and ten default methods is still functional.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Serializable and Cloneable as marker interfaces?\nA: Both have no methods, but their behavior differs. Serializable is honored by ObjectOutputStream automatically. Cloneable must be paired with overriding Object.clone() — if you implement Cloneable without overriding clone(), calling clone() still throws CloneNotSupportedException if Object.clone() is not accessible.',
    },
    {
      type: 'tip',
      content: 'Prefer annotations over marker interfaces for new code. Annotations (@Entity, @Auditable) achieve the same tagging purpose but can carry metadata and do not pollute the class hierarchy.',
    },
  ],
}
