export default {
  id: 'user-input',
  title: 'User Input — Scanner & BufferedReader',
  explanation: `Java provides two main ways to read user input from the console: \`Scanner\` and \`BufferedReader\`. Both read from \`System.in\`, but they differ in speed and flexibility.

**Scanner (java.util.Scanner)**
- Easy to use, handles int/double/String natively with \`nextInt()\`, \`nextDouble()\`, \`nextLine()\`
- Parses tokens (words or numbers) from the stream
- Slower for large inputs due to regex-based parsing
- Does NOT buffer reads efficiently

**BufferedReader (java.io.BufferedReader)**
- Faster — buffers the stream in memory before processing
- Always reads a full line as \`String\` — you parse it manually with \`Integer.parseInt()\` etc.
- Requires wrapping \`System.in\` in an \`InputStreamReader\` first
- Preferred in competitive programming and high-throughput applications

**The Scanner nextLine() trap**
After \`nextInt()\` or \`nextDouble()\`, calling \`nextLine()\` immediately reads the leftover newline (\`\\n\`) instead of the next line of actual input. The fix: call \`nextLine()\` once to consume the leftover newline.`,
  code: `import java.util.Scanner;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

// --- SCANNER ---
Scanner sc = new Scanner(System.in);

System.out.print("Enter your name: ");
String name = sc.nextLine();       // reads full line including spaces

System.out.print("Enter your age: ");
int age = sc.nextInt();            // reads one integer token

System.out.print("Enter salary: ");
double salary = sc.nextDouble();   // reads one double token

// THE TRAP: nextInt/nextDouble leaves the newline in the buffer
sc.nextLine();                     // consume the leftover \\n  ← FIX
System.out.print("Enter city: ");
String city = sc.nextLine();       // now correctly reads the next line

System.out.println(name + ", " + age + ", " + salary + ", " + city);
sc.close();                        // close when done to release resources

// --- BUFFEREDREADER (faster, preferred for bulk input) ---
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

try {
    System.out.print("Enter name: ");
    String nameB = br.readLine();          // always a String

    System.out.print("Enter age: ");
    int ageB = Integer.parseInt(br.readLine().trim()); // manual parse

    System.out.print("Enter salary: ");
    double salaryB = Double.parseDouble(br.readLine().trim());

    System.out.println(nameB + ", " + ageB + ", " + salaryB);
} catch (IOException e) {
    System.err.println("Input error: " + e.getMessage());
}

// Reading multiple values on one line (e.g., "3 5" as two ints)
String[] parts = br.readLine().split(" ");
int a = Integer.parseInt(parts[0]);
int b = Integer.parseInt(parts[1]);`,
  points: [
    'Scanner is simpler; BufferedReader is faster — use Scanner for basic programs, BufferedReader for performance-critical reads',
    'nextLine() reads until newline (inclusive). next() reads until whitespace (exclusive)',
    'The Scanner trap: nextInt() / nextDouble() does NOT consume the trailing newline — always call nextLine() after to flush it',
    'Always close Scanner and BufferedReader when done — they wrap System.in which is a system resource',
    'Integer.parseInt() throws NumberFormatException on invalid input — validate or wrap in try/catch for user-facing code',
    'In competitive programming, use BufferedReader + split() to read multiple numbers per line — it is 5-10x faster than Scanner',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Scanner.next() and Scanner.nextLine()?\nA: next() reads one token (a word — stops at whitespace). nextLine() reads the entire line up to the newline character. If the user types "Hello World", next() returns "Hello" and leaves "World\\n" in the buffer; nextLine() returns "Hello World".',
    },
    {
      type: 'gotcha',
      content: 'Classic beginner bug: sc.nextInt() then sc.nextLine() in sequence. The nextInt() reads the number but NOT the \\n. The nextLine() immediately picks up that leftover \\n and returns an empty string instead of waiting for the next user input. Fix: add an extra sc.nextLine() call right after nextInt() to consume the leftover newline.',
    },
    {
      type: 'tip',
      content: 'Never use new Scanner(System.in) multiple times in the same program. Create one Scanner, use it throughout, then close it once at the end. Closing the Scanner also closes System.in — once closed, you cannot reopen it in the same JVM run.',
    },
  ],
}
