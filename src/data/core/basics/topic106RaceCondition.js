export default {
  id: 'race-condition',
  title: '106. Race Condition',
  explanation: `A race condition occurs when two or more threads access shared mutable data concurrently and the outcome depends on the timing of their execution. The program produces incorrect results because the threads "race" each other to read and write data.

The classic example is incrementing a counter. The operation count++ looks atomic but is actually three steps:
1. Read the current value of count
2. Add 1
3. Write the new value back

If two threads both read the same value before either writes back, both will compute the same result and write it — losing one increment. This is called a lost update.

**Solutions:**
1. **synchronized keyword** — only one thread can execute the synchronized block/method at a time.
2. **AtomicInteger / AtomicLong** — classes in java.util.concurrent.atomic that perform truly atomic operations using CPU-level compare-and-swap (CAS).
3. **ReentrantLock** — more flexible than synchronized, allows timed and interruptible locking.

A race condition is a type of thread interference bug. They are notoriously hard to reproduce because they depend on exact timing — they may appear only under heavy load or specific OS scheduling.`,
  code: `import java.util.concurrent.atomic.*;

// UNSAFE: race condition on shared counter
class UnsafeCounter {
    private int count = 0;
    void increment() { count++; }  // NOT atomic: read-modify-write
    int get() { return count; }
}

// SAFE: synchronized method
class SynchronizedCounter {
    private int count = 0;
    synchronized void increment() { count++; }  // only 1 thread at a time
    synchronized int get() { return count; }
}

// SAFE: AtomicInteger — faster than synchronized for simple counters
class AtomicCounter {
    private final AtomicInteger count = new AtomicInteger(0);
    void increment() { count.incrementAndGet(); }  // CAS, truly atomic
    int get() { return count.get(); }
}

public class RaceConditionDemo {
    public static void main(String[] args) throws InterruptedException {
        UnsafeCounter unsafe = new UnsafeCounter();
        SynchronizedCounter safe = new SynchronizedCounter();
        AtomicCounter atomic = new AtomicCounter();

        Runnable unsafeTask    = () -> { for (int i = 0; i < 10000; i++) unsafe.increment(); };
        Runnable safeTask      = () -> { for (int i = 0; i < 10000; i++) safe.increment(); };
        Runnable atomicTask    = () -> { for (int i = 0; i < 10000; i++) atomic.increment(); };

        Thread t1u = new Thread(unsafeTask); Thread t2u = new Thread(unsafeTask);
        Thread t1s = new Thread(safeTask);   Thread t2s = new Thread(safeTask);
        Thread t1a = new Thread(atomicTask); Thread t2a = new Thread(atomicTask);

        t1u.start(); t2u.start(); t1u.join(); t2u.join();
        t1s.start(); t2s.start(); t1s.join(); t2s.join();
        t1a.start(); t2a.start(); t1a.join(); t2a.join();

        System.out.println("Unsafe:       " + unsafe.get());    // likely < 20000
        System.out.println("Synchronized: " + safe.get());      // always 20000
        System.out.println("Atomic:       " + atomic.get());    // always 20000
    }
}`,
  codeTitle: 'Race Condition and Fixes',
  points: [
    'A race condition happens when the result depends on the interleaving of thread execution — making it non-deterministic',
    'count++ is NOT atomic: it compiles to three bytecode instructions (read, add, write) — two threads can interleave',
    'synchronized on a method or block ensures mutual exclusion: only one thread executes it at a time',
    'AtomicInteger uses CPU-level CAS (compare-and-swap) for lock-free atomic operations — faster for simple counters',
    'Race conditions are hard to reproduce reliably — they may only manifest under high concurrency or specific hardware',
    'volatile fixes visibility issues (one thread sees another thread writes) but does NOT fix race conditions on compound operations',
    'Always protect shared mutable state — use synchronization, atomic types, or immutable data',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Making a field volatile does NOT prevent race conditions for compound operations like i++. volatile only ensures visibility (no caching), not atomicity.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between synchronized and AtomicInteger?\nA: synchronized uses a monitor lock (can block threads). AtomicInteger uses non-blocking CAS operations. AtomicInteger is faster for simple counters; synchronized is needed when protecting a larger critical section involving multiple operations.',
    },
    {
      type: 'tip',
      content: 'Prefer immutable objects for shared data — if an object cannot be modified after construction, there is no race condition possible.',
    },
  ],
}
