export default {
  id: 'constructor-reference',
  title: '127. Constructor Reference',
  explanation: `A constructor reference is a special form of method reference that creates new objects. It uses the syntax ClassName::new and is equivalent to a lambda that calls a constructor.

Constructor references are most useful when:
- You need to pass object creation as a function (factory pattern)
- You are mapping a stream of values to objects (e.g., turning a list of strings into a list of objects)
- You are working with a Supplier, Function, or BiFunction that creates objects

**Matching functional interfaces:**
- No-arg constructor: Supplier<T> s = ClassName::new; s.get() calls new ClassName()
- Single-arg constructor: Function<A, T> f = ClassName::new; f.apply(arg) calls new ClassName(arg)
- Two-arg constructor: BiFunction<A, B, T> f = ClassName::new; f.apply(a, b) calls new ClassName(a, b)

For constructors with more than two parameters, you need a custom functional interface.

**Common use cases:**
- Stream.collect(Collectors.toCollection(TreeSet::new)) — creates a specific collection type
- Mapping strings to custom objects: stream.map(Person::new)
- Dependency injection frameworks use constructor references internally
- Combining with Stream.generate() or Stream.of() to produce instances`,
  code: `import java.util.*;
import java.util.function.*;
import java.util.stream.*;

class Person {
    String name;
    int age;

    Person() { this("Unknown", 0); }
    Person(String name) { this(name, 0); }
    Person(String name, int age) { this.name = name; this.age = age; }

    @Override
    public String toString() { return "Person{name=" + name + ", age=" + age + "}"; }
}

public class ConstructorReferenceDemo {
    public static void main(String[] args) {
        // No-arg constructor — Supplier<Person>
        Supplier<Person> personFactory = Person::new;  // () -> new Person()
        Person p1 = personFactory.get();
        System.out.println("No-arg: " + p1);  // Person{name=Unknown, age=0}

        // Single-arg constructor — Function<String, Person>
        Function<String, Person> namedFactory = Person::new;  // name -> new Person(name)
        Person p2 = namedFactory.apply("Alice");
        System.out.println("Single-arg: " + p2);  // Person{name=Alice, age=0}

        // Two-arg constructor — BiFunction<String, Integer, Person>
        BiFunction<String, Integer, Person> fullFactory = Person::new;  // (name, age) -> new Person(name, age)
        Person p3 = fullFactory.apply("Bob", 30);
        System.out.println("Two-arg: " + p3);  // Person{name=Bob, age=30}

        // Mapping a stream of strings to Person objects
        List<String> names = Arrays.asList("Charlie", "Diana", "Eve");
        List<Person> people = names.stream()
            .map(Person::new)  // Function<String, Person>
            .collect(Collectors.toList());
        System.out.println("Mapped people: " + people);

        // Collecting into a specific collection type
        Set<String> sortedNames = names.stream()
            .collect(Collectors.toCollection(TreeSet::new));  // TreeSet::new is Supplier<TreeSet>
        System.out.println("TreeSet: " + sortedNames);  // alphabetically sorted

        // ArrayList::new as a collector
        List<Integer> nums = Stream.of(3, 1, 4, 1, 5)
            .collect(Collectors.toCollection(ArrayList::new));
        System.out.println("ArrayList: " + nums);

        // Array constructor reference
        IntFunction<String[]> arrayFactory = String[]::new;
        String[] arr = arrayFactory.apply(5);  // new String[5]
        System.out.println("Array length: " + arr.length);  // 5
    }
}`,
  codeTitle: 'Constructor Reference Patterns',
  points: [
    'ClassName::new is a constructor reference — equivalent to a lambda that calls new ClassName(...)',
    'No-arg constructor maps to Supplier<T>; single-arg to Function<A,T>; two-arg to BiFunction<A,B,T>',
    'Constructor references are ideal for mapping stream elements to new objects: stream.map(Person::new)',
    'Collectors.toCollection(TreeSet::new) uses a constructor reference to specify the output collection type',
    'Array constructor references use IntFunction<T[]>: String[]::new takes an int size and returns a String[]',
    'Constructor references are selected based on the functional interface type — the compiler matches the signature',
    'They work for any constructor that matches the functional interface signature — no special annotation needed',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If a class has multiple constructors, the compiler picks the one that matches the functional interface signature. If there is ambiguity (two constructors with compatible signatures), you must use an explicit lambda instead.',
    },
    {
      type: 'interview',
      content: 'Q: What is the type of ArrayList::new as a functional interface?\nA: It depends on context. As Supplier<ArrayList<String>>, it matches the no-arg constructor. If used where a Function<Integer, ArrayList<String>> is expected, the compiler would look for ArrayList(int) — which exists (initialCapacity).',
    },
    {
      type: 'tip',
      content: 'Use Collectors.toCollection(LinkedList::new) when you need a specific List implementation from a stream. Collectors.toList() gives you an unspecified List implementation (often ArrayList, but not guaranteed).',
    },
  ],
}
