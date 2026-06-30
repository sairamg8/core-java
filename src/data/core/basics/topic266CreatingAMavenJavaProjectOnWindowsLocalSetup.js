export default {
  id: 'creating-maven-project-windows-local',
  title: '266. Creating a Maven Java Project on Windows (Local Setup)',
  explanation: `You can create a new Maven project from the command line using the **archetype** mechanism — Maven's project templating system.

**The archetype:generate command:**
\`\`\`bash
mvn archetype:generate ^
  -DgroupId=com.example ^
  -DartifactId=my-app ^
  -DarchetypeArtifactId=maven-archetype-quickstart ^
  -DarchetypeVersion=1.4 ^
  -DinteractiveMode=false
\`\`\`
(\`^\` is the line-continuation character in Windows CMD; use the backtick character in PowerShell.)

**What each parameter means:**
- \`groupId\` — your organization namespace
- \`artifactId\` — the project/folder name
- \`archetypeArtifactId\` — the template; \`maven-archetype-quickstart\` creates a basic Java app
- \`interactiveMode=false\` — skip the prompts and use the values given

**Generated project structure:**
\`\`\`
my-app/
  pom.xml
  src/
    main/java/com/example/App.java
    test/java/com/example/AppTest.java
\`\`\`
Maven creates the standard directory layout, a starter \`App.java\` with a main method, a sample JUnit test, and a ready-to-use \`pom.xml\`.

**Building the generated project:**
\`\`\`bash
cd my-app
mvn package
\`\`\`
This compiles, runs the test, and produces \`target/my-app-1.0-SNAPSHOT.jar\`.

**Running it:**
\`\`\`bash
java -cp target/my-app-1.0-SNAPSHOT.jar com.example.App
\`\`\`

**Common archetypes:**
| Archetype | Creates |
|-----------|---------|
| \`maven-archetype-quickstart\` | Basic Java application (JAR) |
| \`maven-archetype-webapp\` | Web application (WAR) |
| \`maven-archetype-simple\` | Minimal project |

**Note:** Most developers create Maven projects through their IDE (IntelliJ/Eclipse) which uses the same archetype mechanism under the hood. The command line is useful for scripting and understanding what the IDE does.`,
  code: `:: ===== Create a Maven project on Windows (Command Prompt) =====

:: Generate a new Java application project from the quickstart archetype
mvn archetype:generate ^
  -DgroupId=com.example ^
  -DartifactId=my-app ^
  -DarchetypeArtifactId=maven-archetype-quickstart ^
  -DarchetypeVersion=1.4 ^
  -DinteractiveMode=false

:: Maven creates this structure:
::   my-app\\
::     pom.xml
::     src\\main\\java\\com\\example\\App.java
::     src\\test\\java\\com\\example\\AppTest.java

:: Move into the project
cd my-app

:: Build it — compile, test, and package into a JAR
mvn package

:: The artifact is created at:
::   target\\my-app-1.0-SNAPSHOT.jar

:: Run the generated main class
java -cp target\\my-app-1.0-SNAPSHOT.jar com.example.App
:: Output: Hello World!


:: ===== The generated App.java =====
:: package com.example;
:: public class App {
::     public static void main(String[] args) {
::         System.out.println("Hello World!");
::     }
:: }

:: ===== The generated pom.xml (simplified) =====
:: <project>
::   <modelVersion>4.0.0</modelVersion>
::   <groupId>com.example</groupId>
::   <artifactId>my-app</artifactId>
::   <version>1.0-SNAPSHOT</version>
::   <packaging>jar</packaging>
::   <dependencies>
::     <dependency>
::       <groupId>junit</groupId>
::       <artifactId>junit</artifactId>
::       <version>4.13.2</version>
::       <scope>test</scope>
::     </dependency>
::   </dependencies>
:: </project>

:: ===== Web app variant (produces a WAR) =====
:: mvn archetype:generate -DgroupId=com.example -DartifactId=my-webapp ^
::   -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false`,
  codeTitle: 'Creating a Maven Project with archetype:generate (Windows)',
  points: [
    'mvn archetype:generate creates a new project from a template (archetype) with the standard Maven layout',
    'maven-archetype-quickstart generates a basic Java application with a JAR packaging, a main class, and a sample test',
    'Key parameters: groupId (namespace), artifactId (project name), archetypeArtifactId (the template to use)',
    'interactiveMode=false uses the supplied parameters directly instead of prompting interactively',
    'The generated project includes a ready-to-build pom.xml with JUnit already configured as a test dependency',
    'maven-archetype-webapp generates a WAR project for web applications instead of a JAR',
    'IDEs use the same archetype mechanism internally when you create a new Maven project through their wizards',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The very first time you run archetype:generate, Maven downloads the archetype catalog and many plugins — it can take a while and requires an internet connection. If it appears to hang, it is downloading. Subsequent runs are fast because everything is cached in the local repository (~/.m2). A corporate proxy or offline machine will cause this step to fail.",
    },
    {
      type: 'interview',
      content: "Q: What is a Maven archetype?\nA: An archetype is a project template. The mvn archetype:generate command uses an archetype to scaffold a new project with a predefined structure, sample files, and a starter pom.xml. maven-archetype-quickstart creates a basic Java app, maven-archetype-webapp creates a web app. Archetypes save time and ensure new projects follow a consistent, conventional layout.",
    },
    {
      type: 'tip',
      content: "In Windows CMD, use the caret ^ to continue a long command across lines; in PowerShell use the backtick, and in Git Bash/Linux use the backslash \\. If you paste a multi-line command with the wrong continuation character, the shell treats each line as a separate command and the archetype generation fails with missing-parameter errors.",
    },
  ],
}
