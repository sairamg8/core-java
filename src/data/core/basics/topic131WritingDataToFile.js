export default {
  id: 'writing-data-to-file',
  title: '131. Writing Data to a File Using FileWriter',
  explanation: `FileWriter is the simplest way to write text data to a file in Java. It writes characters rather than bytes, using the default system encoding. It extends OutputStreamWriter which extends Writer.

**FileWriter(filename)** — opens the file and overwrites any existing content (truncates).
**FileWriter(filename, true)** — opens in append mode — adds content after existing data without deleting it.

FileWriter writes one character or a char array at a time. It is unbuffered — every write() call may result in a system call. For better performance, wrap it in a BufferedWriter.

**Key methods of Writer/FileWriter:**
- write(String s) — write a string
- write(char[] cbuf) — write a char array
- write(int c) — write a single character
- write(String s, int off, int len) — write a substring
- flush() — force any buffered data to be written (important before closing)
- close() — flushes and releases the file handle

**Important:**
- FileWriter throws IOException — you must handle it
- Always close FileWriter when done — use try-with-resources
- FileWriter does NOT write a newline at the end of write() — use write("\n") or use BufferedWriter.newLine() for platform-correct line endings
- For production code, explicitly specify the encoding: new OutputStreamWriter(new FileOutputStream(file), StandardCharsets.UTF_8)`,
  code: `import java.io.*;
import java.nio.charset.StandardCharsets;

public class FileWriterDemo {
    public static void main(String[] args) {
        // Basic FileWriter — overwrites existing content
        try (FileWriter fw = new FileWriter("output.txt")) {
            fw.write("Hello, World!");
            fw.write("\n");
            fw.write("Second line");
            fw.write("\n");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }

        // Append mode — adds to existing file
        try (FileWriter fw = new FileWriter("output.txt", true)) {
            fw.write("Appended line\n");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Writing multiple things
        try (FileWriter fw = new FileWriter("multi.txt")) {
            // Write a char array
            char[] chars = {'J', 'a', 'v', 'a'};
            fw.write(chars);
            fw.write("\n");

            // Write a string
            fw.write("Hello from FileWriter");
            fw.write("\n");

            // Write a single char code point
            fw.write(65);  // ASCII 65 = 'A'
            fw.write("\n");

            // Write substring
            fw.write("Hello World", 6, 5);  // "World"
            fw.write("\n");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Best practice — specify encoding explicitly
        try (Writer writer = new OutputStreamWriter(
                new FileOutputStream("utf8_output.txt"), StandardCharsets.UTF_8)) {
            writer.write("Explicit UTF-8 encoding\n");
            writer.write("Supports: café naïve résumé\n");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Cleanup
        new File("output.txt").delete();
        new File("multi.txt").delete();
        new File("utf8_output.txt").delete();

        System.out.println("FileWriter demo complete");
    }
}`,
  codeTitle: 'FileWriter — Write and Append',
  points: [
    'FileWriter writes characters to a file; new FileWriter(file) truncates; new FileWriter(file, true) appends',
    'FileWriter uses the default system encoding — specify encoding explicitly with OutputStreamWriter for portability',
    'write(String) does NOT add a newline — write "\\n" or use BufferedWriter.newLine() explicitly',
    'FileWriter is unbuffered — each write() may be a system call; wrap with BufferedWriter for bulk writes',
    'Always close FileWriter (use try-with-resources) — unclosed writers may not flush their final bytes to disk',
    'flush() forces any pending writes to the underlying stream — important before checking that data is on disk',
    'For modern code, consider Files.writeString() or Files.write() from NIO for simple file writing',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you open a FileWriter in overwrite mode and the program crashes before writing all data, the file may be left partially truncated or empty. For atomic writes, write to a temp file first, then rename it to the target.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between FileWriter and BufferedWriter?\nA: FileWriter writes directly to the file (may trigger OS calls on every write). BufferedWriter wraps a Writer and accumulates characters in an internal buffer, flushing when the buffer is full or when flush()/close() is called. BufferedWriter is much faster for many small writes.',
    },
    {
      type: 'tip',
      content: 'For simple one-off writes in modern Java: Files.writeString(Path.of("file.txt"), content) or Files.write(path, lines) — they handle encoding, buffering, and closing automatically.',
    },
  ],
}
