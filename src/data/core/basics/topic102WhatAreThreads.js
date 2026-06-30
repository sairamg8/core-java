export default {
  id: 'what-are-threads',
  title: '102. What Are Threads?',
  explanation: `A thread is the smallest unit of execution within a process. Every Java program starts with at least one thread — the main thread — which executes the main() method. A thread has its own call stack (for local variables and method frames) but shares the process heap with all other threads in the same JVM.

Multithreading means running multiple threads concurrently within a single process. This allows a program to do several things at once: one thread downloads data while another updates the UI, for example. Modern CPUs are multi-core, so threads can truly run in parallel (not just interleaved).

Key concepts:
- **Process vs Thread:** A process is an independent program with its own memory. Threads share memory within a process. Creating a thread is much cheaper than creating a process.
- **Concurrency vs Parallelism:** Concurrency is about dealing with many tasks at once (even on a single core by time-slicing). Parallelism is physically executing multiple tasks simultaneously on multiple cores.
- **Thread Scheduler:** The JVM (and the OS) decide which thread runs when. You cannot predict the exact order threads execute.
- **Daemon threads:** Background threads (like GC) that the JVM kills automatically when all non-daemon threads finish.

In Java, you create a thread by extending the Thread class or implementing the Runnable interface.`,
  code: `public class WhatAreThreadsDemo {
    public static void main(String[] args) {
        // The current thread — always starts as the main thread
        Thread mainThread = Thread.currentThread();
        System.out.println("Current thread: " + mainThread.getName());  // main
        System.out.println("Thread ID: " + mainThread.getId());
        System.out.println("Is daemon: " + mainThread.isDaemon());      // false

        // Creating a thread by extending Thread
        Thread t1 = new Thread() {
            @Override
            public void run() {
                System.out.println("Thread t1 running: " + Thread.currentThread().getName());
            }
        };
        t1.setName("MyThread-1");
        t1.start();  // start() creates a new call stack and calls run()

        // Creating a thread with Runnable (preferred)
        Runnable task = () -> System.out.println("Runnable thread: " + Thread.currentThread().getName());
        Thread t2 = new Thread(task, "MyThread-2");
        t2.start();

        System.out.println("Back in main thread");
        // Output order is unpredictable — scheduler decides
    }
}

// Daemon thread example
class DaemonDemo {
    public static void main(String[] args) {
        Thread daemon = new Thread(() -> {
            while (true) {
                System.out.println("Daemon running...");
                try { Thread.sleep(500); } catch (InterruptedException e) { break; }
            }
        });
        daemon.setDaemon(true);  // must call before start()
        daemon.start();

        System.out.println("Main ends — daemon will be killed");
        // When main thread finishes, JVM exits and daemon is stopped
    }
}`,
  codeTitle: 'Thread Basics',
  points: [
    'A thread is the smallest unit of execution; every Java program has at least one — the main thread',
    'Threads share heap memory but each has its own call stack',
    'start() creates a new thread; calling run() directly just executes it on the current thread',
    'Thread order is non-deterministic — the OS/JVM scheduler decides what runs when',
    'Daemon threads are killed automatically when all user (non-daemon) threads finish',
    'Extending Thread vs implementing Runnable: Runnable is preferred because Java supports single inheritance only',
    'Thread.currentThread() returns a reference to the executing thread',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never call run() directly — that does NOT start a new thread; it runs the code on the calling thread synchronously.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a process and a thread?\nA: A process is an independent program with isolated memory. Threads share the same heap within a process but have separate stacks. Thread creation is much cheaper than process creation.',
    },
    {
      type: 'tip',
      content: 'Prefer Runnable or Callable over extending Thread — it keeps your task logic separate from thread management and works naturally with ExecutorService.',
    },
  ],
}
