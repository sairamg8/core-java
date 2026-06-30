export default {
  id: 'thread-priority-and-sleep',
  title: '104. Thread Priority and Sleep',
  explanation: `Every Java thread has a priority between 1 (MIN_PRIORITY) and 10 (MAX_PRIORITY), with the default being 5 (NORM_PRIORITY). The thread scheduler uses priority as a hint — higher-priority threads are more likely to be scheduled first, but this is NOT guaranteed. The actual behavior depends on the underlying OS scheduler.

Thread.sleep(milliseconds) pauses the current thread for at least the specified duration. It is a static method — it always affects the currently executing thread, never another thread. Sleep releases the CPU so other threads can run, but it does NOT release any locks the thread holds.

Key points about Thread.sleep():
- It throws InterruptedException — you must handle it.
- The sleep duration is a minimum, not a maximum. The OS may wake up the thread slightly later.
- Calling sleep() on a thread object like t.sleep() is misleading — it still sleeps the CURRENT thread. Always call Thread.sleep().

Thread.yield() is a hint to the scheduler to give other threads of equal or higher priority a chance to run. It is rarely needed in practice and is platform-dependent.`,
  code: `public class ThreadPriorityAndSleepDemo {
    public static void main(String[] args) throws InterruptedException {
        // Thread priority
        Thread lowPriority = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("LOW priority: " + i);
            }
        });
        Thread highPriority = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("HIGH priority: " + i);
            }
        });

        lowPriority.setPriority(Thread.MIN_PRIORITY);   // 1
        highPriority.setPriority(Thread.MAX_PRIORITY);  // 10

        lowPriority.start();
        highPriority.start();
        // High priority MIGHT run first, but no guarantee

        // Thread.sleep() — pauses current thread
        System.out.println("Sleeping for 1 second...");
        Thread.sleep(1000);  // 1000ms = 1 second
        System.out.println("Awake!");

        // Handling InterruptedException properly
        Thread sleeper = new Thread(() -> {
            try {
                System.out.println("Going to sleep for 5 seconds...");
                Thread.sleep(5000);
                System.out.println("Woke up naturally");
            } catch (InterruptedException e) {
                System.out.println("Sleep interrupted!");
                Thread.currentThread().interrupt();  // restore interrupt status
            }
        });
        sleeper.start();
        Thread.sleep(500);
        sleeper.interrupt();  // wake sleeper up early

        // yield() — hint to scheduler
        Thread t = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Running: " + i);
                Thread.yield();  // give others a chance
            }
        });
        t.start();
    }
}`,
  codeTitle: 'Thread Priority and Sleep',
  points: [
    'Thread priority ranges from 1 (MIN) to 10 (MAX), default is 5 (NORM) — use constants Thread.MIN_PRIORITY, NORM_PRIORITY, MAX_PRIORITY',
    'Priority is a hint to the scheduler, not a guarantee — never rely on it for correctness',
    'Thread.sleep(ms) pauses the current thread; it does NOT release any synchronized locks',
    'sleep() throws InterruptedException — always handle it and consider restoring the interrupt flag',
    'Sleep duration is a minimum — the actual sleep may be longer depending on OS scheduling granularity',
    'Thread.yield() hints to give up CPU to equal/higher-priority threads — rarely needed',
    'Always call Thread.sleep() as a static method, not on a thread object reference — it still sleeps the current thread',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Thread.sleep() does NOT release synchronized locks. If your sleeping thread holds a lock, other threads waiting on that lock will be blocked for the entire sleep duration.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between sleep() and wait()?\nA: sleep() pauses the thread for a fixed time without releasing locks. wait() releases the lock and waits until notified by another thread — it is used for thread communication.',
    },
    {
      type: 'tip',
      content: 'When catching InterruptedException, always call Thread.currentThread().interrupt() to restore the interrupt flag. Swallowing the exception breaks the interrupt mechanism for callers.',
    },
  ],
}
