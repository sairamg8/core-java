export default {
  id: 'data-types',
  title: '2. Primitive & Reference Types',
  explanation: `Java is **statically typed** — every variable has a type declared at compile time.

**Primitives (8 types):** Stored on the stack. Not objects. Always have a value (no null).

**Reference Types:** Store a heap address. Includes String, arrays, all objects. Can be null.`,
  table: {
    headers: ['Type', 'Size', 'Default', 'Range / Notes'],
    rows: [
      ['byte', '1 byte', '0', '-128 to 127'],
      ['short', '2 bytes', '0', '-32,768 to 32,767'],
      ['int', '4 bytes', '0', '≈ ±2.1 billion'],
      ['long', '8 bytes', '0L', '≈ ±9.2 × 10¹⁸ — suffix L required'],
      ['float', '4 bytes', '0.0f', '~7 decimal digits — suffix f required'],
      ['double', '8 bytes', '0.0', '~15 decimal digits'],
      ['char', '2 bytes', "\\u0000", '0–65535 UTF-16 Unicode'],
      ['boolean', 'JVM-dep.', 'false', 'true or false only'],
    ],
  },
  code: `// Primitives
int age = 25;
long population = 8_000_000_000L;   // underscore separator (Java 7+)
double pi = 3.14159;
float tax = 0.18f;                   // f suffix required
char grade = 'A';                    // single quotes
boolean active = true;

// Literal formats
int hex    = 0xFF;           // 255
int octal  = 0377;           // 255
int binary = 0b11111111;     // 255

// var — local type inference (Java 10+)
var name = "Alice";          // inferred as String
var nums = new int[]{1,2,3}; // inferred as int[]

// Reference type — stored in heap, variable holds address
String s = "Hello";          // String literal (String Pool)
int[] arr = new int[5];      // default: all 0s
Integer n = null;            // reference types can be null`,
  points: [
    'Local variables have NO default value — must initialize before use (compile error otherwise)',
    'Instance/static fields DO get defaults: numeric=0, boolean=false, reference=null',
    'char is unsigned — range 0 to 65535. int is signed — range -2^31 to 2^31-1',
    'double is preferred over float for precision — float has only ~7 significant digits',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the default value of a local variable?\nA: No default — compiler forces you to initialize it. Instance variables get defaults (0, false, null). This is a classic trick question.',
    },
    {
      type: 'gotcha',
      content: 'int max = Integer.MAX_VALUE + 1 silently gives -2147483648 (overflow wraps). Use long if you need larger numbers and add L suffix: long max = 2_147_483_648L.',
    },
  ],
}
