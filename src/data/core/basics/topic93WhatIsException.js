export default {
  id: 'what-is-exception',
  title: '93. What Is an Exception?',
  explanation: `An exception is an event that disrupts the normal flow of a program during execution. When Java detects an error condition (division by zero, null dereference, file not found), it creates an exception object containing information about the error and "throws" it. If not caught, the exception propagates up the call stack and eventually terminates the program with an error message and stack trace.

Exceptions are represented as objects in Java. The base class is \`java.lang.Throwable\`, which has two main subclasses:
- **Error** — Represents serious JVM-level problems (OutOfMemoryError, StackOverflowError). You should NOT try to catch these in application code.
- **Exception** — Represents conditions a program should handle.

Exceptions further divide into:
- **Checked Exceptions** (extends Exception but not RuntimeException) — the compiler forces you to declare or handle them. Example: \`IOException\`, \`SQLException\`.
- **Unchecked Exceptions** (extends RuntimeException) — the compiler does not force handling. Example: \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`IllegalArgumentException\`.

The distinction matters for API design and for understanding compiler error messages.`,
  code: `public class Demo {
    public static void main(String[] args) {
        // Unchecked exception — occurs at runtime
        int[] arr = {1, 2, 3};
        try {
            System.out.println(arr[5]);  // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        // Another unchecked: NullPointerException
        try {
            String s = null;
            System.out.println(s.length());  // NullPointerException
        } catch (NullPointerException e) {
            System.out.println("Null reference caught");
        }

        // Arithmetic exception
        try {
            int result = 10 / 0;  // ArithmeticException: / by zero
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero: " + e.getMessage());
        }

        // Checked exception — must be handled or declared
        try {
            java.io.FileReader fr = new java.io.FileReader("missing.txt"); // IOException
        } catch (java.io.IOException e) {
            System.out.println("File not found: " + e.getMessage());
        }

        // Exception object info
        try {
            throw new IllegalArgumentException("Age must be positive");
        } catch (IllegalArgumentException e) {
            System.out.println("Type: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());
            // e.printStackTrace(); -- prints full stack trace
        }

        System.out.println("Program continues after handled exceptions");
    }
}`,
  codeTitle: 'Understanding Exceptions in Java',
  points: [
    'An exception is an object thrown by the JVM or code to signal that something went wrong',
    'Throwable is the root; Error and Exception are its two direct subclasses',
    'Checked exceptions must be declared in the method signature (throws) or caught with try-catch',
    'Unchecked exceptions (RuntimeException and subclasses) do not require explicit handling',
    'Every exception has a message, a cause (for chained exceptions), and a stack trace',
    'When an exception is not caught, the JVM prints the stack trace and terminates the thread',
    'Handling exceptions allows the program to recover and continue rather than crash',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Error is NOT the same as Exception. OutOfMemoryError and StackOverflowError are Errors — not Exceptions. Catching Throwable or Error is almost never appropriate in application code; only specialized monitoring tools do this.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between checked and unchecked exceptions?\nA: Checked exceptions are verified at compile time — the compiler forces you to handle or declare them. They represent recoverable conditions (file not found, network error). Unchecked exceptions (RuntimeException subclasses) are not checked at compile time — they represent programming bugs (null pointer, bad index) that should be fixed rather than caught.',
    },
    {
      type: 'tip',
      content: 'Prefer unchecked (RuntimeException) exceptions for programming errors and checked exceptions for recoverable conditions where the caller can reasonably respond (retry, use a default, show an error message). Checked exceptions should represent expected, recoverable failure modes.',
    },
  ],
}
