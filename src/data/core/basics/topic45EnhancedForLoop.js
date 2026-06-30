export default {
  id: 'enhanced-for-loop',
  title: '45. Enhanced For Loop',
  explanation: `The **enhanced for loop** (also called for-each) was introduced in Java 5. It provides a cleaner syntax for iterating over arrays and any class that implements \`Iterable\` (all Collection types).

**Syntax:**
\`\`\`java
for (ElementType variable : arrayOrCollection) {
    // use variable
}
\`\`\`

**Under the hood:**
- For arrays: the compiler translates it to a classic indexed for loop
- For Iterable: the compiler calls \`iterator()\`, then \`hasNext()\` and \`next()\`

**When to use enhanced for:**
✅ You want every element, in order
✅ You do not need the index
✅ You are not modifying the collection/array size during iteration
✅ You want clean, readable code

**When NOT to use enhanced for:**
❌ You need the current index (use classic \`for (int i = 0; ...)\`)
❌ You need to iterate backwards
❌ You need to modify elements in a primitive array (changes to \`x\` don't affect the array)
❌ You need to remove from a Collection mid-iteration (use Iterator.remove() or removeIf())

**Enhanced for vs indexed for:**
\`\`\`java
// Equivalent — enhanced is preferred when index not needed
for (int x : arr) { ... }
for (int i = 0; i < arr.length; i++) { int x = arr[i]; ... }
\`\`\``,
  code: `import java.util.*;

public class EnhancedForLoop {
    public static void main(String[] args) {
        // Array iteration
        int[] scores = {85, 90, 78, 92};
        int sum = 0;
        for (int s : scores) {
            sum += s;
        }
        System.out.println("Avg: " + sum / scores.length); // 86

        // IMPORTANT: modifying 's' does NOT modify the array
        for (int s : scores) {
            s *= 2; // only changes the local copy
        }
        System.out.println(scores[0]); // still 85

        // Works on any Iterable (List, Set, etc.)
        List<String> names = List.of("Alice", "Bob", "Carol");
        for (String name : names) {
            System.out.println("Hello, " + name);
        }

        // When index IS needed — use classic for
        for (int i = 0; i < scores.length; i++) {
            System.out.println("scores[" + i + "] = " + scores[i]);
        }

        // Iterating Map entries (most common Map pattern)
        Map<String, Integer> ages = new LinkedHashMap<>();
        ages.put("Alice", 25); ages.put("Bob", 30);
        for (Map.Entry<String, Integer> entry : ages.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}`,
  codeTitle: 'Enhanced For Loop — Arrays, Lists, Maps',
  points: [
    'Enhanced for is syntactic sugar — the compiler translates it to indexed iteration (arrays) or Iterator calls (Collections)',
    'The loop variable is a local copy for primitives — assigning to it does NOT change the array element',
    'For object arrays, the variable is a copy of the reference — you can mutate the object through it, but reassigning the variable does not affect the array',
    'Use enhanced for when you need all elements in order and do not need the index — it is less error-prone',
    'Cannot remove elements from a Collection during enhanced for — use Iterator.remove() or list.removeIf(pred) instead',
    'Works on any Iterable, including custom classes that implement Iterable<T>',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'for (int x : arr) { x = 99; } does NOT modify arr — x is a copy of the element. To modify the array in-place, use the classic indexed for loop: for (int i = 0; i < arr.length; i++) { arr[i] = 99; }.',
    },
    {
      type: 'tip',
      content: 'For iterating Map entries, use for (Map.Entry<K,V> e : map.entrySet()). This is the most efficient way to access both key and value in a single pass.',
    },
    {
      type: 'interview',
      content: 'Q: Can you use enhanced for to modify elements of an array?\nA: Not for primitives — changes to the loop variable do not affect the array. For object arrays, you can mutate the object the element refers to, but you cannot replace the reference itself.',
    },
  ],
}
