export default {
  id: 'more-on-file-class',
  title: '130. More on the File Class',
  explanation: `The java.io.File class has more capabilities beyond just creating and checking files. It provides rich metadata access, path manipulation, and recursive directory traversal tools.

**Path methods:**
- getName() — just the filename or directory name
- getParent() — parent path as a String (null if no parent)
- getParentFile() — parent as a File object
- getPath() — the path as given to the constructor
- getAbsolutePath() — absolute path based on current working directory
- getCanonicalPath() — resolves symbolic links and . / .. — most accurate

**Metadata:**
- length() — file size in bytes (0 for directories)
- lastModified() — epoch milliseconds; convert with new Date(file.lastModified())
- canRead() / canWrite() / canExecute() — permission checks
- isHidden() — hidden files (dot files on Unix, hidden attribute on Windows)

**Listing contents:**
- list() — returns String[] of names
- listFiles() — returns File[] (can be null for non-directories)
- listFiles(FileFilter) — filter by a predicate on File
- listFiles(FilenameFilter) — filter by name and parent directory

**Sorting and filtering:**
Since listFiles() returns an unordered array (OS-dependent), sort manually with Arrays.sort() or a Comparator.

**Renaming and moving:**
renameTo(File dest) — renames or moves. Returns false on failure, no exception. Use Files.move() from NIO for reliable moving with exception details.`,
  code: `import java.io.*;
import java.util.*;

public class MoreOnFileClassDemo {
    public static void main(String[] args) throws IOException {
        // Path manipulation
        File file = new File("/home/user/documents/notes.txt");
        System.out.println("Name: " + file.getName());           // notes.txt
        System.out.println("Parent: " + file.getParent());       // /home/user/documents
        System.out.println("Path: " + file.getPath());           // /home/user/documents/notes.txt
        System.out.println("Absolute: " + file.getAbsolutePath());
        System.out.println("Canonical: " + file.getCanonicalPath());

        // Relative path
        File rel = new File("data/config.properties");
        System.out.println("Relative name: " + rel.getName());   // config.properties
        System.out.println("Relative abs: " + rel.getAbsolutePath());  // /cwd/data/config.properties

        // Working with the current directory
        File current = new File(".");
        System.out.println("CWD: " + current.getCanonicalPath());

        // File metadata
        File existing = File.createTempFile("demo", ".txt");
        System.out.println("Size: " + existing.length() + " bytes");
        System.out.println("Last modified: " + new Date(existing.lastModified()));
        System.out.println("Hidden: " + existing.isHidden());
        System.out.println("Can read: " + existing.canRead());

        // Listing a directory
        File dir = new File(".");
        File[] allFiles = dir.listFiles();
        if (allFiles != null) {
            // Sort by name
            Arrays.sort(allFiles, Comparator.comparing(File::getName));
            for (File f : allFiles) {
                System.out.printf("%s %-30s %d bytes%n",
                    f.isDirectory() ? "DIR " : "FILE",
                    f.getName(),
                    f.length());
            }
        }

        // Filter — only Java files
        File[] javaFiles = dir.listFiles(
            (d, name) -> name.endsWith(".java")  // FilenameFilter
        );

        // Filter — only large files (>10KB)
        File[] largeFiles = dir.listFiles(
            f -> f.isFile() && f.length() > 10_000  // FileFilter
        );

        // Recursive listing
        listRecursively(new File("."), 0);

        // Rename / move
        File original = new File("demo.txt");
        original.createNewFile();
        File renamed = new File("renamed.txt");
        boolean success = original.renameTo(renamed);
        System.out.println("Renamed: " + success);
        renamed.delete();
        existing.delete();
    }

    static void listRecursively(File dir, int depth) {
        File[] files = dir.listFiles();
        if (files == null) return;
        for (File f : files) {
            System.out.println("  ".repeat(depth) + f.getName());
            if (f.isDirectory()) listRecursively(f, depth + 1);
        }
    }
}`,
  codeTitle: 'File Metadata, Listing, and Path Manipulation',
  points: [
    'getName() returns only the final component (filename); getParent() returns the directory path string',
    'getAbsolutePath() uses the JVM working directory to resolve relative paths; getCanonicalPath() also resolves symlinks and . / ..',
    'listFiles() returns null for non-directories and on I/O errors — always null-check before iterating',
    'listFiles(FileFilter) or listFiles(FilenameFilter) lets you filter files by criteria at the OS level — more efficient than listing all and filtering in Java',
    'listFiles() order is OS-dependent (undefined) — sort the array explicitly with Arrays.sort() if order matters',
    'renameTo() returns false silently on failure; Files.move() from NIO throws an exception with a reason',
    'For recursive directory operations (delete tree, copy tree), write a recursive method or use Files.walkFileTree()',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'renameTo() may fail silently when crossing file system boundaries (e.g., renaming from /tmp to /home). Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING) from NIO handles cross-filesystem moves correctly.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between getAbsolutePath() and getCanonicalPath()?\nA: getAbsolutePath() prepends the working directory but does not resolve . / .. or symbolic links. getCanonicalPath() fully resolves the path to its true location — no dots, no symlinks. It also throws IOException.',
    },
    {
      type: 'tip',
      content: 'Use Files.walk(path) from NIO.2 to recursively list all files in a directory tree — it returns a Stream<Path> so you can filter/map/collect with the Stream API.',
    },
  ],
}
