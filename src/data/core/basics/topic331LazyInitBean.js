export default {
  id: 'lazy-init-bean',
  title: '331. Lazy Init Bean',
  explanation: `By default, Spring creates all **singleton** beans **eagerly** — the moment the \`ApplicationContext\` starts (see [[spring-object-creation]]). **Lazy initialisation** defers a bean's creation until it is **first requested** (injected or fetched via \`getBean\`).

**How to make a bean lazy:**
- **XML:** \`<bean id="report" class="com.example.ReportService" lazy-init="true"/>\`
- **Annotations:** \`@Lazy\` on the \`@Component\`/\`@Bean\`.

**Eager vs lazy — the timing:**
- **Eager (default):** constructor runs at context startup. If you print inside the constructor, you see it during \`new ClassPathXmlApplicationContext(...)\`.
- **Lazy:** constructor runs only on the first \`getBean\`/injection. Nothing prints at startup; it prints when you first use the bean.

**Why use lazy init?**
- **Faster startup** — skip creating heavy beans (large caches, expensive connections) that may never be used in a given run.
- **Conditional/rarely-used beans** — build them only if actually needed.
- **Breaking certain init-order issues** — occasionally helps with tricky circular setups.

**Why eager is the sensible default (and usually better):**
- **Fail fast** — misconfiguration (missing dependency, bad class) surfaces at startup, not later when a user hits the feature.
- **Predictable first-request latency** — no "first call is slow" penalty because the bean is already built.

**Important interaction:** a lazy bean injected into an **eager** singleton is still created eagerly (because the eager bean needs it at construction). To truly defer it, mark the injection point \`@Lazy\` too, so Spring injects a proxy and delays creation until first use.`,
  code: `// XML: defer creation until first use
<bean id="reportService" class="com.example.ReportService" lazy-init="true"/>

// Annotation form
@Component
@Lazy
public class ReportService {
    public ReportService() {
        System.out.println("ReportService created");   // prints only on first use
    }
}

public class App {
    public static void main(String[] args) {
        ApplicationContext ctx =
            new ClassPathXmlApplicationContext("applicationContext.xml");
        System.out.println("Context ready");
        // ^ For a lazy bean, "ReportService created" has NOT printed yet

        ReportService r = ctx.getBean("reportService", ReportService.class);
        // ^ NOW "ReportService created" prints — first request triggers construction
    }
}`,
  codeTitle: 'lazy-init: create on first request',
  points: [
    'Singleton beans are created eagerly at startup by default; lazy init defers creation to first use',
    'Enable with lazy-init="true" in XML or @Lazy with annotations',
    'Lazy is useful for heavy or rarely-used beans to speed up startup',
    'Eager (default) is usually better: it fails fast on misconfiguration and avoids first-request latency',
    'A lazy bean injected into an eager singleton is still created eagerly unless the injection point is also @Lazy',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is lazy initialisation in Spring and what is the trade-off?\nA: Lazy initialisation (lazy-init="true" or @Lazy) delays the creation of a singleton bean until it is first requested, instead of building it eagerly at context startup. The benefit is faster startup and skipping unused heavy beans; the cost is that configuration errors are not detected until the bean is first used, and the first request pays the construction latency. Eager is the default precisely because it fails fast.',
    },
    {
      type: 'gotcha',
      content: 'Marking a bean @Lazy has no effect if an eagerly-created singleton depends on it — Spring must build the lazy bean to satisfy that dependency at startup. To actually defer it, put @Lazy on the injection point as well, so Spring injects a lazy proxy and postpones creation until the first method call.',
    },
  ],
}
