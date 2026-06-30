export default {
  id: 'java-intro',
  title: 'Introduction to Java & Your First Program',
  explanation: `**Java** was created by James Gosling at Sun Microsystems in 1995. Originally designed for interactive television, it became the world's most used programming language because of one key idea: **WORA — Write Once, Run Anywhere**.

**Key features of Java:**
- **Platform-independent** — Compile once, run on any OS with a JVM
- **Object-Oriented** — Everything is organized into classes and objects
- **Strongly typed** — Every variable must declare its type at compile time
- **Automatic memory management** — Garbage Collector frees memory you no longer use
- **Robust** — No pointer arithmetic, array bounds checking, exception handling
- **Multithreaded** — Built-in support for running code concurrently

**How Java code goes from text to execution:**
\`\`.java source\`\` → \`\`javac\`\` compiler → \`\`.class bytecode\`\` → JVM → runs on ANY OS

**Setting up Java:**
1. Download the JDK (Java Development Kit) from [https://adoptium.net](https://adoptium.net)
2. Install it — the installer sets up \`\`javac\`\` and \`\`java\`\` commands
3. Verify: open terminal, run \`\`java -version\`\` and \`\`javac -version\`\`
4. Choose any IDE: IntelliJ IDEA (recommended), VS Code with Extension Pack for Java, or Eclipse`,
  code: `// File: HelloWorld.java
// Rule 1: Filename MUST match the public class name (case-sensitive)
// Rule 2: Every Java program needs a main() method — it's the entry point

public class HelloWorld {

    // main() is where execution begins
    // "public" — JVM can call it from outside
    // "static"  — no object needed to call it
    // "void"    — returns nothing
    // "String[] args" — command-line arguments
    public static void main(String[] args) {
        System.out.println("Hello, World!");  // println adds newline
        System.out.print("No newline here");  // print does not add newline
        System.out.printf("Pi is %.2f%n", 3.14159);  // formatted output
    }
}

// How to compile and run:
// $ javac HelloWorld.java   →  creates HelloWorld.class (bytecode)
// $ java HelloWorld         →  JVM loads and runs HelloWorld.class
// Output:
// Hello, World!
// No newline herePi is 3.14`,
  codeTitle: 'HelloWorld.java',
  points: [
    'The filename MUST exactly match the public class name including capitalization — HelloWorld.java contains class HelloWorld',
    'Java uses PascalCase for class names (HelloWorld), camelCase for methods and variables (myMethod)',
    'System.out.println() = System (class) . out (static field, a PrintStream) . println() (method)',
    'Every statement ends with a semicolon (;). Forgetting it is the #1 compile error for beginners.',
    'Java is case-sensitive: String is not the same as string. Public is not the same as public.',
    'The .class file is portable — copy it to any machine with JVM and it runs.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you name your file helloworld.java (all lowercase) but the class is named HelloWorld, javac will throw an error: "class HelloWorld is public, should be declared in a file named HelloWorld.java". Always match the filename to the class name exactly.',
    },
    {
      type: 'interview',
      content: 'Q: Why is the main method static?\nA: Because the JVM needs to call main() before any object of the class is created. A static method belongs to the class itself — no instance required. If main were non-static, the JVM would need to instantiate the class first, which creates a chicken-and-egg problem.',
    },
    {
      type: 'note',
      content: 'Java 21+ introduced "unnamed classes" for simple programs (no class declaration needed). But the traditional public class + main() is still the standard you will see in 99% of codebases and exams.',
    },
  ],
}
