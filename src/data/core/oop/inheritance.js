export default {
  id: 'inheritance',
  title: '3. Inheritance',
  explanation: `**Inheritance** lets a class (child) acquire properties and methods of another class (parent) via **extends**. Java supports single class inheritance only but multiple interface implementation.

**super** keyword: access parent members and call parent constructor.

**Method Overriding rules (all must match):**
1. Same method name and parameter list
2. Return type same OR covariant (subtype of parent return)
3. Access modifier same or LESS restrictive (not more)
4. Can throw fewer/narrower checked exceptions
5. Cannot override: static, final, private methods`,
  code: `public class Animal {
    protected String name;

    public Animal(String name) { this.name = name; }

    public void makeSound() {
        System.out.println(name + " makes a sound");
    }

    public String describe() {
        return "Animal: " + name;
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);        // call parent constructor — MUST be first
        this.breed = breed;
    }

    @Override               // annotation helps compiler catch errors
    public void makeSound() {
        System.out.println(name + " barks!");  // access inherited field
    }

    @Override
    public String describe() {
        return super.describe() + ", Breed: " + breed;  // reuse parent method
    }
}

// Runtime polymorphism — reference type = Animal, actual object = Dog
Animal a = new Dog("Rex", "Lab");
a.makeSound();     // "Rex barks!" — Dog.makeSound() is called (dynamic dispatch)
a.describe();      // "Animal: Rex, Breed: Lab"

// Type checking
System.out.println(a instanceof Dog);    // true
System.out.println(a instanceof Animal); // true`,
  points: [
    'Java does NOT support multiple class inheritance — prevents the Diamond Problem',
    '@Override annotation is optional but strongly recommended — catches typos at compile time',
    'Constructors are not inherited but the parent constructor runs via super()',
    'Object class is the implicit parent of every Java class — toString, equals, hashCode come from it',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Can we override a static method?\nA: No — it gets HIDDEN, not overridden. The method called depends on the declared reference type (compile-time), not the actual object type (runtime). There is no dynamic dispatch for static methods.',
    },
    {
      type: 'gotcha',
      content: 'Covariant return type: a child can override a method and return a more specific type. Example: parent returns Animal, child can return Dog (a subtype). But the reverse (returning a broader type) is not allowed.',
    },
  ],
}
