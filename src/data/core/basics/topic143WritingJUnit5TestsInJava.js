export default {
  id: 'writing-junit5-tests-without-maven',
  title: '143. Writing JUnit 5 Tests in Java Without a Maven Project',
  explanation: `You can write and run JUnit 5 tests without Maven by directly including the JUnit 5 JAR files in your classpath. This is useful for quick experiments, learning, or standalone scripts.

**Steps to run JUnit 5 without Maven:**
1. Download the following JARs from Maven Central:
   - junit-jupiter-api-5.x.x.jar (write tests)
   - junit-jupiter-engine-5.x.x.jar (run tests)
   - junit-platform-launcher-5.x.x.jar (the launcher)
   - junit-platform-engine-5.x.x.jar (the engine SPI)
   - opentest4j-1.x.x.jar (assertion library)
2. Compile: javac -cp ".;junit-jupiter-api.jar" MyTest.java
3. Run with the ConsoleLauncher: java -jar junit-platform-console-standalone.jar --select-class=MyTest

**The Console Standalone Launcher:**
JUnit provides a single all-in-one JAR (junit-platform-console-standalone) that includes everything needed. Download it and use:
  java -jar junit-platform-console-standalone.jar --select-class=ClassName

**In practice:**
Almost all real projects use Maven or Gradle to manage JUnit dependencies. The standalone approach is useful for learning, quick tests, or scripting environments. This topic demonstrates that JUnit 5 is just JAR files — the framework magic is in those JARs, not in Maven.`,
  code: `// File: CalculatorTest.java
// Compile with: javac -cp ".:junit-jupiter-api-5.10.0.jar" CalculatorTest.java
// Run with: java -jar junit-platform-console-standalone-1.10.0.jar --select-class=CalculatorTest

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class Calculator {
    int add(int a, int b)      { return a + b; }
    int subtract(int a, int b) { return a - b; }
    int multiply(int a, int b) { return a * b; }
    double divide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Division by zero");
        return (double) a / b;
    }
}

class CalculatorTest {
    Calculator calc;

    @BeforeEach
    void init() {
        calc = new Calculator();
    }

    @Test
    @DisplayName("Addition of positive numbers")
    void testAdd() {
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    @DisplayName("Subtraction returns correct difference")
    void testSubtract() {
        assertEquals(1, calc.subtract(4, 3));
    }

    @Test
    @DisplayName("Multiplication of two numbers")
    void testMultiply() {
        assertEquals(12, calc.multiply(3, 4));
    }

    @Test
    @DisplayName("Division produces correct decimal result")
    void testDivide() {
        assertEquals(2.5, calc.divide(5, 2));
    }

    @Test
    @DisplayName("Dividing by zero throws ArithmeticException")
    void testDivideByZero() {
        assertThrows(ArithmeticException.class, () -> calc.divide(10, 0));
    }
}

// Console Standalone launcher output looks like:
// [         4 tests found    ]
// [         4 tests successful]
// [         0 tests failed   ]
//
// Or with failures:
// [         1 test failed    ]
// CalculatorTest > testAdd() FAILED
//   org.opentest4j.AssertionFailedError: expected: <5> but was: <4>`,
  codeTitle: 'JUnit 5 Without Maven',
  points: [
    'JUnit 5 is ultimately just JAR files — Maven/Gradle just download and configure them for you',
    'The junit-platform-console-standalone JAR is a single all-in-one executable for running JUnit 5 tests from the command line',
    'Compile test classes with JUnit JAR on the classpath: javac -cp ".:junit-jupiter-api.jar" *.java',
    'Run with: java -jar junit-platform-console-standalone.jar --select-class=MyTestClass',
    '@Test marks test methods; @DisplayName gives a readable name; @BeforeEach runs before each test',
    'assertEquals/assertTrue/assertThrows are in org.junit.jupiter.api.Assertions',
    'In real projects always use Maven or Gradle — standalone is for learning and quick scripts only',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The standalone launcher requires exact JAR versions to match. Mixing junit-jupiter-api 5.9.x with junit-platform-console-standalone 1.8.x may cause runtime errors. Use the same version set throughout.',
    },
    {
      type: 'interview',
      content: 'Q: Can you run JUnit 5 tests without Maven or Gradle?\nA: Yes. Download the junit-platform-console-standalone JAR, compile your test class with junit-jupiter-api on the classpath, and run the standalone launcher with --select-class=YourTest. In practice, Maven or Gradle are used because they handle dependency management and integrate with CI/CD.',
    },
    {
      type: 'tip',
      content: 'Use --select-package=com.example or --scan-classpath with the console launcher to discover and run all tests in a package or classpath without listing each class individually.',
    },
  ],
}
