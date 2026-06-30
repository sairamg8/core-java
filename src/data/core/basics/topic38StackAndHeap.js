export default {
  id: 'stack-and-heap',
  title: '38. Stack and Heap',
  explanation: `The JVM divides runtime memory into several areas; the two most important for everyday Java are the **stack** and the **heap**.

**Stack (call stack)**
- Stores **stack frames** — one per active method call
- Each frame contains: local variables, method parameters, the return address, and intermediate results
- LIFO: the frame for the most recent method call is on top
- Automatically managed: pushed when a method is called, popped when it returns
- **Thread-local:** each thread has its own stack
- Fixed-size (typically 512KB–1MB); overflow = \`StackOverflowError\` (infinite recursion)

**Heap**
- Stores **all objects and arrays** created with \`new\`
- Shared across all threads
- Dynamically sized, managed by the **garbage collector**
- Slower than the stack (dynamic allocation, GC overhead)
- Overflow = \`OutOfMemoryError\`

**What lives where:**
| Item | Location |
|------|----------|
| \`int x = 5;\` (local) | Stack |
| \`new Dog()\` | Heap |
| \`Dog d = ...\` (the reference) | Stack |
| static variables | Method area (part of non-heap) |
| String literals | String Pool (heap) |

**Method Area (Metaspace since Java 8)**
Stores class definitions, static variables, and constant pool. Separate from heap.`,
  code: `public class StackAndHeap {
    static int counter = 0; // static — lives in method area (Metaspace)

    // Each call gets its own stack frame with its own 'n'
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1); // recursive: each call pushes a frame
    }

    public static void main(String[] args) {
        // 'x' is on the stack (local primitive)
        int x = 10;

        // The Dog object is on the heap; 'd' (the reference) is on the stack
        Dog d = new Dog();
        d.name = "Rex";  // the String "Rex" is on the heap (String pool)

        System.out.println(factorial(5)); // 120

        // After factorial returns, all its stack frames are gone
        // 'd' goes out of scope here — eventually GC'd

        // StackOverflowError example (don't run this):
        // infinite();  // static void infinite() { infinite(); }
    }
}

class Dog {
    String name; // field lives on the heap (part of the Dog object)
}
// Memory at peak of factorial(5):
// Stack (top to bottom):
//   factorial(1) frame: n=1
//   factorial(2) frame: n=2
//   factorial(3) frame: n=3
//   factorial(4) frame: n=4
//   factorial(5) frame: n=5
//   main() frame: x=10, d=<ref to heap>
// Heap: Dog object { name="Rex" }`,
  codeTitle: 'Stack Frames and Heap Objects',
  points: [
    'Stack stores primitives and references (addresses); heap stores the actual objects — confusing them is a common interview mistake',
    'Stack memory is extremely fast (just a pointer increment) but limited; heap is larger but requires GC',
    'Each thread has its own stack; the heap is shared by all threads — making heap access thread-safety critical',
    'StackOverflowError means too many recursive calls; OutOfMemoryError means heap exhaustion',
    'Object references on the stack point into the heap — when the reference goes out of scope, the object becomes eligible for GC',
    'String literals are stored in the String Pool on the heap and reused — "hello" == "hello" is true for literals but not for new String("hello")',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Local variable references are on the stack, but the objects they point to are on the heap. When you say "int x = 5 is on the stack", that is correct. When you say "String s = "hello" is on the stack" — only s (the reference) is; the String object is on the heap (String Pool).',
    },
    {
      type: 'tip',
      content: 'Think of the stack as a notepad you carry while solving a problem — local, fast, and temporary. The heap is a shared whiteboard — persistent, bigger, but needs cleanup (GC).',
    },
    {
      type: 'interview',
      content: 'Q: Where are instance variables stored?\nA: Instance variables are stored on the heap, inside the object they belong to. Only local variables and references (not the objects they point to) are on the stack.',
    },
  ],
}
