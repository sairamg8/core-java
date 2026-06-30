export default {
  id: 'design-patterns',
  title: '1. Design Patterns — Creational, Structural, Behavioral',
  explanation: `Design patterns are proven solutions to recurring design problems. They describe a general template, not specific code.

**Creational** — how objects are created (control creation complexity)
**Structural** — how objects are composed (simplify relationships)
**Behavioral** — how objects communicate (define responsibility)`,
  table: {
    headers: ['Pattern', 'Category', 'Intent'],
    rows: [
      ['Singleton', 'Creational', 'One instance per JVM'],
      ['Factory Method', 'Creational', 'Delegate object creation to subclasses'],
      ['Builder', 'Creational', 'Step-by-step construction of complex objects'],
      ['Adapter', 'Structural', 'Translate one interface to another'],
      ['Decorator', 'Structural', 'Add behavior without subclassing'],
      ['Observer', 'Behavioral', 'Notify subscribers when state changes'],
      ['Strategy', 'Behavioral', 'Swap algorithms at runtime'],
      ['Template Method', 'Behavioral', 'Define skeleton, subclasses fill details'],
    ],
  },
  code: `// ── Singleton (thread-safe, lazy) ────────────────────────────────────────
class AppConfig {
    private static volatile AppConfig instance;
    private AppConfig() {}

    public static AppConfig getInstance() {
        if (instance == null) {                  // first check (no lock)
            synchronized (AppConfig.class) {
                if (instance == null) {          // second check (with lock)
                    instance = new AppConfig();
                }
            }
        }
        return instance;
    }
}
// Simpler — enum Singleton (serialization-safe, thread-safe, lazy)
enum Config { INSTANCE;
    public String getDbUrl() { return "jdbc:..."; }
}

// ── Builder ──────────────────────────────────────────────────────────────
class HttpRequest {
    private final String url;
    private final String method;
    private final int timeout;

    private HttpRequest(Builder b) {
        this.url = b.url; this.method = b.method; this.timeout = b.timeout;
    }

    public static class Builder {
        private final String url;            // required
        private String method = "GET";       // optional with default
        private int timeout = 30;

        public Builder(String url) { this.url = url; }
        public Builder method(String m) { this.method = m; return this; }
        public Builder timeout(int t)  { this.timeout = t; return this; }
        public HttpRequest build() { return new HttpRequest(this); }
    }
}
HttpRequest req = new HttpRequest.Builder("https://api.example.com")
    .method("POST").timeout(60).build();

// ── Factory Method ────────────────────────────────────────────────────────
interface Notification { void send(String message); }
class EmailNotification implements Notification {
    public void send(String msg) { System.out.println("Email: " + msg); }
}
class SMSNotification implements Notification {
    public void send(String msg) { System.out.println("SMS: " + msg); }
}
class NotificationFactory {
    public static Notification create(String type) {
        return switch (type) {
            case "email" -> new EmailNotification();
            case "sms"   -> new SMSNotification();
            default      -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}

// ── Strategy — swap algorithms at runtime ─────────────────────────────────
interface SortStrategy { void sort(int[] arr); }
class BubbleSort implements SortStrategy {
    public void sort(int[] a) { /* bubble sort */ }
}
class QuickSort implements SortStrategy {
    public void sort(int[] a) { /* quicksort */ }
}
class Sorter {
    private SortStrategy strategy;
    public Sorter(SortStrategy s) { this.strategy = s; }
    public void setStrategy(SortStrategy s) { this.strategy = s; }
    public void sort(int[] a) { strategy.sort(a); }
}

// ── Observer ──────────────────────────────────────────────────────────────
interface EventListener { void onEvent(String event); }
class EventBus {
    private final java.util.List<EventListener> listeners = new java.util.ArrayList<>();
    public void subscribe(EventListener l) { listeners.add(l); }
    public void publish(String event) { listeners.forEach(l -> l.onEvent(event)); }
}

// ── Decorator ─────────────────────────────────────────────────────────────
interface TextProcessor { String process(String text); }
class PlainText implements TextProcessor {
    public String process(String t) { return t; }
}
class UpperCaseDecorator implements TextProcessor {
    private final TextProcessor wrapped;
    public UpperCaseDecorator(TextProcessor p) { this.wrapped = p; }
    public String process(String t) { return wrapped.process(t).toUpperCase(); }
}
class TrimDecorator implements TextProcessor {
    private final TextProcessor wrapped;
    public TrimDecorator(TextProcessor p) { this.wrapped = p; }
    public String process(String t) { return wrapped.process(t).trim(); }
}
TextProcessor p = new UpperCaseDecorator(new TrimDecorator(new PlainText()));
p.process("  hello ");  // "HELLO"`,
  points: [
    'Prefer composition over inheritance — Strategy and Decorator show this: behavior is added by wrapping, not subclassing',
    'Singleton is often overused — consider dependency injection instead; singletons make code hard to test',
    'Builder is essential when a constructor has 4+ parameters, especially optional ones — avoids telescoping constructors',
    'Java\'s functional interfaces ARE the Strategy pattern — Comparator is a strategy for ordering',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Factory Method and Abstract Factory?\nA: Factory Method defines one method to create one type of object — subclasses decide the concrete class. Abstract Factory provides an interface for creating a FAMILY of related objects (e.g. Button + Checkbox for Windows vs Mac) without specifying concrete classes.',
    },
    {
      type: 'gotcha',
      content: 'Double-checked locking for Singleton REQUIRES the volatile keyword on the instance field. Without volatile, the compiler may publish a partially constructed object to other threads due to instruction reordering.',
    },
  ],
}
