export default {
  id: 'ternary-operator',
  title: '26. Ternary Operator',
  explanation: `The ternary operator is a compact way to write a simple if-else expression. It is the only operator in Java that takes three operands — hence the name "ternary".

**Syntax:**
\`\`\`java
result = condition ? valueIfTrue : valueIfFalse;
\`\`\`

- \`condition\` — a boolean expression
- \`valueIfTrue\` — returned/used if the condition is true
- \`valueIfFalse\` — returned/used if the condition is false

**The ternary operator is an expression, not a statement.** It produces a value that can be:
- Assigned to a variable
- Passed as a method argument
- Embedded in a larger expression
- Returned from a method

**Equivalence to if-else:**
\`\`\`java
// if-else version:
String label;
if (score >= 50) {
    label = "Pass";
} else {
    label = "Fail";
}

// Ternary version:
String label = score >= 50 ? "Pass" : "Fail";
\`\`\`

**Nested ternary:**
Ternary operators can be nested, but this quickly becomes unreadable.
\`\`\`java
// Hard to read — avoid:
String grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";

// Prefer if-else-if for multi-way decisions
\`\`\`
Java 14+ allows parentheses to make nesting clearer, but the standard advice is: avoid nesting beyond one level.

**Type rules:**
Both the true and false values must be of compatible types. The compiler finds a common type:
\`\`\`java
int a = 5;
double result = (a > 3) ? 1 : 2.0;  // 1 is widened to 1.0 — result is double
\`\`\``,
  code: `public class TernaryOperatorDemo {
    public static void main(String[] args) {

        // ===== Basic ternary =====
        int age = 20;
        String status = age >= 18 ? "Adult" : "Minor";
        System.out.println(status);  // Adult

        // ===== In print statement =====
        int score = 65;
        System.out.println("Result: " + (score >= 50 ? "Pass" : "Fail"));  // Pass

        // ===== Assigning numeric result =====
        int a = 10, b = 20;
        int max = (a > b) ? a : b;
        System.out.println("Max: " + max);  // 20

        int min = (a < b) ? a : b;
        System.out.println("Min: " + min);  // 10

        // ===== Absolute value =====
        int num = -42;
        int abs = (num >= 0) ? num : -num;
        System.out.println("Absolute value of -42: " + abs);  // 42

        // ===== In method call =====
        printStatus(score >= 50 ? "PASS" : "FAIL");

        // ===== Null-safe default =====
        String name = null;
        String displayName = (name != null) ? name : "Anonymous";
        System.out.println("Hello, " + displayName);  // Hello, Anonymous

        // ===== Nested ternary (readable limit = 1 level) =====
        int s = 75;
        // One level deep — still readable:
        String g1 = (s >= 90) ? "A" : (s >= 80) ? "B" : (s >= 70) ? "C" : "F";
        System.out.println("Grade: " + g1);  // C

        // Prefer if-else-if for more than 2 levels
        String g2;
        if      (s >= 90) g2 = "A";
        else if (s >= 80) g2 = "B";
        else if (s >= 70) g2 = "C";
        else              g2 = "F";
        System.out.println("Grade (clearer): " + g2);  // C

        // ===== In return statement =====
        System.out.println(isEven(8) ? "8 is even" : "8 is odd");
        System.out.println(isEven(7) ? "7 is even" : "7 is odd");
    }

    static boolean isEven(int n) {
        return n % 2 == 0;
    }

    static void printStatus(String s) {
        System.out.println("Status: " + s);
    }
}`,
  codeTitle: 'Ternary — Basic, Null Default, Nested',
  points: [
    'The ternary operator is an EXPRESSION (produces a value), not a statement. This means you cannot use it for void side-effects like System.out.println(). Use if-else for that. You can only ternary when both branches produce a value.',
    'The ternary operator is evaluated lazily: only one branch is evaluated, never both. This matters when both branches have side effects.',
    'Null-safe default value is a very common use: String s = (input != null) ? input : "default". In Java 9+ you can also use Objects.requireNonNullElse(input, "default").',
    'Both branches must be type-compatible. The compiler determines the result type by finding the most specific common type. If one branch is int and the other is double, the result is double.',
    'Do not nest ternary beyond one level. Deeply nested ternaries (condition1 ? a : condition2 ? b : condition3 ? c : d) are nearly unreadable. Switch to if-else-if for 3+ conditions.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'String result = condition ? "yes" : null; — this is valid but dangerous. If you later call result.toUpperCase() without a null check, you get NullPointerException whenever condition is false. Be explicit: prefer returning a default string like "no" instead of null in ternary expressions.',
    },
    {
      type: 'interview',
      content: 'Q: What is the ternary operator and how does it differ from if-else?\nA: The ternary operator (condition ? trueValue : falseValue) is an expression — it produces a value and can appear anywhere an expression is valid (assignments, method args, return statements). if-else is a statement — it controls execution flow but does not itself produce a value. For simple two-way value selection, ternary is more concise; for complex logic with multiple statements per branch, if-else is clearer.',
    },
    {
      type: 'tip',
      content: 'Use ternary for concise value selection in assignments, method arguments, and return statements. A good rule of thumb: if both branches are single values/expressions, ternary is appropriate. If either branch requires multiple lines, use if-else.',
    },
  ],
}
