export default {
  id: 'array-of-objects',
  title: 'Array of Objects',
  explanation: `An **array of objects** stores references to objects, not the objects themselves. When you create \`Student[] students = new Student[3]\`, Java allocates three slots — each holding \`null\` by default. The actual Student objects must be created separately with \`new\`.

This two-step creation is the most common source of **NullPointerException** for beginners: forgetting to initialize each slot before accessing it.

**Key difference from primitive arrays:**
- \`int[] nums = new int[3]\` → slots hold actual values: \`[0, 0, 0]\`
- \`Student[] s = new Student[3]\` → slots hold references: \`[null, null, null]\``,
  code: `// ── Define a simple Student class ──────────────────────────
class Student {
    String name;
    int    grade;

    Student(String name, int grade) {
        this.name  = name;
        this.grade = grade;
    }

    public String toString() {
        return name + " (" + grade + ")";
    }
}

// ── Creating and using an array of objects ──────────────────
public class ArrayOfObjectsDemo {
    public static void main(String[] args) {

        // Step 1: create the array — slots are null
        Student[] students = new Student[3];
        // students → [null, null, null]

        // Step 2: create each object and assign to a slot
        students[0] = new Student("Alice", 92);
        students[1] = new Student("Bob",   85);
        students[2] = new Student("Carol", 78);

        // Access
        System.out.println(students[0]);      // Alice (92)
        System.out.println(students[0].name); // Alice
        System.out.println(students[1].grade); // 85

        // Loop through
        for (Student s : students) {
            System.out.println(s.name + " scored " + s.grade);
        }

        // Shorthand — array literal with inline object creation
        Student[] team = {
            new Student("Dan",  88),
            new Student("Eve",  95),
            new Student("Frank", 70),
        };

        // Sorting by grade (using Comparable or lambda)
        java.util.Arrays.sort(team, (a, b) -> b.grade - a.grade); // descending
        for (Student s : team) {
            System.out.println(s);
        }
        // Eve (95), Dan (88), Frank (70)

        // ── DANGER: NullPointerException ──────────────────
        Student[] risk = new Student[2];  // [null, null]
        // risk[0].name  →  NullPointerException!  (slot never initialized)
        // Always check: if (risk[0] != null) before accessing
    }
}`,
  codeTitle: 'ArrayOfObjectsDemo.java',
  points: [
    'Creating an array of objects with new T[n] gives you n null slots — you must separately assign each object.',
    'Accessing any field or method on a null slot throws NullPointerException at runtime.',
    'The array itself is on the heap. Each Student object inside is also separately on the heap. The array holds their heap addresses.',
    'Arrays.sort() with a lambda comparator is the standard way to sort object arrays by custom criteria.',
    'If Student implements Comparable<Student>, you can call Arrays.sort(team) without a lambda.',
    'Length of an object array is still .length (no parentheses), same as primitive arrays.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Student[] arr = new Student[5]; arr[0].name = "Alice"; → NullPointerException. Creating the array does NOT create the objects inside. You must do arr[0] = new Student("Alice", 90); first. This is the single most common mistake when working with object arrays.',
    },
    {
      type: 'interview',
      content: 'Q: What is the default value of an element in a String[] or object array?\nA: null. The array slots hold references, and the default reference value is null. For primitive arrays (int[], double[]) the defaults are 0 and 0.0. For boolean[] the default is false.',
    },
    {
      type: 'important',
      content: 'Arrays of objects are rarely the best choice in modern Java. Prefer ArrayList<Student> when the size is unknown or changes. ArrayList handles resizing automatically, provides helpful methods (add, remove, contains), and works with streams and lambdas more naturally.',
    },
  ],
}
