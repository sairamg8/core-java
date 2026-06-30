export default {
  id: 'more-on-assert-equals-method',
  title: '151. More on assertEquals() Method',
  explanation: `assertEquals() is the most commonly used assertion in JUnit 5. Beyond the basic form, it supports several overloads and comparison strategies worth knowing.

**Basic forms:**
- assertEquals(expected, actual) — passes if expected.equals(actual)
- assertEquals(expected, actual, "message") — includes a message on failure
- assertEquals(expected, actual, messageSupplier) — message computed lazily (lambda) — avoids expensive string concatenation when tests pass

**Type-specific overloads:**
JUnit 5 provides overloads for primitive types (int, long, double, float) to avoid boxing overhead:
  assertEquals(int expected, int actual)
  assertEquals(double expected, double actual, double delta)

**Delta for floating-point:**
Floating-point arithmetic is imprecise. Never compare doubles with exact equality:
  assertEquals(0.3, 0.1 + 0.2)  // FAILS — floating-point rounding
  assertEquals(0.3, 0.1 + 0.2, 0.0001)  // PASSES — delta tolerance

**Null handling:**
assertEquals(null, null) passes. assertEquals(null, someObject) fails with a clear message.

**assertEquals vs assertTrue(a.equals(b)):**
Prefer assertEquals — on failure it prints both the expected and actual values. assertTrue only says "expected true but was false."

**Custom objects:**
assertEquals calls .equals() on the objects. Ensure your class overrides equals() correctly — if not, assertEquals compares references, not values.

**assertArrayEquals:**
For arrays, use assertArrayEquals(expected, actual) instead of assertEquals — arrays in Java use reference equality by default.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class AssertEqualsTest {

    // Basic assertEquals
    @Test
    void basicEquality() {
        assertEquals(42, 40 + 2);
        assertEquals("hello", "hel" + "lo");
    }

    // With failure message
    @Test
    void withMessage() {
        int result = 5 * 5;
        assertEquals(25, result, "5 * 5 should equal 25");
    }

    // Lazy message supplier — string only built on failure
    @Test
    void lazyMessage() {
        int result = computeExpensive();
        assertEquals(100, result, () -> "Expected 100 but got: " + result);
    }

    // Floating-point with delta
    @Test
    void floatingPoint() {
        // WRONG — may fail due to floating-point precision
        // assertEquals(0.3, 0.1 + 0.2);

        // CORRECT — use delta
        assertEquals(0.3, 0.1 + 0.2, 0.0001);
    }

    // Custom object — requires overriding equals()
    @Test
    void customObject() {
        Point p1 = new Point(1, 2);
        Point p2 = new Point(1, 2);
        assertEquals(p1, p2); // passes if equals() is overridden
    }

    // Null checks
    @Test
    void nullEquality() {
        String s = null;
        assertEquals(null, s);       // passes
        assertNull(s);               // preferred alternative
    }

    int computeExpensive() { return 100; }

    record Point(int x, int y) {} // record auto-generates equals/hashCode
}`,
  codeTitle: 'assertEquals() Patterns',
  points: [
    'Always put expected value first, actual value second — this is the JUnit convention and affects error messages',
    'Use delta overload for doubles — assertEquals(0.3, 0.1 + 0.2, 0.0001) — never compare floating-point with exact equality',
    'Lazy message suppliers (() -> "msg") avoid building expensive strings when the test passes',
    'assertEquals calls .equals() — ensure your class overrides equals() or you are comparing references',
    'Use assertArrayEquals for arrays — assertEquals on arrays compares references, not contents',
    'assertEquals(null, null) passes; use assertNull(obj) as the idiomatic alternative for null checks',
    'Prefer assertEquals over assertTrue(a.equals(b)) — failure messages show both expected and actual values',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Argument order matters: assertEquals(expected, actual). If you reverse them, the failure message says "expected 42 but was 5" when it should say "expected 5 but was 42". This confuses debugging. Always put the known expected value first.',
    },
    {
      type: 'interview',
      content: 'Q: Why does assertEquals(0.3, 0.1 + 0.2) sometimes fail in JUnit?\nA: Floating-point numbers cannot represent all decimal values exactly in binary. 0.1 + 0.2 in IEEE 754 is 0.30000000000000004, not 0.3. Always use the delta overload: assertEquals(0.3, 0.1 + 0.2, 1e-9).',
    },
    {
      type: 'tip',
      content: 'For custom objects, consider using AssertJ or Hamcrest for richer assertions. AssertJ allows chaining: assertThat(point).extracting("x", "y").containsExactly(1, 2). JUnit 5 works well alongside these libraries.',
    },
  ],
}
