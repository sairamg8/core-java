export default {
  id: 'setting-up-maven-project-for-junit5',
  title: '146. Setting Up a Maven Project for JUnit 5 Testing',
  explanation: `Maven is the standard build tool for Java projects. Setting up JUnit 5 in Maven requires adding the right dependency and configuring the Surefire plugin to run JUnit 5 tests during the test phase.

**Project structure:**
Maven enforces a standard directory layout:
  project/
  ├── pom.xml                          (project descriptor)
  ├── src/
  │   ├── main/
  │   │   └── java/
  │   │       └── com/example/App.java  (production code)
  │   └── test/
  │       └── java/
  │           └── com/example/AppTest.java  (test code)
  └── target/                          (compiled output — gitignored)

**pom.xml configuration:**
1. Set Java version in the compiler plugin
2. Add junit-jupiter as a test dependency
3. Configure maven-surefire-plugin 3.x (Surefire 2.x does NOT support JUnit 5)

**Running tests:**
- mvn test — compiles and runs all tests
- mvn test -Dtest=CalculatorTest — run one specific test class
- mvn test -Dtest=CalculatorTest#testAdd — run one specific test method
- mvn verify — runs tests as part of the full build lifecycle

**Why Surefire 3.x is required:**
The older Surefire 2.x only supports JUnit 4. JUnit 5 requires Surefire 3.0.0-M5 or later (or the JUnit Platform Provider plugin for older Surefire).`,
  code: `<!-- pom.xml — Complete JUnit 5 Maven setup -->
<!-- <project> ... -->
<!--   <groupId>com.example</groupId> -->
<!--   <artifactId>junit5-demo</artifactId> -->
<!--   <version>1.0-SNAPSHOT</version> -->

<!--   <properties> -->
<!--     <maven.compiler.source>17</maven.compiler.source> -->
<!--     <maven.compiler.target>17</maven.compiler.target> -->
<!--   </properties> -->

<!--   <dependencies> -->
<!--     <!- JUnit 5 (Jupiter) --> -->
<!--     <dependency> -->
<!--       <groupId>org.junit.jupiter</groupId> -->
<!--       <artifactId>junit-jupiter</artifactId> -->
<!--       <version>5.10.0</version> -->
<!--       <scope>test</scope> -->  <!-- only for tests, not included in production jar -->
<!--     </dependency> -->
<!--   </dependencies> -->

<!--   <build> -->
<!--     <plugins> -->
<!--       <!-- Surefire 3.x required for JUnit 5 --> -->
<!--       <plugin> -->
<!--         <groupId>org.apache.maven.plugins</groupId> -->
<!--         <artifactId>maven-surefire-plugin</artifactId> -->
<!--         <version>3.1.2</version> -->
<!--       </plugin> -->
<!--     </plugins> -->
<!--   </build> -->
<!-- </project> -->

// Production code: src/main/java/com/example/StringUtils.java
package com.example;

public class StringUtils {
    public static String reverse(String s) {
        if (s == null) throw new NullPointerException("Input cannot be null");
        return new StringBuilder(s).reverse().toString();
    }

    public static boolean isPalindrome(String s) {
        String clean = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return clean.equals(new StringBuilder(clean).reverse().toString());
    }
}

// Test code: src/test/java/com/example/StringUtilsTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class StringUtilsTest {

    @Test
    void reverseNormalString() {
        assertEquals("olleh", StringUtils.reverse("hello"));
    }

    @Test
    void reverseSingleChar() {
        assertEquals("a", StringUtils.reverse("a"));
    }

    @Test
    void reverseEmptyString() {
        assertEquals("", StringUtils.reverse(""));
    }

    @Test
    void reverseNullThrows() {
        assertThrows(NullPointerException.class, () -> StringUtils.reverse(null));
    }

    @Test
    void isPalindromeSimple() {
        assertTrue(StringUtils.isPalindrome("racecar"));
        assertTrue(StringUtils.isPalindrome("A man a plan a canal Panama"));
        assertFalse(StringUtils.isPalindrome("hello"));
    }
}`,
  codeTitle: 'Maven JUnit 5 Project Setup',
  points: [
    'Maven project structure: src/main/java for production code, src/test/java for test code',
    'Add junit-jupiter dependency with scope test — it will not be included in the final artifact',
    'Surefire plugin 3.x is required for JUnit 5 — Surefire 2.x only supports JUnit 4',
    'mvn test compiles and runs all tests; mvn verify runs tests + integration tests + verification',
    'Test classes and methods follow the *Test naming convention for automatic discovery by Surefire',
    'The target/ directory contains compiled classes and test reports — never commit it to version control',
    'junit-jupiter 5.x includes all three Jupiter modules (api, engine, params) as a convenience aggregate dependency',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you use Surefire 2.x with JUnit 5, tests compile but never run — no errors, just 0 tests executed. This is a silent failure. Always explicitly declare Surefire 3.x in your pom.xml.',
    },
    {
      type: 'interview',
      content: 'Q: What Maven scope should JUnit have?\nA: test scope. This means JUnit is only on the classpath during test compilation and execution — it is not included in the production JAR/WAR. The test scope also prevents test code from being imported by production code.',
    },
    {
      type: 'tip',
      content: 'Use mvn test -pl module-name in multi-module Maven projects to run tests for a specific module only, saving time during development.',
    },
  ],
}
