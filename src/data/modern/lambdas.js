export default {
  id: 'lambdas-functional',
  title: '1. Lambdas & Functional Interfaces',
  explanation: `A **lambda expression** is an anonymous function — a concise way to implement a functional interface (an interface with exactly one abstract method).

**Syntax:** \`(params) -> expression\` or \`(params) -> { statements; }\`

**@FunctionalInterface** marks an interface that must have exactly one abstract method — the compiler enforces it.`,
  table: {
    headers: ['Built-in Interface', 'Method', 'Takes', 'Returns', 'Use for'],
    rows: [
      ['Predicate<T>', 'test(T) → boolean', 'T', 'boolean', 'Filtering / testing'],
      ['Function<T,R>', 'apply(T) → R', 'T', 'R', 'Transforming / mapping'],
      ['Consumer<T>', 'accept(T)', 'T', 'void', 'Side effects / printing'],
      ['Supplier<T>', 'get() → T', 'nothing', 'T', 'Factories / lazy values'],
      ['BiFunction<T,U,R>', 'apply(T,U) → R', 'T, U', 'R', 'Two-input transforms'],
      ['UnaryOperator<T>', 'apply(T) → T', 'T', 'T', 'Transform same type'],
      ['BinaryOperator<T>', 'apply(T,T) → T', 'T, T', 'T', 'Reduce / merge same type'],
    ],
  },
  code: `import java.util.*;
import java.util.function.*;

// Lambda syntax forms
Runnable r1 = () -> System.out.println("Hello");          // no args
Runnable r2 = () -> { System.out.println("Hello"); };     // block form

Comparator<String> byLength = (a, b) -> a.length() - b.length(); // two args
Predicate<String> isEmpty   = s -> s.isEmpty();                   // one arg, no parens

// Built-in functional interfaces
Predicate<String> isLong    = s -> s.length() > 5;
Predicate<String> startsA   = s -> s.startsWith("A");
Predicate<String> both      = isLong.and(startsA);      // compose
Predicate<String> either    = isLong.or(startsA);
Predicate<String> notLong   = isLong.negate();

Function<String, Integer> len     = String::length;     // method reference
Function<Integer, String> numStr  = Object::toString;   // static method ref
Function<String, Integer> composed = len;
Function<String, String> doubled  = composed.andThen(n -> n + n)
                                             .andThen(Object::toString);

Consumer<String> print     = System.out::println;       // method reference
Consumer<String> printTwice = print.andThen(print);     // run both

Supplier<List<String>> listFactory = ArrayList::new;    // constructor reference
List<String> fresh = listFactory.get();                 // creates new ArrayList

// Method references (shorthand for lambdas)
// Type              | Lambda                    | Method reference
// Static method     | x -> Math.abs(x)          | Math::abs
// Instance (arg)    | s -> s.toUpperCase()      | String::toUpperCase
// Instance (object) | s -> name.equals(s)       | name::equals
// Constructor       | () -> new ArrayList<>()   | ArrayList::new

List<String> names = Arrays.asList("Bob", "Alice", "Charlie", "Dave");
names.sort(Comparator.comparing(String::length));     // sort by length
names.forEach(System.out::println);                   // print each
names.removeIf(s -> s.length() < 4);                 // remove short names

// Custom functional interface
@FunctionalInterface
interface TriFunction<A, B, C, R> {
    R apply(A a, B b, C c);
}
TriFunction<Integer, Integer, Integer, Integer> clamp =
    (val, min, max) -> Math.min(max, Math.max(min, val));
clamp.apply(150, 0, 100); // 100`,
  points: [
    'Lambdas can capture local variables from the enclosing scope, but those variables must be effectively final (not reassigned after capture)',
    'Lambdas do NOT create a new scope for this — inside a lambda, this refers to the enclosing class instance, unlike anonymous inner classes',
    'Primitive specializations avoid boxing overhead: IntPredicate, LongFunction, ToIntFunction, etc.',
    'Function.identity() returns a function that always returns its input — useful as a no-op in pipelines',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is a functional interface? Can it have more than one method?\nA: A functional interface has exactly one abstract method. It CAN have default methods and static methods — those don\'t count. @FunctionalInterface is optional but recommended as a compile-time check. Runnable, Comparator, and Callable are all functional interfaces.',
    },
    {
      type: 'gotcha',
      content: 'Lambdas capturing a local variable require it to be effectively final. This fails: int count = 0; list.forEach(s -> count++); because count is being reassigned. Use an AtomicInteger or compute the result outside the lambda instead.',
    },
  ],
}
