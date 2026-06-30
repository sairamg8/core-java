export default {
  id: 'arithmetic-operators',
  title: '21. Arithmetic Operators',
  explanation: `Arithmetic operators perform mathematical calculations on numeric values. Java has five basic arithmetic operators plus increment/decrement operators.

**Basic arithmetic operators:**

| Operator | Name           | Example      | Result |
|----------|----------------|--------------|--------|
| \`+\`      | Addition       | \`5 + 3\`      | \`8\`    |
| \`-\`      | Subtraction    | \`5 - 3\`      | \`2\`    |
| \`*\`      | Multiplication | \`5 * 3\`      | \`15\`   |
| \`/\`      | Division       | \`5 / 2\`      | \`2\` (integer division) |
| \`%\`      | Modulus (remainder) | \`5 % 2\` | \`1\`    |

**Critical: Integer vs floating-point division**
When both operands are integers, \`/\` performs **integer division** — it truncates the decimal part.
- \`5 / 2\` = \`2\` (not 2.5)
- \`5.0 / 2\` = \`2.5\` (one operand is double → floating-point division)
- \`5 / 2.0\` = \`2.5\`

**Increment and Decrement operators:**
- \`++\` adds 1: \`x++\` (postfix) vs \`++x\` (prefix)
- \`--\` subtracts 1: \`x--\` (postfix) vs \`--x\` (prefix)

**Prefix vs Postfix difference:**
- **Prefix** (\`++x\`): increment first, then use the value
- **Postfix** (\`x++\`): use the value first, then increment

**Compound assignment operators:**
\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\` — these apply the operation and assign in one step.
\`x += 5\` is exactly \`x = x + 5\`

**Operator precedence (high to low):**
\`*\`, \`/\`, \`%\` before \`+\`, \`-\`
Use parentheses to override: \`(2 + 3) * 4\`

**The + operator overload:**
When either operand is a \`String\`, \`+\` performs string concatenation, not addition.
\`"Result: " + 2 + 3\` = \`"Result: 23"\` (not "Result: 5")`,
  code: `public class ArithmeticDemo {
    public static void main(String[] args) {

        int a = 10, b = 3;

        // Basic operators
        System.out.println("a + b = " + (a + b));  // 13
        System.out.println("a - b = " + (a - b));  // 7
        System.out.println("a * b = " + (a * b));  // 30
        System.out.println("a / b = " + (a / b));  // 3 (integer division!)
        System.out.println("a % b = " + (a % b));  // 1

        // Integer vs floating-point division
        System.out.println("10 / 3   = " + (10 / 3));     // 3
        System.out.println("10.0 / 3 = " + (10.0 / 3));   // 3.3333...
        System.out.println("10 / 3.0 = " + (10 / 3.0));   // 3.3333...
        // Force float division from int variables:
        System.out.println("(double)a / b = " + ((double) a / b)); // 3.3333...

        // Modulus — useful for even/odd, cycling
        System.out.println("10 % 3 = " + (10 % 3));   // 1 (remainder)
        System.out.println("9  % 3 = " + (9  % 3));   // 0 (divisible)
        System.out.println("-10 % 3 = " + (-10 % 3)); // -1 (sign matches dividend in Java)

        // Increment / decrement
        int x = 5;
        System.out.println(x++);  // prints 5, THEN x becomes 6
        System.out.println(x);    // 6
        System.out.println(++x);  // x becomes 7, THEN prints 7
        System.out.println(x);    // 7

        int y = 10;
        System.out.println(y--);  // prints 10, THEN y becomes 9
        System.out.println(--y);  // y becomes 8, THEN prints 8

        // Compound assignment
        int n = 20;
        n += 5;   System.out.println("n += 5  → " + n);  // 25
        n -= 3;   System.out.println("n -= 3  → " + n);  // 22
        n *= 2;   System.out.println("n *= 2  → " + n);  // 44
        n /= 4;   System.out.println("n /= 4  → " + n);  // 11
        n %= 3;   System.out.println("n %= 3  → " + n);  // 2

        // Operator precedence
        System.out.println(2 + 3 * 4);       // 14 (not 20 — * before +)
        System.out.println((2 + 3) * 4);     // 20 (parentheses override)

        // String concatenation vs addition
        System.out.println("Sum: " + 2 + 3);    // "Sum: 23" (concat)
        System.out.println("Sum: " + (2 + 3));  // "Sum: 5"  (addition first)
    }
}`,
  codeTitle: 'Arithmetic Operators — Division Trap, Prefix/Postfix',
  points: [
    'Integer division in Java truncates toward zero, it does NOT round. 7/2 is 3, not 3.5 or 4. To get decimal division, at least one operand must be a double/float. The easiest way: cast one operand — (double) a / b.',
    'The modulus operator % gives the remainder after division. It is negative when the dividend is negative: -7 % 3 = -1 in Java (matches dividend sign). This differs from Python where % is always non-negative.',
    'Prefix ++x and postfix x++ both increment x by 1, but differ in what value is returned at the point of expression evaluation. In a standalone statement (not embedded in an expression), they are equivalent. The difference only matters when the expression is used as a value.',
    'Division by zero with integers throws ArithmeticException: / by zero at runtime. Division by zero with doubles gives Infinity or NaN — no exception is thrown. System.out.println(1.0 / 0) prints Infinity.',
    'Compound assignment operators like += include an implicit narrowing cast. byte b = 5; b += 3; compiles fine. But byte b = 5; b = b + 3; does NOT compile because b + 3 is int and cannot be assigned to byte without an explicit cast.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'int result = 5 / 2 * 1.0; — you might expect 2.5, but this is still 2.0. Java evaluates left-to-right for same-precedence operators: 5/2 is evaluated first as integer division giving 2, then 2 * 1.0 = 2.0. To get 2.5: int result = 5 * 1.0 / 2 or use (double)5 / 2.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between i++ and ++i?\nA: Both increment i by 1. i++ (postfix) returns the original value of i before incrementing. ++i (prefix) increments first and returns the new value. int a = 5; int b = a++; gives b=5, a=6. int a = 5; int b = ++a; gives b=6, a=6. In a standalone statement (i++;), both are identical.',
    },
    {
      type: 'tip',
      content: 'Use % 2 == 0 to check if a number is even. Use % to cycle through indices in a circular buffer: index = (index + 1) % arrayLength. Modulus is one of the most useful operators in real-world algorithms.',
    },
  ],
}
