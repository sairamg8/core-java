export default {
  id: 'jdk-jre-jvm',
  title: '35. JDK, JRE, and JVM',
  explanation: `Java code runs through three layered components: JDK, JRE, and JVM. Understanding their distinction is essential for setting up environments and debugging execution issues.

**JVM — Java Virtual Machine**
The JVM is an abstract computing machine that:
- Loads and verifies bytecode (\`.class\` files)
- Interprets bytecode or JIT-compiles it to native machine code
- Manages memory (heap, stack, method area, garbage collection)
- Enforces security and type safety

The JVM is **platform-specific** — there is a Windows JVM, a Linux JVM, a macOS JVM. But they all run the same bytecode, which is what makes Java "write once, run anywhere."

**JRE — Java Runtime Environment**
JRE = JVM + core Java class libraries (java.lang, java.util, java.io, etc.)

The JRE is what **end-users install** to run Java applications. It does not include development tools (javac, javadoc, jdb).

**JDK — Java Development Kit**
JDK = JRE + development tools (javac compiler, javadoc, jar, jdb debugger, etc.)

The JDK is what **developers install** to write and compile Java code. If you have the JDK, you automatically have the JRE and JVM.

**Flow:**
\`\`\`
Source (.java) → [javac compiler] → Bytecode (.class) → [JVM] → Native execution
\`\`\`

**Since Java 9:** The JRE as a separate download was deprecated. OpenJDK distributions ship the JDK only, and \`jlink\` can build a custom minimal runtime for deployment.`,
  code: `// This file runs on any JVM regardless of OS
public class JdkJreJvm {
    public static void main(String[] args) {
        // Query JVM/JDK info at runtime
        System.out.println("Java version: " + System.getProperty("java.version"));
        System.out.println("JVM vendor:   " + System.getProperty("java.vendor"));
        System.out.println("JVM name:     " + System.getProperty("java.vm.name"));
        System.out.println("OS:           " + System.getProperty("os.name"));

        // The same bytecode (.class file) produced by javac runs on
        // Windows, Linux, macOS — thanks to the platform-specific JVM layer
        Runtime rt = Runtime.getRuntime();
        System.out.println("Available CPUs: " + rt.availableProcessors());
        System.out.println("Max heap:       " + rt.maxMemory() / (1024 * 1024) + " MB");
    }
}
// Compile:  javac JdkJreJvm.java   (JDK tool)
// Run:      java JdkJreJvm         (JRE/JVM)`,
  codeTitle: 'Runtime Environment Introspection',
  points: [
    'JVM is the runtime engine — it executes bytecode, manages memory, and provides GC; it is platform-specific',
    'JRE = JVM + standard class libraries; the minimum needed to run compiled Java programs',
    'JDK = JRE + development tools (javac, javadoc, jar, jdb); what developers install',
    'javac compiles .java source to .class bytecode — not machine code — so the bytecode is platform-neutral',
    'JIT (Just-In-Time) compilation inside the JVM converts hot bytecode to native instructions at runtime for speed',
    'Since Java 9, JRE is no longer a separate download; jlink lets you build a minimal custom runtime image',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'When asked "why is Java platform-independent?": the answer is bytecode + JVM. javac compiles to bytecode (not native code), and each OS ships its own JVM that can execute that same bytecode.',
    },
    {
      type: 'gotcha',
      content: 'Having the JRE installed is not enough to run javac — you need the full JDK. If you see "javac is not recognized as a command", you installed the JRE only, not the JDK.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between JDK, JRE, and JVM?\nA: JVM executes bytecode; JRE = JVM + standard libraries (enough to run programs); JDK = JRE + compiler + dev tools (needed to develop programs). They are nested: JDK ⊃ JRE ⊃ JVM.',
    },
  ],
}
