export default {
  id: 'string-builders',
  title: '3. StringBuilder vs StringBuffer vs String',
  explanation: `For mutable string building, use **StringBuilder** (single-threaded) or **StringBuffer** (thread-safe but slower).`,
  table: {
    headers: ['Feature', 'String', 'StringBuilder', 'StringBuffer'],
    rows: [
      ['Mutable', 'No', 'Yes', 'Yes'],
      ['Thread-safe', 'Yes (immutable)', 'No', 'Yes (synchronized)'],
      ['Performance', 'Slow (new objects)', 'Fastest', 'Slower (sync overhead)'],
      ['Storage', 'String Pool / Heap', 'Heap', 'Heap'],
      ['Use when', 'Fixed value', 'Single thread', 'Multi-threaded'],
    ],
  },
  code: `// StringBuilder — mutable, NOT thread-safe, preferred for single-threaded
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");         // in-place mutation, no new object
sb.insert(5, ",");           // "Hello, World"
sb.delete(5, 6);             // "Hello World"
sb.replace(6, 11, "Java");   // "Hello Java"
sb.reverse();                // "avaJ olleH"
sb.setCharAt(0, 'J');        // "JavaJ olleH"

// Chaining — each method returns 'this'
String result = new StringBuilder()
    .append("Java")
    .append(" ")
    .append("Bible")
    .toString();    // "Java Bible"

// Capacity — default 16 chars, doubles when exceeded
StringBuilder sb2 = new StringBuilder(100); // pre-size for known large output

// StringBuffer — same API as StringBuilder but synchronized
StringBuffer buf = new StringBuffer("safe");
buf.append(" thread");  // synchronized — slower than StringBuilder

// Efficient string building pattern
String buildCSV(List<String> items) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < items.size(); i++) {
        if (i > 0) sb.append(',');
        sb.append(items.get(i));
    }
    return sb.toString();
}

// String.join() — cleaner for joining with delimiter (Java 8+)
String csv = String.join(",", "a", "b", "c");  // "a,b,c"
String joined = String.join("-", List.of("x", "y")); // "x-y"`,
  points: [
    'StringBuilder initial capacity is 16 chars. Appending beyond that triggers a resize (doubles + 2)',
    'For heavy multi-threaded string building, consider using thread-local StringBuilder instead of StringBuffer',
    'Java compiler automatically converts simple string concatenation (+) to StringBuilder in most cases',
    'String.format() and printf() are useful for formatted output but slower than StringBuilder for heavy use',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: When would you use StringBuffer over StringBuilder?\nA: StringBuffer is synchronized — use it when multiple threads are building the same string. In practice this is rare; it\'s usually better to use StringBuilder with proper thread isolation. StringBuffer exists mainly for legacy code.',
    },
    {
      type: 'gotcha',
      content: 'The Java compiler converts "a" + "b" + "c" in a loop to StringBuilder internally, BUT it may create a new StringBuilder per loop iteration for complex concatenation. Always use an explicit StringBuilder outside the loop body for performance.',
    },
  ],
}
