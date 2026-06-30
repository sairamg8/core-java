export default {
  id: 'maven-build-lifecycle',
  title: '277. Maven Build Lifecycle (Clean, Compile, Test, Package, Install, Deploy)',
  explanation: `Maven's build is organized into **lifecycles**, each made of ordered **phases**. Running a phase executes every phase before it in sequence.

**The three lifecycles:**
1. **clean** — removes previous build output
2. **default** (or "build") — the main build sequence
3. **site** — generates project documentation

**The default lifecycle phases (key ones, in order):**
\`\`\`
validate    — check the project is correct and all info is available
compile     — compile src/main/java into target/classes
test        — run unit tests with the test framework
package     — bundle compiled code into a JAR/WAR
verify      — run checks on integration test results
install     — copy the artifact into the local repo (~/.m2)
deploy      — upload the artifact to a remote repository
\`\`\`

**The clean lifecycle:**
\`\`\`
pre-clean → clean → post-clean
\`\`\`
\`mvn clean\` deletes the \`target/\` directory.

**Cumulative execution — the key rule:**
Running any phase runs ALL preceding phases in that lifecycle. So:
- \`mvn compile\` → validate, compile
- \`mvn test\` → validate, compile, test
- \`mvn package\` → validate, compile, test, package
- \`mvn install\` → ...up to install
- \`mvn deploy\` → the entire default lifecycle

**Combining lifecycles:**
\`mvn clean package\` runs the clean lifecycle (deletes target/) THEN the default lifecycle up to package. This is the most common everyday command.

**What each milestone phase produces:**
| Phase | Result |
|-------|--------|
| \`compile\` | \`target/classes/*.class\` |
| \`test\` | test reports in \`target/surefire-reports/\` |
| \`package\` | \`target/app.jar\` or \`app.war\` |
| \`install\` | artifact copied to \`~/.m2/repository\` (usable by other local projects) |
| \`deploy\` | artifact uploaded to a shared/remote repository (for the team) |

**install vs deploy:**
- \`install\` makes your artifact available to OTHER projects on YOUR machine
- \`deploy\` publishes it to a remote repository so OTHER developers and CI can use it`,
  code: `# ===== The Maven Build Lifecycle — phases in order =====

# --- clean lifecycle: remove previous output ---
mvn clean
# Deletes the target/ directory entirely.

# --- default lifecycle phases (each runs all prior phases) ---

mvn validate     # validate project structure & config
mvn compile      # validate -> compile  (target/classes/*.class)
mvn test         # ... -> compile -> test  (runs unit tests)
mvn package      # ... -> test -> package  (target/app.jar)
mvn verify       # ... -> package -> verify (integration checks)
mvn install      # ... -> verify -> install (copy to ~/.m2/repository)
mvn deploy       # ... -> install -> deploy (upload to remote repo)

# --- Everyday combined command ---
mvn clean install
# 1) clean lifecycle: delete target/
# 2) default lifecycle through install:
#    validate, compile, test, package, verify, install
# Result: a fresh build whose artifact is in ~/.m2 for other local projects.

# --- Another common one ---
mvn clean package -DskipTests
# Fresh build to a JAR/WAR, skipping test execution.


# ===== install vs deploy =====

mvn install
# Copies target/my-app-1.0.0.jar to:
#   ~/.m2/repository/com/example/my-app/1.0.0/my-app-1.0.0.jar
# Now OTHER projects ON THIS MACHINE can depend on com.example:my-app:1.0.0

mvn deploy
# Uploads the artifact to a configured remote repository (<distributionManagement>)
# so the whole TEAM and CI servers can depend on it.
# Requires repository URL + credentials configured.


# ===== Visualize: what 'mvn install' actually runs =====
#   validate -> initialize -> generate-sources -> process-sources
#   -> generate-resources -> process-resources -> compile
#   -> process-test-sources -> test-compile -> test
#   -> prepare-package -> package -> verify -> install
# (intermediate phases shown; you usually think in the milestone phases)`,
  codeTitle: 'Maven Lifecycles and Phases — clean through deploy',
  points: [
    'Maven has three lifecycles: clean (remove output), default (build), and site (documentation)',
    'The default lifecycle phases run in order: validate, compile, test, package, verify, install, deploy',
    'Running any phase executes every preceding phase in that lifecycle — phases are cumulative',
    'mvn clean package combines two lifecycles: clean (delete target/) then default up to package',
    'compile produces target/classes; package produces the JAR/WAR; install copies it to ~/.m2',
    'install makes your artifact available to other projects on your machine; deploy publishes it to a remote repository for the team',
    'mvn clean install is the most common full-build command; it guarantees a fresh build available locally',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "mvn install does NOT deploy to a server despite the name sounding like deployment. It installs to your LOCAL repository (~/.m2) only. To publish to a shared/remote repository for your team, you need mvn deploy, which additionally requires <distributionManagement> configuration with the repository URL and credentials. Confusing install with deploy is a very common beginner mistake.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between mvn install and mvn deploy?\nA: mvn install runs the full build and copies the resulting artifact into your LOCAL repository (~/.m2/repository), making it available to other projects built on the same machine. mvn deploy does everything install does and then uploads the artifact to a configured REMOTE repository (like Nexus or Artifactory), making it available to the whole team and CI systems. deploy requires distributionManagement configuration and credentials.",
    },
    {
      type: 'tip',
      content: "Use mvn clean install for a reliable full local build during development — clean guarantees no stale output from a previous build, and install makes the artifact usable by dependent local modules. Reserve mvn deploy for release pipelines (usually run by CI), since it publishes to shared infrastructure that the whole team consumes.",
    },
  ],
}
