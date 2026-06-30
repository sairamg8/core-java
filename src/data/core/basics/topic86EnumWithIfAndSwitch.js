export default {
  id: 'enum-with-if-and-switch',
  title: '86. Enum with if and switch',
  explanation: `Enums integrate naturally with Java's control flow statements. Using enums in \`if\` and \`switch\` statements makes decision logic readable and type-safe — the compiler guarantees that only valid enum constants are used.

With \`if\` statements, you compare an enum value using \`==\` (preferred) or \`.equals()\`. Since each constant is a singleton, \`==\` is both correct and efficient.

With \`switch\` statements, Java provides first-class enum support. You switch on an enum variable directly, and case labels use just the constant name (no enum prefix needed). The compiler can also warn you about missing cases if you are switching on an enum type without a \`default\`.

Java 14+ switch expressions and Java 21 pattern-matching switches further enhance enum usage, but the classic switch statement with enums is the most widely used pattern.`,
  code: `enum Season { SPRING, SUMMER, AUTUMN, WINTER }

enum TrafficLight { RED, YELLOW, GREEN }

public class Demo {
    // Using enum with if
    static String getClothing(Season s) {
        if (s == Season.WINTER) {
            return "Wear a coat";
        } else if (s == Season.SUMMER) {
            return "Wear shorts";
        } else {
            return "Wear casual clothes";
        }
    }

    // Using enum with switch (classic)
    static String getAction(TrafficLight light) {
        switch (light) {
            case RED:
                return "STOP";
            case YELLOW:
                return "SLOW DOWN";
            case GREEN:
                return "GO";
            default:
                return "UNKNOWN";
        }
    }

    // Java 14+ switch expression with enum
    static String getActionExpr(TrafficLight light) {
        return switch (light) {
            case RED    -> "STOP";
            case YELLOW -> "SLOW DOWN";
            case GREEN  -> "GO";
        };  // no default needed — all cases covered
    }

    public static void main(String[] args) {
        System.out.println(getClothing(Season.WINTER));  // Wear a coat
        System.out.println(getClothing(Season.SPRING));  // Wear casual clothes

        for (TrafficLight t : TrafficLight.values()) {
            System.out.println(t + " -> " + getAction(t));
        }
        // RED -> STOP
        // YELLOW -> SLOW DOWN
        // GREEN -> GO
    }
}`,
  codeTitle: 'Enum with if and switch Statements',
  points: [
    'Use == to compare enum values — it is safe since enums are singletons, and faster than equals()',
    'In switch statements, case labels use just the constant name without the enum type prefix',
    'Java 14+ switch expressions with -> syntax work cleanly with enums and do not need break',
    'When all enum constants are handled in a switch expression, no default is needed — exhaustiveness is checked at compile time',
    'Enums in switch are more readable than integer/string constants because the names are meaningful',
    'The compiler issues a warning if a switch on an enum is missing some cases (in some IDEs/tools)',
    'Using enums with switch supports the open-closed principle when combined with methods on enums',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In a switch statement, do NOT write Season.WINTER in the case — just write WINTER. Writing the full qualified name causes a compile error. The enum type is already inferred from the switch expression.',
    },
    {
      type: 'interview',
      content: 'Q: What happens if you add a new constant to an enum but forget to update all switch statements that use it?\nA: Classic switch statements silently fall through to default (or do nothing if no default). Java 14+ switch expressions without a default will cause a compile error if the new constant is not handled — making them safer.',
    },
    {
      type: 'tip',
      content: 'Move business logic into the enum itself (using abstract methods or fields) rather than using if/switch on the enum repeatedly. This keeps the logic close to the data and avoids scattered switch statements throughout the codebase.',
    },
  ],
}
