export default {
  id: 'stream-api',
  title: '122. Stream API',
  explanation: `A Stream is a sequence of elements supporting sequential and parallel aggregate operations. The Stream API consists of three parts:

**1. Source** — where elements come from:
- Collection: list.stream() or list.parallelStream()
- Array: Arrays.stream(arr)
- Static factory: Stream.of(1,2,3), Stream.generate(), Stream.iterate()
- Files: Files.lines(path)

**2. Intermediate operations** — lazy; return a new Stream; do not execute until a terminal operation is called:
- filter(Predicate) — keep elements that match
- map(Function) — transform each element
- flatMap(Function) — flatten nested streams
- distinct() — remove duplicates
- sorted() / sorted(Comparator) — sort
- limit(n) — take first n elements
- skip(n) — skip first n elements
- peek(Consumer) — side-effect for debugging, passes elements through unchanged

**3. Terminal operations** — trigger the pipeline; produce a result or side-effect:
- collect(Collector) — gather into a collection
- count() — count elements
- findFirst() / findAny() — return Optional<T>
- anyMatch / allMatch / noneMatch(Predicate) — return boolean
- reduce(identity, BinaryOperator) — fold elements into one value
- min/max(Comparator) — return Optional<T>
- forEach(Consumer) — side-effect for each element
- toArray() — convert to array

**Lazy evaluation:** intermediate operations build a pipeline descriptor; no actual processing happens until a terminal operation is called. This enables short-circuit optimizations (e.g., limit + anyMatch may process only a few elements).`,
  code: `import java.util.*;
import java.util.stream.*;

public class StreamAPIDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Dave", "Eve", "Frank");

        // filter — keep names longer than 3 chars
        List<String> longNames = names.stream()
            .filter(n -> n.length() > 3)
            .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);

        // map — transform to uppercase
        List<String> upper = names.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Upper: " + upper);

        // sorted + limit
        List<String> top3 = names.stream()
            .sorted()
            .limit(3)
            .collect(Collectors.toList());
        System.out.println("Top 3 sorted: " + top3);

        // distinct + count
        List<Integer> nums = Arrays.asList(1, 2, 2, 3, 3, 3, 4);
        long distinctCount = nums.stream().distinct().count();
        System.out.println("Distinct count: " + distinctCount);  // 4

        // reduce — sum
        int total = nums.stream().reduce(0, Integer::sum);
        System.out.println("Sum: " + total);  // 18

        // findFirst / Optional
        Optional<String> first = names.stream()
            .filter(n -> n.startsWith("C"))
            .findFirst();
        first.ifPresent(n -> System.out.println("Found: " + n));  // Charlie

        // anyMatch / allMatch / noneMatch
        boolean anyE = names.stream().anyMatch(n -> n.startsWith("E"));
        boolean allShort = names.stream().allMatch(n -> n.length() < 10);
        System.out.println("Any starts E: " + anyE);     // true
        System.out.println("All short: " + allShort);    // true

        // flatMap — flatten list of lists
        List<List<Integer>> nested = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5),
            Arrays.asList(6, 7, 8, 9)
        );
        List<Integer> flat = nested.stream()
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
        System.out.println("Flat: " + flat);

        // Stream.of and Stream.generate
        Stream.of("x", "y", "z").forEach(System.out::println);
        Stream.iterate(0, n -> n + 2).limit(5).forEach(System.out::print); // 0 2 4 6 8
    }
}`,
  codeTitle: 'Stream API — Source, Intermediate, Terminal',
  points: [
    'A stream pipeline has three parts: source, zero or more intermediate operations, one terminal operation',
    'Intermediate operations are lazy — they build a pipeline but do not process data until a terminal operation runs',
    'filter() keeps elements matching a Predicate; map() transforms elements with a Function',
    'flatMap() maps each element to a stream and flattens all those streams into one',
    'Terminal operations: collect(), count(), reduce(), findFirst(), anyMatch(), min(), max(), forEach()',
    'Short-circuit terminals (findFirst, anyMatch) can stop processing early without traversing the whole stream',
    'collect(Collectors.toList()), toSet(), toMap(), joining(), groupingBy() are the most common Collectors',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Intermediate operations do NOTHING by themselves — no code runs until you call a terminal operation. Debugging a stream with only intermediate operations will show nothing.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between map() and flatMap()?\nA: map() transforms each element 1-to-1 and returns Stream<Stream<T>> if the function returns a stream. flatMap() maps each element to a stream and merges all those streams into one flat Stream<T>. Use flatMap to "unwrap" nested structures.',
    },
    {
      type: 'tip',
      content: 'Use peek() only for debugging — it passes elements through unchanged. Do not use it for side-effectful production logic because lazy evaluation may skip it if a short-circuit terminal is used.',
    },
  ],
}
