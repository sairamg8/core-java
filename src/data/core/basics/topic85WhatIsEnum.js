export default {
  id: 'what-is-enum',
  title: '85. What Is an Enum?',
  explanation: `An enum (enumeration) in Java is a special class type used to represent a fixed set of named constants. Before enums (pre-Java 5), programmers used public static final int constants — but these had no type safety: you could pass any int where a constant was expected.

Enums solve this by creating a new type whose only valid values are the listed constants. This makes code safer, more readable, and self-documenting.

In Java, an enum is actually a full class that extends java.lang.Enum. Each constant is an instance of the enum class. Because they are objects, enums can have fields, constructors, and methods — making them far more powerful than simple constants.

Enums are implicitly \`public static final\` and cannot be instantiated with \`new\`. They support == comparison (since there is only one instance per constant), can be used in switch statements, and provide built-in methods: \`name()\`, \`ordinal()\`, \`values()\`, and \`valueOf()\`.`,
  code: `// Simple enum
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// Enum with fields and constructor
enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS  (4.869e+24, 6.0518e6),
    EARTH  (5.976e+24, 6.37814e6);

    private final double mass;     // in kg
    private final double radius;   // in meters

    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    double surfaceGravity() {
        final double G = 6.67300E-11;
        return G * mass / (radius * radius);
    }
}

public class Demo {
    public static void main(String[] args) {
        Day today = Day.WEDNESDAY;
        System.out.println(today);           // WEDNESDAY
        System.out.println(today.name());    // WEDNESDAY
        System.out.println(today.ordinal()); // 2 (0-indexed)

        // Iterate all values
        for (Day d : Day.values()) {
            System.out.print(d + " ");
        }
        System.out.println();

        // Lookup by name
        Day friday = Day.valueOf("FRIDAY");
        System.out.println(friday); // FRIDAY

        // Enum with behavior
        System.out.printf("Earth gravity: %.2f m/s^2%n",
            Planet.EARTH.surfaceGravity()); // ~9.80
    }
}`,
  codeTitle: 'Enum Basics and Enum with Fields',
  points: [
    'Enum constants are implicitly public static final instances of the enum class',
    'Enums extend java.lang.Enum and cannot be subclassed or instantiated with new',
    'ordinal() returns the 0-based position; name() returns the constant name as a String',
    'values() returns all constants in declaration order; valueOf(String) looks up by name',
    'Enums can have fields, constructors (always private/package-private), and methods',
    'Enum constants are singletons — == comparison is safe and preferred over equals()',
    'Enums are thread-safe singletons, making them a popular implementation for the Singleton pattern',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The ordinal() value is fragile — it changes if you insert or reorder constants. Never persist ordinal() to a database or file. Use name() or a custom field instead.',
    },
    {
      type: 'interview',
      content: 'Q: Can an enum implement an interface?\nA: Yes. An enum can implement any interface, and each constant can provide its own implementation of the interface methods. This is a powerful pattern for state machines and command dispatch.',
    },
    {
      type: 'tip',
      content: 'Use enums instead of int constants or String constants wherever the set of valid values is fixed and known at compile time. It makes the API self-documenting and prevents invalid values from being passed.',
    },
  ],
}
