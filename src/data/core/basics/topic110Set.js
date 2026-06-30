export default {
  id: 'set',
  title: '110. Set',
  explanation: `Set is a Collection that does not allow duplicate elements. If you try to add an element that already exists, the add() call returns false and the set is unchanged. Set models the mathematical set concept.

**Three main implementations:**

1. **HashSet** — backed by a HashMap. O(1) average for add/remove/contains. Does NOT maintain insertion order. Best general-purpose choice when order doesn't matter.

2. **LinkedHashSet** — backed by a LinkedHashMap. O(1) for operations. Maintains insertion order. Slightly more memory than HashSet.

3. **TreeSet** — backed by a TreeMap (Red-Black tree). O(log n) for operations. Maintains natural sorted order (or Comparator order). Elements must be Comparable or a Comparator must be provided. Implements NavigableSet with methods like floor(), ceiling(), headSet(), tailSet().

**How HashSet avoids duplicates:**
When you add an object, HashSet calls hashCode() to find the bucket, then calls equals() to check for an existing match. This is why objects stored in a HashSet MUST correctly implement both hashCode() and equals().

**When to use which:**
- HashSet: when you only need uniqueness, order doesn't matter
- LinkedHashSet: when you need uniqueness AND insertion-order iteration
- TreeSet: when you need uniqueness AND sorted order`,
  code: `import java.util.*;

public class SetDemo {
    public static void main(String[] args) {
        // HashSet — no duplicates, no order guarantee
        Set<String> hashSet = new HashSet<>();
        hashSet.add("banana");
        hashSet.add("apple");
        hashSet.add("cherry");
        hashSet.add("apple");  // duplicate — ignored, add() returns false
        System.out.println("HashSet: " + hashSet);  // order not guaranteed

        boolean added = hashSet.add("apple");
        System.out.println("Added duplicate: " + added);  // false

        // LinkedHashSet — maintains insertion order
        Set<String> linkedSet = new LinkedHashSet<>();
        linkedSet.add("banana");
        linkedSet.add("apple");
        linkedSet.add("cherry");
        System.out.println("LinkedHashSet: " + linkedSet);  // [banana, apple, cherry]

        // TreeSet — sorted order
        TreeSet<Integer> treeSet = new TreeSet<>();
        treeSet.add(5); treeSet.add(1); treeSet.add(3); treeSet.add(2); treeSet.add(4);
        System.out.println("TreeSet: " + treeSet);       // [1, 2, 3, 4, 5]
        System.out.println("First: " + treeSet.first()); // 1
        System.out.println("Last: " + treeSet.last());   // 5
        System.out.println("Floor 3: " + treeSet.floor(3));    // 3 (<=3)
        System.out.println("Ceiling 3: " + treeSet.ceiling(3)); // 3 (>=3)
        System.out.println("HeadSet(<3): " + treeSet.headSet(3));  // [1, 2]
        System.out.println("TailSet(>=3): " + treeSet.tailSet(3)); // [3, 4, 5]

        // Set operations
        Set<Integer> setA = new HashSet<>(Arrays.asList(1, 2, 3, 4));
        Set<Integer> setB = new HashSet<>(Arrays.asList(3, 4, 5, 6));

        Set<Integer> union = new HashSet<>(setA);
        union.addAll(setB);
        System.out.println("Union: " + union);      // [1, 2, 3, 4, 5, 6]

        Set<Integer> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        System.out.println("Intersection: " + intersection);  // [3, 4]

        Set<Integer> difference = new HashSet<>(setA);
        difference.removeAll(setB);
        System.out.println("Difference: " + difference);      // [1, 2]
    }
}`,
  codeTitle: 'HashSet, LinkedHashSet, TreeSet',
  points: [
    'Set forbids duplicate elements — add() returns false (silently) if the element already exists',
    'HashSet: O(1) average for add/remove/contains; no ordering guarantee',
    'LinkedHashSet: O(1) operations, preserves insertion order at the cost of slightly more memory',
    'TreeSet: O(log n) operations, maintains elements in sorted (natural or Comparator) order',
    'HashSet relies on hashCode() and equals() — objects used as Set elements MUST implement both correctly',
    'TreeSet elements must be Comparable (or you must supply a Comparator) — adding non-comparable objects throws ClassCastException',
    'Set supports mathematical set operations via addAll() (union), retainAll() (intersection), removeAll() (difference)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you add a custom object to a HashSet without overriding hashCode() and equals(), duplicates will NOT be detected — two "equal" objects will both be stored because the default hashCode uses object identity.',
    },
    {
      type: 'interview',
      content: 'Q: How does HashSet check for duplicates?\nA: It calls hashCode() to find the bucket, then calls equals() on each element in that bucket. Both must be consistent: if a.equals(b) is true, then a.hashCode() == b.hashCode() must also be true.',
    },
    {
      type: 'tip',
      content: 'Use TreeSet when you frequently need range queries (headSet, tailSet, subSet, floor, ceiling). For everything else, HashSet is faster.',
    },
  ],
}
