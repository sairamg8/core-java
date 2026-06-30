export default {
  id: 'abstraction',
  title: '5. Abstraction — Abstract Classes vs Interfaces',
  explanation: `**Abstraction** hides complexity and exposes only what is necessary.

Use an **abstract class** when you have shared state and a partial implementation.
Use an **interface** when you want to define a contract (capability) that unrelated classes can implement.`,
  table: {
    headers: ['Feature', 'Abstract Class', 'Interface'],
    rows: [
      ['Instantiate', 'No', 'No'],
      ['Constructor', 'Yes', 'No'],
      ['Instance fields', 'Yes', 'No (only public static final)'],
      ['Method types', 'abstract + concrete', 'abstract, default, static, private (Java 9+)'],
      ['Multiple inheritance', 'No (single extends)', 'Yes (multiple implements)'],
      ['Access modifiers', 'Any', 'public / private (Java 9+)'],
      ['When to use', 'IS-A with shared state', 'CAN-DO / contract'],
    ],
  },
  code: `// Abstract class — partial implementation + shared state
public abstract class Vehicle {
    protected String brand;  // shared state

    public Vehicle(String brand) { this.brand = brand; }

    public abstract void start();    // subclass MUST implement
    public abstract int fuelLevel(); // subclass MUST implement

    public void stop() {             // shared concrete method
        System.out.println(brand + " stopped");
    }
}

// Interface — Java 8+ features
public interface Electric {
    int MAX_CHARGE = 100;   // implicitly: public static final

    void charge();           // implicitly: public abstract

    default void status() { // concrete default — can be overridden
        System.out.println("Charging status: Active");
    }

    static void spec() {    // cannot be overridden
        System.out.println("Electric spec v1.0");
    }

    private void log(String msg) {  // Java 9+ — only for reuse within interface
        System.out.println("[LOG] " + msg);
    }
}

// Class can extend 1 abstract class AND implement many interfaces
public class Tesla extends Vehicle implements Electric, Comparable<Tesla> {
    private int charge;

    public Tesla(String brand) { super(brand); }

    @Override public void start() { System.out.println("Silent start"); }
    @Override public int fuelLevel() { return charge; }
    @Override public void charge()   { charge = MAX_CHARGE; }
    @Override public int compareTo(Tesla other) { return this.charge - other.charge; }
}`,
  points: [
    'Functional interface = interface with exactly ONE abstract method. Lambda expressions implement them',
    'Default methods in interfaces enable backward-compatible API evolution (added in Java 8)',
    'An interface can extend multiple interfaces: interface Z extends A, B, C {}',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Diamond problem for interfaces: if class C implements both A and B, and both have default method foo(), C MUST override foo() or the compiler gives an error. This forces explicit resolution.',
    },
    {
      type: 'interview',
      content: 'Q: When to choose abstract class over interface?\nA: Abstract class when: subclasses share fields/state, you want to provide partial implementation to reduce boilerplate, or you need constructors. Interface when: defining a capability (Runnable, Serializable), unrelated classes share a contract, or multiple inheritance is needed.',
    },
  ],
}
