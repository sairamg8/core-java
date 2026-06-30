export default {
  id: 'new-functional-interface',
  title: '90. New Functional Interface',
  explanation: `Java 8 introduced the \`java.util.function\` package with a rich set of built-in functional interfaces to cover the most common lambda use cases without requiring you to define your own every time.

The four core functional interfaces are:
- **Predicate<T>** — takes T, returns boolean. Used for filtering: \`test(T t)\`
- **Function<T, R>** — takes T, returns R. Used for transformation: \`apply(T t)\`
- **Consumer<T>** — takes T, returns nothing. Used for side effects: \`accept(T t)\`
- **Supplier<T>** — takes nothing, returns T. Used for lazy creation: \`get()\`

These are the building blocks. The package also provides:
- BiPredicate, BiFunction, BiConsumer for two-argument versions
- UnaryOperator<T> (Function<T,T>) and BinaryOperator<T> (BiFunction<T,T,T>) for same-type operations
- IntPredicate, LongFunction, DoubleConsumer, etc. — primitive specializations to avoid autoboxing overhead

Understanding these interfaces is essential for mastering Java Streams, Optional, and modern Java APIs.`,
  code: `import java.util.function.*;
import java.util.*;

public class Demo {
    public static void main(String[] args) {
        // Predicate<T> — boolean test
        Predicate<String> isLong = s -> s.length() > 5;
        System.out.println(isLong.test("Hello"));     // false
        System.out.println(isLong.test("Hello World")); // true
        Predicate<String> startsWithH = s -> s.startsWith("H");
        Predicate<String> combined = isLong.and(startsWithH);
        System.out.println(combined.test("Hi"));          // false
        System.out.println(combined.test("Hello World")); // true

        // Function<T, R> — transform T to R
        Function<String, Integer> strLen = String::length;
        System.out.println(strLen.apply("Java")); // 4
        Function<Integer, String> intToStr = i -> "Number: " + i;
        Function<String, String> composed = strLen.andThen(intToStr);
        System.out.println(composed.apply("Hello")); // Number: 5

        // Consumer<T> — side effect, no return
        Consumer<String> printer = System.out::println;
        Consumer<String> upper = s -> System.out.println(s.toUpperCase());
        Consumer<String> both = printer.andThen(upper);
        both.accept("java"); // java\nJAVA

        // Supplier<T> — produces a value
        Supplier<List<String>> listFactory = ArrayList::new;
        List<String> list1 = listFactory.get();
        List<String> list2 = listFactory.get();
        list1.add("a"); list2.add("b");
        System.out.println(list1); // [a]
        System.out.println(list2); // [b]

        // BiFunction<T, U, R>
        BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
        System.out.println(repeat.apply("Ha", 3)); // HaHaHa

        // UnaryOperator<T> — same type in and out
        UnaryOperator<String> trim = String::trim;
        System.out.println("|" + trim.apply("  hello  ") + "|"); // |hello|
    }
}`,
  codeTitle: 'Built-in Functional Interfaces: Predicate, Function, Consumer, Supplier',
  points: [
    'Predicate<T> tests a condition and returns boolean — supports and(), or(), negate() for composition',
    'Function<T,R> maps input to output — supports andThen() and compose() for chaining',
    'Consumer<T> performs a side effect on input and returns void — supports andThen() for sequencing',
    'Supplier<T> produces a value without any input — ideal for lazy initialization and factory methods',
    'BiPredicate, BiFunction, BiConsumer are two-argument variants',
    'UnaryOperator<T> is shorthand for Function<T,T>; BinaryOperator<T> for BiFunction<T,T,T>',
    'Primitive specializations (IntPredicate, LongFunction, DoubleConsumer, etc.) avoid autoboxing overhead',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Function.compose(f) applies f FIRST, then this function. Function.andThen(f) applies this function first, then f. It is the opposite of what you might expect from reading left to right.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Consumer and Function when a method has a void return type?\nA: Consumer<T> is used when the lambda has a void return — it accepts T and produces no result. Function<T, Void> technically works but is awkward (you must return null). Always use Consumer for side-effect-only operations.',
    },
    {
      type: 'tip',
      content: 'Use primitive specializations (IntSupplier, LongFunction, DoubleConsumer, etc.) when working with primitives in hot loops. They avoid boxing/unboxing overhead that would occur with generic Supplier<Integer> etc.',
    },
  ],
}
