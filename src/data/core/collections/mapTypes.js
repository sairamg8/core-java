export default {
  id: 'map-types',
  title: '4. Map — HashMap, LinkedHashMap, TreeMap',
  explanation: `Map stores key-value pairs with unique keys. The three main implementations mirror the Set hierarchy (each Map has a corresponding Set backed by it).

**HashMap** — array of buckets + linked list/Red-Black Tree per bucket (Java 8+). O(1) average.
**LinkedHashMap** — HashMap + doubly linked list for insertion/access order. O(1) average.
**TreeMap** — Red-Black Tree. Keys sorted. O(log n) all ops.`,
  table: {
    headers: ['Feature', 'HashMap', 'LinkedHashMap', 'TreeMap'],
    rows: [
      ['Key order', 'None', 'Insertion order (or access)', 'Sorted'],
      ['get / put / remove', 'O(1) avg', 'O(1) avg', 'O(log n)'],
      ['Null keys', 'One null key', 'One null key', 'Not allowed'],
      ['Thread-safe?', 'No', 'No', 'No'],
      ['Use when', 'Fast general use', 'LRU cache / ordered output', 'Sorted keys, range queries'],
    ],
  },
  code: `import java.util.*;

Map<String, Integer> map = new HashMap<>();
map.put("alice", 30);
map.put("bob", 25);
map.get("alice");               // 30
map.getOrDefault("carol", -1); // -1 (not present)
map.containsKey("bob");        // true
map.containsValue(25);         // true
map.remove("bob");

// Idiomatic Java 8+ operations
map.putIfAbsent("dave", 40);            // only if key missing
map.computeIfAbsent("scores", k -> new ArrayList<>()); // compute when missing
map.compute("alice", (k, v) -> v == null ? 1 : v + 1); // update in place
map.merge("alice", 1, Integer::sum);    // merge: put 1 if absent, else sum

// Iterating
for (Map.Entry<String, Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}
map.forEach((k, v) -> System.out.println(k + " → " + v)); // cleaner

// LinkedHashMap as LRU Cache (access-order mode)
Map<String, Integer> lru = new LinkedHashMap<>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
        return size() > 3; // keep at most 3 entries
    }
};
lru.put("a", 1); lru.put("b", 2); lru.put("c", 3);
lru.get("a");    // access "a" — moves it to end (most recently used)
lru.put("d", 4); // exceeds 3 → evicts "b" (least recently used)

// TreeMap — sorted key navigation
TreeMap<String, Integer> tree = new TreeMap<>(Map.of("b", 2, "a", 1, "c", 3));
tree.firstKey();          // "a"
tree.lastKey();           // "c"
tree.floorKey("b");       // "b"
tree.ceilingKey("b");     // "b"
tree.headMap("c");        // {a=1, b=2}  (exclusive upper bound)
tree.tailMap("b");        // {b=2, c=3}  (inclusive lower bound)
tree.subMap("a", "c");    // {a=1, b=2}

// ConcurrentHashMap for thread-safe operations
Map<String, Integer> concurrent = new java.util.concurrent.ConcurrentHashMap<>();
concurrent.put("key", 1);   // thread-safe without full lock`,
  points: [
    'HashMap capacity doubles when load factor (default 0.75) is exceeded — triggers full rehash. Pre-size with new HashMap<>(expectedSize / 0.75 + 1) for known large maps',
    'Java 8+: when a bucket chain exceeds 8 elements, it converts to a Red-Black Tree — worst case get/put becomes O(log n) instead of O(n)',
    'Hashtable is the legacy synchronized alternative — use ConcurrentHashMap instead; it uses segment-level locking for much better concurrency',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How does HashMap handle collisions internally?\nA: Before Java 8, each bucket held a linked list. After Java 8, when a bucket chain length exceeds 8 (and total capacity >= 64), the list is converted to a Red-Black Tree, reducing worst-case lookup from O(n) to O(log n).',
    },
    {
      type: 'gotcha',
      content: 'map.get(key) returning null is ambiguous — it could mean the key is absent OR the key maps to null. Use map.containsKey(key) to distinguish. Or avoid null values altogether.',
    },
  ],
}
