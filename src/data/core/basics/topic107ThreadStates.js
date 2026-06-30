export default {
  id: 'thread-states',
  title: '107. Thread States',
  explanation: `A Java thread can be in one of six states defined in the Thread.State enum. Understanding these states is crucial for debugging thread issues and understanding thread behavior.

1. **NEW** — Thread object created but start() not yet called. The thread does not yet exist in the OS.
2. **RUNNABLE** — Thread is running OR ready to run (waiting for CPU time). In Java, there is no distinction between "running" and "ready-to-run" — both are RUNNABLE.
3. **BLOCKED** — Thread is waiting to acquire a synchronized lock held by another thread.
4. **WAITING** — Thread is indefinitely waiting for another thread to do something specific: notify() after wait(), join() with no timeout, or park().
5. **TIMED_WAITING** — Thread is waiting for a specific amount of time: Thread.sleep(ms), wait(ms), join(ms).
6. **TERMINATED** — Thread has finished execution (run() returned or threw an uncaught exception).

The key transitions:
- NEW → RUNNABLE: start()
- RUNNABLE → BLOCKED: trying to enter a synchronized block that another thread holds
- RUNNABLE → WAITING: Object.wait(), Thread.join(), LockSupport.park()
- RUNNABLE → TIMED_WAITING: Thread.sleep(), Object.wait(ms), Thread.join(ms)
- BLOCKED/WAITING/TIMED_WAITING → RUNNABLE: lock acquired / notified / timeout expired
- RUNNABLE → TERMINATED: run() finishes`,
  code: `public class ThreadStatesDemo {
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        // Demonstrate thread states
        Thread t = new Thread(() -> {
            synchronized (lock) {
                try {
                    lock.wait(3000);  // TIMED_WAITING
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        System.out.println("State after creation: " + t.getState());  // NEW

        t.start();
        Thread.sleep(100);  // give t time to start and enter wait

        System.out.println("State while waiting: " + t.getState());  // TIMED_WAITING

        synchronized (lock) {
            lock.notifyAll();  // wake up t
        }
        Thread.sleep(100);

        System.out.println("State after notify: " + t.getState());  // RUNNABLE or TERMINATED

        t.join();
        System.out.println("State after join: " + t.getState());  // TERMINATED

        // Demonstrate BLOCKED state
        Thread holder = new Thread(() -> {
            synchronized (lock) {
                try { Thread.sleep(2000); } catch (InterruptedException e) {}
            }
        });
        Thread waiter = new Thread(() -> {
            synchronized (lock) {  // will be BLOCKED until holder releases
                System.out.println("Waiter got the lock");
            }
        });

        holder.start();
        Thread.sleep(100);
        waiter.start();
        Thread.sleep(100);

        System.out.println("Holder state: " + holder.getState());  // TIMED_WAITING (sleeping)
        System.out.println("Waiter state: " + waiter.getState());  // BLOCKED

        holder.join();
        waiter.join();
    }
}`,
  codeTitle: 'Thread State Transitions',
  points: [
    'Java defines 6 thread states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED',
    'RUNNABLE covers both "currently running on CPU" and "ready to run, waiting for CPU" — Java makes no distinction',
    'BLOCKED means waiting to acquire a synchronized lock — resolved when the current lock holder releases it',
    'WAITING is indefinite — requires explicit notification (notify/notifyAll) or the join target to finish',
    'TIMED_WAITING is waiting with a timeout — the thread wakes up automatically after the duration',
    'A TERMINATED thread cannot be restarted — create a new Thread instance instead',
    'Use thread.getState() to inspect a thread state programmatically; Thread dumps in tools like jstack show all states',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'BLOCKED and WAITING look similar but are different: BLOCKED waits for a lock (synchronized), WAITING waits for an explicit notification (wait/notify). Both are stuck, but for different reasons.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between BLOCKED and WAITING states?\nA: BLOCKED — thread is trying to enter a synchronized block but another thread holds the lock. WAITING — thread called wait() or join() and is waiting for explicit notification. BLOCKED resolves automatically when the lock is freed; WAITING needs notify().',
    },
    {
      type: 'tip',
      content: 'Use jstack (or VisualVM) in production to dump all thread states. BLOCKED threads that never move indicate a deadlock or lock contention issue.',
    },
  ],
}
