export default {
  id: 'buffered-reader-and-file-reader',
  title: '134. BufferedReader and FileReader',
  explanation: `BufferedReader wraps any Reader and adds an internal buffer, dramatically reducing the number of read system calls. It also provides the crucial readLine() method that reads an entire line at once.

**Why BufferedReader over FileReader alone:**
FileReader reads one character at a time with a system call per read. BufferedReader reads a large chunk (8192 chars by default) into memory at once, then serves subsequent read() calls from that buffer. This is much faster for text file processing.

**Creating a BufferedReader:**
  new BufferedReader(new FileReader("file.txt"))
  new BufferedReader(new FileReader("file.txt"), 65536)  // custom 64KB buffer

**Key methods:**
- readLine() — reads a line of text; returns null at EOF; line does NOT include newline character
- read() — reads a single char (from buffer — fast)
- read(char[] cbuf, int off, int len) — bulk read into array
- lines() — (Java 8+) returns a lazy Stream<String> of lines; remember to close the reader
- skip(long n) — skips n characters
- ready() — true if buffer is not empty

**Encoding control:**
FileReader uses the default system encoding. For explicit encoding:
  new BufferedReader(new InputStreamReader(new FileInputStream("file.txt"), StandardCharsets.UTF_8))

**Modern alternative:**
Files.newBufferedReader(path, charset) — equivalent wrapped in one call with explicit charset.`,
  code: `import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;

public class BufferedReaderDemo {
    public static void main(String[] args) throws IOException {
        // Create test file
        Files.write(Path.of("sample.txt"),
            java.util.Arrays.asList("Line 1: Hello", "Line 2: World", "Line 3: Java"),
            StandardCharsets.UTF_8);

        // Basic BufferedReader — line by line
        System.out.println("=== readLine() loop ===");
        try (BufferedReader br = new BufferedReader(new FileReader("sample.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        }

        // With explicit encoding (best practice)
        System.out.println("=== explicit encoding ===");
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream("sample.txt"), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println("[" + line + "]");
            }
        }

        // NIO convenience method
        System.out.println("=== Files.newBufferedReader ===");
        try (BufferedReader br = Files.newBufferedReader(Path.of("sample.txt"), StandardCharsets.UTF_8)) {
            br.lines()
              .filter(l -> l.contains("World"))
              .forEach(System.out::println);
        }

        // Java 8 lines() stream — lazy, reads on demand
        System.out.println("=== lines() stream ===");
        try (BufferedReader br = new BufferedReader(new FileReader("sample.txt"))) {
            br.lines()
              .map(String::toUpperCase)
              .forEach(System.out::println);
        }  // reader closed here — stream must be used inside try

        // Reading into char array
        System.out.println("=== char array bulk read ===");
        try (BufferedReader br = new BufferedReader(new FileReader("sample.txt"))) {
            char[] buffer = new char[1024];
            int charsRead;
            StringBuilder sb = new StringBuilder();
            while ((charsRead = br.read(buffer)) != -1) {
                sb.append(buffer, 0, charsRead);
            }
            System.out.println("Total chars: " + sb.length());
        }

        Files.deleteIfExists(Path.of("sample.txt"));
    }
}`,
  codeTitle: 'BufferedReader — Efficient Line Reading',
  points: [
    'BufferedReader reads large chunks into an 8192-char buffer; subsequent reads come from the buffer (no system call)',
    'readLine() returns a line without the newline character; returns null at EOF — check for null, not empty string',
    'lines() returns a lazy Stream<String> — must be consumed inside the try-with-resources block since the reader must stay open',
    'For explicit encoding: new BufferedReader(new InputStreamReader(stream, charset)) or Files.newBufferedReader(path, charset)',
    'FileReader alone reads one character per system call — always wrap it with BufferedReader for real code',
    'Default buffer size is 8192 chars; increase for very large files: new BufferedReader(reader, 65536)',
    'files.lines(path) is a shorter alternative that opens, reads lazily, and must also be closed',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you use br.lines() outside a try-with-resources and forget to close the BufferedReader, the file handle leaks. Always use try-with-resources when getting a stream from a BufferedReader.',
    },
    {
      type: 'interview',
      content: 'Q: Why is BufferedReader faster than FileReader for reading text files?\nA: FileReader makes a system call for each character read. BufferedReader reads 8192 characters at once into a buffer; subsequent reads pull from the buffer without system calls. For most files, this makes BufferedReader hundreds of times faster.',
    },
    {
      type: 'tip',
      content: 'For large log files or data files, use Files.lines(path) with a Stream pipeline — it reads lazily one line at a time, so you never load the whole file into memory at once.',
    },
  ],
}
