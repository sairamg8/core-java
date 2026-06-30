export default {
  id: 'fundamentals-before-io',
  title: '128. Fundamentals Before IO Operation',
  explanation: `Before diving into file I/O in Java, you need to understand the foundational concepts: what a stream is in the I/O context, the difference between byte streams and character streams, and the layered architecture of the java.io package.

**I/O Stream (not the same as Java 8 Stream):**
An I/O stream is a flow of data from a source to a destination. Java models I/O as reading/writing data one unit at a time — either bytes or characters — through a stream abstraction. All blocking I/O in Java throws checked IOException.

**Byte Streams (binary data):**
- Base classes: InputStream and OutputStream
- Read/write raw bytes (8-bit)
- Used for all binary files: images, audio, video, PDF, ZIP
- Key implementations: FileInputStream, FileOutputStream, BufferedInputStream, BufferedOutputStream

**Character Streams (text data):**
- Base classes: Reader and Writer
- Read/write characters (Unicode — typically 16-bit)
- Automatically handle character encoding (UTF-8, UTF-16, etc.)
- Used for text files: .txt, .csv, .json, .xml
- Key implementations: FileReader, FileWriter, BufferedReader, BufferedWriter, PrintWriter

**The Decorator Pattern in java.io:**
Java I/O uses the Decorator pattern extensively. You wrap a basic stream in a buffered wrapper, then in a reader wrapper:
  new BufferedReader(new FileReader("file.txt"))
This adds buffering (reduces system calls) and character decoding on top of the raw file stream.

**Key principle:** Always close streams after use. With Java 7+, use try-with-resources to guarantee closure even on exceptions.`,
  code: `import java.io.*;

public class IOFundamentalsDemo {
    public static void main(String[] args) {
        // InputStream/OutputStream hierarchy (byte streams)
        // InputStream
        //   FileInputStream
        //   BufferedInputStream
        //   ByteArrayInputStream
        //   DataInputStream
        //   ObjectInputStream

        // Reader/Writer hierarchy (character streams)
        // Reader
        //   FileReader (FileInputStream + default encoding)
        //   BufferedReader (adds buffer layer)
        //   InputStreamReader (converts bytes to chars with specified encoding)

        // Basic byte stream — reading a file byte by byte (inefficient)
        try (FileInputStream fis = new FileInputStream("example.txt")) {
            int b;
            while ((b = fis.read()) != -1) {
                System.out.print((char) b);  // each byte as a character
            }
        } catch (IOException e) {
            System.out.println("File not found: " + e.getMessage());
        }

        // Character stream — reading a text file char by char (slightly better)
        try (FileReader fr = new FileReader("example.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch);
            }
        } catch (IOException e) {
            System.out.println("File not found: " + e.getMessage());
        }

        // Buffered character stream — reading line by line (recommended for text)
        try (BufferedReader br = new BufferedReader(new FileReader("example.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("File not found: " + e.getMessage());
        }

        // InputStreamReader — specify encoding explicitly (best practice)
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream("example.txt"), "UTF-8"))) {
            System.out.println("First line: " + br.readLine());
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
  codeTitle: 'Byte Streams vs Character Streams',
  points: [
    'Java I/O is built on streams: InputStream/OutputStream for bytes, Reader/Writer for characters',
    'Byte streams handle binary data (images, videos, ZIP); character streams handle text (encoding-aware)',
    'The java.io package uses the Decorator pattern — wrap basic streams in buffered/converting wrappers',
    'BufferedReader/BufferedWriter dramatically reduce system calls by reading/writing chunks rather than one byte at a time',
    'All java.io operations throw checked IOException — you must handle it with try-catch or declare throws',
    'Always close I/O resources after use — best done with try-with-resources (Java 7+)',
    'InputStreamReader bridges byte streams and character streams, letting you specify the character encoding',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'FileReader uses the platform default encoding, which varies by OS. For reliable cross-platform text handling, always use InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8) to explicitly specify encoding.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between InputStream and Reader in Java I/O?\nA: InputStream reads raw bytes (8-bit). Reader reads characters (Unicode, typically 16-bit), handling encoding automatically. Use InputStream for binary data, Reader for text files.',
    },
    {
      type: 'tip',
      content: 'For most text file I/O in modern Java, prefer java.nio.file.Files methods (Files.readAllLines, Files.readString, Files.write) — they are cleaner and handle UTF-8 by default.',
    },
  ],
}
