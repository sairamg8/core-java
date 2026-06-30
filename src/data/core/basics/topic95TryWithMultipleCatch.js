export default {
  id: 'try-with-multiple-catch',
  title: '95. try with Multiple catch Blocks',
  explanation: `A single try block can be followed by multiple catch blocks to handle different types of exceptions in different ways. When an exception is thrown, Java evaluates catch blocks from top to bottom and executes the FIRST block whose exception type matches.

This ordering is critical: if you put a more general exception type (like \`Exception\`) before a specific one (like \`IOException\`), the specific catch can never be reached and the compiler will give you an "exception already caught" error.

Multiple catch blocks serve to:
- Handle each exception type with a tailored recovery strategy
- Log different messages for different failure modes
- Wrap exceptions in domain-specific exceptions before rethrowing

Java 7 also introduced **multi-catch** syntax: \`catch (IOException | SQLException e)\` — handling two or more unrelated exception types in the same block. The variable \`e\` in a multi-catch is effectively final.`,
  code: `import java.io.*;
import java.sql.*;

public class Demo {
    // Multiple catch blocks — ordered specific to general
    static void process(String[] args) {
        try {
            int index = Integer.parseInt(args[0]);             // may throw NumberFormatException
            String[] data = {"Java", "Python", "Go"};
            String lang = data[index];                          // may throw ArrayIndexOutOfBoundsException
            System.out.println("Language: " + lang);
        } catch (NumberFormatException e) {
            System.out.println("Not a number: " + e.getMessage());
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Index out of range: " + e.getMessage());
        } catch (Exception e) {
            // Catches anything else — must be LAST
            System.out.println("Unexpected error: " + e.getMessage());
        }
    }

    // Multi-catch (Java 7+)
    static void multiCatchDemo(String input, boolean useDb) {
        try {
            if (!useDb) {
                new FileReader(input);        // IOException
            } else {
                DriverManager.getConnection(input);  // SQLException
            }
        } catch (IOException | SQLException e) {
            // both handled the same way
            System.out.println("Resource error: " + e.getClass().getSimpleName()
                + " — " + e.getMessage());
        }
    }

    // Catching, logging, and rethrowing
    static void loadConfig(String path) throws IOException {
        try {
            new FileReader(path);
            System.out.println("Config loaded from " + path);
        } catch (FileNotFoundException e) {
            System.out.println("Config missing, using defaults");
            throw new IOException("Config file not found: " + path, e); // wrap & rethrow
        }
    }

    public static void main(String[] args) {
        process(new String[]{"abc"});    // Not a number: For input string: "abc"
        process(new String[]{"10"});     // Index out of range: Index 10 out of bounds
        process(new String[]{"1"});      // Language: Python

        multiCatchDemo("missing.txt", false);  // Resource error: FileNotFoundException

        try {
            loadConfig("app.properties");
        } catch (IOException e) {
            System.out.println("Wrapped: " + e.getMessage());
            System.out.println("Cause: " + e.getCause().getClass().getSimpleName());
        }
    }
}`,
  codeTitle: 'Multiple catch Blocks and Multi-catch Syntax',
  points: [
    'Java evaluates catch blocks top-to-bottom and executes the first matching one; remaining catches are skipped',
    'More specific exception types must come before more general ones — reverse order causes a compile error',
    'catch (Exception e) at the end acts as a safety net for unexpected exceptions',
    'Multi-catch catch (A | B e) handles multiple unrelated types in one block — the variable is effectively final',
    'In multi-catch, you cannot use types that have an inheritance relationship (compile error)',
    'Catch-and-rethrow: catch an exception, log it, then throw the same or a wrapped exception',
    'Exception chaining: new IOException("context", originalException) preserves the root cause accessible via getCause()',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Catching Exception or Throwable as the only catch block is an anti-pattern — you silently swallow errors you did not anticipate (like OutOfMemoryError). Always catch the most specific type you can handle.',
    },
    {
      type: 'interview',
      content: 'Q: In a multi-catch clause, why is the exception variable effectively final?\nA: Because the variable e could reference an instance of either exception type. If you were allowed to reassign it (e = new IOException()), the type system would be violated. Making it effectively final prevents this ambiguity.',
    },
    {
      type: 'tip',
      content: 'When rethrowing, preserve the original cause: throw new MyException("context", originalException). This enables stack-trace analysis tools and logging frameworks to trace the root cause across exception chains.',
    },
  ],
}
