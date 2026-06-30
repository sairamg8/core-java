export default {
  id: 'parameterized-tests-with-csv-source',
  title: '166. Parameterized Tests with @CsvSource',
  explanation: `@CsvSource provides multiple input parameters per test invocation using comma-separated values — overcoming @ValueSource's single-parameter limitation.

**@CsvSource:**
Each string in the array is one test case, with values separated by commas:
  @CsvSource({"1, 2, 3", "10, 20, 30", "-5, -3, -8"})
  void add(int a, int b, int expected) { ... }

**Quoting:**
Enclose values containing commas in single quotes:
  @CsvSource({"'Hello, World', 11"})  // first param = "Hello, World", second = 11

**Null values:**
Use the placeholder (default: empty) or explicitly:
  @CsvSource(value = {"1, NULL, 3"}, nullValues = {"NULL"})

**delimiterString:**
Change the delimiter if commas appear in your data:
  @CsvSource(value = {"1|hello|true"}, delimiterString = "|")

**@CsvFileSource:**
Load CSV data from a file (in src/test/resources/):
  @CsvFileSource(resources = "/test-data.csv", numLinesToSkip = 1)
  Skips 1 header line.

**Difference from @ValueSource:**
- @ValueSource: one parameter, one type
- @CsvSource: multiple parameters, mixed types (int, String, boolean)

**Display name with {index}:**
  @ParameterizedTest(name = "[{index}] add({0}, {1}) = {2}")
{0}, {1}, ... refer to parameter positions.

**@MethodSource:**
For complex object parameters, use @MethodSource to return Stream<Arguments> from a factory method. @CsvSource is best for simple multi-param cases.`,
  code: `import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CsvSourceTest {

    // Two inputs + expected result
    @ParameterizedTest(name = "add({0}, {1}) = {2}")
    @CsvSource({
        "1, 2, 3",
        "10, 20, 30",
        "-5, 5, 0",
        "0, 0, 0",
        "100, 200, 300"
    })
    void addNumbers(int a, int b, int expected) {
        assertEquals(expected, a + b);
    }

    // Mixed types
    @ParameterizedTest(name = "Grade for {0}% is {1}")
    @CsvSource({
        "90, A",
        "80, B",
        "70, C",
        "60, D",
        "50, F"
    })
    void gradeCalculation(int score, String expectedGrade) {
        assertEquals(expectedGrade, calculateGrade(score));
    }

    // String operations
    @ParameterizedTest(name = "Upper of ''{0}'' is ''{1}''")
    @CsvSource({
        "hello, HELLO",
        "world, WORLD",
        "java, JAVA",
        "junit, JUNIT"
    })
    void toUpperCase(String input, String expected) {
        assertEquals(expected, input.toUpperCase());
    }

    // With nullValues
    @ParameterizedTest
    @CsvSource(value = {
        "Alice, 25",
        "Bob, NULL",
        "NULL, 30"
    }, nullValues = {"NULL"})
    void withNullValues(String name, Integer age) {
        // name or age could be null
        System.out.printf("name=%s, age=%s%n", name, age);
    }

    // Boolean parameter
    @ParameterizedTest
    @CsvSource({
        "admin@example.com, true",
        "user@test.com, true",
        "bad-email, false",
        "'', false"
    })
    void emailValidation(String email, boolean isValid) {
        assertEquals(isValid, email.matches("^[^@]+@[^@]+\\.[^@]+$"));
    }

    // Custom delimiter
    @ParameterizedTest
    @CsvSource(value = {"1|one|first", "2|two|second"}, delimiterString = "|")
    void customDelimiter(int num, String word, String ordinal) {
        assertNotNull(word);
        assertNotNull(ordinal);
    }

    String calculateGrade(int score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }
}`,
  codeTitle: '@ParameterizedTest with @CsvSource',
  points: [
    '@CsvSource provides multiple parameters per test case via comma-separated strings',
    'Each string in the @CsvSource array is one test run — values map to method parameters by position',
    'JUnit 5 auto-converts CSV strings to int, long, double, boolean, and String parameters',
    'Single-quote values that contain commas: "Hello, World" must be written as "\'Hello, World\'"',
    'nullValues attribute specifies a placeholder like "NULL" that is converted to actual null',
    'delimiterString changes the separator — useful when data contains commas',
    '@CsvFileSource loads rows from a file in src/test/resources — good for large test datasets',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Whitespace in @CsvSource is significant. "1, 2" passes " 2" (with leading space) as the second parameter, not "2". JUnit 5 trims leading and trailing spaces by default for simple types, but verify behavior for strings to avoid subtle mismatches.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use @CsvSource versus @MethodSource in JUnit 5 parameterized tests?\nA: Use @CsvSource for simple multi-parameter tests with primitive types and strings — it is concise and inline. Use @MethodSource when you need complex objects, logic to generate test data, or reuse across multiple test methods. @MethodSource calls a factory method that returns Stream<Arguments>.',
    },
    {
      type: 'tip',
      content: 'For more than 10-20 test cases, move your data to @CsvFileSource and a CSV file in src/test/resources/. This keeps the test class clean and makes test data independently editable by non-Java team members like QA engineers.',
    },
  ],
}
