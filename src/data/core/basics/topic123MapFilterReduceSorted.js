export default {
  id: 'map-filter-reduce-sorted',
  title: '123. map(), filter(), reduce(), and sorted()',
  explanation: `These four operations form the core of functional data processing in Java streams. Together, they cover the vast majority of data transformation tasks.

**filter(Predicate<T> predicate)**
Keeps only elements for which the predicate returns true. The result has the same type but fewer (or equal) elements.
- Input: Stream<T>, Output: Stream<T>

**map(Function<T, R> mapper)**
Transforms each element from type T to type R. All elements are processed; the count stays the same.
- Input: Stream<T>, Output: Stream<R>
- Specializations for primitives: mapToInt(), mapToLong(), mapToDouble() — return IntStream, LongStream, DoubleStream (avoid boxing overhead)

**sorted() / sorted(Comparator<T>)**
Returns a new stream with elements in sorted order. sorted() uses natural ordering (Comparable); sorted(comparator) uses a custom ordering.
- This is a stateful intermediate operation — it must see all elements before it can produce any, so it cannot be lazy in the usual sense.

**reduce(T identity, BinaryOperator<T> accumulator)**
Combines all elements into a single result. The identity is the starting value (also returned for an empty stream).
- reduce(0, Integer::sum) sums all integers
- reduce("", (a, b) -> a + b) concatenates all strings
- Variant without identity: reduce(BinaryOperator) returns Optional<T>

**Combining them:** filter, map, sorted, and reduce are often chained in one pipeline — each returns a stream and feeds the next.`,
  code: `import java.util.*;
import java.util.stream.*;

public class MapFilterReduceSortedDemo {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(5, 3, 8, 1, 9, 2, 7, 4, 6, 10);
        List<String> words = Arrays.asList("banana", "apple", "cherry", "date", "elderberry", "fig");

        // filter — keep numbers > 5
        List<Integer> bigNums = numbers.stream()
            .filter(n -> n > 5)
            .collect(Collectors.toList());
        System.out.println("filter > 5: " + bigNums);  // [8, 9, 7, 6, 10]

        // map — square each number
        List<Integer> squares = numbers.stream()
            .map(n -> n * n)
            .collect(Collectors.toList());
        System.out.println("map (square): " + squares);

        // mapToInt — avoids boxing, enables sum/average/min/max
        int sum = numbers.stream()
            .mapToInt(Integer::intValue)
            .sum();
        System.out.println("sum: " + sum);  // 55

        OptionalDouble avg = numbers.stream()
            .mapToInt(Integer::intValue)
            .average();
        avg.ifPresent(a -> System.out.println("average: " + a));  // 5.5

        // sorted — natural order
        List<Integer> sorted = numbers.stream()
            .sorted()
            .collect(Collectors.toList());
        System.out.println("sorted: " + sorted);

        // sorted with Comparator — reverse order
        List<String> sortedWords = words.stream()
            .sorted(Comparator.comparingInt(String::length))
            .collect(Collectors.toList());
        System.out.println("sorted by length: " + sortedWords);

        // reduce — product of all numbers
        int product = numbers.stream()
            .reduce(1, (a, b) -> a * b);
        System.out.println("product: " + product);  // 3628800

        // reduce — concatenate words
        String sentence = words.stream()
            .sorted()
            .reduce("", (a, b) -> a.isEmpty() ? b : a + ", " + b);
        System.out.println("sentence: " + sentence);

        // Chained: filter + map + sorted + collect
        List<String> result = words.stream()
            .filter(w -> w.length() > 4)      // keep long words
            .map(String::toUpperCase)          // uppercase
            .sorted()                          // alphabetical
            .collect(Collectors.toList());
        System.out.println("chain result: " + result);
    }
}`,
  codeTitle: 'filter, map, reduce, sorted in Action',
  points: [
    'filter(Predicate) keeps matching elements, same type, potentially fewer elements',
    'map(Function) transforms each element 1-to-1, same count, possibly different type',
    'mapToInt/mapToLong/mapToDouble convert to primitive streams — enables sum(), average(), min(), max() without boxing',
    'sorted() requires seeing all elements before producing output — it fully materializes the stream at that stage',
    'reduce(identity, BinaryOperator) folds all elements into one value; identity is returned for empty streams',
    'reduce() without identity returns Optional<T> — empty Optional for empty streams',
    'Chain filter + map + sorted + reduce/collect to build expressive, readable data pipelines in a single statement',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'sorted() is a stateful intermediate operation — it cannot process elements lazily. In a very large stream, this may cause memory issues since all elements must be held in memory for sorting.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between map() and mapToInt()?\nA: map() returns Stream<Integer> — each int is boxed in an Integer object. mapToInt() returns IntStream — works with primitive int values directly, avoiding boxing overhead. Use mapToInt() when you plan to call sum(), average(), min(), max().',
    },
    {
      type: 'tip',
      content: 'Use reduce() for simple folding (sum, product, concatenation). For more complex aggregations, Collectors.groupingBy(), Collectors.joining(), and Collectors.toMap() are usually more readable.',
    },
  ],
}
