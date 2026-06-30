export default {
  id: 'enum-class',
  title: '87. Enum Class',
  explanation: `Every Java enum is implicitly a class that extends \`java.lang.Enum<E>\`. This means enums can do everything a class can do: have fields, constructors, instance methods, static methods, and even abstract methods. Understanding the "enum as class" perspective unlocks advanced patterns.

Key rules for enum as a class:
- The constructor is always implicitly private (or explicitly private). You cannot call it with \`new\`.
- Fields set in the constructor give each constant its own state.
- Abstract methods can be declared in the enum body, and each constant must provide its own implementation inline.
- Enums can implement interfaces.
- Enums are serialization-safe singletons — the JVM guarantees one instance per constant even across serialization.

The abstract method pattern lets each enum constant carry its own behavior, effectively building a self-contained switch table inside the enum.`,
  code: `// Enum with fields, constructor, and method
enum Coin {
    PENNY(1), NICKEL(5), DIME(10), QUARTER(25);

    private final int value;  // cents

    Coin(int value) {      // implicitly private
        this.value = value;
    }

    public int getValue() { return value; }
}

// Enum with abstract method — each constant provides its own body
enum Operation {
    ADD {
        @Override
        public int apply(int x, int y) { return x + y; }
    },
    SUBTRACT {
        @Override
        public int apply(int x, int y) { return x - y; }
    },
    MULTIPLY {
        @Override
        public int apply(int x, int y) { return x * y; }
    };

    public abstract int apply(int x, int y);
}

// Enum implementing an interface
interface Describable {
    String describe();
}

enum Status implements Describable {
    ACTIVE, INACTIVE, PENDING;

    @Override
    public String describe() {
        return "Status: " + name() + " (ordinal " + ordinal() + ")";
    }
}

public class Demo {
    public static void main(String[] args) {
        // Fields
        for (Coin c : Coin.values()) {
            System.out.println(c + " = " + c.getValue() + " cents");
        }

        // Abstract methods
        System.out.println(Operation.ADD.apply(10, 3));       // 13
        System.out.println(Operation.SUBTRACT.apply(10, 3));  // 7
        System.out.println(Operation.MULTIPLY.apply(10, 3));  // 30

        // Interface
        for (Status s : Status.values()) {
            System.out.println(s.describe());
        }
    }
}`,
  codeTitle: 'Enum as a Full Class with Fields, Abstract Methods, and Interfaces',
  points: [
    'Every enum implicitly extends java.lang.Enum<E> — you cannot extend any other class',
    'Enum constructors are implicitly private; each constant invokes the constructor with its argument list',
    'Fields in enums are per-constant instance state, unlike static variables shared by all constants',
    'Declaring an abstract method forces every constant to provide an implementation inline — no switches needed',
    'Enums can implement interfaces, enabling polymorphic use through interface references',
    'EnumSet and EnumMap are highly efficient specialized collections for enum keys',
    'Enums are the recommended Singleton implementation in Effective Java due to serialization and thread safety guarantees',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Enum constants with abstract method bodies are actually anonymous subclasses of the enum type. This is why you see PENNY.getClass() != Coin.class for enums with abstract methods — each constant is its own subtype.',
    },
    {
      type: 'interview',
      content: 'Q: Why are enums recommended for implementing the Singleton pattern?\nA: The JVM guarantees exactly one instance per enum constant. Enum-based singletons are immune to reflection attacks (Constructor.newInstance() throws an exception for enum types) and serialization attacks (the default readResolve mechanism is built in). Named singletons like INSTANCE also document intent clearly.',
    },
    {
      type: 'tip',
      content: 'Use EnumSet instead of a Set<MyEnum> and EnumMap instead of a Map<MyEnum, V> for better performance. Both are backed by bit vectors internally and are much faster than HashSet/HashMap for enum keys.',
    },
  ],
}
