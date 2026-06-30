export default {
  id: 'type-conversion',
  title: '20. Type Conversion',
  explanation: `Type conversion (also called type casting) is the process of converting a value from one data type to another. Java has two kinds: automatic (widening) and manual (narrowing).

**1. Widening Conversion (Implicit / Automatic)**
Converting a smaller type to a larger type. Safe — no data loss. Java does this automatically.

Widening order: \`byte → short → int → long → float → double\`
- \`char → int → long → float → double\`

\`\`\`java
int i = 100;
long l = i;    // automatic widening, no cast needed
double d = l;  // automatic widening
\`\`\`

**2. Narrowing Conversion (Explicit Cast Required)**
Converting a larger type to a smaller one. Potentially lossy — you must explicitly cast.

\`\`\`java
double d = 9.99;
int i = (int) d;  // explicit cast — truncates to 9 (NOT rounded)
\`\`\`

The cast syntax is \`(targetType) value\`. Narrowing may:
- Truncate fractional parts (double → int)
- Overflow and produce unexpected values (int → byte)

**3. String ↔ Number Conversion**
Very common in real code — parsing input, formatting output.

- \`int\` from \`String\`: \`Integer.parseInt("42")\`
- \`double\` from \`String\`: \`Double.parseDouble("3.14")\`
- Any type to \`String\`: \`String.valueOf(42)\` or \`"" + 42\`

**4. char ↔ int Conversion**
\`char\` is stored as its Unicode code point (an integer).
- \`(int)'A'\` gives \`65\`
- \`(char)65\` gives \`'A'\`

**Common pitfall — integer overflow on narrowing:**
\`\`\`java
int i = 300;
byte b = (byte) i;  // 300 % 256 = 44 (wraps around)
\`\`\``,
  code: `public class TypeConversionDemo {
    public static void main(String[] args) {

        // ===== WIDENING (automatic) =====
        byte  b = 42;
        short sh = b;    // byte → short (automatic)
        int   i  = sh;   // short → int  (automatic)
        long  l  = i;    // int   → long  (automatic)
        float f  = l;    // long  → float (automatic, may lose precision for very large longs)
        double d = f;    // float → double (automatic)

        System.out.println("Widening chain: " + b + " → " + sh + " → " + i
                           + " → " + l + " → " + f + " → " + d);

        // ===== NARROWING (explicit cast) =====
        double pi    = 3.99999;
        int piInt    = (int) pi;      // truncates toward zero → 3 (NOT 4)
        System.out.println("double 3.99999 → int: " + piInt);  // 3

        long bigNum  = 130L;
        byte byteVal = (byte) bigNum; // 130 overflows byte range (-128 to 127) → -126
        System.out.println("long 130 → byte: " + byteVal);      // -126

        // ===== char ↔ int =====
        char ch  = 'A';
        int  code = (int) ch;           // explicit (actually widening, but intuitive with cast)
        System.out.println("'A' as int: " + code);  // 65

        char back = (char) 66;
        System.out.println("66 as char: " + back);  // B

        // ===== String <-> Number =====
        // String to int
        String strNum = "123";
        int parsed = Integer.parseInt(strNum);
        System.out.println("Parsed int: " + parsed + 10);  // 133

        // String to double
        String strDbl = "3.14";
        double parsedD = Double.parseDouble(strDbl);
        System.out.println("Parsed double: " + parsedD);

        // int/double to String
        int x = 42;
        String s1 = String.valueOf(x);       // "42"
        String s2 = Integer.toString(x);     // "42"
        String s3 = "" + x;                  // "42" (concatenation trick)
        System.out.println(s1 + " " + s2 + " " + s3);

        // ===== NumberFormatException =====
        try {
            int bad = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Cannot parse 'abc' as int: " + e.getMessage());
        }
    }
}`,
  codeTitle: 'Widening, Narrowing, and String Conversion',
  points: [
    'Narrowing always truncates toward zero for floating-point to integer conversions — it does NOT round. (int) 3.99 is 3, not 4. If you need rounding, use Math.round() first.',
    'When an integer overflows during narrowing, Java does NOT throw an exception — it silently wraps around using modular arithmetic. (byte) 200 gives -56, not an error. Always check the target type range before narrowing.',
    'String + int triggers string concatenation, not addition. "Value: " + 1 + 2 is "Value: 12", not "Value: 3". Use parentheses: "Value: " + (1 + 2) to force addition first.',
    'Integer.parseInt() throws NumberFormatException (unchecked) if the string is not a valid integer. Always handle this when processing user input or external data.',
    'int to long is widening and is automatic. long to int is narrowing and requires a cast. Remember: widening goes from smaller capacity to larger capacity — byte(1) < short(2) < int(4) < long(8) bytes.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'int result = Integer.parseInt("3.14"); — throws NumberFormatException because parseInt expects an integer string, not a decimal. Use Double.parseDouble("3.14") for decimals, then cast if needed: int i = (int) Double.parseDouble("3.14");',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between type casting and type conversion?\nA: In Java these terms are used interchangeably but there is a nuance. Type conversion is the general concept (changing a value from one type to another). Type casting specifically refers to the explicit cast syntax (int)someDouble. Widening conversion is automatic (implicit); narrowing conversion requires an explicit cast.',
    },
    {
      type: 'tip',
      content: 'When converting doubles to ints for display purposes, use Math.round(d) before casting if you want proper rounding: int rounded = (int) Math.round(3.7) gives 4. Without it, (int) 3.7 gives 3.',
    },
  ],
}
