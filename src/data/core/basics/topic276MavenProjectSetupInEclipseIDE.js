export default {
  id: 'maven-project-setup-eclipse',
  title: '276. Maven Project Setup in Eclipse IDE',
  explanation: `Eclipse has built-in Maven support through **m2e** (Maven Integration for Eclipse). It reads \`pom.xml\`, manages dependencies, and runs Maven goals from the IDE.

**Creating a Maven project in Eclipse:**
File → New → Maven Project → choose an archetype (or "Create a simple project" to skip archetypes) → set GAV → Finish.

**Importing an existing Maven project:**
File → Import → Maven → Existing Maven Projects → browse to the folder with \`pom.xml\` → Finish. Eclipse reads the pom and configures the project automatically.

**The Maven nature:**
When Eclipse recognizes a project as Maven (m2e), it adds the "Maven nature" — you'll see a small M decorator on the project. This enables dependency management and the "Maven Dependencies" classpath container.

**Maven Dependencies container:**
In the Package Explorer, expand the project → "Maven Dependencies". This shows all resolved JARs (direct and transitive) on the classpath. Eclipse builds this automatically from your pom.

**Running Maven goals:**
Right-click project → Run As → choose:
- Maven build... (custom goals — type \`clean install\`)
- Maven clean
- Maven test
- Maven install
"Run As → Maven build..." opens a dialog where you enter goals and profiles.

**Updating the project after editing pom.xml:**
After editing \`pom.xml\`, right-click project → Maven → Update Project (Alt+F5). This re-reads the pom, downloads new dependencies, and refreshes the classpath. **This is the most important Maven command in Eclipse** — forgetting it leaves your classpath stale.

**Errors after import:**
If you see red error markers right after import, often a "Maven → Update Project" resolves them. Eclipse sometimes needs a forced re-sync to download all dependencies.

**pom.xml editor:**
Eclipse provides a multi-tab pom editor: an Overview form, a Dependencies tab, and the raw XML tab. Beginners can use the forms; the raw XML tab gives full control.`,
  code: `// ===== Maven Project Setup in Eclipse — workflow reference =====

// 1. CREATE a Maven project:
//    File > New > Maven Project
//      - Check "Create a simple project" to skip archetype selection, OR
//      - Pick an archetype (maven-archetype-quickstart / -webapp)
//      GroupId:    com.example
//      ArtifactId: my-app
//      Packaging:  jar (or war)
//    Finish -> Eclipse generates the standard layout + pom.xml

// 2. IMPORT an existing Maven project:
//    File > Import > Maven > Existing Maven Projects
//      Root Directory: /path/to/project  (folder containing pom.xml)
//    Finish -> Eclipse reads pom.xml and configures the build path

// 3. INSPECT dependencies:
//    Package Explorer > my-app > "Maven Dependencies"
//      shows every resolved JAR (direct + transitive) on the classpath

// 4. ADD a dependency (edit pom.xml):
/*
   <dependency>
     <groupId>com.google.code.gson</groupId>
     <artifactId>gson</artifactId>
     <version>2.10.1</version>
   </dependency>
*/

// 5. *** CRUCIAL *** after editing pom.xml:
//    Right-click project > Maven > Update Project  (Alt+F5)
//      -> re-reads pom, downloads new deps, refreshes the classpath
//    Forgetting this leaves the IDE classpath stale -> false compile errors

// 6. RUN Maven goals:
//    Right-click project > Run As > Maven build...
//      Goals: clean install
//      Goals: clean package -DskipTests
//    (or the quick presets: Maven clean / Maven test / Maven install)

// 7. FIX import errors:
//    Red markers right after import are often stale-classpath issues.
//    Right-click project > Maven > Update Project (force update / re-download).

// 8. CONFIGURE Eclipse to use an external Maven (match command line):
//    Window > Preferences > Maven > Installations > Add...
//      point to /opt/apache-maven-3.9.6
//    Window > Preferences > Maven > User Settings -> ~/.m2/settings.xml`,
  codeTitle: 'Maven Project Setup and Management in Eclipse (m2e)',
  points: [
    'Eclipse uses m2e (Maven Integration for Eclipse) to read pom.xml and manage the project',
    'Create via File > New > Maven Project; import via File > Import > Existing Maven Projects',
    'The "Maven Dependencies" classpath container shows all resolved direct and transitive JARs',
    'After editing pom.xml, ALWAYS run Maven > Update Project (Alt+F5) to refresh the classpath — the most important m2e action',
    'Run goals via Run As > Maven build... entering goals like clean install',
    'Red error markers right after import are usually fixed by a forced Maven > Update Project',
    'Point Eclipse at an external Maven install (Preferences > Maven > Installations) so IDE builds match the command line',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The number-one Eclipse Maven frustration: you add a dependency to pom.xml, but the code still won't compile because Eclipse hasn't refreshed. You MUST run right-click > Maven > Update Project (Alt+F5) after editing the pom. Unlike some IDEs, Eclipse does not always auto-import. If dependencies look missing or errors persist, Update Project is almost always the fix.",
    },
    {
      type: 'interview',
      content: "Q: What is m2e in Eclipse?\nA: m2e (Maven Integration for Eclipse) is the plugin that gives Eclipse native Maven support. It reads the pom.xml, resolves and downloads dependencies into the Maven Dependencies classpath container, runs Maven goals from the IDE, and keeps the Eclipse build path synchronized with the pom. It adds the 'Maven nature' to projects, enabling features like Update Project, the pom editor, and dependency management.",
    },
    {
      type: 'tip',
      content: "Bind 'Maven > Update Project' to muscle memory (Alt+F5). Run it after every pom.xml change, after pulling new commits that touch the pom, and whenever you see unexplained classpath errors. It re-syncs Eclipse's view with the actual Maven configuration and resolves the vast majority of m2e issues.",
    },
  ],
}
