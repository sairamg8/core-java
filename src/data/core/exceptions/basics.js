export default {
  id: 'exception-basics',
  title: '1. Exception Hierarchy & try/catch/finally',
  explanation: `In Java, all exceptions are objects that inherit from **Throwable**.

**Hierarchy:**
- \`Throwable\`
  - \`Error\` — JVM-level failures you should NOT catch (OutOfMemoryError, StackOverflowError)
  - \`Exception\`
    - \`RuntimeException\` — **Unchecked** — bugs in logic (NullPointerException, ArrayIndexOutOfBoundsException)
    - All others — **Checked** — must be caught or declared (IOException, SQLException)

**Checked** = compiler forces you to handle it (catch or declare \`throws\`).
**Unchecked** = no compile-time requirement — these are programming bugs.`,
  table: {
    headers: ['Type', 'Examples', 'Must handle?'],
    rows: [
      ['Checked', 'IOException, SQLException, ClassNotFoundException', 'Yes — catch or declare throws'],
      ['Unchecked (RuntimeException)', 'NullPointerException, ArrayIndexOutOfBoundsException, ClassCastException', 'No — but should prevent'],
      ['Error', 'OutOfMemoryError, StackOverflowError', 'Do NOT catch'],
    ],
  },
  code: `// Basic try / catch / finally
public class ExceptionDemo {

    public static void main(String[] args) {
        try {
            int result = divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Caught: " + e.getMessage()); // / by zero
        } finally {
            System.out.println("Always runs — even if no exception");
        }

        // Multi-catch (Java 7+) — when handling multiple exceptions the same way
        try {
            String s = null;
            s.length();
        } catch (NullPointerException | ArrayIndexOutOfBoundsException e) {
            System.out.println("Either NPE or AIOOBE: " + e.getClass().getSimpleName());
        }

        // Catching by supertype catches all subtypes
        try {
            riskyMethod();
        } catch (Exception e) {       // catches ALL exceptions (usually too broad)
            e.printStackTrace();      // prints stack trace to stderr
            System.out.println(e.getMessage());
        }

        // Checked exceptions must be declared or caught
        try {
            readFile("test.txt");    // IOException is checked
        } catch (java.io.IOException e) {
            System.out.println("File error: " + e.getMessage());
        }
    }

    static int divide(int a, int b) {
        return a / b;  // throws ArithmeticException (unchecked) if b == 0
    }

    static void riskyMethod() throws Exception {
        throw new Exception("Something went wrong");
    }

    static void readFile(String path) throws java.io.IOException {
        java.io.FileReader fr = new java.io.FileReader(path); // checked IOException
    }
}

// finally block — runs even with return inside try
static int test() {
    try {
        return 1;         // schedules return value
    } finally {
        System.out.println("finally runs before return");
        // return 2;  ← DON'T — this swallows the original return
    }
}`,
  points: [
    'finally always runs — EXCEPT when System.exit() is called or the JVM crashes',
    'catch blocks are evaluated in order — put more specific exceptions BEFORE general ones, or you get a compile error',
    'e.getMessage() returns the exception message; e.getCause() returns the original cause if this was rethrown',
    'Never catch Error — you cannot recover from OutOfMemoryError meaningfully',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between checked and unchecked exceptions?\nA: Checked exceptions (subclasses of Exception but NOT RuntimeException) must be explicitly handled — the compiler enforces it. Unchecked exceptions (RuntimeException and its subclasses) are programming bugs — validate inputs and let them surface. Errors represent JVM failures and should not be caught.',
    },
    {
      type: 'gotcha',
      content: 'If both catch and finally throw exceptions, the original exception from catch is LOST — only the finally exception propagates. This is why you should avoid throwing from finally.',
    },
  ],
}
