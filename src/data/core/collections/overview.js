export default {
  id: 'collections-overview',
  title: '1. Collections Framework Overview',
  explanation: `The Java Collections Framework provides ready-to-use data structures and algorithms.

**Hierarchy:**
- \`Iterable\` → \`Collection\` → \`List\`, \`Set\`, \`Queue\`
- \`Map\` is separate — does NOT extend Collection

**Key interfaces and their contracts:**
- **List** — ordered, allows duplicates, index-based access
- **Set** — no duplicates, may or may not be ordered
- **Queue** — FIFO/priority ordering, designed for holding elements before processing
- **Map** — key-value pairs, keys unique`,
  table: {
    headers: ['Interface', 'Ordered?', 'Duplicates?', 'Key Implementations'],
    rows: [
      ['List', 'Yes (insertion)', 'Yes', 'ArrayList, LinkedList, Vector'],
      ['Set', 'No (HashSet)', 'No', 'HashSet, LinkedHashSet, TreeSet'],
      ['Queue', 'FIFO/Priority', 'Yes', 'PriorityQueue, ArrayDeque, LinkedList'],
      ['Map', 'No (HashMap)', 'Keys: No', 'HashMap, LinkedHashMap, TreeMap'],
    ],
  },
  code: `import java.util.*;
import java.util.stream.*;

// Choosing the right collection
List<String> list = new ArrayList<>();  // fast random access
Set<String>  set  = new HashSet<>();    // fast lookup, no dupes
Map<String, Integer> map = new HashMap<>();  // fast key-based access
Queue<String> queue = new LinkedList<>();    // FIFO processing

// Factory methods (Java 9+) — IMMUTABLE collections
List<String> immList = List.of("a", "b", "c");
Set<String>  immSet  = Set.of("x", "y");
Map<String, Integer> immMap = Map.of("a", 1, "b", 2);

// Note: List.of() does NOT allow nulls, does NOT allow duplicates in Set.of()
// immList.add("d");  ← UnsupportedOperationException

// Mutable copy of an immutable collection
List<String> mutable = new ArrayList<>(List.of("a", "b", "c"));
mutable.add("d");  // works

// Collections utility class — useful static methods
Collections.sort(list);
Collections.reverse(list);
Collections.shuffle(list);
Collections.min(list);
Collections.max(list);
Collections.frequency(list, "target");
Collections.unmodifiableList(list);   // read-only view`,
  points: [
    'Always program to the interface type: List<String> list = new ArrayList<>() — not ArrayList<String> list',
    'Collections.unmodifiableXxx() returns a READ-ONLY VIEW — the original list can still be modified (use List.copyOf() for true immutability)',
    'List.copyOf(), Set.copyOf(), Map.copyOf() (Java 10+) create truly immutable copies',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why does Map not extend Collection?\nA: Map stores key-value PAIRS, not single elements. Its API (put, get, containsKey) is fundamentally different from the Collection API (add, remove, contains). They represent different data models.',
    },
  ],
}
