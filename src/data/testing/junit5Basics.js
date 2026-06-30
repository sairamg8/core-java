export default {
  id: 'junit5-basics',
  title: '1. JUnit 5 — Annotations & Lifecycle',
  explanation: `**JUnit 5** (Jupiter) is the standard Java testing framework. A test class is a plain Java class; a test method is annotated with \`@Test\`.

**JUnit 5 = JUnit Platform + JUnit Jupiter (API) + JUnit Vintage (JUnit 4 support)**

**Lifecycle order per test method:**
\`@BeforeAll\` → \`@BeforeEach\` → \`@Test\` → \`@AfterEach\` → \`@AfterAll\``,
  table: {
    headers: ['Annotation', 'Scope', 'Purpose'],
    rows: [
      ['@Test', 'Method', 'Marks a test method'],
      ['@BeforeEach', 'Method', 'Runs before each @Test (setup)'],
      ['@AfterEach', 'Method', 'Runs after each @Test (teardown)'],
      ['@BeforeAll', 'Static Method', 'Runs once before all tests in the class'],
      ['@AfterAll', 'Static Method', 'Runs once after all tests in the class'],
      ['@Disabled', 'Class/Method', 'Skip this test (with reason)'],
      ['@DisplayName', 'Class/Method', 'Human-readable test name in reports'],
      ['@Nested', 'Inner Class', 'Group related tests in a nested class'],
      ['@Tag', 'Class/Method', 'Categorize tests for selective running'],
    ],
  },
  code: `// Maven dependency (pom.xml):
// <dependency>
//   <groupId>org.junit.jupiter</groupId>
//   <artifactId>junit-jupiter</artifactId>
//   <version>5.10.0</version>
//   <scope>test</scope>
// </dependency>

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("BankAccount Tests")
class BankAccountTest {

    private BankAccount account;

    @BeforeAll
    static void initAll() {
        // runs ONCE before any test — must be static
        System.out.println("Starting BankAccount test suite");
    }

    @BeforeEach
    void setUp() {
        // fresh account before EACH test — ensures test isolation
        account = new BankAccount(1000.0);
    }

    @AfterEach
    void tearDown() {
        // cleanup after each test
        account = null;
    }

    @AfterAll
    static void cleanupAll() {
        System.out.println("All BankAccount tests done");
    }

    // ── Basic tests ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("Initial balance should equal constructor argument")
    void initialBalance() {
        assertEquals(1000.0, account.getBalance());
    }

    @Test
    void depositIncreasesBalance() {
        account.deposit(500.0);
        assertEquals(1500.0, account.getBalance(), "Balance after deposit");
    }

    @Test
    void withdrawDecreasesBalance() {
        account.withdraw(200.0);
        assertEquals(800.0, account.getBalance());
    }

    // ── Exception testing ───────────────────────────────────────────────────
    @Test
    void withdrawMoreThanBalanceThrows() {
        // assertThrows returns the exception — you can inspect it
        InsufficientFundsException ex = assertThrows(
            InsufficientFundsException.class,
            () -> account.withdraw(2000.0)
        );
        assertEquals(2000.0, ex.getAmount());
        assertTrue(ex.getMessage().contains("Insufficient"));
    }

    @Test
    void depositNegativeAmountThrows() {
        assertThrows(IllegalArgumentException.class,
            () -> account.deposit(-100.0));
    }

    // ── assertAll — run all assertions even if one fails ────────────────────
    @Test
    void accountStateAfterTransactions() {
        account.deposit(300.0);
        account.withdraw(150.0);
        assertAll("account state",
            () -> assertEquals(1150.0, account.getBalance()),
            () -> assertTrue(account.isActive()),
            () -> assertEquals(2, account.getTransactionCount())
        );
    }

    // ── Disabled test ────────────────────────────────────────────────────────
    @Test
    @Disabled("Feature not yet implemented — see JIRA-456")
    void transferFunds() {
        // will be skipped
    }

    // ── Nested tests — logical grouping ─────────────────────────────────────
    @Nested
    @DisplayName("Deposit Tests")
    class DepositTests {
        @Test
        void depositZeroDoesNothing() {
            account.deposit(0);
            assertEquals(1000.0, account.getBalance());
        }

        @Test
        void largeDepositWorks() {
            account.deposit(1_000_000.0);
            assertEquals(1_001_000.0, account.getBalance());
        }
    }

    // Stub classes for compilation
    static class BankAccount {
        double balance; boolean active = true; int txCount = 0;
        BankAccount(double b) { this.balance = b; }
        void deposit(double a) { if (a < 0) throw new IllegalArgumentException(); balance += a; txCount++; }
        void withdraw(double a) { if (a > balance) throw new InsufficientFundsException(a); balance -= a; txCount++; }
        double getBalance() { return balance; }
        boolean isActive() { return active; }
        int getTransactionCount() { return txCount; }
    }
    static class InsufficientFundsException extends RuntimeException {
        double amount;
        InsufficientFundsException(double a) { super("Insufficient funds"); this.amount = a; }
        double getAmount() { return amount; }
    }
}`,
  points: [
    '@BeforeAll/@AfterAll must be static (unless @TestInstance(Lifecycle.PER_CLASS) is used — then one instance is shared across all tests)',
    'JUnit 5 creates a new test instance per @Test method by default — guaranteeing test isolation (no shared mutable state)',
    'assertAll() groups assertions and reports ALL failures at once — use it when you want the full picture, not just the first failure',
    'assertThrows() returns the thrown exception so you can verify its message, type, and fields',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between @BeforeAll and @BeforeEach?\nA: @BeforeEach runs before EVERY test method — ideal for resetting state (creating fresh objects). @BeforeAll runs once for the whole class — ideal for expensive setup (starting a DB, loading config). @BeforeAll methods must be static unless you configure @TestInstance(Lifecycle.PER_CLASS).',
    },
    {
      type: 'gotcha',
      content: 'Never share mutable state between tests (static fields with state). JUnit does not guarantee test order, and shared state causes flaky tests — tests that pass individually but fail together. Each test must set up its own state in @BeforeEach.',
    },
  ],
}
