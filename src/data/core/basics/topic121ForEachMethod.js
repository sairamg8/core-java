export default {
  id: 'foreach-method',
  title: '121. forEach Method',
  explanation: `forEach() is a default method defined in the Iterable interface (Java 8+) that iterates over each element of a collection and applies a Consumer action. It offers a cleaner, more expressive alternative to the traditional for-each loop when the action is simple.

**Iterable.forEach(Consumer<T> action)** — works on any Collection (List, Set, Map keys/values via entrySet).

**Stream.forEach(Consumer<T> action)** — terminal operation on a stream; applies the action and consumes the stream.

**Map.forEach(BiConsumer<K,V> action)** — convenience method for iterating key-value pairs.

**Consumer<T>** is a functional interface with a single method void accept(T t). You supply it as a lambda or method reference.

**forEach vs for-each loop:**
- forEach is best for simple, side-effect operations (print, update external state).
- The traditional for-each loop is better when you need break/continue, exception handling, or iteration state.
- forEach on a stream cannot break early without using findFirst()/anyMatch() instead.

**Method reference shorthand:**
list.forEach(System.out::println) is equivalent to list.forEach(item -> System.out.println(item)).`,
  code: `import java.util.*;
import java.util.stream.*;

public class ForEachDemo {
    public static void main(String[] args) {
        List<String> fruits = Arrays.asList("apple", "banana", "cherry", "date");

        // Traditional for-each loop
        for (String fruit : fruits) {
            System.out.println(fruit);
        }

        // Iterable.forEach() with lambda
        fruits.forEach(fruit -> System.out.println(fruit.toUpperCase()));

        // Iterable.forEach() with method reference
        fruits.forEach(System.out::println);

        // Map.forEach() with BiConsumer
        Map<String, Integer> scores = Map.of("Alice", 90, "Bob", 85, "Charlie", 92);
        scores.forEach((name, score) ->
            System.out.println(name + " scored " + score));

        // Stream.forEach() — terminal operation
        fruits.stream()
              .filter(f -> f.length() > 5)
              .forEach(System.out::println);  // banana, cherry

        // forEach with side effects — accumulating into external list
        List<String> upperFruits = new ArrayList<>();
        fruits.forEach(f -> upperFruits.add(f.toUpperCase()));
        System.out.println("Upper: " + upperFruits);

        // Multi-line Consumer
        fruits.forEach(fruit -> {
            String upper = fruit.toUpperCase();
            String starred = "*** " + upper + " ***";
            System.out.println(starred);
        });

        // Iterating array elements using Stream.forEach
        int[] nums = {1, 2, 3, 4, 5};
        Arrays.stream(nums).forEach(n -> System.out.print(n + " "));
        System.out.println();
    }
}`,
  codeTitle: 'forEach with Lambda and Method Reference',
  points: [
    'forEach() is a default method in Iterable — available on all Collections (List, Set, Queue)',
    'It takes a Consumer<T> — a functional interface with void accept(T t)',
    'Method references (System.out::println) are a concise way to pass a Consumer',
    'Map.forEach() takes a BiConsumer<K,V> — gives you key and value in each iteration',
    'Stream.forEach() is a terminal operation that consumes the stream',
    'You cannot use break or continue inside forEach — use a traditional for-each loop when you need early exit',
    'forEach is great for side-effect operations (printing, writing to a list); prefer stream operations like map/filter/collect for transformations',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'forEach does not allow break or early termination. If you need to stop iteration early (e.g., find the first match), use Stream.findFirst() or a traditional for loop with break.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Collection.forEach() and Stream.forEach()?\nA: Collection.forEach() is defined in Iterable and iterates the collection directly. Stream.forEach() is a terminal stream operation — it also iterates, but the stream must be set up first. Both accept a Consumer<T>. For parallelStream().forEach(), the order of processing is not guaranteed.',
    },
    {
      type: 'tip',
      content: 'Avoid modifying the collection inside forEach — it throws ConcurrentModificationException. If you need to remove elements while iterating, use removeIf() instead.',
    },
  ],
}
