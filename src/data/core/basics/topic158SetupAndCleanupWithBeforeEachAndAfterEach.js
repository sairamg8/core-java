export default {
  id: 'setup-and-cleanup-with-before-each-and-after-each',
  title: '158. Setup and Cleanup with @BeforeEach and @AfterEach',
  explanation: `Test lifecycle annotations allow you to run code before and after each test method, eliminating duplication and ensuring a clean state for every test.

**@BeforeEach:**
Runs before EVERY test method in the class. Used to:
- Initialize objects
- Reset state
- Open database connections
- Create test fixtures

**@AfterEach:**
Runs after EVERY test method, whether it passed or failed. Used to:
- Close resources
- Reset mocks
- Clean up files or DB records
- Log test results

**Lifecycle order for each test:**
  @BeforeEach → @Test → @AfterEach

**Key properties:**
- If @BeforeEach throws, the test is skipped and @AfterEach still runs
- @AfterEach always runs even if the test fails — ensuring cleanup
- Each test method gets a FRESH instance of the test class (by default)

**Naming convention:**
Methods annotated with lifecycle annotations should have descriptive names:
  void setUp() — common name for @BeforeEach
  void tearDown() — common name for @AfterEach

**Inheritance:**
@BeforeEach and @AfterEach are inherited by subclasses. Superclass @BeforeEach runs before subclass @BeforeEach.

**Difference from JUnit 4:**
JUnit 4 used @Before and @After. JUnit 5 renamed them to @BeforeEach and @AfterEach for clarity about their per-test scope.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class ShoppingCartTest {

    private ShoppingCart cart;
    private List<String> auditLog;

    @BeforeEach
    void setUp() {
        cart = new ShoppingCart();
        auditLog = new ArrayList<>();
        System.out.println("==> Starting test: " + cart);
    }

    @AfterEach
    void tearDown() {
        cart.clear();
        auditLog.clear();
        System.out.println("<== Test completed");
    }

    @Test
    void addItemIncreasesSize() {
        cart.add("Book");
        assertEquals(1, cart.size());
    }

    @Test
    void removeItemDecreasesSize() {
        cart.add("Book");
        cart.add("Pen");
        cart.remove("Book");
        assertEquals(1, cart.size());
    }

    @Test
    void cartStartsEmpty() {
        // Each test gets a fresh cart from @BeforeEach
        assertTrue(cart.isEmpty());
    }

    @Test
    void totalCalculatesCorrectly() {
        cart.addWithPrice("Book", 15.99);
        cart.addWithPrice("Pen", 2.49);
        assertEquals(18.48, cart.getTotal(), 0.001);
    }

    // Simplified ShoppingCart for demo
    static class ShoppingCart {
        private final List<String> items = new ArrayList<>();
        private double total = 0;

        void add(String item) { items.add(item); }
        void addWithPrice(String item, double price) { items.add(item); total += price; }
        boolean remove(String item) { return items.remove(item); }
        int size() { return items.size(); }
        boolean isEmpty() { return items.isEmpty(); }
        double getTotal() { return total; }
        void clear() { items.clear(); total = 0; }
    }
}`,
  codeTitle: '@BeforeEach and @AfterEach Lifecycle',
  points: [
    '@BeforeEach runs before every individual test method — use it to create fresh instances and reset state',
    '@AfterEach runs after every individual test method, even if the test threw an exception — ideal for resource cleanup',
    'Each test method typically gets a new test class instance — state set in one test does not bleed into another',
    '@AfterEach always runs even when @BeforeEach or the test itself fails — guaranteeing cleanup',
    'Lifecycle methods are inherited: a parent @BeforeEach runs before a child @BeforeEach in the same class hierarchy',
    'JUnit 5 renamed @Before/@After (JUnit 4) to @BeforeEach/@AfterEach for explicit per-test scope clarity',
    'Keep @BeforeEach lean — heavy initialization should go in @BeforeAll to run once, not before every test',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '@AfterEach does NOT run if the JVM crashes or the test is forcibly killed. For database cleanup in integration tests, use transactions that roll back instead of relying solely on @AfterEach — this is more reliable.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between @BeforeEach and @BeforeAll in JUnit 5?\nA: @BeforeEach runs before every test method — each test gets its own setup. @BeforeAll runs once before all tests in the class and must be static. Use @BeforeEach for resetting mutable state; use @BeforeAll for expensive one-time setup like starting a server.',
    },
    {
      type: 'tip',
      content: 'If setup fails in @BeforeEach, the test is marked as a failure with a clear message about setup failure. This is better than an obscure NullPointerException inside the test method — keep setup simple and reliable.',
    },
  ],
}
