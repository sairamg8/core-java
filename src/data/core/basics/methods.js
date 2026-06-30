export default {
  id: 'methods',
  title: '1. Methods',
  explanation: `A method is a named block of code that performs a task. Every method in Java lives inside a class.

**Method signature** = name + parameter types (return type is NOT part of the signature).
**Method declaration** = access modifier + return type + name + params + body.`,
  code: `// Basic method anatomy
public class Calculator {

    // Static method — called on class, not instance
    public static int add(int a, int b) {
        return a + b;
    }

    // Instance method — needs an object
    public double average(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        return (double) sum / nums.length;
    }

    // Void method — no return value
    public void printResult(int result) {
        System.out.println("Result: " + result);
    }

    // Varargs — variable number of args (must be last param, max one per method)
    public static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) total += n;
        return total;
    }
    // sum(1, 2, 3)  → 6
    // sum(10)       → 10
    // sum()         → 0
    // sum(new int[]{1,2,3}) → works — int[] is compatible

    // Method overloading — same name, different signature
    public static double multiply(double a, double b) { return a * b; }
    public static int    multiply(int a, int b)       { return a * b; }
    // Compiler picks the most specific match at compile time (static dispatch)
}

// Passing by value — Java ALWAYS passes by value
public class PassByValue {
    static void tryModify(int x) {
        x = 99;  // only modifies local copy
    }
    static void tryModify(int[] arr) {
        arr[0] = 99;  // modifies the OBJECT the reference points to
        arr = new int[]{1,2,3}; // only rebinds local variable, caller unaffected
    }
    public static void main(String[] args) {
        int n = 5;
        tryModify(n);
        System.out.println(n);      // still 5

        int[] a = {1, 2, 3};
        tryModify(a);
        System.out.println(a[0]);   // 99 — object was mutated
    }
}`,
  points: [
    'Java is strictly pass-by-value — primitives get a copy, references get a copy of the reference (not the object)',
    'Varargs are syntactic sugar for an array; int... numbers is identical to int[] numbers inside the method body',
    'Overloading is resolved at compile time (static dispatch); overriding is resolved at runtime (dynamic dispatch)',
    'A method can have at most one varargs parameter and it must be the last one',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Is Java pass-by-value or pass-by-reference?\nA: Always pass-by-value. For primitives, the value is copied. For objects, the reference (memory address) is copied — so you can mutate the object through the copy, but you cannot reassign the caller\'s variable.',
    },
    {
      type: 'gotcha',
      content: 'Overloading with widening + autoboxing + varargs creates ambiguity traps. multiply(2, 3) could match int×int, long×long, or int... — the compiler picks the most specific. When in doubt, cast explicitly.',
    },
  ],
}
