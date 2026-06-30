export default {
  id: 'write-operation-with-printwriter',
  title: '135. Write Operation with PrintWriter',
  explanation: `PrintWriter is the most convenient way to write formatted text to a file. It provides print(), println(), and printf() methods — the same API as System.out (which is a PrintStream). This makes it natural to use for generating text reports, CSV files, log files, or any structured text output.

**Key features of PrintWriter:**
- print(value) — writes any primitive or Object (calls toString())
- println(value) — writes and appends a newline
- printf(format, args) — formatted output like C's printf; equivalent to format()
- print(boolean), print(int), print(long), print(double) — type-specific overloads
- Does NOT throw IOException from print/println — errors are recorded silently; check checkError() to detect them

**Creating a PrintWriter:**
  new PrintWriter("file.txt") — wraps FileOutputStream, uses default encoding
  new PrintWriter(new BufferedWriter(new FileWriter("file.txt"))) — explicit buffering
  new PrintWriter(new FileWriter("file.txt", true)) — append mode

**auto-flush:**
PrintWriter(stream, true) enables auto-flush — flushes after every println() or printf(). Useful when you want output visible immediately (e.g., logging), but adds overhead.

**Error handling:**
Unlike BufferedWriter, PrintWriter swallows IOExceptions internally. Call checkError() to see if any write failed. For critical data, prefer BufferedWriter which throws IOException explicitly.`,
  code: `import java.io.*;
import java.nio.file.*;

public class PrintWriterDemo {
    public static void main(String[] args) throws IOException {
        // Basic PrintWriter — wraps a file
        try (PrintWriter pw = new PrintWriter("report.txt")) {
            pw.println("=== Sales Report ===");
            pw.println();  // blank line
            pw.println("Product,Price,Quantity");
            pw.printf("%-20s %8.2f %5d%n", "Laptop", 999.99, 10);
            pw.printf("%-20s %8.2f %5d%n", "Mouse",  29.99,  50);
            pw.printf("%-20s %8.2f %5d%n", "Keyboard", 79.99, 30);
        }

        // Read back and print
        Files.lines(Path.of("report.txt")).forEach(System.out::println);

        // Print various types
        try (PrintWriter pw = new PrintWriter("types.txt")) {
            pw.print(42);           // int
            pw.println();
            pw.print(3.14);         // double
            pw.println();
            pw.print(true);         // boolean
            pw.println();
            pw.print('A');          // char
            pw.println();
            pw.println(new java.util.Date());  // Object.toString()
        }

        // Append mode
        try (PrintWriter pw = new PrintWriter(new FileWriter("report.txt", true))) {
            pw.println();
            pw.println("--- End of Report ---");
        }

        // With BufferedWriter for better performance
        try (PrintWriter pw = new PrintWriter(
                new BufferedWriter(new FileWriter("buffered_report.txt")))) {
            for (int i = 1; i <= 100; i++) {
                pw.printf("Line %3d: Data value = %d%n", i, i * i);
            }
        }

        // Auto-flush PrintWriter (flushes on println)
        PrintWriter autoFlush = new PrintWriter(System.out, true);
        autoFlush.println("This prints immediately");

        // Detecting errors (PrintWriter swallows IOException)
        try (PrintWriter pw = new PrintWriter("check_error.txt")) {
            pw.println("Test data");
            boolean hadError = pw.checkError();
            System.out.println("Had error: " + hadError);  // false if write succeeded
        }

        // Cleanup
        new File("report.txt").delete();
        new File("types.txt").delete();
        new File("buffered_report.txt").delete();
        new File("check_error.txt").delete();
    }
}`,
  codeTitle: 'PrintWriter — Formatted File Writing',
  points: [
    'PrintWriter provides print(), println(), printf() — the same convenient API as System.out',
    'println() writes the content plus a platform-appropriate newline; print() writes without newline',
    'printf()/format() supports format specifiers: %s (string), %d (integer), %f (float), %n (newline), %-20s (left-align)',
    'PrintWriter does NOT throw IOException from print/println — call checkError() to detect silent failures',
    'For performance, wrap with BufferedWriter: new PrintWriter(new BufferedWriter(new FileWriter(file)))',
    'Auto-flush (new PrintWriter(stream, true)) flushes after every println/printf — adds I/O overhead',
    'For critical data, prefer BufferedWriter which throws IOException so you know when a write fails',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'PrintWriter silently ignores IOExceptions and sets an internal error flag. This means your program continues without crashing even when writes fail (e.g., disk full). Always call checkError() after writing important data.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between PrintWriter and BufferedWriter?\nA: Both write text to a stream. PrintWriter provides convenient print/println/printf methods and swallows IOExceptions (check with checkError()). BufferedWriter provides write/newLine and throws IOException explicitly. PrintWriter is better for formatted output; BufferedWriter is better when you need reliable error handling.',
    },
    {
      type: 'tip',
      content: 'Use PrintWriter for generating reports, CSV, or structured text — its printf() is perfect for column-aligned output. Use BufferedWriter when you need exception-based error handling for critical writes.',
    },
  ],
}
