export default {
  id: 'scope-and-value-annotations',
  title: '342. @Scope and @Value Annotations',
  explanation: `Two independent annotations often introduced together: **\`@Scope\`** controls **how many instances** of a bean exist, and **\`@Value\`** injects **external configuration** into a bean.

**\`@Scope\` — instance lifecycle** (see [[scope-annotation]]):
\`\`\`java
@Component
@Scope("prototype")   // new instance on every request; default is singleton
public class ReportBuilder { }
\`\`\`

**\`@Value\` — inject literals and properties.** It sets a field, constructor parameter, or setter from a literal, a property key, or a SpEL expression.

**a) Literal value:**
\`\`\`java
@Value("Hyderabad")
private String city;
\`\`\`

**b) Property placeholder** — pulls from \`application.properties\`/env. The \`\${...}\` placeholder is resolved by the container:
\`\`\`java
@Value("\${app.name}")
private String appName;

@Value("\${server.port:8080}")   // :8080 is a default if the key is missing
private int port;
\`\`\`

**c) SpEL expression** — the \`#{...}\` form evaluates a Spring Expression Language snippet:
\`\`\`java
@Value("#{2 * 60}")
private int cacheSeconds;      // 120
\`\`\`

**Placeholder vs SpEL — do not confuse them:**
- **\`\${...}\`** = property placeholder, looked up in the environment.
- **\`#{...}\`** = SpEL, an evaluated expression.

For \`\${...}\` to resolve you need a property source (\`@PropertySource\` or, in Boot, \`application.properties\` is loaded automatically). A missing key with **no** default throws at startup — which is good fail-fast behaviour. \`@Value\` is the classic way to externalise small config values, and in Spring Boot it complements \`@ConfigurationProperties\` for typed groups of settings.`,
  code: `@Component
@Scope("singleton")   // default; one shared instance
public class AppSettings {

    @Value("MyApp")                         // literal
    private String literalName;

    @Value("\${app.name}")                   // from application.properties
    private String appName;

    @Value("\${app.timeout:30}")             // with default of 30
    private int timeoutSeconds;

    @Value("#{60 * 60}")                     // SpEL -> 3600
    private int secondsPerHour;

    // Constructor injection of a property also works:
    public AppSettings(@Value("\${app.env:dev}") String env) {
        System.out.println("env = " + env);
    }
}

// application.properties
// app.name=Student Portal`,
  codeTitle: '@Scope for lifecycle, @Value for config',
  points: [
    '@Scope controls how many bean instances exist; singleton is the default and prototype makes a new one per request',
    '@Value injects a literal, a property placeholder, or a SpEL expression into a field, constructor arg, or setter',
    'The ${key} form is a property placeholder resolved from the environment or properties file',
    'The #{expr} form is a SpEL expression that is evaluated, not looked up',
    'A ${key} placeholder can carry a default with ${key:default}, and a missing key without a default fails at startup',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between ${...} and #{...} in @Value?\nA: ${...} is a property placeholder — Spring resolves it against the environment and property sources such as application.properties, optionally with a default via ${key:default}. #{...} is a SpEL expression that Spring evaluates at runtime, so it can do arithmetic, call methods, or reference other beans. One reads configuration, the other computes a value.',
    },
    {
      type: 'gotcha',
      content: 'A ${...} placeholder only resolves if a property source provides the key. In plain Spring you must register one with @PropertySource (or a PropertySourcesPlaceholderConfigurer); Spring Boot loads application.properties automatically. A missing key with no default throws IllegalArgumentException at startup.',
    },
  ],
}
