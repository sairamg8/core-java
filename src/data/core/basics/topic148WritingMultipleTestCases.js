export default {
  id: 'writing-multiple-test-cases',
  title: '148. Writing Multiple Test Cases',
  explanation: `A test class typically contains many test methods — one for each behavior or edge case of the class under test. Writing comprehensive tests means covering not just the happy path but also edge cases, boundary values, and error cases.

**Test coverage strategy:**
For any method, test:
1. **Happy path** — normal, expected input that should succeed
2. **Edge cases** — boundary values (0, empty string, maximum int, etc.)
3. **Error cases** — invalid inputs that should throw exceptions or return special values
4. **Null handling** — what happens with null inputs (if null is a valid concern)

**Test naming strategies:**
Good test names are self-documenting:
- Method: testAdd → should_ReturnSum_WhenGivenTwoPositives
- BDD style: given_TwoPositives_when_Add_then_ReturnCorrectSum
- Simple: add_TwoPositiveNumbers_ReturnsSum
- @DisplayName: "Adding two positive numbers returns their sum"

**How many tests per class?**
As many as needed to give you confidence the class works correctly. A rule of thumb: test every branch, every condition, every exception path. Coverage tools (JaCoCo) measure what percentage of your code is executed by tests.

**Test ordering:**
By default, JUnit 5 runs tests in a deterministic but non-alphabetical order. If tests must run in a specific order (rare — usually indicates bad test design), use @TestMethodOrder(MethodOrderer.OrderAnnotation.class) with @Order(n).`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class PasswordValidator {
    boolean isValid(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasUpper && hasLower && hasDigit;
    }
}

class PasswordValidatorTest {

    PasswordValidator validator = new PasswordValidator();

    // Happy paths
    @Test
    @DisplayName("Valid password returns true")
    void validPassword() {
        assertTrue(validator.isValid("SecureP4ss"));
    }

    @Test
    @DisplayName("Password with special chars is valid if it meets all rules")
    void validPasswordWithSpecialChars() {
        assertTrue(validator.isValid("P@ssw0rd!"));
    }

    // Edge cases
    @Test
    @DisplayName("Exactly 8 char password meeting all rules is valid")
    void exactlyEightChars() {
        assertTrue(validator.isValid("Passw0rd"));  // exactly 8 — boundary
    }

    @Test
    @DisplayName("7 char password is invalid even if otherwise correct")
    void sevenCharsIsInvalid() {
        assertFalse(validator.isValid("Pass0r"));  // 7 chars — below boundary
    }

    // Error / invalid cases
    @Test
    @DisplayName("Null password returns false")
    void nullPassword() {
        assertFalse(validator.isValid(null));
    }

    @Test
    @DisplayName("Empty password returns false")
    void emptyPassword() {
        assertFalse(validator.isValid(""));
    }

    @Test
    @DisplayName("Password without uppercase is invalid")
    void missingUppercase() {
        assertFalse(validator.isValid("password1"));
    }

    @Test
    @DisplayName("Password without lowercase is invalid")
    void missingLowercase() {
        assertFalse(validator.isValid("PASSWORD1"));
    }

    @Test
    @DisplayName("Password without digits is invalid")
    void missingDigit() {
        assertFalse(validator.isValid("PasswordNoNum"));
    }

    @Test
    @DisplayName("All same character is invalid")
    void allSameChar() {
        assertFalse(validator.isValid("aaaaaaaa"));
    }

    @Test
    @DisplayName("Password with only spaces is invalid")
    void allSpaces() {
        assertFalse(validator.isValid("        "));  // 8 spaces
    }
}`,
  codeTitle: 'Comprehensive Test Coverage',
  points: [
    'Every method needs tests for: happy path, edge cases (boundary values), error cases, and null handling',
    'Test one behavior per test method — if a test has multiple assertions for unrelated things, split it',
    'Edge cases often reveal bugs: zero length, maximum values, empty collections, single elements',
    'Good test names document what the code should do — a failing test name should explain what broke',
    'JaCoCo measures code coverage — aim for 80%+ line/branch coverage as a baseline',
    'More tests is generally better — each test is an automatic regression check that runs on every build',
    'Tests for null inputs prevent NullPointerException in production — always test your null-handling logic',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'High code coverage does not mean your tests are good. You can have 100% coverage with tests that never actually assert anything meaningful. Focus on asserting correct behavior, not just executing code lines.',
    },
    {
      type: 'interview',
      content: 'Q: How many test cases should you write per method?\nA: Enough to cover all significant paths: the happy path, boundary values, invalid inputs, and exception cases. A complex method with many conditions may need 10+ tests. A simple getter needs 1-2. The goal is confidence that the code works correctly, not hitting a number.',
    },
    {
      type: 'tip',
      content: 'Use the boundary value analysis technique: test the exact boundary (8 chars), just below (7 chars), and just above (9 chars). Bugs often hide at boundaries because conditions like < vs <= are easy to get wrong.',
    },
  ],
}
