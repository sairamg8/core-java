export default {
  id: 'collections-comparisons',
  title: '6. Comparable vs Comparator & Choosing the Right Collection',
  explanation: `**Comparable** — the class itself defines its natural ordering by implementing \`compareTo()\`. Used by TreeSet, TreeMap, sort() by default.
**Comparator** — an external ordering strategy. Passed to TreeSet/TreeMap constructor or sort() call. Allows multiple sort orders without modifying the class.

Return convention for both: negative → this < other, zero → equal, positive → this > other.`,
  table: {
    headers: ['', 'Comparable', 'Comparator'],
    rows: [
      ['Package', 'java.lang', 'java.util'],
      ['Method', 'compareTo(T o)', 'compare(T o1, T o2)'],
      ['Where defined', 'Inside the class', 'Separate class / lambda'],
      ['Sort orders', 'One (natural)', 'Multiple possible'],
      ['Modifies class?', 'Yes', 'No'],
    ],
  },
  code: `import java.util.*;

// Comparable — natural ordering inside the class
class Student implements Comparable<Student> {
    String name;
    int gpa;
    Student(String name, int gpa) { this.name = name; this.gpa = gpa; }

    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.gpa, other.gpa); // ascending by GPA
    }
}

List<Student> students = List.of(new Student("Alice", 90), new Student("Bob", 85));
Collections.sort(students); // uses compareTo() — sorts ascending by GPA

// Comparator — external, multiple sort orders
Comparator<Student> byName      = Comparator.comparing(s -> s.name);
Comparator<Student> byGpaDesc   = Comparator.comparingInt((Student s) -> s.gpa).reversed();
Comparator<Student> byNameThenGpa = Comparator.comparing((Student s) -> s.name)
                                               .thenComparingInt(s -> s.gpa);

List<Student> list = new ArrayList<>(students);
list.sort(byGpaDesc);      // sort by GPA descending
list.sort(byNameThenGpa);  // sort by name, then GPA

// TreeSet with external comparator (ignores natural order)
TreeSet<Student> byGpaSet = new TreeSet<>(byGpaDesc);
byGpaSet.add(new Student("Alice", 90));
byGpaSet.add(new Student("Bob", 85));
// TreeSet uses comparator for both ordering and UNIQUENESS
// Two students with same GPA would be considered duplicates!

// ---- Choosing the right collection ----
// Fast lookup by index?          → ArrayList
// Frequent front insertions?     → ArrayDeque (or LinkedList)
// No duplicates, fast lookup?    → HashSet
// No duplicates, insertion order → LinkedHashSet
// No duplicates, sorted?         → TreeSet
// Key-value, fast lookup?        → HashMap
// Key-value, insertion ordered?  → LinkedHashMap (or for LRU)
// Key-value, sorted keys?        → TreeMap
// FIFO queue?                    → ArrayDeque (as Queue)
// Priority ordering?             → PriorityQueue
// Thread-safe map?               → ConcurrentHashMap
// Thread-safe list?              → CopyOnWriteArrayList (read-heavy)`,
  points: [
    'Comparator.naturalOrder() and Comparator.reverseOrder() are handy shortcuts for Comparable types',
    'When using Comparator.comparing(), chaining .reversed() reverses only that comparator — use thenComparing() before .reversed() to get the right order',
    'TreeSet/TreeMap use the comparator for uniqueness too — if compare() returns 0 for two objects, only one is stored even if equals() says they\'re different',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: When would you use Comparator over Comparable?\nA: Use Comparable for the natural/default sort order of a class you own. Use Comparator when: (1) you need multiple sort orders, (2) you can\'t modify the class (e.g. String, Integer), or (3) you want to pass ad-hoc sorting logic as a lambda.',
    },
    {
      type: 'gotcha',
      content: 'Never subtract integers in compareTo (return a - b) — it overflows for large negative/positive values. Always use Integer.compare(a, b) or Comparator.comparingInt().',
    },
  ],
}
