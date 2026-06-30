export default {
  id: 'stack-and-heap',
  title: 'Stack & Heap Memory',
  explanation: `Java manages two distinct memory regions at runtime: the **Stack** and the **Heap**. Understanding this is critical for reasoning about variable scope, object lifetimes, garbage collection, and common bugs like NullPointerException and StackOverflowError.

**Stack Memory** — fast, organized, automatic
- Stores method call frames (local variables, parameters, return address)
- Works like a stack of plates: last in, first out (LIFO)
- Each thread has its OWN stack
- Memory freed automatically when a method returns

**Heap Memory** — large, flexible, garbage-collected
- Stores ALL objects and arrays created with \`new\`
- Shared across all threads (needs synchronization for safe access)
- Managed by the Garbage Collector (GC)
- Instance variables live here, inside their objects

**String Pool** (a special area inside the Heap)
- String literals are interned — \`"Hello"\` is created once and reused
- \`new String("Hello")\` bypasses the pool and always creates a new object`,
  code: `public class MemoryDemo {

    // Instance variable — lives on the HEAP (inside the object)
    int id;

    public MemoryDemo(int id) {
        this.id = id;
    }

    public static int add(int a, int b) {
        // a, b, result are LOCAL → stored on the STACK
        int result = a + b;
        return result;
        // Stack frame for add() is POPPED when this returns
    }

    public static void main(String[] args) {

        // Primitive — stored directly on the STACK
        int x = 10;

        // Object — reference 'obj' on STACK, actual object on HEAP
        MemoryDemo obj = new MemoryDemo(42);
        //                ↑ heap address stored here (on stack)

        int sum = add(x, 5);   // new stack frame pushed for add()

        // After add() returns:
        //   - add's frame is gone (a, b, result freed)
        //   - x, obj, sum are still on main's stack frame

        // String Pool demo
        String s1 = "Hello";    // goes to String Pool
        String s2 = "Hello";    // SAME object reused from pool
        String s3 = new String("Hello");  // new heap object, bypasses pool

        System.out.println(s1 == s2);  // true  — same pool reference
        System.out.println(s1 == s3);  // false — different heap objects
        System.out.println(s1.equals(s3)); // true — same content

        // obj goes out of scope after main() exits
        // GC will eventually collect the MemoryDemo object on the heap
    }

    // DANGER: Infinite recursion → StackOverflowError
    public static void infinite() {
        infinite();  // pushes a new frame on every call — stack exhausted!
    }
}

/* Memory diagram for: MemoryDemo obj = new MemoryDemo(42);
 *
 * STACK                   HEAP
 * ┌──────────────┐        ┌──────────────────┐
 * │ main frame   │        │  MemoryDemo obj  │
 * │  x   = 10   │        │   id = 42        │
 * │  obj = ──────┼───────▶│                  │
 * │  sum = ...  │        └──────────────────┘
 * └──────────────┘
 */`,
  codeTitle: 'MemoryDemo.java',
  points: [
    'Primitives (int, double, boolean…) are stored directly on the stack — fast access, no GC needed.',
    'Objects are ALWAYS on the heap. The variable (reference) that points to them is on the stack.',
    'When a method returns, its entire stack frame is popped — all local variables vanish instantly.',
    'Heap memory is cleaned up by the Garbage Collector when no more references point to an object.',
    'Each thread has its OWN stack (thread-local). The heap is SHARED across all threads — hence concurrency issues.',
    'String Pool lives in the heap (moved from PermGen to heap in Java 8). String literals are interned automatically.',
  ],
  callouts: [
    {
      type: 'analogy',
      content: 'The Stack is like a pile of sticky notes on your desk — you work on the top one, and when done you throw it away (the method returns). The Heap is like a whiteboard — objects are written there and stay until you explicitly erase them (GC) or there are no more sticky notes referencing them.',
    },
    {
      type: 'interview',
      content: 'Q: Where are instance variables stored?\nA: On the HEAP — inside the object. Even if the instance variable is a primitive (int x), it lives in the heap because it is PART of an object. Only LOCAL primitive variables live on the stack. This is a common gotcha: "primitives are always on the stack" is wrong — only LOCAL primitives are.',
    },
    {
      type: 'gotcha',
      content: 'StackOverflowError occurs when the stack runs out of space — almost always caused by infinite recursion (a method calling itself with no base case). It is an Error, not an Exception, and usually means a logic bug, not a resource problem. Check your recursive method\'s base case.',
    },
    {
      type: 'important',
      content: 'NullPointerException happens when you call a method or access a field on a null reference — the variable is on the stack, but it is not pointing to any object on the heap. Always check references for null before using them, or use Optional (Java 8+) to express "might not have a value".',
    },
  ],
}
