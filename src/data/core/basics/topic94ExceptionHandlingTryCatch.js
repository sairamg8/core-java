export default {
  id: 'exception-handling-try-catch',
  title: '94. Exception Handling Using try-catch',
  explanation: `The try-catch block is the primary mechanism for handling exceptions in Java. Code that might throw an exception goes inside the \`try\` block. If an exception occurs, the JVM immediately stops executing the \`try\` block and jumps to the matching \`catch\` block.

Structure:
\`\`\`
try {
    // risky code
} catch (ExceptionType e) {
    // handle exception
} finally {
    // always runs — cleanup code
}
\`\`\`

The \`catch\` clause specifies which exception type(s) to catch. Only catches of the exact type or its supertype match. The \`finally\` block runs whether or not an exception was thrown — it is used for cleanup (closing resources). Since Java 7, the try-with-resources statement automatically closes \`AutoCloseable\` resources.

You can have multiple \`catch\` blocks, ordered from most specific to most general. You can also use multi-catch (Java 7+): \`catch (IOException | SQLException e)\`.`,
  code: `import java.io.*;

public class Demo {
    // Basic try-catch
    static void divide(int a, int b) {
        try {
            int result = a / b;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // try-catch-finally
    static void readFile(String path) {
        FileReader fr = null;
        try {
            fr = new FileReader(path);
            System.out.println("File opened");
            // ... read operations
        } catch (IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        } finally {
            System.out.println("finally: always runs");
            if (fr != null) {
                try { fr.close(); } catch (IOException e) { /* ignore */ }
            }
        }
    }

    // try-with-resources (Java 7+) — auto-closes AutoCloseable
    static void readFileModern(String path) {
        try (FileReader fr = new FileReader(path);
             BufferedReader br = new BufferedReader(fr)) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Error reading: " + e.getMessage());
        }
        // fr and br are automatically closed here
    }

    // Multi-catch (Java 7+)
    static void multiCatch(String[] args) {
        try {
            int num = Integer.parseInt(args[0]);   // NumberFormatException
            int result = 10 / num;                 // ArithmeticException
            System.out.println("Result: " + result);
        } catch (NumberFormatException | ArithmeticException e) {
            System.out.println("Caught: " + e.getClass().getSimpleName()
                + " — " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        divide(10, 2);   // Result: 5
        divide(10, 0);   // Error: / by zero

        readFile("missing.txt");  // IO Error + finally message

        // try-with-resources keeps code clean
        readFileModern("missing.txt"); // Error reading: missing.txt (No such file...)
    }
}`,
  codeTitle: 'try-catch, finally, try-with-resources, multi-catch',
  points: [
    'Code in the try block executes until an exception is thrown; control jumps to the matching catch',
    'If no exception occurs, the catch block is skipped entirely',
    'The finally block runs regardless — even if the catch block throws another exception',
    'try-with-resources (Java 7+) automatically calls close() on AutoCloseable resources in reverse declaration order',
    'Multi-catch (IOException | SQLException e) handles multiple exception types with one block — the reference is effectively final',
    'Catch blocks must be ordered from most specific to most general — catching a supertype first would shadow specific catches and cause a compile error',
    'Rethrowing: you can catch an exception, log it, and throw it again with throw e or wrap it in a new exception',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A return statement inside a try or catch block does NOT prevent the finally block from running. If finally also has a return statement, it OVERRIDES the earlier return — the finally return value is what the method actually returns. This is usually a bug.',
    },
    {
      type: 'interview',
      content: 'Q: What happens if both catch and finally throw an exception?\nA: The finally exception suppresses the catch exception. The original catch exception is lost (unless it is saved as a suppressed exception via Throwable.addSuppressed, which try-with-resources does automatically for close() failures).',
    },
    {
      type: 'tip',
      content: 'Always prefer try-with-resources over manual finally blocks for resource cleanup. It handles the case where both the body AND close() throw exceptions, saving the primary exception and recording the close() exception as suppressed.',
    },
  ],
}
