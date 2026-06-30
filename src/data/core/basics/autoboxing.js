export default {
  id: 'autoboxing',
  title: '6. Autoboxing & Wrapper Classes',
  explanation: `Each primitive has a corresponding Wrapper class in java.lang. Wrappers are needed for Collections (which only accept Objects), generics, null handling, and utility methods.

**Autoboxing:** Compiler automatically converts primitive → wrapper.
**Unboxing:** Compiler automatically converts wrapper → primitive.`,
  table: {
    headers: ['Primitive', 'Wrapper', 'Cache Range'],
    rows: [
      ['int', 'Integer', '-128 to 127'],
      ['long', 'Long', '-128 to 127'],
      ['double', 'Double', 'None'],
      ['boolean', 'Boolean', 'true / false (both cached)'],
      ['char', 'Character', '0 to 127'],
      ['byte', 'Byte', '-128 to 127 (all values)'],
      ['short', 'Short', '-128 to 127'],
      ['float', 'Float', 'None'],
    ],
  },
  code: `// Autoboxing — compiler rewrites this:
Integer x = 42;              // Integer.valueOf(42)
List<Integer> list = new ArrayList<>();
list.add(5);                 // list.add(Integer.valueOf(5))

// Unboxing — compiler rewrites this:
int y = x;                   // x.intValue()
int sum = x + 10;            // x.intValue() + 10

// Integer cache — objects -128 to 127 are REUSED
Integer a = 127;
Integer b = 127;
System.out.println(a == b);      // true  (same cached object)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);      // false (different objects!)
System.out.println(c.equals(d)); // true  (compare values)

// Null unboxing → NullPointerException
Integer n = null;
int val = n;                 // NullPointerException at runtime!

// Useful wrapper methods
int max = Integer.MAX_VALUE;               // 2147483647
int parsed = Integer.parseInt("42");
String bin = Integer.toBinaryString(10);  // "1010"
String hex = Integer.toHexString(255);    // "ff"
int clamped = Integer.min(x, 100);`,
  points: [
    'Boolean.TRUE and Boolean.FALSE are always cached — Boolean x = true; Boolean y = true; x == y is true',
    'Performance: avoid autoboxing in tight loops — creates garbage objects that pressure GC',
    'Double and Float have no cache — every new Double(3.14) creates a new object',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'NEVER use == to compare wrapper objects like Integer, Long, Double. Values outside the cache range (-128 to 127 for Integer) create new objects, so == compares references not values. Always use .equals().',
    },
    {
      type: 'interview',
      content: 'Q: What is Integer cache / Integer pool?\nA: JVM caches Integer.valueOf() results for -128 to 127. The upper bound can be extended via -XX:AutoBoxCacheMax=N JVM flag. This is why Integer.valueOf(127) == Integer.valueOf(127) is true but Integer.valueOf(128) == Integer.valueOf(128) is false.',
    },
  ],
}
