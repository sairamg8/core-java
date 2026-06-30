export default {
  id: 'abstract-and-anonymous-inner-class',
  title: '81. Abstract and Anonymous Inner Class',
  explanation: `This topic brings together two related concepts: abstract classes and anonymous inner classes, showing how they interact. An abstract class provides a partial implementation with one or more abstract methods that must be overridden. An anonymous inner class is the most concise way to supply that required implementation on the spot — without writing a full named subclass in a separate location.

When you instantiate an abstract class using an anonymous inner class, you must provide bodies for all abstract methods in the class body. This pattern is extremely common in UI frameworks (button click handlers), Java collections (custom Comparator), and concurrency (Runnable, Callable).

The key insight is that you cannot instantiate an abstract class directly — but you can instantiate an anonymous subclass of it. The anonymous class silently extends the abstract class and fulfills all obligations. This keeps the code local to where it is used, making the intent clear.`,
  code: `abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }

    abstract void sound();   // must be overridden

    void breathe() {
        System.out.println(name + " breathes");
    }
}

public class Demo {
    public static void main(String[] args) {
        // Cannot do: new Animal("Dog"); — compile error

        // Anonymous inner class fulfills the abstract contract
        Animal dog = new Animal("Dog") {
            @Override
            public void sound() {
                System.out.println(name + " says: Woof!");
            }
        };
        dog.sound();    // Dog says: Woof!
        dog.breathe();  // Dog breathes

        Animal cat = new Animal("Cat") {
            @Override
            public void sound() {
                System.out.println(name + " says: Meow!");
            }
        };
        cat.sound();    // Cat says: Meow!

        // With an abstract class that has multiple abstract methods
        abstract class Vehicle {
            abstract String getType();
            abstract int getSpeed();
            void describe() {
                System.out.println(getType() + " at " + getSpeed() + " km/h");
            }
        }

        Vehicle car = new Vehicle() {
            public String getType() { return "Car"; }
            public int getSpeed() { return 120; }
        };
        car.describe();  // Car at 120 km/h
    }
}`,
  codeTitle: 'Abstract Class with Anonymous Inner Class',
  points: [
    'You cannot instantiate an abstract class directly — an anonymous inner class creates an implicit subclass',
    'All abstract methods from the abstract class must be implemented in the anonymous class body',
    'The anonymous class can call non-abstract methods and access fields of the abstract class',
    'Constructor arguments (like name above) are passed to the abstract class constructor',
    'Each anonymous class instantiation creates a separate class file (OuterClass$1, OuterClass$2, ...)',
    'This pattern is the predecessor of lambdas for SAM types and still necessary for multi-method abstract classes',
    'The anonymous inner class can also introduce its own additional methods, but those cannot be called via the reference type',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you add a public method to the anonymous inner class body that is NOT in the abstract class, you cannot call it via the abstract class reference — the compiler does not know about it. You would need to cast to the anonymous type, which is impossible since it has no name.',
    },
    {
      type: 'interview',
      content: 'Q: Can an anonymous inner class extend an abstract class that has a parameterized constructor?\nA: Yes. You supply the constructor arguments in the new expression: new AbstractClass(arg1, arg2) { ... }. The anonymous class itself cannot define its own constructor, so the superclass constructor handles initialization.',
    },
    {
      type: 'tip',
      content: 'Use anonymous inner classes with abstract classes to keep single-use implementations local. If the same implementation is needed in multiple places, extract it into a named class instead.',
    },
  ],
}
