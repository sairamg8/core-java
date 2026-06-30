export default {
  id: 'how-java-wora',
  title: '8. How Java Became Platform Independent (WORA)',
  explanation: `**WORA** — Write Once, Run Anywhere — is Java's foundational design principle. It is the direct answer to the platform dependency problem.

**The Two-Step Compilation Model:**

**Step 1: javac (Java Compiler)**
Translates \`.java\` source code into \`.class\` files containing **bytecode** — a set of instructions for an imaginary machine called the Java Virtual Machine (JVM). Bytecode is NOT native machine code. It does not know about Windows or Linux or ARM. It is a compact, binary format that any JVM can understand.

**Step 2: JVM (Java Virtual Machine)**
The JVM is the platform-specific piece. Oracle, IBM, and others ship JVM implementations for Windows, Linux, macOS, ARM, x86, etc. When you run \`java MyApp\`, the JVM:
1. Loads the \`.class\` bytecode into memory
2. Verifies the bytecode for security (prevents malicious class files)
3. Interprets bytecode instructions into native machine code
4. JIT-compiles (Just-In-Time) hot code paths to native code for performance
5. Manages memory (heap, stack, GC)

**Why this achieves WORA:**
The \`.class\` file you compile on your Mac is bit-for-bit identical to what runs on a Linux server or Windows laptop — as long as both have a compatible JVM installed. You ship the bytecode; the JVM handles the rest.

**JVM Languages (bonus insight):**
Because the JVM is a general-purpose bytecode executor, other languages compile to JVM bytecode too: Kotlin, Scala, Groovy, Clojure. This is why "JVM ecosystem" is a better mental model than "Java ecosystem."`,
  code: `// The WORA pipeline in practice:

// 1. Write source code (once)
// File: Main.java
public class Main {
    public static void main(String[] args) {
        System.out.println("Running on: " + System.getProperty("os.name"));
    }
}

// 2. Compile to bytecode (once, on any machine)
//    $ javac Main.java
//    Output: Main.class  ← this is bytecode, not machine code

// 3. Run anywhere (multiple times, on any JVM)
//    $ java Main
//    On Linux:   Running on: Linux
//    On Windows: Running on: Windows 11
//    On macOS:   Running on: Mac OS X
//    (SAME .class file, different JVMs, same bytecode behavior)

// You can inspect bytecode with: javap -c Main.class`,
  codeTitle: 'WORA: Compile Once, Run Anywhere',
  points: [
    'Bytecode is an intermediate representation — not native machine code, but not source code either. It is designed to be compact, fast to interpret, and safe to verify.',
    'The JVM verification step is a security feature: it checks that bytecode does not perform illegal memory accesses or type violations before executing.',
    'JIT compilation is why Java performance rivals C++ in many benchmarks. The JVM profiles which methods are "hot" (called frequently) and compiles them to optimized native code.',
    'Java version compatibility: a .class file compiled with Java 17 will not run on a JVM older than Java 17. The version is encoded in the .class header (class file version number).',
    'The JRE (Java Runtime Environment) = JVM + standard library. The JDK (Java Development Kit) = JRE + compiler (javac) + development tools. You need the JDK to develop; the JRE to just run.',
  ],
  callouts: [
    {
      type: 'note',
      content: 'JVM is a specification, not just one implementation. OpenJDK (open-source reference implementation), GraalVM (polyglot, native compilation), Amazon Corretto, Eclipse Adoptium, Azul Zulu — all are valid JVMs. They all run the same bytecode.',
    },
    {
      type: 'interview',
      content: 'Q: Explain WORA and how Java achieves it.\nA: WORA = Write Once, Run Anywhere. Java achieves it via two-stage compilation. Stage 1: javac compiles source to bytecode (.class files) — platform-neutral intermediate code. Stage 2: the JVM interprets bytecode, applying JIT compilation for hot paths, on the specific OS/CPU. The bytecode is identical everywhere; only the JVM is platform-specific. You compile once; the JVM handles platform differences at runtime.',
    },
  ],
}
