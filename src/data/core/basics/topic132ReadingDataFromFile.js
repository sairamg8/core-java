export default {
  id: 'reading-data-from-file',
  title: '132. Reading Data from a File in Java Using FileReader',
  explanation: `FileReader is the simplest way to read text data from a file. It extends InputStreamReader and reads characters (not bytes), using the default system encoding.

**FileReader(String filename)** — opens the file for reading. Throws FileNotFoundException (a subclass of IOException) if the file does not exist.

**Key methods from Reader:**
- read() — reads a single character; returns -1 at end of file
- read(char[] cbuf) — reads into a char array; returns the number of chars read, -1 at EOF
- read(char[] cbuf, int offset, int len) — reads up to len chars into cbuf starting at offset
- close() — releases the file handle
- ready() — true if the next read() is guaranteed not to block

FileReader reads character by character, which is slow due to many system calls. Wrap it in a BufferedReader to read efficiently in chunks and get the readLine() convenience method.

**Reading patterns:**
1. char-by-char: int ch; while ((ch = reader.read()) != -1) { ... }
2. Into char array: char[] buf = new char[4096]; int n = reader.read(buf);
3. Line by line (with BufferedReader): String line; while ((line = br.readLine()) != null) { ... }
4. All at once (NIO): String content = Files.readString(path) — simplest for small files

Pattern 3 and 4 are the most common in practice.`,
  code: `import java.io.*;
import java.nio.file.*;

public class FileReaderDemo {
    public static void main(String[] args) throws IOException {
        // Create a sample file to read
        Files.writeString(Path.of("sample.txt"),
            "Line one\nLine two\nLine three\n");

        // Method 1: Read char by char (slow — many system calls)
        System.out.println("=== char by char ===");
        try (FileReader fr = new FileReader("sample.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch);
            }
        }

        // Method 2: Read into char array (more efficient)
        System.out.println("=== char array ===");
        try (FileReader fr = new FileReader("sample.txt")) {
            char[] buffer = new char[64];
            int charsRead;
            while ((charsRead = fr.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, charsRead));
            }
        }

        // Method 3: BufferedReader — line by line (recommended for text)
        System.out.println("=== line by line (BufferedReader) ===");
        try (BufferedReader br = new BufferedReader(new FileReader("sample.txt"))) {
            String line;
            int lineNum = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(lineNum++ + ": " + line);
            }
        }

        // Method 4: NIO Files.readAllLines() — returns List<String>
        System.out.println("=== Files.readAllLines() ===");
        java.util.List<String> lines = Files.readAllLines(Path.of("sample.txt"));
        lines.forEach(System.out::println);

        // Method 5: NIO Files.readString() — entire file as one String (Java 11+)
        System.out.println("=== Files.readString() ===");
        String content = Files.readString(Path.of("sample.txt"));
        System.out.println("Content length: " + content.length());
        System.out.print(content);

        // Method 6: NIO Files.lines() — lazy stream of lines
        System.out.println("=== Files.lines() stream ===");
        try (var stream = Files.lines(Path.of("sample.txt"))) {
            stream.filter(l -> l.contains("two"))
                  .forEach(System.out::println);
        }

        Files.deleteIfExists(Path.of("sample.txt"));
    }
}`,
  codeTitle: 'FileReader and Reading Patterns',
  points: [
    'FileReader reads characters from a file using the default encoding; wrapping with BufferedReader is almost always better',
    'read() returns -1 at end of file — always check for -1 in the while loop condition',
    'readLine() returns null at EOF (not -1) — check for null, not empty string',
    'BufferedReader.readLine() reads a full line without the newline character; returns null when no more lines',
    'Files.readAllLines() (NIO) loads all lines into a List<String> — convenient but loads entire file into memory',
    'Files.readString() (Java 11+) reads the whole file as a single String — simplest for small files',
    'Files.lines() returns a lazy Stream<String> — efficient for large files since it reads on demand',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Files.readAllLines() and Files.readString() load the entire file into memory. For multi-GB files, use Files.lines() or a BufferedReader loop to process line by line without loading everything at once.',
    },
    {
      type: 'interview',
      content: 'Q: What does readLine() return when there are no more lines in the file?\nA: null — not an empty string. If the last line has content but no trailing newline, readLine() still returns it (just without the newline). An empty string means a blank line, not EOF.',
    },
    {
      type: 'tip',
      content: 'Use Files.lines(path) with try-with-resources — the stream must be closed to release the underlying file handle. Files.readAllLines() handles this automatically.',
    },
  ],
}
