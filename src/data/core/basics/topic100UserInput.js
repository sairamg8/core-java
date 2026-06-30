export default {
  id: 'user-input',
  title: '100. User Input using BufferedReader and Scanner',
  explanation: `Java provides multiple ways to read user input from the console (standard input, \`System.in\`). The two most common are \`BufferedReader\` and \`Scanner\`.

**BufferedReader** (from java.io):
- Wraps an \`InputStreamReader\` around \`System.in\`
- Reads entire lines as Strings: \`br.readLine()\`
- Throws IOException — must be in a try-catch or declared with throws
- Very fast because it buffers input; no automatic tokenization
- Need to parse manually: \`Integer.parseInt(br.readLine())\`

**Scanner** (from java.util):
- Wraps \`System.in\` directly
- Parses tokens automatically: \`nextInt()\`, \`nextDouble()\`, \`nextLine()\`, \`next()\`
- Does not throw checked exceptions (easier but hides IO errors)
- Slower than BufferedReader for large input (no buffering by default)
- Common in competitive programming and beginner code

A critical Scanner gotcha: after \`nextInt()\`, the newline character is NOT consumed — a subsequent \`nextLine()\` reads an empty string. The fix is to call \`nextLine()\` once to consume the leftover newline.`,
  code: `import java.io.*;
import java.util.Scanner;

public class Demo {
    // --- Using BufferedReader ---
    static void bufferedReaderDemo() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("BufferedReader - Enter your name: ");
        String name = br.readLine();  // reads until newline, returns String

        System.out.print("Enter your age: ");
        int age = Integer.parseInt(br.readLine());  // parse manually

        System.out.println("Hello " + name + ", you are " + age + " years old.");
    }

    // --- Using Scanner ---
    static void scannerDemo() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Scanner - Enter your name: ");
        String name = sc.nextLine();  // reads entire line

        System.out.print("Enter your age: ");
        int age = sc.nextInt();       // reads and parses int token

        sc.nextLine();  // consume leftover newline after nextInt()

        System.out.print("Enter a sentence: ");
        String sentence = sc.nextLine();  // reads full line

        System.out.printf("Name: %s, Age: %d%n", name, age);
        System.out.println("Sentence: " + sentence);

        sc.close();
    }

    // --- Scanner with loop (common pattern) ---
    static void sumWithScanner() {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter numbers (type 'done' to stop):");

        int sum = 0;
        while (sc.hasNextInt()) {
            sum += sc.nextInt();
        }
        System.out.println("Sum: " + sum);
        sc.close();
    }

    // --- Reading different types ---
    static void readTypes() {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter int, double, and boolean (space-separated): ");
        int i = sc.nextInt();
        double d = sc.nextDouble();
        boolean b = sc.nextBoolean();
        System.out.printf("int=%d, double=%.2f, boolean=%b%n", i, d, b);
        sc.close();
    }

    public static void main(String[] args) throws IOException {
        // Comment/uncomment to test each approach:
        // bufferedReaderDemo();
        // scannerDemo();
        // sumWithScanner();
        // readTypes();

        // Inline demonstration with string input (for non-interactive run)
        Scanner sc = new Scanner("Alice\n25\nLearning Java");
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine());
        String topic = sc.nextLine();
        System.out.printf("%s (age %d) is studying: %s%n", name, age, topic);
        sc.close();
    }
}`,
  codeTitle: 'User Input with BufferedReader and Scanner',
  points: [
    'BufferedReader is faster and uses less memory for large input — preferred in performance-critical code',
    'Scanner is more convenient with built-in type parsing (nextInt, nextDouble, nextBoolean)',
    'BufferedReader.readLine() returns null at end-of-stream; Scanner.hasNextLine() checks for more input',
    'Always close Scanner/BufferedReader when done to release the underlying stream resource',
    'Use try-with-resources to auto-close: try (Scanner sc = new Scanner(System.in)) { ... }',
    'Critical Scanner gotcha: nextInt(), nextDouble() do NOT consume the trailing newline; call nextLine() after them before reading a string',
    'For reading files, wrap FileReader in BufferedReader; for reading System.in, wrap InputStreamReader in BufferedReader',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never close System.in (Scanner wraps System.in). Calling sc.close() when Scanner wraps System.in permanently closes System.in for the entire JVM — subsequent Scanner instances cannot read from it. This is fine for single-use programs but is a problem in libraries or multi-phase programs.',
    },
    {
      type: 'interview',
      content: 'Q: When would you choose BufferedReader over Scanner?\nA: BufferedReader for performance (it uses a buffer internally; Scanner tokenizes character-by-character), for reading large files line-by-line, and in competitive programming where speed matters. Scanner for interactive programs where convenient type parsing (nextInt, nextDouble) is more valuable than raw speed.',
    },
    {
      type: 'tip',
      content: 'In production code, user input typically comes through a web framework (HTTP parameters, JSON body) rather than System.in — but Scanner and BufferedReader remain important for command-line tools, batch processors, and file readers.',
    },
  ],
}
