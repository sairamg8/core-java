export default {
  id: 'generics-basics',
  title: '1. Generic Classes & Methods',
  explanation: `Generics allow you to write classes and methods that work with **any type**, while maintaining compile-time type safety — no casting, no ClassCastException at runtime.

**Before generics (Java 1.4):** Everything was stored as Object — required casting and was unsafe.
**With generics:** The type is parameterized at the call site; the compiler enforces it.

Type parameters by convention: \`T\` (Type), \`E\` (Element), \`K\` (Key), \`V\` (Value), \`N\` (Number).`,
  code: `// Generic class
public class Box<T> {
    private T value;

    public Box(T value) { this.value = value; }
    public T get() { return value; }
    public void set(T value) { this.value = value; }

    @Override
    public String toString() { return "Box[" + value + "]"; }
}

Box<String>  stringBox  = new Box<>("Hello");
Box<Integer> intBox     = new Box<>(42);
String s = stringBox.get();  // No cast needed
int n    = intBox.get();     // auto-unboxed

// Box<int> is ILLEGAL — generics only work with reference types
// Use Integer, Double, etc. for primitives

// Generic method — type param declared before return type
public class Utils {
    public static <T> T getFirst(T[] arr) {
        if (arr == null || arr.length == 0) return null;
        return arr[0];
    }

    public static <T> void swap(T[] arr, int i, int j) {
        T tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    // Multiple type params
    public static <K, V> java.util.Map.Entry<K,V> pair(K key, V value) {
        return java.util.Map.entry(key, value);
    }
}

String first = Utils.getFirst(new String[]{"a", "b", "c"}); // "a"
Utils.<Integer>swap(new Integer[]{1,2,3}, 0, 2);  // explicit type arg — rarely needed

// Generic interface
interface Repository<T, ID> {
    T findById(ID id);
    void save(T entity);
}

class UserRepo implements Repository<User, Long> {
    public User findById(Long id) { return null; } // implement for User
    public void save(User user)   { /* persist */ }
}
class User { long id; }

// Bounded type parameter — T must be a Number or its subclass
public static <T extends Number> double sumList(java.util.List<T> list) {
    double total = 0;
    for (T item : list) total += item.doubleValue();
    return total;
}
// sumList(List.of(1, 2, 3))   → 6.0   (Integer extends Number)
// sumList(List.of(1.5, 2.5))  → 4.0   (Double extends Number)
// sumList(List.of("a"))        → compile error — String not a Number`,
  points: [
    'Generic type information exists ONLY at compile time — it is erased at runtime (type erasure). At runtime, Box<String> and Box<Integer> are both just Box.',
    'You cannot do new T() or new T[] — type parameters are erased. Use a Class<T> token and reflection, or a factory, instead.',
    'Diamond operator <> (Java 7+): Box<String> box = new Box<>() — compiler infers the type argument from context.',
    'Generics and arrays don\'t mix well: new List<String>[10] is illegal because of type erasure + array covariance.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is type erasure?\nA: The compiler replaces generic type parameters with their bounds (or Object if unbounded) and inserts casts where needed. At runtime, no generic type info exists — Box<String> and Box<Integer> are both class Box. This is why you can\'t do instanceof Box<String> at runtime.',
    },
    {
      type: 'gotcha',
      content: 'static fields and methods cannot use the class\'s type parameter — static context is shared across all instances regardless of type. Use a separate type parameter on the static method itself: public static <T> void foo(T t).',
    },
  ],
}
