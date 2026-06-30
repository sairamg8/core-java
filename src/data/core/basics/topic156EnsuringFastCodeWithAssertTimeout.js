export default {
  id: 'ensuring-fast-code-with-assert-timeout',
  title: '156. Ensuring Fast Code with assertTimeout()',
  explanation: `Performance is part of correctness. JUnit 5 provides assertTimeout() and assertTimeoutPreemptively() to verify that code completes within a time limit.

**assertTimeout(duration, executable)**
Runs the executable and fails if it takes longer than the given Duration. The executable runs in the SAME thread — the timeout check happens AFTER completion.
  assertTimeout(Duration.ofSeconds(2), () -> slowMethod());

**assertTimeoutPreemptively(duration, executable)**
Runs the executable in a SEPARATE thread and aborts it if the duration is exceeded. This is a true preemptive timeout.
  assertTimeoutPreemptively(Duration.ofMillis(500), () -> verySlowMethod());

**Key difference:**
- assertTimeout: waits for the method to finish, then checks if it took too long. The method ALWAYS runs to completion.
- assertTimeoutPreemptively: interrupts the method after the deadline. The method is STOPPED early.

**Duration class:**
  Duration.ofSeconds(2)
  Duration.ofMillis(500)
  Duration.ofMinutes(1)

**Return values:**
Both methods can return a value:
  String result = assertTimeout(Duration.ofSeconds(1), () -> fetchData());

**Use cases:**
- Ensuring database queries complete within SLA
- Verifying sorting/searching algorithms are O(n log n) or better
- API response time guarantees
- Detecting infinite loops or deadlocks in tests

**Warning:**
Timeout tests can be flaky on slow CI servers. Set generous timeouts or mark them as @Tag("performance") and run separately.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.time.Duration;

class TimeoutTest {

    // Basic assertTimeout — fails AFTER the method completes if it took too long
    @Test
    void methodMustFinishInTime() {
        assertTimeout(Duration.ofSeconds(2), () -> {
            Thread.sleep(100); // Fast enough — completes in 100ms
        });
    }

    // assertTimeout with return value
    @Test
    void methodReturnsValueInTime() {
        String result = assertTimeout(Duration.ofMillis(500), () -> {
            return computeResult();
        });
        assertEquals("done", result);
    }

    // assertTimeoutPreemptively — ABORTS if too slow
    @Test
    void preemptiveTimeout() {
        assertTimeoutPreemptively(Duration.ofMillis(500), () -> {
            Thread.sleep(100); // Fast — completes before timeout
        });
    }

    // This test FAILS because method is too slow
    @Test
    @Disabled("Demonstrates timeout failure — intentionally slow")
    void tooSlow() {
        assertTimeout(Duration.ofMillis(100), () -> {
            Thread.sleep(1000); // 1s > 100ms limit
        });
    }

    // Timeout in service test context
    @Test
    void sortingAlgorithmIsEfficient() {
        int[] largeArray = generateArray(10000);
        assertTimeout(Duration.ofMillis(200), () -> {
            java.util.Arrays.sort(largeArray);
        });
    }

    // Duration variants
    @Test
    void durationExamples() {
        assertTimeout(Duration.ofSeconds(1), () -> fastOperation());
        assertTimeout(Duration.ofMillis(500), () -> fastOperation());
        assertTimeout(Duration.ofNanos(100_000_000L), () -> fastOperation());
    }

    String computeResult() throws InterruptedException {
        Thread.sleep(50);
        return "done";
    }

    void fastOperation() {
        int x = 1 + 1;
    }

    int[] generateArray(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) arr[i] = size - i;
        return arr;
    }
}`,
  codeTitle: 'assertTimeout() and assertTimeoutPreemptively()',
  points: [
    'assertTimeout(Duration, executable) fails if the executable takes longer than the Duration — but always lets it finish',
    'assertTimeoutPreemptively(Duration, executable) runs in a new thread and aborts the executable when the deadline is exceeded',
    'Use Duration.ofSeconds(), Duration.ofMillis(), Duration.ofMinutes() to specify the time limit',
    'Both methods can return a value: String result = assertTimeout(Duration.ofSeconds(1), () -> fetchData())',
    'assertTimeout is safer for tests with cleanup logic — it always completes; assertTimeoutPreemptively may leave resources open',
    'Timeout tests can be flaky on slow CI — use generous limits and tag them separately from regular unit tests',
    'Use assertTimeout for performance regression testing — detect when an algorithm goes from O(n log n) to O(n^2)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'assertTimeoutPreemptively runs in a separate thread — it breaks ThreadLocal state and can interfere with Spring Test Context or transaction management. Prefer assertTimeout unless you specifically need true preemption.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between assertTimeout and assertTimeoutPreemptively?\nA: assertTimeout waits for the code to finish and then checks the elapsed time — the code always runs to completion. assertTimeoutPreemptively runs the code in a separate thread and stops it after the deadline, making it a true hard timeout.',
    },
    {
      type: 'tip',
      content: 'Do not set extremely tight timeouts in regular unit tests — aim for 10-100x the expected duration to avoid flakiness. For true performance benchmarks, use a dedicated framework like JMH (Java Microbenchmark Harness), not JUnit assertions.',
    },
  ],
}
