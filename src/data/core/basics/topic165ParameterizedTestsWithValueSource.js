export default {
  id: 'parameterized-tests-with-value-source',
  title: '165. Parameterized Tests with @ValueSource',
  explanation: `@ParameterizedTest with @ValueSource lets you run the same test multiple times with different input values — eliminating code duplication for boundary testing.

**Setup:**
Add the JUnit 5 parameterized tests dependency:
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-params</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
  </dependency>

**@ValueSource:**
Provides a list of literal values of a single type:
  @ValueSource(ints = {1, 2, 3})
  @ValueSource(strings = {"a", "b", "c"})
  @ValueSource(doubles = {1.1, 2.2})
  @ValueSource(longs = {100L, 200L})
  @ValueSource(booleans = {true, false})
  @ValueSource(chars = {'a', 'b', 'c'})
  @ValueSource(classes = {String.class, Integer.class})

**How it works:**
Each value from the source is passed as the first parameter of the test method:
  @ParameterizedTest
  @ValueSource(strings = {"bob", "alice", "carol"})
  void validNames(String name) { ... }

**Display name:**
Default: "[1] value", "[2] value", ...
Custom: @ParameterizedTest(name = "Testing value: {0}")

**Null and empty strings:**
Use @NullSource, @EmptySource, @NullAndEmptySource alongside @ValueSource to include null or empty string cases.

**Limitations of @ValueSource:**
- Only one parameter per test
- Only literal types (no complex objects)
- For multiple parameters or objects, use @CsvSource, @MethodSource, or @ArgumentsSource`,
  code: `import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class ValueSourceTest {

    // Test with int values
    @ParameterizedTest(name = "Is {0} positive?")
    @ValueSource(ints = {1, 2, 5, 100, Integer.MAX_VALUE})
    void positiveNumbers(int number) {
        assertTrue(number > 0, number + " should be positive");
    }

    // Test with strings
    @ParameterizedTest(name = "Is ''{0}'' a valid name?")
    @ValueSource(strings = {"Alice", "Bob", "Charlie", "Diana"})
    void validNames(String name) {
        assertNotNull(name);
        assertFalse(name.isBlank());
        assertTrue(name.length() >= 2);
    }

    // Test with doubles
    @ParameterizedTest
    @ValueSource(doubles = {0.1, 0.5, 1.0, 2.5})
    void positivePrices(double price) {
        assertTrue(price > 0, "Price must be positive");
    }

    // Including null and empty — use alongside @ValueSource
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "\\t", "\\n"})
    void blankOrNullStrings(String input) {
        assertTrue(input == null || input.isBlank());
    }

    // Testing a palindrome checker
    @ParameterizedTest(name = "''{0}'' is a palindrome")
    @ValueSource(strings = {"racecar", "level", "madam", "noon", "deed"})
    void palindromes(String word) {
        assertTrue(isPalindrome(word), word + " should be a palindrome");
    }

    // Testing invalid inputs
    @ParameterizedTest
    @ValueSource(ints = {-1, -100, Integer.MIN_VALUE})
    void negativeAgesAreInvalid(int age) {
        assertThrows(IllegalArgumentException.class, () -> setAge(age));
    }

    // Char values
    @ParameterizedTest
    @ValueSource(chars = {'A', 'E', 'I', 'O', 'U'})
    void upperCaseVowels(char c) {
        assertTrue("AEIOU".indexOf(c) >= 0);
    }

    boolean isPalindrome(String s) {
        String rev = new StringBuilder(s).reverse().toString();
        return s.equals(rev);
    }

    void setAge(int age) {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    }
}`,
  codeTitle: '@ParameterizedTest with @ValueSource',
  points: [
    '@ParameterizedTest with @ValueSource runs the test once per value in the array',
    'Supported types: ints, longs, doubles, floats, chars, booleans, strings, classes, bytes, shorts',
    'Each value is passed as the test method parameter — the method signature must match the type',
    'Use @NullSource, @EmptySource, @NullAndEmptySource alongside @ValueSource to test null/empty cases',
    'Custom display name with {0} shows the current value: @ParameterizedTest(name = "Input: {0}")',
    '@ValueSource only supports a single parameter — for multiple params use @CsvSource or @MethodSource',
    'Requires junit-jupiter-params dependency in pom.xml or build.gradle',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '@ValueSource(strings = {...}) does NOT include null or empty string by default. To test those cases, add @NullSource or @EmptySource above the method alongside @ValueSource — JUnit 5 merges all source annotations.',
    },
    {
      type: 'interview',
      content: 'Q: What is the advantage of @ParameterizedTest over writing multiple @Test methods?\nA: @ParameterizedTest eliminates copy-paste test duplication. Instead of 10 identical test methods with different hardcoded values, you write one method and list the inputs. This is easier to maintain and adds new test cases by just adding a value to the array.',
    },
    {
      type: 'tip',
      content: 'Use @ValueSource for boundary value testing: always include the boundary itself, one below, and one above. For example, if valid range is [1, 100]: @ValueSource(ints = {0, 1, 50, 100, 101}) — this catches off-by-one errors.',
    },
  ],
}
