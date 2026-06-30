export default {
  id: 'list-types',
  title: '2. List — ArrayList vs LinkedList',
  explanation: `Both implement List but have very different internal structures and performance characteristics.

**ArrayList** — backed by a resizable array. Default capacity 10, grows by 50% when full.
**LinkedList** — doubly linked list of nodes. Each node holds prev, next, and data.`,
  table: {
    headers: ['Operation', 'ArrayList', 'LinkedList'],
    rows: [
      ['get(i) / set(i)', 'O(1)', 'O(n) — traversal needed'],
      ['add at end', 'O(1) amortized', 'O(1)'],
      ['add at middle', 'O(n) — shift elements', 'O(1) — change pointers'],
      ['remove(i)', 'O(n) — shift elements', 'O(n) — find node'],
      ['contains()', 'O(n)', 'O(n)'],
      ['Memory', 'Compact array', 'Node overhead (2 pointers each)'],
    ],
  },
  code: `List<String> arr = new ArrayList<>(20);  // initial capacity hint
arr.add("A");                   // append — O(1) amortized
arr.add(0, "X");               // insert at index — O(n)
arr.get(0);                    // O(1)
arr.set(0, "Y");               // O(1)
arr.remove(0);                 // remove by index — O(n)
arr.remove("A");               // remove by value — O(n) scan first

// Sorting
Collections.sort(arr);                          // natural order
arr.sort(Comparator.reverseOrder());            // reverse
arr.sort(Comparator.comparingInt(String::length)); // by length

// Iterating safely while removing
Iterator<String> it = arr.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("A")) it.remove(); // SAFE
}
// DO NOT do: for (String s : arr) { arr.remove(s); }  ← ConcurrentModificationException!

// LinkedList — also implements Deque (double-ended queue)
LinkedList<String> ll = new LinkedList<>();
ll.addFirst("first");     // O(1)
ll.addLast("last");       // O(1)
ll.peekFirst();           // see without removing
ll.pollFirst();           // remove and return head
ll.pollLast();            // remove and return tail

// When to use which:
// ArrayList  → most cases, random access, iteration
// LinkedList → frequent insertion/deletion at both ends (as Deque)`,
  points: [
    'ArrayList.ensureCapacity(n) pre-allocates for known size — avoids repeated resizing',
    'Vector is like ArrayList but synchronized (legacy) — use ArrayList + explicit sync instead',
    'ArrayList uses 1.5x growth factor; Vector uses 2x — Vector wastes more memory',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: When to use LinkedList over ArrayList?\nA: Rarely. LinkedList is only faster for frequent insertions/deletions at the START of the list (addFirst/removeFirst). For most workloads, ArrayList wins due to cache locality and less memory overhead. LinkedList shines as a Deque/Stack.',
    },
    {
      type: 'gotcha',
      content: 'Modifying a collection while iterating with for-each throws ConcurrentModificationException. Use iterator.remove(), removeIf() (Java 8), or iterate over a copy: new ArrayList<>(original).',
    },
  ],
}
