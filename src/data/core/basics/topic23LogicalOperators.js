export default {
  id: 'logical-operators',
  title: '23. Logical Operators',
  explanation: `Logical operators combine boolean expressions and return a boolean result. They are the building blocks of complex conditions.

**Java's logical operators:**

| Operator | Name         | Returns true when...          |
|----------|--------------|-------------------------------|
| \`&&\`    | Logical AND  | Both operands are true        |
| \`||\`    | Logical OR   | At least one operand is true  |
| \`!\`     | Logical NOT  | The operand is false          |
| \`^\`     | Logical XOR  | Exactly one operand is true   |
| \`&\`     | Bitwise AND  | Both true (no short-circuit)  |
| \`|\`     | Bitwise OR   | Either true (no short-circuit)|

**Short-circuit evaluation — the most important property:**

\`&&\` and \`||\` use **short-circuit evaluation**:
- \`&&\`: if the left side is \`false\`, the right side is **never evaluated** (result must be false)
- \`||\`: if the left side is \`true\`, the right side is **never evaluated** (result must be true)

This is critical for safe null checks:
\`\`\`java
// Safe: if name is null, name.length() is never called
if (name != null && name.length() > 5) { ... }

// Dangerous without short-circuit: name.length() would throw NPE if name is null
if (name.length() > 5 && name != null) { ... }  // wrong order!
\`\`\`

**Non-short-circuit operators \`&\` and \`|\`:**
These always evaluate both sides. Use them only when you need the side effect of the right side to always run (rare in practice).

**Truth table for &&:**
| A     | B     | A && B |
|-------|-------|--------|
| true  | true  | true   |
| true  | false | false  |
| false | true  | false  |
| false | false | false  |

**Truth table for ||:**
| A     | B     | A \\|\\| B |
|-------|-------|--------|
| true  | true  | true   |
| true  | false | true   |
| false | true  | true   |
| false | false | false  |`,
  code: `public class LogicalOperatorsDemo {
    public static void main(String[] args) {

        boolean a = true, b = false;

        // Basic logical operators
        System.out.println("a && b  : " + (a && b));   // false
        System.out.println("a || b  : " + (a || b));   // true
        System.out.println("!a      : " + (!a));        // false
        System.out.println("!b      : " + (!b));        // true
        System.out.println("a ^ b   : " + (a ^ b));    // true (XOR)
        System.out.println("a ^ a   : " + (a ^ a));    // false (XOR same values)

        // Short-circuit demonstration
        int x = 0;
        boolean result1 = (x != 0) && (10 / x > 1);  // safe: 10/x never runs (x is 0)
        System.out.println("Short-circuit &&: " + result1);  // false, no ArithmeticException

        // Without short-circuit, this would throw ArithmeticException
        // boolean result2 = (x != 0) & (10 / x > 1);  // uncomment to see exception

        // Null-safe check using short-circuit
        String name = null;
        if (name != null && name.startsWith("A")) {  // safe — right side skipped if null
            System.out.println("Starts with A");
        } else {
            System.out.println("Name is null or does not start with A");
        }

        // Complex conditions
        int age = 25;
        double income = 50000;
        boolean hasJob = true;

        boolean eligible = (age >= 18) && (income > 30000) && hasJob;
        System.out.println("Loan eligible: " + eligible);  // true

        boolean qualifies = (age < 18) || (income > 100000);
        System.out.println("Discount qualifies: " + qualifies);  // false

        // NOT with complex expression
        boolean isWeekend = false;
        if (!isWeekend) {
            System.out.println("It is a weekday");
        }

        // De Morgan's Law examples
        // !(A && B) == (!A || !B)
        // !(A || B) == (!A && !B)
        System.out.println(!(a && b));           // true
        System.out.println(!a || !b);            // true (same result)

        // Chained conditions
        int score = 75;
        String grade = (score >= 90) ? "A" :
                       (score >= 80) ? "B" :
                       (score >= 70) ? "C" : "F";
        System.out.println("Grade: " + grade);  // C
    }
}`,
  codeTitle: 'Short-Circuit, AND/OR/NOT/XOR Demo',
  points: [
    'Short-circuit evaluation means && stops at the first false and || stops at the first true. This is not just an optimization — it is essential for safe null checks and preventing exceptions. Always put the cheap/safe check first.',
    '! (NOT) has higher precedence than && and ||. !(a && b) is NOT the same as !a && !b. Use De Morgan\'s law: !(A && B) = !A || !B, and !(A || B) = !A && !B.',
    'The non-short-circuit operators & and | are the bitwise AND and OR when applied to integers, but when applied to booleans, they perform logical AND/OR without short-circuiting. They are rarely needed for boolean logic — use && and || instead.',
    'XOR (^) returns true when exactly one operand is true. It is useful for toggling: boolean switched = flag ^ true will flip flag regardless of its value.',
    'Operator precedence for logical: ! first, then &&, then ||. So a || b && c means a || (b && c), not (a || b) && c. Use parentheses when combining && and || to make intent explicit.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'if (user != null & user.isAdmin()) — using & instead of && means user.isAdmin() is evaluated even when user is null, causing NullPointerException. Always use && for boolean short-circuit logic. The only reason to use & on booleans is when the right side must always execute for its side effect, which is almost never what you want.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between && and & for booleans?\nA: Both perform logical AND, but && short-circuits (skips the right operand if left is false) while & always evaluates both operands. For performance and safety (avoiding NPE), always use && unless you explicitly need both sides to execute. Similarly, || short-circuits (stops at first true) while | evaluates both.',
    },
    {
      type: 'tip',
      content: 'For null-safe string checks, a common pattern is: if (str != null && !str.isEmpty()). You can also use Objects.nonNull(str) and str.isBlank() (Java 11+) for more readable conditions. Consider extracting complex boolean conditions into well-named local variables: boolean isAdult = age >= 18; boolean hasPermit = permit != null; if (isAdult && hasPermit) { ... }',
    },
  ],
}
