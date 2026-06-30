export default {
  id: 'understanding-unit-testing',
  title: '141. Understanding Unit Testing: How It Differs from Regular Testing',
  explanation: `Testing is broadly divided into different types based on scope, purpose, and who performs it. Understanding the differences helps you write the right tests at the right level.

**Types of testing:**

**Manual Testing** — A human tester uses the application and reports bugs. Slow, expensive, and does not scale. Cannot be run repeatedly without human effort.

**Automated Testing** — Tests written as code that run automatically, giving fast, repeatable feedback.

The Testing Pyramid (bottom to top):
- **Unit Tests** — test the smallest piece of code in isolation (one class/method). Fast (milliseconds), many in number, no I/O, no DB.
- **Integration Tests** — test how multiple components work together (e.g., service + repository + DB). Slower, fewer in number.
- **End-to-End (E2E) / System Tests** — test the entire application flow from UI to DB. Slowest, fewest, most fragile.

**Unit Testing specifically:**
- Focuses on ONE unit (a class or method) at a time
- Dependencies (DB, network, other services) are replaced with mocks or stubs
- Should be: Fast, Independent, Repeatable, Self-validating, Timely (FIRST principles)
- Should NOT use external resources (no real DB, no network calls, no file system in most cases)

**Why unit tests over manual tests?**
- Run in milliseconds (manual takes minutes/hours)
- Run on every code change (CI/CD)
- Serve as living documentation of expected behavior
- Enable fearless refactoring — if tests pass, behavior is preserved`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

// Class under test (the "unit")
class EmailValidator {
    boolean isValid(String email) {
        if (email == null || email.isEmpty()) return false;
        return email.matches("^[\\\\w._%+-]+@[\\\\w.-]+\\\\.[a-zA-Z]{2,}$");
    }
}

// Unit test — tests EmailValidator IN ISOLATION
// No database, no HTTP, no files — pure logic test
class EmailValidatorTest {

    EmailValidator validator = new EmailValidator();

    // Each test: Arrange, Act, Assert (AAA pattern)

    @Test
    void validEmail_returnsTrue() {
        // Arrange
        String email = "user@example.com";
        // Act
        boolean result = validator.isValid(email);
        // Assert
        assertTrue(result);
    }

    @Test
    void nullEmail_returnsFalse() {
        assertFalse(validator.isValid(null));
    }

    @Test
    void emptyEmail_returnsFalse() {
        assertFalse(validator.isValid(""));
    }

    @Test
    void missingAtSign_returnsFalse() {
        assertFalse(validator.isValid("notanemail.com"));
    }

    @Test
    void missingDomain_returnsFalse() {
        assertFalse(validator.isValid("user@"));
    }

    @Test
    void validEmailWithSubdomain_returnsTrue() {
        assertTrue(validator.isValid("user@mail.example.co.uk"));
    }
}

// What makes this a UNIT test (not integration/e2e):
// 1. Tests ONE class: EmailValidator
// 2. No external dependencies (no DB, no network)
// 3. Runs in < 1ms
// 4. Fully deterministic — same input always gives same output
// 5. Can run in any order, any environment`,
  codeTitle: 'Unit Test vs Other Testing Types',
  points: [
    'Unit tests test a single class or method in isolation — no DB, no network, no files (usually)',
    'The testing pyramid: many unit tests at the base, fewer integration tests, even fewer E2E tests at the top',
    'FIRST principles for unit tests: Fast, Independent, Repeatable, Self-validating, Timely',
    'Unit tests serve as living documentation — a passing test proves the behavior is correct today',
    'Dependencies are mocked or stubbed in unit tests — you test YOUR code, not your dependencies',
    'Unit tests enable fearless refactoring — change internals while verifying the behavior stays the same',
    'Integration tests are slower but verify that components work together; E2E tests verify the full user journey',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A test that hits a real database, reads a file, or calls a real HTTP endpoint is an integration test, not a unit test — even if you call it a unit test. Real I/O makes tests slow and environment-dependent.',
    },
    {
      type: 'interview',
      content: 'Q: What is the testing pyramid?\nA: A model suggesting you should have many unit tests (fast, isolated, cheap), fewer integration tests (test real interactions between components), and very few E2E tests (test full user flows, slow and brittle). Inverting the pyramid (many E2E, few unit tests) leads to slow, flaky CI.',
    },
    {
      type: 'tip',
      content: 'Follow the AAA pattern: Arrange (set up the state), Act (call the method under test), Assert (verify the result). This structure makes tests easy to read and diagnose when they fail.',
    },
  ],
}
