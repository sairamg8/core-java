export default {
  id: 'test-in-action-junit5-basics',
  title: '144. @Test in Action: JUnit 5 Basics',
  explanation: `The @Test annotation is the cornerstone of JUnit 5. It marks a method as a test case. JUnit discovers all @Test methods in a class and executes them automatically.

**@Test method rules:**
- Must be void return type
- Must not be private or static
- Must not accept parameters (unless using parameterized test annotations)
- Can throw any exception — JUnit catches it and marks the test as failed

**Test lifecycle:**
For each @Test method, JUnit:
1. Creates a NEW instance of the test class (default is one instance per test — "per-method" lifecycle)
2. Runs any @BeforeEach methods
3. Runs the @Test method
4. Runs any @AfterEach methods

This isolation guarantees that one test cannot affect another's state.

**@DisplayName:**
Replaces the method name in test reports with a human-readable description. Use spaces, emojis, and full sentences. Makes test reports readable by non-developers.

**Disabling tests: @Disabled**
Mark a test with @Disabled (with a reason) to skip it temporarily. Disabled tests are counted but marked as ignored in the report. Never delete a broken test — disable it with a reason and fix it later.

**Assertions from Assertions class:**
All assertion methods are in org.junit.jupiter.api.Assertions. Import them statically for cleaner code:
  import static org.junit.jupiter.api.Assertions.*;`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class BankAccount {
    private double balance;

    BankAccount(double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Negative balance");
        this.balance = initialBalance;
    }

    void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }

    double getBalance() { return balance; }
}

class BankAccountTest {

    BankAccount account;

    @BeforeEach
    void setup() {
        account = new BankAccount(1000.0);  // fresh account before each test
    }

    @Test
    @DisplayName("New account has correct initial balance")
    void initialBalance() {
        assertEquals(1000.0, account.getBalance());
    }

    @Test
    @DisplayName("Depositing a positive amount increases balance")
    void deposit() {
        account.deposit(500.0);
        assertEquals(1500.0, account.getBalance());
    }

    @Test
    @DisplayName("Withdrawing reduces balance by the amount")
    void withdraw() {
        account.withdraw(200.0);
        assertEquals(800.0, account.getBalance());
    }

    @Test
    @DisplayName("Withdrawing more than balance throws IllegalStateException")
    void overdraft() {
        assertThrows(IllegalStateException.class, () -> account.withdraw(2000.0));
    }

    @Test
    @DisplayName("Negative initial balance throws IllegalArgumentException")
    void negativeBalance() {
        assertThrows(IllegalArgumentException.class, () -> new BankAccount(-100));
    }

    @Test
    @Disabled("Feature not yet implemented — ticket BANK-42")
    @DisplayName("Transfer to external account")
    void transferToExternal() {
        // This test is disabled — won't run, shown as skipped in report
        fail("Not implemented");
    }

    @AfterEach
    void tearDown() {
        System.out.println("Test completed. Balance: " + account.getBalance());
    }
}`,
  codeTitle: '@Test Annotation and Test Lifecycle',
  points: [
    '@Test marks a method as a test case; JUnit discovers and runs all @Test methods automatically',
    'Test methods must be void, non-private, non-static, and should have no parameters',
    'JUnit creates a new test class instance for each @Test method — ensuring test isolation by default',
    '@DisplayName replaces the method name in reports with a human-readable string — great for CI reports',
    '@Disabled skips a test with an optional reason — always include the reason (ticket number, explanation)',
    '@BeforeEach and @AfterEach surround each test with setup and cleanup — guaranteed isolation',
    'Use static import for Assertions methods: import static org.junit.jupiter.api.Assertions.* for clean test code',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Making a @Test method private prevents JUnit from discovering and running it — no error is shown, the test is silently skipped. Always use package-private (no modifier) or public for test methods.',
    },
    {
      type: 'interview',
      content: 'Q: What happens if a @Test method throws an uncaught exception?\nA: JUnit catches it and marks the test as FAILED (not ERROR — both show as failures in most reports). The exception type and message appear in the failure report, helping you diagnose the cause.',
    },
    {
      type: 'tip',
      content: 'Use @DisplayName for all tests when working in a team. It makes CI failure reports readable by product managers and QA engineers, not just the developer who wrote the test.',
    },
  ],
}
