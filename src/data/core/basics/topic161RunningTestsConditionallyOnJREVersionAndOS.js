export default {
  id: 'running-tests-conditionally-on-jre-version-and-os',
  title: '161. Running Tests Conditionally on JRE Version and OS',
  explanation: `JUnit 5 provides condition annotations to enable or disable tests based on the runtime environment — operating system, JRE version, system properties, or environment variables.

**OS Conditions:**
  @EnabledOnOs(OS.WINDOWS)       — only runs on Windows
  @EnabledOnOs(OS.LINUX)         — only runs on Linux
  @EnabledOnOs(OS.MAC)           — only runs on macOS
  @DisabledOnOs(OS.WINDOWS)      — skipped on Windows

Multiple OS: @EnabledOnOs({OS.LINUX, OS.MAC})

**JRE Version Conditions:**
  @EnabledOnJre(JRE.JAVA_17)     — only on Java 17
  @EnabledOnJre({JRE.JAVA_17, JRE.JAVA_21}) — on 17 or 21
  @DisabledOnJre(JRE.JAVA_8)    — skipped on Java 8
  @EnabledForJreRange(min = JRE.JAVA_11, max = JRE.JAVA_17) — range

**System Property Conditions:**
  @EnabledIfSystemProperty(named = "os.arch", matches = ".*64.*")
  @DisabledIfSystemProperty(named = "ci.environment", matches = "true")

**Environment Variable Conditions:**
  @EnabledIfEnvironmentVariable(named = "ENV", matches = "production")
  @DisabledIfEnvironmentVariable(named = "SKIP_SLOW", matches = "true")

**Custom Conditions:**
  @EnabledIf("customConditionMethod")
  boolean customConditionMethod() { return someComplexCheck(); }

**Use cases:**
- File path tests that differ between OS (/ vs \\)
- Tests using features only available in newer JRE versions
- Tests that should skip in CI environments
- Performance tests that only run on 64-bit systems`,
  code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.*;
import static org.junit.jupiter.api.Assertions.*;

class ConditionalTest {

    // OS-specific tests
    @Test
    @EnabledOnOs(OS.WINDOWS)
    void windowsPathTest() {
        String sep = System.getProperty("file.separator");
        assertEquals("\\\\", sep);
    }

    @Test
    @EnabledOnOs({OS.LINUX, OS.MAC})
    void unixPathTest() {
        String sep = System.getProperty("file.separator");
        assertEquals("/", sep);
    }

    @Test
    @DisabledOnOs(OS.WINDOWS)
    void scriptExecutionTest() {
        // Bash scripts not available on Windows
        System.out.println("Running bash-dependent test on Unix");
        assertTrue(true);
    }

    // JRE version conditions
    @Test
    @EnabledOnJre(JRE.JAVA_17)
    void java17FeatureTest() {
        // Test sealed classes, pattern matching, records, etc.
        record Point(int x, int y) {}
        Point p = new Point(1, 2);
        assertEquals(1, p.x());
    }

    @Test
    @EnabledForJreRange(min = JRE.JAVA_11, max = JRE.JAVA_21)
    void modernJavaTest() {
        // Features available from Java 11 to 21
        var list = java.util.List.of(1, 2, 3);
        assertEquals(3, list.size());
    }

    @Test
    @DisabledOnJre(JRE.JAVA_8)
    void notForJava8() {
        // Uses features not available in Java 8
        assertTrue(true);
    }

    // System property conditions
    @Test
    @EnabledIfSystemProperty(named = "java.vm.vendor", matches = ".*Oracle.*")
    void oracleJvmTest() {
        System.out.println("Running on Oracle JVM");
    }

    // Environment variable conditions
    @Test
    @DisabledIfEnvironmentVariable(named = "CI", matches = "true")
    void skipInCI() {
        // This test needs a display — skip in headless CI
        System.out.println("Running locally");
    }

    @Test
    @EnabledIfEnvironmentVariable(named = "RUN_PERF_TESTS", matches = "true")
    void performanceTest() {
        // Only runs when env var is set
        System.out.println("Running performance test");
    }
}`,
  codeTitle: 'Conditional Test Execution by OS and JRE',
  points: [
    '@EnabledOnOs and @DisabledOnOs control test execution by operating system (WINDOWS, LINUX, MAC, etc.)',
    '@EnabledOnJre and @DisabledOnJre target specific Java versions; @EnabledForJreRange targets a version range',
    '@EnabledIfSystemProperty and @DisabledIfSystemProperty use system property values (supports regex matching)',
    '@EnabledIfEnvironmentVariable and @DisabledIfEnvironmentVariable check environment variables (supports regex)',
    'Skipped conditional tests appear in the report as "disabled" — they are not counted as failures',
    'Multiple OS values: @EnabledOnOs({OS.LINUX, OS.MAC}) — tests run on any of the listed systems',
    '@EnabledIf("methodName") enables custom programmatic conditions for complex cases',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The matches parameter in @EnabledIfSystemProperty and @EnabledIfEnvironmentVariable is a regular expression, not a literal string. "true" matches "true" but also "truefalse". Use "^true$" for an exact match.',
    },
    {
      type: 'interview',
      content: 'Q: How do you skip a test in JUnit 5 when running in CI?\nA: Use @DisabledIfEnvironmentVariable(named = "CI", matches = "true"). Most CI systems set the CI environment variable to "true". Alternatively, use @Tag("local-only") and configure your CI to exclude that tag with -DexcludedGroups=local-only.',
    },
    {
      type: 'tip',
      content: 'Avoid writing OS-specific tests if you can abstract the OS dependency. For file paths, use Path and Files from java.nio — these handle separators correctly on all platforms. OS-conditional tests should be reserved for genuinely OS-specific behavior.',
    },
  ],
}
