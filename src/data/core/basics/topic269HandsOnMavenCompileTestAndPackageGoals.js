export default {
  id: 'hands-on-maven-compile-test-package',
  title: '269. Hands-On Maven Compile, Test, and Package Goals',
  explanation: `This is the practical, hands-on use of the three most common Maven phases: \`compile\`, \`test\`, and \`package\`. Each one builds on the previous.

**mvn compile:**
Compiles \`src/main/java\` into \`target/classes\`. It does NOT compile tests or run them.
\`\`\`bash
mvn compile
# Output appears in target/classes/
\`\`\`

**mvn test:**
Compiles main code AND test code, then runs all tests using the Surefire plugin. If any test fails, the build fails.
\`\`\`bash
mvn test
# Compiles target/classes + target/test-classes, runs tests
# Results in target/surefire-reports/
\`\`\`

**mvn package:**
Does everything \`test\` does, then bundles \`target/classes\` + resources into a JAR or WAR in \`target/\`.
\`\`\`bash
mvn package
# Produces target/my-app-1.0-SNAPSHOT.jar (after compiling AND testing)
\`\`\`

**The key insight — phases are cumulative:**
Because phases run in order, \`mvn package\` automatically runs validate → compile → test → package. You never need to run \`mvn compile test package\` — just \`mvn package\` does all three.

**Adding clean:**
\`target/\` is not deleted automatically. To guarantee a fresh build:
\`\`\`bash
mvn clean package
# 'clean' deletes target/ first, then runs the full build
\`\`\`

**Skipping tests (use sparingly):**
\`\`\`bash
mvn package -DskipTests          # compiles tests but does NOT run them
mvn package -Dmaven.test.skip=true   # does NOT even compile tests
\`\`\`

**Reading the output:**
- \`BUILD SUCCESS\` — everything passed
- \`BUILD FAILURE\` — a compilation error or test failure stopped the build
- Surefire prints \`Tests run: X, Failures: Y, Errors: Z, Skipped: W\``,
  code: `# ===== Hands-On: compile, test, package =====

# --- 1. mvn compile: compile main source only ---
mvn compile
# [INFO] Compiling 5 source files to /project/target/classes
# Produces: target/classes/**/*.class
# Does NOT compile or run tests.

# --- 2. mvn test: compile main + test code, then run tests ---
mvn test
# [INFO] Compiling 5 source files to target/classes
# [INFO] Compiling 3 source files to target/test-classes
# [INFO] -------------------------------------------------------
# [INFO]  T E S T S
# [INFO] -------------------------------------------------------
# [INFO] Running com.example.AppTest
# [INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
# [INFO] BUILD SUCCESS
# A failing test => BUILD FAILURE and no further phases run.

# --- 3. mvn package: compile + test + build the JAR/WAR ---
mvn package
# Runs compile and test first (cumulative phases), then:
# [INFO] Building jar: /project/target/my-app-1.0-SNAPSHOT.jar
# [INFO] BUILD SUCCESS
# Produces: target/my-app-1.0-SNAPSHOT.jar

# --- 4. mvn clean package: delete target/ first for a fresh build ---
mvn clean package
# [INFO] Deleting /project/target
# ...then full build from scratch

# --- Run the packaged artifact ---
java -cp target/my-app-1.0-SNAPSHOT.jar com.example.App


# ===== Useful flags =====

mvn package -DskipTests           # compile tests but skip running them
mvn package -Dmaven.test.skip=true # skip compiling AND running tests
mvn test -Dtest=AppTest           # run only one test class
mvn -o package                    # offline mode: use only cached dependencies
mvn -X package                    # debug output (verbose) for troubleshooting


# ===== What ends up in target/ after package =====
# target/
#   classes/              <- compiled main code
#   test-classes/         <- compiled test code
#   surefire-reports/     <- test result XML/txt
#   my-app-1.0-SNAPSHOT.jar  <- the packaged artifact`,
  codeTitle: 'mvn compile, test, package — Hands-On',
  points: [
    'mvn compile compiles only src/main/java into target/classes — it does not touch tests',
    'mvn test compiles both main and test code, then runs all tests; any test failure fails the build',
    'mvn package runs compile and test first (phases are cumulative), then bundles the JAR/WAR',
    'You never chain mvn compile test package — running the latest phase automatically runs all earlier phases',
    'target/ is not auto-deleted; prefix with clean (mvn clean package) for a guaranteed fresh build',
    '-DskipTests compiles but does not run tests; -Dmaven.test.skip=true skips compiling tests entirely',
    'BUILD SUCCESS vs BUILD FAILURE tells you the result; Surefire reports show tests run, failures, and errors',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If a test fails during mvn package, the build STOPS at the test phase and no JAR is produced. Beginners sometimes see 'BUILD FAILURE' and look for a packaging problem when the real cause is a failing unit test higher up. Always read the Surefire output — 'Tests run: X, Failures: Y' tells you a test, not the packaging, broke the build.",
    },
    {
      type: 'interview',
      content: "Q: If you run mvn package, which phases execute?\nA: Because the default lifecycle phases are cumulative, mvn package runs every phase from the start of the default lifecycle up to and including package: validate, initialize, generate-sources, compile, process-test-resources, test-compile, test, prepare-package, and package. In practice this means it compiles your code, compiles and runs your tests, and only then builds the JAR/WAR — all from the single package command.",
    },
    {
      type: 'tip',
      content: "Use -DskipTests (capital T, skips running) when you need a build artifact quickly but still want test code compiled — it catches test compilation errors. Use -Dmaven.test.skip=true (skips compile AND run) only when you explicitly do not want to touch tests at all. Knowing the difference saves confusion when a test won't even compile.",
    },
  ],
}
