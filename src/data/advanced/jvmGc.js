export default {
  id: 'jvm-gc',
  title: '1. JVM Memory & Garbage Collection',
  explanation: `**JVM Memory Areas:**
- **Heap** — where objects live. Divided into Young Generation (Eden + Survivor) and Old Generation (Tenured).
- **Stack** — per-thread. Stores stack frames (local variables, operand stack, reference to current method).
- **Metaspace** (Java 8+) — class metadata, method bytecode. Replaced PermGen. Grows dynamically.
- **Code Cache** — JIT-compiled native code.

**GC lifecycle:** Objects start in Eden → survive GC → promoted to Survivor → eventually to Old Gen → Old Gen GC (Major/Full GC).`,
  table: {
    headers: ['GC Algorithm', 'Java Version', 'Pause Type', 'Best For'],
    rows: [
      ['Serial GC', 'All', 'Stop-the-world', 'Small apps, single CPU'],
      ['Parallel GC', 'All (default pre-9)', 'Stop-the-world (parallel)', 'Throughput-focused batch jobs'],
      ['G1 GC', 'Java 9+ default', 'Concurrent + short pauses', 'General purpose (< 10ms pauses)'],
      ['ZGC', 'Java 15+ stable', 'Sub-millisecond', 'Low-latency, large heaps (TB)'],
      ['Shenandoah', 'OpenJDK 12+', 'Sub-millisecond', 'Low-latency, concurrent compaction'],
    ],
  },
  code: `// ── JVM flags for GC tuning ──────────────────────────────────────────────
// -Xms512m     initial heap size (don't set too low — wastes GC time growing)
// -Xmx4g       maximum heap size
// -Xss512k     stack size per thread (default ~512k–1MB)
// -XX:+UseG1GC              use G1 (explicit, already default Java 9+)
// -XX:+UseZGC               use ZGC (Java 15+)
// -XX:MaxGCPauseMillis=200  G1 target max pause (best-effort, not guaranteed)
// -verbose:gc               print GC events
// -XX:+PrintGCDetails       detailed GC log (use -Xlog:gc* in Java 9+)
// java -Xlog:gc*:file=gc.log:time,level,tags  — structured GC log

// ── Object lifecycle ──────────────────────────────────────────────────────
// 1. new Object() → allocated in Eden
// 2. Minor GC fires (Eden full) → live objects moved to Survivor S0
// 3. Next minor GC → S0 survivors copied to S1; young objects age++
// 4. Age threshold reached (default 15) → object promoted to Old Gen
// 5. Old Gen fills → Major/Full GC (stop-the-world for Serial/Parallel)

// ── Memory leaks in Java ──────────────────────────────────────────────────
// Java GC cannot collect objects with live references — "logical" leaks
import java.util.*;

class CacheExample {
    // ❌ Unbounded cache — objects never GC'd
    private static final Map<String, Object> cache = new HashMap<>();

    // ✅ WeakHashMap — GC can reclaim keys when no other reference exists
    private static final Map<String, Object> weakCache = new WeakHashMap<>();

    // ✅ LRU cache via LinkedHashMap removes least recently used
    private static final Map<String, Object> lruCache =
        new LinkedHashMap<>(100, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, Object> e) {
                return size() > 100;
            }
        };
}

// ── Reference types ───────────────────────────────────────────────────────
// Strong reference (default) — prevents GC
Object obj = new Object();   // not GC'd while obj is reachable

// Soft reference — GC collects only if memory is low (good for caches)
java.lang.ref.SoftReference<Object> soft = new java.lang.ref.SoftReference<>(new Object());

// Weak reference — GC collects in next cycle regardless (WeakHashMap)
java.lang.ref.WeakReference<Object> weak = new java.lang.ref.WeakReference<>(new Object());

// Phantom reference — object already finalized, used for cleanup hooks
java.lang.ref.ReferenceQueue<Object> queue = new java.lang.ref.ReferenceQueue<>();
java.lang.ref.PhantomReference<Object> phantom =
    new java.lang.ref.PhantomReference<>(new Object(), queue);

// ── Diagnosing memory issues ──────────────────────────────────────────────
// OutOfMemoryError: Java heap space  → increase -Xmx or fix memory leak
// OutOfMemoryError: Metaspace        → class loader leak (frameworks)
// StackOverflowError                 → infinite recursion (or -Xss too small)
//
// Tools: jmap (heap dump), jstat (GC stats), VisualVM, JFR (Java Flight Recorder)
// jmap -dump:live,format=b,file=heap.hprof <pid>
// jstat -gcutil <pid> 1000  (GC stats every 1s)`,
  points: [
    'Set -Xms equal to -Xmx in production to avoid heap resize pauses and unpredictable latency',
    'Minor GC is fast (milliseconds) — collect mostly Young Gen. Major/Full GC is slow — pauses everything. G1/ZGC minimize Full GC events.',
    'System.gc() is a hint, not a command — the JVM may ignore it. Never rely on it for correctness.',
    'finalize() is deprecated in Java 9 and removed in 18 — use try-with-resources or Cleaner API for resource cleanup',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is a memory leak in Java if GC handles memory?\nA: Java GC can only collect objects with no live references. A "memory leak" in Java means holding references to objects longer than needed — an unbounded static collection, event listeners never removed, ThreadLocals not cleared after use. The objects are reachable but logically useless, so GC can\'t touch them.',
    },
    {
      type: 'gotcha',
      content: 'ThreadLocal values are not GC\'d until the thread itself terminates. In thread pools (where threads live forever), always call threadLocal.remove() when the task finishes — otherwise every task accumulates state and causes a memory leak.',
    },
  ],
}
