export default {
  id: 'creating-a-spring-boot-web-app-project',
  title: '361. Creating a Spring Boot Web App Project',
  explanation: `Spring Boot makes web development dramatically simpler than raw servlets: it ships with an **embedded Tomcat**, auto-configures Spring MVC, and lets you run the app with a plain \`main\` method — no external server to install or WAR to deploy.

**Generating the project** — use **Spring Initializr** (start.spring.io) or your IDE:
- Choose **Maven**, a Java version, and Spring Boot version.
- Add the **Spring Web** starter (\`spring-boot-starter-web\`) — this pulls in Spring MVC, Jackson, and embedded Tomcat.
- Add **Spring Boot DevTools** for automatic restarts during development (optional but handy).

**The key dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`

**The entry point** — a class annotated with \`@SpringBootApplication\` and a \`main\` that boots the context and starts Tomcat:
\`\`\`java
@SpringBootApplication
public class WebAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebAppApplication.class, args);
    }
}
\`\`\`

**Run it** and Tomcat starts on **8080** automatically. Add a \`@Controller\` (see [[creating-a-controller]]) and you have a working web app. Compared to the servlet setup, there is **no \`web.xml\`, no manual Tomcat install, and no WAR copy** — just run the class.`,
  code: `@SpringBootApplication
public class WebAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebAppApplication.class, args);
    }
}

// pom.xml — the one starter that enables web MVC + embedded Tomcat
// <dependency>
//   <groupId>org.springframework.boot</groupId>
//   <artifactId>spring-boot-starter-web</artifactId>
// </dependency>`,
  codeTitle: 'Spring Boot web app entry point',
  points: [
    'Generate the project with Spring Initializr and add the Spring Web starter.',
    'spring-boot-starter-web pulls in Spring MVC, Jackson, and an embedded Tomcat.',
    '@SpringBootApplication + a main calling SpringApplication.run boots the app.',
    'Run the main method and Tomcat starts on port 8080 — no external server or WAR.',
    'DevTools gives automatic restarts on code changes during development.',
  ],
  callouts: [
    { type: 'tip', content: 'Change the port with server.port=8081 in application.properties, and set a base path with server.servlet.context-path=/app if you want URLs under /app.' },
    { type: 'interview', content: 'Q: What does spring-boot-starter-web give you?\nA: Spring MVC, an embedded servlet container (Tomcat by default), JSON support via Jackson, and sensible auto-configuration — everything needed to build a web app or REST API out of the box.' },
  ],
}
