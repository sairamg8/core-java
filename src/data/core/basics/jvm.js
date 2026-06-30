export default {
  id: 'jvm-jdk-jre',
  title: '1. JVM vs JDK vs JRE',
  explanation: `Java's ecosystem rests on three pillars that every developer must understand clearly.

**JDK (Java Development Kit)** — Full developer package: compiler (javac), debugger, JRE, plus tools like javap, javadoc, jar.

**JRE (Java Runtime Environment)** — Used only to RUN programs. Contains JVM + standard libraries. No compiler.

**JVM (Java Virtual Machine)** — The engine that executes bytecode (.class files). Platform-specific binary, but the bytecode it runs is platform-neutral.

How Java achieves **WORA (Write Once Run Anywhere)**:
Source (.java) → javac → Bytecode (.class) → JVM → Machine code`,
  points: [
    'JVM performs JIT (Just-In-Time) compilation: hot bytecode is compiled to native machine code for speed',
    'JVM = Class Loader + Runtime Data Areas + Execution Engine',
    'Java 11+: standalone JRE is no longer distributed — JDK includes everything',
    '"javac -version" checks the compiler. "java -version" checks the runtime',
  ],
  code: `// File: Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}

// Step 1 — Compile to bytecode
// $ javac Hello.java   →  produces Hello.class

// Step 2 — JVM executes bytecode
// $ java Hello         →  Output: Hello, Java!

// The .class bytecode is identical on all platforms.
// Only the JVM binary differs per OS.`,
  callouts: [
    {
      type: 'analogy',
      content: 'Think of it like cooking. Your code is a recipe. The JVM is a chef who can cook that recipe in ANY kitchen in the world — Windows, Mac, or Linux. You write the recipe once; the chef handles each local stove. That is Java\'s superpower: write once, run anywhere.\n\nAnd the three acronyms? JDK = the full kitchen you install to WRITE Java. JRE = just enough to RUN a finished dish. JVM = the chef itself. You do not need to memorize the chef\'s every move to start cooking.',
    },
    {
      type: 'interview',
      content: 'Q: Is Java compiled or interpreted?\nA: Both. Source code compiles to bytecode (compiled). The JVM interprets bytecode OR uses JIT to convert hot paths to native machine code at runtime.',
    },
    {
      type: 'gotcha',
      content: 'If "javac" is not found, you only have JRE installed — not JDK. Install JDK to get the compiler.',
    },
  ],
}
