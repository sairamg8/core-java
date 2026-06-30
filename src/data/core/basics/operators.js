export default {
  id: 'operators',
  title: '4. Operators',
  explanation: `Java has arithmetic, relational, logical, bitwise, shift, assignment, and ternary operators. The ones most tested in interviews are logical short-circuit, bitwise, and increment/decrement.`,
  code: `// Arithmetic
System.out.println(10 / 3);    // 3  (integer division — truncates)
System.out.println(10.0 / 3);  // 3.333... (double division)
System.out.println(10 % 3);    // 1  (modulo)

// Pre vs Post increment
int x = 5;
System.out.println(x++);  // 5 (print THEN increment) → x is now 6
System.out.println(++x);  // 7 (increment THEN print)

// Short-circuit logical operators
boolean result1 = (5 > 3) || expensiveCall(); // call SKIPPED — true already
boolean result2 = (5 < 3) && expensiveCall(); // call SKIPPED — false already

// Non-short-circuit (bitwise used as logical)
boolean result3 = (5 > 3) | expensiveCall();  // call ALWAYS runs
boolean result4 = (5 > 3) & expensiveCall();  // call ALWAYS runs

// Bitwise operations
int a = 5;  // 0101
int b = 3;  // 0011
System.out.println(a & b);   // 1    AND
System.out.println(a | b);   // 7    OR
System.out.println(a ^ b);   // 6    XOR
System.out.println(~a);      // -6   NOT (flip all bits)

// Shift operators
System.out.println(5 << 1);  // 10  (multiply by 2)
System.out.println(20 >> 2); // 5   (divide by 4, sign preserved)
System.out.println(-1 >>> 1);// Integer.MAX_VALUE (unsigned right shift)

// Ternary
int max = (a > b) ? a : b;

// Compound assignment
int n = 10;
n += 5;   // n = n + 5 → 15
n <<= 1;  // n = n << 1 → 30`,
  points: [
    'Integer division always truncates toward zero: -7/2 = -3, not -4',
    '% (modulo) result has the sign of the dividend: -7 % 3 = -1',
    'Bitwise NOT (~n) equals -(n+1) due to two\'s complement: ~5 = -6',
    'Left shift << n is equivalent to multiplying by 2^n (fast power-of-2 multiply)',
    '>>> is unsigned right shift — fills with 0 from left regardless of sign',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Difference between & and &&?\nA: & evaluates BOTH operands always (no short-circuit). && short-circuits — if left is false, right is NOT evaluated. Same for | vs ||. Use && and || for boolean logic to avoid side effects.',
    },
    {
      type: 'gotcha',
      content: 'In i = i++, the value of i does NOT change in most cases due to how post-increment works with assignment. i++ returns the old value, which then gets assigned back to i. This is a classic Java puzzle.',
    },
  ],
}
