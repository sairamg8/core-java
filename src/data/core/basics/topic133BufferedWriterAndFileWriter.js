export default {
  id: 'buffered-writer-and-file-writer',
  title: '133. BufferedWriter and FileWriter',
  explanation: `BufferedWriter wraps any Writer and adds an internal character buffer. Instead of sending each character directly to the OS, it accumulates characters in the buffer and flushes (writes to the underlying writer) only when the buffer is full, or when flush()/close() is called.

**Why buffering matters:**
Without buffering, every write("x") call may translate into a system call — expensive for the OS. With a buffer of 8192 characters (default), you batch up to 8192 writes into one system call, dramatically improving performance for many small writes.

**Creating a BufferedWriter:**
  new BufferedWriter(new FileWriter("file.txt"))
  new BufferedWriter(new FileWriter("file.txt"), 16384)  // custom buffer size

**Extra method in BufferedWriter:**
- newLine() — writes the platform-specific line separator (\n on Unix, \r\n on Windows). Prefer this over hard-coding "\n" for cross-platform compatibility.

**Full best-practice pattern:**
  try (BufferedWriter bw = new BufferedWriter(
          new OutputStreamWriter(new FileOutputStream("file.txt"), StandardCharsets.UTF_8))) {
      bw.write("content");
      bw.newLine();
  }

**Modern alternative:**
Files.write(path, lines, StandardCharsets.UTF_8) — handles buffering, encoding, and closing automatically. For very simple cases, Files.writeString() is even more concise.`,
  code: `import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;

public class BufferedWriterDemo {
    public static void main(String[] args) throws IOException {
        // Basic BufferedWriter
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("buffered.txt"))) {
            bw.write("First line");
            bw.newLine();  // platform-aware newline (\n or \r\n)
            bw.write("Second line");
            bw.newLine();
            bw.write("Third line");
            // bw.flush() called automatically by close() via try-with-resources
        }

        // Append mode with BufferedWriter
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("buffered.txt", true))) {
            bw.write("Appended line");
            bw.newLine();
        }

        // Write multiple values
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("data.txt"))) {
            String[] names = {"Alice", "Bob", "Charlie"};
            int[] scores = {90, 85, 92};

            for (int i = 0; i < names.length; i++) {
                bw.write(names[i] + "," + scores[i]);
                bw.newLine();
            }
        }

        // Best practice — explicit encoding
        try (BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                    new FileOutputStream("explicit_enc.txt"),
                    StandardCharsets.UTF_8))) {
            bw.write("UTF-8 encoded: café, résumé, naïve");
            bw.newLine();
        }

        // Modern NIO equivalent — clean and simple
        java.util.List<String> lines = java.util.Arrays.asList("Line 1", "Line 2", "Line 3");
        Files.write(Path.of("nio_write.txt"), lines, StandardCharsets.UTF_8);

        // Read back to verify
        System.out.println("=== buffered.txt ===");
        try (BufferedReader br = new BufferedReader(new FileReader("buffered.txt"))) {
            br.lines().forEach(System.out::println);
        }

        // Cleanup
        new File("buffered.txt").delete();
        new File("data.txt").delete();
        new File("explicit_enc.txt").delete();
        new File("nio_write.txt").delete();
    }
}`,
  codeTitle: 'BufferedWriter — Efficient File Writing',
  points: [
    'BufferedWriter wraps any Writer and holds an internal buffer (default 8192 chars) to batch writes into fewer system calls',
    'newLine() writes the platform-correct line separator — use it instead of hardcoding "\\n"',
    'Always close (or use try-with-resources) — close() calls flush() first, ensuring buffered data is written to disk',
    'Wrapping pattern: new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), charset))',
    'Custom buffer size: new BufferedWriter(writer, 32768) — larger buffer reduces system calls for heavy I/O',
    'For appending: new BufferedWriter(new FileWriter(file, true)) passes append=true to the underlying FileWriter',
    'Files.write(path, lines) from NIO handles buffering, encoding, and closing — best for simple cases',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you write to a BufferedWriter and do not close it (or call flush()), the buffer may never be written to disk. Data will be silently lost if the JVM exits before the buffer flushes.',
    },
    {
      type: 'interview',
      content: 'Q: Why use BufferedWriter instead of writing directly with FileWriter?\nA: FileWriter writes characters directly to the OS on every call, resulting in many expensive system calls. BufferedWriter accumulates characters in an 8192-char buffer, writing to the OS in one large batch. This can be orders of magnitude faster for many small writes.',
    },
    {
      type: 'tip',
      content: 'When writing CSV or structured data, build each line as a String and use bw.write(line) + bw.newLine(). Use StringBuilder if constructing complex lines to minimize string concatenation.',
    },
  ],
}
