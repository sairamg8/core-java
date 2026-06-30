export default {
  id: 'runnable-vs-thread',
  title: '105. Runnable vs Thread',
  explanation: `There are two primary ways to define a task for a thread in Java:

1. **Extending Thread** — Create a subclass of Thread and override its run() method.
2. **Implementing Runnable** — Implement the Runnable functional interface (void run()), then pass it to a Thread constructor.

**Why Runnable is preferred:**
- Java supports single inheritance only. If you extend Thread, your class cannot extend any other class. Implementing Runnable keeps your inheritance hierarchy free.
- Runnable separates the task (what to do) from the thread (how to run it). This is better design.
- Runnable works naturally with ExecutorService — you can submit the same Runnable to a thread pool without modification.
- With Java 8, Runnable is a functional interface, so you can use lambda expressions.

There is also **Callable<T>**, which is like Runnable but can return a value and throw checked exceptions. It works with ExecutorService.submit() which returns a Future<T>.

The rule: use Runnable (or Callable) for tasks, and let Thread or ExecutorService handle the execution.`,
  code: `import java.util.concurrent.*;

// Option 1: Extending Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Running via Thread subclass: " + getName());
    }
}

// Option 2: Implementing Runnable
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Running via Runnable: " + Thread.currentThread().getName());
    }
}

public class RunnableVsThreadDemo {
    public static void main(String[] args) throws Exception {
        // Thread subclass
        MyThread t1 = new MyThread();
        t1.setName("Thread-Subclass");
        t1.start();

        // Runnable implementation
        Thread t2 = new Thread(new MyRunnable(), "Thread-Runnable");
        t2.start();

        // Runnable as lambda (Java 8+)
        Thread t3 = new Thread(() -> {
            System.out.println("Lambda Runnable: " + Thread.currentThread().getName());
        }, "Thread-Lambda");
        t3.start();

        // Callable — returns a value, throws checked exceptions
        Callable<Integer> callable = () -> {
            System.out.println("Callable running");
            return 42;
        };
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<Integer> future = executor.submit(callable);
        System.out.println("Callable result: " + future.get());  // blocks until done
        executor.shutdown();
    }
}`,
  codeTitle: 'Runnable vs Thread vs Callable',
  points: [
    'Extending Thread ties your class to the thread lifecycle — it cannot extend anything else (single inheritance)',
    'Implementing Runnable separates the task from the thread mechanism — preferred approach',
    'Runnable is a functional interface: () -> { ... } works as a Runnable with Java 8+ lambdas',
    'Callable<T> is like Runnable but returns a value and can throw checked exceptions',
    'Callable works with ExecutorService.submit(), returning a Future<T> to retrieve the result later',
    'Runnable/Callable can be reused or submitted to different executors — Thread subclasses cannot be restarted',
    'For production code, prefer ExecutorService over raw Thread objects',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A Thread cannot be restarted after it finishes — calling start() again throws IllegalThreadStateException. Create a new Thread with the same Runnable if needed.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Runnable and Callable?\nA: Runnable.run() returns void and cannot throw checked exceptions. Callable.call() returns a generic result T and can throw checked exceptions. Callable is used with ExecutorService.submit().',
    },
    {
      type: 'tip',
      content: 'Use Runnable for fire-and-forget tasks. Use Callable when you need the result of the computation. Both work seamlessly with ExecutorService.',
    },
  ],
}
