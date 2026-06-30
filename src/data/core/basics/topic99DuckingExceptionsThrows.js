export default {
  id: 'ducking-exceptions-throws',
  title: '99. Ducking Exceptions Using throws',
  explanation: `"Ducking" an exception means not handling it yourself, but instead declaring that your method may throw it — passing the responsibility to your callers. In Java, you duck a checked exception by adding \`throws ExceptionType\` to your method signature.

When you call a method that throws a checked exception, you have exactly two choices:
1. **Handle it** — wrap in try-catch.
2. **Duck it** — add \`throws\` to your own method signature, propagating it up.

\`throws\` is a declaration that appears after the parameter list: \`public void readConfig() throws IOException\`. It says: "This method may throw IOException; caller, you deal with it."

The \`throws\` clause can list multiple exceptions: \`throws IOException, SQLException\`. It can also declare a supertype (\`throws Exception\`) to cover multiple specific types — though this is generally too broad and hides detail from callers.

Unchecked exceptions (RuntimeException subclasses) can also be listed in \`throws\`, but there is no compiler enforcement — it is purely informational documentation in that case.`,
  code: `import java.io.*;
import java.sql.*;

// --- Ducking the exception up the call stack ---
class ConfigLoader {
    // Method ducks IOException — it is the caller's responsibility
    String load(String path) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line).append("\n");
            return sb.toString();
        }
        // IOException NOT caught here — declared in throws, propagates to caller
    }
}

class AppService {
    private ConfigLoader loader = new ConfigLoader();

    // AppService also ducks it further
    void init(String configPath) throws IOException {
        String config = loader.load(configPath);
        System.out.println("Config loaded:\n" + config);
    }
}

// --- Eventually someone must handle it ---
class Application {
    public static void main(String[] args) {
        AppService svc = new AppService();
        try {
            svc.init("app.config");  // must handle here — end of the call stack
        } catch (IOException e) {
            System.out.println("Startup failed: " + e.getMessage());
            System.out.println("Using default configuration.");
        }

        // Declaring multiple exceptions
        System.out.println("\n--- Multi-throws demo ---");
        try {
            riskyOperation();
        } catch (IOException e) {
            System.out.println("IO error: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("DB error: " + e.getMessage());
        }
    }

    static void riskyOperation() throws IOException, SQLException {
        // Simulates a method that may throw either
        boolean dbError = true;
        if (dbError) {
            throw new SQLException("Connection refused");
        }
        throw new IOException("File missing"); // never reached in this run
    }
}`,
  codeTitle: 'Ducking Checked Exceptions with throws',
  points: [
    'throws in a method signature declares that the method may propagate a checked exception to its caller',
    'Ducking moves the handling responsibility up the call stack without suppressing the exception',
    'At some level the exception must be caught — the JVM terminates the thread if it reaches main() unhandled',
    'Multiple exceptions can be declared: throws IOException, SQLException, ClassNotFoundException',
    'You can declare a parent type (throws Exception) to cover subtypes, but this loses specificity for callers',
    'Unchecked exceptions need NOT be declared with throws, but can be for documentation purposes',
    'The checked exception contract: any method that calls a throws-declared method must either catch it or also declare it',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Declaring throws Exception is a common anti-pattern — it forces every caller to catch the broadest possible type, obscuring what can actually go wrong. Declare the most specific exception type(s) so callers know exactly what to handle.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between throw and throws?\nA: throw is a runtime action in the method body that actually throws an exception instance. throws is a compile-time declaration on the method signature announcing that the method may propagate a checked exception. throw makes it happen; throws documents the possibility.',
    },
    {
      type: 'tip',
      content: 'Duck exceptions as close to the bottom of the call stack as possible and handle them as close to where you can meaningfully recover. Main application entry points (main, REST controllers, message consumers) are natural catch boundaries where you log and return an error response.',
    },
  ],
}
