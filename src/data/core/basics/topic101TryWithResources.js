export default {
  id: 'try-with-resources',
  title: '101. try-with-resources',
  explanation: `try-with-resources is a Java 7 feature that automatically closes resources declared in the try statement. Any object that implements the AutoCloseable (or Closeable) interface can be used as a resource, and Java guarantees its close() method is called when the try block exits — whether normally or due to an exception.

Before this feature, developers had to manually close streams, database connections, and other resources in a finally block, which led to verbose and error-prone code. Forgetting to close a resource causes resource leaks, which in the case of file handles or database connections can crash your application.

Syntax:
  try (ResourceType res = new ResourceType()) {
    // use res
  } catch (Exception e) {
    // handle
  }
  // res.close() is called automatically here

Multiple resources can be declared in a single try statement, separated by semicolons. They are closed in reverse order of declaration — so the last-declared resource is closed first.

If an exception is thrown in the try block and another exception is thrown during close(), the close exception is suppressed and attached to the primary exception. You can retrieve suppressed exceptions with Throwable.getSuppressed().`,
  code: `import java.io.*;

public class TryWithResourcesDemo {
    public static void main(String[] args) {
        // Single resource
        try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
        // reader.close() called automatically

        // Multiple resources — closed in reverse order (writer first, then reader)
        try (
            BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
            BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))
        ) {
            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Custom AutoCloseable
        try (DatabaseConnection conn = new DatabaseConnection()) {
            conn.query("SELECT * FROM users");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class DatabaseConnection implements AutoCloseable {
    DatabaseConnection() { System.out.println("Connection opened"); }
    void query(String sql) { System.out.println("Executing: " + sql); }

    @Override
    public void close() {
        System.out.println("Connection closed automatically");
    }
}`,
  codeTitle: 'try-with-resources Example',
  points: [
    'Any class implementing AutoCloseable or Closeable can be used as a try-with-resources resource',
    'close() is guaranteed to be called even if an exception is thrown inside the try block',
    'Multiple resources are declared with semicolons and closed in reverse declaration order',
    'Before Java 7, you had to use a finally block to close resources — verbose and error-prone',
    'If close() throws an exception while another exception already occurred, the close exception is suppressed (not lost)',
    'You can inspect suppressed exceptions with exception.getSuppressed()',
    'Eliminates resource leaks for file I/O, database connections, and sockets',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The resource variable declared in try() is effectively final — you cannot reassign it inside the try block.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between AutoCloseable and Closeable?\nA: Closeable (from java.io) only allows IOException. AutoCloseable (from java.lang, added in Java 7) allows any checked exception. Prefer AutoCloseable for custom resources.',
    },
    {
      type: 'tip',
      content: 'Java 9 improved try-with-resources: you can now use an existing effectively-final variable in the try() header without re-declaring it.',
    },
  ],
}
