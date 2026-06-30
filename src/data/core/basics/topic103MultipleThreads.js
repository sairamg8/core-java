export default {
  id: 'multiple-threads',
  title: '103. Multiple Threads',
  explanation: `Running multiple threads simultaneously allows a program to perform concurrent tasks, improving performance and responsiveness. Java makes creating multiple threads straightforward, but you must be aware that the order of execution is not guaranteed — the thread scheduler decides which thread runs at any point.

When multiple threads run concurrently and access shared data, you enter the territory of thread safety. Without coordination, threads can interleave in unexpected ways, reading stale or inconsistent data.

Common patterns for multiple threads:
1. **Launch and forget:** Start multiple threads and don't wait for them.
2. **Join:** Call thread.join() to wait for a specific thread to finish before continuing.
3. **Thread pools (ExecutorService):** Reuse a fixed set of threads rather than creating new ones for every task — much more efficient at scale.

Thread.join() blocks the calling thread until the target thread dies. This is how you synchronize completion across threads.

Running N threads does NOT mean N times the speed — there is overhead in context switching, and if threads share resources, they will wait for each other (synchronization overhead).`,
  code: `public class MultipleThreadsDemo {
    public static void main(String[] args) throws InterruptedException {
        // Launch 5 threads doing different work
        Thread[] threads = new Thread[5];

        for (int i = 0; i < 5; i++) {
            final int taskId = i;
            threads[i] = new Thread(() -> {
                System.out.println("Task " + taskId + " running on " + Thread.currentThread().getName());
                try {
                    Thread.sleep(100);  // simulate work
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Task " + taskId + " done");
            }, "Worker-" + i);
        }

        // Start all threads
        for (Thread t : threads) t.start();

        // Wait for ALL threads to finish before printing summary
        for (Thread t : threads) t.join();

        System.out.println("All tasks completed");
    }
}

// Shared counter WITHOUT synchronization — demonstrates the problem
class UnsafeCounter {
    static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) count++; });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) count++; });

        t1.start(); t2.start();
        t1.join();  t2.join();

        // Expected: 2000 — Actual: often less due to race condition
        System.out.println("Count: " + count);
    }
}`,
  codeTitle: 'Multiple Threads and join()',
  points: [
    'You can create and start as many threads as you like; the OS schedules them across available CPU cores',
    'Thread execution order is non-deterministic — never assume one thread finishes before another',
    'thread.join() blocks the caller until that thread completes — use it to wait for results',
    'Shared mutable state accessed by multiple threads without synchronization causes race conditions',
    'Creating a new Thread per task is wasteful at scale — use ExecutorService with a thread pool instead',
    'The number of threads you should run in parallel is typically bounded by CPU cores for CPU-bound work',
    'For I/O-bound work (network, disk), you can run many more threads since they spend most time waiting',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Calling join() on a thread that has not been started yet throws IllegalThreadStateException.',
    },
    {
      type: 'interview',
      content: 'Q: What happens if two threads increment a shared int counter simultaneously?\nA: A race condition — the increment (read-modify-write) is not atomic. You can lose updates. Use AtomicInteger or synchronized to fix it.',
    },
    {
      type: 'tip',
      content: 'join(long millis) lets you wait at most that many milliseconds — useful when you want to timeout waiting for a slow thread.',
    },
  ],
}
