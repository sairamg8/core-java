export default {
  id: 'maven-spring-boot-demo',
  title: '279. Maven with Spring Boot Application (Demo)',
  explanation: `Spring Boot uses Maven heavily, and seeing how they work together previews everything to come in the Spring chapters. Spring Boot makes Maven setup dramatically simpler through **starters** and a **parent POM**.

**The Spring Boot parent POM:**
\`\`\`xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.2.0</version>
</parent>
\`\`\`
Inheriting this gives you: curated dependency versions (no version numbers needed on Spring deps), Java version defaults, UTF-8 encoding, and the Spring Boot plugin pre-configured.

**Starters — curated dependency bundles:**
A "starter" is one dependency that pulls in everything for a feature:
\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`
\`spring-boot-starter-web\` transitively brings Spring MVC, an embedded Tomcat, Jackson (JSON), and validation — all version-aligned. No version tag needed because the parent manages it.

**The Spring Boot Maven plugin:**
\`\`\`xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
\`\`\`
This plugin enables:
- \`mvn spring-boot:run\` — run the app directly
- An **executable fat JAR** — \`mvn package\` produces a single JAR containing your code AND all dependencies AND an embedded server

**The executable fat JAR:**
\`\`\`bash
mvn package
java -jar target/demo-0.0.1-SNAPSHOT.jar
\`\`\`
Unlike a normal JAR, this self-contained artifact includes everything — you run it with plain \`java -jar\`, no external Tomcat needed.

**spring-boot:run vs java -jar:**
- \`mvn spring-boot:run\` — development; rebuilds and runs from source
- \`java -jar target/...jar\` — production; runs the packaged artifact

**Spring Initializr:**
\`start.spring.io\` generates a ready-made Spring Boot Maven project — pick your dependencies and download a zip with a complete pom.xml. This is the standard way to start a Spring Boot project.`,
  code: `<!-- ===== pom.xml for a Spring Boot app (note: NO version tags on Spring deps) ===== -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
             http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <!-- Inherit Spring Boot's parent: manages versions, encoding, plugins -->
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
    <relativePath/>
  </parent>

  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <java.version>17</java.version>
  </properties>

  <dependencies>
    <!-- Web starter: Spring MVC + embedded Tomcat + Jackson, versions managed by parent -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Test starter: JUnit 5, Mockito, Spring Test -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Enables spring-boot:run and builds the executable fat JAR -->
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>

</project>

<!-- ===== The application class =====
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Hello from Spring Boot + Maven!";
    }
}
-->

<!-- ===== Build and run =====
  mvn spring-boot:run                         # dev: run from source
  mvn package                                 # build the executable fat JAR
  java -jar target/demo-0.0.1-SNAPSHOT.jar    # prod: run the artifact
  # then visit http://localhost:8080/
-->`,
  codeTitle: 'Spring Boot Maven Project — Parent, Starters, Plugin',
  points: [
    'Spring Boot apps inherit spring-boot-starter-parent, which manages dependency versions, encoding, and plugin config',
    'Because the parent manages versions, you omit <version> on Spring Boot starter dependencies',
    'A starter (e.g. spring-boot-starter-web) is one dependency that transitively pulls a whole feature set, all version-aligned',
    'spring-boot-starter-web brings Spring MVC, an embedded Tomcat, and Jackson — no separate server install needed',
    'The spring-boot-maven-plugin enables mvn spring-boot:run and builds an executable fat JAR',
    'mvn package produces a self-contained JAR you run with java -jar — it includes all dependencies and an embedded server',
    'Spring Initializr (start.spring.io) generates a complete starter project with a ready-made pom.xml',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Do NOT add <version> tags to Spring Boot starter dependencies when using spring-boot-starter-parent. The parent's dependency management already pins compatible, tested versions for the entire Spring ecosystem. Adding your own version can pull in a mismatched library and cause subtle runtime failures. Let the parent manage versions — that is its entire purpose.",
    },
    {
      type: 'interview',
      content: "Q: What does spring-boot-maven-plugin do and what is a fat JAR?\nA: The spring-boot-maven-plugin repackages the build output into an executable 'fat JAR' (also called an uber JAR) that contains your compiled code, all dependency JARs, and an embedded web server. You run it with a plain java -jar command — no external application server needed. The plugin also provides the spring-boot:run goal for running the app directly from source during development.",
    },
    {
      type: 'tip',
      content: "Start every Spring Boot project from start.spring.io (Spring Initializr). Select your Java version, build tool (Maven), and the starters you need; it generates a correct pom.xml with the right parent, plugin, and dependencies. This avoids hand-writing the Spring Boot Maven boilerplate and guarantees a working baseline you can build immediately.",
    },
  ],
}
