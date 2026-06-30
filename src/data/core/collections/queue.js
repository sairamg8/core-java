export default {
  id: 'queue-deque',
  title: '5. Queue & Deque — PriorityQueue, ArrayDeque',
  explanation: `Queue models FIFO processing. Deque (Double-Ended Queue) supports adding/removing from both ends.

**Queue interface key methods:**
- \`offer(e)\` / \`add(e)\` — insert (offer returns false on failure; add throws exception)
- \`poll()\` / \`remove()\` — remove head (poll returns null; remove throws if empty)
- \`peek()\` / \`element()\` — view head without removing

**PriorityQueue** — min-heap by default. Elements are dequeued in natural or comparator order (NOT insertion order).
**ArrayDeque** — resizable array. Preferred over Stack and LinkedList for stack/queue usage.`,
  table: {
    headers: ['Operation', 'Throws on fail', 'Returns null/false on fail'],
    rows: [
      ['Insert', 'add(e)', 'offer(e)'],
      ['Remove head', 'remove()', 'poll()'],
      ['Peek head', 'element()', 'peek()'],
      ['Insert at front (Deque)', 'addFirst(e)', 'offerFirst(e)'],
      ['Insert at back (Deque)', 'addLast(e)', 'offerLast(e)'],
    ],
  },
  code: `import java.util.*;

// PriorityQueue — natural min order
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
System.out.println(pq.peek());   // 1 (minimum)
System.out.println(pq.poll());   // 1 — removes minimum
System.out.println(pq.poll());   // 3
// NOTE: iterating PriorityQueue does NOT give sorted order
// poll() gives sorted order

// Max-heap via reverse comparator
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());
maxPQ.offer(5); maxPQ.offer(1); maxPQ.offer(3);
maxPQ.poll();  // 5 (maximum first)

// PriorityQueue with custom objects
record Task(String name, int priority) {}
PriorityQueue<Task> tasks = new PriorityQueue<>(Comparator.comparingInt(Task::priority));
tasks.offer(new Task("Low", 3));
tasks.offer(new Task("Critical", 1));
tasks.offer(new Task("Medium", 2));
tasks.poll().name();  // "Critical" (priority=1)

// ArrayDeque — preferred stack/queue implementation
ArrayDeque<String> deque = new ArrayDeque<>();

// Used as QUEUE (FIFO)
deque.offerLast("a");   // add to tail
deque.offerLast("b");
deque.pollFirst();      // remove from head → "a"

// Used as STACK (LIFO)
deque.push("x");        // push = addFirst
deque.push("y");
deque.pop();            // pop  = removeFirst → "y"

// Stack class (legacy, avoid) — use ArrayDeque instead
// Stack<String> stack = new Stack<>();  ← synchronized, legacy

// ArrayDeque as both ends
deque.offerFirst("front");
deque.offerLast("back");
deque.peekFirst();   // see front
deque.peekLast();    // see back
deque.pollFirst();   // remove front
deque.pollLast();    // remove back`,
  points: [
    'PriorityQueue does NOT allow null elements — comparisons would throw NullPointerException',
    'ArrayDeque is faster than LinkedList for queue/stack use cases — no node object allocation',
    'The legacy Stack class extends Vector (synchronized) — ArrayDeque is the modern replacement',
    'PriorityQueue iteration order is heap order (NOT sorted). Use while(!pq.isEmpty()) pq.poll() for sorted output',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between poll() and remove() in Queue?\nA: Both remove and return the head element. remove() throws NoSuchElementException if the queue is empty. poll() returns null. Prefer poll() in production code to avoid unchecked exceptions.',
    },
    {
      type: 'gotcha',
      content: 'PriorityQueue.iterator() does NOT iterate in priority order — it iterates the internal heap array. To drain in order: while(!pq.isEmpty()) { process(pq.poll()); }',
    },
  ],
}
