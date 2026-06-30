export default {
  id: 'need-for-interface',
  title: '84. Need for an Interface',
  explanation: `Why do we need interfaces when we already have abstract classes? There are several compelling reasons.

First, Java does not support multiple class inheritance — a class can extend only one parent class. Interfaces fill this gap: a class can implement any number of interfaces, gaining behaviors from multiple contracts simultaneously.

Second, interfaces enforce a strict contract. They define the "what" completely, with zero implementation leaking in (for abstract methods). This makes the boundary between modules crystal clear. With an abstract class, it is possible to accidentally couple to a partial implementation.

Third, interfaces enable powerful polymorphism and dependency injection. You can write code against interface types (List, Comparable, Runnable) and any conforming class works — you swap implementations without changing callers.

Fourth, interfaces represent pure abstraction — ideal for defining APIs, callbacks, strategies, and service contracts. The strategy design pattern, command pattern, observer pattern, and most Java framework extension points (Spring beans, JDBC drivers, JPA providers) rely on interfaces.

In summary: use an interface when you want to define a shared contract with zero inherited implementation; use an abstract class when you want to share both contract and partial implementation.`,
  code: `// Without interface — tight coupling
class MySorter {
    // must know the exact type
    public void sort(ArrayList<Integer> list) { /* ... */ }
}

// With interface — loose coupling
interface Sortable {
    void sort();
    int size();
}

class BubbleSort implements Sortable {
    private int[] data;
    BubbleSort(int[] data) { this.data = data; }
    @Override public void sort() { System.out.println("Bubble sorting " + data.length + " elements"); }
    @Override public int size() { return data.length; }
}

class QuickSort implements Sortable {
    private int[] data;
    QuickSort(int[] data) { this.data = data; }
    @Override public void sort() { System.out.println("Quick sorting " + data.length + " elements"); }
    @Override public int size() { return data.length; }
}

// Caller works with any Sortable — strategy pattern
class SortRunner {
    private Sortable strategy;
    SortRunner(Sortable strategy) { this.strategy = strategy; }
    void run() {
        System.out.println("Sorting " + strategy.size() + " elements...");
        strategy.sort();
    }
}

public class Demo {
    public static void main(String[] args) {
        int[] data = {5, 3, 1, 4, 2};

        SortRunner runner = new SortRunner(new BubbleSort(data));
        runner.run();  // Bubble sorting 5 elements

        runner = new SortRunner(new QuickSort(data));
        runner.run();  // Quick sorting 5 elements
        // Caller never changed — only the strategy did
    }
}`,
  codeTitle: 'Why Interfaces Enable Flexible Design',
  points: [
    'Interfaces enable multiple inheritance of type — a class can implement many interfaces',
    'They enforce a strict API contract with no implementation leaking to implementors',
    'Interfaces decouple callers from implementations, making code easier to test and swap',
    'Most Java design patterns (Strategy, Observer, Command, Factory) are built on interfaces',
    'Java standard library uses interfaces extensively: List, Map, Runnable, Comparable, Serializable',
    'Interfaces are the foundation of dependency injection frameworks (Spring, Guice)',
    'Use interfaces for cross-cutting capabilities (Cloneable, Serializable) that many unrelated classes need',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'An empty interface (marker interface) like Serializable has no methods but still serves a purpose — it marks a class for special treatment. Instanceof checks on marker interfaces are common in frameworks.',
    },
    {
      type: 'interview',
      content: 'Q: When would you choose an interface over an abstract class?\nA: Choose an interface when: (1) multiple inheritance of type is needed, (2) you want zero shared implementation, (3) you are defining an API for unrelated classes (e.g., Comparable is implemented by String, Integer, Date — very different classes). Choose an abstract class when related classes share significant implementation code.',
    },
    {
      type: 'tip',
      content: 'Name interfaces as adjectives or capabilities when possible: Runnable, Comparable, Iterable, Serializable. This signals that the interface grants a behavior or quality rather than being a thing.',
    },
  ],
}
