export default {
  id: 'more-on-fundamentals-of-log4j',
  title: '493. More on Fundamentals of Log4J',
  explanation: `With Logger, Appender, and Layout introduced (see [[introduction-to-logging-with-log4j-2]]), this topic goes one level deeper on two things every Log4j2 user runs into quickly: the five log levels in practice, and how root vs. named loggers actually interact.

**The five standard levels, and a concrete rule of thumb for each — not just the ordering already mentioned:**
- **TRACE** — extremely fine-grained, "what is this loop doing on every iteration" detail; almost never enabled outside of actively debugging one specific issue
- **DEBUG** — useful detail during development (method entry, variable values) — enabled locally, usually disabled in production
- **INFO** — meaningful business events worth knowing happened ("order 123 processed," "application started") — the typical production default
- **WARN** — something unexpected happened but the application recovered and kept working (a retried request, a fallback used)
- **ERROR** — something failed and needs attention (an unhandled exception, a failed database write)

**Level filtering is a threshold, not a set of individually toggled switches.** Setting a logger's level to \`INFO\` doesn't mean "show only INFO messages" — it means "show INFO and everything *more severe*" (INFO, WARN, ERROR), while suppressing everything *less severe* (TRACE, DEBUG). This is why the levels are always presented in a strict order (TRACE < DEBUG < INFO < WARN < ERROR) — that ordering *is* the filtering rule.

**Root logger vs. named loggers — how the hierarchy from the previous topic actually resolves in practice.**
\`\`\`xml
<Loggers>
    <Logger name="com.example.service" level="DEBUG" additivity="false">
        <AppenderRef ref="Console" />
    </Logger>
    <Root level="INFO">
        <AppenderRef ref="Console" />
        <AppenderRef ref="File" />
    </Root>
</Loggers>
\`\`\`
The \`Root\` logger is the fallback that applies to every class with no more specific rule. \`com.example.service\` overrides that fallback specifically for classes in that package, at a more verbose \`DEBUG\` level.

**\`additivity="false"\` — a subtle but important setting.** By default, a log event that matches a named logger *also* propagates up to the \`Root\` logger's appenders (both would fire). \`additivity="false"\` stops that propagation, so \`com.example.service\` logs go *only* to its own \`Console\` appender, not duplicated through \`Root\`'s \`Console\` and \`File\` appenders as well — without it, a single log call could produce the same message written to a given appender more than once if that appender is referenced at multiple levels of the hierarchy.`,
  code: `<Loggers>
    <Logger name="com.example.service" level="DEBUG" additivity="false">
        <AppenderRef ref="Console" />
    </Logger>
    <Root level="INFO">
        <AppenderRef ref="Console" />
        <AppenderRef ref="File" />
    </Root>
</Loggers>

<!--
Without additivity="false":
  a DEBUG log from com.example.service.OrderService would print to
  BOTH its own Console appender AND propagate up to Root's Console
  appender too - the same message duplicated.
With additivity="false":
  it only goes to its own Console appender, not Root's.
-->`,
  codeTitle: 'Root vs. named loggers, and additivity controlling propagation between them',
  points: [
    'A configured log level is a threshold, not an individual toggle - setting INFO shows INFO and everything more severe (WARN, ERROR), suppressing TRACE and DEBUG.',
    'TRACE is finer-grained than DEBUG and almost never enabled outside actively debugging one specific issue; INFO is the typical production default for meaningful business events.',
    'The Root logger is the fallback configuration applied to any class without a more specific named logger rule.',
    'A named logger (like com.example.service) overrides the Root configuration specifically for classes in that package or narrower.',
    'additivity="false" stops events from a named logger from also propagating up to the appenders of the Root logger, preventing the same message from being written to a shared appender more than once.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting additivity="false" on a named logger that references the same appender as Root causes every matching log message to be written twice to that appender - a confusing, easy-to-miss duplication bug that looks like the application is logging everything twice.' },
    { type: 'interview', content: 'Q: What does setting the level of a logger to INFO actually mean in terms of which messages are shown?\nA: It is a threshold, not a specific filter - INFO and every level more severe than it (WARN, ERROR) are shown, while every level less severe (DEBUG, TRACE) is suppressed. This is exactly why the five levels are always presented in a strict severity order, since that order defines what "setting a level" actually includes.' },
  ],
}
