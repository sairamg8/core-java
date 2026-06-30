export default {
  id: 'effective-pom-xml-file',
  title: '275. Effective pom.xml File',
  explanation: `The **effective POM** is the complete, fully-resolved POM that Maven actually uses to build your project. Your visible \`pom.xml\` is only part of the story.

**Why your pom.xml is incomplete:**
Your \`pom.xml\` typically declares only what is specific to your project. Maven combines it with:
1. The **Super POM** — Maven's built-in base POM that every project inherits (defines Central repo, default directory layout, default plugin versions)
2. Any **parent POM** you declared (e.g. spring-boot-starter-parent)
3. **Active profiles** — settings activated by environment/flags
4. **Property interpolation** — all properties resolved to actual values

The merge of all of these is the **effective POM**.

**Viewing the effective POM:**
\`\`\`bash
mvn help:effective-pom
\`\`\`
This prints the full resolved POM to the console. To save it to a file:
\`\`\`bash
mvn help:effective-pom -Doutput=effective-pom.xml
\`\`\`

**What you'll see that wasn't in your pom.xml:**
- The Central repository definition (inherited from Super POM)
- Default source/output directories (\`src/main/java\`, \`target/classes\`)
- Default bindings of plugins to lifecycle phases
- Plugin versions that you never specified
- All properties resolved to concrete values

**Why this matters:**
When a build behaves unexpectedly — a plugin runs you didn't configure, a dependency version differs from what you wrote, a property resolves oddly — the effective POM shows the TRUTH of what Maven is using after all inheritance and interpolation.

**The Super POM:**
Every \`pom.xml\` implicitly inherits from the Super POM, even with no \`<parent>\` declared. It is why a minimal pom.xml (just GAV) can still build — the Super POM supplies all the defaults: the Central repository, the standard directory layout, and base plugin configuration.

**Effective POM vs your POM:**
- Your POM = what you wrote (the diff from defaults)
- Effective POM = your POM + Super POM + parent + profiles, fully resolved`,
  code: `# ===== Inspecting the Effective POM =====

# Print the fully-resolved effective POM to the console
mvn help:effective-pom

# Save it to a file for inspection
mvn help:effective-pom -Doutput=effective-pom.xml


# ===== What your pom.xml might look like (minimal) =====
# <project>
#   <modelVersion>4.0.0</modelVersion>
#   <groupId>com.example</groupId>
#   <artifactId>my-app</artifactId>
#   <version>1.0.0</version>
# </project>


# ===== What the EFFECTIVE POM reveals (excerpt of the merged result) =====
# <project>
#   <modelVersion>4.0.0</modelVersion>
#   <groupId>com.example</groupId>
#   <artifactId>my-app</artifactId>
#   <version>1.0.0</version>
#
#   <!-- INHERITED FROM SUPER POM: the Central repository -->
#   <repositories>
#     <repository>
#       <id>central</id>
#       <url>https://repo.maven.apache.org/maven2</url>
#     </repository>
#   </repositories>
#
#   <!-- INHERITED: default build directories you never wrote -->
#   <build>
#     <sourceDirectory>/project/src/main/java</sourceDirectory>
#     <testSourceDirectory>/project/src/test/java</testSourceDirectory>
#     <outputDirectory>/project/target/classes</outputDirectory>
#     <directory>/project/target</directory>
#     <finalName>my-app-1.0.0</finalName>
#
#     <!-- INHERITED: default plugin versions and lifecycle bindings -->
#     <plugins>
#       <plugin>
#         <artifactId>maven-compiler-plugin</artifactId>
#         <version>3.x</version>      <!-- you never specified this -->
#       </plugin>
#       <plugin>
#         <artifactId>maven-surefire-plugin</artifactId>
#         <version>3.x</version>
#       </plugin>
#     </plugins>
#   </build>
# </project>


# ===== When to use it =====
# - A plugin runs that you never configured  -> find it here
# - A dependency resolves to an unexpected version -> see the resolved value
# - A property does not interpolate as expected -> effective POM shows the result
mvn help:effective-pom | grep -A2 maven-compiler-plugin   # focus on one part`,
  codeTitle: 'mvn help:effective-pom — The Fully Resolved POM',
  points: [
    'The effective POM is the complete POM Maven actually uses, merging your pom.xml with the Super POM, parents, and profiles',
    'Every pom.xml implicitly inherits the Super POM, which defines the Central repository, directory layout, and default plugins',
    'View it with mvn help:effective-pom, or save it with -Doutput=effective-pom.xml',
    'The effective POM reveals plugin versions, repositories, and directories you never wrote but Maven uses',
    'All property references are resolved to concrete values in the effective POM',
    'Use it to debug unexpected build behavior — it shows the truth after all inheritance and interpolation',
    'Your pom.xml is the diff from the defaults; the effective POM is the full picture',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "When a build mysteriously uses a plugin version or dependency version you never declared, do not assume your pom.xml is wrong — the value is likely inherited from a parent POM (like spring-boot-starter-parent) or the Super POM. mvn help:effective-pom shows the actual resolved value. Without checking it, you can waste hours looking for configuration that lives in an inherited POM.",
    },
    {
      type: 'interview',
      content: "Q: What is the effective POM and how is it different from your pom.xml?\nA: Your pom.xml contains only the project-specific configuration. The effective POM is the complete, merged result of your pom.xml combined with the built-in Super POM, any declared parent POMs, and active profiles, with all properties resolved. It includes inherited defaults like the Central repository, standard directory layout, and default plugin versions. View it with mvn help:effective-pom. It is the definitive picture of what Maven actually uses to build.",
    },
    {
      type: 'tip',
      content: "When onboarding to an unfamiliar project or debugging a build, run mvn help:effective-pom early. It instantly reveals all the inherited configuration — repositories, plugin versions, and resolved properties — that the visible pom.xml hides. Piping it through grep lets you zero in on a specific plugin or dependency quickly.",
    },
  ],
}
