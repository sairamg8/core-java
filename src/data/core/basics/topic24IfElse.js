export default {
  id: 'if-else',
  title: '24. If Else',
  explanation: `The \`if-else\` statement is the most fundamental control flow construct. It lets your program make decisions and execute different code depending on whether a condition is true or false.

**Syntax forms:**

\`\`\`java
// 1. if only
if (condition) {
    // runs when condition is true
}

// 2. if-else
if (condition) {
    // runs when true
} else {
    // runs when false
}

// 3. Nested if
if (outer) {
    if (inner) {
        // both true
    }
}
\`\`\`

**The condition must be a boolean expression.** Unlike C/C++, Java does not treat 0 as false or non-zero as true. \`if (1)\` is a compile error.

**Braces are optional for single-statement bodies — but always use them:**
\`\`\`java
// Legal but dangerous:
if (x > 0)
    doSomething();    // if body (no braces)
doAlways();          // NOT part of if — always runs

// Safe and clear:
if (x > 0) {
    doSomething();
}
doAlways();
\`\`\`

**Dangling else problem:**
When braces are omitted, the \`else\` attaches to the nearest \`if\`.
\`\`\`java
if (a > 0)
    if (b > 0)
        System.out.println("both positive");
else                // attaches to inner if, not outer!
    System.out.println("b is not positive");
\`\`\`
Always use braces to avoid this ambiguity.

**Evaluating objects in conditions:**
You cannot use objects directly in an \`if\` condition in Java (unlike Python/JavaScript). Conditions must resolve to \`boolean\`:
\`\`\`java
String name = "Alice";
if (name)        // COMPILE ERROR — not a boolean
if (name != null) // correct
\`\`\``,
  code: `public class IfElseDemo {
    public static void main(String[] args) {

        // ===== Basic if =====
        int temperature = 35;
        if (temperature > 30) {
            System.out.println("It is hot today");  // runs
        }

        // ===== if-else =====
        int age = 17;
        if (age >= 18) {
            System.out.println("Adult — can vote");
        } else {
            System.out.println("Minor — cannot vote");  // runs
        }

        // ===== Nested if =====
        int score = 82;
        if (score >= 60) {
            System.out.println("Passed");
            if (score >= 90) {
                System.out.println("Distinction!");
            } else if (score >= 80) {
                System.out.println("Merit");          // runs
            }
        } else {
            System.out.println("Failed");
        }

        // ===== String null check pattern =====
        String name = null;
        if (name != null) {
            System.out.println("Hello, " + name);
        } else {
            System.out.println("Name is missing");  // runs
        }

        // ===== Boolean variable condition =====
        boolean isLoggedIn = true;
        if (isLoggedIn) {               // no need for == true
            System.out.println("Welcome back!");
        }
        if (!isLoggedIn) {
            System.out.println("Please log in");
        }

        // ===== Dangling else — why braces matter =====
        int x = -1, y = 5;
        // Without braces — ambiguous:
        if (x > 0)
            if (y > 0)
                System.out.println("Both positive");
            else                  // this else belongs to inner if, not outer
                System.out.println("y is not positive");

        // With braces — clear intent:
        if (x > 0) {
            if (y > 0) {
                System.out.println("Both positive");
            }
        } else {                  // now clearly the else for outer if
            System.out.println("x is not positive");  // runs
        }

        // ===== Complex condition in if =====
        int hour = 14;
        if (hour >= 9 && hour < 17) {
            System.out.println("Business hours");  // runs
        } else {
            System.out.println("Outside business hours");
        }
    }
}`,
  codeTitle: 'if-else — Nesting, Dangling Else, Null Check',
  points: [
    'Java requires the if condition to be a boolean expression — not an integer, not a String, not an object. if (0) and if (myObject) are compile errors. This is stricter than C/C++ and intentional.',
    'Always use curly braces {} even for single-line bodies. The no-braces form is legal but causes the most common beginner bugs: adding a second statement that you think is inside the if but is actually outside it.',
    'The dangling else ambiguity: else always attaches to the nearest if. Without braces, nested ifs create silent logic bugs that are hard to spot. The only defense is consistent use of braces.',
    'You should never write if (flag == true). Just write if (flag). Similarly, if (flag == false) should be if (!flag). The == true/false pattern is redundant and less readable.',
    'For checking if an object is not null before calling methods on it, the pattern is: if (obj != null && obj.method()). The short-circuit && ensures obj.method() is never called when obj is null.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'if (x = 5) — single equals is ASSIGNMENT, not comparison. Java catches this at compile time: "incompatible types: int cannot be converted to boolean". But if (b = true) where b is boolean compiles and always executes the body (b is assigned true, and the expression evaluates to true). Use == for comparison, = for assignment.',
    },
    {
      type: 'interview',
      content: 'Q: What is the dangling else problem and how does Java resolve it?\nA: When if-else blocks lack braces, an else clause is ambiguous — it could belong to the outer or inner if. Java resolves it by always matching else to the nearest preceding if. This means the behavior may differ from programmer intent. The solution: always use braces, making the structure unambiguous regardless of compiler rules.',
    },
    {
      type: 'tip',
      content: 'Prefer positive conditions: if (isActive) over if (!isInactive). Negative conditions (not not-flag) require double mental negation and are harder to read. When you find yourself writing if (!notAvailable), rename the variable to isAvailable and use if (isAvailable).',
    },
  ],
}
