export default {
  id: 'encapsulation',
  title: '49. Encapsulation',
  explanation: `**Encapsulation** is one of the four OOP pillars. It means bundling data (fields) and the methods that operate on that data into one unit (a class), and **restricting direct external access** to the data using access modifiers.

**Why encapsulate?**
- **Control:** you decide what is readable and writable, and can validate input
- **Flexibility:** change the internal representation without breaking callers
- **Security:** prevent invalid state (e.g., age = -5 is impossible if setter validates)
- **Maintainability:** implementation details are hidden from the rest of the code

**The encapsulation recipe:**
1. Make all fields \`private\`
2. Provide public **getters** to allow controlled read access
3. Provide public **setters** to allow controlled write access (with validation)

\`\`\`java
class Person {
    private int age; // private field

    public int getAge() { return age; }   // getter

    public void setAge(int age) {         // setter with validation
        if (age > 0) this.age = age;
    }
}
\`\`\`

**Tight vs loose encapsulation:**
- All fields private + all access via getters/setters = tight (recommended)
- Some fields package-private or protected = looser (valid for framework/library design)
- Public fields = no encapsulation (avoid in production code)

**Data hiding ≠ encapsulation:**
Data hiding is one aspect of encapsulation. Encapsulation also includes bundling behavior with data. A class with all-public fields that has methods operating on them is partially encapsulated.`,
  code: `public class Encapsulation {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 1000);
        System.out.println(acc.getOwner());   // Alice
        System.out.println(acc.getBalance()); // 1000.0

        acc.deposit(500);
        System.out.println(acc.getBalance()); // 1500.0

        acc.withdraw(200);
        System.out.println(acc.getBalance()); // 1300.0

        // acc.balance = -999; // COMPILE ERROR: balance is private
        acc.withdraw(9999); // prints "Insufficient funds" — validation kicks in
    }
}

class BankAccount {
    private String owner;   // private: no direct external access
    private double balance;

    BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = (initialBalance >= 0) ? initialBalance : 0;
    }

    public String getOwner() { return owner; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        } else {
            System.out.println("Insufficient funds");
        }
    }
}`,
  codeTitle: 'Encapsulation with Validation in a BankAccount Class',
  points: [
    'Make all fields private — this is the first and most important rule of encapsulation',
    'Getters expose read access; setters expose write access with optional validation logic',
    'Without encapsulation, callers can set fields to invalid values (negative age, negative balance) — no defense',
    'Encapsulation allows you to change the internal implementation (e.g., switch balance from double to BigDecimal) without changing the public API',
    'A class with all public fields has zero encapsulation — any code anywhere can corrupt the object\'s state',
    'Records (Java 16+) provide immutable encapsulated data classes with auto-generated getters and no setters',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Most IDE tools (IntelliJ, Eclipse, VS Code) can generate getters and setters automatically. Right-click inside the class → Generate → Getter and Setter. Do not write them by hand.',
    },
    {
      type: 'gotcha',
      content: 'A getter that returns a mutable object (like a List or Date) breaks encapsulation — callers can modify the internal collection directly. Return a defensive copy: return new ArrayList<>(this.items) or Collections.unmodifiableList(items).',
    },
    {
      type: 'interview',
      content: 'Q: What is encapsulation and why is it important?\nA: Encapsulation bundles data and behavior in a class and restricts external access via access modifiers. It is important because it enforces invariants (no invalid state), hides implementation details (flexibility), and makes code safer to modify (reduced coupling).',
    },
  ],
}
