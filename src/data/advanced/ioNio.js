export default {
  id: 'io-nio',
  title: '1. Java I/O & NIO',
  explanation: `Java has two I/O APIs:
**java.io** — stream-based, blocking, byte-oriented or character-oriented.
**java.nio** (New I/O, Java 1.4+) — buffer/channel-based, supports non-blocking. The \`java.nio.file\` package (Java 7+) is the modern replacement for \`java.io.File\`.

**Rule of thumb:** For most file I/O, use \`java.nio.file.Files\` — it's simple and correct. For network I/O at scale, use NIO channels or a framework (Netty).`,
  table: {
    headers: ['Task', 'Modern API'],
    rows: [
      ['Read text file', 'Files.readString(path) or Files.lines(path)'],
      ['Write text file', 'Files.writeString(path, content)'],
      ['Copy file', 'Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING)'],
      ['List directory', 'Files.list(dir) → Stream<Path>'],
      ['Walk tree', 'Files.walk(dir) → Stream<Path>'],
      ['Check exists', 'Files.exists(path)'],
    ],
  },
  code: `import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

// ── Modern File I/O (java.nio.file, Java 7+) — use this ──────────────────
Path path = Path.of("data/users.txt");         // or Paths.get("data/users.txt")

// Read entire file as String (Java 11+)
String content = Files.readString(path);
String utf8    = Files.readString(path, StandardCharsets.UTF_8);

// Read all lines as List<String>
List<String> lines = Files.readAllLines(path);

// Stream lines lazily (large files — don't load all into memory)
try (Stream<String> stream = Files.lines(path)) {
    stream.filter(l -> !l.isBlank())
          .map(String::trim)
          .forEach(System.out::println);
}  // stream closed automatically

// Read bytes
byte[] bytes = Files.readAllBytes(path);

// Write
Files.writeString(path, "Hello, World!\n");                    // overwrite
Files.writeString(path, "More\n", StandardOpenOption.APPEND);  // append
Files.write(path, lines, StandardOpenOption.CREATE, StandardOpenOption.WRITE);

// Copy / Move / Delete
Files.copy(Path.of("a.txt"), Path.of("b.txt"), StandardCopyOption.REPLACE_EXISTING);
Files.move(Path.of("old.txt"), Path.of("new.txt"), StandardCopyOption.ATOMIC_MOVE);
Files.delete(path);           // throws if not found
Files.deleteIfExists(path);   // safe

// Listing and walking
try (Stream<Path> entries = Files.list(Path.of("src"))) {
    entries.filter(Files::isRegularFile).forEach(System.out::println);
}
try (Stream<Path> tree = Files.walk(Path.of("src"))) {
    List<Path> javaFiles = tree.filter(p -> p.toString().endsWith(".java")).toList();
}

// Temp files
Path tmp = Files.createTempFile("prefix-", ".txt");
Files.writeString(tmp, "temp data");

// ── Buffered I/O (classic java.io — still useful for streams) ────────────
// Reading text — always use BufferedReader for performance
try (var reader = new BufferedReader(new FileReader("input.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// Writing text — always flush/close (try-with-resources does it)
try (var writer = new BufferedWriter(new FileWriter("output.txt", true))) {
    writer.write("New line");
    writer.newLine();
}

// Binary — InputStream/OutputStream with buffering
try (var in  = new BufferedInputStream(new FileInputStream("in.bin"));
     var out = new BufferedOutputStream(new FileOutputStream("out.bin"))) {
    byte[] buf = new byte[8192];
    int n;
    while ((n = in.read(buf)) != -1) {
        out.write(buf, 0, n);
    }
}

// ── PrintWriter — convenient for formatted text output ────────────────────
try (PrintWriter pw = new PrintWriter(new FileWriter("report.txt"))) {
    pw.printf("Name: %-20s Score: %d%n", "Alice", 95);
    pw.println("Done");
}`,
  points: [
    'Always use try-with-resources with I/O — failing to close streams causes file descriptor leaks (OS-level resource exhaustion)',
    'Without BufferedReader/BufferedWriter, every read()/write() call hits the OS — buffering batches syscalls and can be 10-100x faster',
    'Files.readString() and Files.writeString() (Java 11+) handle open/read/close in one call — use them for convenience',
    'Path is the modern replacement for File. Prefer Path.of() over new File() in all new code',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between InputStream/OutputStream and Reader/Writer?\nA: InputStream/OutputStream work with raw bytes — use them for binary data (images, compressed data, network). Reader/Writer work with characters and handle charset encoding/decoding — use them for text. Bridging classes: InputStreamReader and OutputStreamWriter convert between the two.',
    },
    {
      type: 'gotcha',
      content: 'FileWriter(path) truncates the file by default. To append, use new FileWriter(path, true). With Files.writeString(), use StandardOpenOption.APPEND explicitly. The default behavior of "overwrite silently" causes data loss when not intended.',
    },
  ],
}
