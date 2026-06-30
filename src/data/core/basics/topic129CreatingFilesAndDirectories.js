export default {
  id: 'creating-files-and-directories',
  title: '129. Creating Files and Directories Using the File Class',
  explanation: `The java.io.File class represents a file or directory path in an abstract way. It does NOT open or read the file — it is just a path reference. You use it to create, delete, check existence, list contents, and inspect file metadata.

**Creating a File object:**
new File("path/to/file.txt") — just creates the object, does NOT create the file on disk.

**Key File methods:**
- createNewFile() — creates the file on disk if it does not exist; returns false if it already exists
- mkdir() — creates a directory (fails if parent does not exist)
- mkdirs() — creates directory AND all necessary parent directories
- exists() — checks if the file/directory exists
- isFile() / isDirectory() — check type
- delete() — deletes the file or empty directory
- listFiles() — returns array of File objects for directory contents
- renameTo(File dest) — rename or move
- length() — file size in bytes
- lastModified() — last modification time in milliseconds since epoch
- getAbsolutePath() / getCanonicalPath() — resolve the absolute path

**Modern alternative — java.nio.file.Files and Path:**
Java 7 introduced the NIO.2 API (java.nio.file). It is more powerful, cleaner, and has better error reporting than the old File class. Prefer Files.createFile(), Files.createDirectories(), Files.exists(), Files.delete() for new code.`,
  code: `import java.io.*;
import java.nio.file.*;

public class FilesAndDirectoriesDemo {
    public static void main(String[] args) throws IOException {
        // --- java.io.File (old API) ---

        File file = new File("demo.txt");
        System.out.println("Absolute path: " + file.getAbsolutePath());
        System.out.println("Exists: " + file.exists());

        // Create file
        boolean created = file.createNewFile();
        System.out.println("Created: " + created);  // true if new, false if already existed

        System.out.println("Is file: " + file.isFile());
        System.out.println("Length: " + file.length() + " bytes");
        System.out.println("Can read: " + file.canRead());
        System.out.println("Can write: " + file.canWrite());

        // Create a directory
        File dir = new File("myDirectory");
        boolean dirCreated = dir.mkdir();
        System.out.println("Directory created: " + dirCreated);

        // Create nested directories
        File nested = new File("parent/child/grandchild");
        nested.mkdirs();  // creates all intermediate directories

        // List files in a directory
        File currentDir = new File(".");
        File[] files = currentDir.listFiles();
        if (files != null) {
            for (File f : files) {
                System.out.println(f.getName() + (f.isDirectory() ? "/" : ""));
            }
        }

        // List only .txt files
        File[] txtFiles = currentDir.listFiles(f -> f.getName().endsWith(".txt"));
        System.out.println("TXT files: " + (txtFiles != null ? txtFiles.length : 0));

        // Delete
        file.delete();
        dir.delete();

        // --- java.nio.file.Files (new API — preferred) ---
        Path path = Paths.get("nio_demo.txt");
        Files.createFile(path);              // creates the file
        System.out.println("NIO exists: " + Files.exists(path));
        System.out.println("NIO size: " + Files.size(path));

        Path dirs = Paths.get("nio/parent/child");
        Files.createDirectories(dirs);       // creates all parents

        Files.delete(path);
        Files.delete(Paths.get("nio/parent/child"));
        Files.delete(Paths.get("nio/parent"));
        Files.delete(Paths.get("nio"));
        // Cleanup
        Files.deleteIfExists(Paths.get("parent/child/grandchild"));
        Files.deleteIfExists(Paths.get("parent/child"));
        Files.deleteIfExists(Paths.get("parent"));
    }
}`,
  codeTitle: 'File and Directory Creation',
  points: [
    'new File("path") creates a path reference only — the file/directory does not exist until you call createNewFile() or mkdir()',
    'mkdir() creates one directory; mkdirs() creates a full path including missing parent directories',
    'createNewFile() returns false (not an exception) if the file already exists',
    'listFiles() returns null if the path is not a directory or an I/O error occurs — always null-check the result',
    'java.nio.file.Files and Path (Java 7+) are preferred over the old File class — better error messages and richer API',
    'Files.deleteIfExists() is safer than file.delete() — no exception if the file is already gone',
    'File.delete() only removes empty directories — use third-party libs or recursive code for non-empty directories',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'File.delete() returns false silently if deletion fails (file locked, directory not empty, permissions). Files.delete() from NIO throws an IOException with a descriptive message — use it for better error handling.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between mkdir() and mkdirs()?\nA: mkdir() creates only the requested directory and fails if the parent does not exist. mkdirs() creates the full path including all non-existent parent directories. Use mkdirs() when creating nested directory structures.',
    },
    {
      type: 'tip',
      content: 'For new code, prefer java.nio.file.Path and Files over java.io.File. Path.of("...") (Java 11+) is cleaner than Paths.get("..."), and Files methods throw meaningful IOException subtypes.',
    },
  ],
}
