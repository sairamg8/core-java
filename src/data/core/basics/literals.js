export default {
  id: 'literals',
  title: 'Literals in Java',
  explanation: `A **literal** is a fixed value written directly in the source code. When you write \`42\`, \`"Hello"\`, or \`true\`, those are literals — they are not computed, they ARE the value.

Java supports six categories of literals:
1. **Integer literals** — whole numbers
2. **Floating-point literals** — decimal numbers
3. **Character literals** — a single character in single quotes
4. **String literals** — text in double quotes
5. **Boolean literals** — \`true\` or \`false\`
6. **Null literal** — \`null\` (reference types only)

**Why literals matter:** The way you write a literal determines its type. \`42\` is an \`int\`. \`42L\` is a \`long\`. \`42.0\` is a \`double\`. \`42.0f\` is a \`float\`. Getting this wrong causes compile errors or precision loss.`,
  code: `// ── INTEGER LITERALS ──────────────────────────────────────
int decimal = 255;          // standard base-10
int hex     = 0xFF;         // hexadecimal (0x prefix) → 255
int octal   = 0377;         // octal (0 prefix) → 255
int binary  = 0b11111111;   // binary (0b prefix, Java 7+) → 255

// Underscores improve readability (Java 7+)
long creditCard = 1234_5678_9012_3456L;  // L suffix = long literal
int  million    = 1_000_000;

// ── FLOATING-POINT LITERALS ────────────────────────────────
double d1 = 3.14;           // default: double
double d2 = 3.14d;          // explicit double suffix (optional)
float  f1 = 3.14f;          // f suffix REQUIRED for float
double sci = 1.5e10;        // scientific notation: 1.5 × 10^10

// ── CHARACTER LITERALS ─────────────────────────────────────
char letter  = 'A';          // single character — single quotes
char newline = '\\n';         // escape sequence — newline
char tab     = '\\t';         // tab
char quote   = '\\'';         // single quote escaped
char unicode = '\\u0041';     // Unicode escape for 'A'
char num     = 65;           // int-to-char: ASCII 65 = 'A'

// ── STRING LITERALS ────────────────────────────────────────
String s1 = "Hello";
String s2 = "Say \\"hello\\"";  // escaped double quote inside string
String s3 = "Line 1\\nLine 2";  // \\n is newline
String multiline = """
    This is a
    text block (Java 15+)
    """;

// ── BOOLEAN LITERALS ───────────────────────────────────────
boolean yes = true;
boolean no  = false;
// Note: Java does NOT accept 0/1 as booleans (unlike C/C++)
// if (1) { } → COMPILE ERROR

// ── NULL LITERAL ───────────────────────────────────────────
String name = null;   // reference not pointing to any object
int[]  arr  = null;   // null works for any reference type
// int x = null;      // COMPILE ERROR — primitives cannot be null`,
  codeTitle: 'LiteralsDemo.java',
  points: [
    'Integer literals default to int. To write a long literal you MUST add L: 10_000_000_000L (without L this overflows int)',
    'Floating-point literals default to double. Float literals MUST have f suffix: 3.14f (without f you get "possible lossy conversion" error)',
    'Hex literals use 0x prefix (0-9, A-F case insensitive). Binary literals use 0b prefix (0 and 1 only). Octal uses leading 0.',
    'Underscore _ can appear between digits in any numeric literal (Java 7+) for readability. Cannot appear at start/end or next to decimal point.',
    'Character literals use single quotes. String literals use double quotes. Mixing them is a compile error.',
    'The null literal can be assigned to ANY reference type (String, array, object). Accessing a field or method on a null reference throws NullPointerException at runtime.',
  ],
  table: {
    headers: ['Literal', 'Type', 'Example'],
    rows: [
      ['Integer', 'int (default)', '42, 0xFF, 0b1010'],
      ['Long', 'long', '42L, 0xFFFFFFFFL'],
      ['Float', 'float', '3.14f, 2.5e3f'],
      ['Double', 'double', '3.14, 3.14d, 1e-5'],
      ['Character', 'char', "'A', '\\\\n', '\\\\u0041'"],
      ['String', 'String', '"Hello", "Line1\\\\nLine2"'],
      ['Boolean', 'boolean', 'true, false'],
      ['Null', 'any reference', 'null'],
    ],
  },
  callouts: [
    {
      type: 'gotcha',
      content: 'float price = 9.99; → COMPILE ERROR. The literal 9.99 is a double by default. Assigning double to float loses precision — Java refuses this without an explicit cast or f suffix. Fix: float price = 9.99f; or double price = 9.99;',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between \'A\' and "A" in Java?\nA: \'A\' is a char literal — a single character stored as a 2-byte Unicode value (65 for ASCII A). "A" is a String literal — a reference to a String object in the String Pool. They are completely different types. char + char = int (arithmetic); String + String = String (concatenation).',
    },
    {
      type: 'important',
      content: 'Key escape sequences: \\n = newline, \\t = tab, \\\\ = literal backslash, \\" = double quote inside strings, \\r = carriage return, \\0 = null character. Windows file paths need double backslashes: "C:\\\\Users\\\\Java" — each \\\\ in source produces a single \\ in the actual value.',
    },
  ],
}
