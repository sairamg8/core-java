export default {
  id: 'need-for-stream-api',
  title: '120. Need for the Stream API',
  explanation: `Before Java 8, processing collections required writing explicit imperative loops — iterate, check condition, transform, accumulate. This is verbose, error-prone, and hard to parallelize.

**Problems with the old approach:**
1. **Verbose boilerplate** — even a simple "filter and sum" requires a loop, a variable, an if-check, and an accumulator.
2. **Difficult to parallelize** — splitting work across CPU cores requires manual thread management.
3. **Sequential by default with no easy alternative** — there is no simple way to say "do this work in parallel."
4. **Hard to compose** — chaining multiple operations (filter, then map, then sort) creates deeply nested code.

**What the Stream API provides:**
- A declarative, pipeline-based way to express data processing operations.
- Built-in support for parallelism — just replace stream() with parallelStream().
- Lazy evaluation — intermediate operations are not executed until a terminal operation triggers the pipeline.
- Composability — chain as many operations as needed without nesting.

**Stream vs Collection:**
- A Collection is a data structure that stores elements.
- A Stream is a view of data that describes computations to be performed — it does NOT store elements.
- A stream can be consumed only once; a collection can be iterated many times.

The Stream API is built on functional interfaces (Predicate, Function, Consumer, Supplier) and lambda expressions.`,
  code: `import java.util.*;
import java.util.stream.*;

public class NeedForStreamAPIDemo {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // --- OLD WAY: imperative ---
        // Sum of even numbers
        int sumOld = 0;
        for (int n : numbers) {
            if (n % 2 == 0) {
                sumOld += n;
            }
        }
        System.out.println("Sum of evens (old): " + sumOld);  // 30

        // Filter names longer than 3 chars, uppercase them, sort
        List<String> names = Arrays.asList("Bob", "Alice", "Jo", "Charlie", "Eve");
        List<String> resultOld = new ArrayList<>();
        for (String name : names) {
            if (name.length() > 3) {
                resultOld.add(name.toUpperCase());
            }
        }
        Collections.sort(resultOld);
        System.out.println("Long names (old): " + resultOld);

        // --- NEW WAY: Stream API ---
        int sumNew = numbers.stream()
            .filter(n -> n % 2 == 0)
            .mapToInt(Integer::intValue)
            .sum();
        System.out.println("Sum of evens (stream): " + sumNew);  // 30

        List<String> resultNew = names.stream()
            .filter(name -> name.length() > 3)
            .map(String::toUpperCase)
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Long names (stream): " + resultNew);

        // Parallel stream — same code, uses multiple cores automatically
        long count = numbers.parallelStream()
            .filter(n -> n % 2 == 0)
            .count();
        System.out.println("Even count (parallel): " + count);
    }
}`,
  codeTitle: 'Imperative vs Stream API',
  points: [
    'The Stream API provides a declarative, pipeline-based alternative to imperative loops for data processing',
    'Streams support filter, map, reduce, sort, collect and more — composable without deep nesting',
    'parallelStream() enables multi-core processing with no code changes to the pipeline logic',
    'Streams are lazy — intermediate operations do not execute until a terminal operation (collect, sum, count) triggers the pipeline',
    'A Stream does not store data; it describes operations on a source (Collection, array, or I/O channel)',
    'A stream can only be consumed once — reuse the source collection and create a new stream',
    'Stream code is more declarative and closer to what you want to do, rather than how to do it',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'A stream that has already been consumed (terminal operation called) throws IllegalStateException if you try to use it again. Always create a new stream from the source collection.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a Collection and a Stream?\nA: A Collection stores elements in memory; you can iterate it multiple times. A Stream is a one-time pipeline of operations on a data source — it does not store elements, is lazy, and can only be traversed once.',
    },
    {
      type: 'tip',
      content: 'Do not use parallelStream() by default. It has overhead and only helps when the dataset is large and the operations are CPU-intensive and independent. For small collections or I/O-bound work, sequential streams are faster.',
    },
  ],
}
