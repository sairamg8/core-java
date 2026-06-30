export default {
  id: 'arrays',
  title: '2. Arrays',
  explanation: `An array is a fixed-size, ordered collection of elements of the **same type**. Arrays in Java are objects — they live on the heap.

**Key facts:**
- Size is fixed at creation time and cannot change
- Index starts at 0, ends at length-1
- Default values: 0 for numeric, false for boolean, null for references`,
  table: {
    headers: ['Array Type', 'Default Value', 'Example'],
    rows: [
      ['int[]', '0', 'int[] nums = new int[5];'],
      ['double[]', '0.0', 'double[] d = new double[3];'],
      ['boolean[]', 'false', 'boolean[] flags = new boolean[2];'],
      ['String[]', 'null', 'String[] names = new String[4];'],
    ],
  },
  code: `import java.util.Arrays;

// Declaration and initialization
int[] nums = new int[5];          // [0, 0, 0, 0, 0]
int[] primes = {2, 3, 5, 7, 11}; // array literal
String[] names = new String[]{"Alice", "Bob"}; // explicit new

// Access
System.out.println(primes[0]);    // 2
primes[0] = 99;                   // mutate
System.out.println(primes.length); // 5 (property, NOT a method)

// Looping
for (int i = 0; i < nums.length; i++) {
    nums[i] = i * 2;
}
for (int n : primes) {             // enhanced for — read-only idiom
    System.out.println(n);
}

// Arrays utility class
int[] a = {5, 2, 8, 1, 9};
Arrays.sort(a);                    // [1, 2, 5, 8, 9] — in-place sort, O(n log n)
int idx = Arrays.binarySearch(a, 5); // 2 — MUST be sorted first
System.out.println(Arrays.toString(a)); // "[1, 2, 5, 8, 9]" — readable print

int[] copy = Arrays.copyOf(a, 7);  // [1,2,5,8,9,0,0] — pads with 0
int[] range = Arrays.copyOfRange(a, 1, 4); // [2, 5, 8] — [from, to)
int[] filled = new int[5];
Arrays.fill(filled, 42);           // [42, 42, 42, 42, 42]

boolean equal = Arrays.equals(a, copy); // false (different lengths)

// 2D arrays (array of arrays)
int[][] matrix = new int[3][4];    // 3 rows, 4 columns
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(grid[1][2]);    // 6 (row 1, col 2)
System.out.println(grid.length);   // 3 (rows)
System.out.println(grid[0].length); // 3 (cols of row 0)

// Jagged arrays — rows can have different lengths
int[][] jagged = new int[3][];
jagged[0] = new int[]{1};
jagged[1] = new int[]{2, 3};
jagged[2] = new int[]{4, 5, 6};

// Array → List (fixed-size, not resizable)
String[] arr = {"a", "b", "c"};
java.util.List<String> list = Arrays.asList(arr);
// list.add("d") → UnsupportedOperationException
// Use new ArrayList<>(Arrays.asList(arr)) for a mutable list

// List → Array
java.util.List<String> names2 = new java.util.ArrayList<>();
names2.add("x"); names2.add("y");
String[] back = names2.toArray(new String[0]);`,
  points: [
    'Accessing index out of bounds throws ArrayIndexOutOfBoundsException at runtime (not compile time)',
    'Arrays.toString() for 1D, Arrays.deepToString() for 2D — the default toString() prints [I@hashcode which is useless',
    'Arrays.asList() returns a fixed-size List backed by the array — you can set() elements but not add() or remove()',
    'System.arraycopy(src, srcPos, dest, destPos, length) is the fastest way to copy large arrays',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between length and length() in Java?\nA: array.length is a FIELD on arrays (no parentheses). String.length() is a METHOD. ArrayList.size() is also a method. This trips up many candidates.',
    },
    {
      type: 'gotcha',
      content: 'int[] a = {1,2,3}; int[] b = a; — b is NOT a copy, it\'s another reference to the same array. Mutating b[0] changes a[0] too. Use Arrays.copyOf(a, a.length) for an independent copy.',
    },
  ],
}
