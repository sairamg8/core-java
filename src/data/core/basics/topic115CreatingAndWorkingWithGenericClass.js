export default {
  id: 'creating-and-working-with-generic-class',
  title: '115. Creating and Working with a Generic Class',
  explanation: `Building a generic class requires thinking about what types you want to parameterize, what constraints make sense, and what operations are safe to perform given those constraints.

**Design process:**
1. Identify what varies — what type of data does the class hold?
2. Define type parameters with meaningful names and bounds.
3. Use the type parameter only where the type matters — fields, method signatures, return types.
4. Be aware of what you CANNOT do due to type erasure: no new T(), no T.class, no T[].

**Generic stack example:** A stack works the same way regardless of the element type. By making it generic, one implementation serves String, Integer, or any other type — replacing what would otherwise be many identical copies.

**Practical patterns:**
- **Repository/Container pattern:** generic containers (Box<T>, Pair<K,V>, Optional<T>, Result<T>)
- **Generic algorithms:** sort, search, map, filter operating on generic collections
- **Builder pattern:** builders that return the correct subtype using bounded type parameters

**Type erasure limitations in practice:**
- Cannot instantiate T: new T() — use a Class<T> and reflection if needed
- Cannot create T[]: T[] arr = new T[10] — use Object[] and cast or ArrayList<T>
- instanceof T is illegal — use instanceof with a concrete class
- Cannot overload methods that differ only in generic type (both erase to the same signature)`,
  code: `import java.util.*;

// Generic Stack — complete implementation
class GenericStack<T> {
    private final List<T> elements = new ArrayList<>();

    public void push(T item) {
        elements.add(item);
    }

    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        return elements.remove(elements.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return elements.get(elements.size() - 1);
    }

    public boolean isEmpty() { return elements.isEmpty(); }
    public int size()        { return elements.size(); }

    @Override
    public String toString() { return elements.toString(); }
}

// Generic Result type — encapsulates success or failure
class Result<T> {
    private final T value;
    private final String error;

    private Result(T value, String error) {
        this.value = value;
        this.error = error;
    }

    public static <T> Result<T> success(T value) { return new Result<>(value, null); }
    public static <T> Result<T> failure(String error) { return new Result<>(null, error); }

    public boolean isSuccess() { return error == null; }
    public T getValue()        { return value; }
    public String getError()   { return error; }
}

public class GenericClassDemo {
    public static void main(String[] args) {
        // Generic stack with String
        GenericStack<String> stringStack = new GenericStack<>();
        stringStack.push("first");
        stringStack.push("second");
        stringStack.push("third");
        System.out.println("Stack: " + stringStack);
        System.out.println("Pop: " + stringStack.pop());
        System.out.println("Peek: " + stringStack.peek());

        // Generic stack with Integer
        GenericStack<Integer> intStack = new GenericStack<>();
        intStack.push(10);
        intStack.push(20);
        intStack.push(30);
        System.out.println("Int sum: " + (intStack.pop() + intStack.pop() + intStack.pop()));

        // Generic Result
        Result<Integer> ok = Result.success(42);
        Result<Integer> fail = Result.failure("Not found");

        if (ok.isSuccess()) System.out.println("Got: " + ok.getValue());
        if (!fail.isSuccess()) System.out.println("Error: " + fail.getError());
    }
}`,
  codeTitle: 'Building a Generic Class',
  points: [
    'Generic classes parameterize the type of data they operate on — one implementation, infinite type compatibility',
    'Type parameters appear after the class name: class MyClass<T> and can be used throughout the class body',
    'You can add bounds to constrain what T can be: class NumberBox<T extends Number>',
    'Generic classes eliminate code duplication — one GenericStack<T> replaces StringStack, IntegerStack, etc.',
    'Type erasure means new T() is illegal — work around it by accepting a Class<T> parameter and using reflection',
    'Cannot create generic arrays: T[] arr = new T[10] — use List<T> instead',
    'Static members cannot use the class type parameter — static methods need their own <T> declaration',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Static fields and methods of a generic class cannot use the class-level type parameter T. Each static method must declare its own type parameter if it needs one.',
    },
    {
      type: 'interview',
      content: 'Q: Why cannot you do new T() inside a generic class?\nA: Due to type erasure, T is just Object at runtime. The JVM does not know what constructor to call. Workaround: pass a Supplier<T> or Class<T> and use reflection (clazz.getDeclaredConstructor().newInstance()).',
    },
    {
      type: 'tip',
      content: 'Use List<T> internally instead of T[] in generic classes — lists avoid the generic array creation problem and are generally more flexible.',
    },
  ],
}
