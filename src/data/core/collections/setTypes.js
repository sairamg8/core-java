export default {
  id: 'set-types',
  title: '3. Set — HashSet, LinkedHashSet, TreeSet',
  explanation: `All three implement Set (no duplicates), but differ in ordering and performance.

**HashSet** — backed by a HashMap. No guaranteed order. O(1) add/remove/contains.
**LinkedHashSet** — HashSet + doubly linked list. Maintains insertion order. Slightly slower than HashSet.
**TreeSet** — Red-Black Tree. Elements are sorted in natural order (or by Comparator). O(log n) all ops.`,
  table: {
    headers: ['Feature', 'HashSet', 'LinkedHashSet', 'TreeSet'],
    rows: [
      ['Order', 'None', 'Insertion order', 'Sorted (natural/comparator)'],
      ['add / remove / contains', 'O(1)', 'O(1)', 'O(log n)'],
      ['Null allowed?', 'One null', 'One null', 'No (throws NPE)'],
      ['Backed by', 'HashMap', 'LinkedHashMap', 'TreeMap (Red-Black Tree)'],
      ['Use when', 'Fast lookup, order irrelevant', 'Predictable iteration order', 'Sorted iteration, range queries'],
    ],
  },
  code: `import java.util.*;

Set<String> hash   = new HashSet<>();       // fastest, unordered
Set<String> linked = new LinkedHashSet<>(); // insertion-ordered
Set<String> tree   = new TreeSet<>();       // always sorted A-Z

hash.add("banana"); hash.add("apple"); hash.add("cherry");
// hash iteration order: unpredictable (e.g. cherry, banana, apple)

linked.add("banana"); linked.add("apple"); linked.add("cherry");
// linked iteration order: banana, apple, cherry (insertion order)

tree.add("banana"); tree.add("apple"); tree.add("cherry");
// tree iteration order: apple, banana, cherry (alphabetical)

// TreeSet — sorted navigation methods
TreeSet<Integer> nums = new TreeSet<>(List.of(1, 3, 5, 7, 9));
System.out.println(nums.first());          // 1
System.out.println(nums.last());           // 9
System.out.println(nums.floor(6));         // 5 — largest <= 6
System.out.println(nums.ceiling(4));       // 5 — smallest >= 4
System.out.println(nums.headSet(6));       // [1, 3, 5] — all < 6
System.out.println(nums.tailSet(5));       // [5, 7, 9] — all >= 5
System.out.println(nums.subSet(3, 8));     // [3, 5, 7] — [3, 8)

// Custom sort order via Comparator (TreeSet)
TreeSet<String> byLength = new TreeSet<>(Comparator.comparingInt(String::length)
    .thenComparing(Comparator.naturalOrder()));
byLength.add("cc"); byLength.add("a"); byLength.add("bbb");
// [a, cc, bbb]

// Set operations (no built-in method — use retain/remove)
Set<Integer> a = new HashSet<>(Set.of(1, 2, 3, 4));
Set<Integer> b = new HashSet<>(Set.of(3, 4, 5, 6));

Set<Integer> union        = new HashSet<>(a); union.addAll(b);    // {1,2,3,4,5,6}
Set<Integer> intersection = new HashSet<>(a); intersection.retainAll(b); // {3,4}
Set<Integer> difference   = new HashSet<>(a); difference.removeAll(b);   // {1,2}`,
  points: [
    'HashSet uses equals() and hashCode() for uniqueness — always override both consistently in custom classes',
    'TreeSet uses compareTo() (or Comparator) for ordering AND uniqueness — if compareTo returns 0, the element is considered duplicate (even if equals() says otherwise)',
    'EnumSet is the most efficient Set for enum values — uses a bit vector internally, O(1) everything',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What happens if you add a mutable object to a HashSet and then mutate it?\nA: The object\'s hashCode changes, making it "lost" in the bucket. The Set thinks it still contains the object (contains() returns false), but it can never be found or removed. Always use immutable objects as Set elements.',
    },
    {
      type: 'gotcha',
      content: 'TreeSet.add(null) throws NullPointerException because null cannot be compared. HashSet allows exactly one null (stored in bucket 0). Never add null to a TreeSet.',
    },
  ],
}
