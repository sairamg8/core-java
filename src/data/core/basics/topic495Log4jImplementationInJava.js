export default {
  id: 'log4j-implementation-in-java',
  title: '495. Log4j Implementation in Java',
  explanation: `With \`log4j2.xml\` configured (see [[log4j-implementation-simple-project-setup]]), this topic writes the actual Java code that uses it — obtaining a logger and calling it correctly, including the parameterized-message pattern that matters for performance, not just style.

**Obtaining and using a logger, following the class-name convention already established (see [[introduction-to-logging-with-log4j-2]]):**
\`\`\`java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class OrderService {
    private static final Logger log = LogManager.getLogger(OrderService.class);

    public void processOrder(int orderId) {
        log.debug("Processing order with id: {}", orderId);
        try {
            // ... business logic ...
            log.info("Order {} processed successfully", orderId);
        } catch (Exception e) {
            log.error("Failed to process order {}", orderId, e);
        }
    }
}
\`\`\`

**Why the field is \`private static final\`, specifically.** \`static\` — one shared logger instance per class, not one per object instance (there's no reason for two \`OrderService\` objects to have separate logger objects). \`final\` — the reference never needs to change after initialization. This is the standard, near-universal pattern for logger fields across the Java ecosystem, not specific to Log4j2.

**Why \`log.debug("Processing order with id: {}", orderId)\` is written with a \`{}\` placeholder, rather than string concatenation (\`"Processing order with id: " + orderId\`).** If the configured level suppresses \`DEBUG\` (see [[more-on-fundamentals-of-log4j]]), the parameterized form **never constructs the formatted string at all** — Log4j2 checks whether the level is enabled *before* doing any string work. String concatenation, by contrast, happens unconditionally in Java regardless of whether the resulting string is ever used, since concatenation is evaluated as part of building the method call's arguments — a real, measurable cost on a hot path with many suppressed \`DEBUG\` calls.

**Why \`log.error("Failed to process order {}", orderId, e)\` passes the exception \`e\` as the *last* argument, not as part of the message string.** Log4j2 recognizes a trailing \`Throwable\` argument specifically and automatically appends its full stack trace to the log output — writing \`e.getMessage()\` into the message string manually would only capture the exception's message text, silently throwing away the stack trace that's almost always what's actually needed to diagnose the failure.`,
  code: `import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class OrderService {
    private static final Logger log = LogManager.getLogger(OrderService.class);

    public void processOrder(int orderId) {
        log.debug("Processing order with id: {}", orderId);
        try {
            // ... business logic ...
            log.info("Order {} processed successfully", orderId);
        } catch (Exception e) {
            log.error("Failed to process order {}", orderId, e);   // e last -> full stack trace
        }
    }
}`,
  codeTitle: 'Obtaining a logger and calling it with parameterized messages',
  points: [
    'The logger field is conventionally private static final - static because one shared instance per class is sufficient, final because the reference never needs to change.',
    'Parameterized logging (log.debug("... {}", value)) skips building the formatted string entirely when the level is disabled - unlike string concatenation, which always executes regardless of whether the level is enabled.',
    'On a hot path with many suppressed DEBUG calls, string concatenation has a real, measurable cost that parameterized logging avoids.',
    'Passing an exception as the trailing argument (log.error("msg {}", value, exception)) makes Log4j2 automatically append the full stack trace to the output.',
    'Writing exception.getMessage() manually into a log message string captures only the message text, silently discarding the stack trace that is usually what actually helps diagnose the failure.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Writing log.debug("Processing order: " + orderId) instead of log.debug("Processing order: {}", orderId) builds the concatenated string every single time the line executes, even when DEBUG is disabled entirely - on a busy hot path this can add up to real, measurable overhead that parameterized logging avoids by design.' },
    { type: 'interview', content: 'Q: Why should an exception be passed as the last argument to a log call (log.error("message {}", value, exception)) rather than included in the message string via exception.getMessage()?\nA: Log4j2 recognizes a trailing Throwable argument specifically and automatically appends its full stack trace to the log output. Manually embedding only exception.getMessage() into the message string captures the exception message text but silently discards the stack trace, which is almost always the information actually needed to diagnose where and why the failure occurred.' },
  ],
}
