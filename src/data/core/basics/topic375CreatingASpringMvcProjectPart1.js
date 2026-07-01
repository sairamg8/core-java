export default {
  id: 'creating-spring-mvc-project-part1',
  title: '375. Creating a Spring MVC Project (Part 1)',
  explanation: `Unlike a Spring Boot project (started from start.spring.io as a runnable JAR), a plain Spring MVC project (see [[spring-mvc-introduction]]) is built as a **dynamic web project** packaged into a **WAR** (Web Application ARchive) and deployed onto a separately-running Tomcat.

**Steps to create the project (Eclipse/STS):**
1. **File → New → Maven Project**, or **Dynamic Web Project** if not using Maven.
2. Set the packaging type to \`war\` in \`pom.xml\` — this tells Maven to build a deployable web archive, not a plain JAR.
3. Add the required dependencies: \`spring-webmvc\` (brings in Spring MVC, which transitively pulls in \`spring-core\`, \`spring-context\`, \`spring-web\`) and the Servlet API (\`javax.servlet-api\`, scope \`provided\` since Tomcat supplies it at runtime).
4. The standard web project layout appears: \`src/main/java\` for code, \`src/main/webapp/WEB-INF\` for web-specific configuration and JSPs, with \`web.xml\` living inside \`WEB-INF\`.

**Minimal pom.xml dependencies:**
\`\`\`xml
<packaging>war</packaging>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.20</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
\`\`\`

The \`provided\` scope on the Servlet API is important: it means "this class is on the classpath at compile time, but don't bundle it in the WAR" — Tomcat already has its own servlet-api.jar, and shipping a second copy causes classpath conflicts.`,
  code: `project-root/
├── pom.xml                     (packaging: war)
├── src/main/java/              (controllers, services)
└── src/main/webapp/
    └── WEB-INF/
        ├── web.xml             (DispatcherServlet registration - Part 2)
        └── views/               (JSP files go here)`,
  codeTitle: 'Standard Spring MVC (WAR) project layout',
  points: [
    'A plain Spring MVC project is packaged as a WAR (packaging=war in pom.xml), not a runnable JAR.',
    'spring-webmvc is the core dependency; it transitively brings in spring-core, spring-context, and spring-web.',
    'The Servlet API dependency uses scope=provided because Tomcat supplies its own copy at deploy time.',
    'WEB-INF is the standard location for web.xml and JSP views - anything under it is not directly accessible by URL.',
    'This project has no embedded server; it must be deployed onto a Tomcat instance to run (next topic).',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting scope=provided on javax.servlet-api bundles a duplicate Servlet API jar inside the WAR, which can conflict with Tomcat\'s own and cause obscure ClassNotFoundException or LinkageError at deploy time.' },
    { type: 'interview', content: 'Q: Why is a Spring MVC (non-Boot) project packaged as a WAR instead of a JAR?\nA: It has no embedded server; it needs to be deployed onto an external servlet container like Tomcat, and WAR is the standard deployable format containers understand.' },
  ],
}
