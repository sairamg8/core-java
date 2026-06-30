export default {
  id: 'creation-of-array',
  title: '40. Creation of an Array',
  explanation: `Arrays in Java can be created in several ways. Understanding each form helps you choose the right one for the situation.

**Form 1 — Declaration + Allocation:**
\`\`\`java
int[] arr = new int[5]; // 5 elements, all default to 0
\`\`\`
Elements default to: \`0\` for numeric types, \`false\` for boolean, \`null\` for object types.

**Form 2 — Declaration + Initialization (literal):**
\`\`\`java
int[] arr = {10, 20, 30}; // size inferred from values, assigned at declaration
\`\`\`

**Form 3 — Anonymous array literal (use in method calls):**
\`\`\`java
printAll(new int[]{1, 2, 3}); // create and pass inline
\`\`\`

**Separate declaration and assignment:**
\`\`\`java
int[] arr;       // declare the reference (null)
arr = new int[3]; // then assign
\`\`\`
Note: \`int[] arr = {1,2,3};\` is valid at declaration but \`arr = {1,2,3};\` is NOT valid as a separate statement — the shorthand works only in the declaration.

**Accessing and modifying:**
\`\`\`java
arr[0] = 99;        // set element at index 0
int x = arr[0];     // read element
int len = arr.length; // number of elements
\`\`\`

**Object arrays:**
\`\`\`java
String[] names = new String[3]; // all null initially
names[0] = "Alice";
\`\`\``,
  code: `import java.util.Arrays;

public class CreationOfArray {
    public static void main(String[] args) {
        // Form 1: allocate then assign
        int[] a = new int[4];
        System.out.println(Arrays.toString(a)); // [0, 0, 0, 0]
        a[0] = 10; a[1] = 20; a[2] = 30; a[3] = 40;
        System.out.println(Arrays.toString(a)); // [10, 20, 30, 40]

        // Form 2: literal at declaration
        double[] d = {1.1, 2.2, 3.3};
        System.out.println(Arrays.toString(d)); // [1.1, 2.2, 3.3]

        // Form 3: anonymous array
        System.out.println("Max: " + max(new int[]{5, 3, 8, 1})); // 8

        // Separate declaration and assignment
        String[] names;
        names = new String[3];  // OK
        names[0] = "Alice";
        names[1] = "Bob";
        // names[2] is null (default for object type)
        System.out.println(names[0]); // Alice
        System.out.println(names[2]); // null

        // Cannot use shorthand after declaration:
        // names = {"Alice", "Bob"}; // COMPILE ERROR

        // Correct way to re-assign with new values:
        names = new String[]{"Alice", "Bob", "Charlie"};
        System.out.println(Arrays.toString(names));
    }

    static int max(int[] arr) {
        int m = arr[0];
        for (int x : arr) if (x > m) m = x;
        return m;
    }
}`,
  codeTitle: 'Three Ways to Create Arrays',
  points: [
    'int[] arr = new int[n] creates an array of n elements all initialized to their default value (0 for int)',
    'int[] arr = {1,2,3} is the array literal shorthand — only valid at the point of declaration, not as a reassignment',
    'new int[]{1,2,3} is the anonymous array form — valid anywhere an array expression is expected',
    'Array length is fixed at creation — you cannot add or remove elements from a Java array',
    'Default values: 0 for numeric, false for boolean, null for object types (String, custom classes)',
    'Arrays.toString(arr) is the quickest way to print array contents for debugging',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'int[] arr = {1,2,3}; works at declaration, but arr = {1,2,3}; later is a syntax error. Use arr = new int[]{1,2,3}; when reassigning an array variable after its initial declaration.',
    },
    {
      type: 'tip',
      content: 'Always prefer Arrays.toString(arr) over direct printing — System.out.println(arr) prints the hash code (e.g., [I@6d06d69c), not the contents.',
    },
    {
      type: 'interview',
      content: 'Q: What is the default value of elements in a newly created int array?\nA: 0. For boolean it is false; for object types (String, etc.) it is null. The default mirrors the type\'s zero value.',
    },
  ],
}
