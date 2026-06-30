export default {
  id: 'stream-api',
  title: '1. Stream API',
  explanation: `A **Stream** is a sequence of elements that supports functional-style processing. Streams are:
- **Lazy** — intermediate operations don't execute until a terminal operation is called
- **Single-use** — once consumed, a stream cannot be reused
- **Not a data structure** — they don't store elements; they process them on the fly

**Pipeline:** source → intermediate ops (zero or more) → terminal op (exactly one).`,
  code: `import java.util.*;
import java.util.stream.*;

List<String> names = List.of("Alice", "Bob", "Charlie", "Dave", "Anna");

// ─── Intermediate operations (lazy, return Stream) ───────────────────────
names.stream()
    .filter(s -> s.startsWith("A"))    // keep matching elements
    .map(String::toUpperCase)          // transform each element
    .sorted()                          // sort (natural order)
    .distinct()                        // remove duplicates
    .limit(3)                          // take first 3
    .skip(1)                           // skip first 1
    .peek(s -> System.out.println("→ " + s))  // debug tap (still lazy)
    .forEach(System.out::println);     // ← TERMINAL — triggers the whole pipeline

// flatMap — flattens nested collections
List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)       // Stream<List<Integer>> → Stream<Integer>
    .collect(Collectors.toList());     // [1, 2, 3, 4]

// ─── Terminal operations ──────────────────────────────────────────────────
long count = names.stream().filter(s -> s.length() > 3).count();

Optional<String> first  = names.stream().filter(s -> s.startsWith("B")).findFirst();
boolean anyMatch  = names.stream().anyMatch(s -> s.contains("l"));
boolean allMatch  = names.stream().allMatch(s -> s.length() > 2);
boolean noneMatch = names.stream().noneMatch(String::isEmpty);

Optional<String> max = names.stream().max(Comparator.comparingInt(String::length));
Optional<String> min = names.stream().min(Comparator.naturalOrder());

// reduce — fold all elements into one value
int sum = Stream.of(1, 2, 3, 4, 5).reduce(0, Integer::sum);  // 15
Optional<Integer> product = Stream.of(1,2,3,4).reduce((a, b) -> a * b); // 24

// ─── Collectors ──────────────────────────────────────────────────────────
List<String>       toList  = names.stream().collect(Collectors.toList());
Set<String>        toSet   = names.stream().collect(Collectors.toSet());
String             joined  = names.stream().collect(Collectors.joining(", ", "[", "]"));

Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
// {3=[Bob], 4=[Dave, Anna], 5=[Alice], 7=[Charlie]}

Map<Boolean, List<String>> partition = names.stream()
    .collect(Collectors.partitioningBy(s -> s.length() > 4));
// {false=[Bob, Dave, Anna], true=[Alice, Charlie]}

Map<String, Long> freq = names.stream()
    .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

// ─── Primitive streams — avoid boxing ────────────────────────────────────
IntStream.range(0, 5).forEach(System.out::println);     // 0 1 2 3 4
IntStream.rangeClosed(1, 5).sum();                       // 15
IntStream.of(1,2,3).average();                          // OptionalDouble

List<Integer> nums = List.of(1, 2, 3, 4, 5);
int total = nums.stream().mapToInt(Integer::intValue).sum(); // avoid boxing
IntSummaryStatistics stats = nums.stream()
    .mapToInt(Integer::intValue).summaryStatistics();
stats.getMin(); stats.getMax(); stats.getAverage(); stats.getSum();`,
  points: [
    'Streams are lazy — filter/map don\'t run until a terminal op is called. Short-circuit terminals (findFirst, anyMatch) can stop early.',
    'Never reuse a stream — once a terminal op is called, the stream is consumed. Calling a second terminal op throws IllegalStateException.',
    'Parallel streams: names.parallelStream() — uses ForkJoinPool. Only helps when: large data, CPU-bound, no shared mutable state. Otherwise adds overhead.',
    'Collectors.toUnmodifiableList() (Java 10+) collects to an immutable list — prefer over toList() when you don\'t need mutation.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between map() and flatMap()?\nA: map() transforms each element one-to-one (Stream<T> → Stream<R>). flatMap() maps each element to a stream, then flattens all those streams into one (Stream<Stream<T>> → Stream<T>). Use flatMap when each input element produces zero or more output elements, e.g. splitting sentences into words.',
    },
    {
      type: 'gotcha',
      content: 'Stream.of(array) on a primitive array (int[]) gives Stream<int[]> — one element. Use Arrays.stream(intArray) or IntStream.of() instead to get per-element processing.',
    },
  ],
}
