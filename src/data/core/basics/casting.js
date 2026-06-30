export default {
  id: 'type-casting',
  title: '3. Type Casting & Conversion',
  explanation: `**Widening (Implicit):** Smaller → larger type. No data loss. Java does it automatically.
Chain: byte → short → int → long → float → double

**Narrowing (Explicit):** Larger → smaller. Possible data loss. Requires explicit cast.

**String conversion** is NOT casting — use parse methods and valueOf().`,
  code: `// Widening — automatic, safe
int i = 100;
long l = i;           // auto-widened
double d = l;         // auto-widened
// Note: int→float can lose precision for large ints (float has 23 mantissa bits)

// Narrowing — explicit cast required
double pi = 3.99;
int approx = (int) pi;  // 3 — TRUNCATES, does NOT round!
System.out.println(approx);  // 3

// Overflow on narrow cast
byte b = (byte) 200;          // -56 (wraps around)
System.out.println(b);        // -56

// char ↔ int (bidirectional)
char c = 'A';
int ascii = c;           // 65 (widening)
char back = (char) 65;   // 'A' (narrowing)

// String conversions (NOT casts)
int n = Integer.parseInt("123");
double x = Double.parseDouble("3.14");
boolean flag = Boolean.parseBoolean("true");

// Primitive → String
String s1 = String.valueOf(42);    // "42"
String s2 = Integer.toString(255, 16); // "ff" (hex)
String s3 = 42 + "";              // works but avoid — ambiguous with +

// Rounding properly
int rounded = (int) Math.round(3.99);  // 4 (not truncated)
int rounded2 = Math.round(3.5f);       // 4`,
  points: [
    'int → float conversion can lose precision for very large integers (> 2^24)',
    'Math.round() returns long for double input, int for float input',
    'Integer.parseInt() throws NumberFormatException for invalid strings — always wrap in try-catch in production',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: '(int) 3.99 gives 3, NOT 4. Java truncates toward zero. For rounding, use Math.round(), Math.floor(), or Math.ceil().',
    },
    {
      type: 'interview',
      content: 'Q: Can you cast String to int?\nA: No — there is no cast from String to numeric. Use Integer.parseInt("42") or Integer.valueOf("42"). The difference: parseInt returns int (primitive), valueOf returns Integer (wrapper).',
    },
  ],
}
