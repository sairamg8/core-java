export default {
  id: 'anonymous-inner-class',
  title: '80. Anonymous Inner Class',
  explanation: `An Anonymous Inner Class is a local class without a name, defined and instantiated in a single expression. It is used when you need to override methods of a class or interface exactly once — inline, without creating a separate named subclass. Anonymous inner classes are commonly used to implement interfaces or extend abstract/concrete classes on the fly, especially in event handling and callback patterns.

The syntax uses \`new ClassName() { ... }\` or \`new InterfaceName() { ... }\` followed immediately by a class body. The compiled class gets a name like \`Outer$1.class\` assigned by the compiler.

They capture variables from the enclosing scope, but those variables must be effectively final. Anonymous inner classes can access all members of the enclosing class. Since Java 8, lambda expressions have replaced many anonymous inner class usages for single-abstract-method (SAM) interfaces, but anonymous inner classes still shine when you need to override multiple methods or work with abstract classes.`,
  code: `// Extending an abstract class anonymously
abstract class Shape {
    abstract void draw();
    void info() {
        System.out.println("I am a shape");
    }
}

public class Demo {
    public static void main(String[] args) {
        // Anonymous inner class extending Shape
        Shape circle = new Shape() {
            @Override
            void draw() {
                System.out.println("Drawing Circle");
            }
        };
        circle.draw();   // Drawing Circle
        circle.info();   // I am a shape

        // Anonymous inner class implementing Runnable
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Running in anonymous class");
            }
        };
        r.run();
    }
}`,
  codeTitle: 'Anonymous Inner Class Example',
  points: [
    'An anonymous inner class is declared and instantiated in a single statement using new ClassName/InterfaceName() { ... }',
    'It can extend a class OR implement an interface, but not both simultaneously',
    'The compiler generates a synthetic name like OuterClass$1 for the .class file',
    'Variables from the enclosing scope used inside must be effectively final',
    'Cannot have explicit constructors since the class has no name',
    'Useful for one-off overrides without polluting the namespace with named subclasses',
    'Since Java 8, lambdas replace anonymous classes for single-abstract-method (SAM) interfaces',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Anonymous inner classes cannot define a constructor because they have no name. Initialization must be done in an instance initializer block { } inside the class body.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between an anonymous inner class and a lambda expression?\nA: An anonymous inner class can implement interfaces with multiple methods, extend abstract classes, and maintain state with fields. A lambda expression can only implement a functional interface (exactly one abstract method) and cannot have fields or multiple method overrides.',
    },
    {
      type: 'tip',
      content: 'Prefer lambdas over anonymous inner classes for functional interfaces — they are shorter and more readable. Use anonymous inner classes when you need to override multiple methods or extend an abstract class.',
    },
  ],
}
