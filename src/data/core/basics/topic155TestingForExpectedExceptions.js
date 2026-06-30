export default {
  id: 'testing-for-expected-exceptions',
  title: '155. Testing for Expected Exceptions',
  explanation: `Testing that code throws the right exception when given invalid input is a core part of unit testing. JUnit 5 uses assertThrows() for this purpose.

**assertThrows(exceptionClass, executable)**
Executes the lambda and asserts that it throws an exception of the specified type. Returns the thrown exception so you can inspect it further.

**Syntax:**
  Exception ex = assertThrows(ExceptionClass.class, () -> {
      code that should throw
  });

**Inspecting the exception:**
The returned exception allows you to verify the message, cause, or other properties:
  assertEquals("expected message", ex.getMessage());

**assertDoesNotThrow:**
The inverse — asserts that the lambda does NOT throw any exception:
  assertDoesNotThrow(() -> method.call());

**Type hierarchy:**
assertThrows checks exact type AND subtypes. assertThrows(RuntimeException.class, ...) will pass if an IllegalArgumentException is thrown (it is a RuntimeException subtype).

**assertThrowsExactly:**
Added in JUnit 5.8 — checks the exact exception type, no subtypes:
  assertThrowsExactly(IllegalArgumentException.class, () -> ...);

**Old JUnit 4 approach (@Test(expected = ...)):**
JUnit 4 used @Test(expected = Exception.class) — this had a flaw: if the exception was thrown in setup code, the test still "passed." JUnit 5 assertThrows scopes exactly to the lambda.

**Testing error messages:**
Always verify the exception message when it matters:
  IllegalArgumentException ex = assertThrows(...);
  assertTrue(ex.getMessage().contains("cannot be negative"));`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class ExceptionTest {

    // Basic assertThrows
    @Test
    void divisionByZero() {
        assertThrows(ArithmeticException.class, () -> {
            int result = 10 / 0;
        });
    }

    // Inspect the exception
    @Test
    void invalidArgument() {
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> setAge(-5)
        );
        assertEquals("Age cannot be negative", ex.getMessage());
    }

    // assertDoesNotThrow
    @Test
    void validArgument() {
        assertDoesNotThrow(() -> setAge(25));
    }

    // Subtype check
    @Test
    void subtypeException() {
        // IllegalArgumentException is a RuntimeException — this passes
        assertThrows(RuntimeException.class, () -> setAge(-1));
    }

    // assertThrowsExactly — exact type only (JUnit 5.8+)
    @Test
    void exactExceptionType() {
        assertThrowsExactly(IllegalArgumentException.class, () -> setAge(-1));
        // Would FAIL if RuntimeException was thrown instead
    }

    // Exception with cause
    @Test
    void wrappedException() {
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            throw new RuntimeException("wrapper", new NullPointerException("root cause"));
        });
        assertNotNull(ex.getCause());
        assertInstanceOf(NullPointerException.class, ex.getCause());
    }

    // Return value from assertDoesNotThrow
    @Test
    void methodReturnsValue() {
        int result = assertDoesNotThrow(() -> safeDivide(10, 2));
        assertEquals(5, result);
    }

    void setAge(int age) {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    }

    int safeDivide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Cannot divide by zero");
        return a / b;
    }
}`,
  codeTitle: 'Testing Expected Exceptions with assertThrows',
  points: [
    'assertThrows(Type.class, () -> code) asserts that the lambda throws an exception of that type',
    'assertThrows returns the thrown exception — use it to verify the message, cause, or other details',
    'assertDoesNotThrow asserts that a method runs without any exception — useful for validating happy paths',
    'assertThrowsExactly checks the exact exception type — no subtypes accepted (JUnit 5.8+)',
    'assertThrows scopes the check to the lambda — unlike JUnit 4 @Test(expected=), it cannot accidentally catch exceptions from setup code',
    'Always verify the exception message when testing input validation — not just the type',
    'assertInstanceOf(Type.class, object) checks if an object is an instance of a type — useful for checking exception causes',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Do not put code AFTER the throw in the assertThrows lambda — it will never execute. If you need to verify state after the exception, use a try-catch block or separate the assertions. Only put the line that should throw inside the lambda.',
    },
    {
      type: 'interview',
      content: 'Q: What is the advantage of JUnit 5 assertThrows over JUnit 4 @Test(expected = Exception.class)?\nA: assertThrows scopes the exception check to a specific lambda. In JUnit 4, if any line in the test throws the expected exception (including setup), the test passes — a false positive. assertThrows is precise and also lets you inspect the exception object.',
    },
    {
      type: 'tip',
      content: 'Always test both the happy path (assertDoesNotThrow) and the error path (assertThrows). A method that throws on invalid input should also succeed on valid input — test both cases.',
    },
  ],
}
