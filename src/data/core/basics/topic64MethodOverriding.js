export default {
  id: 'method-overriding',
  title: '64. Method Overriding',
  explanation: `**Method overriding** occurs when a subclass defines a method with the **exact same name, return type, and parameter list** as a method in its superclass. The subclass version replaces the parent's version for that object.

**Rules for overriding:**
- Same method name
- Same parameter list (types and count)
- Same or covariant return type (subtype of parent's return type is allowed since Java 5)
- Same or wider access modifier (cannot narrow: protected → private is illegal)
- Cannot throw broader checked exceptions than the parent
- Use \`@Override\` annotation to tell the compiler you intend to override (compiler validates it)

**How it works — dynamic dispatch:**
The JVM decides which version to call **at runtime** based on the actual object type, not the reference type:
\`\`\`java
Animal a = new Dog(); // reference is Animal, object is Dog
a.sound();            // calls Dog.sound() — runtime decision
\`\`\`
This is **runtime polymorphism** (dynamic method dispatch).

**Overriding vs Overloading:**
| | Overriding | Overloading |
|--|-----------|-------------|
| Location | Subclass | Same class |
| Parameters | Same | Different |
| Return type | Same/covariant | Any |
| Resolved | Runtime | Compile time |
| Polymorphism | Runtime | Compile time |

**Cannot override:**
- \`static\` methods (can be hidden, not overridden)
- \`final\` methods
- \`private\` methods (not visible in subclass)`,
  code: `public class MethodOverriding {
    public static void main(String[] args) {
        // Reference type: Animal — actual type varies at runtime
        Animal[] animals = { new Animal(), new Dog(), new Cat(), new Bird() };

        for (Animal a : animals) {
            a.sound(); // DYNAMIC DISPATCH — correct version called at runtime
        }

        // Covariant return type
        Animal a = new Dog();
        // Dog.clone() returns Dog (covariant), still assignable to Animal
    }
}

class Animal {
    void sound() { System.out.println("..."); }
    void eat()   { System.out.println("Animal eats"); }
}

class Dog extends Animal {
    @Override
    void sound() { System.out.println("Woof!"); } // overrides Animal.sound()

    @Override
    void eat() {
        super.eat();                  // reuse parent
        System.out.println("Dog also sniffs food");
    }
}

class Cat extends Animal {
    @Override
    void sound() { System.out.println("Meow!"); }
}

class Bird extends Animal {
    @Override
    void sound() { System.out.println("Tweet!"); }

    // Narrowing access — illegal:
    // @Override private void eat() {} // COMPILE ERROR: weaker access
}`,
  codeTitle: 'Method Overriding and Dynamic Dispatch',
  points: [
    'Overriding replaces the parent method for a specific subtype — same signature, different body',
    '@Override annotation is optional but critical: it makes the compiler validate the override and catches typos or signature mismatches',
    'Dynamic dispatch means the JVM looks at the actual runtime type to decide which method to call — enabling polymorphism',
    'Access modifier can only be widened: private → package → protected → public; narrowing causes compile error',
    'final methods cannot be overridden; static methods cannot be overridden (only hidden); private methods are invisible to subclasses',
    'Covariant return types (returning a more specific type in the override) are legal since Java 5',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Not using @Override and misspelling the method name creates a new method instead of an override — the parent\'s version still runs. @Override makes the compiler catch this immediately. Always use it.',
    },
    {
      type: 'tip',
      content: 'Dynamic dispatch is the heart of the Open/Closed Principle: code that uses Animal references stays unchanged when you add a new subclass (Lion, Tiger) — just add the new class with its override.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between method overriding and method hiding?\nA: Overriding (instance methods) is resolved at runtime based on the object\'s actual type — true polymorphism. Hiding (static methods) is resolved at compile time based on the reference type — no polymorphism. Only overriding triggers dynamic dispatch.',
    },
  ],
}
