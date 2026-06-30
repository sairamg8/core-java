export default {
  id: 'syntax-and-usage-of-generics',
  title: '114. Syntax and Usage of Generics',
  explanation: `Generics use angle brackets < > with type parameters. Type parameters are placeholders for the actual type supplied at compile time.

**Type parameter naming conventions:**
- T — Type (most common general-purpose placeholder)
- E — Element (used in collections)
- K — Key (used in maps)
- V — Value (used in maps)
- N — Number
- R — Return type (used in functions)

**Generic classes:**
A class can declare one or more type parameters: class Box<T>. Inside the class, T can be used wherever a type is needed (fields, method parameters, return types). You cannot use T as a primitive — T is always a reference type.

**Generic methods:**
A method can declare its own type parameter, independent of the class. Place the type parameter before the return type: public <T> T identity(T input).

**Bounded type parameters:**
You can restrict what types are allowed using extends:
- <T extends Number> — T must be Number or a subclass
- <T extends Comparable<T>> — T must implement Comparable

Multiple bounds are allowed: <T extends Comparable<T> & Serializable>.

**Diamond operator (Java 7+):**
When creating generic instances, you can use <> and the compiler infers the type: new ArrayList<>() instead of new ArrayList<String>().`,
  code: `import java.util.*;

// Generic class with one type parameter
class Box<T> {
    private T value;

    Box(T value) { this.value = value; }
    T get() { return value; }
    void set(T value) { this.value = value; }

    @Override
    public String toString() { return "Box[" + value + "]"; }
}

// Generic class with two type parameters
class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) { this.key = key; this.value = value; }
    K getKey() { return key; }
    V getValue() { return value; }

    @Override
    public String toString() { return "(" + key + ", " + value + ")"; }
}

public class GenericsSyntaxDemo {
    // Generic method
    public static <T> void printArray(T[] array) {
        for (T item : array) System.out.print(item + " ");
        System.out.println();
    }

    // Bounded type parameter — T must be Comparable
    public static <T extends Comparable<T>> T maximum(T a, T b, T c) {
        T max = a;
        if (b.compareTo(max) > 0) max = b;
        if (c.compareTo(max) > 0) max = c;
        return max;
    }

    // Multiple bounds
    public static <T extends Number & Comparable<T>> double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }

    public static void main(String[] args) {
        // Using generic class
        Box<String> strBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        System.out.println(strBox);  // Box[Hello]
        System.out.println(intBox);  // Box[42]

        // Diamond operator — compiler infers type
        Box<Double> dblBox = new Box<>(3.14);  // <> inferred as Double

        // Generic pair
        Pair<String, Integer> score = new Pair<>("Alice", 95);
        System.out.println("Key: " + score.getKey() + ", Value: " + score.getValue());

        // Generic methods
        Integer[] ints = {1, 2, 3};
        String[] strs = {"a", "b", "c"};
        printArray(ints);
        printArray(strs);

        // Bounded type parameter
        System.out.println("Max: " + maximum(3, 7, 2));         // 7
        System.out.println("Max: " + maximum("cat", "bat", "ant"));  // cat
    }
}`,
  codeTitle: 'Generic Classes, Methods, and Bounds',
  points: [
    'Type parameters use angle brackets: class Box<T>, method <T> T get(T val)',
    'Naming convention: T (Type), E (Element), K (Key), V (Value), N (Number), R (Return)',
    'Generic type parameters can only be reference types — use Integer, Double, etc., not int, double',
    'Bounded parameters restrict the allowed types: <T extends Number> means T must be Number or subclass',
    'Multiple bounds use &: <T extends Comparable<T> & Serializable> — first must be a class, rest must be interfaces',
    'The diamond operator <> (Java 7+) lets the compiler infer the type parameter from context',
    'Generic methods declare their type parameter before the return type: public <T> T identity(T x)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You cannot use primitive types as type arguments. List<int> is illegal — use List<Integer> instead. Autoboxing handles the conversion between int and Integer automatically.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between <T extends Foo> and <T super Foo>?\nA: extends means T is Foo or a subclass (upper bound). super means T is Foo or a superclass (lower bound). Remember PECS: Producer Extends, Consumer Super — use extends when reading, super when writing.',
    },
    {
      type: 'tip',
      content: 'When writing generic utility methods, prefer to declare them as static generic methods. This makes them easier to test and use without needing an instance.',
    },
  ],
}
