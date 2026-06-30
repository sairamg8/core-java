export default {
  id: 'test-instance-behavior',
  title: '160. Test Instance Behavior',
  explanation: `JUnit 5 controls when test class instances are created via @TestInstance. Understanding this affects how shared state works between tests.

**Default: PER_METHOD**
JUnit 5 creates a NEW instance of the test class before EACH test method. This is the default.
  @TestInstance(TestInstance.Lifecycle.PER_METHOD) // default

Benefits:
- Tests are completely isolated — no shared mutable state
- No risk of test order dependency
- Clean, predictable behavior

Drawback:
- @BeforeAll and @AfterAll must be static
- Expensive objects are not naturally shared (use static fields)

**PER_CLASS:**
One single instance of the test class is created and shared across ALL test methods.
  @TestInstance(TestInstance.Lifecycle.PER_CLASS)

Benefits:
- @BeforeAll and @AfterAll can be non-static instance methods
- Natural state sharing between tests (use with care)
- Useful with @Nested where inner classes need to share state with outer

Drawbacks:
- Tests can share mutable state — order dependency risk
- Must manually reset state in @BeforeEach

**When to use PER_CLASS:**
1. @Nested tests that need to share setup with the outer class
2. Integration tests with expensive shared resources
3. Tests that intentionally build on each other (stateful sequences)

**Default setting:**
You can configure the default in junit-platform.properties:
  junit.jupiter.testinstance.lifecycle.default = per_class`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

// Default: PER_METHOD — new instance for each test
class PerMethodTest {

    private int counter = 0; // starts at 0 for EVERY test

    @Test
    void testOne() {
        counter++;
        assertEquals(1, counter); // passes — counter was 0 at start
    }

    @Test
    void testTwo() {
        counter++;
        assertEquals(1, counter); // also passes — fresh instance, counter is 0 again
    }

    @Test
    void testThree() {
        assertEquals(0, counter); // always 0 — new instance
    }
}

// PER_CLASS — single instance for all tests
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PerClassTest {

    private int counter = 0; // SHARED across all tests

    @BeforeAll  // non-static allowed with PER_CLASS
    void globalSetup() {
        System.out.println("ONE-TIME SETUP");
    }

    @AfterAll   // non-static allowed with PER_CLASS
    void globalTeardown() {
        System.out.println("ONE-TIME TEARDOWN");
    }

    @Test
    @Order(1)
    void firstTest() {
        counter++;
        assertEquals(1, counter); // counter is 1 after this test
    }

    @Test
    @Order(2)
    void secondTest() {
        counter++;
        assertEquals(2, counter); // counter accumulated from firstTest
    }

    @Test
    @Order(3)
    void thirdTest() {
        assertEquals(2, counter); // reading shared state — fragile!
    }
}

// PER_CLASS with @BeforeEach reset — safer pattern
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SafePerClassTest {

    private List<String> items;

    @BeforeAll
    void loadExpensiveResource() {
        // load something expensive once
        System.out.println("Loading config...");
    }

    @BeforeEach
    void resetState() {
        items = new ArrayList<>(); // reset per test — avoid bleed-through
    }

    @Test
    void addItem() {
        items.add("apple");
        assertEquals(1, items.size());
    }

    @Test
    void listStartsEmpty() {
        assertTrue(items.isEmpty()); // safe — reset in @BeforeEach
    }
}`,
  codeTitle: 'Test Instance Lifecycle: PER_METHOD vs PER_CLASS',
  points: [
    'PER_METHOD (default): JUnit 5 creates a new test class instance before each test — guarantees test isolation',
    'PER_CLASS: one instance is shared across all tests — allows non-static @BeforeAll/@AfterAll',
    'With PER_CLASS, instance fields are shared — one test can mutate state that affects the next test',
    'Always use @BeforeEach to reset mutable state when using PER_CLASS to prevent test order dependency',
    'PER_CLASS is useful with @Nested and for tests that share expensive resources without static fields',
    '@TestMethodOrder controls execution order — use @Order annotation on tests for deterministic sequencing',
    'Configure the default lifecycle globally in junit-platform.properties if most tests need PER_CLASS behavior',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'With PER_CLASS, tests can become order-dependent — a bug in testOne() might cause testTwo() to fail. This is the biggest risk of PER_CLASS. Always reset mutable fields in @BeforeEach, even in PER_CLASS tests, unless the shared state is intentional and read-only.',
    },
    {
      type: 'interview',
      content: 'Q: What is the default test instance lifecycle in JUnit 5, and why?\nA: PER_METHOD — a new instance is created before each test. This ensures complete isolation between tests. JUnit 5 chose this as the default to discourage shared mutable state, which is a common source of flaky tests.',
    },
    {
      type: 'tip',
      content: '@TestMethodOrder(MethodOrderer.OrderAnnotation.class) with @Order(n) on each test gives you deterministic ordering — useful for PER_CLASS tests that build on each other intentionally. But in general, design tests to be order-independent.',
    },
  ],
}
