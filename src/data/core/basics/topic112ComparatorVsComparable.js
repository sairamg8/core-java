export default {
  id: 'comparator-vs-comparable',
  title: '112. Comparator vs Comparable',
  explanation: `Both Comparable and Comparator are used for sorting objects in Java, but they serve different purposes.

**Comparable (java.lang)**
- Implemented by the class whose objects you want to sort — the class "knows how to compare itself."
- Has one method: int compareTo(T other)
- Defines the natural ordering of the class.
- Used automatically by Collections.sort(), Arrays.sort(), TreeSet, TreeMap (as the default order).
- Return convention: negative if this < other, 0 if equal, positive if this > other.

**Comparator (java.util)**
- An external comparison strategy — a separate object that compares two instances of any class.
- Has one method: int compare(T o1, T o2)
- Used when: you need multiple sort orders, you cannot modify the class, or the class has no natural ordering.
- In Java 8, Comparator has powerful static and default methods: comparing(), thenComparing(), reversed(), naturalOrder(), reverseOrder(), nullsFirst(), nullsLast().

**Key difference:** Comparable is "I know how to compare myself to another object." Comparator is "I know how to compare two objects."

**When to use which:**
- Comparable: when there is one obvious natural ordering (e.g., String alphabetical, Integer numeric).
- Comparator: when you need custom/multiple orderings, or for third-party classes you cannot modify.`,
  code: `import java.util.*;

// Comparable — class implements its natural ordering
class Student implements Comparable<Student> {
    String name;
    int grade;

    Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    @Override
    public int compareTo(Student other) {
        return this.grade - other.grade;  // natural order: ascending by grade
    }

    @Override
    public String toString() { return name + "(" + grade + ")"; }
}

public class ComparatorDemo {
    public static void main(String[] args) {
        List<Student> students = Arrays.asList(
            new Student("Charlie", 85),
            new Student("Alice", 92),
            new Student("Bob", 78)
        );

        // Natural order (Comparable) — ascending by grade
        Collections.sort(students);
        System.out.println("Natural order: " + students);

        // Comparator — sort by name alphabetically
        Comparator<Student> byName = Comparator.comparing(s -> s.name);
        students.sort(byName);
        System.out.println("By name: " + students);

        // Comparator — sort by grade descending
        Comparator<Student> byGradeDesc = Comparator.comparingInt((Student s) -> s.grade).reversed();
        students.sort(byGradeDesc);
        System.out.println("By grade desc: " + students);

        // Chained comparators — primary sort by grade, secondary by name
        Comparator<Student> combined = Comparator
            .comparingInt((Student s) -> s.grade)
            .thenComparing(s -> s.name);
        students.sort(combined);
        System.out.println("By grade then name: " + students);

        // Null-safe comparator
        Comparator<String> nullSafe = Comparator.nullsFirst(Comparator.naturalOrder());
        List<String> withNulls = Arrays.asList("banana", null, "apple", null, "cherry");
        withNulls.sort(nullSafe);
        System.out.println("Null-safe sort: " + withNulls);
    }
}`,
  codeTitle: 'Comparable vs Comparator',
  points: [
    'Comparable defines natural ordering within the class itself via compareTo(); used by sort and tree structures by default',
    'Comparator defines external ordering via compare(); used for custom, multiple, or third-party-class ordering',
    'compareTo() and compare() return negative (less than), 0 (equal), or positive (greater than)',
    'Java 8 Comparator.comparing() creates a comparator from a key extractor — far cleaner than anonymous classes',
    'thenComparing() chains secondary sort criteria when primary values are equal',
    'reversed() flips any Comparator without rewriting it',
    'nullsFirst() / nullsLast() handle null values gracefully without NullPointerException',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Using subtraction (a.grade - b.grade) for compareTo() can overflow if values are very large or negative. Use Integer.compare(a.grade, b.grade) or Comparator.comparingInt() instead.',
    },
    {
      type: 'interview',
      content: 'Q: Can a class implement both Comparable and use a Comparator?\nA: Yes — Comparable provides the natural (default) ordering, and you can pass a Comparator to Collections.sort() or TreeSet when you need a different ordering. TreeSet(comparator) uses that comparator instead of natural order.',
    },
    {
      type: 'tip',
      content: 'Always use Comparator.comparing(KeyExtractor) instead of manual subtraction. It handles edge cases, reads clearly, and composes well with thenComparing() and reversed().',
    },
  ],
}
