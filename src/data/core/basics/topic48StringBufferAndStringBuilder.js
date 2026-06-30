export default {
  id: 'stringbuffer-and-stringbuilder',
  title: '48. StringBuffer and StringBuilder',
  explanation: `**StringBuilder** and **StringBuffer** are mutable string classes that allow in-place character sequence modification without creating new objects. They are backed by a resizable \`char[]\` (or \`byte[]\` from Java 9+).

**Key API (same for both):**
| Method | Effect |
|--------|--------|
| \`append(x)\` | add x at end |
| \`insert(i, x)\` | insert x at index i |
| \`delete(s, e)\` | remove chars from s (inclusive) to e (exclusive) |
| \`deleteCharAt(i)\` | remove char at index i |
| \`replace(s, e, str)\` | replace slice with str |
| \`reverse()\` | reverse in place |
| \`charAt(i)\` | get char at i |
| \`setCharAt(i, c)\` | set char at i |
| \`length()\` | current length |
| \`capacity()\` | internal buffer size (≥ length) |
| \`toString()\` | convert back to String |

**Internal capacity:**
Default initial capacity is 16. When the buffer fills up, it doubles (new capacity = 2 × old + 2). You can set the initial capacity to avoid re-allocations: \`new StringBuilder(1000)\`.

**StringBuilder vs StringBuffer:**
- Both extend \`AbstractStringBuilder\`
- StringBuffer: every method is \`synchronized\` → thread-safe but slower
- StringBuilder: no synchronization → faster, single-thread use only
- In practice, StringBuffer is rarely needed — use \`volatile\` or concurrent queues for multi-threaded string work

**Common pattern:**
\`\`\`java
StringBuilder sb = new StringBuilder();
for (String item : list) {
    sb.append(item).append(",");
}
sb.deleteCharAt(sb.length() - 1); // remove trailing comma
return sb.toString();
\`\`\``,
  code: `public class StringBufferAndBuilder {
    public static void main(String[] args) {
        // StringBuilder: full method demonstration
        StringBuilder sb = new StringBuilder("Java");
        System.out.println(sb.length());    // 4
        System.out.println(sb.capacity());  // 20 (16 + 4 initial)

        sb.append(" Bible");              // "Java Bible"
        sb.insert(4, " is a");           // "Java is a Bible"
        sb.replace(10, 15, "great book"); // "Java is a great book"
        sb.delete(9, 11);                 // "Java is a great book" → adjust if needed
        System.out.println(sb);

        sb.reverse();
        System.out.println(sb);

        // Chain pattern: join with delimiter
        String[] words = {"one", "two", "three"};
        StringBuilder joined = new StringBuilder();
        for (String w : words) {
            joined.append(w).append("-");
        }
        joined.deleteCharAt(joined.length() - 1); // remove trailing dash
        System.out.println(joined); // one-two-three

        // indexOf, charAt, setCharAt
        StringBuilder s = new StringBuilder("hello world");
        System.out.println(s.indexOf("world")); // 6
        s.setCharAt(0, 'H');
        System.out.println(s); // Hello world

        // StringBuffer: same API, synchronized
        StringBuffer buf = new StringBuffer(50); // pre-size to avoid realloc
        for (int i = 0; i < 5; i++) buf.append(i).append(",");
        buf.deleteCharAt(buf.length() - 1);
        System.out.println(buf); // 0,1,2,3,4
    }
}`,
  codeTitle: 'StringBuilder and StringBuffer — Full API Walkthrough',
  points: [
    'StringBuilder and StringBuffer share the same API (both extend AbstractStringBuilder); only difference is synchronization',
    'append() returns the same StringBuilder instance, enabling fluent chaining: sb.append("a").append("b")',
    'reverse() is a common coding interview operation — StringBuilder.reverse() does it in one call',
    'Initial capacity defaults to 16; specify a larger capacity if you know the expected size to avoid re-allocations',
    'delete(start, end) is exclusive at end: delete(0, 3) removes indices 0, 1, 2',
    'toString() converts the buffer to an immutable String — call it once at the end, not inside a loop',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'To reverse a String in Java, the idiomatic one-liner is: new StringBuilder(str).reverse().toString(). This is the expected answer in interviews asking to reverse a string without a library.',
    },
    {
      type: 'gotcha',
      content: 'delete(s, e) uses exclusive end index, like substring. delete(0, 3) removes the first 3 characters (indices 0, 1, 2). Getting this wrong by off-by-one is a common source of bugs.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use StringBuffer over StringBuilder?\nA: Only when the same buffer is accessed by multiple threads concurrently without other synchronization. In practice this is rare — prefer StringBuilder + external synchronization or a concurrent design over StringBuffer.',
    },
  ],
}
