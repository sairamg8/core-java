export default {
  id: 'what-is-inheritance',
  title: '60. What Is Inheritance?',
  explanation: `**Inheritance** is an OOP mechanism where a class (**subclass / child / derived class**) acquires the properties and behaviors of another class (**superclass / parent / base class**) using the \`extends\` keyword.

**Terminology:**
- Superclass: the class being inherited from (\`Animal\`)
- Subclass: the class that inherits (\`Dog\`)
- \`extends\`: the Java keyword that establishes the relationship

**What is inherited:**
| Member | Inherited? |
|--------|-----------|
| public fields | Yes |
| protected fields | Yes |
| package-private fields | Yes (same package) |
| private fields | No (but accessible via public/protected getters) |
| public methods | Yes |
| protected methods | Yes |
| static members | Yes (accessible, not truly inherited — class-level) |
| constructors | No — constructors are not inherited |

**What inheritance enables:**
1. **Reuse:** shared code in parent, unique code in child
2. **Override:** child can redefine a method to specialize behavior
3. **Polymorphism:** parent reference can hold any subclass object

**Object class:**
Every class in Java implicitly extends \`java.lang.Object\` if no explicit superclass is given. This gives every class \`toString()\`, \`equals()\`, \`hashCode()\`, \`getClass()\`, and \`wait()\`/\`notify()\` methods.

**Constructor inheritance:**
Constructors are NOT inherited. The child must call \`super()\` (implicitly or explicitly) to initialize the parent part.`,
  code: `public class WhatIsInheritance {
    public static void main(String[] args) {
        Vehicle v = new Vehicle("Generic", 2020);
        v.start();    // Vehicle start

        Car car = new Car("Toyota", 2022, 4);
        car.start();  // Car uses inherited start()
        car.honk();   // Car-specific method

        // Access inherited field
        System.out.println(car.brand);  // Toyota
        System.out.println(car.year);   // 2022
        System.out.println(car.doors);  // 4

        // Every class inherits Object methods
        System.out.println(car.getClass().getSimpleName()); // Car
        System.out.println(car);  // calls toString() — inherited from Object unless overridden

        // Inheritance chain: Car → Vehicle → Object
        System.out.println(car instanceof Car);      // true
        System.out.println(car instanceof Vehicle);  // true
        System.out.println(car instanceof Object);   // true
    }
}

class Vehicle {
    String brand;  // public — inherited by subclasses
    int year;
    private String secret = "internal"; // NOT accessible in Car

    Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    void start() {
        System.out.println(brand + " vehicle starting...");
    }

    String getSecret() { return secret; } // accessible via this getter
}

class Car extends Vehicle {
    int doors;

    Car(String brand, int year, int doors) {
        super(brand, year); // initialize Vehicle part first
        this.doors = doors;
    }

    void honk() {
        System.out.println(brand + " goes beep!");
        // System.out.println(secret); // COMPILE ERROR: private not accessible
        System.out.println(getSecret()); // OK: via inherited public method
    }

    @Override
    public String toString() {
        return "Car[" + brand + ", " + year + ", " + doors + " doors]";
    }
}`,
  codeTitle: 'Inheritance — Access, Constructors, and instanceof',
  points: [
    'extends creates an IS-A relationship: Car IS-A Vehicle; every Car has all Vehicle fields and methods',
    'Private members are not accessible in subclasses; use protected or public getters/setters',
    'Constructors are not inherited — always call super() to initialize the parent part; if omitted, Java inserts a no-arg super() call automatically',
    'Every Java class implicitly extends Object — giving all classes toString(), equals(), hashCode(), getClass() etc.',
    'instanceof works transitively: a Car instance returns true for Car, Vehicle, and Object',
    'Java allows single inheritance for classes — a class can extend exactly one other class',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If the parent class has no no-arg constructor (only a parameterized one), you MUST call super(args) as the first line in every child constructor. Forgetting this is a compile error: "constructor Vehicle() is undefined".',
    },
    {
      type: 'tip',
      content: 'Use @Override when you intend to override a parent method. If the parent method signature changes (renamed, parameter type changed), @Override makes the compiler catch the mismatch. Without it, you would accidentally introduce a new method instead of overriding.',
    },
    {
      type: 'interview',
      content: 'Q: Are constructors inherited in Java?\nA: No. Constructors are not inherited. However, the child must (implicitly or explicitly) call a parent constructor via super() to ensure the parent part is properly initialized.',
    },
  ],
}
