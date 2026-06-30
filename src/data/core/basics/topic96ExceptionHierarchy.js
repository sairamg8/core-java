export default {
  id: 'exception-hierarchy',
  title: '96. Exception Hierarchy',
  explanation: `Java's exception system is a class hierarchy rooted at \`java.lang.Throwable\`. Understanding this hierarchy helps you know which exceptions to catch, which to propagate, and how to design your own.

\`\`\`
Throwable
├── Error                          (JVM-level, do NOT catch)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── AssertionError
└── Exception                      (application-level)
    ├── RuntimeException           (unchecked)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── ClassCastException
    │   ├── ArithmeticException
    │   ├── IllegalArgumentException
    │   │   └── NumberFormatException
    │   └── IllegalStateException
    ├── IOException                (checked)
    │   ├── FileNotFoundException
    │   └── EOFException
    ├── SQLException               (checked)
    ├── ClassNotFoundException     (checked)
    └── InterruptedException       (checked)
\`\`\`

**Checked** = compiler enforces handling. Extends Exception but NOT RuntimeException.
**Unchecked** = extends RuntimeException. No compiler enforcement.
**Error** = extends Error. Represents JVM failures — do not catch.`,
  code: `public class Demo {
    // Demonstrating the hierarchy with instanceof
    static void show(Throwable t) {
        System.out.println("--- " + t.getClass().getSimpleName() + " ---");
        System.out.println("Is Throwable: " + (t instanceof Throwable));
        System.out.println("Is Exception: " + (t instanceof Exception));
        System.out.println("Is RuntimeException: " + (t instanceof RuntimeException));
        System.out.println("Is Error: " + (t instanceof Error));
    }

    public static void main(String[] args) {
        show(new NullPointerException());
        // Is Throwable: true, Is Exception: true, Is RuntimeException: true, Is Error: false

        show(new java.io.IOException());
        // Is Throwable: true, Is Exception: true, Is RuntimeException: false, Is Error: false

        show(new OutOfMemoryError());
        // Is Throwable: true, Is Exception: false, Is RuntimeException: false, Is Error: true

        // Catching by parent type catches all subtypes
        try {
            throw new java.io.FileNotFoundException("config.txt not found");
        } catch (java.io.IOException e) {
            // FileNotFoundException IS-A IOException, so this catches it
            System.out.println("Caught as IOException: " + e.getClass().getSimpleName());
        }

        // RuntimeException subtypes
        try {
            String s = null;
            s.length();
        } catch (RuntimeException e) {
            System.out.println("Caught RuntimeException subtype: "
                + e.getClass().getSimpleName());  // NullPointerException
        }

        // Hierarchy matters for catch ordering
        try {
            int[] arr = new int[Integer.MAX_VALUE]; // OutOfMemoryError
        } catch (OutOfMemoryError e) {
            System.out.println("OOM! Free memory and retry or terminate gracefully.");
            // Only catch Error in exceptional situations with a clear recovery plan
        }
    }
}`,
  codeTitle: 'Exception Hierarchy and instanceof Checks',
  points: [
    'Throwable is the root; it has getMessage(), getCause(), and printStackTrace() methods',
    'Error and its subclasses represent JVM-level failures — application code should almost never catch them',
    'Exception is the base for application exceptions; all checked exceptions extend it (not via RuntimeException)',
    'RuntimeException and its subclasses are unchecked — no compile-time enforcement',
    'Catching a parent type catches all subtypes: catching Exception catches all checked and unchecked exceptions',
    'Common unchecked: NullPointerException, ArrayIndexOutOfBoundsException, ClassCastException, ArithmeticException, IllegalArgumentException',
    'Common checked: IOException, SQLException, ClassNotFoundException, InterruptedException',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'NumberFormatException is a subclass of IllegalArgumentException which is a subclass of RuntimeException — it is UNCHECKED. Many beginners think any exception with "Exception" in the name is checked, but the checked/unchecked distinction depends solely on whether it extends RuntimeException.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between throw and throws?\nA: throw is a statement that explicitly throws an exception object: throw new IOException("error"). throws is a declaration in the method signature indicating which checked exceptions callers must handle: public void read() throws IOException. You throw exceptions; you declare throws in method signatures.',
    },
    {
      type: 'tip',
      content: 'When catching an exception, catch the most specific subtype you can handle. Catching Exception or Throwable hides unexpected bugs. A specific catch for IOException handles file errors without accidentally silencing a NullPointerException from a bug in your code.',
    },
  ],
}
