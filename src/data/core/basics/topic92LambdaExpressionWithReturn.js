export default {
  id: 'lambda-expression-with-return',
  title: '92. Lambda Expression with Return',
  explanation: `Lambda expressions can return values just like regular methods. There are two forms:

1. **Expression lambda** — the body is a single expression whose value is automatically returned (no \`return\` keyword, no braces).
   Example: \`(int x) -> x * x\`

2. **Block lambda** — the body is a statement block enclosed in \`{}\`. You must explicitly write \`return\` to return a value (same as a method body).
   Example: \`(int x, int y) -> { int sum = x + y; return sum; }\`

For \`void\` functional interfaces (Consumer, Runnable), no return is needed in block form. For non-void interfaces (Function, Supplier, Comparator), the block must always have a return statement on all code paths.

The return type of a lambda must match the return type of the functional interface's abstract method. The compiler verifies this and infers the type from the target.`,
  code: `import java.util.*;
import java.util.function.*;

public class Demo {
    public static void main(String[] args) {
        // Expression lambda — implicit return
        Function<Integer, Integer> square = x -> x * x;
        System.out.println(square.apply(5));   // 25
        System.out.println(square.apply(12));  // 144

        // Block lambda — explicit return
        Function<Integer, String> classify = n -> {
            if (n > 0) return "positive";
            if (n < 0) return "negative";
            return "zero";
        };
        System.out.println(classify.apply(10));  // positive
        System.out.println(classify.apply(-3));  // negative
        System.out.println(classify.apply(0));   // zero

        // Comparator with return — sorting strings by last char
        Comparator<String> byLastChar = (a, b) -> {
            char ca = a.charAt(a.length() - 1);
            char cb = b.charAt(b.length() - 1);
            return Character.compare(ca, cb);
        };
        List<String> words = new ArrayList<>(Arrays.asList("banana", "kiwi", "apple"));
        words.sort(byLastChar);
        System.out.println(words);  // [banana, apple, kiwi]

        // Supplier — no param, with return
        Supplier<Double> random = () -> Math.random();
        System.out.println(random.get()); // some random double

        // BiFunction with return
        BiFunction<Integer, Integer, Integer> max = (a, b) -> {
            return a > b ? a : b;
        };
        System.out.println(max.apply(7, 3)); // 7

        // Returning a lambda from a method
        Function<Integer, Function<Integer, Integer>> adder = x -> (y -> x + y);
        Function<Integer, Integer> add5 = adder.apply(5);
        System.out.println(add5.apply(3));  // 8
        System.out.println(add5.apply(10)); // 15
    }
}`,
  codeTitle: 'Lambda Expressions with Explicit and Implicit Return',
  points: [
    'Expression lambdas: (params) -> expr — the expression is implicitly returned, no braces needed',
    'Block lambdas: (params) -> { stmts; return value; } — explicit return required for non-void types',
    'All return paths in a block lambda must return a compatible value — same rule as regular methods',
    'void lambdas (Consumer, Runnable) do not return — a block body ends with the last statement executing',
    'The return type is inferred from the target functional interface, not declared in the lambda',
    'Lambdas can return other lambdas, enabling currying and partial application patterns',
    'An expression lambda that calls a void method (like System.out.println) works for Consumer — the void expression matches the Consumer contract',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In a block lambda, if any code path returns and another does not (e.g., an if without else with a return), the compiler gives a "missing return statement" error — same as in a regular method. Make sure ALL paths return a value.',
    },
    {
      type: 'interview',
      content: 'Q: Can a lambda expression throw a checked exception?\nA: Only if the functional interface declares that exception in its throws clause. Runnable.run() does not declare any checked exceptions, so a lambda implementing Runnable cannot throw a checked exception. Callable.call() declares throws Exception, so it can.',
    },
    {
      type: 'tip',
      content: 'Prefer expression lambdas over block lambdas when possible — they are shorter and more readable. Extract complex logic into a named method and reference it with ClassName::method instead of writing a long block lambda.',
    },
  ],
}
