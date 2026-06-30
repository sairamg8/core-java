export default {
  id: 'understanding-assert-true',
  title: '153. Understanding assertTrue()',
  explanation: `assertTrue() and assertFalse() test boolean conditions. They are the most flexible assertions because any boolean expression can be tested.

**assertTrue(condition)** — passes if condition is true
**assertFalse(condition)** — passes if condition is false

**Overloads:**
  assertTrue(boolean condition)
  assertTrue(boolean condition, String message)
  assertTrue(boolean condition, Supplier<String> messageSupplier)
  assertTrue(BooleanSupplier supplier)  // lazy evaluation of the condition itself

**When to use assertTrue vs assertEquals:**
- assertTrue: testing a boolean result (isValid(), contains(), isEmpty())
- assertEquals: comparing two specific values — prefer this over assertTrue(a == b) because assertEquals prints both values on failure

**BooleanSupplier form:**
  assertTrue(() -> list.contains("item"))
This delays condition evaluation until assertion time. Useful in conditional compilation or complex conditions.

**Common use cases:**
- assertTrue(list.isEmpty())
- assertTrue(str.contains("keyword"))
- assertTrue(result > 0 && result < 100)
- assertFalse(set.contains(removed))
- assertTrue(file.exists())

**Pitfall — always true:**
  assertTrue(true)  // meaningless test
Tests must actually verify behavior. Make sure the condition can realistically fail.

**assertAll with boolean conditions:**
Combine assertTrue calls inside assertAll() to check multiple conditions without short-circuiting:
  assertAll(
    () -> assertTrue(result.isValid()),
    () -> assertFalse(result.hasErrors())
  )`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class AssertTrueTest {

    @Test
    void basicAssertTrue() {
        int age = 25;
        assertTrue(age >= 18, "Age must be 18 or older");
    }

    @Test
    void assertFalseExample() {
        List<String> list = new ArrayList<>();
        list.add("a");
        assertFalse(list.isEmpty(), "List should not be empty after adding an element");
    }

    @Test
    void booleanSupplier() {
        List<String> items = List.of("apple", "banana", "cherry");
        // Lazy evaluation — condition evaluated only during assertion
        assertTrue(() -> items.contains("banana"));
    }

    @Test
    void rangeCheck() {
        int score = 85;
        assertTrue(score >= 0 && score <= 100, "Score must be between 0 and 100");
    }

    @Test
    void stringContains() {
        String response = "HTTP/1.1 200 OK";
        assertTrue(response.startsWith("HTTP"), "Response should start with HTTP");
        assertTrue(response.contains("200"), "Response should contain status code 200");
    }

    @Test
    void multipleConditionsWithAssertAll() {
        String email = "user@example.com";
        assertAll("email validation",
            () -> assertTrue(email.contains("@"), "Should contain @"),
            () -> assertTrue(email.contains("."), "Should contain dot"),
            () -> assertFalse(email.isEmpty(), "Should not be empty")
        );
    }

    @Test
    void collectionBehavior() {
        Set<String> set = new HashSet<>(Arrays.asList("a", "b", "c"));
        set.remove("b");
        assertFalse(set.contains("b"), "Removed element should not be present");
        assertTrue(set.contains("a"), "Non-removed element should still be present");
    }
}`,
  codeTitle: 'assertTrue() and assertFalse() Patterns',
  points: [
    'assertTrue(cond) passes when cond is true; assertFalse(cond) passes when cond is false',
    'Prefer assertEquals over assertTrue(a == b) — assertEquals prints both values on failure, making debugging easier',
    'The BooleanSupplier form assertTrue(() -> expr) delays evaluation of the condition until assertion time',
    'Always include a descriptive message for complex conditions so failures are self-explanatory',
    'Use assertAll to run multiple assertTrue/assertFalse checks without short-circuiting on the first failure',
    'Avoid assertTrue(true) — a test that can never fail is not testing anything',
    'Combine boolean assertions for range checks: assertTrue(x >= min && x <= max)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'assertTrue(obj1.equals(obj2)) gives a poor failure message: "expected true but was false." Use assertEquals(obj1, obj2) instead — it prints "expected <value1> but was <value2>", which immediately shows what went wrong.',
    },
    {
      type: 'interview',
      content: 'Q: When should you use assertTrue vs assertEquals in JUnit 5?\nA: Use assertEquals when comparing two specific values — it gives better failure messages. Use assertTrue for boolean conditions that do not have a natural "expected vs actual" pair, such as list.isEmpty(), string.contains("x"), or range checks.',
    },
    {
      type: 'tip',
      content: 'For complex conditions, extract them into a helper method with a meaningful name: assertTrue(isValidEmail(email)). This makes the test read like documentation and gives a clear name to show in the failure message.',
    },
  ],
}
