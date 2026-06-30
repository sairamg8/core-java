export default {
  id: 'generics-wildcards',
  title: '2. Wildcards & the PECS Rule',
  explanation: `**Wildcards** (\`?\`) represent an unknown type. They solve the problem that \`List<Integer>\` is NOT a subtype of \`List<Number>\` even though Integer extends Number.

**PECS — Producer Extends, Consumer Super:**
- \`? extends T\` — you can READ from it (it produces T), cannot write
- \`? super T\`   — you can WRITE to it (it consumes T), cannot read safely
- \`?\` (unbounded) — only valid when the operation doesn't depend on the type at all`,
  table: {
    headers: ['Wildcard', 'Meaning', 'Can read?', 'Can write?', 'Use when'],
    rows: [
      ['? extends T', 'T or subtype of T', 'Yes (as T)', 'No (only null)', 'Reading from a collection (producer)'],
      ['? super T', 'T or supertype of T', 'Only as Object', 'Yes (T or subtype)', 'Writing to a collection (consumer)'],
      ['?', 'Any type', 'Only as Object', 'No (only null)', 'Type-agnostic operations (size, clear)'],
    ],
  },
  code: `import java.util.*;

// WHY wildcards exist
// List<Integer> is NOT a List<Number> — this fails:
// List<Number> nums = new ArrayList<Integer>(); // ← compile error

// ? extends — upper bounded wildcard — read from producer
static double sumList(List<? extends Number> list) {
    double total = 0;
    for (Number n : list) total += n.doubleValue();
    return total;
}
sumList(new ArrayList<Integer>());  // works
sumList(new ArrayList<Double>());   // works
// list.add(1.0)  ← compile error — can't add, type unknown

// ? super — lower bounded wildcard — write to consumer
static void addNumbers(List<? super Integer> list) {
    list.add(1);    // safe — Integer or any supertype accepts Integer
    list.add(2);
}
addNumbers(new ArrayList<Integer>());  // works
addNumbers(new ArrayList<Number>());   // works
addNumbers(new ArrayList<Object>());   // works
// Number n = list.get(0);  ← compile error — read gives Object

// PECS in action — copy from src to dest
static <T> void copy(List<? extends T> src, List<? super T> dest) {
    for (T item : src) {
        dest.add(item);
    }
}
List<Integer> ints = List.of(1, 2, 3);
List<Number> nums = new ArrayList<>();
copy(ints, nums);  // perfectly type-safe

// Unbounded wildcard — only care about collection operations
static void printAll(List<?> list) {
    for (Object o : list) System.out.println(o);
    System.out.println("Size: " + list.size());
    // list.add("x")  ← compile error
}

// Multiple bounds — class first, then interfaces
class MultiBox<T extends Comparable<T> & Cloneable> {
    T value;
}

// Generics with inheritance
class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

List<Dog> dogs = new ArrayList<>();
List<Cat> cats = new ArrayList<>();

// This works with wildcards:
List<? extends Animal> animals;
animals = dogs;  // ok
animals = cats;  // ok
// animals.add(new Dog()); ← no — we don't know if it's a List<Dog> or List<Cat>`,
  points: [
    'PECS mnemonic: the collection "produces" items you read (extends), "consumes" items you write (super)',
    'Collections.copy(dest, src) is the canonical PECS example in the JDK — void copy(List<? super T> dest, List<? extends T> src)',
    'Unbounded wildcard List<?> is more restrictive than raw type List — the compiler still enforces you don\'t add typed elements',
    'When both reading and writing are needed, use a concrete type parameter T, not a wildcard',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why is List<Integer> not a subtype of List<Number>?\nA: Because of type safety. If it were, you could write: List<Number> list = new ArrayList<Integer>(); list.add(3.14); — which would silently put a Double into an Integer list and cause ClassCastException on read. Wildcards (List<? extends Number>) safely express the "is-a" relationship for read-only use.',
    },
    {
      type: 'gotcha',
      content: 'Never use raw types (List without <>) in new code — they bypass all generic type checks. Raw types exist only for backwards compatibility with pre-Java-5 code. The compiler will warn you.',
    },
  ],
}
