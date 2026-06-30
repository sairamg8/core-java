export default {
  id: 'making-tests-selective-and-readable',
  title: '157. Making Tests Selective and Readable',
  explanation: `JUnit 5 provides several annotations to organize, label, and selectively run tests — making large test suites manageable and readable.

**@DisplayName:**
Override the default method name with a human-readable description:
  @DisplayName("User age must be positive when creating account")
  @Test void testAge() { ... }

**@Tag:**
Categorize tests with tags. Run subsets with Maven/Gradle filters:
  @Tag("fast")     // unit test
  @Tag("slow")     // integration test
  @Tag("database") // DB-dependent

  Maven: mvn test -Dgroups=fast
  JUnit Platform: @IncludeTags("fast"), @ExcludeTags("slow")

**@Disabled:**
Skip a test without deleting it. Always include a reason:
  @Disabled("Pending fix for issue #234")
  @Test void brokenTest() { ... }

**@Nested:**
Group related tests in inner classes for better structure. Covered in depth later.

**assertAll:**
Run multiple assertions without stopping on the first failure:
  assertAll("user validation",
    () -> assertNotNull(user.getName()),
    () -> assertTrue(user.getAge() > 0),
    () -> assertNotNull(user.getEmail())
  );

**Test naming conventions:**
- Method names: should_returnValue_when_Condition()
- Or: givenContext_whenAction_thenResult()
- Or: descriptive camelCase that reads as English

**@DisplayNameGeneration:**
Apply a naming strategy to a class to auto-generate display names:
  @DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
  // testAge_positive_whenValid → "testAge positive whenValid"`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayNameGenerator;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User Account Service Tests")
@Tag("unit")
class UserAccountTest {

    @Test
    @DisplayName("Valid user creation succeeds")
    void validUserCreationSucceeds() {
        User user = new User("Alice", 25, "alice@example.com");
        assertNotNull(user);
    }

    @Test
    @DisplayName("User age must be positive")
    @Tag("validation")
    void userAgeMustBePositive() {
        assertThrows(IllegalArgumentException.class, () -> new User("Bob", -1, "b@e.com"));
    }

    @Test
    @Disabled("Waiting for email validation service — issue #42")
    @DisplayName("Invalid email should be rejected")
    void invalidEmailRejected() {
        assertThrows(IllegalArgumentException.class, () -> new User("Carl", 30, "bad-email"));
    }

    @Test
    @DisplayName("All user fields must be valid")
    void allFieldsValid() {
        User user = new User("Diana", 30, "diana@example.com");
        assertAll("user fields",
            () -> assertEquals("Diana", user.getName()),
            () -> assertEquals(30, user.getAge()),
            () -> assertEquals("diana@example.com", user.getEmail()),
            () -> assertNotNull(user.getCreatedAt())
        );
    }

    @Nested
    @DisplayName("When user is underage")
    class WhenUnderage {

        @Test
        @DisplayName("Should not be allowed to register")
        void shouldNotRegister() {
            assertThrows(IllegalStateException.class, () -> register(new User("Eve", 16, "e@e.com")));
        }
    }

    void register(User u) {
        if (u.getAge() < 18) throw new IllegalStateException("Must be 18+");
    }

    // Simplified User class for demo
    static class User {
        private final String name;
        private final int age;
        private final String email;
        private final java.time.Instant createdAt = java.time.Instant.now();

        User(String name, int age, String email) {
            if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
            this.name = name; this.age = age; this.email = email;
        }

        String getName() { return name; }
        int getAge() { return age; }
        String getEmail() { return email; }
        java.time.Instant getCreatedAt() { return createdAt; }
    }
}`,
  codeTitle: 'Organizing and Labeling Tests',
  points: [
    '@DisplayName replaces method names with human-readable descriptions — shown in IDE and CI reports',
    '@Tag categorizes tests — use fast/slow, unit/integration, database/network to run subsets selectively',
    '@Disabled skips a test without deleting it — always include a reason string so you know why it is disabled',
    'assertAll runs all assertions in the lambda list and reports ALL failures, not just the first one',
    '@Nested groups related tests in inner classes, sharing @BeforeEach setup and improving readability',
    '@DisplayNameGeneration applies auto-generated display names to all tests in a class',
    'Test method naming conventions (givenX_whenY_thenZ or should_doX_when_Y) make failures self-explanatory',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '@Disabled tests still appear in the test report as "skipped." Do not leave dozens of disabled tests long-term — each one is technical debt. Set a reminder or link to a ticket so they are eventually fixed or deleted.',
    },
    {
      type: 'interview',
      content: 'Q: What is the benefit of assertAll over multiple separate assertions?\nA: assertAll runs all assertions and collects all failures before reporting. Multiple separate assertions stop at the first failure. With assertAll you see all problems at once, not just the first — saving time in debugging.',
    },
    {
      type: 'tip',
      content: 'Use @Tag("slow") on tests that hit databases or external APIs, then exclude them from the regular build with -DexcludedGroups=slow. Run them separately in CI as a nightly or pre-merge step to keep the fast feedback loop.',
    },
  ],
}
