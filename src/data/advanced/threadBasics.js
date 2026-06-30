export default {
  id: 'thread-basics',
  title: '1. Thread Basics & the Java Memory Model',
  explanation: `A **thread** is the smallest unit of execution. Java threads map to OS threads (platform threads) — expensive to create, limited in number.

**Thread lifecycle:** NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED

**Java Memory Model (JMM):** Without synchronization, CPUs may cache writes locally and compilers may reorder instructions. The JMM defines when writes by one thread become visible to others.
- \`synchronized\` — mutual exclusion + visibility guarantee
- \`volatile\` — visibility only (no atomicity)`,
  table: {
    headers: ['State', 'Meaning'],
    rows: [
      ['NEW', 'Created but start() not called yet'],
      ['RUNNABLE', 'Running or ready to run (scheduler decides)'],
      ['BLOCKED', 'Waiting to acquire a monitor lock (synchronized)'],
      ['WAITING', 'Waiting indefinitely — for notify()/notifyAll() or join()'],
      ['TIMED_WAITING', 'Waiting with timeout — sleep(), wait(timeout), join(timeout)'],
      ['TERMINATED', 'run() has completed'],
    ],
  },
  code: `// Two ways to create a thread
// 1. Implement Runnable (preferred — separates task from thread mechanism)
class PrintTask implements Runnable {
    private final String message;
    PrintTask(String msg) { this.message = msg; }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": " + message);
    }
}

Thread t1 = new Thread(new PrintTask("Hello"), "worker-1");
t1.start();   // schedules the thread — does NOT block
// t1.run() ← WRONG — this runs on current thread, no new thread

// Lambda form
Thread t2 = new Thread(() -> System.out.println("Lambda task"), "worker-2");
t2.start();

// 2. Extend Thread (not preferred — locks you into Thread hierarchy)
class MyThread extends Thread {
    @Override
    public void run() { System.out.println("Extended thread"); }
}

// Thread methods
Thread.currentThread().getName();  // get current thread
Thread.currentThread().isVirtual(); // Java 21
t1.join();            // wait for t1 to finish (blocks calling thread)
t1.join(1000);        // wait at most 1 second
Thread.sleep(500);    // pause current thread (releases no locks)
t1.interrupt();       // request t1 to stop — sets interrupt flag
Thread.currentThread().isInterrupted(); // check flag

// ── synchronized — mutual exclusion + happens-before ──────────────────────
class Counter {
    private int count = 0;

    // synchronized method — lock is the Counter instance
    public synchronized void increment() {
        count++;  // read-modify-write is atomic with lock held
    }

    public synchronized int get() { return count; }

    // synchronized block — finer-grained lock
    private final Object lock = new Object();
    public void decrement() {
        synchronized (lock) {
            count--;
        }
    }
}

// ── volatile — visibility without mutual exclusion ─────────────────────────
class StopFlag {
    private volatile boolean running = true;  // without volatile, other threads may cache old value

    public void stop() { running = false; }

    public void work() {
        while (running) {   // always reads fresh value from main memory
            // do work
        }
    }
}

// ── Deadlock — two threads each holding a lock the other needs ─────────────
// Thread 1: lock A → try lock B
// Thread 2: lock B → try lock A  → deadlock!
// Prevention: always acquire locks in the same global order`,
  points: [
    '`Thread.sleep()` does NOT release any locks — use `Object.wait()` (inside synchronized) when you want to release the lock while waiting',
    '`volatile` guarantees visibility but NOT atomicity. `volatile int count; count++` is still a race (read-modify-write). Use `AtomicInteger` instead.',
    'The `interrupt()` method only sets a flag — it does NOT stop a thread. The thread must check `isInterrupted()` or be in a blocking method (sleep/wait) that throws `InterruptedException`.',
    'Daemon threads (t.setDaemon(true)) are killed when all non-daemon threads finish — use for background tasks (logging, cleanup)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the Java Memory Model and why does it matter?\nA: The JMM defines the rules under which writes by one thread become visible to others. Without synchronization, the compiler and CPU can reorder instructions and cache values locally. The JMM guarantees that synchronized blocks and volatile reads/writes establish happens-before relationships, making state changes visible across threads.',
    },
    {
      type: 'gotcha',
      content: 'Calling t.start() twice on the same Thread throws IllegalThreadStateException. If you need to run the same task again, create a new Thread instance. Thread objects are single-use.',
    },
  ],
}
