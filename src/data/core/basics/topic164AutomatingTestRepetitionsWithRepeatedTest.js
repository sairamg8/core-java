export default {
  id: 'automating-test-repetitions-with-repeated-test',
  title: '164. Automating Test Repetitions with @RepeatedTest',
  explanation: `@RepeatedTest runs the same test method multiple times. Useful for testing non-deterministic behavior, random outputs, concurrency, and ensuring stability.

**Basic syntax:**
  @RepeatedTest(5)
  void myTest() { ... } // runs 5 times

**RepetitionInfo injection:**
JUnit 5 injects a RepetitionInfo parameter with:
  repetitionInfo.getCurrentRepetition()  // 1, 2, 3...
  repetitionInfo.getTotalRepetitions()   // total count

**Display names:**
Default: "repetition 1 of 5", "repetition 2 of 5", ...
Custom: @RepeatedTest(value = 5, name = "Run {currentRepetition} of {totalRepetitions}")
Placeholders: {currentRepetition}, {totalRepetitions}, {displayName}

**Use cases:**
1. Testing random-based methods — verify they always return valid results
2. Concurrency testing — run the same scenario many times to expose race conditions
3. Performance sampling — measure average time over N runs
4. Verifying stateless behavior — ensure results do not depend on execution count

**Combining with @BeforeEach:**
@BeforeEach runs before EACH repetition — each run starts with clean state.

**When NOT to use @RepeatedTest:**
For different input values, use @ParameterizedTest instead. @RepeatedTest is for the exact same test with no input variation.

**Caution:**
Running a test 100 times does not make it a stress test or substitute for proper concurrency testing. Use it for light stability checks.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class RepeatedTestDemo {

    // Basic repetition — runs 5 times
    @RepeatedTest(5)
    void alwaysReturnsTrue() {
        assertTrue(isAlive());
    }

    // With RepetitionInfo
    @RepeatedTest(3)
    void withRepetitionInfo(RepetitionInfo info) {
        System.out.printf("Running repetition %d of %d%n",
            info.getCurrentRepetition(),
            info.getTotalRepetitions());
        assertTrue(info.getCurrentRepetition() <= info.getTotalRepetitions());
    }

    // Custom display name
    @RepeatedTest(value = 4, name = "Dice roll #{currentRepetition}")
    void diceRollAlwaysInRange() {
        int roll = rollDice();
        assertTrue(roll >= 1 && roll <= 6, "Dice must be between 1 and 6");
    }

    // Testing random UUID format
    @RepeatedTest(10)
    void uuidAlwaysValid() {
        String id = UUID.randomUUID().toString();
        // UUID format: 8-4-4-4-12
        assertTrue(id.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"),
            "UUID does not match expected format: " + id);
    }

    // Verifying stateless method
    @RepeatedTest(value = 5, name = "Factorial stability check #{currentRepetition}")
    void factorialIsStable(RepetitionInfo info) {
        // Same input, same result every time
        assertEquals(120, factorial(5));
    }

    // Simulating concurrency check
    @RepeatedTest(20)
    void counterIsThreadSafe() throws InterruptedException {
        SafeCounter counter = new SafeCounter();
        Thread t1 = new Thread(() -> { for (int i = 0; i < 100; i++) counter.increment(); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 100; i++) counter.increment(); });
        t1.start(); t2.start();
        t1.join(); t2.join();
        assertEquals(200, counter.get());
    }

    boolean isAlive() { return true; }

    int rollDice() { return new Random().nextInt(6) + 1; }

    long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    static class SafeCounter {
        private final java.util.concurrent.atomic.AtomicInteger count = new java.util.concurrent.atomic.AtomicInteger();
        void increment() { count.incrementAndGet(); }
        int get() { return count.get(); }
    }
}`,
  codeTitle: '@RepeatedTest for Test Repetitions',
  points: [
    '@RepeatedTest(N) runs the same test method N times — useful for non-deterministic or random-based tests',
    'RepetitionInfo parameter provides getCurrentRepetition() and getTotalRepetitions() inside the test',
    'Custom display name with {currentRepetition} and {totalRepetitions} placeholders improves readability',
    '@BeforeEach runs before each repetition — every run starts with a clean state',
    'Use @RepeatedTest for: random output stability, UUID format checks, stateless method verification',
    'For different inputs per run, use @ParameterizedTest instead — @RepeatedTest uses the same inputs each time',
    'Repetitions run sequentially by default — for true concurrency testing, use multiple threads within the test',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '@RepeatedTest runs repetitions sequentially, not in parallel. If you need parallel execution for stress testing, configure JUnit 5 parallel execution or use a dedicated concurrency testing framework. @RepeatedTest alone is not a substitute for load testing.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use @RepeatedTest instead of @ParameterizedTest?\nA: @RepeatedTest is for running the SAME test multiple times — useful for verifying non-deterministic behavior (random values, timing). @ParameterizedTest is for running the same test with DIFFERENT inputs — useful for boundary value testing.',
    },
    {
      type: 'tip',
      content: 'Use @RepeatedTest to verify that a method is truly stateless. If a method depends on shared state that is not reset between calls, repeated runs will expose it. This is a lightweight way to catch accidental state leakage.',
    },
  ],
}
