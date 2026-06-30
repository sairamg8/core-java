export default {
  id: 'writing-and-running-junit5-test-cases',
  title: '147. Writing and Running JUnit 5 Test Cases in a Maven Project',
  explanation: `With the Maven project set up, you can write tests and run them from the command line or your IDE. This topic covers the complete workflow from writing a failing test to making it pass.

**TDD workflow (Red-Green-Refactor):**
1. Write a failing test (red) — defines the expected behavior
2. Write the minimum code to make it pass (green)
3. Refactor the code without breaking tests (refactor)

**Running tests in Maven:**
- mvn test — compile and run all tests
- mvn test -Dtest=ClassName — run one class
- mvn test -Dtest=ClassName#methodName — run one method
- mvn clean test — clean compiled output first, then test (use when things seem out of sync)

**Running tests in IntelliJ IDEA:**
- Right-click test class → Run
- Click the green play button next to test method
- Ctrl+Shift+F10 — run the current test

**Test output in Maven:**
Maven generates two types of reports in target/surefire-reports/:
- .txt files — plain text summaries
- .xml files — detailed XML reports (used by CI tools like Jenkins/GitHub Actions)

**Failed test output:**
When a test fails, Maven shows: the test class and method name, the assertion error message (with expected vs actual), and a stack trace pointing to the exact assertion line.

**Exit codes:**
- mvn test exits with code 0 if all tests pass
- Exits with code 1 (BUILD FAILURE) if any test fails — CI pipelines use this to fail the build`,
  code: `// Complete example: writing and running in a Maven project

// src/main/java/com/example/ShoppingCart.java
package com.example;

import java.util.*;

public class ShoppingCart {
    private final List<Double> prices = new ArrayList<>();

    public void addItem(double price) {
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        prices.add(price);
    }

    public double getTotal() {
        return prices.stream().mapToDouble(Double::doubleValue).sum();
    }

    public double getTotalWithTax(double taxRate) {
        if (taxRate < 0 || taxRate > 1)
            throw new IllegalArgumentException("Tax rate must be between 0 and 1");
        return getTotal() * (1 + taxRate);
    }

    public int getItemCount() { return prices.size(); }

    public void clear() { prices.clear(); }
}

// src/test/java/com/example/ShoppingCartTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class ShoppingCartTest {

    ShoppingCart cart;

    @BeforeEach
    void setUp() {
        cart = new ShoppingCart();  // fresh cart for each test
    }

    @Test
    @DisplayName("Empty cart total is zero")
    void emptyCartTotal() {
        assertEquals(0.0, cart.getTotal());
    }

    @Test
    @DisplayName("Adding items increases the count")
    void addItemIncreasesCount() {
        cart.addItem(10.0);
        cart.addItem(20.0);
        assertEquals(2, cart.getItemCount());
    }

    @Test
    @DisplayName("Total is sum of all item prices")
    void totalIsSum() {
        cart.addItem(10.0);
        cart.addItem(20.0);
        cart.addItem(5.0);
        assertEquals(35.0, cart.getTotal());
    }

    @Test
    @DisplayName("Total with 10% tax is correct")
    void totalWithTax() {
        cart.addItem(100.0);
        assertEquals(110.0, cart.getTotalWithTax(0.10), 0.001);
    }

    @Test
    @DisplayName("Negative price throws IllegalArgumentException")
    void negativePriceThrows() {
        assertThrows(IllegalArgumentException.class, () -> cart.addItem(-5.0));
    }

    @Test
    @DisplayName("Invalid tax rate throws IllegalArgumentException")
    void invalidTaxRateThrows() {
        cart.addItem(50.0);
        assertThrows(IllegalArgumentException.class, () -> cart.getTotalWithTax(1.5));
    }

    @Test
    @DisplayName("Clearing cart resets count to zero")
    void clearCart() {
        cart.addItem(10.0);
        cart.addItem(20.0);
        cart.clear();
        assertEquals(0, cart.getItemCount());
        assertEquals(0.0, cart.getTotal());
    }
}`,
  codeTitle: 'Full TDD Workflow in Maven',
  points: [
    'Run tests with mvn test; run specific class with -Dtest=ClassName; run specific method with -Dtest=ClassName#method',
    'mvn clean test is safer when facing classpath or compilation issues — starts fresh',
    'Maven generates test reports in target/surefire-reports/ — .txt for humans, .xml for CI tools',
    'BUILD FAILURE with exit code 1 when any test fails — CI/CD pipelines use this to block bad deploys',
    '@BeforeEach creates a fresh test fixture before each test — eliminates state bleed between tests',
    'assertEquals for doubles accepts a third parameter (delta) for floating-point comparison: assertEquals(1.0, result, 0.001)',
    'Most IDEs (IntelliJ, Eclipse, VS Code) have built-in JUnit 5 support — run tests with a single click',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'When comparing doubles with assertEquals, never compare for exact equality — floating-point arithmetic is not exact. Always use assertEquals(expected, actual, delta) with a small delta (0.001 or 0.0001) to allow for rounding errors.',
    },
    {
      type: 'interview',
      content: 'Q: Where does Maven store test reports and what formats are used?\nA: target/surefire-reports/. Each test class gets a .txt summary and a .xml detailed report. The XML format is compatible with JUnit report standards used by Jenkins, GitHub Actions, and other CI tools.',
    },
    {
      type: 'tip',
      content: 'In IntelliJ, use Ctrl+Shift+T to quickly navigate between a class and its test class. This shortcut also offers to create a new test class skeleton if one does not exist yet.',
    },
  ],
}
