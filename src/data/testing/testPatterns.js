export default {
  id: 'test-patterns',
  title: '1. Test Patterns, TDD & Best Practices',
  explanation: `Good tests are as important as good code. They are your safety net for refactoring, your documentation of intent, and your first line of defence against regressions.

**The testing pyramid:**
- **Unit tests** (base — most) — fast, isolated, test one class/method
- **Integration tests** (middle) — test components working together (DB, HTTP)
- **E2E tests** (top — fewest) — full system, slow, brittle

**TDD — Test-Driven Development:**
1. 🔴 **Red** — write a failing test for the next piece of behaviour
2. 🟢 **Green** — write the minimum code to make it pass
3. 🔵 **Refactor** — clean up, knowing tests keep you safe`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

// ── AAA Pattern — Arrange / Act / Assert ─────────────────────────────────
class PriceCalculatorTest {

    @Test
    @DisplayName("10% discount applied when order exceeds $100")
    void discountAppliedForLargeOrder() {
        // ARRANGE — set up the system under test and its inputs
        var calculator = new PriceCalculator();
        double itemPrice = 120.0;

        // ACT — call the one thing you're testing
        double finalPrice = calculator.calculate(itemPrice);

        // ASSERT — verify outcome (one logical assertion per test)
        assertEquals(108.0, finalPrice, 0.001, "Expected 10% discount on $120");
    }

    // ── FIRST principles for unit tests ──────────────────────────────────
    // F — Fast       (milliseconds, not seconds)
    // I — Isolated   (no shared state, no network, no file system)
    // R — Repeatable (same result every run, no random seeds, no time.now())
    // S — Self-validating (pass/fail, not "look at the output")
    // T — Timely     (written with or before the code, not months later)

    // ── Naming conventions ────────────────────────────────────────────────
    // Pattern: methodName_stateUnderTest_expectedBehavior
    @Test void calculate_negativePrice_throwsIllegalArgument() {}
    @Test void calculate_zeroPrice_returnsZero() {}
    @Test void calculate_priceOver100_appliesTenPercentDiscount() {}
    @Test void calculate_priceUnder100_returnsFullPrice() {}

    // ── Parameterized test for boundary conditions ────────────────────────
    @ParameterizedTest(name = "price={0}, expected={1}")
    @CsvSource({
        "0,     0.00",      // zero
        "50,   50.00",      // below threshold — no discount
        "99,   99.00",      // just below threshold
        "100, 100.00",      // at threshold — no discount (exclusive)
        "101,  90.90",      // just above — 10% discount
        "200, 180.00",      // well above
    })
    void discountBoundaries(double price, double expected) {
        assertEquals(expected, new PriceCalculator().calculate(price), 0.01);
    }

    // ── TDD walkthrough — FizzBuzz ────────────────────────────────────────
    // Step 1 RED:   write failing test for "returns number as string"
    // Step 2 GREEN: return String.valueOf(n)
    // Step 3 RED:   write failing test for "Fizz on multiples of 3"
    // Step 4 GREEN: add if (n % 3 == 0) return "Fizz"
    // ... repeat for Buzz and FizzBuzz

    static class FizzBuzz {
        static String of(int n) {
            if (n % 15 == 0) return "FizzBuzz";
            if (n % 3 == 0)  return "Fizz";
            if (n % 5 == 0)  return "Buzz";
            return String.valueOf(n);
        }
    }

    @ParameterizedTest
    @CsvSource({"1,1", "2,2", "3,Fizz", "5,Buzz", "15,FizzBuzz", "30,FizzBuzz"})
    void fizzBuzz(int n, String expected) {
        assertEquals(expected, FizzBuzz.of(n));
    }

    // ── Test isolation — clock injection pattern ──────────────────────────
    // BAD — not testable, returns different values each run
    // class BadService { boolean isExpired() { return LocalDate.now().isAfter(expiry); } }

    // GOOD — inject clock so tests control "now"
    static class ExpiryChecker {
        private final java.time.Clock clock;
        ExpiryChecker(java.time.Clock clock) { this.clock = clock; }

        boolean isExpired(java.time.LocalDate expiry) {
            return java.time.LocalDate.now(clock).isAfter(expiry);
        }
    }

    @Test
    void expiredSubscription() {
        var fixedClock = java.time.Clock.fixed(
            java.time.Instant.parse("2024-06-01T00:00:00Z"),
            java.time.ZoneOffset.UTC
        );
        var checker = new ExpiryChecker(fixedClock);
        assertTrue(checker.isExpired(java.time.LocalDate.of(2024, 5, 31)));
    }

    // ── What to test vs not ───────────────────────────────────────────────
    // ✅ Test:  business logic, edge cases, error paths, boundary values
    // ❌ Skip:  getters/setters, constructors, framework code, constants
    // ✅ Test:  all branches of if/switch, null inputs, empty collections
    // ❌ Skip:  private methods (test via public API), toString/hashCode

    static class PriceCalculator {
        double calculate(double price) {
            if (price < 0) throw new IllegalArgumentException("Negative price");
            return price > 100 ? price * 0.9 : price;
        }
    }
}`,
  points: [
    'One assertion per test is a guideline, not a rule — one LOGICAL concept per test is more accurate. assertAll() groups related assertions as one logical check.',
    'Test the public API, not implementation details — tests that break on refactoring (without behaviour changing) are a sign you\'re testing internals',
    'Code coverage is a floor, not a goal — 100% coverage with poor assertions gives false confidence. A meaningful failing test is worth more than coverage for coverage\'s sake.',
    'Integration tests should use a real (test) database (H2 in-memory, Testcontainers) rather than mocking the DB — mocked DB tests don\'t catch SQL bugs or constraint violations',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the testing pyramid and why does it matter?\nA: The pyramid says: write many unit tests (fast, cheap, isolated), fewer integration tests (slower, real components), and very few E2E tests (slow, brittle, expensive to maintain). Inverting it — relying on E2E tests for coverage — leads to slow CI, hard-to-debug failures, and fragile test suites. Fast feedback from unit tests enables confident refactoring.',
    },
    {
      type: 'tip',
      content: 'TDD red-green-refactor disciplines you to write only as much code as a test demands. The cycle: (1) write a failing test, (2) write the MINIMUM code to make it pass (even hardcoded), (3) refactor both test and code with the safety net in place. The result is 100% test coverage by construction.',
    },
  ],
}
