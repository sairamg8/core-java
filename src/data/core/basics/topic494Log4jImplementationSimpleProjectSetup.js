export default {
  id: 'log4j-implementation-simple-project-setup',
  title: '494. Log4J Implementation Simple Project Setup',
  explanation: `With levels and hierarchy understood conceptually (see [[more-on-fundamentals-of-log4j]]), this topic sets up a minimal, standalone Java project (deliberately not Spring Boot yet — that comes later, see [[logging-with-spring-boot]]) using Log4j2 directly, to see the raw configuration without any framework auto-configuration hiding what's happening.

**The dependency — plain Log4j2, no Spring involved:**
\`\`\`xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.23.1</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.23.1</version>
</dependency>
\`\`\`
\`log4j-api\` is what application code compiles against; \`log4j-core\` is the actual implementation — the same api/implementation split principle already seen with \`jjwt\` (see [[project-setup-for-jwt]]).

**The configuration file — \`log4j2.xml\`, placed at \`src/main/resources\`, discovered automatically by Log4j2 at startup with no code pointing to it explicitly:**
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>
    <Loggers>
        <Root level="info">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
\`\`\`

**Reading the \`PatternLayout\` pattern string, piece by piece — this exact syntax appears in every Log4j2 configuration from here on:**
- \`%d{HH:mm:ss}\` — timestamp, formatted per the given pattern
- \`[%t]\` — thread name, in brackets
- \`%-5level\` — the log level, left-aligned and padded to 5 characters (so \`INFO\`, \`WARN\`, and \`ERROR\` all line up visually in console output)
- \`%logger{36}\` — the logger name, abbreviated to at most 36 characters if longer
- \`%msg\` — the actual log message
- \`%n\` — a platform-appropriate newline

**Why \`status="WARN"\` on the root \`<Configuration>\` element matters, distinct from the \`Root\` logger's own level.** This controls Log4j2's *internal, self-diagnostic* logging (about its own configuration loading, plugin discovery) — separate entirely from the application's own log output. Setting it to \`WARN\` avoids Log4j2 flooding the console with its own internal startup chatter while the application's actual \`Root\` logger level is configured independently.`,
  code: `<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>
    <Loggers>
        <Root level="info">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>`,
  codeTitle: 'A minimal log4j2.xml - console appender, pattern layout, root level',
  points: [
    'log4j-api (compiled against by application code) and log4j-core (the actual implementation) mirror the same API/implementation split seen in other libraries like jjwt.',
    'log4j2.xml in src/main/resources is discovered automatically at startup - no code needs to reference it explicitly.',
    'PatternLayout syntax (%d, %t, %level, %logger, %msg, %n) controls exactly how each log line is formatted, and this same syntax reappears in every later Log4j2 configuration.',
    '%-5level left-aligns and pads the level name to 5 characters specifically so INFO, WARN, and ERROR line up visually in console output.',
    'The status attribute on <Configuration> controls internal diagnostic logging owned by Log4j2 itself, entirely separate from the Root logger level of the application - conflating the two is a common early confusion.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Placing log4j2.xml anywhere other than the classpath root (typically src/main/resources) means it will not be found automatically, and Log4j2 silently falls back to a default configuration - producing plain console output with no error explaining why the custom configuration was never applied.' },
    { type: 'interview', content: 'Q: What does the status attribute on the <Configuration> root element in log4j2.xml actually control, versus the level set on the Root logger?\nA: status controls internal, self-diagnostic logging owned by Log4j2 itself - messages about its own configuration loading and plugin discovery - not the application log output at all. The level on the Root logger is a completely separate setting controlling the verbosity of the application own log calls; confusing the two is a common source of either missing internal diagnostics or unwanted internal log noise.' },
  ],
}
