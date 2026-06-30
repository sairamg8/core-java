export default {
  id: 'array-of-objects',
  title: '44. Array of Objects',
  explanation: `An **array of objects** stores references to objects on the heap. Unlike a primitive array (which stores values directly), an object array stores **pointers** — the actual objects live separately on the heap.

**Creating an object array:**
\`\`\`java
Student[] students = new Student[3]; // array of 3 null references
\`\`\`
At this point, \`students[0]\`, \`students[1]\`, \`students[2]\` are all \`null\`. You must separately create and assign each object:
\`\`\`java
students[0] = new Student("Alice", 20);
\`\`\`

**Literal form (only at declaration):**
\`\`\`java
Dog[] pack = { new Dog("Rex"), new Dog("Bella") };
\`\`\`

**Memory model:**
\`\`\`
students[0] → [Alice, 20] (heap)
students[1] → [Bob,   22] (heap)
students[2] → null
\`\`\`
The array itself is one heap object; each element is a reference to another heap object.

**Iterating:**
\`\`\`java
for (Student s : students) {
    if (s != null) s.display(); // guard against null
}
\`\`\`

**Sorting object arrays:**
Use \`Arrays.sort(arr)\` — the class must implement \`Comparable\`, or provide a \`Comparator\`.`,
  code: `import java.util.Arrays;

class Student {
    String name;
    int marks;
    Student(String name, int marks) { this.name = name; this.marks = marks; }
    void display() { System.out.println(name + ": " + marks); }
    @Override public String toString() { return name + "(" + marks + ")"; }
}

public class ArrayOfObjects {
    public static void main(String[] args) {
        // Create array then populate
        Student[] batch = new Student[3];
        batch[0] = new Student("Alice", 90);
        batch[1] = new Student("Bob",   75);
        batch[2] = new Student("Carol", 85);

        // Iterate with null guard
        for (Student s : batch) {
            if (s != null) s.display();
        }

        // Sort by marks using Comparator
        Arrays.sort(batch, (a, b) -> b.marks - a.marks); // descending
        System.out.println("Ranked: " + Arrays.toString(batch));
        // [Alice(90), Carol(85), Bob(75)]

        // Object array with null gaps
        Student[] partial = new Student[5];
        partial[0] = new Student("Eve", 88);
        partial[4] = new Student("Dan", 92);
        // partial[1],[2],[3] are null
        for (Student s : partial) {
            System.out.println(s != null ? s.name : "<empty>");
        }
    }
}`,
  codeTitle: 'Array of Object References',
  points: [
    'An object array stores references (addresses), not the objects themselves — the objects live on the heap separately',
    'new Student[3] creates 3 null references; you must assign each slot with new Student(...) before using it',
    'Always null-check when iterating object arrays if some slots might be empty',
    'Arrays.sort() with a Comparator works on object arrays — the class does not need to implement Comparable',
    'Modifying an object through one array slot affects all other references pointing to the same object',
    'Arrays.toString() calls toString() on each element — override toString() in your class for readable output',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'new Student[5] does NOT create 5 Student objects — it creates 5 null references. Calling students[0].display() without first assigning students[0] = new Student(...) throws NullPointerException.',
    },
    {
      type: 'tip',
      content: 'When you sort an object array with a lambda comparator, note the convention: (a, b) -> a.field - b.field for ascending; (a, b) -> b.field - a.field for descending. For String fields, use a.name.compareTo(b.name).',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between int[] and Integer[]?\nA: int[] stores primitive values directly. Integer[] stores references to Integer objects on the heap. Integer[] has boxing overhead but supports null and works with generics (List<Integer>); int[] does not.',
    },
  ],
}
