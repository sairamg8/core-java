export default {
  id: 'encapsulation',
  title: '2. Encapsulation',
  explanation: `**Encapsulation** = bundling data + behavior together and hiding internal details from the outside world.

Implementation: private fields + public getters/setters with validation logic.

Access modifier visibility:`,
  table: {
    headers: ['Modifier', 'Same Class', 'Same Package', 'Subclass', 'Everywhere'],
    rows: [
      ['public',    '✓', '✓', '✓', '✓'],
      ['protected', '✓', '✓', '✓', '✗'],
      ['default',   '✓', '✓', '✗', '✗'],
      ['private',   '✓', '✗', '✗', '✗'],
    ],
  },
  code: `public class BankAccount {
    private double balance;      // hidden from outside
    private final String id;     // immutable after construction

    public BankAccount(String id, double initial) {
        if (initial < 0) throw new IllegalArgumentException("Negative balance");
        this.id = id;
        this.balance = initial;
    }

    // Read-only access
    public double getBalance() { return balance; }
    public String getId()      { return id; }

    // State changes only through validated methods
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }
}

// Outside code cannot bypass rules:
// account.balance = -9999;   ← compile error — private field`,
  points: [
    'protected gives subclass access across packages — broader than package-private (default)',
    'Encapsulation enables you to change internal implementation without breaking callers',
    'JavaBeans convention: private fields + public getters/setters + public no-arg constructor',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the benefit of using getters/setters vs public fields?\nA: Validation in setters, computed/lazy properties in getters, ability to make fields read-only (getter only), thread-safety (synchronized getter/setter), and the ability to refactor internals without changing the public API.',
    },
    {
      type: 'note',
      content: 'Records (Java 16) provide a compact immutable data class with auto-generated getters (accessors), equals, hashCode, toString. They enforce encapsulation by design — fields are always private final.',
    },
  ],
}
