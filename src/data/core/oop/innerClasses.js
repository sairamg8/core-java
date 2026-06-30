export default {
  id: 'inner-classes',
  title: 'Inner Classes & Nested Classes',
  explanation: `Java lets you define a class inside another class. There are four varieties, each with a different relationship to the outer class.

**1. Static Nested Class**
Declared with \`static\`. Does NOT hold a reference to the outer class instance. Accessed via \`Outer.Nested\`. Behaves like a regular top-level class that happens to live inside another.

**2. Non-static Inner Class (Member Inner Class)**
No \`static\` keyword. Implicitly holds a reference to the enclosing outer object. Can access all outer class fields and methods (even private ones).

**3. Local Class**
Defined inside a method. Only visible within that method. Can access local variables of the enclosing method if they are effectively final.

**4. Anonymous Class**
A one-time-use class defined and instantiated in a single expression. Commonly used to implement an interface or extend a class inline. Replaced by lambda expressions for functional interfaces in Java 8+.`,
  code: `// 1. Static Nested Class — no outer instance needed
class Outer {
    private static int outerStatic = 10;

    static class StaticNested {
        void show() {
            System.out.println("Static nested: " + outerStatic); // OK — static
        }
    }
}
Outer.StaticNested obj = new Outer.StaticNested(); // no Outer instance needed
obj.show();

// ---

// 2. Non-static Inner Class — requires outer instance
class BankAccount {
    private double balance = 1000;

    class Transaction {        // inner class
        void deposit(double amount) {
            balance += amount; // accesses outer field directly
        }
    }
}
BankAccount account = new BankAccount();
BankAccount.Transaction tx = account.new Transaction(); // outer instance required
tx.deposit(500);

// ---

// 3. Local Class — defined inside a method
void process() {
    int multiplier = 3;        // effectively final

    class Multiplier {
        int apply(int x) { return x * multiplier; } // captures local var
    }
    System.out.println(new Multiplier().apply(5)); // 15
}

// ---

// 4. Anonymous Class — define + instantiate in one shot
Runnable r = new Runnable() {  // anonymous class implementing Runnable
    @Override
    public void run() {
        System.out.println("Running anonymously");
    }
};
r.run();

// Java 8+: lambda is cleaner for single-method interfaces
Runnable r2 = () -> System.out.println("Running with lambda");`,
  points: [
    'Static nested class: use when helper class logically belongs to the outer class but needs no outer state',
    'Non-static inner class: holds a hidden reference to the outer instance — can cause memory leaks if the inner outlives the outer',
    'Local class: can only access effectively final local variables (Java enforces this at compile time)',
    'Anonymous class: one-shot implementation; use lambda instead for @FunctionalInterface (single method)',
    'Static nested classes are more efficient — they do NOT keep the outer object alive',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between a static nested class and a non-static inner class?\nA: A static nested class has NO implicit reference to the enclosing object — you instantiate it without an outer instance (Outer.Nested n = new Outer.Nested()). A non-static inner class holds a hidden Outer.this reference and must be instantiated through an outer instance (outer.new Inner()). The static version is preferred for helper classes to avoid memory leaks.',
    },
    {
      type: 'gotcha',
      content: 'Non-static inner class instances hold a reference to the outer class. If you serialize or store the inner instance, the outer object cannot be garbage collected. This is a common source of memory leaks in Android and Swing applications.',
    },
    {
      type: 'tip',
      content: 'Prefer static nested classes over non-static inner classes unless you specifically need access to instance state of the outer class. The Builder pattern (common in Java) always uses a static nested class for the builder.',
    },
  ],
}
