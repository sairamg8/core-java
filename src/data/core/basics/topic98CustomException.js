export default {
  id: 'custom-exception',
  title: '98. Custom Exception',
  explanation: `While Java's built-in exceptions cover many scenarios, real applications need domain-specific exceptions that communicate business-level errors clearly. A custom exception is a class you define that extends Exception (for checked) or RuntimeException (for unchecked).

Why create custom exceptions?
- They carry domain-specific meaning: \`InsufficientFundsException\` is far clearer than \`IllegalStateException\`.
- They can carry extra data: an \`InsufficientFundsException\` can hold the requested amount and the available balance.
- They establish a hierarchy for your domain: \`BankException > AccountException > InsufficientFundsException\`.
- They let callers catch your specific exception type without catching all exceptions.

Convention for custom exceptions:
1. Name ends in \`Exception\`.
2. Provide at least: a no-arg constructor, a String message constructor, and a cause constructor.
3. For extra data, add fields and a constructor that accepts them.
4. Extend RuntimeException unless callers are expected to explicitly handle and recover.`,
  code: `// --- Custom unchecked exception with extra data ---
class InsufficientFundsException extends RuntimeException {
    private final double requested;
    private final double available;

    InsufficientFundsException(double requested, double available) {
        super(String.format("Cannot withdraw %.2f; only %.2f available",
              requested, available));
        this.requested = requested;
        this.available = available;
    }

    public double getRequested() { return requested; }
    public double getAvailable() { return available; }
}

// --- Custom checked exception ---
class InvalidAccountException extends Exception {
    private final String accountId;

    InvalidAccountException(String accountId) {
        super("Account not found: " + accountId);
        this.accountId = accountId;
    }

    // Constructor that wraps a cause
    InvalidAccountException(String accountId, Throwable cause) {
        super("Account not found: " + accountId, cause);
        this.accountId = accountId;
    }

    public String getAccountId() { return accountId; }
}

// --- Exception hierarchy for a domain ---
class BankException extends RuntimeException {
    BankException(String message) { super(message); }
    BankException(String message, Throwable cause) { super(message, cause); }
}

class AccountFrozenException extends BankException {
    AccountFrozenException(String accountId) {
        super("Account " + accountId + " is frozen");
    }
}

// Using custom exceptions
class BankAccount {
    private String id;
    private double balance;

    BankAccount(String id, double balance) {
        this.id = id;
        this.balance = balance;
    }

    void withdraw(double amount) {
        if (amount > balance) {
            throw new InsufficientFundsException(amount, balance);
        }
        balance -= amount;
        System.out.printf("Withdrew %.2f; balance now %.2f%n", amount, balance);
    }
}

public class Demo {
    static BankAccount findAccount(String id) throws InvalidAccountException {
        if (!id.startsWith("ACC")) {
            throw new InvalidAccountException(id);
        }
        return new BankAccount(id, 500.0);
    }

    public static void main(String[] args) {
        // Unchecked custom exception
        try {
            BankAccount acc = new BankAccount("ACC001", 100.0);
            acc.withdraw(200.0);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
            System.out.printf("Shortfall: %.2f%n", e.getRequested() - e.getAvailable());
        }

        // Checked custom exception
        try {
            BankAccount acc = findAccount("INVALID");
        } catch (InvalidAccountException e) {
            System.out.println("Error: " + e.getMessage());
            System.out.println("Bad ID: " + e.getAccountId());
        }
    }
}`,
  codeTitle: 'Custom Exception Classes with Domain Data',
  points: [
    'Extend RuntimeException for unchecked custom exceptions (most common in modern Java)',
    'Extend Exception for checked custom exceptions when callers are expected to handle specific recovery',
    'Always provide at minimum: a String message constructor and a (String, Throwable) chaining constructor',
    'Add fields for domain data (amount, accountId) so callers can access structured info beyond just the message',
    'Custom exception hierarchies (BankException > AccountFrozenException) let callers catch at any level of specificity',
    'Name exceptions with the Exception suffix so they are clearly identifiable',
    'In frameworks, most exceptions are unchecked — checked exceptions can force verbose try-catch on every call',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you extend Exception (checked) without providing a (String, Throwable cause) constructor, callers cannot chain your exception with a root cause using the standard pattern. Always include the cause constructor.',
    },
    {
      type: 'interview',
      content: 'Q: Should you use checked or unchecked custom exceptions?\nA: Modern Java (and frameworks like Spring) strongly prefer unchecked. Checked exceptions force callers to handle or declare — adding friction. Unless the caller can genuinely recover in a specific way, unchecked is cleaner. Use checked for domain errors where the caller has a real recovery option (e.g., retry, use a default).',
    },
    {
      type: 'tip',
      content: 'Include structured data in custom exceptions rather than only a message string. A parser that throws ParseException("Invalid date: 2024-13-45") is good; one that also stores the invalid date string as a field is better — the caller can programmatically extract and display it.',
    },
  ],
}
