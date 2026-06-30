export default {
  id: 'tdd-in-action',
  title: '149. TDD in Action: Writing Tests Before Code',
  explanation: `Test-Driven Development (TDD) is a development practice where you write the test BEFORE writing the production code. This seems backwards at first, but it has profound benefits.

**The TDD cycle: Red → Green → Refactor**
1. **Red** — Write a test for a behavior that does not exist yet. The test MUST fail. If it passes immediately, either the behavior already exists or the test is wrong.
2. **Green** — Write the MINIMUM amount of code to make the test pass. Do not optimize, do not add extra features.
3. **Refactor** — Improve the code (remove duplication, improve naming, extract methods) without changing behavior. Tests guarantee you haven't broken anything.

**Benefits of TDD:**
- Forces you to think about the API BEFORE implementation — leads to better-designed, more testable code
- Guarantees every feature has a test from day one
- Faster feedback loop — you know immediately if code works
- Acts as living documentation of expected behavior
- Reduces debugging time — you always know which exact change broke what

**TDD vs writing tests after:**
- Writing tests after: you test what the code does (not what it SHOULD do) — subtly biased
- TDD: you test what the code SHOULD do, then make it do that — drives correct behavior

**When NOT to use TDD:**
- Exploratory spikes — when you are figuring out an approach
- UI code — testing UI layout is hard (use it for business logic in the UI, not the layout itself)
- Prototype work — but rewrite with TDD before shipping`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

// TDD in action: Building a FizzBuzz function step by step

// STEP 1: Write failing test for "number returns the number as string"
// STEP 2: Implement minimum code to pass
// STEP 3: Write next failing test for "divisible by 3 returns Fizz"
// ... and so on

// Final production class (built incrementally via TDD):
class FizzBuzz {
    static String compute(int n) {
        if (n <= 0) throw new IllegalArgumentException("n must be positive");
        if (n % 15 == 0) return "FizzBuzz";
        if (n % 3 == 0) return "Fizz";
        if (n % 5 == 0) return "Buzz";
        return String.valueOf(n);
    }
}

// Tests written BEFORE the implementation (TDD)
class FizzBuzzTest {

    // Test 1 (written first — fails because FizzBuzz doesn't exist yet)
    @Test
    @DisplayName("Regular number returns number as string")
    void regularNumber() {
        assertEquals("1", FizzBuzz.compute(1));
        assertEquals("2", FizzBuzz.compute(2));
        assertEquals("4", FizzBuzz.compute(4));
    }

    // Test 2 (written second)
    @Test
    @DisplayName("Multiple of 3 returns Fizz")
    void multipleOfThree() {
        assertEquals("Fizz", FizzBuzz.compute(3));
        assertEquals("Fizz", FizzBuzz.compute(6));
        assertEquals("Fizz", FizzBuzz.compute(9));
    }

    // Test 3
    @Test
    @DisplayName("Multiple of 5 returns Buzz")
    void multipleOfFive() {
        assertEquals("Buzz", FizzBuzz.compute(5));
        assertEquals("Buzz", FizzBuzz.compute(10));
        assertEquals("Buzz", FizzBuzz.compute(20));
    }

    // Test 4 — reveals the need to check 15 before 3 and 5
    @Test
    @DisplayName("Multiple of 15 returns FizzBuzz")
    void multipleOfFifteen() {
        assertEquals("FizzBuzz", FizzBuzz.compute(15));
        assertEquals("FizzBuzz", FizzBuzz.compute(30));
    }

    // Test 5 — edge case
    @Test
    @DisplayName("Zero or negative number throws exception")
    void invalidInput() {
        assertThrows(IllegalArgumentException.class, () -> FizzBuzz.compute(0));
        assertThrows(IllegalArgumentException.class, () -> FizzBuzz.compute(-1));
    }
}

// TDD order of writing tests drove the design:
// 1. wrote test for n=1 → added simple return String.valueOf(n)
// 2. wrote test for n=3 → added if n%3 == 0 return "Fizz"
// 3. wrote test for n=5 → added if n%5 == 0 return "Buzz"
// 4. wrote test for n=15 → DISCOVERED that 15%3==0 also matches, must check 15 first
// 5. wrote test for 0 → added validation`,
  codeTitle: 'TDD Red-Green-Refactor Cycle',
  points: [
    'TDD cycle: write a FAILING test (Red), write minimum code to pass (Green), improve code without breaking tests (Refactor)',
    'The test must fail first — if it passes immediately, either the feature already exists or the test is wrong',
    'TDD forces API design before implementation — you think as a consumer of the API, leading to better interfaces',
    'Each test written before code is a specific acceptance criterion — it defines exactly what "done" means for that behavior',
    'The refactor step is only safe because tests guard against regression — TDD enables fearless refactoring',
    'TDD produces 100% test coverage of written features by definition — every feature has a failing test before it is implemented',
    'TDD is about confidence and design — not about following rules blindly; adapt for exploratory or UI work',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Writing tests AFTER code is tempting because you know the implementation. But then you test what the code DOES, not what it SHOULD do. TDD forces you to define expected behavior first, before you are anchored to an implementation.',
    },
    {
      type: 'interview',
      content: 'Q: What are the benefits of TDD over writing tests after the code?\nA: TDD drives better API design (you think as a consumer first), guarantees all features have tests, catches bugs at the moment they are introduced, provides executable specifications, and enables refactoring with confidence. Tests written after often have gaps because the developer knows the implementation and writes tests to confirm what it does.',
    },
    {
      type: 'tip',
      content: 'Start with the simplest failing test you can write. Write the minimum code to pass it, then add the next simplest failing test. This incremental approach keeps you focused and prevents over-engineering.',
    },
  ],
}
