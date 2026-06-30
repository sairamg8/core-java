export default {
  id: 'exception-advanced',
  title: '2. try-with-resources, Custom Exceptions & Best Practices',
  explanation: `**try-with-resources** (Java 7+) automatically closes any \`AutoCloseable\` resource when the try block exits — no finally needed.

**Custom exceptions** let you carry domain-specific error information. Extend \`RuntimeException\` for unchecked, \`Exception\` for checked.`,
  code: `import java.io.*;

// try-with-resources — resource MUST implement AutoCloseable
// Replaces the old try/catch/finally close() pattern
public class ResourceDemo {

    // OLD way — verbose and error-prone
    static void oldWay(String path) throws IOException {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(path));
            System.out.println(br.readLine());
        } finally {
            if (br != null) br.close();  // can itself throw IOException!
        }
    }

    // NEW way — clean, always closes even if exception thrown
    static void newWay(String path) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            System.out.println(br.readLine());
        }  // br.close() called automatically here
    }

    // Multiple resources — closed in REVERSE declaration order
    static void multiResource() throws IOException {
        try (
            InputStream in  = new FileInputStream("input.txt");
            OutputStream out = new FileOutputStream("output.txt")
        ) {
            out.write(in.read());
        }  // out.close() first, then in.close()
    }
}

// Custom exceptions
class InsufficientFundsException extends RuntimeException { // unchecked
    private final double amount;
    private final double balance;

    public InsufficientFundsException(double amount, double balance) {
        super(String.format("Cannot withdraw %.2f — balance is %.2f", amount, balance));
        this.amount = amount;
        this.balance = balance;
    }

    public double getShortfall() { return amount - balance; }
}

class BankAccount {
    private double balance;

    public void withdraw(double amount) {
        if (amount > balance) {
            throw new InsufficientFundsException(amount, balance);
        }
        balance -= amount;
    }
}

// Exception chaining — preserve original cause when rethrowing
static void processFile(String path) throws AppException {
    try {
        readFile(path);
    } catch (IOException e) {
        throw new AppException("Failed to process " + path, e); // wraps original
    }
}
// catch (AppException e) { e.getCause() } → original IOException

// Best practices
class BestPractices {
    // ✅ Catch specific, not broad
    void good() {
        try { riskyOp(); }
        catch (FileNotFoundException e) { /* handle specifically */ }
    }

    // ❌ Don't swallow exceptions silently
    void bad() {
        try { riskyOp(); }
        catch (Exception e) { } // silent swallow — bugs become invisible
    }

    // ✅ Log and rethrow, or handle
    void better() {
        try { riskyOp(); }
        catch (IOException e) {
            System.err.println("IO error: " + e.getMessage());
            throw new RuntimeException("Wrapped", e);
        }
    }

    static void riskyOp() throws IOException {}
    static void readFile(String p) throws IOException {}
}
class AppException extends Exception {
    AppException(String msg, Throwable cause) { super(msg, cause); }
}`,
  points: [
    'try-with-resources works with any class implementing AutoCloseable (Closeable is a subinterface)',
    'If both the try body and close() throw, the close() exception is "suppressed" — accessible via e.getSuppressed()',
    'Extend RuntimeException for domain exceptions (user/validation errors) — avoids forcing callers to catch everywhere',
    'Always include a cause (the original exception) when wrapping: throw new AppException("msg", originalException)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What happens if an exception is thrown in both the try block and the finally block?\nA: The finally block\'s exception propagates and the original exception is lost. With try-with-resources, the resource\'s close() exception is suppressed (added to the original exception\'s suppressed list) — the original is preserved.',
    },
    {
      type: 'gotcha',
      content: 'Never throw exceptions from constructors of AutoCloseable resources declared in the try-with-resources header — if the second resource constructor throws, the first resource is automatically closed for you.',
    },
  ],
}
