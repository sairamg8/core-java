export default {
  id: 'need-for-array',
  title: '39. Need for an Array',
  explanation: `An **array** is a fixed-size, ordered container that holds multiple values of the **same type** under a single variable name. Without arrays, you would need a separate variable for each value:

\`\`\`java
int score1 = 85, score2 = 90, score3 = 78; // unmanageable at scale
\`\`\`

With an array:
\`\`\`java
int[] scores = {85, 90, 78}; // one variable, three values, indexable
\`\`\`

**Why arrays exist:**
- **Group related data** — all student grades, all pixel values, all temperatures
- **Loop-driven processing** — iterate over all elements without naming each one
- **Fixed, predictable size** — arrays are contiguous in memory; element access is O(1)
- **Pass collections to methods** — instead of dozens of parameters

**Key properties:**
- **Zero-indexed:** first element is at index 0, last is at index \`length - 1\`
- **Fixed length:** set at creation, cannot grow or shrink
- **Same type:** all elements must be the same declared type (or a subtype for objects)
- **Stored on the heap:** like all objects; the variable holding the array is a reference

**When NOT to use arrays:**
- When size is unknown or dynamic → use \`ArrayList\`
- When you need key-value lookup → use \`HashMap\`
- When you need unique elements → use \`HashSet\`

Arrays are the foundation — understanding them makes Collections and Streams much easier to learn.`,
  code: `public class NeedForArray {
    public static void main(String[] args) {
        // Without array: not scalable
        int s1 = 80, s2 = 90, s3 = 75, s4 = 95, s5 = 88;
        int manualAvg = (s1 + s2 + s3 + s4 + s5) / 5;
        System.out.println("Manual avg: " + manualAvg);

        // With array: scalable, loopable
        int[] scores = {80, 90, 75, 95, 88};
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        System.out.println("Array avg:  " + sum / scores.length); // same result

        // Array enables passing all values in one method call
        System.out.println("Max score: " + max(scores));

        // Array of strings
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri"};
        System.out.println("Midweek: " + days[2]); // Wed (0-indexed)

        // Length property (not a method — no parentheses)
        System.out.println("Days count: " + days.length); // 5
    }

    static int max(int[] arr) {
        int m = arr[0];
        for (int x : arr) if (x > m) m = x;
        return m;
    }
}`,
  codeTitle: 'Why Arrays Are Essential',
  points: [
    'Arrays group related values under one variable, making loops and method calls practical',
    'Array elements are accessed in O(1) time because memory is contiguous — index arithmetic is instant',
    'Arrays are objects in Java — the variable holds a reference, and the data lives on the heap',
    'length is a field, not a method — use arr.length (not arr.length())',
    'Arrays are zero-indexed: arr[0] is the first element, arr[arr.length-1] is the last',
    'When size needs to be dynamic, use ArrayList; arrays are ideal when size is fixed and known at creation',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Accessing an index outside 0 to length-1 throws ArrayIndexOutOfBoundsException at runtime. Always use < arr.length (not <= arr.length) in loop conditions.',
    },
    {
      type: 'tip',
      content: 'The enhanced for-each (for (int x : arr)) is the cleanest way to iterate over all elements. Use the classic indexed for loop only when you need the index value itself.',
    },
    {
      type: 'interview',
      content: 'Q: What are the limitations of arrays in Java?\nA: Fixed size (cannot resize), same type only, no built-in methods for search/sort (must use Arrays utility), and no dynamic features. Use ArrayList when you need resizability.',
    },
  ],
}
