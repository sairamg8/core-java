export default {
  id: 'drawbacks-of-arrays',
  title: '43. Drawbacks of Arrays',
  explanation: `Arrays are fast and simple, but they have significant limitations. Understanding these drawbacks explains why Java's Collections Framework exists.

**1. Fixed Size**
The biggest limitation. Once created, an array's length cannot change:
\`\`\`java
int[] arr = new int[5]; // forever 5 elements
\`\`\`
If you need more space, you must create a new larger array and copy all elements — \`Arrays.copyOf()\` does this, but it is still an O(n) operation.

**2. Same Type Only**
All elements must be the same declared type. You cannot mix \`int\` and \`String\` in one array (unless you use \`Object[]\`, which loses type safety).

**3. No Built-in Methods**
Arrays have no methods for common operations like:
- Insert at arbitrary index
- Remove by value
- Search (linear scan only, unless sorted + Arrays.binarySearch)
- Sort (must call Arrays.sort externally)

**4. No Bounds-Checking at Compile Time**
Accessing an invalid index compiles fine but throws \`ArrayIndexOutOfBoundsException\` at runtime.

**5. Contiguous Allocation**
Large arrays may fail to allocate if the heap is fragmented, even if enough total memory exists.

**When to use what instead:**
| Drawback | Better alternative |
|----------|-------------------|
| Fixed size | \`ArrayList\` |
| Key-value lookup | \`HashMap\` |
| Uniqueness | \`HashSet\` |
| Sorted order | \`TreeSet\` / \`TreeMap\` |`,
  code: `import java.util.Arrays;
import java.util.ArrayList;

public class DrawbacksOfArrays {
    public static void main(String[] args) {
        // DRAWBACK 1: Fixed size — must copy to grow
        int[] arr = {1, 2, 3};
        int[] bigger = Arrays.copyOf(arr, 6); // [1, 2, 3, 0, 0, 0]
        bigger[3] = 4;
        System.out.println(Arrays.toString(bigger)); // [1, 2, 3, 4, 0, 0]

        // DRAWBACK 2: No remove by value — have to shift manually
        int[] data = {10, 20, 30, 40, 50};
        int removeIdx = 2; // remove '30'
        for (int i = removeIdx; i < data.length - 1; i++) {
            data[i] = data[i + 1];
        }
        // last element is stale — need a separate length counter
        System.out.println(Arrays.toString(data)); // [10, 20, 40, 50, 50]

        // DRAWBACK 3: ArrayIndexOutOfBoundsException at runtime
        try {
            int x = arr[5]; // compile passes, runtime fails
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        // SOLUTION: ArrayList handles size, removal, contains automatically
        ArrayList<Integer> list = new ArrayList<>();
        list.add(10); list.add(20); list.add(30);
        list.remove(Integer.valueOf(20)); // remove by value
        System.out.println(list); // [10, 30]
        System.out.println(list.contains(30)); // true
    }
}`,
  codeTitle: 'Array Limitations and ArrayList as Alternative',
  points: [
    'Fixed size is the primary drawback — once created you cannot add or remove; Arrays.copyOf() creates a new larger copy at O(n) cost',
    'No insert or remove by index without manual element shifting — O(n) and error-prone',
    'ArrayIndexOutOfBoundsException is a runtime error, not a compile-time one — always validate indices',
    'No contains(), indexOf(), or dynamic add/remove — you need the Collections Framework for those',
    'Arrays.sort() and Arrays.binarySearch() exist but are the only "methods" available through the utility class',
    'ArrayList is the dynamic array alternative: it resizes automatically (1.5× when full) and provides add(), remove(), contains(), indexOf()',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Prefer ArrayList over raw arrays whenever the size might change or you need contains(), remove(), or indexOf(). Use arrays when: size is fixed, performance is critical, or you are working with primitives (to avoid boxing overhead).',
    },
    {
      type: 'gotcha',
      content: 'When removing from an ArrayList<Integer> by value, use list.remove(Integer.valueOf(n)) — not list.remove(n). The int overload removes by index; the Integer overload removes by value.',
    },
    {
      type: 'interview',
      content: 'Q: What are the main limitations of Java arrays?\nA: Fixed size, same type only, no built-in add/remove/contains, and runtime-only index-bounds checking. The Collections Framework (ArrayList, HashMap, etc.) was created to address these limitations.',
    },
  ],
}
