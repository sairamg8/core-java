export default {
  id: 'need-for-inheritance',
  title: '59. Need for Inheritance',
  explanation: `**Inheritance** solves the problem of code duplication between related classes. Without it, you would have to copy the same fields and methods into every similar class.

**The problem:**
\`\`\`java
class Dog { String name; void eat() {...} void bark() {...} }
class Cat { String name; void eat() {...} void meow() {...} }
class Bird { String name; void eat() {...} void fly() {...} }
\`\`\`
All three have \`name\` and \`eat()\` duplicated. Any change to \`eat()\` must be made in all three — a maintenance nightmare.

**The solution — inheritance:**
\`\`\`java
class Animal { String name; void eat() {...} }
class Dog extends Animal { void bark() {...} }
class Cat extends Animal { void meow() {...} }
\`\`\`
Now \`name\` and \`eat()\` are defined once in \`Animal\`. Dogs, Cats, and Birds inherit them automatically.

**Benefits of inheritance:**
- **Code reuse** — write common logic once in the parent
- **Extensibility** — add new types without touching existing code
- **Polymorphism enabler** — \`Animal a = new Dog()\` works because Dog IS-A Animal
- **Maintainability** — one place to fix a bug in shared behavior

**Inheritance models the IS-A relationship:**
- A \`Dog\` IS-A \`Animal\` → valid
- A \`Car\` IS-A \`Engine\` → invalid; use composition instead (HAS-A)

**Favor composition over inheritance** when the relationship is HAS-A, not IS-A. Inheritance is most appropriate for natural taxonomies where the subclass truly specializes the parent.`,
  code: `public class NeedForInheritance {
    public static void main(String[] args) {
        Dog dog = new Dog("Rex", "Labrador");
        Cat cat = new Cat("Whiskers", true);

        // Inherited method from Animal
        dog.eat();  // Rex is eating
        cat.eat();  // Whiskers is eating

        // Specific to subclass
        dog.bark();         // Rex says: Woof!
        cat.purr();         // Whiskers purrs...

        // IS-A check: Dog IS-A Animal
        System.out.println(dog instanceof Animal); // true
        System.out.println(cat instanceof Animal); // true

        // Polymorphism: Animal reference, subclass object
        Animal a = new Dog("Buddy", "Poodle");
        a.eat(); // Buddy is eating — works because Dog inherits eat()
    }
}

// Parent (base/super) class
class Animal {
    String name;

    Animal(String name) { this.name = name; }

    void eat() {
        System.out.println(name + " is eating");
    }

    void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Child (derived/sub) class — inherits all Animal members
class Dog extends Animal {
    String breed;

    Dog(String name, String breed) {
        super(name); // call Animal constructor
        this.breed = breed;
    }

    void bark() { System.out.println(name + " says: Woof!"); }
}

class Cat extends Animal {
    boolean isIndoor;

    Cat(String name, boolean isIndoor) {
        super(name);
        this.isIndoor = isIndoor;
    }

    void purr() { System.out.println(name + " purrs..."); }
}`,
  codeTitle: 'Inheritance — Eliminating Duplication Across Animal Types',
  points: [
    'Inheritance lets subclasses reuse fields and methods from the superclass without copying code',
    'Use extends to declare inheritance — Java is single-inheritance for classes (a class can extend exactly one class)',
    'The subclass IS-A superclass relationship must be genuine — prefer composition (HAS-A) when it is not',
    'super(args) calls the parent constructor; must be the first statement in the child constructor',
    'private members of the parent are not directly accessible in the child (but can be accessed via public/protected getters)',
    'instanceof checks the IS-A relationship at runtime: dog instanceof Animal returns true',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The Liskov Substitution Principle (LSP) states: a subclass should be substitutable for its parent without breaking the program. If Animal.eat() does X and Dog.eat() does Y that violates X\'s contract, the IS-A relationship is wrong.',
    },
    {
      type: 'gotcha',
      content: 'Java allows single class inheritance only (extends one class). If you need multiple behaviors, use interfaces. Trying to extends TwoClasses causes a compile error.',
    },
    {
      type: 'interview',
      content: 'Q: What is the need for inheritance?\nA: Inheritance eliminates code duplication by placing shared state and behavior in a parent class. Subclasses inherit automatically and only add or override what is specific to them. It also enables polymorphism — using a parent type reference to work with any subclass.',
    },
  ],
}
