export default {
  id: 'configuring-surefire-plugin',
  title: '150. Configuring the Surefire Plugin in a Maven Project',
  explanation: `The Maven Surefire Plugin is responsible for running unit tests during the test phase of the Maven build. Correct configuration is essential for JUnit 5 tests to run, and Surefire offers many options to customize test execution.

**Minimum configuration for JUnit 5:**
  <plugin>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.1.2</version>
  </plugin>

Without this explicit version declaration, Maven uses an older default that does NOT support JUnit 5.

**Common Surefire configurations:**

**Include/Exclude patterns:**
By default, Surefire runs classes matching *Test, Test*, *Tests, *TestCase. You can customize:
  <includes><include>**/*Spec.java</include></includes>
  <excludes><exclude>**/IntegrationTest*.java</exclude></excludes>

**Skip tests:**
  mvn install -DskipTests — skip running tests (but compile them)
  mvn install -Dmaven.test.skip=true — skip compiling AND running tests

**Running specific tests:**
  -Dtest=ClassName — run one class
  -Dtest=ClassName#methodName — run one method
  -Dtest=Class1,Class2 — run multiple classes

**Parallel execution:**
  <parallel>methods</parallel>
  <threadCount>4</threadCount>

**Timeout:**
  <forkedProcessTimeoutInSeconds>120</forkedProcessTimeoutInSeconds>

**Surefire reports:**
Written to target/surefire-reports/ — includes .txt summary and .xml JUnit report (used by CI tools).`,
  code: `<!-- Complete pom.xml with Surefire configuration -->
<!-- <project> -->
<!--   <groupId>com.example</groupId> -->
<!--   <artifactId>myapp</artifactId> -->
<!--   <version>1.0-SNAPSHOT</version> -->

<!--   <properties> -->
<!--     <java.version>17</java.version> -->
<!--     <maven.compiler.source>17</maven.compiler.source> -->
<!--     <maven.compiler.target>17</maven.compiler.target> -->
<!--     <junit.version>5.10.0</junit.version> -->
<!--     <surefire.version>3.1.2</surefire.version> -->
<!--   </properties> -->

<!--   <dependencies> -->
<!--     <dependency> -->
<!--       <groupId>org.junit.jupiter</groupId> -->
<!--       <artifactId>junit-jupiter</artifactId> -->
<!--       <version>${junit.version}</version> -->
<!--       <scope>test</scope> -->
<!--     </dependency> -->
<!--   </dependencies> -->

<!--   <build> -->
<!--     <plugins> -->
<!--       <plugin> -->
<!--         <groupId>org.apache.maven.plugins</groupId> -->
<!--         <artifactId>maven-surefire-plugin</artifactId> -->
<!--         <version>${surefire.version}</version> -->
<!--         <configuration> -->
<!--           <!- Fail build immediately on first test failure --> -->
<!--           <failIfNoTests>false</failIfNoTests> -->

<!--           <!- Include custom patterns --> -->
<!--           <includes> -->
<!--             <include>**/*Test.java</include> -->
<!--             <include>**/*Tests.java</include> -->
<!--             <include>**/*Spec.java</include> -->
<!--           </includes> -->

<!--           <!- Exclude slow integration tests from unit test phase --> -->
<!--           <excludes> -->
<!--             <exclude>**/*IT.java</exclude> -->
<!--             <exclude>**/*IntegrationTest.java</exclude> -->
<!--           </excludes> -->

<!--           <!- Run in parallel for speed --> -->
<!--           <parallel>methods</parallel> -->
<!--           <threadCount>4</threadCount> -->
<!--           <useUnlimitedThreads>false</useUnlimitedThreads> -->

<!--           <!- System properties for tests --> -->
<!--           <systemPropertyVariables> -->
<!--             <spring.profiles.active>test</spring.profiles.active> -->
<!--           </systemPropertyVariables> -->
<!--         </configuration> -->
<!--       </plugin> -->
<!--     </plugins> -->
<!--   </build> -->
<!-- </project> -->

// Common Maven test commands:
// mvn test                             - run all tests
// mvn test -Dtest=CalculatorTest       - run one class
// mvn test -Dtest=CalculatorTest#add   - run one method
// mvn test -Dtest="Calc*,Parser*"      - wildcard patterns
// mvn install -DskipTests              - build without running tests
// mvn clean test                       - clean first, then test
// mvn verify                           - tests + integration tests + verify phase
// mvn surefire:test                    - run surefire directly (skips other phases)

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

// Example test that respects the surefire config
class CalculatorSurefireTest {

    @Test
    void addPositiveNumbers() {
        assertEquals(7, 3 + 4);
    }

    @Test
    void multiplyNumbers() {
        assertEquals(12, 3 * 4);
    }

    @BeforeAll
    static void beforeAllTests() {
        System.out.println("Starting test suite: CalculatorSurefireTest");
    }

    @AfterAll
    static void afterAllTests() {
        System.out.println("Completed test suite: CalculatorSurefireTest");
    }
}`,
  codeTitle: 'Surefire Plugin Configuration',
  points: [
    'Surefire 3.x is required for JUnit 5 — declare it explicitly in pom.xml, never rely on the Maven default',
    'Default test discovery matches: *Test.java, Test*.java, *Tests.java, *TestCase.java',
    'Use includes/excludes to separate unit tests from integration tests — run fast tests in test phase, slow ones in verify',
    'mvn install -DskipTests skips running but still compiles tests; -Dmaven.test.skip=true skips both compilation and running',
    'Surefire writes XML reports to target/surefire-reports/ — Jenkins, GitHub Actions, and other CI tools parse these',
    'Enable parallel test execution with <parallel>methods</parallel> for faster test suites',
    'failIfNoTests=false prevents build failure when a module has no test classes — useful in multi-module projects',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Using -DskipTests=true in CI to "save time" is a bad practice — it defeats the purpose of CI. Only skip tests in very specific scenarios (e.g., deploying from a verified artifact). Never make skipping tests a default habit.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between mvn test and mvn verify?\nA: mvn test runs unit tests (Surefire). mvn verify runs unit tests + integration tests (Failsafe plugin) + any other verification checks. Separate fast unit tests (test phase) from slow integration tests (integration-test phase) for a fast feedback loop.',
    },
    {
      type: 'tip',
      content: 'Use the Failsafe plugin (not Surefire) for integration tests. Name integration test classes with *IT suffix. Configure Failsafe in the integration-test/verify phases so that mvn test runs only unit tests and mvn verify runs everything.',
    },
  ],
}
