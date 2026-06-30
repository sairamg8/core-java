export default {
  id: 'more-on-interfaces',
  title: '83. More on Interfaces',
  explanation: `Building on the basics, this topic covers advanced interface features: implementing multiple interfaces, interface inheritance (one interface extending another), default method conflicts, and the rules around interface method resolution.

A class can implement multiple interfaces: \`class MyClass implements A, B, C\`. If two interfaces define a default method with the same signature, the implementing class MUST override it to resolve the ambiguity — the compiler enforces this.

Interfaces can extend other interfaces using \`extends\` (and even multiple interfaces at once). This builds interface hierarchies and lets you compose contracts. A class implementing a child interface must fulfill all methods from the entire hierarchy.

Since Java 9, interfaces can also have \`private\` methods (non-default, non-static) to share code between default methods without exposing it as part of the public contract.`,
  code: `interface Flyable {
    void fly();
    default void describe() {
        System.out.println("I can fly");
    }
}

interface Swimmable {
    void swim();
    default void describe() {
        System.out.println("I can swim");
    }
}

// Interface extending another interface
interface Aquatic extends Swimmable {
    void dive();
}

// Class implementing multiple interfaces
// Must override describe() because both Flyable and Swimmable define it
class Duck implements Flyable, Swimmable {
    @Override
    public void fly() {
        System.out.println("Duck flies");
    }
    @Override
    public void swim() {
        System.out.println("Duck swims");
    }
    @Override
    public void describe() {
        // Can delegate to either via InterfaceName.super.method()
        Flyable.super.describe();
        Swimmable.super.describe();
        System.out.println("I am a Duck");
    }
}

class Dolphin implements Aquatic {
    @Override
    public void swim() { System.out.println("Dolphin swims"); }
    @Override
    public void dive() { System.out.println("Dolphin dives deep"); }
}

public class Demo {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.fly();
        d.swim();
        d.describe();  // calls overridden method

        Dolphin dol = new Dolphin();
        dol.swim();
        dol.dive();
    }
}`,
  codeTitle: 'Multiple Interfaces and Default Method Conflict',
  points: [
    'A class can implement multiple interfaces separated by commas',
    'When two interfaces provide conflicting default methods with the same signature, the implementing class must override the method',
    'Use InterfaceName.super.method() to delegate to a specific interface default implementation',
    'An interface can extend one or more other interfaces using extends',
    'A class implementing a child interface must implement all abstract methods from the entire interface hierarchy',
    'Java 9 private interface methods allow sharing code between default methods without polluting the public API',
    'Static interface methods are not inherited by implementing classes — they must be called via the interface name',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Static methods in interfaces are NOT inherited by implementing classes or sub-interfaces. You cannot call MyInterface.staticMethod() through an implementing class reference — it must be called as MyInterface.staticMethod().',
    },
    {
      type: 'interview',
      content: 'Q: How does Java resolve the diamond problem with interfaces?\nA: Java forces the implementing class to explicitly override any conflicting default method. The class can then choose which default to call using InterfaceName.super.method(), or provide a completely new implementation. This avoids ambiguity at runtime.',
    },
    {
      type: 'tip',
      content: 'Use interface hierarchies to build composable contracts. For example, AutoCloseable is extended by Closeable which is extended by InputStream — each adding more specificity to the contract.',
    },
  ],
}
