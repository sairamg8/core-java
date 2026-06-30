export default {
  id: 'need-for-generics',
  title: '113. Need for Generics in Java',
  explanation: `Before Java 5, collections stored everything as Object. This meant you had to cast every element you retrieved, and the compiler couldn't help you catch type mismatches — they only showed up as ClassCastException at runtime.

**Problems without generics:**
1. **No type safety** — you could accidentally add a String to a list that was meant for Integers.
2. **Mandatory casting** — every get() required an explicit (Integer) or (String) cast.
3. **Runtime errors** — type mismatches only discovered when the program runs, not when you compile.

**What generics solve:**
- Move type errors from runtime to compile time — catch bugs earlier, before they reach production.
- Eliminate explicit casting — the compiler knows the exact type.
- Enable reusable algorithms — write one method or class that works correctly for any type.

Generics were introduced in Java 5 as a compile-time feature. At runtime, due to type erasure, all generic types become Object (or their bound). This means generic code generates no new bytecode — it is purely a compile-time safety mechanism.

The cost of generics: slightly more complex syntax, and some limitations due to type erasure (cannot create new T(), cannot use T.class, cannot create T[]).`,
  code: `import java.util.*;

public class NeedForGenericsDemo {
    public static void main(String[] args) {
        // WITHOUT GENERICS (pre-Java 5 style) — raw type
        List rawList = new ArrayList();
        rawList.add(42);
        rawList.add("Hello");  // compiles! No type check
        rawList.add(3.14);

        // You must cast on retrieval — ClassCastException waiting to happen
        int num = (Integer) rawList.get(0);  // ok
        // int bad = (Integer) rawList.get(1);  // ClassCastException at RUNTIME

        // WITH GENERICS — type-safe
        List<Integer> intList = new ArrayList<>();
        intList.add(42);
        intList.add(100);
        // intList.add("Hello");  // COMPILE ERROR — caught immediately!

        int value = intList.get(0);  // no cast needed
        System.out.println("Value: " + value);

        // Generic method — works for any type
        System.out.println("Max int: " + max(10, 20));
        System.out.println("Max str: " + max("apple", "banana"));

        // Type safety in Map
        Map<String, Integer> scoreMap = new HashMap<>();
        scoreMap.put("Alice", 90);
        // scoreMap.put(123, "Bob");  // COMPILE ERROR
        int score = scoreMap.get("Alice");  // no cast
        System.out.println("Score: " + score);
    }

    // Generic method — T must be Comparable
    static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
}`,
  codeTitle: 'Why Generics Were Needed',
  points: [
    'Before generics (pre-Java 5), collections were raw types storing Object — type-unsafe and required explicit casts',
    'Without generics, type errors only show up at runtime as ClassCastException, not at compile time',
    'Generics shift type checking to compile time — type errors are caught before deployment',
    'Generics eliminate the need for explicit casting when reading from collections',
    'Generics enable reusable type-safe algorithms — write once, use with any type',
    'At runtime, due to type erasure, all generic types are represented as Object (or their bound)',
    'Type erasure means you cannot create instances of generic type parameters: new T() is illegal',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Using raw types (List instead of List<String>) silences generic warnings and disables type safety — avoid them in new code. They exist only for backward compatibility.',
    },
    {
      type: 'interview',
      content: 'Q: What is type erasure in Java generics?\nA: At compile time, generic type parameters are replaced with Object (or the bound). The compiled bytecode has no generic information. This ensures backward compatibility with pre-Java-5 code but creates limitations like not being able to do new T() or T.class.',
    },
    {
      type: 'tip',
      content: 'Enable compiler warnings for raw types in your IDE. Any use of a raw type like List or Map without type parameters is a sign of potentially unsafe code.',
    },
  ],
}
