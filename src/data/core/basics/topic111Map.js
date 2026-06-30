export default {
  id: 'map',
  title: '111. Map',
  explanation: `Map is a data structure that stores key-value pairs. Each key is unique; if you put() a new value for an existing key, the old value is replaced. Map is NOT part of the Collection hierarchy — it is a separate interface in java.util.

**Main implementations:**

1. **HashMap** — backed by a hash table. O(1) average for get/put/remove. No ordering. Allows one null key and multiple null values. Most commonly used.

2. **LinkedHashMap** — extends HashMap; maintains insertion order (or access order if configured). Slightly slower than HashMap. Useful for LRU caches.

3. **TreeMap** — backed by a Red-Black tree. O(log n) operations. Maintains keys in sorted order. Implements NavigableMap with firstKey(), lastKey(), floorKey(), ceilingKey(), headMap(), tailMap().

4. **Hashtable** — legacy, synchronized version of HashMap. Do NOT use in new code; use ConcurrentHashMap instead.

**Key Map methods:**
- put(key, value): add or update an entry
- get(key): retrieve value (returns null if key not found)
- getOrDefault(key, default): safe get with fallback
- containsKey(key): check if key exists
- containsValue(value): O(n) scan for value
- remove(key): remove entry
- keySet(), values(), entrySet(): iterate over keys, values, or entries

**Java 8 additions:**
- putIfAbsent(): only puts if key is not present
- computeIfAbsent(): compute and store only if absent
- merge(): combine existing and new value
- forEach(): iterate with BiConsumer`,
  code: `import java.util.*;

public class MapDemo {
    public static void main(String[] args) {
        // HashMap — most common
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 90);
        scores.put("Bob", 85);
        scores.put("Charlie", 92);
        scores.put("Alice", 95);  // replaces 90 with 95

        System.out.println("Alice's score: " + scores.get("Alice"));  // 95
        System.out.println("Dave's score: " + scores.get("Dave"));    // null
        System.out.println("Dave (default): " + scores.getOrDefault("Dave", 0));  // 0

        System.out.println("Contains Bob: " + scores.containsKey("Bob"));  // true

        // Iterating over entries
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        scores.forEach((name, score) -> System.out.println(name + ": " + score));

        // Java 8 methods
        scores.putIfAbsent("Dave", 78);   // only adds Dave if not present
        scores.computeIfAbsent("Eve", k -> k.length() * 10);  // key.length * 10 = 30
        scores.merge("Alice", 5, Integer::sum);  // Alice = 95 + 5 = 100

        // LinkedHashMap — maintains insertion order
        Map<String, Integer> ordered = new LinkedHashMap<>();
        ordered.put("first", 1);
        ordered.put("second", 2);
        ordered.put("third", 3);
        System.out.println("LinkedHashMap: " + ordered);  // insertion order preserved

        // TreeMap — sorted by key
        TreeMap<String, Integer> sorted = new TreeMap<>(scores);
        System.out.println("First key: " + sorted.firstKey());
        System.out.println("Last key:  " + sorted.lastKey());
        System.out.println("Keys before C: " + sorted.headMap("C"));

        // Word frequency count — classic Map use case
        String text = "the quick brown fox jumps over the lazy fox";
        Map<String, Integer> freq = new HashMap<>();
        for (String word : text.split(" ")) {
            freq.merge(word, 1, Integer::sum);
        }
        System.out.println("Word freq: " + freq);
    }
}`,
  codeTitle: 'HashMap, LinkedHashMap, TreeMap',
  points: [
    'Map stores unique key-value pairs; putting a duplicate key replaces the existing value',
    'HashMap: O(1) average operations, no order, allows one null key and many null values',
    'LinkedHashMap: O(1) operations, maintains insertion order — ideal for LRU caches',
    'TreeMap: O(log n) operations, keys sorted in natural order or by Comparator',
    'entrySet() is the most efficient way to iterate key-value pairs; keySet() if you only need keys',
    'getOrDefault() is safer than get() to avoid NullPointerException when a key might be absent',
    'Java 8 methods (putIfAbsent, computeIfAbsent, merge) dramatically simplify common Map patterns like frequency counting',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'HashMap allows one null key, but TreeMap does NOT — inserting a null key into TreeMap throws NullPointerException because null cannot be compared.',
    },
    {
      type: 'interview',
      content: 'Q: How does HashMap handle collisions?\nA: Before Java 8, it used a linked list per bucket. Java 8+ converts a bucket to a TreeMap (balanced BST) when the chain length exceeds 8 — this improves worst-case performance from O(n) to O(log n).',
    },
    {
      type: 'tip',
      content: 'For concurrent access, use ConcurrentHashMap instead of synchronizing a regular HashMap. ConcurrentHashMap uses segment-level locking (or CAS in Java 8+) for much better throughput.',
    },
  ],
}
