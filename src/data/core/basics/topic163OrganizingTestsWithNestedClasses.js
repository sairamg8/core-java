export default {
  id: 'organizing-tests-with-nested-classes',
  title: '163. Organizing Tests with @Nested Classes',
  explanation: `@Nested inner classes group related tests and establish hierarchies that mirror your code's behavior tree — making large test suites readable and maintainable.

**@Nested:**
Marks a non-static inner class as a nested test class. Nested classes can have their own @BeforeEach, @AfterEach, and tests.

**Benefits:**
1. Group tests by scenario ("when user is logged in", "when cart is empty")
2. Share setup within the group via @BeforeEach in the nested class
3. Nested display names create readable tree output in IDEs
4. Reduce duplication — outer @BeforeEach runs before inner @BeforeEach

**Lifecycle with @Nested:**
  Outer @BeforeEach → Inner @BeforeEach → @Test → Inner @AfterEach → Outer @AfterEach

**Cannot use @BeforeAll in @Nested (by default):**
Because nested classes are non-static, they cannot have static methods. Use @TestInstance(PER_CLASS) on the nested class to allow @BeforeAll.

**Display name nesting:**
With @DisplayName on each level:
  "Shopping Cart Tests"
    "When cart is empty"
      "Add item increases size"
      "Total is zero"
    "When cart has items"
      "Remove item decreases size"
      "Total reflects items"

**Depth:**
You can nest multiple levels deep, but more than 2-3 levels becomes hard to read.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

@DisplayName("Shopping Cart")
class ShoppingCartNestedTest {

    private ShoppingCart cart;

    @BeforeEach
    void initCart() {
        cart = new ShoppingCart();
    }

    @Nested
    @DisplayName("When cart is empty")
    class WhenEmpty {

        @Test
        @DisplayName("is empty initially")
        void isEmpty() {
            assertTrue(cart.isEmpty());
        }

        @Test
        @DisplayName("total is zero")
        void totalIsZero() {
            assertEquals(0.0, cart.getTotal(), 0.001);
        }

        @Test
        @DisplayName("adding item increases size to 1")
        void addItemIncreasesSize() {
            cart.add("Pen", 1.99);
            assertEquals(1, cart.size());
        }
    }

    @Nested
    @DisplayName("When cart has items")
    class WhenHasItems {

        @BeforeEach
        void addItems() {
            cart.add("Book", 12.99);
            cart.add("Pen", 1.99);
        }

        @Test
        @DisplayName("size reflects number of items")
        void sizeReflectsItems() {
            assertEquals(2, cart.size());
        }

        @Test
        @DisplayName("total reflects item prices")
        void totalReflectsItems() {
            assertEquals(14.98, cart.getTotal(), 0.001);
        }

        @Test
        @DisplayName("removing item decreases size")
        void removeDecreaseSize() {
            cart.remove("Book");
            assertEquals(1, cart.size());
        }

        @Nested
        @DisplayName("When discount is applied")
        class WithDiscount {

            @Test
            @DisplayName("10% discount reduces total by 10%")
            void discountReducesTotal() {
                cart.applyDiscount(0.10);
                assertEquals(13.482, cart.getTotal(), 0.001);
            }
        }
    }

    static class ShoppingCart {
        private final Map<String, Double> items = new LinkedHashMap<>();

        void add(String name, double price) { items.put(name, price); }
        void remove(String name) { items.remove(name); }
        boolean isEmpty() { return items.isEmpty(); }
        int size() { return items.size(); }
        double getTotal() { return items.values().stream().mapToDouble(d -> d).sum(); }
        void applyDiscount(double rate) {
            items.replaceAll((k, v) -> v * (1 - rate));
        }
    }
}`,
  codeTitle: '@Nested Classes for Test Organization',
  points: [
    '@Nested marks a non-static inner class as a test group — enables hierarchical test organization',
    'Outer @BeforeEach runs before inner @BeforeEach — nested classes inherit and extend parent setup',
    '@DisplayName on nested classes creates a readable tree in IDE test reports',
    'Nested classes can have their own @BeforeEach and @AfterEach for scenario-specific setup',
    'Use nested classes to group by state: "When empty", "When full", "When discounted"',
    '@TestInstance(PER_CLASS) on a nested class allows non-static @BeforeAll inside it',
    'Limit nesting to 2-3 levels — deeper nesting reduces readability instead of improving it',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Nested test classes must be non-static inner classes (not static nested classes). Static inner classes are not recognized by JUnit 5 as test containers. The @Nested annotation requires access to the outer instance.',
    },
    {
      type: 'interview',
      content: 'Q: What is the benefit of @Nested classes over flat test methods in JUnit 5?\nA: @Nested allows you to organize tests by scenario with shared setup per group. You get hierarchical display names in reports, cleaner grouping, and reusable @BeforeEach setups without duplicating code across every method.',
    },
    {
      type: 'tip',
      content: 'Use @Nested to express "given-when-then" at the class level. The outer class is the "given" (the object under test), each nested class is a "when" (a scenario), and each test method is a "then" (an expected outcome). This pattern makes tests read like living documentation.',
    },
  ],
}
