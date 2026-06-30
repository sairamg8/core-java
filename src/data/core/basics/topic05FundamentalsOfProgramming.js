export default {
  id: 'fundamentals-of-programming',
  title: '5. Fundamentals of Programming',
  explanation: `A **program** is a set of instructions given to a computer to perform a specific task. The computer only understands binary (0s and 1s), so programming languages let humans write instructions that compilers/interpreters translate into binary.

**Classification of programming languages:**

**By level of abstraction:**
- **Low-level languages** (Assembly, Machine code) — Extremely close to hardware. Instructions map almost 1:1 to CPU operations. Fast, but hard to write and completely platform-specific.
- **High-level languages** (Java, Python, C++) — Human-readable. A single \`for\` loop in Java becomes dozens of CPU instructions. Portable and maintainable.

**By execution model:**
- **Compiled** (C, C++, Rust) — Entire source code is translated to machine code BEFORE execution. Fast at runtime, but the executable is platform-specific (a Windows .exe won't run on Linux).
- **Interpreted** (Python, Ruby, older JS) — Source code is translated and executed line-by-line at runtime. Portable, but slower — the interpreter itself is doing extra work during execution.
- **Hybrid** (Java, Kotlin) — Source compiles to bytecode (platform-neutral), then the JVM interprets/JIT-compiles the bytecode to native code at runtime. Gets most benefits of both worlds.

**How a program is executed:**
1. You write source code (text)
2. The compiler checks for syntax errors and translates to machine instructions
3. The OS loads the program into RAM
4. The CPU fetches instructions one by one and executes them
5. Results are written back to memory or I/O devices`,
  code: `// This is a Java source file: HelloWorld.java
// Step 1: compile with javac → produces HelloWorld.class (bytecode)
// Step 2: run with java → JVM interprets bytecode

public class HelloWorld {
    public static void main(String[] args) {
        // The simplest Java program
        System.out.println("Hello, World!"); // prints with newline
        System.out.print("No newline");      // prints without newline
    }
}

// Compile: javac HelloWorld.java  → HelloWorld.class
// Run:     java HelloWorld        → Hello, World!`,
  codeTitle: 'HelloWorld.java — The Classic First Program',
  points: [
    'Programs are sequences of instructions, but their power comes from conditionals (if/else) and loops — the two constructs that make programs adaptive and repetitive.',
    'A compiled language (C) cannot run its output on a different architecture without recompiling. Java\'s bytecode runs on any machine with a JVM — this is the WORA advantage.',
    'Syntax errors are caught at compile time (before the program runs). Logic errors allow the program to run but produce wrong results — much harder to catch.',
    'Every programming language exists on a spectrum of abstraction. The higher the level, the more the language does for you, and the less control you have over hardware.',
    'Java is both compiled (to bytecode) and interpreted (by the JVM\'s JIT compiler). JIT stands for Just-In-Time — it compiles hot code paths to native machine code while the program runs.',
  ],
  callouts: [
    {
      type: 'analogy',
      content: 'A program is like a recipe. The ingredients are data (variables). The steps are instructions (methods). The dish is the output. Just as a recipe can be executed by any capable cook, Java bytecode can be "executed" by any JVM — on any operating system.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between compiled and interpreted languages?\nA: Compiled languages translate ALL source code to machine code before execution (fast runtime, platform-specific). Interpreted languages translate and execute line-by-line at runtime (portable, slower). Java is hybrid: source compiles to bytecode (compiled step), then the JVM interprets/JIT-compiles at runtime (interpreted step). This gives Java portability AND near-native performance.',
    },
  ],
}
