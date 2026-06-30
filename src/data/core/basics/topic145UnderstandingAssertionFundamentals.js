export default {
  id: 'understanding-assertion-fundamentals',
  title: '145. Understanding Assertion Fundamentals',
  explanation: `Assertions are the heart of tests — they verify that the actual output matches the expected output. If an assertion fails, it throws AssertionFailedError and JUnit marks the test as failed.

**Core Assertions (org.junit.jupiter.api.Assertions):**

- **assertEquals(expected, actual)** — most common; fails if not equal. Always put expected first.
- **assertNotEquals(unexpected, actual)** — fails if they are equal.
- **assertTrue(condition)** — fails if condition is false.
- **assertFalse(condition)** — fails if condition is true.
- **assertNull(object)** — fails if not null.
- **assertNotNull(object)** — fails if null.
- **assertSame(expected, actual)** — fails if they are not the SAME object reference (==).
- **assertNotSame(unexpected, actual)** — fails if they ARE the same object reference.
- **assertThrows(exceptionClass, executable)** — fails if no exception or wrong exception type.
- **assertDoesNotThrow(executable)** — fails if any exception is thrown.
- **assertArrayEquals(expected, actual)** — element-by-element comparison of arrays.
- **assertIterableEquals(expected, actual)** — element-by-element comparison of Iterables.
- **assertAll(executables...)** — runs all assertions even if some fail; reports all failures together.
- **fail(message)** — unconditionally fail a test (useful in branches that should not be reached).

**Assertion messages:**
Every assertion accepts an optional String message (or Supplier<String>) as the last argument. This message appears in the failure report and should explain what was expected.

**assertAll — grouped assertions:**
Instead of stopping at the first failure, assertAll runs all assertions and shows all failures at once. Use this when you want to see all that went wrong in one test run.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class Person {
    String name;
    int age;
    List<String> hobbies;

    Person(String name, int age, List<String> hobbies) {
        this.name = name; this.age = age; this.hobbies = hobbies;
    }
}

class AssertionFundamentalsTest {

    @Test
    void basicAssertions() {
        // assertEquals — expected first, actual second
        assertEquals(4, 2 + 2, "2 + 2 should equal 4");
        assertEquals("Hello", "Hello");

        // assertNotEquals
        assertNotEquals(5, 2 + 2);

        // assertTrue / assertFalse
        assertTrue("Java".startsWith("J"), "String should start with J");
        assertFalse("Java".isEmpty());

        // assertNull / assertNotNull
        String s = null;
        assertNull(s, "String should be null");
        assertNotNull("Hello", "String should not be null");
    }

    @Test
    void referenceAssertions() {
        String a = new String("hello");
        String b = new String("hello");
        String c = a;

        assertEquals(a, b);    // equal by value
        assertNotSame(a, b);   // different objects
        assertSame(a, c);      // c IS a (same reference)
    }

    @Test
    void exceptionAssertions() {
        // assertThrows returns the exception for further inspection
        ArithmeticException ex = assertThrows(ArithmeticException.class,
            () -> { int x = 10 / 0; });
        assertEquals("/ by zero", ex.getMessage());

        // assertDoesNotThrow
        assertDoesNotThrow(() -> Integer.parseInt("42"));
    }

    @Test
    void arrayAndIterableAssertions() {
        int[] expected = {1, 2, 3, 4, 5};
        int[] actual   = {1, 2, 3, 4, 5};
        assertArrayEquals(expected, actual);

        List<String> expectedList = List.of("a", "b", "c");
        List<String> actualList   = new ArrayList<>(List.of("a", "b", "c"));
        assertIterableEquals(expectedList, actualList);
    }

    @Test
    void assertAllGroups() {
        // All assertions run even if some fail
        Person p = new Person("Alice", 30, List.of("coding", "reading"));

        assertAll("person",
            () -> assertEquals("Alice", p.name),
            () -> assertEquals(30, p.age),
            () -> assertNotNull(p.hobbies),
            () -> assertEquals(2, p.hobbies.size()),
            () -> assertTrue(p.hobbies.contains("coding"))
        );
    }
}`,
  codeTitle: 'JUnit 5 Assertions Comprehensive',
  points: [
    'assertEquals(expected, actual) — always put expected first; the failure message shows "expected: X but was: Y"',
    'assertSame checks reference equality (==); assertEquals checks value equality (equals())',
    'assertThrows(ExceptionClass, () -> code) returns the exception for further assertions on its message/type',
    'assertAll runs all assertions and reports all failures — use it to see the full picture, not just the first failure',
    'All assertions accept an optional message as the last parameter — always add one when the failure may not be self-explanatory',
    'fail() unconditionally fails a test — use in branches that should be unreachable',
    'Lazy message with Supplier: () -> "computed " + value — avoids building the message when the assertion passes',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'assertEquals(expected, actual) parameter order matters. If you swap them, the failure message says "expected: X but was: Y" in the wrong direction, making debugging confusing. Convention: expected is always the known value, actual is the result of the method call.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between assertEquals and assertSame?\nA: assertEquals uses equals() for comparison — two different String objects with the same value will pass. assertSame uses == — it fails unless both references point to the exact same object in memory.',
    },
    {
      type: 'tip',
      content: 'Use assertAll when testing multiple properties of the same object (like an object returned from a factory method). This way, if three properties are wrong, you see all three failures in one run instead of having to fix and re-run three times.',
    },
  ],
}
