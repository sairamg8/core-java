export default {
  id: 'methods',
  title: '36. Methods',
  explanation: `A **method** is a named block of code that performs a specific task. Methods are the primary mechanism for organizing behavior in Java — they enable code reuse, readability, and abstraction.

**Method anatomy:**
\`\`\`java
accessModifier returnType methodName(paramType param1, ...) {
    // body
    return value; // if return type is not void
}
\`\`\`

**Components:**
- **Return type:** the data type the method hands back (or \`void\` if it returns nothing)
- **Method name:** verb-first convention, camelCase (e.g., \`calculateTax\`, \`printReport\`)
- **Parameters:** typed inputs the caller passes; they are local copies (pass-by-value)
- **Body:** the instructions
- **return statement:** sends the result back and exits the method

**Types of methods:**
| Type | Description |
|------|-------------|
| Instance method | Called on an object; can access instance fields |
| Static method | Called on the class; cannot access instance fields |
| Void method | Performs an action, returns nothing |
| Returning method | Computes and returns a value |

**Method call mechanics:**
1. A new stack frame is pushed for the method call
2. Parameters are copied into the frame (pass-by-value)
3. The method executes
4. The return value is placed on the stack and the frame is popped

**Varargs** (\`...\`): a method can accept a variable number of arguments:
\`\`\`java
int sum(int... nums) { int s = 0; for (int n : nums) s += n; return s; }
\`\`\``,
  code: `public class Methods {
    // Instance method: needs an object to call
    double calculateTax(double income, double rate) {
        return income * rate / 100;
    }

    // Void method: returns nothing
    void printSeparator(char c, int n) {
        for (int i = 0; i < n; i++) System.out.print(c);
        System.out.println();
    }

    // Static method: no instance needed
    static int max(int a, int b) {
        return (a >= b) ? a : b;
    }

    // Varargs: variable-length argument list
    static int sum(int... nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }

    // Early return: exit as soon as result is known
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Methods m = new Methods();
        System.out.println("Tax: " + m.calculateTax(50000, 20)); // 10000.0
        m.printSeparator('-', 20);

        System.out.println("Max: " + max(7, 3));           // 7
        System.out.println("Sum: " + sum(1, 2, 3, 4, 5));  // 15
        System.out.println("7 prime: " + isPrime(7));      // true
    }
}`,
  codeTitle: 'Instance, Static, Void, Returning, and Varargs Methods',
  points: [
    'Methods promote code reuse — write once, call many times; they also make code easier to test and read',
    'Java is strictly pass-by-value: primitives get a copy; object references also get a copy (but both copies point to the same heap object)',
    'Every method call gets its own stack frame; local variables inside a method are not visible outside it',
    'static methods belong to the class, not instances — they cannot access this or instance fields',
    'A method can have at most one varargs parameter and it must be the last parameter in the list',
    'Prefer multiple small, single-purpose methods (SRP) over one large method that does everything',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Java passes object references by value, not by reference. Inside a method you can mutate the object the reference points to (visible to the caller), but reassigning the reference (ref = new ...) does NOT change the caller\'s variable.',
    },
    {
      type: 'tip',
      content: 'Name methods with a verb: calculate(), print(), is(), get(), set(). This makes code read like English and signals intent immediately.',
    },
    {
      type: 'interview',
      content: 'Q: Is Java pass-by-value or pass-by-reference?\nA: Always pass-by-value. For primitives, the value is copied. For objects, the reference (address) is copied — so you can mutate the object but cannot make the caller\'s variable point to a different object.',
    },
  ],
}
