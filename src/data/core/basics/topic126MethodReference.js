export default {
  id: 'method-reference',
  title: '126. Method Reference',
  explanation: `A method reference is a shorthand notation for a lambda expression that simply calls a single existing method. Instead of writing lambda -> lambda.method(), you write ClassName::method. This makes code more readable by pointing to an existing method by name.

Method references are only valid when the lambda does nothing except call a single method with matching parameters.

**Four types of method references:**

1. **Static method reference:** ClassName::staticMethod
   - lambda: n -> Integer.parseInt(n)
   - reference: Integer::parseInt

2. **Instance method of a particular object:** instance::instanceMethod
   - lambda: s -> System.out.println(s)
   - reference: System.out::println

3. **Instance method of an arbitrary object of a particular type:** ClassName::instanceMethod
   - lambda: s -> s.toUpperCase()
   - reference: String::toUpperCase
   - The first parameter of the lambda becomes the target of the method call.

4. **Constructor reference:** ClassName::new
   - lambda: () -> new ArrayList<>()
   - reference: ArrayList::new

Method references work anywhere a functional interface is expected (Predicate, Function, Consumer, Supplier, Comparator, Runnable, etc.).`,
  code: `import java.util.*;
import java.util.function.*;
import java.util.stream.*;

class Greeter {
    private String prefix;
    Greeter(String prefix) { this.prefix = prefix; }
    void greet(String name) { System.out.println(prefix + name); }
    static String toUpper(String s) { return s.toUpperCase(); }
}

public class MethodReferenceDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Dave");

        // 1. Static method reference
        // Lambda:    (s) -> Integer.parseInt(s)
        // Reference: Integer::parseInt
        List<String> numStrs = Arrays.asList("1", "2", "3", "4");
        List<Integer> nums = numStrs.stream()
            .map(Integer::parseInt)          // static: Integer.parseInt(s)
            .collect(Collectors.toList());
        System.out.println("Parsed: " + nums);

        Function<String, String> upper = Greeter::toUpper; // static from Greeter
        System.out.println(upper.apply("hello"));           // HELLO

        // 2. Instance method of a particular object
        // Lambda:    (s) -> System.out.println(s)
        // Reference: System.out::println
        names.forEach(System.out::println);

        Greeter greeter = new Greeter("Hello, ");
        names.forEach(greeter::greet);  // greeter.greet(name) for each name

        // 3. Instance method of an arbitrary object of a type
        // Lambda:    (s) -> s.toUpperCase()
        // Reference: String::toUpperCase
        List<String> upper2 = names.stream()
            .map(String::toUpperCase)        // s.toUpperCase() for each s
            .collect(Collectors.toList());
        System.out.println("Uppercase: " + upper2);

        // Two-param example — Comparator
        // Lambda:    (a, b) -> a.compareToIgnoreCase(b)
        // Reference: String::compareToIgnoreCase
        names.sort(String::compareToIgnoreCase);
        System.out.println("Sorted: " + names);

        // 4. Constructor reference
        // Lambda:    () -> new ArrayList<>()
        // Reference: ArrayList::new
        Supplier<ArrayList<String>> listFactory = ArrayList::new;
        ArrayList<String> newList = listFactory.get();
        newList.add("test");
        System.out.println("New list: " + newList);

        // Constructor with arg
        Function<String, StringBuilder> sbFactory = StringBuilder::new;
        StringBuilder sb = sbFactory.apply("initial");
        System.out.println("StringBuilder: " + sb);
    }
}`,
  codeTitle: 'Four Types of Method References',
  points: [
    'Method reference ClassName::method is shorthand for a lambda that only calls one existing method',
    'Static: Integer::parseInt is equivalent to s -> Integer.parseInt(s)',
    'Bound instance: System.out::println binds to a specific object (System.out)',
    'Unbound instance: String::toUpperCase — first lambda parameter becomes the method target object',
    'Constructor: ArrayList::new — equivalent to () -> new ArrayList<>()',
    'Method references make code more readable by removing mechanical wrapper lambdas',
    'They work anywhere a functional interface is expected — Consumer, Function, Supplier, Predicate, Comparator, Runnable',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'String::toUpperCase (unbound) and someString::toUpperCase (bound) look similar but are different. Unbound takes the target as a parameter; bound is already tied to a specific instance.',
    },
    {
      type: 'interview',
      content: 'Q: What are the four types of method references in Java?\nA: (1) Static: ClassName::staticMethod. (2) Bound instance: object::instanceMethod. (3) Unbound instance: ClassName::instanceMethod (first param is the target). (4) Constructor: ClassName::new.',
    },
    {
      type: 'tip',
      content: 'Only use a method reference when the lambda does nothing except call the method. If there is any additional logic (conditions, multiple operations), keep the full lambda for clarity.',
    },
  ],
}
