export default {
  id: 'throw-keyword',
  title: '97. throw Keyword in Exception Handling',
  explanation: `The \`throw\` keyword is used to explicitly throw an exception from your code. Unlike exceptions thrown automatically by the JVM (NullPointerException, ArrayIndexOutOfBoundsException, etc.), \`throw\` gives you control — you decide when an error condition has occurred and create an appropriate exception to signal it.

Syntax: \`throw new ExceptionType("message");\`

You can throw any \`Throwable\` instance. Most commonly you throw \`RuntimeException\` subclasses (for programming errors) or custom exceptions. After a \`throw\`, execution immediately leaves the current method and propagates to the caller's catch block, just like a JVM-generated exception.

Use cases for \`throw\`:
- **Validation** — reject invalid method arguments (\`throw new IllegalArgumentException\`)
- **Unsupported operations** — signal unimplemented code (\`throw new UnsupportedOperationException\`)
- **Rethrowing** — catch an exception, add context, throw it again
- **Domain errors** — signal business-level failures with custom exceptions

\`throw\` is a statement (not an expression), so code after it in the same block is unreachable.`,
  code: `public class Demo {
    // Validation with throw
    static void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Invalid age: " + age
                + ". Must be between 0 and 150.");
        }
        System.out.println("Age set to: " + age);
    }

    // Throwing checked exception
    static void findUser(int id) throws Exception {
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be positive, got: " + id);
        }
        if (id == 999) {
            throw new Exception("User not found for ID: " + id);
        }
        System.out.println("Found user: " + id);
    }

    // Rethrowing with context
    static void loadConfig(String path) {
        try {
            new java.io.FileReader(path);
        } catch (java.io.IOException e) {
            // Add context and rethrow as unchecked
            throw new RuntimeException("Failed to load config from: " + path, e);
        }
    }

    // Throw in the middle of code — unreachable code after
    static int divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Divisor cannot be zero");
            // System.out.println("this is unreachable"); // compile error
        }
        return a / b;
    }

    public static void main(String[] args) {
        try {
            setAge(25);   // Age set to: 25
            setAge(-5);   // throws IllegalArgumentException
        } catch (IllegalArgumentException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        try {
            findUser(1);    // Found user: 1
            findUser(999);  // throws Exception
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            loadConfig("missing.json");  // throws RuntimeException wrapping IOException
        } catch (RuntimeException e) {
            System.out.println("Config error: " + e.getMessage());
            System.out.println("Root cause: " + e.getCause().getClass().getSimpleName());
        }

        System.out.println("10 / 2 = " + divide(10, 2)); // 5
    }
}`,
  codeTitle: 'throw Keyword: Validation, Rethrowing, Domain Errors',
  points: [
    'throw explicitly throws an exception object: throw new IllegalArgumentException("msg")',
    'After throw, execution leaves the current method immediately — no code after it in the same block runs',
    'Any Throwable subclass can be thrown, but throwing Error subclasses from application code is bad practice',
    'Throwing a checked exception requires the method to declare it with throws in its signature',
    'Throwing unchecked (RuntimeException subclasses) does not require a throws declaration',
    'throw is used for validation, business-rule violations, unsupported operations, and rethrowing',
    'When rethrowing with context, pass the original exception as the cause: throw new RuntimeException("context", e)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You must throw an instance, not a class: throw new IOException() is correct; throw IOException is a compile error. You can also throw a previously caught exception variable: catch(IOException e) { ... throw e; }',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between throw and throws?\nA: throw is a statement inside a method body that throws an exception object at runtime. throws is a keyword in a method declaration that advertises to callers that this method may throw a checked exception: public void read(String f) throws IOException { ... }. throw causes the exception; throws declares the possibility.',
    },
    {
      type: 'tip',
      content: 'Use throw new IllegalArgumentException for invalid method arguments, throw new IllegalStateException for invalid object state, and throw new UnsupportedOperationException for unimplemented stub methods. These standard exceptions communicate intent clearly without requiring custom exception classes.',
    },
  ],
}
