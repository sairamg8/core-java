export default {
  id: 'concurrency-utils',
  title: '1. Concurrency Utilities & CompletableFuture',
  explanation: `The \`java.util.concurrent\` package provides high-level concurrency tools — avoid raw thread management.

**ExecutorService** manages a pool of threads. You submit tasks; the pool schedules them.
**CompletableFuture** (Java 8+) enables non-blocking async pipelines — compose async operations without blocking threads.`,
  code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// ── ExecutorService ─────────────────────────────────────────────────────────
ExecutorService pool = Executors.newFixedThreadPool(4);     // 4 worker threads
ExecutorService cached = Executors.newCachedThreadPool();   // grows/shrinks
ExecutorService single = Executors.newSingleThreadExecutor(); // sequential
ScheduledExecutorService sched = Executors.newScheduledThreadPool(2);

// Submit Runnable (no result)
pool.submit(() -> System.out.println("Task 1"));

// Submit Callable (returns Future<T>)
Future<Integer> future = pool.submit(() -> {
    Thread.sleep(1000);
    return 42;
});
// future.get() BLOCKS until result is ready (or throws ExecutionException)
int result = future.get();      // 42
int withTimeout = future.get(2, TimeUnit.SECONDS);  // throws TimeoutException

// Always shut down the pool
pool.shutdown();            // finish submitted tasks, don't accept new ones
pool.awaitTermination(5, TimeUnit.SECONDS);
pool.shutdownNow();         // interrupt running tasks (last resort)

// Prefer try-with for executors (Java 21 AutoCloseable)
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    exec.submit(() -> System.out.println("Virtual task"));
}

// ── CompletableFuture ───────────────────────────────────────────────────────
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
    // runs in ForkJoinPool.commonPool() by default
    return fetchUserFromDB(1L);
});

// Chain transformations (non-blocking)
CompletableFuture<String> pipeline = CompletableFuture
    .supplyAsync(() -> fetchUserFromDB(1L))           // async start
    .thenApply(user -> user.toUpperCase())            // transform result
    .thenApply(s -> "Hello, " + s)                   // chain another
    .thenAccept(System.out::println)                  // consume (void)
    .thenRun(() -> System.out.println("Done"));       // run after (no input)

// Combine two futures
CompletableFuture<String> user  = CompletableFuture.supplyAsync(() -> "Alice");
CompletableFuture<Integer> score = CompletableFuture.supplyAsync(() -> 95);
CompletableFuture<String> combined = user.thenCombine(score,
    (u, s) -> u + " scored " + s);  // "Alice scored 95"

// Wait for ALL or ANY
CompletableFuture.allOf(user, score).thenRun(() -> System.out.println("Both done"));
CompletableFuture.anyOf(user, score).thenAccept(first -> System.out.println("First: " + first));

// Exception handling
CompletableFuture<String> safe = CompletableFuture
    .supplyAsync(() -> { throw new RuntimeException("DB error"); })
    .exceptionally(ex -> "default-user")          // fallback on error
    .handle((result2, ex) -> ex != null ? "error" : result2); // either

// ── Atomic classes ──────────────────────────────────────────────────────────
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();         // atomic i++
counter.addAndGet(5);              // atomic += 5
counter.compareAndSet(6, 10);      // CAS — set 10 only if current is 6

AtomicReference<String> ref = new AtomicReference<>("old");
ref.compareAndSet("old", "new");   // atomically swap if matches

// ── Locks ────────────────────────────────────────────────────────────────────
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();  // ALWAYS in finally
}
boolean acquired = lock.tryLock(100, TimeUnit.MILLISECONDS); // non-blocking attempt

String fetchUserFromDB(long id) { return "alice"; }`,
  points: [
    'Always shut down ExecutorService — undying thread pools prevent JVM exit since threads are non-daemon by default',
    'CompletableFuture.get() blocks — prefer thenApply/thenAccept pipelines to stay non-blocking',
    'AtomicInteger uses CAS (Compare-And-Swap) CPU instructions — no locking, no blocking, but only for single variables',
    'ReentrantLock gives tryLock(), lockInterruptibly(), and fairness options that synchronized lacks',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Future and CompletableFuture?\nA: Future.get() blocks the calling thread until the result is ready. CompletableFuture lets you register callbacks (thenApply, thenAccept) that run when the result is ready — no blocking. CompletableFuture can also be completed manually, combined with other futures, and has built-in exception handling.',
    },
    {
      type: 'gotcha',
      content: 'CompletableFuture.supplyAsync() uses the ForkJoinPool by default. If your task blocks (DB call, HTTP), pass a custom executor: supplyAsync(task, Executors.newCachedThreadPool()) — otherwise you starve the ForkJoinPool that the rest of the JVM uses.',
    },
  ],
}
