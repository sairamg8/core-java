export default {
  id: 'skipping-tests-with-assumptions',
  title: '162. Skipping Tests with Assumptions',
  explanation: `Assumptions let a test abort gracefully when preconditions are not met, without marking it as a failure. If an assumption fails, the test is skipped (marked "aborted"), not failed.

**Why assumptions?**
Some tests only make sense in specific environments. If the environment is wrong, we do not want a failure — we want the test to say "I could not run, the precondition was not met."

**Core Assumptions API:**
From org.junit.jupiter.api.Assumptions:
  assumeTrue(condition)        — aborts if condition is false
  assumeFalse(condition)       — aborts if condition is true
  assumingThat(condition, executable) — only runs executable if condition is true; rest of test continues

**Difference from conditions (@EnabledIf...):**
- Conditions: applied at the class or method level, skip the test entirely before setup
- Assumptions: inside the test body, allowing partial setup before checking the precondition

**assumingThat vs assumeTrue:**
- assumeTrue: if false, the entire test is aborted immediately
- assumingThat: if false, just skips the executable block, but the test continues after it

**Common use cases:**
- Tests that require an external service to be up
- Tests that only run on specific environments
- Tests that require a specific file to exist
- Integration tests that check DB connection first

**AbortedException:**
When an assumption fails, JUnit throws TestAbortedException. The test is reported as "aborted," which is different from "failed."`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.api.Assumptions;
import static org.junit.jupiter.api.Assumptions.*;
import static org.junit.jupiter.api.Assertions.*;

class AssumptionsTest {

    // assumeTrue — abort if condition is false
    @Test
    void onlyOnLinux() {
        String os = System.getProperty("os.name").toLowerCase();
        assumeTrue(os.contains("linux"), "Test only runs on Linux");
        // Everything below only executes on Linux
        assertTrue(os.contains("linux"));
    }

    // assumeFalse — abort if condition is true
    @Test
    void skipOnCI() {
        String ci = System.getenv("CI");
        assumeFalse("true".equals(ci), "Skipping in CI environment");
        // Only runs locally
        System.out.println("Running outside CI");
    }

    // assumingThat — conditional block, test continues after
    @Test
    void conditionalBlock() {
        String env = System.getProperty("env", "dev");

        // This block only runs in production
        assumingThat("prod".equals(env), () -> {
            System.out.println("Production-specific check");
            assertTrue(checkProdDatabase());
        });

        // This runs regardless of env
        assertTrue(true, "This always runs");
    }

    // External service check
    @Test
    void externalServiceTest() {
        boolean serviceAvailable = isServiceAvailable("http://localhost:8080");
        assumeTrue(serviceAvailable, "External service not available — skipping");
        // Only runs if service is up
        assertEquals(200, httpGet("http://localhost:8080/health"));
    }

    // File existence check
    @Test
    void fileProcessingTest() {
        java.io.File config = new java.io.File("/etc/app/config.json");
        assumeTrue(config.exists(), "Config file not found — skipping");
        // Only runs if file exists
        assertNotNull(config.getPath());
    }

    // Multiple assumptions
    @Test
    void multipleAssumptions() {
        String os = System.getProperty("os.name");
        assumeTrue(os != null, "OS property must be set");
        assumeTrue(os.length() > 0, "OS name must not be empty");
        assertNotNull(os);
    }

    boolean isServiceAvailable(String url) { return false; } // simulated
    int httpGet(String url) { return 200; }
    boolean checkProdDatabase() { return true; }
}`,
  codeTitle: 'Skipping Tests with Assumptions',
  points: [
    'assumeTrue(cond) aborts the test if cond is false — the test is reported as "aborted," not "failed"',
    'assumeFalse(cond) aborts the test if cond is true — inverse of assumeTrue',
    'assumingThat(cond, block) runs the block only if cond is true, but the test continues regardless after the block',
    'An aborted test (failed assumption) is not counted as a test failure — it is a graceful skip',
    'Assumptions check conditions at runtime inside the test body; @EnabledIf checks conditions before the test runs',
    'TestAbortedException is thrown internally when an assumption fails — do not catch this exception',
    'Always provide a message explaining WHY the assumption was needed, for clarity in test reports',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Do not confuse assumptions with assertions. An assumption failure = test skipped (aborted). An assertion failure = test failed. Never use assumeTrue to hide expected failures — use assertions for correctness checks.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between assumeTrue and assertTrue in JUnit 5?\nA: assumeTrue checks a precondition — if false, the test is aborted (skipped) and reported as "aborted." assertTrue checks a correctness condition — if false, the test fails. Use assumptions for environment checks, assertions for behavior verification.',
    },
    {
      type: 'tip',
      content: 'Use assumingThat when you want to run extra checks in one environment but continue the rest of the test in all environments. For example: log extra debug info in dev, but always verify the core behavior.',
    },
  ],
}
