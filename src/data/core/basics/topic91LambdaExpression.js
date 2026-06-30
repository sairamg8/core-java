export default {
  id: 'lambda-expression',
  title: '91. Lambda Expression',
  explanation: `A lambda expression is a concise way to represent an anonymous function — a block of code that can be passed around as a value. Lambdas were introduced in Java 8 and are one of its most important features because they enable functional programming styles, make collections operations (Streams) fluent, and dramatically reduce boilerplate compared to anonymous inner classes.

Syntax: \`(parameters) -> body\`

The body can be a single expression (implicit return) or a block with explicit return:
- \`(int x) -> x * x\`                  — single expression, no braces, implicit return
- \`(int x, int y) -> x + y\`           — two parameters
- \`() -> System.out.println("Hi")\`     — no parameters
- \`(String s) -> { return s.length(); }\` — block body with explicit return

A lambda expression can be used wherever a **functional interface** (one abstract method) is expected. The lambda body must be compatible with the method's parameter types and return type.

Type inference: Java can usually infer parameter types from the target functional interface — you can write \`(x, y) -> x + y\` instead of \`(int x, int y) -> x + y\`.`,
  code: `import java.util.*;
import java.util.function.*;

public class Demo {
    public static void main(String[] args) {
        // Before Java 8 — anonymous class
        Runnable r1 = new Runnable() {
            @Override
            public void run() {
                System.out.println("Running (old style)");
            }
        };

        // With lambda — same thing, 1 line
        Runnable r2 = () -> System.out.println("Running (lambda)");

        r1.run();  // Running (old style)
        r2.run();  // Running (lambda)

        // Lambda with parameters
        Comparator<String> byLength = (a, b) -> a.length() - b.length();
        List<String> words = new ArrayList<>(Arrays.asList("banana", "apple", "kiwi", "mango"));
        words.sort(byLength);
        System.out.println(words);  // [kiwi, apple, mango, banana]

        // Lambda with block body
        Comparator<String> byLengthThenAlpha = (a, b) -> {
            int cmp = Integer.compare(a.length(), b.length());
            if (cmp != 0) return cmp;
            return a.compareTo(b);
        };
        words.sort(byLengthThenAlpha);
        System.out.println(words);  // [kiwi, apple, mango, banana]

        // Storing lambdas as variables
        Predicate<Integer> isPositive = n -> n > 0;
        Function<String, String> shout = s -> s.toUpperCase() + "!";
        Consumer<String> print = System.out::println;  // method reference

        print.accept(shout.apply("hello")); // HELLO!
        System.out.println(isPositive.test(-3)); // false

        // forEach with lambda
        List.of("Java", "Python", "Go").forEach(lang ->
            System.out.println("Language: " + lang)
        );
    }
}`,
  codeTitle: 'Lambda Expression Syntax and Usage',
  points: [
    'Lambda syntax: (params) -> expression  OR  (params) -> { statements; }',
    'A lambda can only be used where a functional interface (one abstract method) is expected',
    'Type inference allows omitting parameter types when the compiler can determine them from context',
    'Single-parameter lambdas can omit parentheses: n -> n * 2  (parentheses optional)',
    'Zero-parameter lambdas require empty parentheses: () -> 42',
    'Lambdas capture effectively-final variables from the enclosing scope',
    'Method references (ClassName::method) are a shorthand for lambdas that simply call an existing method',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Lambdas cannot capture variables from the enclosing scope unless those variables are effectively final (never reassigned after first assignment). Attempting to modify a captured variable inside a lambda causes a compile error.',
    },
    {
      type: 'interview',
      content: 'Q: Is a lambda expression an object?\nA: Yes, but with a twist. The JVM represents lambdas using invokedynamic bytecode. At runtime, the lambda is wrapped in an object implementing the target functional interface. However, each lambda call creates one object instance, not a new class for each lambda (unlike anonymous inner classes which generate a new .class file each).',
    },
    {
      type: 'tip',
      content: 'Keep lambda bodies short (one or two lines). If the logic is longer, extract it into a named method and use a method reference instead. This keeps the code readable and makes the logic independently testable.',
    },
  ],
}
