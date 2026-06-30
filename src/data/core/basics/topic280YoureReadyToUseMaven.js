export default {
  id: 'youre-ready-to-use-maven',
  title: '280. You’re Ready to Use Maven',
  explanation: `This wraps up the Maven chapter. You now have everything needed to manage real Java projects with Maven — from creating a project to building, testing, and publishing artifacts.

**What you have learned:**

**Concepts:**
- Why build tools exist (automation + dependency management)
- What Maven is and convention over configuration
- GAV coordinates and the artifact model
- The pom.xml and effective POM
- Repositories (local, central, remote)

**Practical skills:**
- Installing Maven on Windows and Linux/EC2
- Creating projects (quickstart JAR, webapp WAR)
- Declaring dependencies and choosing scopes
- Running the build lifecycle (clean, compile, test, package, install, deploy)
- Running unit tests through Surefire
- Using Maven in IntelliJ and Eclipse
- Building Spring Boot apps with starters and the fat JAR

**The commands you will use daily:**
\`\`\`bash
mvn clean package        # fresh build to a JAR/WAR
mvn clean install        # build + install to local repo
mvn test                 # run the tests
mvn dependency:tree      # inspect dependencies
mvn spring-boot:run      # run a Spring Boot app
\`\`\`

**A mental checklist for any Maven project:**
1. Does \`pom.xml\` have correct GAV and packaging?
2. Are all dependencies declared with the right scopes?
3. Does \`mvn clean package\` produce BUILD SUCCESS?
4. Are tests passing (not skipped)?
5. Is the artifact in \`target/\`?

**Where Maven goes next in your journey:**
Every framework ahead — Spring, Spring Boot, Hibernate, Spring Security — is added to projects as Maven dependencies. The Spring chapters assume you can read a pom.xml, add a starter, and run a build. You now can.

**Best practices to carry forward:**
- Centralize versions in \`<properties>\` or a parent POM
- Use the narrowest dependency scope that works
- Keep tests running in the build (do not habitually skip)
- Run \`mvn clean\` before important builds to avoid stale output
- Prefer Spring Initializr for new Spring Boot projects

You are ready to use Maven in real projects.`,
  code: `# ===== Maven Mastery — the commands you now know =====

# --- Project creation ---
mvn archetype:generate -DgroupId=com.example -DartifactId=my-app \\
    -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

# --- The everyday build cycle ---
mvn clean              # delete target/
mvn compile            # compile main code
mvn test               # compile + run tests
mvn package            # compile + test + build JAR/WAR
mvn install            # + copy artifact to ~/.m2 (local repo)
mvn deploy             # + upload to remote repository

# --- The two commands you will type most ---
mvn clean package      # fresh build artifact
mvn clean install      # fresh build + available to other local projects

# --- Diagnostics ---
mvn dependency:tree    # full dependency tree (incl. transitive)
mvn help:effective-pom # the fully-resolved POM
mvn -X clean package   # verbose/debug output for troubleshooting
mvn -o package         # offline (local repo only)
mvn -U package         # force-update snapshots from remote

# --- Test control ---
mvn test -Dtest=MyTest             # run a single test class
mvn package -DskipTests            # build, skip running tests
mvn package -Dmaven.test.skip=true # build, skip compiling+running tests

# --- Spring Boot ---
mvn spring-boot:run                          # run from source (dev)
mvn package && java -jar target/app.jar      # build fat JAR + run (prod)


# ===== Pre-flight checklist for any Maven project =====
# 1. pom.xml has correct GAV + packaging
# 2. dependencies declared with correct scopes
# 3. mvn clean package -> BUILD SUCCESS
# 4. tests PASS (Tests run: N, Failures: 0, Errors: 0)
# 5. artifact present in target/
#
# If all five are true, your project is ready to ship or share.`,
  codeTitle: 'Maven Command Reference — Everything You Now Know',
  points: [
    'You can install Maven, create JAR and WAR projects, and configure pom.xml with the correct GAV and packaging',
    'mvn clean package and mvn clean install are the two commands you will run most often',
    'You understand dependency scopes, transitive dependencies, and how to resolve version conflicts',
    'You know the full build lifecycle and what each phase (compile, test, package, install, deploy) produces',
    'You can run and read unit tests through Surefire and know failing tests should fail the build',
    'You can use Maven in both IntelliJ and Eclipse and keep IDE builds consistent with the command line',
    'Every framework ahead (Spring, Hibernate, Security) is added as Maven dependencies — you are ready for them',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "A passing build is not the same as a correct build if you have been skipping tests. If your habitual command is mvn package -DskipTests, BUILD SUCCESS only means the code compiled and packaged — it says nothing about correctness. Before relying on an artifact, run a full mvn clean install with tests enabled at least once and confirm Failures: 0, Errors: 0.",
    },
    {
      type: 'interview',
      content: "Q: Walk me through the Maven commands you'd use in a typical day of development.\nA: I start with mvn clean install to get a fresh, fully-tested build available locally. During iteration I use mvn test to run tests quickly, and mvn dependency:tree when diagnosing a dependency conflict. For a Spring Boot app I use mvn spring-boot:run to run from source. Before committing or deploying, I run mvn clean package to confirm a clean build with all tests passing, then java -jar on the resulting artifact to smoke-test it.",
    },
    {
      type: 'tip',
      content: "Make mvn clean install your standard 'is everything OK?' command. The clean removes stale output that can mask problems, install validates the full lifecycle including tests, and the locally-installed artifact lets dependent modules build against your latest changes. If this command is green, your project is in a healthy, shareable state.",
    },
  ],
}
