export default {
  id: 'platform-dependency',
  title: '7. Platform and Platform Dependency',
  explanation: `**Platform dependency** is the reason Java was invented. Understanding it makes Java's design decisions immediately clear.

**What is a "platform"?**
A platform is a combination of:
- The **operating system** (Windows, Linux, macOS)
- The **CPU architecture** (x86-64, ARM, RISC-V)

These two together determine what binary format your compiled code must be in to run.

**The platform dependency problem:**
When you compile a C or C++ program, the compiler translates your source code directly into **native machine code** — binary instructions specific to the target CPU and OS. A program compiled for Windows x86-64:
- Cannot run on Linux (different OS system calls)
- Cannot run on macOS ARM (different CPU instruction set)
- Requires recompilation for every new platform

This was a massive problem in the 1990s when the internet was emerging and developers needed programs that ran on every user's machine regardless of OS.

**The cost of platform dependency:**
- **Recompile for every OS/CPU combination** — a project targeting Windows, Linux, and macOS with Intel and ARM variants means 6 separate build targets
- **Different library versions** — Windows uses .dll, Linux uses .so, macOS uses .dylib
- **OS-specific bugs** — file path separators (\`\\\` vs \`/\`), newline characters (\`\\r\\n\` vs \`\\n\`), threading models

**How Java addresses this:** See Topic 8 (WORA).`,
  code: `// Platform dependency in C (conceptual)
// Compile on Windows:  gcc hello.c -o hello.exe
// Compile on Linux:    gcc hello.c -o hello
// These produce DIFFERENT binaries — neither runs on the other OS

// Java solution: compile ONCE to bytecode
// Compile:  javac Hello.java  →  Hello.class (bytecode, platform-neutral)
// Run anywhere:  java Hello   (JVM handles the platform-specific part)

// The same Hello.class file runs on:
//   java Hello       (Linux x86)
//   java Hello       (Windows x86)
//   java Hello       (macOS ARM)
// All produce identical output`,
  codeTitle: 'Platform Dependency — C vs Java',
  points: [
    'Platform dependency is not just about OS — it includes CPU architecture. An x86 binary will not run on ARM without a compatibility layer (like Apple Rosetta).',
    'Operating systems expose different APIs (system calls). Even the same language may produce different behavior on different OSes if it touches file paths, networking, or processes.',
    'Java still has some platform-aware code: File.separator (\'/\' on Unix, \'\\\\\' on Windows), line.separator, etc. But these edge cases are isolated and manageable.',
    'Docker solves platform dependency at a different level — by packaging the OS alongside the application. Java solves it at the language level by abstracting the OS away.',
    'Native Java (GraalVM) compiles Java to native machine code — trading the WORA portability for faster startup and lower memory. A deliberate tradeoff for specific use cases.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is platform dependency and how does Java solve it?\nA: Platform dependency means a compiled program only runs on the specific OS and CPU it was compiled for. Java solves it by compiling to bytecode — an intermediate, platform-neutral binary format. The JVM (which is platform-specific and installed on the target machine) translates bytecode to native code at runtime. You ship one bytecode file; the JVM handles the rest.',
    },
    {
      type: 'analogy',
      content: 'Platform dependency is like a recipe written only in French — only French-speaking cooks can use it. Java bytecode is like a universal recipe format that any trained chef (JVM) can read, regardless of their native language (OS/CPU).',
    },
  ],
}
