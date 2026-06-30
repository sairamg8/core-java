export default {
  id: 'data-types',
  title: '18. Data Types',
  explanation: `Java is a strongly typed language. Every variable must have a declared type, and the type determines: the range of values the variable can hold, the operations allowed on it, and how much memory it occupies.

**Two categories of data types:**

**1. Primitive types (8 total) — stored directly in memory (stack for locals):**

| Type    | Size   | Default | Range / Notes |
|---------|--------|---------|---------------|
| byte    | 1 byte | 0       | -128 to 127   |
| short   | 2 bytes| 0       | -32,768 to 32,767 |
| int     | 4 bytes| 0       | -2,147,483,648 to 2,147,483,647 |
| long    | 8 bytes| 0L      | -9.2×10¹⁸ to 9.2×10¹⁸ |
| float   | 4 bytes| 0.0f    | ~7 decimal digits of precision |
| double  | 8 bytes| 0.0     | ~15 decimal digits of precision |
| char    | 2 bytes| '\\u0000'| 0 to 65,535 (Unicode) |
| boolean | 1 bit* | false   | true or false only |

*boolean size is JVM-implementation dependent; logically it is 1 bit.

**2. Reference types — store a reference (address) to an object on the heap:**
- \`String\`, arrays, all classes, interfaces, enums
- Default value when declared but not initialized: \`null\`
- Operations: method calls, field access

**Key distinction — primitives vs references:**
- Primitives hold the value itself. Copying a primitive copies the value.
- References hold the memory address. Copying a reference gives two variables pointing to the same object.

**Choosing the right numeric type:**
- Default integer literal: \`int\`. Append \`L\` for \`long\`: \`100L\`
- Default floating-point literal: \`double\`. Append \`f\` for \`float\`: \`3.14f\`
- Use \`double\` over \`float\` unless memory is a strict constraint.
- Use \`long\` when values exceed int range (~2.1 billion).`,
  code: `public class DataTypesDemo {
    public static void main(String[] args) {

        // --- Primitive types ---
        byte  b = 127;                 // max byte value
        short s = 32000;
        int   i = 2_147_483_647;       // Integer.MAX_VALUE (underscore for readability)
        long  l = 9_000_000_000L;      // L suffix required for long literals > int range

        float  f = 3.14f;              // f suffix required; float is less precise
        double d = 3.141592653589793;  // double is the default for decimal literals

        char    c = 'J';               // single character, Unicode
        boolean flag = true;

        System.out.println("byte: "    + b);
        System.out.println("short: "   + s);
        System.out.println("int: "     + i);
        System.out.println("long: "    + l);
        System.out.println("float: "   + f);
        System.out.println("double: "  + d);
        System.out.println("char: "    + c);
        System.out.println("boolean: " + flag);

        // --- Reference types ---
        String  text   = "Hello Java";  // String is a class, not a primitive
        int[]   nums   = {1, 2, 3};     // array is a reference type
        String  empty  = null;           // reference with no object

        System.out.println("String: " + text);
        System.out.println("Array[0]: " + nums[0]);
        System.out.println("Null reference: " + empty);

        // --- Ranges via wrapper class constants ---
        System.out.println("Integer.MAX_VALUE: " + Integer.MAX_VALUE);
        System.out.println("Integer.MIN_VALUE: " + Integer.MIN_VALUE);
        System.out.println("Double.MAX_VALUE:  " + Double.MAX_VALUE);

        // --- char is numeric underneath ---
        char letter = 'A';
        System.out.println((int) letter);  // prints 65 (ASCII/Unicode value)
    }
}`,
  codeTitle: 'All 8 Primitive Types + Reference Types',
  points: [
    'Java has exactly 8 primitive types. Everything else is a reference type (class, interface, array, enum). Knowing this boundary is fundamental — it drives how copying, comparison, and method arguments behave.',
    'int is the default integer type; double is the default decimal type. When you write 42 in Java, the compiler treats it as int. When you write 3.14, it is a double. Assigning 3.14 to a float without the f suffix is a compile error.',
    'char in Java is 2 bytes (UTF-16), not 1 byte like in C/C++. It can hold any Unicode code point from U+0000 to U+FFFF. Arithmetic on char is valid: char a = 65 works, and (int)\'A\' == 65.',
    'boolean can ONLY be true or false. You cannot use 0 or 1 as boolean values in Java (unlike C). if (1) is a compile error in Java.',
    'Wrapper classes (Integer, Double, Boolean, Character, etc.) are reference-type counterparts of each primitive. They enable using primitives in generics, provide utility methods (Integer.parseInt), and participate in autoboxing.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'long l = 3000000000; — this FAILS to compile because 3000000000 exceeds Integer.MAX_VALUE (2,147,483,647) and the compiler treats integer literals as int. Fix: long l = 3000000000L; The L suffix tells the compiler this is a long literal.',
    },
    {
      type: 'interview',
      content: 'Q: Why does Java have both float and double?\nA: Both are IEEE 754 floating-point types. float is 32-bit (~7 significant decimal digits) and double is 64-bit (~15 digits). double is always preferred for precision. float exists for legacy code, embedded systems, and graphics APIs (OpenGL) where memory and throughput matter more than precision.',
    },
    {
      type: 'tip',
      content: 'Use Integer.MAX_VALUE and Integer.MIN_VALUE (and their Double, Long equivalents) instead of magic numbers like 2147483647. They document intent and eliminate off-by-one errors when reasoning about overflow.',
    },
  ],
}
