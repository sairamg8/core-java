export default {
  id: 'creating-a-spring-ai-project',
  title: '533. Creating A Spring AI Project',
  explanation: `With the BOM understood (see [[stable-version-update]]), this topic actually sets up a real Spring Boot project with Spring AI wired in — the concrete starting point every remaining topic in this chapter builds on.

**Using Spring Initializr, exactly the same tool already used at the very start of this course to bootstrap the Job app itself.** Selecting "OpenAI" under the AI section of Spring Initializr's dependency picker adds the correct starter automatically — the manual \`pom.xml\` additions below show what that selection actually produces, for anyone assembling the project by hand instead.

**The full, minimal \`pom.xml\` setup — BOM plus the OpenAI starter:**
\`\`\`xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    </dependency>
</dependencies>
\`\`\`

**What \`spring-ai-openai-spring-boot-starter\` actually auto-configures — connecting straight back to Spring Boot's auto-configuration pattern already established throughout this course.** Adding this one dependency is enough for Spring Boot to auto-configure a \`ChatModel\` bean (and, from it, a \`ChatClient.Builder\` bean) wired to OpenAI — the exact same "add a starter, get auto-configured beans" pattern already seen with \`spring-boot-starter-security\` (see [[creating-a-spring-security-project]]) and \`spring-boot-starter-data-jpa\` earlier in this course, just applied to an AI provider instead of security or persistence.

**What's still missing at this point, deliberately — the actual credential needed to make any of this work.** The starter is configured and the beans exist, but calling any of them right now would fail — there's no API key set anywhere yet. That's exactly the subject of the next topic (see [[create-openai-api-key]]), the one remaining prerequisite before an actual LLM call can succeed.`,
  code: `<!-- pom.xml -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    </dependency>
</dependencies>`,
  codeTitle: 'The minimal Maven setup for a Spring AI + OpenAI project',
  points: [
    'The "OpenAI" dependency option under the AI section of Spring Initializr adds the correct starter automatically, the same tool already used to bootstrap the Job app at the start of this course.',
    'spring-ai-openai-spring-boot-starter auto-configures a ChatModel bean and a ChatClient.Builder bean wired to OpenAI, given just this one dependency.',
    'This is the exact same "add a starter dependency, get auto-configured beans" pattern already seen with spring-boot-starter-security and spring-boot-starter-data-jpa earlier in this course.',
    'The BOM (from the previous topic) manages the version of this starter automatically, so no explicit version is needed on the dependency itself.',
    'The project compiles and the beans exist, but no LLM call can succeed yet - there is no API key configured, which is exactly the subject of the very next topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Adding spring-ai-openai-spring-boot-starter without the BOM declared in dependencyManagement first can pull in a version of the starter that expects a different Spring Boot version than the rest of the project uses, causing confusing bean-wiring or classpath errors that look unrelated to a missing dependency version - always declare the BOM first.' },
    { type: 'interview', content: 'Q: What does adding spring-ai-openai-spring-boot-starter to a project actually auto-configure, and what specific piece is still required before it can be used?\nA: It auto-configures a ChatModel bean (the underlying model adapter) and a ChatClient.Builder bean wired to OpenAI, following the same auto-configuration pattern as other Spring Boot starters like spring-boot-starter-data-jpa. What is still required is a valid OpenAI API key - without one, any actual call to the model fails, since the starter only wires the configuration and beans, not a working credential.' },
  ],
}
