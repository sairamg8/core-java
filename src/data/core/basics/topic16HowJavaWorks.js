export default {
  id: 'how-java-works',
  title: '16. How Java Works',
  explanation: `Understanding exactly what happens when you type \`javac HelloWorld.java\` and then \`java HelloWorld\` is essential. This knowledge explains error messages, performance, and why Java behaves the way it does.

**The complete Java execution pipeline:**

**Stage 1 — Source Code (.java)**
You write human-readable Java in a .java file. This is plain text. The compiler reads it.

**Stage 2 — javac: Compilation**
The Java compiler (\`javac\`) performs:
1. **Lexical analysis** — tokenizes source into keywords, identifiers, operators, literals
2. **Parsing** — builds an Abstract Syntax Tree (AST) from the token stream
3. **Semantic analysis** — type checking, scope resolution, overload resolution
4. **Bytecode generation** — outputs a .class file containing JVM bytecode

If any step fails, you get a compile error. The program does not run at all.

**Stage 3 — .class: Bytecode**
The .class file contains JVM bytecode — a compact binary format with instructions like \`iload_1\`, \`iadd\`, \`invokevirtual\`. It is platform-neutral.

**Stage 4 — JVM: Class Loading**
When you run \`java HelloWorld\`:
1. The ClassLoader finds and loads HelloWorld.class (and its dependencies)
2. The bytecode verifier checks for illegal operations (security gate)
3. The JVM locates the \`main\` method and begins execution

**Stage 5 — JIT: Just-In-Time Compilation**
The JVM starts by interpreting bytecode. It profiles execution — tracking which methods are called frequently ("hot spots"). Hot methods are compiled to native machine code by the JIT compiler (C1/C2 compilers in HotSpot). After warmup, the JVM runs optimized native code — comparable to C++ performance.

**Stage 6 — Garbage Collection**
The GC runs concurrently (in modern JVMs like G1, ZGC, Shenandoah). It identifies objects with no live references and frees their heap memory. You never call free() in Java — the GC handles it.`,
  code: `// Visualize the pipeline:

// Source: Hello.java
public class Hello {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int sum = x + y;
        System.out.println("Sum: " + sum);
    }
}

// Step 1: Compile
//   javac Hello.java  →  Hello.class (bytecode)

// Step 2: Inspect bytecode (educational)
//   javap -c Hello
// Partial output:
//   public static void main(java.lang.String[]);
//     Code:
//        0: bipush        10       // push 10
//        2: istore_1               // store in variable 1 (x)
//        3: bipush        20       // push 20
//        5: istore_2               // store in variable 2 (y)
//        6: iload_1                // load x
//        7: iload_2                // load y
//        8: iadd                   // add top two stack values
//        9: istore_3               // store in variable 3 (sum)
//       ...

// Step 3: Run
//   java Hello
//   Output: Sum: 30`,
  codeTitle: 'Java Execution Pipeline Walkthrough',
  points: [
    'Compile-time errors (syntax, type mismatches) prevent the program from running at all. Runtime errors (NullPointerException, ArrayIndexOutOfBoundsException) crash the running program. Logic errors produce wrong output silently.',
    'The JVM is a stack-based virtual machine. Bytecode instructions push and pop values on an operand stack. This is why bytecode has instructions like iload (push int), istore (pop and save), iadd (pop two, push sum).',
    'JVM startup time is the reason Java apps "feel slow to start." JIT warmup takes time. GraalVM Native Image solves this by compiling to native binary ahead of time — at the cost of some runtime optimizations.',
    'javap is a JDK tool that disassembles .class files into human-readable bytecode. It is valuable for understanding what the compiler generates from your source code.',
    'The ClassLoader system is hierarchical: Bootstrap → Platform → Application. Custom ClassLoaders enable dynamic loading of plugins, frameworks, and bytecode transformation (how Hibernate and Spring work under the hood).',
  ],
  callouts: [
    {
      type: 'note',
      content: 'Java 21 virtual threads (Project Loom) changed how the JVM handles threading. A virtual thread is a lightweight thread managed by the JVM scheduler, not the OS. You can create millions of them. This makes the traditional thread-per-request model viable even at high concurrency.',
    },
    {
      type: 'interview',
      content: 'Q: Describe the Java execution model from source code to output.\nA: 1) javac compiles .java source to .class bytecode (compile time). 2) JVM ClassLoader loads .class files. 3) Bytecode verifier checks for safety. 4) JVM interpreter begins executing bytecode. 5) JIT compiler profiles and compiles hot methods to native code. 6) Garbage Collector manages heap memory concurrently. The result: bytecode portability + near-native performance after warmup.',
    },
  ],
}
