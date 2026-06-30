export default {
  id: 'dynamic-method-dispatch',
  title: '68. Dynamic Method Dispatch',
  explanation: `**Dynamic Method Dispatch** (DMD) is the mechanism by which Java resolves overridden method calls at **runtime** based on the actual type of the object, not the declared type of the reference.

This is the engine behind runtime polymorphism.

**How it works:**
\`\`\`java
Animal a = new Dog(); // reference type: Animal; object type: Dog
a.sound();            // DMD kicks in: looks at object type (Dog), calls Dog.sound()
\`\`\`

**Step by step:**
1. Compiler sees \`a.sound()\` — checks that \`Animal\` has a \`sound()\` method ✅
2. At runtime, JVM looks at the vtable (method dispatch table) of the actual object
3. The actual object is a \`Dog\` → calls \`Dog.sound()\`

**vtable (virtual dispatch table):**
Each class has a vtable — a table mapping method signatures to the class's implementation. When a subclass overrides a method, it updates the vtable entry. The JVM uses this table for every virtual (non-static, non-private, non-final) method call.

**What DMD enables:**
\`\`\`java
void makeSound(Animal a) { a.sound(); } // works for any Animal subtype
makeSound(new Dog());   // calls Dog.sound()
makeSound(new Cat());   // calls Cat.sound()
makeSound(new Bird());  // calls Bird.sound()
\`\`\`
Adding Bird does not require changing \`makeSound()\`. This is the Open/Closed Principle.

**DMD is NOT used for:**
- \`static\` methods (compiled away at compile time)
- \`private\` methods (not visible to subclasses)
- \`final\` methods (JVM can optimize — devirtualize)`,
  code: `public class DynamicMethodDispatch {
    public static void main(String[] args) {
        // All references are of type Animal — actual objects differ
        Animal a1 = new Animal();
        Animal a2 = new Dog();
        Animal a3 = new Cat();

        // DMD in action: JVM checks actual type at runtime
        a1.sound();  // Animal.sound() → generic sound
        a2.sound();  // Dog.sound()    → Woof
        a3.sound();  // Cat.sound()    → Meow

        // Array: generic reference, polymorphic behavior
        Animal[] zoo = { new Dog(), new Cat(), new Dog(), new Animal() };
        processAll(zoo);
    }

    // This method works correctly for ANY current or future Animal subclass
    static void processAll(Animal[] arr) {
        for (Animal a : arr) {
            a.sound(); // DMD selects the right implementation at each iteration
        }
    }
}

class Animal {
    void sound() { System.out.println("...generic animal sound..."); }
}

class Dog extends Animal {
    @Override void sound() { System.out.println("Woof!"); }
    void fetch() { System.out.println("Fetching!"); } // Dog-only method
}

class Cat extends Animal {
    @Override void sound() { System.out.println("Meow!"); }
}
// Note: a2.fetch() would be a COMPILE ERROR — Animal reference doesn't know about fetch()
// Cast needed: ((Dog)a2).fetch();`,
  codeTitle: 'Dynamic Method Dispatch — Runtime Method Selection',
  points: [
    'DMD selects the method implementation at runtime based on the actual heap object, not the reference\'s declared type',
    'Only overridden instance methods use DMD; static, private, and final methods do not',
    'The JVM uses a vtable (method dispatch table) per class to perform this lookup efficiently',
    'Methods accessible through a parent-type reference are only those declared in the parent type — the compiler enforces this',
    'Dog-specific methods (fetch()) are not accessible through an Animal reference without a cast — the compiler catches this',
    'DMD is what allows the Open/Closed Principle: processAll() does not need to change when new Animal subclasses are added',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You can only call methods declared on the REFERENCE type, not methods unique to the actual object type. Animal a = new Dog(); a.fetch() is a compile error because Animal has no fetch(). Cast to Dog first: ((Dog)a).fetch().',
    },
    {
      type: 'tip',
      content: 'DMD adds a tiny runtime cost (vtable lookup) per virtual call. The JVM JIT can eliminate it for final methods or when it can prove the object type statically (monomorphic call sites). In practice, the cost is negligible.',
    },
    {
      type: 'interview',
      content: 'Q: What is dynamic method dispatch in Java?\nA: Dynamic method dispatch (DMD) is the runtime mechanism that resolves an overridden method call based on the actual type of the object on the heap, not the declared type of the reference. It is the engine behind runtime polymorphism.',
    },
  ],
}
