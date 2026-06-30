export default {
  id: 'arraylist',
  title: '109. ArrayList',
  explanation: `ArrayList is the most commonly used List implementation in Java. It is backed by a dynamic array that grows automatically when the array is full. It combines the fast random access of arrays with the flexibility of dynamic resizing.

**Internal mechanics:**
- Internally uses an Object[] array.
- Default initial capacity is 10.
- When full, it grows by 50% (new capacity = old * 1.5).
- Growth requires creating a new array and copying all elements — an O(n) operation that happens infrequently.
- You can pre-size with new ArrayList<>(initialCapacity) to avoid resizing if you know the size upfront.

**Performance characteristics:**
- get(index), set(index): O(1) — direct array access
- add(element) at end: amortized O(1)
- add(index, element): O(n) — must shift elements right
- remove(index): O(n) — must shift elements left
- contains(): O(n) — linear scan

**When to use ArrayList vs LinkedList:**
- ArrayList is better for: random access by index, iteration, most use cases
- LinkedList is better for: frequent inserts/deletes at the front or middle, implementing queues/stacks

ArrayList is NOT thread-safe. For concurrent access, use Collections.synchronizedList() or CopyOnWriteArrayList.`,
  code: `import java.util.*;

public class ArrayListDemo {
    public static void main(String[] args) {
        // Creating ArrayList
        ArrayList<String> names = new ArrayList<>();
        ArrayList<Integer> sized = new ArrayList<>(100);  // pre-size to avoid resizing

        // Adding elements
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        names.add(1, "Diana");  // insert at index 1 — shifts Bob and Charlie right
        System.out.println(names);  // [Alice, Diana, Bob, Charlie]

        // Accessing elements
        System.out.println("Index 0: " + names.get(0));  // Alice
        System.out.println("Size: " + names.size());     // 4

        // Modifying
        names.set(2, "Eve");  // replace index 2
        System.out.println("After set: " + names);

        // Removing
        names.remove("Diana");        // by value — O(n)
        names.remove(0);              // by index — O(n) to shift
        System.out.println("After remove: " + names);

        // Searching
        names.add("Alice");
        System.out.println("Contains Alice: " + names.contains("Alice"));  // true
        System.out.println("Index of Alice: " + names.indexOf("Alice"));

        // Iterating
        for (String name : names) System.out.println(name);
        names.forEach(System.out::println);  // Java 8+

        // Sorting
        Collections.sort(names);
        names.sort(Comparator.reverseOrder());

        // Converting
        String[] arr = names.toArray(new String[0]);
        List<String> fromArr = Arrays.asList("x", "y", "z");
        List<String> mutable = new ArrayList<>(fromArr);

        // Sublist
        List<String> sub = names.subList(0, 2);  // view, not a copy
        System.out.println("Sublist: " + sub);
    }
}`,
  codeTitle: 'ArrayList Operations',
  points: [
    'ArrayList is backed by a dynamic Object[] array with default capacity 10; grows by 50% when full',
    'get(i) and set(i) are O(1) — direct index access like an array',
    'add() at the end is amortized O(1); add(index, element) is O(n) due to shifting',
    'remove(index) is O(n) due to shifting; remove(Object) scans linearly then shifts',
    'contains() and indexOf() are O(n) — ArrayList has no hash structure for fast lookup',
    'Pre-size with new ArrayList<>(capacity) when you know the approximate size to avoid repeated resizing',
    'Not thread-safe — wrap with Collections.synchronizedList() or use CopyOnWriteArrayList for concurrent access',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'remove(int index) and remove(Object o) can be ambiguous with Integer lists. For example, list.remove(1) removes the element at index 1, not the Integer value 1. Use list.remove(Integer.valueOf(1)) to remove by value.',
    },
    {
      type: 'interview',
      content: 'Q: What is the default initial capacity of ArrayList, and how does it grow?\nA: Default capacity is 10. When full, it creates a new array with capacity = oldCapacity * 3 / 2 + 1 (approximately 1.5x) and copies elements over.',
    },
    {
      type: 'tip',
      content: 'Use List.copyOf() (Java 10+) to make a truly immutable copy of a list. subList() returns a view — modifying the sublist modifies the original list.',
    },
  ],
}
