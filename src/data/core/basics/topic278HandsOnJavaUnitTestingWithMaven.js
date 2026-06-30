export default {
  id: 'hands-on-unit-testing-maven',
  title: '278. Hands-On Java Unit Testing with Maven',
  explanation: `Maven runs unit tests automatically during the \`test\` phase using the **Surefire** plugin. Tests live in \`src/test/java\` and run on every \`mvn test\`, \`package\`, and \`install\`.

**Test source layout:**
\`\`\`
src/
  main/java/com/example/Calculator.java
  test/java/com/example/CalculatorTest.java
\`\`\`
Tests mirror the main package structure under \`src/test/java\`.

**JUnit 5 dependency:**
\`\`\`xml
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.10.0</version>
  <scope>test</scope>
</dependency>
\`\`\`
Scope \`test\` keeps JUnit off the production classpath.

**Surefire — the test runner:**
The maven-surefire-plugin runs tests during the \`test\` phase. By default it runs files matching \`*Test.java\`, \`Test*.java\`, and \`*Tests.java\`. Results go to \`target/surefire-reports/\`.

**Running tests:**
\`\`\`bash
mvn test                    # run all tests
mvn test -Dtest=CalculatorTest   # run one test class
mvn test -Dtest=CalculatorTest#addTest   # run one test method
\`\`\`

**Build fails on test failure:**
If any test fails, \`mvn test\` (and \`package\`, \`install\`) report \`BUILD FAILURE\` and stop. This is intentional — broken code should not be packaged or installed.

**Reading the report:**
\`\`\`
Tests run: 5, Failures: 1, Errors: 0, Skipped: 0
\`\`\`
- **Failures** — assertion failed (assertEquals mismatch)
- **Errors** — unexpected exception thrown
- **Skipped** — disabled or conditionally skipped tests

**Skipping tests:**
\`\`\`bash
mvn package -DskipTests              # skip running (still compiles tests)
mvn package -Dmaven.test.skip=true   # skip compiling AND running
\`\`\`
Skipping is for special cases — never as a habit.`,
  code: `// ===== Hands-On Unit Testing with Maven + JUnit 5 =====

// --- Main code: src/main/java/com/example/Calculator.java ---
package com.example;

public class Calculator {
    public int add(int a, int b)      { return a + b; }
    public int divide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Cannot divide by zero");
        return a / b;
    }
}

// --- Test code: src/test/java/com/example/CalculatorTest.java ---
package com.example;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private final Calculator calc = new Calculator();

    @Test
    void addTest() {
        assertEquals(5, calc.add(2, 3), "2 + 3 should be 5");
    }

    @Test
    void addNegativeTest() {
        assertEquals(-1, calc.add(2, -3));
    }

    @Test
    void divideTest() {
        assertEquals(4, calc.divide(8, 2));
    }

    @Test
    void divideByZeroThrows() {
        // Verify the expected exception is thrown
        assertThrows(ArithmeticException.class, () -> calc.divide(5, 0));
    }
}

/* ===== pom.xml additions for JUnit 5 =====
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.2.5</version>
    </plugin>
  </plugins>
</build>
*/`,
  codeTitle: 'JUnit 5 Tests Run by Maven Surefire',
  points: [
    'Test classes live in src/test/java mirroring the main package structure; Maven runs them in the test phase',
    'The maven-surefire-plugin runs tests automatically and writes reports to target/surefire-reports/',
    'Surefire auto-detects classes named *Test, Test*, or *Tests by default',
    'JUnit 5 is added as org.junit.jupiter:junit-jupiter with test scope so it stays off the production classpath',
    'Any failing test makes mvn test/package/install report BUILD FAILURE and stops the build',
    'Run a single test with -Dtest=ClassName, or a single method with -Dtest=ClassName#methodName',
    'Failures mean a failed assertion; Errors mean an unexpected exception; Skipped means disabled tests',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If your tests are not being picked up by Maven, check the class naming. Surefire only runs classes matching *Test, Test*, or *Tests by default. A test class named CalculatorTests works, but CalculatorTesting or TestsForCalculator may be silently ignored — Maven reports 'Tests run: 0' and the build passes despite your tests never executing. Match the naming convention or configure Surefire's <includes>.",
    },
    {
      type: 'interview',
      content: "Q: How does Maven run unit tests, and what happens if a test fails?\nA: Maven runs tests during the test phase using the maven-surefire-plugin, which executes all test classes in src/test/java matching the default naming patterns (*Test, Test*, *Tests). If any test fails, the build reports BUILD FAILURE and halts — so package and install never run on broken code. This makes the test suite a gate: code that fails tests cannot be packaged or published.",
    },
    {
      type: 'tip',
      content: "Let failing tests fail the build — that is the point of running tests in the build. Resist the urge to add -DskipTests to make a build pass quickly; that defeats the safety net. If a test is genuinely flaky or outdated, fix or remove it deliberately rather than globally skipping all tests, which hides real regressions across the whole suite.",
    },
  ],
}
