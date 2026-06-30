export default {
  id: 'access-modifiers',
  title: '66. Access Modifiers',
  explanation: `**Access modifiers** control the visibility of classes, methods, fields, and constructors. They are Java's primary encapsulation mechanism.

**The four access levels:**

| Modifier | Same class | Same package | Subclass (any package) | Any package |
|----------|:---:|:---:|:---:|:---:|
| \`public\` | ✅ | ✅ | ✅ | ✅ |
| \`protected\` | ✅ | ✅ | ✅ | ❌ |
| (no modifier) | ✅ | ✅ | ❌ | ❌ |
| \`private\` | ✅ | ❌ | ❌ | ❌ |

**public:**
Open to the world. Use for API methods that external callers need.

**protected:**
Open within the package + subclasses outside the package. Use for members that subclasses need to override or access, but external callers do not.

**Package-private (no modifier):**
Default access. Visible only within the same package. Use for implementation helpers that should not be exposed outside the package.

**private:**
Tightest restriction. Only the same class. Use for all fields (encapsulation) and internal helper methods.

**Best practice — principle of least privilege:**
- Fields: always \`private\`
- Methods that are part of the API: \`public\`
- Methods only for subclasses: \`protected\`
- Internal helpers: \`private\`

**Class-level modifiers:**
Top-level classes can only be \`public\` or package-private. Inner classes can also be \`protected\` or \`private\`.`,
  code: `// Everything in the same package (com.example.bank)
public class AccessModifiers {
    private   String accountNumber; // only this class
    protected double balance;       // this class + subclasses + same package
    String     customerName;        // package-private: same package only
    public     String currency;     // anyone

    public AccessModifiers(String accNum, double balance, String name, String currency) {
        this.accountNumber = accNum;
        this.balance = balance;
        this.customerName = name;
        this.currency = currency;
    }

    private void logAccess() {           // internal helper only
        System.out.println("Accessed: " + accountNumber);
    }

    protected double getBalance() {      // subclasses can call this
        logAccess();
        return balance;
    }

    public void deposit(double amount) { // public API
        if (amount > 0) { balance += amount; logAccess(); }
    }

    // Subclass in another package
    // class SavingsAccount extends AccessModifiers {
    //     void addInterest() {
    //         balance += balance * 0.05; // OK: balance is protected
    //         System.out.println(accountNumber); // ERROR: private
    //     }
    // }
}`,
  codeTitle: 'All Four Access Modifiers in Context',
  points: [
    'private restricts to the declaring class only — use for all fields and internal helpers (principle of encapsulation)',
    'protected extends to subclasses in any package — used for template method patterns and framework hook points',
    'Package-private (no modifier) is the default — useful for package-internal utilities that should not be part of the public API',
    'public should be used sparingly — every public member is API surface that you must maintain and backward-compatible',
    'Widening access is allowed in overrides (private → public); narrowing is not (public → protected causes compile error)',
    'Top-level classes can only be public or package-private; nested/inner classes can use all four modifiers',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'protected in Java is more permissive than in C++ — it includes same-package access in addition to subclass access. So package-private is actually MORE restrictive than protected in Java.',
    },
    {
      type: 'tip',
      content: 'Start with private, loosen only when needed. The discipline: "If callers in the same package need it → package-private. If subclasses in other packages need it → protected. If the public API needs it → public."',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between private and package-private (default) access?\nA: private means only the declaring class. Package-private (no modifier) means any class in the same package can access it. A subclass in a different package cannot access package-private members.',
    },
  ],
}
