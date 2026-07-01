export default {
  id: 'introduction-to-logging-with-log4j-2',
  title: '492. Introduction to Logging with Log4J',
  explanation: `Continuing directly from the previous topic's case against \`println\` (see [[introduction-to-logging-with-log4j-1]]), this topic looks at Log4j2's core building blocks — the same underlying concepts as SLF4J/Logback, covered generically elsewhere in this course, but named and configured specifically the Log4j2 way.

**The three core Log4j2 concepts, and how they relate:**
- **Logger** — the object application code actually calls (\`log.info(...)\`, \`log.error(...)\`). Obtained per class, by convention: \`LogManager.getLogger(OrderService.class)\`.
- **Appender** — where a log message actually goes once it's been logged: console, a file, a rolling file, a remote system. A single logger can write to multiple appenders at once.
- **Layout** — how a log message is formatted before being written by an appender: what order timestamp/level/class/message appear in, whether it's plain text or structured JSON.

**Why using the *class itself* as the logger's name is the near-universal convention, not just a style preference.** \`LogManager.getLogger(OrderService.class)\` names the logger \`com.example.service.OrderService\` — this lets configuration target logging verbosity **per package or per class** (\`com.example.service\` at \`DEBUG\`, everything else at \`INFO\`, for example), which would be impossible if every logger shared one generic name.

**Log4j2's hierarchical logger naming, and why it matters for configuration.** Because logger names are dotted paths matching package structure, a configuration rule set on \`com.example\` automatically applies to every logger nested under it (\`com.example.service\`, \`com.example.controller\`) unless a more specific rule overrides it for a narrower package — the same "most specific rule wins" principle already seen with Spring Security's \`authorizeHttpRequests\` (see [[security-configuration]]), applied here to logging configuration instead of access control.

**Log4j2's headline technical advantage over its predecessor and over Logback: asynchronous logging built on the LMAX Disruptor library.** A synchronous logger blocks the calling thread until the log message is fully written to its destination; Log4j2's async loggers hand the message off to a separate thread and return immediately, which matters specifically on high-throughput code paths where logging itself could otherwise become a measurable bottleneck.`,
  code: `// Logger obtained using the class itself as its name - this is the convention
private static final Logger log = LogManager.getLogger(OrderService.class);
// Logger name becomes: com.example.service.OrderService

// Hierarchical configuration (log4j2.xml) - most specific rule wins:
/*
<Loggers>
    <Logger name="com.example.service" level="DEBUG" />
    <Root level="INFO">
        <AppenderRef ref="Console" />
    </Root>
</Loggers>
*/
// Classes under com.example.service log at DEBUG; everything else at INFO`,
  codeTitle: 'Class-based logger naming and hierarchical configuration in Log4j2',
  points: [
    'Logger, Appender, and Layout are the three core Log4j2 building blocks - what logs, where it goes, and how it is formatted.',
    'Using the class itself as the name of a logger is the near-universal convention, since it produces a dotted name matching the package structure, enabling per-package or per-class verbosity configuration.',
    'Log4j2 logger names are hierarchical - a configuration rule on a parent package applies to every nested logger unless a more specific rule overrides it for a narrower package.',
    'A single logger can write to multiple appenders simultaneously (console and file at once, for example), configured centrally rather than per call site.',
    'Async logging in Log4j2, built on the LMAX Disruptor library, hands log messages to a separate thread rather than blocking the calling thread - its primary performance advantage on high-throughput paths.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Naming every logger with a single shared string (like LogManager.getLogger("app")) instead of the class itself removes the ability to configure log verbosity per package or class later - a mistake that is hard to notice until fine-grained log configuration is actually needed and turns out to be impossible.' },
    { type: 'interview', content: 'Q: Why is LogManager.getLogger(SomeClass.class) the standard way to obtain a logger, rather than a fixed string name?\nA: Using the class produces a logger name matching the fully qualified class name, which mirrors the package hierarchy. This lets logging configuration target verbosity at any level of that hierarchy - a whole package, or one specific class - with more specific rules automatically overriding broader ones, which would not be possible if every logger in the application shared one generic name.' },
  ],
}
