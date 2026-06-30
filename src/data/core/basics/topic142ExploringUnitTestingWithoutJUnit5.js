export default {
  id: 'exploring-unit-testing-without-junit5',
  title: '142. Exploring Unit Testing Without JUnit 5',
  explanation: `Before using a framework, it is valuable to understand what testing looks like without one. This reveals what problems JUnit 5 solves and why frameworks exist.

**Manual testing approach (no framework):**
You can write tests as plain Java code using if/else checks and System.out.println to verify behavior. This works but has many problems:
- You must manually run and visually inspect output
- Tests do not have isolation — a failure in one test does not stop others running
- No standard reporting — you must parse output manually
- No test discovery — you must call each test method manually in main()
- No before/after hooks for setup and cleanup
- No parameterization — you must write duplicate code for multiple inputs
- No IDE/build tool integration

**What you are really building without a framework:**
A primitive test runner. JUnit 5 is essentially a polished, standardized version of exactly this — with proper assertions, lifecycle hooks, test discovery, IDE integration, and parallel execution built in.

**The assert pattern:**
The core of any test is an assertion: "if this condition is not true, the test has failed." Without a framework, you use if/else + throw or System.exit. With JUnit, you use Assertions.assertEquals(), Assertions.assertTrue(), etc.

**Value of this exercise:**
Understanding the problem that JUnit solves makes you a better test writer. You will understand WHY things like @BeforeEach, @AfterEach, and Assertions.assertThrows() exist.`,
  code: `// Unit testing WITHOUT JUnit 5 — manual approach

class MathUtils {
    static int add(int a, int b) { return a + b; }
    static int multiply(int a, int b) { return a * b; }
    static double divide(double a, double b) {
        if (b == 0) throw new IllegalArgumentException("Cannot divide by zero");
        return a / b;
    }
}

class ManualTestRunner {
    static int passed = 0;
    static int failed = 0;

    // Manual assert helper
    static void assertEqual(Object expected, Object actual, String testName) {
        if (expected.equals(actual)) {
            System.out.println("PASS: " + testName);
            passed++;
        } else {
            System.out.println("FAIL: " + testName +
                " | Expected: " + expected + " | Actual: " + actual);
            failed++;
        }
    }

    static void assertThrowsException(Class<? extends Exception> expected,
                                       Runnable code, String testName) {
        try {
            code.run();
            System.out.println("FAIL: " + testName + " — no exception thrown");
            failed++;
        } catch (Exception e) {
            if (expected.isInstance(e)) {
                System.out.println("PASS: " + testName);
                passed++;
            } else {
                System.out.println("FAIL: " + testName +
                    " — wrong exception: " + e.getClass().getSimpleName());
                failed++;
            }
        }
    }

    // Test methods — must be called manually
    static void testAdd() {
        assertEqual(5, MathUtils.add(2, 3), "add(2,3) == 5");
        assertEqual(0, MathUtils.add(-1, 1), "add(-1,1) == 0");
        assertEqual(-3, MathUtils.add(-1, -2), "add(-1,-2) == -3");
    }

    static void testMultiply() {
        assertEqual(6, MathUtils.multiply(2, 3), "multiply(2,3) == 6");
        assertEqual(0, MathUtils.multiply(5, 0), "multiply(5,0) == 0");
    }

    static void testDivideByZero() {
        assertThrowsException(IllegalArgumentException.class,
            () -> MathUtils.divide(10, 0),
            "divide(10,0) throws IllegalArgumentException");
    }

    public static void main(String[] args) {
        // Must manually call each test group
        testAdd();
        testMultiply();
        testDivideByZero();

        System.out.println("\\nResults: " + passed + " passed, " + failed + " failed");
    }
}

// Problems with this approach:
// 1. Must manually enumerate all test methods in main()
// 2. One failure does not isolate — bad setup state can bleed into next test
// 3. No standardized output — no IDE support for showing which tests passed
// 4. No @BeforeEach / @AfterEach hooks
// 5. No parameterized tests
// 6. Must write your own assert helpers
// JUnit 5 solves ALL of these.`,
  codeTitle: 'Unit Testing Without a Framework',
  points: [
    'Without a framework, you write manual assert helpers and call every test method in main() — fragile and verbose',
    'Manual testing lacks test isolation — setup/teardown must be done manually for every test',
    'There is no automatic test discovery, IDE integration, or standard reporting without a framework',
    'This exercise reveals exactly what JUnit 5 provides: assertions, lifecycle hooks, test discovery, IDE support',
    'The core concept is still the same: if a condition is not true, report failure',
    'JUnit 5 standardizes the assertion API, lifecycle, discovery, and reporting — so you write only test logic',
    'Understanding this makes @BeforeEach, @AfterEach, and assertThrows() meaningful rather than magic annotations',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Without proper test isolation, a failure or side effect in test A can make test B fail for unrelated reasons. JUnit @BeforeEach and @AfterEach ensure each test starts with a fresh state.',
    },
    {
      type: 'interview',
      content: 'Q: Why do we use a testing framework like JUnit instead of writing tests manually?\nA: Frameworks provide automatic test discovery, standardized assertions with clear failure messages, lifecycle hooks (@BeforeEach/AfterEach), parameterized testing, IDE/build tool integration, and parallel execution. Writing all of this manually is error-prone and time-consuming.',
    },
    {
      type: 'tip',
      content: 'Even understanding the manual approach is useful — when a JUnit assertion fails with a cryptic message, knowing that it is simply an if-check that throws AssertionError helps you debug and write better assertion messages.',
    },
  ],
}
