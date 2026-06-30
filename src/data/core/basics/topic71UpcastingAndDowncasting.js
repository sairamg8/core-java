export default {
  id: 'upcasting-and-downcasting',
  title: '71. Upcasting and Downcasting',
  explanation: `**Upcasting** and **downcasting** are operations that move an object reference up or down the inheritance hierarchy.

**Upcasting (implicit):**
Converting a subclass reference to a superclass reference. Always safe — no information is lost because every Dog IS-A Animal.
\`\`\`java
Dog d = new Dog("Rex");
Animal a = d;  // implicit upcasting — no cast operator needed
\`\`\`
After upcasting, only methods defined in Animal are accessible through \`a\` (even though the object is a Dog). The runtime still knows it is a Dog.

**Downcasting (explicit):**
Converting a superclass reference back to a subclass reference. Requires an explicit cast and may throw \`ClassCastException\` if the actual object is not of the target type.
\`\`\`java
Animal a = new Dog("Rex");  // actual object: Dog
Dog d = (Dog) a;            // explicit downcast — safe here
d.bark();                   // Dog-specific method now accessible
\`\`\`

**ClassCastException:**
\`\`\`java
Animal a = new Cat();
Dog d = (Dog) a; // ClassCastException at runtime: Cat is not a Dog
\`\`\`

**Safe downcast with instanceof:**
\`\`\`java
if (a instanceof Dog d) { // Java 16+ pattern matching
    d.bark();
}
\`\`\`
Or classic: \`if (a instanceof Dog) { ((Dog)a).bark(); }\`

**When to use:**
Upcasting enables polymorphism. Downcasting is needed when you store objects as parent-type references but later need to access subtype-specific behavior.`,
  code: `public class UpcastingDowncasting {
    public static void main(String[] args) {
        // UPCASTING: implicit, always safe
        Dog d = new Dog("Rex", "Labrador");
        Animal a = d;           // upcast: Dog → Animal
        a.eat();                // OK: eat() is in Animal
        // a.bark();            // COMPILE ERROR: Animal doesn't know bark()

        // DOWNCASTING: explicit, may throw ClassCastException
        Dog d2 = (Dog) a;      // downcast back to Dog
        d2.bark();             // OK now

        // ClassCastException if wrong type
        Animal cat = new Cat("Whiskers");
        try {
            Dog wrongCast = (Dog) cat; // Cat is NOT a Dog
        } catch (ClassCastException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        // Safe downcast: always check with instanceof first
        Animal[] animals = { new Dog("Buddy", "Poodle"), new Cat("Luna") };
        for (Animal animal : animals) {
            if (animal instanceof Dog dog) { // Java 16+ pattern matching
                System.out.println("Dog: " + dog.name + " is " + dog.breed);
                dog.bark();
            } else if (animal instanceof Cat cat) {
                cat.purr();
            }
        }
    }
}

class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    String breed;
    Dog(String name, String breed) { super(name); this.breed = breed; }
    void bark() { System.out.println(name + " barks!"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    void purr() { System.out.println(name + " purrs"); }
}`,
  codeTitle: 'Upcasting, Downcasting, and ClassCastException Prevention',
  points: [
    'Upcasting (subclass → parent) is implicit and always safe — no cast operator needed; it is widening',
    'Downcasting (parent → subclass) requires an explicit cast operator and may throw ClassCastException at runtime',
    'After upcasting, only parent-class methods are accessible via the reference, even though the object retains subclass behavior',
    'Always check with instanceof before downcasting: if (a instanceof Dog d) (Java 16+) or if (a instanceof Dog) { ((Dog)a).bark(); }',
    'Pattern matching instanceof (Java 16+) combines the check and cast: if (a instanceof Dog d) { d.bark(); } — cleaner and safer',
    'Upcasting is the mechanism that enables storing mixed subtypes in an Animal[] and working with them polymorphically',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A downcast only works if the actual heap object is of the target type. Animal a = new Cat(); Dog d = (Dog)a; compiles fine but throws ClassCastException at runtime because a Cat is not a Dog, despite both being Animals.',
    },
    {
      type: 'tip',
      content: 'Java 16+ pattern matching instanceof is the modern way to safely downcast: if (a instanceof Dog d) { d.bark(); } — it is shorter, avoids a redundant cast, and cannot throw ClassCastException if the condition is true.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between upcasting and downcasting?\nA: Upcasting converts a subclass reference to a parent type — implicit and always safe. Downcasting converts a parent reference back to a subclass type — explicit (cast operator) and may throw ClassCastException if the object is not actually that subtype.',
    },
  ],
}
