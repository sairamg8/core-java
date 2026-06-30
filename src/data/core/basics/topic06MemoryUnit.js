export default {
  id: 'memory-unit',
  title: '6. Memory Unit in a Computer',
  explanation: `Understanding memory is fundamental to understanding Java variables, data types, and the JVM itself. Every piece of data in a running program lives somewhere in the memory hierarchy.

**The Memory Hierarchy (fastest to slowest):**

**1. CPU Registers**
Inside the CPU itself. Hold the values currently being computed. Nanosecond access. Tiny — typically 16 to 64 registers on a modern CPU. The compiler and JIT decide what goes here.

**2. CPU Cache (L1 / L2 / L3)**
On or near the CPU chip. L1 is the fastest (a few KB), L3 is the largest (up to 32MB on modern CPUs). Automatically caches recently accessed RAM values. Cache misses are a major source of performance problems in data-intensive Java code.

**3. RAM (Main Memory)**
Where your running Java program lives — heap, stack, method area, all of it. Volatile: data is lost when power is cut. Modern machines have 8–64 GB. Access takes ~100 nanoseconds (1000x slower than L1 cache).

**4. Storage (SSD / HDD)**
Persistent storage. Where your .java and .class files live on disk. Access takes microseconds to milliseconds. Java's File I/O and serialization APIs interact with this layer.

**Memory units (the math you need for Java):**`,
  table: {
    headers: ['Unit', 'Size', 'Java Relevance'],
    rows: [
      ['Bit', '0 or 1', 'Smallest unit — boolean in memory is technically 1 bit (JVM stores it as int)'],
      ['Byte', '8 bits', 'Java byte type: range -128 to 127 (2^8 = 256 values)'],
      ['Kilobyte (KB)', '1,024 bytes', 'Default JVM thread stack size: ~512 KB'],
      ['Megabyte (MB)', '1,024 KB', '-Xss1m sets stack to 1 MB; -Xmx512m sets max heap to 512 MB'],
      ['Gigabyte (GB)', '1,024 MB', 'Production JVMs typically have 2–8 GB heap (-Xmx8g)'],
    ],
  },
  points: [
    'Java hides memory addresses from you (no pointers) — but the JVM still uses addresses internally. Garbage Collection is possible because the JVM tracks every reference.',
    '1 byte = 8 bits. This is why a Java byte ranges from -128 to 127: 2^8 = 256 total values, split between negative and positive including zero.',
    'An int in Java is always 4 bytes (32 bits) regardless of the OS. This is part of Java\'s portability guarantee — C int size varies by platform.',
    'RAM is volatile. If you want data to survive after the JVM stops, you must persist it: write to a file, database, or external service.',
    'The JVM heap is where objects live. The stack is where method call frames and local primitives live. Understanding this distinction explains NullPointerException and StackOverflowError.',
  ],
  callouts: [
    {
      type: 'analogy',
      content: 'Registers are your hands — you can only hold a few things but can work with them instantly. Cache is your desk — nearby and fast. RAM is a nearby shelf — takes a moment to reach. Disk is a warehouse — large but far away.',
    },
    {
      type: 'important',
      content: '1 byte = 8 bits — memorize this. From this one fact you can derive: byte (-128 to 127), short (2 bytes, -32768 to 32767), int (4 bytes, ~±2 billion), long (8 bytes, ~±9 quintillion). These Java primitive size guarantees are one of the language\'s portability pillars.',
    },
  ],
}
