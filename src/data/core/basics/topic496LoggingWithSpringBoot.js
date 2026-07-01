export default {
  id: 'logging-with-spring-boot',
  title: '496. Logging with Spring Boot',
  explanation: `Every prior topic in this chapter used plain Log4j2 in a standalone project, deliberately, to see the raw mechanics (see [[log4j-implementation-in-java]]). This topic returns to the Job app itself and covers what Spring Boot changes — quite a lot, by default, all before writing a single line of logging configuration.

**Spring Boot's default: Logback, not Log4j2, and it's already fully working with zero configuration.** \`spring-boot-starter-web\` (and most other starters) pulls in \`spring-boot-starter-logging\`, which bundles Logback pre-configured with sensible defaults — console output, a readable pattern, \`INFO\` as the default root level. This is why every \`log.info(...)\` call made throughout the entire Job app across this course has already been producing readable console output, without any \`log4j2.xml\` or \`logback.xml\` ever being written.

**Switching to Log4j2 in a Spring Boot app, if preferred over the Logback default — excluding one starter, adding another:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
\`\`\`
The exclusion is required specifically because Spring Boot ships with Logback by default — simply adding \`spring-boot-starter-log4j2\` alongside the default without excluding it would leave two competing logging implementations on the classpath simultaneously, a conflict Spring Boot detects and fails to start over.

**Configuring log levels the Spring Boot way — no XML required for the common case:**
\`\`\`properties
logging.level.root=INFO
logging.level.com.jobapp.service=DEBUG
logging.file.name=logs/app.log
\`\`\`
This is functionally equivalent to the \`Root\`/named-\`Logger\` hierarchy configured by hand in plain Log4j2 (see [[more-on-fundamentals-of-log4j]]) — Spring Boot just exposes it as simple property keys instead of requiring an XML file for basic level and file-output configuration. A full \`logback-spring.xml\` (or \`log4j2-spring.xml\`) is still available and necessary for anything beyond this — custom appenders, rolling policies, structured JSON output.

**Why the \`-spring\` suffix on the XML filename matters, if writing one by hand** (\`logback-spring.xml\` rather than plain \`logback.xml\`): the \`-spring\`-suffixed variant is processed *after* Spring's environment is initialized, which is what allows it to reference Spring \`application.properties\` values and profile-specific configuration (\`<springProfile name="prod">\`) — a plain \`logback.xml\` loads too early in the startup sequence to see any of that Spring-specific context.`,
  code: `# application.properties - the Spring Boot way to configure logging,
# no XML file required for the common case:
logging.level.root=INFO
logging.level.com.jobapp.service=DEBUG
logging.file.name=logs/app.log
logging.pattern.console=%d{HH:mm:ss} %-5level %logger{36} - %msg%n

# To switch from the Logback default to Log4j2 instead:
# 1. Exclude spring-boot-starter-logging from spring-boot-starter-web
# 2. Add spring-boot-starter-log4j2`,
  codeTitle: 'Spring Boot logging configuration via application.properties',
  points: [
    'Spring Boot uses Logback by default via spring-boot-starter-logging, already fully configured with console output and INFO level - no configuration file is required to get working logs.',
    'Switching to Log4j2 requires explicitly excluding spring-boot-starter-logging before adding spring-boot-starter-log4j2, since having both logging implementations on the classpath at once is a conflict Spring Boot refuses to start with.',
    'logging.level.<package>=<LEVEL> in application.properties is functionally equivalent to the Root/named-Logger XML hierarchy configured by hand in plain Log4j2, without requiring an XML file for the common case.',
    'A full logback-spring.xml or log4j2-spring.xml file is still needed for anything beyond basic level/file configuration - custom appenders, rolling policies, structured output.',
    'The -spring suffix on a logging configuration filename (logback-spring.xml, not logback.xml) is what allows it to reference application.properties values and Spring profiles - a plain logback.xml loads too early to see any of that.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Adding spring-boot-starter-log4j2 without first excluding spring-boot-starter-logging results in the application failing to start with a logging implementation conflict error - both bring their own binding for the SLF4J facade, and having two on the classpath simultaneously is explicitly detected and rejected.' },
    { type: 'interview', content: 'Q: Why does a plain logback.xml file behave differently from a logback-spring.xml file in a Spring Boot application, and when would that difference actually matter?\nA: logback.xml is loaded very early in the startup sequence, before the Spring environment and property sources are initialized, so it cannot reference application.properties values or use Spring-specific constructs like <springProfile>. logback-spring.xml is processed later, once the Spring context is available, specifically so logging configuration can vary by active profile or reference externalized properties - this matters the moment logging needs to differ between environments (dev vs. prod) rather than being fixed at build time.' },
  ],
}
