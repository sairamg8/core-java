export default {
  id: 'single-and-multilevel-inheritance',
  title: '61. Single and Multilevel Inheritance',
  explanation: `Java supports two key forms of class inheritance: **single** and **multilevel**.

**Single Inheritance:**
One class extends exactly one other class.
\`\`\`
Animal ← Dog
\`\`\`
\`class Dog extends Animal {}\`

This is the only class-to-class inheritance pattern Java allows directly. (Multiple class inheritance is not supported.)

**Multilevel Inheritance:**
A chain of inheritance spanning three or more levels.
\`\`\`
Animal ← Mammal ← Dog
\`\`\`
\`\`\`java
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}
\`\`\`
\`Dog\` inherits from \`Mammal\`, which inherits from \`Animal\`. \`Dog\` gets all members from both.

**How super() works in a chain:**
When \`new Dog()\` is called:
1. Dog constructor calls \`super()\` → Mammal constructor
2. Mammal constructor calls \`super()\` → Animal constructor
3. Animal constructor calls \`super()\` → Object constructor
4. Object initialized → Animal → Mammal → Dog

**Diamond problem:**
Java does NOT support multiple class inheritance (\`class C extends A, B\`) to avoid the diamond problem (ambiguity when A and B both define the same method). Interfaces with default methods come close but have explicit resolution rules.

**Hierarchical inheritance:**
Multiple classes extending the same parent:
\`\`\`
Animal ← Dog
       ← Cat
       ← Bird
\`\`\``,
  code: `public class SingleAndMultilevel {
    public static void main(String[] args) {
        // Multilevel: GuideDog → Dog → Animal → Object
        GuideDog g = new GuideDog("Buddy", "Labrador", "John");
        g.eat();    // from Animal
        g.bark();   // from Dog
        g.guide();  // from GuideDog
        System.out.println(g.name);   // from Animal
        System.out.println(g.breed);  // from Dog
        System.out.println(g.owner);  // from GuideDog

        // instanceof works through the entire chain
        System.out.println(g instanceof GuideDog); // true
        System.out.println(g instanceof Dog);       // true
        System.out.println(g instanceof Animal);    // true
        System.out.println(g instanceof Object);    // true
    }
}

class Animal {
    String name;
    Animal(String name) {
        this.name = name;
        System.out.println("Animal constructed: " + name);
    }
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    String breed;
    Dog(String name, String breed) {
        super(name); // initialize Animal
        this.breed = breed;
        System.out.println("Dog constructed: breed=" + breed);
    }
    void bark() { System.out.println(name + " barks!"); }
}

class GuideDog extends Dog {
    String owner;
    GuideDog(String name, String breed, String owner) {
        super(name, breed); // initialize Dog (which initializes Animal)
        this.owner = owner;
        System.out.println("GuideDog constructed: owner=" + owner);
    }
    void guide() { System.out.println(name + " guides " + owner); }
}
// Constructor call order: Animal → Dog → GuideDog (top-down)`,
  codeTitle: 'Multilevel Inheritance — Animal → Dog → GuideDog',
  points: [
    'Single inheritance: one class extends one parent — the simplest and most common form',
    'Multilevel inheritance: a chain (A ← B ← C) where C inherits from B which inherits from A',
    'When new C() is called, constructors fire top-down: A then B then C — each must call super() first',
    'Java does NOT allow multiple class inheritance (class C extends A, B) — prevents the diamond ambiguity problem',
    'Hierarchical inheritance: multiple subclasses extending the same parent (Dog, Cat, Bird all extend Animal)',
    'instanceof is transitive: a GuideDog instance is also a Dog and an Animal and an Object',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Keep inheritance hierarchies shallow (2-3 levels max). Deep chains become hard to follow and debug. If you find yourself at level 5+, consider refactoring with interfaces or composition.',
    },
    {
      type: 'gotcha',
      content: 'In multilevel inheritance, each constructor must call super() before doing anything. If you omit it and the parent has no no-arg constructor, you get a compile error: "constructor X() is not defined". Be explicit.',
    },
    {
      type: 'interview',
      content: 'Q: Why does Java not support multiple class inheritance?\nA: To avoid the diamond problem — if classes A and B both define method foo(), and C extends both, it is ambiguous which foo() C should inherit. Java solves this by allowing only single class inheritance; multiple behavior inheritance is handled via interfaces.',
    },
  ],
}
