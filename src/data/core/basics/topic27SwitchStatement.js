export default {
  id: 'switch-statement',
  title: '27. Switch Statement',
  explanation: `The switch statement is a multi-way branch construct that evaluates an expression once and then checks its value against a list of cases. It is an alternative to long if-else-if chains when the decision is based on a single variable matching discrete constant values.

**Syntax:**
\`\`\`java
switch (expression) {
    case value1:
        // statements
        break;
    case value2:
        // statements
        break;
    default:
        // fallback statements
}
\`\`\`

The expression can be of type \`int\`, \`char\`, \`byte\`, \`short\`, \`String\` (since Java 7), or an \`enum\`. The \`break\` keyword exits the switch block; without it, execution **falls through** into the next case. The \`default\` case is optional and runs when no case matches.

**Switch Expression (Java 14+):**
Java 14 introduced switch expressions that return a value and use the arrow syntax to eliminate fall-through by default:
\`\`\`java
int day = 3;
String name = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Other";
};
\`\`\`

Switch expressions must be exhaustive — all possible inputs must be covered, either by explicit cases or a \`default\`.`,
  code: `public class SwitchDemo {
    public static void main(String[] args) {
        // Classic switch statement
        int day = 3;
        String dayName;
        switch (day) {
            case 1:
                dayName = "Monday";
                break;
            case 2:
                dayName = "Tuesday";
                break;
            case 3:
                dayName = "Wednesday";
                break;
            case 4:
                dayName = "Thursday";
                break;
            case 5:
                dayName = "Friday";
                break;
            default:
                dayName = "Weekend";
        }
        System.out.println(dayName); // Wednesday

        // Fall-through: group multiple cases
        switch (day) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                System.out.println("Weekday");
                break;
            default:
                System.out.println("Weekend");
        }

        // Switch expression (Java 14+)
        String result = switch (day) {
            case 1, 2, 3, 4, 5 -> "Weekday";
            default -> "Weekend";
        };
        System.out.println(result); // Weekday

        // Switch on String (Java 7+)
        String grade = "B";
        switch (grade) {
            case "A":
                System.out.println("Excellent");
                break;
            case "B":
                System.out.println("Good");
                break;
            default:
                System.out.println("Other");
        }
    }
}`,
  codeTitle: 'Switch Statement — Classic and Modern Forms',
  points: [
    'switch evaluates its expression once and matches against constant case values — more efficient than chained if-else for many discrete values',
    'Without break, execution falls through into the next case — this is intentional when grouping cases but often a bug if forgotten',
    'default is optional but strongly recommended as a safety net for unmatched values',
    'String support was added in Java 7; switch still cannot work with long, float, double, or boolean',
    'Java 14+ switch expressions use the arrow (->) syntax, return a value, and are fall-through-free by default',
    'Multi-label cases (case 1, 2, 3 -> ...) are supported in switch expressions for concise grouping',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting break in a classic switch causes fall-through — all subsequent cases execute until a break or the end of the block. This is one of the most common Java bugs.',
    },
    {
      type: 'tip',
      content: 'Prefer switch expressions (Java 14+) over classic switch statements when you need a result value. They are exhaustiveness-checked by the compiler and eliminate accidental fall-through.',
    },
    {
      type: 'interview',
      content: 'Q: What types can be used in a switch expression?\nA: int, byte, short, char, their wrapper types, String (since Java 7), and enum. long, float, double, and boolean are not allowed.',
    },
  ],
}
