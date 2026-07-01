export default {
  id: 'introduction-to-logging-with-log4j-1',
  title: '491. Introduction to Logging with Log4j',
  explanation: `Every code example across this entire course, and most beginner Java tutorials generally, use \`System.out.println(...)\` to see what a program is doing. This topic explains precisely why that habit doesn't survive contact with a real application, and introduces **Log4j** as the tool that replaces it.

**What's actually wrong with \`System.out.println\` in a real application, concretely:**
- **No severity levels.** Every \`println\` is equally "loud" — there's no way to distinguish "the app started" from "a request took too long" from "the database connection failed," and no way to turn down the noise without deleting or commenting out lines.
- **No control over destination.** Output goes straight to the console, full stop — no way to also write to a file, ship to a centralized log system, or split error messages from informational ones without rewriting every call site.
- **No context.** A bare \`println("Order processed")\` doesn't say *when* (no automatic timestamp), *where* (no automatic class/thread name), or *how severe* — all of that would have to be built into every single message by hand.
- **Performance cost that can't be turned off cheaply.** \`println\` always executes and always writes to the console synchronously — there's no way to say "skip this entirely unless something is actually being debugged right now."

**What a logging framework provides instead, as a direct answer to each of those gaps:**
- **Log levels** (TRACE, DEBUG, INFO, WARN, ERROR) — one line of configuration controls how verbose the whole application is, without touching a single line of code that calls the logger.
- **Appenders** — configurable destinations (console, file, a rolling daily file, a remote log aggregator) — set up once, not per call site.
- **Automatic formatting** — timestamps, thread names, and class names attached to every message for free.
- **The ability to disable entire categories of logging cheaply** — a DEBUG-level statement, when the configured level is INFO, is skipped essentially for free, without deleting the line of code.

**Log4j specifically** is one of the original and most widely used Java logging frameworks — this course uses **Log4j2**, its modern rewrite (a ground-up redesign, not just a version bump, with substantially better performance and async logging support over the original Log4j 1.x, which reached end-of-life and is no longer recommended for new projects).`,
  code: `// The habit every beginner starts with:
System.out.println("Processing order: " + orderId);
// No level, no timestamp, no way to redirect or filter this, ever.

// What a logging framework replaces it with:
private static final Logger log = LogManager.getLogger(OrderService.class);

log.debug("Processing order: {}", orderId);   // only shown if DEBUG is enabled
log.info("Order {} processed successfully", orderId);
log.error("Order {} failed to process", orderId, exception);   // logs level + timestamp + stack trace`,
  codeTitle: 'System.out.println vs. a real logging call, side by side',
  points: [
    'System.out.println has no severity levels, no configurable destination, and no automatic context (timestamp, class, thread) - every piece of that would need to be built by hand into every call.',
    'A logging framework lets verbosity be controlled entirely through configuration - turning DEBUG logging on or off does not require touching or deleting a single line of application code.',
    'Appenders (console, file, remote aggregator) are configured once centrally, rather than each println call deciding its own destination.',
    'A disabled log level (like DEBUG when the configured level is INFO) is skipped cheaply at runtime, unlike println which always executes unconditionally.',
    'Log4j2 is a ground-up rewrite of the original Log4j, not just a version increment - the original Log4j 1.x has reached end-of-life and should not be used in new projects.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Leaving System.out.println statements scattered through a real application means there is no way to reduce log noise in production without a code change and redeploy - a logging framework turns "too noisy in production" into a one-line configuration change instead.' },
    { type: 'interview', content: 'Q: What are the concrete limitations of System.out.println that a real logging framework like Log4j2 solves?\nA: println provides no severity levels (everything is equally visible), no configurable destination (always the console), no automatic context like timestamps or class names, and no cheap way to disable verbose output without editing code. A logging framework adds configurable levels, appenders for different destinations, automatic formatting, and the ability to suppress entire categories of logging through configuration alone.' },
  ],
}
