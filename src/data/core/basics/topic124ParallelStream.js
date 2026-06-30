export default {
  id: 'parallel-stream',
  title: '124. Parallel Stream',
  explanation: `A parallel stream splits its elements into multiple chunks and processes them concurrently using multiple threads from the ForkJoinPool.commonPool(). This can significantly speed up CPU-intensive operations on large datasets.

**Creating a parallel stream:**
- collection.parallelStream()
- stream.parallel() — converts an existing stream to parallel
- stream.sequential() — converts back to sequential

**When parallel streams help:**
- Large datasets (thousands or millions of elements)
- CPU-intensive, stateless operations (e.g., number crunching, transformations)
- No shared mutable state between operations
- When the cost of splitting and merging outweighs sequential overhead

**When parallel streams HURT:**
- Small collections — thread overhead dominates
- I/O-bound operations — adding threads does not help
- Operations with shared mutable state — race conditions
- Stream sources that are not easily splittable (e.g., LinkedList, Iterator-backed streams)
- Operations that require ordering (sorted, findFirst) — parallel may still work but with overhead to maintain order

**Thread pool:**
Parallel streams use ForkJoinPool.commonPool() by default — the same pool used by CompletableFuture. Blocking operations in parallel streams block those common pool threads, which can starve other tasks. For blocking work, use a custom ForkJoinPool.

**Order guarantee:**
findFirst() returns the first element in encounter order even in parallel. findAny() may return any element — it is faster in parallel.`,
  code: `import java.util.*;
import java.util.stream.*;
import java.util.concurrent.ForkJoinPool;

public class ParallelStreamDemo {
    public static void main(String[] args) throws Exception {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= 1_000_000; i++) numbers.add(i);

        // Sequential stream
        long start = System.currentTimeMillis();
        long seqSum = numbers.stream()
            .mapToLong(n -> n * n)   // CPU-intensive: square each number
            .sum();
        long seqTime = System.currentTimeMillis() - start;
        System.out.println("Sequential sum: " + seqSum + " in " + seqTime + "ms");

        // Parallel stream — same code, just parallelStream()
        start = System.currentTimeMillis();
        long parSum = numbers.parallelStream()
            .mapToLong(n -> n * n)
            .sum();
        long parTime = System.currentTimeMillis() - start;
        System.out.println("Parallel sum:   " + parSum + " in " + parTime + "ms");

        // Order is NOT guaranteed with parallelStream().forEach()
        List<Integer> small = Arrays.asList(1, 2, 3, 4, 5);
        System.out.print("Parallel forEach order: ");
        small.parallelStream().forEach(n -> System.out.print(n + " "));
        System.out.println();  // order may vary

        // forEachOrdered — maintains order but reduces parallelism benefit
        System.out.print("forEachOrdered: ");
        small.parallelStream().forEachOrdered(n -> System.out.print(n + " "));
        System.out.println();  // always 1 2 3 4 5

        // findFirst vs findAny on parallel stream
        Optional<Integer> first = numbers.parallelStream()
            .filter(n -> n % 100 == 0).findFirst();
        Optional<Integer> any = numbers.parallelStream()
            .filter(n -> n % 100 == 0).findAny();
        System.out.println("findFirst: " + first.get());  // always 100
        System.out.println("findAny:   " + any.get());    // could be any: 100, 200, 300...

        // Custom ForkJoinPool — avoid using common pool for blocking work
        ForkJoinPool customPool = new ForkJoinPool(4);
        long result = customPool.submit(() ->
            numbers.parallelStream().mapToLong(n -> n).sum()
        ).get();
        customPool.shutdown();
        System.out.println("Custom pool sum: " + result);
    }
}`,
  codeTitle: 'Sequential vs Parallel Streams',
  points: [
    'parallelStream() uses ForkJoinPool.commonPool() to process elements on multiple threads simultaneously',
    'Best for: large datasets, CPU-intensive stateless operations with no shared mutable state',
    'forEach() on a parallel stream does not guarantee element processing order — use forEachOrdered() if order matters',
    'findAny() is faster than findFirst() in parallel because it takes whichever element any thread finds first',
    'Parallel streams do NOT help for small collections — the thread management overhead exceeds the gains',
    'Never use parallel streams with operations that modify shared mutable state — causes race conditions',
    'For blocking I/O inside a parallel stream, use a custom ForkJoinPool to avoid starving the common pool',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'collect() to a non-thread-safe collection (ArrayList, HashMap) in a parallel stream is unsafe. Use Collectors.toList() or Collectors.toConcurrentMap() — the Collectors framework handles concurrency internally.',
    },
    {
      type: 'interview',
      content: 'Q: When should you NOT use a parallel stream?\nA: When the dataset is small (overhead > gain), when operations are I/O-bound, when operations have shared mutable state, when the source is not easily splittable (e.g., LinkedList), or when element ordering must be preserved throughout.',
    },
    {
      type: 'tip',
      content: 'Always benchmark before switching to parallel streams. A sequential stream often outperforms parallel for collections under a few thousand elements due to thread coordination overhead.',
    },
  ],
}
