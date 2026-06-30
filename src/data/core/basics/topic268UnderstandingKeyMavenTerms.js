export default {
  id: 'understanding-key-maven-terms',
  title: '268. Understanding Key Maven Terms',
  explanation: `Maven has its own vocabulary. Knowing these terms makes every Maven command and error message understandable.

**Artifact:**
Any file produced or consumed by Maven — usually a JAR or WAR. Your project produces an artifact; your dependencies are artifacts you consume.

**GAV (groupId, artifactId, version):**
The unique coordinate of every artifact. \`org.springframework:spring-core:6.1.0\`.

**Repository:**
A storage location for artifacts. Three kinds: local (\`~/.m2\`), central (Maven's public server), and remote (private/company servers).

**Dependency:**
A library your project needs. Declared by its GAV in \`pom.xml\`. Maven downloads it and its transitive dependencies.

**Transitive dependency:**
A dependency of your dependency. If you depend on A, and A depends on B, then B is a transitive dependency that Maven downloads automatically.

**Scope:**
Controls when a dependency is available (compile, test, provided, runtime, etc.) — covered in the dependencies topic.

**Plugin:**
An extension that performs build work. The compiler plugin compiles code; the surefire plugin runs tests. Maven itself is mostly a plugin-execution framework.

**Goal:**
A specific task a plugin can perform. \`compiler:compile\` is a goal of the compiler plugin. You can run a goal directly: \`mvn compiler:compile\`.

**Phase:**
A stage in the build lifecycle (compile, test, package, install, deploy). Running a phase runs all phases before it. Goals are bound to phases.

**Lifecycle:**
An ordered sequence of phases. Maven has three: \`clean\`, \`default\` (build), and \`site\`.

**Archetype:**
A project template used to scaffold new projects.

**SNAPSHOT:**
A version suffix (\`1.0-SNAPSHOT\`) meaning "in development, not final." Maven treats SNAPSHOT versions as mutable and re-checks for updates.

**Effective POM:**
The final, fully-resolved POM after merging your \`pom.xml\` with inherited parent POMs and Maven's built-in super POM.`,
  code: `# ===== Key Maven terms in action =====

# --- GOAL: a single plugin task. Format is plugin:goal ---
mvn compiler:compile          # run the compiler plugin's compile goal directly
mvn surefire:test             # run the surefire plugin's test goal
mvn dependency:tree           # show the full dependency tree (incl. transitive)

# --- PHASE: a lifecycle stage. Running one runs all prior phases ---
mvn compile                   # runs: validate -> ... -> compile
mvn test                      # runs everything up to and including test
mvn package                   # runs everything up to and including package

# --- LIFECYCLE: ordered phases. Maven has three lifecycles ---
mvn clean                     # 'clean' lifecycle: deletes target/
mvn clean package             # run clean lifecycle THEN default up to package

# --- DEPENDENCY + TRANSITIVE: inspect what gets pulled in ---
mvn dependency:tree
# Example output showing transitive dependencies:
#   com.example:my-app:jar:1.0
#   +- org.springframework:spring-context:jar:6.1.0:compile
#   |  +- org.springframework:spring-core:jar:6.1.0:compile   <- transitive
#   |  +- org.springframework:spring-beans:jar:6.1.0:compile  <- transitive

# --- ARTIFACT + GAV: your build output, addressed by coordinates ---
# Produces the artifact target/my-app-1.0-SNAPSHOT.jar
# whose GAV is com.example:my-app:1.0-SNAPSHOT
mvn package

# --- EFFECTIVE POM: the fully merged, resolved POM ---
mvn help:effective-pom        # prints your pom merged with parent + super POM

# --- SNAPSHOT vs release ---
# 1.0-SNAPSHOT  -> in development, Maven re-checks remote for newer builds
# 1.0           -> released, immutable, cached permanently once downloaded`,
  codeTitle: 'Maven Vocabulary — Goals, Phases, Lifecycles, Dependencies',
  points: [
    'Artifact: a file Maven produces or consumes (usually a JAR/WAR), uniquely identified by its GAV coordinates',
    'Plugin: an extension that does build work (compiler, surefire); Goal: a specific task within a plugin (compiler:compile)',
    'Phase: a stage in the build lifecycle — running a phase runs all phases before it in order',
    'Lifecycle: an ordered sequence of phases; Maven has three — clean, default (build), and site',
    'Transitive dependency: a dependency of your dependency, downloaded automatically by Maven',
    'SNAPSHOT version means in-development and mutable; Maven re-checks remote repos for newer SNAPSHOT builds',
    'Effective POM: the final merged POM combining your pom.xml with parent POMs and Maven\'s super POM — view with help:effective-pom',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Goals and phases are different things people often confuse. A phase (like package) is a lifecycle stage. A goal (like compiler:compile) is a single plugin task. Phases run sequences of goals bound to them. You can run mvn package (a phase) or mvn compiler:compile (a goal directly) — but mvn compile is a phase while mvn compiler:compile is a goal, even though they sound similar.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between a Maven goal and a phase?\nA: A phase is a step in the build lifecycle (validate, compile, test, package, install, deploy). A goal is a specific task provided by a plugin (e.g. compiler:compile, surefire:test). Goals are bound to phases — when you run a phase, Maven executes all goals bound to that phase and every preceding phase. You can also invoke a goal directly with plugin:goal syntax.",
    },
    {
      type: 'tip',
      content: "mvn dependency:tree is one of the most useful diagnostic commands. When you get a version conflict or an unexpected class on the classpath, the dependency tree shows exactly which dependency pulled it in transitively. Combine it with mvn help:effective-pom to fully understand what Maven actually resolves for your build.",
    },
  ],
}
