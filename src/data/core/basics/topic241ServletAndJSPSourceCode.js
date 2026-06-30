export default {
  id: 'servlet-jsp-source-code',
  title: '241. Servlet & JSP  Source Code',
  explanation: `This topic points learners to the source code repository for the Servlet & JSP chapter of the course.

**What source code is provided:**
The instructor shares a GitHub repository (or ZIP download) containing all projects built during the Servlet & JSP chapter. This includes:
- Static web app example
- First dynamic Servlet web app
- Servlet lifecycle demo
- GET vs POST form examples
- JSP demo pages
- The full Registration App that ties together Servlet, JSP, and JDBC

**Why source code matters:**
Following along with the instructor while also having the source available lets you:
1. Recover quickly if your code diverges or has a typo
2. Compare your implementation against the reference
3. Study the complete project structure without having to type every line

**Project structure for Servlet & JSP apps:**
\`\`\`
my-webapp/
  src/main/java/
    com/example/
      HelloServlet.java
      RegistrationServlet.java
  src/main/webapp/
    WEB-INF/
      web.xml          (deployment descriptor)
    index.html
    register.jsp
    success.jsp
  pom.xml              (Maven dependencies: servlet-api, JSTL)
\`\`\`

**Dependencies for a Servlet & JSP Maven project:**
\`\`\`xml
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>javax.servlet-api</artifactId>
  <version>4.0.1</version>
  <scope>provided</scope>   <!-- Tomcat provides it at runtime -->
</dependency>
<dependency>
  <groupId>javax.servlet.jsp</groupId>
  <artifactId>javax.servlet.jsp-api</artifactId>
  <version>2.3.3</version>
  <scope>provided</scope>
</dependency>
\`\`\`

**Tip:** Always download the source code before starting a chapter. If you get stuck, the source is the fastest way to find your mistake.`,
  code: `<!-- pom.xml for a basic Servlet & JSP Maven web app -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>servlet-jsp-demo</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>   <!-- Web ARchive — deployed to Tomcat -->

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
  </properties>

  <dependencies>

    <!-- Servlet API — provided by Tomcat, not bundled in WAR -->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>4.0.1</version>
      <scope>provided</scope>
    </dependency>

    <!-- JSP API — provided by Tomcat -->
    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>javax.servlet.jsp-api</artifactId>
      <version>2.3.3</version>
      <scope>provided</scope>
    </dependency>

    <!-- JSTL — JSP Standard Tag Library -->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>

    <!-- MySQL JDBC Driver (for Registration App) -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.33</version>
    </dependency>

  </dependencies>

  <build>
    <plugins>
      <!-- Tomcat Maven plugin for easy deployment -->
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.2</version>
      </plugin>
    </plugins>
  </build>

</project>`,
  codeTitle: 'Maven pom.xml for Servlet & JSP Web App',
  points: [
    'Servlet & JSP projects are packaged as WAR (Web ARchive) files, not JAR files — set <packaging>war</packaging> in pom.xml',
    'The servlet-api and jsp-api dependencies use scope=provided because Tomcat already includes them at runtime',
    'JSTL (JSP Standard Tag Library) must be bundled in the WAR — it is not provided by Tomcat by default',
    'The standard Maven web app layout puts Java classes in src/main/java and web resources in src/main/webapp',
    'web.xml (deployment descriptor) lives in src/main/webapp/WEB-INF/ — it maps URL patterns to Servlet classes',
    'Always download and study the instructor source code at the start of a chapter to understand the full project structure',
    'For Jakarta EE 9+ (Tomcat 10+), the package namespace changes from javax.servlet to jakarta.servlet',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Tomcat 9 and earlier use the javax.servlet namespace. Tomcat 10+ uses jakarta.servlet (Jakarta EE 9+). If you import javax.servlet.* but deploy to Tomcat 10, the servlet will not be found and you will get a 404 or ClassNotFoundException. Always match the Tomcat version to the correct API namespace.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between a JAR and a WAR file?\nA: A JAR (Java ARchive) packages Java class files and resources for standalone applications or libraries. A WAR (Web ARchive) has a specific structure (WEB-INF/classes, WEB-INF/lib, web.xml) designed for deployment to a servlet container like Tomcat. The container unpacks the WAR and uses the structure to find servlets, JSPs, and static resources.",
    },
    {
      type: 'tip',
      content: "Use the Tomcat Maven plugin (tomcat7-maven-plugin or cargo-maven-plugin) to deploy and run your web app directly from Maven with mvn tomcat7:run. This avoids manually copying WAR files to Tomcat's webapps directory during development.",
    },
  ],
}
