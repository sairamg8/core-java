export default {
  id: 'upper-and-lower-bounds-in-generics',
  title: '117. Upper and lower bounds in Generics',
  explanation: `Bounds restrict the types that can be used as type arguments, enabling you to call specific methods on generic types or accept a wider range of parameterized collections.

**Upper Bound: extends**
Used in two contexts:
1. Type parameter bound: <T extends Number> — T must be Number or a subclass. You can call Number methods on T.
2. Wildcard: <? extends Number> — accepts List<Integer>, List<Double>, etc. Can read as Number, cannot write.

Upper bounds enable reading/using elements through the bound's API without knowing the exact subtype.

**Lower Bound: super (wildcards only)**
Only used with wildcards: <? super Integer>
- Accepts List<Integer>, List<Number>, List<Object>
- You can safely write Integer (or subtype) values into it
- Reading gives back only Object

**Why you cannot have a lower bound on a type parameter:**
<T super Integer> is not valid syntax for a type parameter — lower bounds only work with wildcards in method parameters.

**Practical summary:**
- Reading elements from a collection → use extends (can read as the bound type)
- Writing elements into a collection → use super (can write the type or its subtypes)
- Sorting/comparing → <T extends Comparable<T>> (upper bound lets you call compareTo)
- Numeric computation → <T extends Number> (upper bound lets you call doubleValue, etc.)`,
  code: `import java.util.*;

public class BoundsDemo {
    // Upper bound on type parameter — can call Number methods on T
    static <T extends Number> double sumArray(T[] arr) {
        double sum = 0;
        for (T item : arr) sum += item.doubleValue();  // doubleValue() is in Number
        return sum;
    }

    // Upper bound with Comparable — enables comparison operations
    static <T extends Comparable<T>> T clamp(T value, T min, T max) {
        if (value.compareTo(min) < 0) return min;
        if (value.compareTo(max) > 0) return max;
        return value;
    }

    // Upper bounded wildcard — accepts any Number subtype list, reads as Number
    static void printNumbers(List<? extends Number> list) {
        for (Number n : list) System.out.printf("%.2f ", n.doubleValue());
        System.out.println();
    }

    // Lower bounded wildcard — accepts Number or supertype list, writes Integer
    static void fillWithSquares(List<? super Integer> list, int count) {
        for (int i = 1; i <= count; i++) list.add(i * i);
    }

    // Multiple bounds — must extend class first, then interfaces
    static <T extends Number & Comparable<T>> T maxNumber(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        // Upper bound on type parameter
        Integer[] ints = {1, 2, 3, 4, 5};
        Double[] dbls = {1.1, 2.2, 3.3};
        System.out.println("Sum ints: " + sumArray(ints));   // 15.0
        System.out.println("Sum dbls: " + sumArray(dbls));   // 6.6

        // Clamp
        System.out.println(clamp(15, 1, 10));   // 10
        System.out.println(clamp(-5, 1, 10));   // 1
        System.out.println(clamp(5, 1, 10));    // 5
        System.out.println(clamp("dog", "ant", "fox"));  // dog

        // Upper bounded wildcard
        List<Integer> intList = Arrays.asList(1, 2, 3);
        List<Double>  dblList = Arrays.asList(4.0, 5.0, 6.0);
        printNumbers(intList);
        printNumbers(dblList);

        // Lower bounded wildcard
        List<Number> numList = new ArrayList<>();
        List<Object> objList = new ArrayList<>();
        fillWithSquares(numList, 4);  // Integer is subtype of Number — ok
        fillWithSquares(objList, 4);  // Integer is subtype of Object — ok
        System.out.println("Squares in Number list: " + numList);
        System.out.println("Squares in Object list: " + objList);

        // Multiple bounds
        System.out.println("Max: " + maxNumber(3, 7));     // 7
        System.out.println("Max: " + maxNumber(2.5, 1.8)); // 2.5
    }
}`,
  codeTitle: 'Upper and Lower Bounds in Generics',
  points: [
    '<T extends Number> on a type parameter means T must be Number or a subclass — enables calling Number API on T',
    '<? extends Number> on a wildcard: readable as Number, not writable — used when producing/reading values',
    '<? super Integer> on a wildcard: writable as Integer, readable only as Object — used when consuming/writing values',
    'Lower bounds (<? super T>) only work with wildcards, not with type parameter declarations',
    'Multiple bounds: <T extends ClassA & InterfaceB & InterfaceC> — class must come first, then interfaces',
    'Upper bounds enable reuse: one method using <T extends Number> handles Integer, Long, Double, Float, etc.',
    'Type parameter bounds (<T extends X>) and wildcard bounds (<? extends X>) serve different purposes — know which context you need',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '<T super Integer> is not valid Java syntax. Lower bounds only exist for wildcards (<?  super Integer>), not for type parameters.',
    },
    {
      type: 'interview',
      content: 'Q: Why is <T extends Comparable<T>> used in sorting methods?\nA: It constrains T to types that can compare themselves to other T instances. Without this bound, you cannot call compareTo() on T — the compiler does not know if T has that method.',
    },
    {
      type: 'tip',
      content: 'When you need both reading and writing, avoid wildcards and use a concrete type parameter T instead. Wildcards are best used in method parameters to increase flexibility for callers.',
    },
  ],
}
