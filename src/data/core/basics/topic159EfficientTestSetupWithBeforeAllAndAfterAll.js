export default {
  id: 'efficient-test-setup-with-before-all-and-after-all',
  title: '159. Efficient Test Setup with @BeforeAll and @AfterAll',
  explanation: `@BeforeAll and @AfterAll run once per test class — ideal for expensive one-time setup like starting servers, connecting to databases, or loading large data sets.

**@BeforeAll:**
Runs ONCE before all test methods in the class. Must be static (unless using @TestInstance(PER_CLASS)).
  @BeforeAll
  static void startServer() { ... }

**@AfterAll:**
Runs ONCE after all test methods complete. Also static by default.
  @AfterAll
  static void stopServer() { ... }

**Full lifecycle for a test class:**
  @BeforeAll → [@BeforeEach → @Test → @AfterEach] × N → @AfterAll

**Why static?**
By default, JUnit 5 creates a new test instance per test method. Since @BeforeAll runs before any instance exists, it must be static. Using @TestInstance(Lifecycle.PER_CLASS) removes this requirement.

**Common use cases:**
- Starting and stopping an embedded server or database
- Loading a large configuration file or test dataset
- Creating shared expensive objects (parsers, connections)
- Initializing a thread pool

**@TestInstance(PER_CLASS):**
Allows @BeforeAll/@AfterAll to be non-static AND shares one instance across all tests:
  @TestInstance(TestInstance.Lifecycle.PER_CLASS)
  class MyTest {
    @BeforeAll void setup() { ... } // no static required
  }

**Inheritance:**
@BeforeAll from a parent class runs before the child class @BeforeAll.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class DatabaseServiceTest {

    // Shared expensive resource — created ONCE
    private static FakeDatabase database;
    private static List<String> setupLog = new ArrayList<>();

    @BeforeAll
    static void startDatabase() {
        database = new FakeDatabase();
        database.connect();
        setupLog.add("Database connected");
        System.out.println("[BeforeAll] Database started");
    }

    @AfterAll
    static void stopDatabase() {
        database.disconnect();
        setupLog.add("Database disconnected");
        System.out.println("[AfterAll] Database stopped");
        System.out.println("Setup log: " + setupLog);
    }

    @BeforeEach
    void clearData() {
        database.clear(); // clear data before each test
    }

    @Test
    void insertRecord() {
        database.insert("user1");
        assertEquals(1, database.count());
    }

    @Test
    void deleteRecord() {
        database.insert("user1");
        database.delete("user1");
        assertEquals(0, database.count());
    }

    @Test
    void countRecords() {
        database.insert("a");
        database.insert("b");
        database.insert("c");
        assertEquals(3, database.count());
    }

    // Simulated database
    static class FakeDatabase {
        private final List<String> records = new ArrayList<>();
        void connect() { System.out.println("Connecting..."); }
        void disconnect() { System.out.println("Disconnecting..."); }
        void insert(String r) { records.add(r); }
        void delete(String r) { records.remove(r); }
        int count() { return records.size(); }
        void clear() { records.clear(); }
    }
}

// Using @TestInstance(PER_CLASS) to avoid static
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class NonStaticLifecycleTest {

    private List<String> sharedList;

    @BeforeAll  // NOT static — allowed with PER_CLASS
    void setUp() {
        sharedList = new ArrayList<>();
        sharedList.add("shared item");
    }

    @AfterAll   // NOT static
    void tearDown() {
        sharedList.clear();
    }

    @Test
    void sharedListHasItem() {
        assertTrue(sharedList.contains("shared item"));
    }
}`,
  codeTitle: '@BeforeAll and @AfterAll Lifecycle',
  points: [
    '@BeforeAll runs once before all tests in the class — must be static unless using @TestInstance(PER_CLASS)',
    '@AfterAll runs once after all tests complete — use for shutting down servers, closing DB connections',
    'Full lifecycle: @BeforeAll → [per-test: @BeforeEach → @Test → @AfterEach] → @AfterAll',
    '@TestInstance(Lifecycle.PER_CLASS) allows non-static @BeforeAll/@AfterAll and shares one instance across tests',
    'Use @BeforeAll for expensive setup (server start, large data load) — not for resetting per-test state',
    'Per-test state reset should use @BeforeEach — combine both for shared + per-test setup',
    '@BeforeAll from a superclass runs before subclass @BeforeAll — inheritance follows declaration order',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'When using @TestInstance(PER_CLASS), all tests share the same instance — one test can mutate state that another test reads. Use @BeforeEach to reset mutable fields, otherwise tests become order-dependent and flaky.',
    },
    {
      type: 'interview',
      content: 'Q: Why is @BeforeAll static by default in JUnit 5?\nA: JUnit 5 creates a new test class instance before each test method by default. @BeforeAll runs before any instance is created, so it must be static. @TestInstance(PER_CLASS) changes this so one instance is shared and @BeforeAll can be non-static.',
    },
    {
      type: 'tip',
      content: 'For integration tests that start embedded servers (like Testcontainers or embedded Kafka), @BeforeAll is perfect — start the container once, share it across all tests, stop it in @AfterAll. This dramatically reduces test suite time compared to per-test container creation.',
    },
  ],
}
