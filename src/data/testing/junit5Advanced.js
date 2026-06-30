export default {
  id: 'junit5-advanced',
  title: '2. Assertions, Parameterized Tests & Assumptions',
  explanation: `JUnit 5 ships a rich assertion API and first-class support for **parameterized tests** — running the same test logic with multiple inputs.

**Assumptions** conditionally skip a test at runtime (e.g., only run on Linux, only in CI environment). A failed assumption skips the test rather than failing it.`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.*;

// ── Assertions cheat-sheet ───────────────────────────────────────────────
class AssertionExamples {
    @Test
    void coreAssertions() {
        assertEquals(42, getValue());
        assertEquals(3.14, Math.PI, 0.01);           // delta for doubles
        assertNotEquals("wrong", getValue().toString());
        assertTrue(getValue() > 0);
        assertFalse(getValue() < 0);
        assertNull(null);
        assertNotNull("something");

        int[] expected = {1, 2, 3};
        int[] actual   = {1, 2, 3};
        assertArrayEquals(expected, actual);          // element-wise

        assertSame(expected, expected);               // same REFERENCE (==)
        assertNotSame(expected, actual);              // different reference

        // assertThrows — returns exception for further assertions
        var ex = assertThrows(ArithmeticException.class, () -> { int x = 1/0; });
        assertEquals("/ by zero", ex.getMessage());

        // assertDoesNotThrow
        assertDoesNotThrow(() -> Math.sqrt(4));

        // assertTimeout — test fails if it takes too long
        assertTimeout(java.time.Duration.ofMillis(100), () -> {
            Thread.sleep(50);  // ok — under 100ms
        });

        // assertAll — all assertions run even if one fails
        assertAll("checks",
            () -> assertEquals(42, getValue()),
            () -> assertTrue(getValue() > 0),
            () -> assertNotNull(getValue())
        );
    }

    int getValue() { return 42; }
}

// ── Parameterized Tests ───────────────────────────────────────────────────
// Requires: junit-jupiter-params dependency
class ParameterizedExamples {

    // @ValueSource — simple single-param tests
    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 5, 8, 13})  // Fibonacci numbers
    void isPositive(int n) {
        assertTrue(n > 0);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "  ", "\\t"})
    void isBlankString(String s) {
        assertTrue(s.isBlank());
    }

    // @NullAndEmptySource — adds null and "" to test cases
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "\\t"})
    void isBlankOrNull(String s) {
        assertTrue(s == null || s.isBlank());
    }

    // @CsvSource — multiple parameters per test case
    @ParameterizedTest
    @CsvSource({
        "Alice, 30, ACTIVE",
        "Bob,   25, PENDING",
        "Carol, 17, MINOR",
    })
    @DisplayName("User status by age")
    void userStatus(String name, int age, String expectedStatus) {
        assertEquals(expectedStatus, UserService.getStatus(name, age));
    }

    // @CsvFileSource — read from a CSV file in test resources
    // @CsvFileSource(resources = "/test-data/users.csv", numLinesToSkip = 1)

    // @MethodSource — complex objects from a factory method
    @ParameterizedTest
    @MethodSource("provideStringLengths")
    void stringLength(String input, int expected) {
        assertEquals(expected, input.length());
    }

    static java.util.stream.Stream<org.junit.jupiter.params.provider.Arguments> provideStringLengths() {
        return java.util.stream.Stream.of(
            org.junit.jupiter.params.provider.Arguments.of("",      0),
            org.junit.jupiter.params.provider.Arguments.of("abc",   3),
            org.junit.jupiter.params.provider.Arguments.of("hello", 5)
        );
    }

    // @EnumSource — test with enum values
    @ParameterizedTest
    @EnumSource(DayOfWeek.class)
    void allDaysAreValid(DayOfWeek day) {
        assertNotNull(day.name());
    }

    enum DayOfWeek { MON, TUE, WED, THU, FRI, SAT, SUN }

    // ── Assumptions — conditional test execution ─────────────────────────
    @Test
    void runOnlyOnCI() {
        assumeTrue("CI".equals(System.getenv("ENV")),
            "Skipping — only runs in CI environment");
        // test logic here — only executes if assumption holds
    }

    @Test
    void runOnlyOnLinux() {
        assumingThat(
            System.getProperty("os.name").contains("Linux"),
            () -> {
                // this block only runs on Linux
                assertTrue(true, "Linux-specific assertion");
            }
        );
        // code here always runs regardless of assumption
    }

    static class UserService {
        static String getStatus(String name, int age) {
            if (age < 18) return "MINOR";
            if (name.equals("Bob")) return "PENDING";
            return "ACTIVE";
        }
    }
}`,
  points: [
    '@ParameterizedTest replaces writing N identical test methods that differ only by input — one method, N data rows',
    '@CsvSource is the most common parameterized source for simple cases. Use @MethodSource when parameters are objects or require complex setup.',
    'assumeTrue() skips (not fails) when the condition is false — reported as "skipped" in the test report, not "failed"',
    'assertEquals for doubles requires a delta (tolerance) — floating-point arithmetic is inexact and assertEquals(0.1+0.2, 0.3) will fail',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the benefit of parameterized tests over writing separate @Test methods?\nA: Parameterized tests eliminate duplicate test code, make it trivial to add new cases (just add a row), and produce clear per-case failure reports in CI. They also separate test logic from test data — the @MethodSource approach lets you load cases from files, databases, or generators.',
    },
    {
      type: 'gotcha',
      content: 'assertTimeout() interrupts the test after the deadline and fails it — the method under test is killed. assertTimeoutPreemptively() does the same but in a separate thread. If your code is not thread-safe, prefer assertTimeout() which runs on the same thread but still fails if the deadline is exceeded.',
    },
  ],
}
