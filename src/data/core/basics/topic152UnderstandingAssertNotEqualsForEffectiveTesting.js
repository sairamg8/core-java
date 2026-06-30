export default {
  id: 'understanding-assert-not-equals-for-effective-testing',
  title: '152. Understanding assertNotEquals() for Effective Testing',
  explanation: `assertNotEquals() asserts that two values are NOT equal. It is the logical inverse of assertEquals() and is used less often, but has important use cases.

**Syntax:**
  assertNotEquals(unexpected, actual)
  assertNotEquals(unexpected, actual, "failure message")
  assertNotEquals(unexpected, actual, () -> "lazy message")

**When to use assertNotEquals:**
1. Verifying that a transformation changed a value
2. Ensuring an ID generator does not produce duplicates
3. Testing that a method returns a different object (defensive copy / mutation)
4. Confirming that a hash or encryption output differs from the input

**What assertNotEquals checks:**
- It calls !unexpected.equals(actual) under the hood
- For primitives, it checks primitive inequality
- For objects, it checks that .equals() returns false

**Limitations:**
assertNotEquals alone is rarely a complete test — it only proves "not this value," not "the correct value." Combine it with other assertions for meaningful tests.

**assertNotNull vs assertNotEquals(null, ...):**
Both work but assertNotNull(value) is the idiomatic form for checking non-null.

**Floating-point:**
Like assertEquals, there is a delta overload:
  assertNotEquals(double unexpected, double actual, double delta)
This passes when abs(unexpected - actual) > delta.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.UUID;

class AssertNotEqualsTest {

    // Basic assertNotEquals
    @Test
    void basicNotEquals() {
        int result = 10 - 3;
        assertNotEquals(0, result); // result is 7, not 0
    }

    // Confirm transformation changed the value
    @Test
    void valueWasTransformed() {
        String original = "hello";
        String upper = original.toUpperCase();
        assertNotEquals(original, upper); // "hello" != "HELLO"
    }

    // UUID generator produces unique values
    @Test
    void uniqueIds() {
        String id1 = UUID.randomUUID().toString();
        String id2 = UUID.randomUUID().toString();
        assertNotEquals(id1, id2);
    }

    // Defensive copy — modifying result does not change original
    @Test
    void defensiveCopy() {
        int[] original = {1, 2, 3};
        int[] copy = original.clone();
        copy[0] = 99;
        assertNotEquals(original[0], copy[0]); // 1 != 99
    }

    // Floating-point assertNotEquals with delta
    @Test
    void floatNotEqual() {
        // These differ by more than 1.0, so assertNotEquals passes
        assertNotEquals(10.0, 15.0, 1.0);
    }

    // With failure message
    @Test
    void withMessage() {
        String password = "secret";
        String hashed = hashPassword(password);
        assertNotEquals(password, hashed, "Password should not equal its hash");
    }

    String hashPassword(String pw) {
        return Integer.toHexString(pw.hashCode());
    }
}`,
  codeTitle: 'assertNotEquals() Patterns',
  points: [
    'assertNotEquals(unexpected, actual) passes when the two values are NOT equal — it is the inverse of assertEquals',
    'Argument order: unexpected value first, actual value second — same convention as assertEquals',
    'Most useful for: verifying transformations, unique ID generation, ensuring defensive copies are independent',
    'assertNotEquals is rarely sufficient alone — "not X" is a weak guarantee; combine with positive assertions',
    'Use assertNotNull(value) instead of assertNotEquals(null, value) for null checks — more readable',
    'The delta overload assertNotEquals(double, double, double) passes when the difference exceeds the delta',
    'Lazy message suppliers work here too: assertNotEquals(x, y, () -> "computed message")',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'assertNotEquals only proves "the value is not X." It does not prove "the value is correct." A test that only uses assertNotEquals often gives false confidence — pair it with assertEquals to check the actual expected output.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use assertNotEquals instead of assertEquals?\nA: When testing that a method produces a different value — for example, an ID generator must produce unique values, a password must not equal its hash, or a defensive copy must be independent of the original after modification.',
    },
    {
      type: 'tip',
      content: 'For unique ID tests, generating two IDs and asserting they are not equal is probabilistically valid but theoretically flawed. In production, test the ID generation contract more rigorously — use a Set and verify no duplicates across 1,000 generated IDs.',
    },
  ],
}
