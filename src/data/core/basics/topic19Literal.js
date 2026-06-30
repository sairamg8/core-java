export default {
  id: 'literal',
  title: '19. Literal',
  explanation: `A literal is a fixed, constant value written directly in source code. Literals are the actual data you assign to variables. Java has several categories of literals, each with its own syntax rules.

**1. Integer literals**
Can be written in four bases:
- **Decimal** (base 10): \`42\`, \`-100\`, \`0\` — the default
- **Octal** (base 8): prefix \`0\` — \`017\` equals decimal 15
- **Hexadecimal** (base 16): prefix \`0x\` or \`0X\` — \`0xFF\` equals 255
- **Binary** (base 2, Java 7+): prefix \`0b\` or \`0B\` — \`0b1010\` equals 10

Append \`L\` or \`l\` to make a long literal: \`100L\` (prefer uppercase \`L\` — lowercase \`l\` looks like digit 1).

**2. Floating-point literals**
- Default type is \`double\`: \`3.14\`, \`2.5e10\`
- Add \`f\` or \`F\` for float: \`3.14f\`
- Scientific notation: \`1.5e3\` = 1500.0, \`2.5E-4\` = 0.00025

**3. Character literals**
Single character in single quotes: \`'A'\`, \`'9'\`, \`'\\n'\`, \`'\\t'\`
Unicode escape: \`'\\u0041'\` = \`'A'\`

**4. String literals**
Text in double quotes: \`"Hello"\`, \`""\` (empty string), \`"Line1\\nLine2"\`
Strings are NOT primitives — each string literal is a \`String\` object in the String Pool.

**5. Boolean literals**
Exactly \`true\` or \`false\` (lowercase, not 0/1).

**6. Null literal**
\`null\` — the default value for any reference type. Only valid for reference types, never primitives.

**7. Underscore in numeric literals (Java 7+)**
You can insert \`_\` between digits for readability: \`1_000_000\`, \`0xFF_EC_D1\`, \`0b1010_0110\`
Rules: cannot start, end, or go adjacent to the decimal point or type suffix.`,
  code: `public class LiteralsDemo {
    public static void main(String[] args) {

        // --- Integer literals ---
        int decimal  = 255;
        int octal    = 0377;      // 0 prefix = octal → also 255
        int hex      = 0xFF;      // 0x prefix = hex  → also 255
        int binary   = 0b11111111; // 0b prefix = binary → also 255
        long big     = 9_000_000_000L;  // L suffix, underscore for readability

        System.out.println(decimal + " " + octal + " " + hex + " " + binary); // 255 255 255 255

        // --- Floating-point literals ---
        double d1 = 3.14;          // double (default)
        double d2 = 3.14e2;        // 314.0 (scientific)
        float  f1 = 3.14f;         // float (f suffix required)
        double d3 = 1_234_567.89;  // underscores for readability

        System.out.println(d1 + " " + d2 + " " + f1);

        // --- Character literals ---
        char letter  = 'A';
        char newline = '\\n';   // escape sequence
        char tab     = '\\t';
        char unicode = '\\u03A9'; // Ω (Greek Omega)
        char numeric = 65;      // same as 'A' — char IS a number

        System.out.println(letter + " " + unicode + " " + numeric);

        // --- String literals ---
        String s1 = "Hello, World!";
        String s2 = "";             // empty string (NOT null)
        String s3 = "Line1\\nLine2"; // escape sequence inside string

        System.out.println(s1);
        System.out.println(s3);     // prints two lines

        // --- Boolean literals ---
        boolean yes = true;
        boolean no  = false;
        System.out.println(yes + " " + no);

        // --- Null literal ---
        String ref = null;   // valid only for reference types
        System.out.println(ref); // prints "null"

        // --- Underscore in numeric literals (Java 7+) ---
        int million   = 1_000_000;
        long creditCard = 1234_5678_9012_3456L;
        int rgba       = 0xFF_EC_D1_84;

        System.out.println("Million: " + million);
        System.out.println("RGBA: "   + rgba);
    }
}`,
  codeTitle: 'All Literal Types in Java',
  points: [
    'A literal is source code notation for a fixed value. The compiler reads the literal and produces bytecode with that value baked in — there is no variable involved.',
    'Integer literals default to int. If you write 2147483648 (one more than Integer.MAX_VALUE) without L, you get a compile error. Java cannot fit it into an int and it is not a long without the L suffix.',
    'Octal literals can trip you up: 010 is NOT ten — it is 8 in octal. This is a classic Java gotcha. In modern code, prefer hex (0x) or binary (0b) over octal for clarity.',
    'The null literal is distinct from an empty string "". null means "no object exists at this reference". "" is a valid String object with zero characters. Calling .length() on "" returns 0; calling it on null throws NullPointerException.',
    'Text blocks (Java 15+) are a multi-line string literal form: """ ... """. They strip leading whitespace automatically and avoid manual \\n escaping. Useful for JSON, SQL, HTML embedded in code.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'float f = 3.14; — this does NOT compile. The literal 3.14 is a double, and assigning a double to a float is a narrowing conversion that requires an explicit cast or the f suffix. Fix: float f = 3.14f; or float f = (float) 3.14;',
    },
    {
      type: 'interview',
      content: 'Q: What is the String Pool and how do string literals relate to it?\nA: When you write "Hello" in source code, Java checks the String Pool (a special area of heap memory) for an existing "Hello" object. If found, the literal reuses that object. If not, a new String is created and added to the pool. This means two string literals with the same text will point to the same object in memory: ("Hello" == "Hello") is true. But new String("Hello") bypasses the pool and always creates a new object.',
    },
    {
      type: 'tip',
      content: 'Use underscores in large numeric literals to make them readable: 1_000_000 is instantly recognizable as one million, whereas 1000000 takes a moment to count digits. This is especially valuable for phone numbers, credit card numbers, and bit masks.',
    },
  ],
}
