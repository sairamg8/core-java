export default {
  id: 'welcome-to-junit5',
  title: '140. Welcome to the JUnit 5 Course',
  explanation: `JUnit 5 is the de facto standard testing framework for Java. It is a complete rewrite of JUnit 4 with a modern architecture that is more flexible, extensible, and expressive.

**What is JUnit?**
JUnit is an open-source framework for writing and running unit tests in Java. A unit test verifies that a small unit of code (typically one method or class) behaves correctly in isolation. Tests catch regressions — bugs introduced by new code that break existing behavior.

**JUnit 5 Architecture:**
JUnit 5 is composed of three sub-projects:
1. **JUnit Platform** — the launcher and engine that discovers and runs tests. Provides the foundation for building testing tools.
2. **JUnit Jupiter** — the new programming model and extension model (the annotations and APIs you write your tests with).
3. **JUnit Vintage** — allows running JUnit 3 and JUnit 4 tests on the JUnit 5 platform.

**Why JUnit 5 over JUnit 4?**
- Lambda-friendly assertions and test methods
- Parameterized tests with much richer data sources
- Nested test classes for organized, hierarchical test suites
- Extension model (replaces @Rule and @RunWith) — cleaner and more powerful
- Conditional test execution based on environment, OS, JRE version
- Better test lifecycle control (@BeforeAll / @AfterAll can be non-static)

**Setup (Maven):**
Add junit-jupiter to pom.xml and configure the surefire plugin to run JUnit 5 tests.`,
  code: `// Maven dependency (pom.xml):
// <dependency>
//   <groupId>org.junit.jupiter</groupId>
//   <artifactId>junit-jupiter</artifactId>
//   <version>5.10.0</version>
//   <scope>test</scope>
// </dependency>

// Surefire plugin for Maven:
// <plugin>
//   <groupId>org.apache.maven.plugins</groupId>
//   <artifactId>maven-surefire-plugin</artifactId>
//   <version>3.0.0-M9</version>
// </plugin>

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

// A simple class to test
class Calculator {
    int add(int a, int b) { return a + b; }
    int divide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Division by zero");
        return a / b;
    }
}

// The test class
class CalculatorTest {

    Calculator calc;

    @BeforeEach  // runs before EACH test method
    void setUp() {
        calc = new Calculator();
    }

    @Test
    @DisplayName("Adding two positive numbers")
    void testAdd() {
        int result = calc.add(2, 3);
        assertEquals(5, result, "2 + 3 should equal 5");
    }

    @Test
    void testAddNegative() {
        assertEquals(-1, calc.add(2, -3));
    }

    @Test
    void testDivideByZero() {
        assertThrows(ArithmeticException.class, () -> calc.divide(10, 0));
    }

    @AfterEach  // runs after EACH test method
    void tearDown() {
        calc = null;
    }
}`,
  codeTitle: 'JUnit 5 First Test',
  points: [
    'JUnit 5 is the standard Java unit testing framework — split into JUnit Platform, Jupiter (annotations/API), and Vintage',
    'Unit tests verify small isolated pieces of code; they catch regressions before code reaches production',
    '@Test marks a test method; @BeforeEach / @AfterEach run setup/cleanup around each test',
    'assertEquals(expected, actual) is the most common assertion — fails the test if values differ',
    '@DisplayName gives a human-readable test name shown in test reports',
    'JUnit 5 requires Java 8+ and uses the org.junit.jupiter.api package',
    'Maven projects need the junit-jupiter dependency and a current surefire plugin (3.x) to run JUnit 5 tests',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'JUnit 5 test methods and classes do NOT need to be public — they can be package-private. This is different from JUnit 4 where public was required.',
    },
    {
      type: 'interview',
      content: 'Q: What are the three modules of JUnit 5?\nA: JUnit Platform (launcher/engine foundation), JUnit Jupiter (the new API and annotation model for writing tests), and JUnit Vintage (backward compatibility for running JUnit 3/4 tests on the JUnit 5 platform).',
    },
    {
      type: 'tip',
      content: 'Name test classes with a Test suffix (CalculatorTest) and test methods descriptively (testAddTwoPositiveNumbers). Good names serve as documentation and make failing tests immediately understandable.',
    },
  ],
}
