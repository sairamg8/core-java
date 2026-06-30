export default {
  id: 'maven-web-app-war-project',
  title: '270. Maven Java Web App Setup (WAR Project)',
  explanation: `A web application is packaged as a **WAR** (Web ARchive) rather than a JAR. Maven creates and builds WAR projects using \`<packaging>war</packaging>\` and the \`maven-archetype-webapp\` archetype.

**Generating a WAR project:**
\`\`\`bash
mvn archetype:generate \\
  -DgroupId=com.example \\
  -DartifactId=my-webapp \\
  -DarchetypeArtifactId=maven-archetype-webapp \\
  -DinteractiveMode=false
\`\`\`

**WAR project structure:**
\`\`\`
my-webapp/
  pom.xml                          (<packaging>war</packaging>)
  src/main/
    java/com/example/              (Servlets, controllers)
    resources/                     (config files)
    webapp/
      WEB-INF/
        web.xml                    (deployment descriptor)
      index.jsp
\`\`\`
The \`src/main/webapp\` folder holds web resources (JSP, HTML, CSS) and \`WEB-INF/web.xml\`.

**The packaging element:**
\`\`\`xml
<packaging>war</packaging>
\`\`\`
This tells Maven to use the \`maven-war-plugin\` during the package phase to build a \`.war\` file instead of a \`.jar\`.

**Servlet API dependency (provided scope):**
\`\`\`xml
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.0.0</version>
  <scope>provided</scope>
</dependency>
\`\`\`
Scope \`provided\` means Tomcat supplies the Servlet API at runtime, so it is NOT bundled in the WAR.

**Building the WAR:**
\`\`\`bash
mvn clean package
# Produces target/my-webapp.war
\`\`\`

**Deploying the WAR:**
- Copy \`target/my-webapp.war\` to Tomcat's \`webapps/\` folder, or
- Use the Tomcat Maven plugin: \`mvn tomcat7:run\`, or
- Configure the WAR in your IDE's server runtime

**finalName — controlling the WAR file name:**
\`\`\`xml
<build>
  <finalName>my-webapp</finalName>
</build>
\`\`\`
Without this, the WAR is named \`artifactId-version.war\` (e.g. \`my-webapp-1.0-SNAPSHOT.war\`), which becomes the URL context path.`,
  code: `<!-- ===== pom.xml for a Maven WAR (web app) project ===== -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>my-webapp</artifactId>
  <version>1.0.0</version>

  <!-- KEY: war packaging tells Maven to build a .war using maven-war-plugin -->
  <packaging>war</packaging>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>

    <!-- Servlet API — provided by Tomcat at runtime, not bundled in the WAR -->
    <dependency>
      <groupId>jakarta.servlet</groupId>
      <artifactId>jakarta.servlet-api</artifactId>
      <version>6.0.0</version>
      <scope>provided</scope>
    </dependency>

    <!-- JSP API — also provided by the container -->
    <dependency>
      <groupId>jakarta.servlet.jsp</groupId>
      <artifactId>jakarta.servlet.jsp-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>

    <!-- JSTL — bundled in the WAR (container does not provide it) -->
    <dependency>
      <groupId>org.glassfish.web</groupId>
      <artifactId>jakarta.servlet.jsp.jstl</artifactId>
      <version>3.0.1</version>
    </dependency>

  </dependencies>

  <build>
    <!-- finalName controls the .war file name (and thus the context path) -->
    <finalName>my-webapp</finalName>

    <plugins>
      <!-- The WAR plugin (implicit for war packaging; shown for clarity) -->
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-war-plugin</artifactId>
        <version>3.4.0</version>
      </plugin>
    </plugins>
  </build>

</project>

<!-- Build it:  mvn clean package  ->  target/my-webapp.war
     Deploy:    copy to Tomcat webapps/, access http://localhost:8080/my-webapp/ -->`,
  codeTitle: 'pom.xml for a WAR Web App Project',
  points: [
    'Web applications are packaged as WAR (Web ARchive) files using <packaging>war</packaging> in the pom.xml',
    'maven-archetype-webapp scaffolds a WAR project with the src/main/webapp folder and WEB-INF/web.xml',
    'The Servlet and JSP API dependencies use scope=provided because Tomcat supplies them at runtime',
    'JSTL is bundled in the WAR (no provided scope) because the container does not include it by default',
    'src/main/webapp holds web resources (JSP, HTML, CSS); WEB-INF holds web.xml and protected resources',
    'mvn clean package builds target/<finalName>.war; <finalName> controls the WAR name and URL context path',
    'Deploy by copying the WAR to Tomcat webapps/, using a Tomcat Maven plugin, or configuring it in your IDE',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you forget <packaging>war</packaging>, Maven defaults to jar packaging and builds a JAR with no web resources — your JSPs and web.xml are silently left out, and the app will not deploy to Tomcat. The packaging element is what activates the maven-war-plugin. Always set it explicitly for web projects.",
    },
    {
      type: 'interview',
      content: "Q: Why is the Servlet API dependency declared with provided scope in a WAR project?\nA: Because the servlet container (Tomcat) already includes the Servlet API on its classpath at runtime. Scope provided means the dependency is available at compile time but is NOT packaged into the WAR. If you bundled the servlet API in the WAR, you would have two copies (yours and Tomcat's) causing ClassCastException or LinkageError conflicts. Provided scope avoids this.",
    },
    {
      type: 'tip',
      content: "Set <finalName>my-webapp</finalName> to get a clean WAR name. Without it, the WAR is named like my-webapp-1.0-SNAPSHOT.war, and Tomcat uses that whole string as the URL context path (http://localhost:8080/my-webapp-1.0-SNAPSHOT/). A fixed finalName gives you stable, clean URLs across versions.",
    },
  ],
}
