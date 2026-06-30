export default {
  id: 'programming-fundamentals',
  title: 'Fundamentals of Programming',
  explanation: `A **program** is a set of instructions given to a computer to perform a specific task. The computer only understands binary (0s and 1s), so we use **programming languages** to write human-readable instructions that get converted into binary.

**Types of programming languages:**
- **Low-level languages** — Assembly, Machine code. Very close to hardware. Fast but hard to write.
- **High-level languages** — Java, Python, C++. Human-readable. Portable and easier to maintain.

**Memory units in a computer:**
Every piece of data in a program lives somewhere in memory. Understanding memory units helps you understand how variables and data types work in Java.

**Platform dependency** is the problem that compiled native programs (C/C++) produce machine code tied to a specific OS and CPU. A program compiled for Windows x64 cannot run on Linux ARM — you need to recompile for every platform.`,
  table: {
    headers: ['Unit', 'Size', 'What It Holds'],
    rows: [
      ['Bit', '0 or 1', 'Smallest unit of data'],
      ['Byte', '8 bits', 'One character (ASCII)'],
      ['Kilobyte (KB)', '1,024 bytes', 'Small text file'],
      ['Megabyte (MB)', '1,024 KB', 'A photo'],
      ['Gigabyte (GB)', '1,024 MB', 'A movie file'],
    ],
  },
  points: [
    'RAM (Random Access Memory) is volatile — data is lost when power is off. Your program\'s running data lives in RAM.',
    'CPU registers are the fastest storage (inside the CPU itself) — hold values being actively computed.',
    'Cache (L1/L2/L3) sits between CPU and RAM — faster than RAM, slower than registers.',
    'Platform dependency means code compiled for one OS/CPU cannot run on another without recompilation.',
    'Java solves platform dependency by compiling to bytecode (.class) instead of native machine code.',
  ],
  callouts: [
    {
      type: 'analogy',
      content: 'Think of RAM as your office desk — fast to access, but everything falls off when you leave (power off). Your hard drive is the filing cabinet — slow but permanent. CPU registers are your hands — you can only hold a few things at once, but instantly.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between compiled and interpreted languages?\nA: Compiled languages (C, C++) translate the entire source code to machine code BEFORE execution — faster at runtime, platform-specific. Interpreted languages (Python, older JavaScript) translate line-by-line at runtime — slower, but more portable. Java is BOTH: source compiles to bytecode (compiled), then JVM interprets/JIT-compiles bytecode at runtime.',
    },
    {
      type: 'important',
      content: '1 byte = 8 bits. This is why a Java byte type ranges from -128 to 127: 2^8 = 256 values split across negative and positive. Every Java primitive size you memorize (int = 4 bytes = 32 bits, long = 8 bytes = 64 bits) traces back to this.',
    },
  ],
}
