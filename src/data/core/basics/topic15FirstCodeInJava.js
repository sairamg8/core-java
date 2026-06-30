export default {
  id: 'first-code-in-java',
  title: '15. First Code in Java',
  explanation: `Writing your first Java program involves understanding a few mandatory rules that every Java file must follow. Getting these right once means they become second nature.

**The anatomy of a Java program:**

Every Java program requires at minimum:
1. **A class declaration** — \`public class ClassName\`
2. **A main method** — the entry point the JVM calls to start your program

**The Three Rules you must memorize:**
1. **File name must match class name** (case-sensitive): class HelloWorld → file must be HelloWorld.java
2. **main method signature must be exact**: \`public static void main(String[] args)\`
3. **Every statement ends with a semicolon** (;)

**Understanding the main method signature:**
- \`public\` — accessible from anywhere (JVM must be able to call it)
- \`static\` — belongs to the class, not an instance (JVM calls it without creating an object)
- \`void\` — returns nothing
- \`main\` — the name the JVM looks for (hardcoded in the JVM spec)
- \`String[] args\` — array of command-line arguments

**Output methods:**
- \`System.out.println("text")\` — prints and adds a newline
- \`System.out.print("text")\` — prints without newline
- \`System.out.printf("Pi=%.2f\\n", 3.14)\` — formatted output (like C's printf)`,
  code: `// File: HelloWorld.java  ← MUST match class name exactly
public class HelloWorld {

    public static void main(String[] args) {

        // Basic output
        System.out.println("Hello, World!");    // adds newline
        System.out.print("No newline here");     // no newline
        System.out.println();                    // just a newline

        // printf-style formatted output
        System.out.printf("Name: %s, Age: %d, Score: %.1f%n",
                          "Alice", 25, 98.5);

        // Command-line arguments
        // Run with: java HelloWorld Alice 25
        if (args.length > 0) {
            System.out.println("Hello, " + args[0]);
        }

        // String concatenation
        String name = "Bob";
        int year = 2024;
        System.out.println(name + " started Java in " + year);
    }
}

// Compile: javac HelloWorld.java
// Run:     java HelloWorld
// Output:
//   Hello, World!
//   No newline here
//   Name: Alice, Age: 25, Score: 98.5`,
  codeTitle: 'HelloWorld.java — Complete First Program',
  points: [
    'If the file is named helloworld.java (lowercase) but the class is HelloWorld, javac throws: "class HelloWorld is public, should be declared in a file named HelloWorld.java"',
    'Java is case-sensitive everywhere: String and string are different. public and Public are different. System and system are different.',
    'The main method signature must be exact — you can write String args[] instead of String[] args (both are valid Java), but public static void main() with no parameters is NOT valid.',
    'System.out is a static field of type PrintStream on the System class. println, print, and printf are methods on PrintStream. You can also use System.err for error output.',
    '%n in printf is the platform-independent newline. \\n works too but may behave differently on Windows. Prefer %n in printf, \\n in regular string literals.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Beginners often forget the semicolon on statements. Java\'s error message is "reached end of file while parsing" or "semicolon expected" — both mean you forgot a semicolon (or a closing brace). The error line number in the message points to where the parser got confused, which may be one line AFTER the actual missing semicolon.',
    },
    {
      type: 'interview',
      content: 'Q: Why is the main method static?\nA: Because the JVM calls main() before any object of the class is created. A static method belongs to the class itself and can be called without an instance. If main were non-static, the JVM would need to instantiate the class first — but it cannot do that without a blueprint for the constructor, creating a circular dependency.',
    },
  ],
}
