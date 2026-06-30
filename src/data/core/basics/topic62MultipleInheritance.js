export default {
  id: 'multiple-inheritance',
  title: '62. Multiple Inheritance',
  explanation: `**Multiple inheritance** means a class inherits from more than one parent. Java **does not support multiple class inheritance** — \`class C extends A, B\` is a compile error. This is a deliberate design choice to avoid the **diamond problem**.

**Diamond Problem:**
\`\`\`
     A (void show())
    / \\
   B   C   (both override show())
    \\ /
     D extends B, C  // which show() does D get? Ambiguous!
\`\`\`

**Java's solution: interfaces**
Java achieves multiple-behavior inheritance via **interfaces**, which a class can implement many of:
\`\`\`java
class Robot implements Flyable, Swimmable, Hackable { ... }
\`\`\`

**Default method conflict (Java 8+):**
When two interfaces provide the same default method, the implementing class MUST override it to resolve the ambiguity:
\`\`\`java
interface A { default void hello() { System.out.println("A"); } }
interface B { default void hello() { System.out.println("B"); } }
class C implements A, B {
    @Override
    public void hello() { A.super.hello(); } // explicitly choose A's version
}
\`\`\`

**Summary of inheritance in Java:**
| Scenario | Allowed? |
|----------|---------|
| class extends one class | Yes |
| class extends two classes | No |
| class implements many interfaces | Yes |
| interface extends many interfaces | Yes |`,
  code: `// Multiple INTERFACE implementation (Java's answer to multiple inheritance)
interface Flyable {
    void fly();
    default String getMode() { return "air"; }
}

interface Swimmable {
    void swim();
    default String getMode() { return "water"; } // conflict with Flyable
}

// Class implementing both interfaces must resolve the default method conflict
class Duck implements Flyable, Swimmable {
    String name;
    Duck(String name) { this.name = name; }

    @Override
    public void fly() { System.out.println(name + " flies"); }

    @Override
    public void swim() { System.out.println(name + " swims"); }

    // MUST override conflicting default method
    @Override
    public String getMode() {
        return Flyable.super.getMode() + " & " + Swimmable.super.getMode();
    }
}

public class MultipleInheritance {
    public static void main(String[] args) {
        Duck d = new Duck("Donald");
        d.fly();
        d.swim();
        System.out.println("Modes: " + d.getMode()); // air & water

        // Multiple interface types
        Flyable f = d;  f.fly();
        Swimmable s = d; s.swim();

        // Interface can extend multiple interfaces
        // interface AmphibiousVehicle extends Flyable, Swimmable { }
    }
}`,
  codeTitle: 'Multiple Inheritance via Interfaces — Default Method Conflict',
  points: [
    'Java forbids multiple class inheritance (class C extends A, B) to prevent the diamond ambiguity problem',
    'Multiple behavior inheritance is achieved through interfaces — a class can implement any number of interfaces',
    'If two interfaces define the same default method, the implementing class must @Override it and explicitly pick one with InterfaceName.super.method()',
    'Interfaces can extend multiple interfaces: interface C extends A, B {} — only class cannot extend multiple classes',
    'Abstract classes follow the same single-inheritance rule as concrete classes — one parent only',
    'The diamond problem is a real practical issue in C++ multiple inheritance; Java\'s interface approach avoids it by requiring explicit resolution',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting to resolve a conflicting default method causes a compile error: "class C inherits unrelated defaults for method from types A and B". The fix is a mandatory @Override in the implementing class.',
    },
    {
      type: 'tip',
      content: 'Think of interfaces as "role contracts" — a Duck plays the Flyable role AND the Swimmable role. Multiple roles are fine; Java just forbids inheriting state and implementation from multiple classes at once.',
    },
    {
      type: 'interview',
      content: 'Q: Does Java support multiple inheritance?\nA: Not for classes — only single class inheritance is allowed to prevent the diamond problem. Java supports multiple inheritance of type (via interfaces) and, since Java 8, partial multiple inheritance of behavior (via default interface methods, with explicit conflict resolution required).',
    },
  ],
}
