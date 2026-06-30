export default {
  id: 'collection-api',
  title: '108. Collection API',
  explanation: `The Java Collections Framework (JCF) is a unified architecture for representing and manipulating groups of objects. It provides ready-made data structures and algorithms so you don't have to implement them from scratch.

The framework is built around the java.util.Collection interface, which sits at the root of most collection types. The key sub-interfaces are:
- **List** — ordered, allows duplicates (ArrayList, LinkedList, Vector)
- **Set** — no duplicates (HashSet, LinkedHashSet, TreeSet)
- **Queue** — FIFO ordering, used for task processing (ArrayDeque, PriorityQueue, LinkedList)
- **Deque** — double-ended queue, supports both FIFO and LIFO (ArrayDeque)

**Map** is NOT a Collection but is part of the framework:
- **Map** — key-value pairs, no duplicate keys (HashMap, LinkedHashMap, TreeMap, Hashtable)

The top-level Collection interface provides methods all collections share: add(), remove(), contains(), size(), isEmpty(), iterator(), toArray(), clear(), addAll(), removeAll(), containsAll().

The Collections utility class (note the 's') provides static helper methods: sort(), shuffle(), reverse(), min(), max(), frequency(), unmodifiableList(), synchronizedList().`,
  code: `import java.util.*;

public class CollectionAPIDemo {
    public static void main(String[] args) {
        // Common Collection methods work on any collection type
        List<String> list = new ArrayList<>(Arrays.asList("banana", "apple", "cherry"));
        Set<String> set = new HashSet<>(Arrays.asList("x", "y", "z"));
        Queue<String> queue = new LinkedList<>(Arrays.asList("first", "second", "third"));

        // Methods from the Collection interface
        System.out.println("Size: " + list.size());
        System.out.println("Contains apple: " + list.contains("apple"));
        list.add("date");
        list.remove("banana");
        System.out.println("After add/remove: " + list);

        // Iterating any collection
        for (String item : set) System.out.println(item);

        // Collections utility class
        Collections.sort(list);
        System.out.println("Sorted: " + list);
        Collections.reverse(list);
        System.out.println("Reversed: " + list);
        System.out.println("Min: " + Collections.min(list));
        System.out.println("Max: " + Collections.max(list));
        Collections.shuffle(list);
        System.out.println("Shuffled: " + list);

        // Unmodifiable view
        List<String> immutable = Collections.unmodifiableList(list);
        // immutable.add("x");  // throws UnsupportedOperationException

        // Java 9+ factory methods
        List<Integer> nums = List.of(1, 2, 3);
        Set<String> fruits = Set.of("apple", "banana");
        Map<String, Integer> scores = Map.of("Alice", 90, "Bob", 85);
    }
}`,
  codeTitle: 'Collection API Overview',
  points: [
    'The Collections Framework provides List, Set, Queue, Deque interfaces all extending Collection, plus the separate Map hierarchy',
    'Core Collection methods: add(), remove(), contains(), size(), isEmpty(), iterator(), clear()',
    'List preserves insertion order and allows duplicates; Set forbids duplicates; Queue processes elements in order',
    'Map stores key-value pairs — keys are unique. Map does NOT extend Collection',
    'The Collections utility class provides static algorithms: sort(), shuffle(), reverse(), min(), max(), frequency()',
    'Java 9+ introduced List.of(), Set.of(), Map.of() for compact immutable collections',
    'Choose the right collection for the job: List for ordered sequences, Set for uniqueness, Map for lookups by key, Queue for task pipelines',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Arrays.asList() returns a fixed-size list — you can modify elements but cannot add or remove. Wrap it in new ArrayList<>() if you need full mutability.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Collection and Collections?\nA: Collection (singular) is the interface that List, Set, and Queue extend. Collections (plural) is a utility class with static helper methods like sort(), shuffle(), and unmodifiableList().',
    },
    {
      type: 'tip',
      content: 'Program to the interface, not the implementation: declare variables as List<String> instead of ArrayList<String>. This makes it easy to swap the implementation later.',
    },
  ],
}
