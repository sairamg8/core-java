export default {
  id: 'using-wildcard-types-in-generics',
  title: '116. Using Wildcard Types in Generics',
  explanation: `Wildcards (?) represent an unknown type in generics. They solve a key problem: List<Number> is NOT a supertype of List<Integer> in Java, even though Number is a supertype of Integer. This is by design (generics are invariant) — if it were allowed, you could add a Double to a list that only expected Integers.

Wildcards let you write flexible methods that work with various parameterized types.

**Three forms:**

1. **Unbounded wildcard: <?>**
   - Means "any type"
   - List<?> accepts List<String>, List<Integer>, List<anything>
   - You can read elements as Object, but CANNOT add anything (except null)

2. **Upper bounded wildcard: <? extends T>**
   - Means "T or any subclass of T"
   - List<? extends Number> accepts List<Integer>, List<Double>, List<Number>
   - You can READ elements as T (Number), but CANNOT write to the list

3. **Lower bounded wildcard: <? super T>**
   - Means "T or any superclass of T"
   - List<? super Integer> accepts List<Integer>, List<Number>, List<Object>
   - You can WRITE T (Integer) into the list, but READ only as Object

**PECS Rule: Producer Extends, Consumer Super**
- If a collection PRODUCES values you read: use extends
- If a collection CONSUMES values you write: use super
- If both: use a concrete type parameter T`,
  code: `import java.util.*;

public class WildcardDemo {
    // Unbounded wildcard — accepts any List, can only read as Object
    static void printList(List<?> list) {
        for (Object item : list) System.out.print(item + " ");
        System.out.println();
    }

    // Upper bounded — reads elements as Number (producer)
    static double sumOfList(List<? extends Number> list) {
        double sum = 0;
        for (Number n : list) sum += n.doubleValue();
        return sum;
        // list.add(1);  // COMPILE ERROR — cannot add to ? extends
    }

    // Lower bounded — writes Integer into list (consumer)
    static void addNumbers(List<? super Integer> list) {
        for (int i = 1; i <= 5; i++) list.add(i);
        // Integer x = list.get(0);  // COMPILE ERROR — can only read as Object
    }

    // PECS in action: copy from src (producer) to dest (consumer)
    static <T> void copy(List<? extends T> src, List<? super T> dest) {
        for (T item : src) dest.add(item);
    }

    public static void main(String[] args) {
        // Unbounded wildcard
        List<Integer> ints = Arrays.asList(1, 2, 3);
        List<String> strs = Arrays.asList("a", "b", "c");
        printList(ints);  // works — accepts any List
        printList(strs);  // works

        // Upper bounded
        List<Integer> intList = Arrays.asList(1, 2, 3);
        List<Double> dblList = Arrays.asList(1.1, 2.2, 3.3);
        System.out.println("Sum ints: " + sumOfList(intList));  // 6.0
        System.out.println("Sum dbls: " + sumOfList(dblList));  // 6.6

        // Lower bounded
        List<Number> numList = new ArrayList<>();
        addNumbers(numList);  // Integer is subtype of Number, so ? super Integer accepts List<Number>
        System.out.println("numList: " + numList);

        List<Object> objList = new ArrayList<>();
        addNumbers(objList);  // ? super Integer also accepts List<Object>
        System.out.println("objList: " + objList);

        // PECS copy
        List<Integer> source = Arrays.asList(10, 20, 30);
        List<Number> target = new ArrayList<>();
        copy(source, target);
        System.out.println("Copied: " + target);
    }
}`,
  codeTitle: 'Wildcard Types: ?, extends, super',
  points: [
    'List<Integer> is NOT a subtype of List<Number> — generics are invariant; wildcards provide flexibility',
    'Unbounded wildcard <?> accepts any parameterized type; you can only read elements as Object',
    'Upper bounded <? extends T>: read elements as T, but cannot add elements (safe reading)',
    'Lower bounded <? super T>: add elements of type T, but can only read as Object (safe writing)',
    'PECS: Producer Extends (reading), Consumer Super (writing) — the most important wildcard guideline',
    'Wildcards are used in method parameters to accept a wider range of collection types — they are not for class fields',
    'Use unbounded wildcard when you only need to call methods from Object (like printing)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You cannot add anything to a List<? extends T> (except null). The compiler cannot guarantee which exact subtype the list holds, so adding any element would risk a type mismatch.',
    },
    {
      type: 'interview',
      content: 'Q: Explain the PECS principle.\nA: PECS stands for Producer Extends, Consumer Super. Use List<? extends T> when you read (produce) values from it. Use List<? super T> when you write (consume) values into it. Use both when you need a concrete type T.',
    },
    {
      type: 'tip',
      content: 'If your method only reads from a collection parameter, use <? extends T>. If it only writes, use <? super T>. This maximizes the method flexibility for callers.',
    },
  ],
}
