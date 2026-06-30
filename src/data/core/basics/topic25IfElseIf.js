export default {
  id: 'if-else-if',
  title: '25. If-Else-If',
  explanation: `The if-else-if ladder lets you test multiple conditions in sequence. Java evaluates them from top to bottom and executes the first block whose condition is true. All remaining blocks are skipped.

**Syntax:**
\`\`\`java
if (condition1) {
    // runs if condition1 is true
} else if (condition2) {
    // runs if condition1 is false AND condition2 is true
} else if (condition3) {
    // runs if both above are false AND condition3 is true
} else {
    // runs if ALL conditions are false (optional catch-all)
}
\`\`\`

**Key behaviors:**
1. **Exactly one block runs** (or none if no else and nothing matches)
2. Conditions are evaluated in order — the first match wins
3. The final \`else\` is a catch-all; it is optional
4. Once a condition matches, the remaining conditions are not evaluated

**Order matters:**
Place the most specific conditions first and the most general last.
\`\`\`java
// WRONG order — "A" can never match because >= 60 catches it first
if (score >= 60) grade = "C";
else if (score >= 90) grade = "A";  // unreachable!

// CORRECT order — most specific first
if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 60) grade = "C";
else grade = "F";
\`\`\`

**if-else-if vs switch:**
- Use **if-else-if** when conditions involve ranges, inequalities, or complex boolean expressions
- Use **switch** when testing a single variable against specific discrete values (int, char, String, enum)

**Ternary alternative for simple two-branch logic:**
\`\`\`java
String status = age >= 18 ? "Adult" : "Minor";
\`\`\``,
  code: `public class IfElseIfDemo {
    public static void main(String[] args) {

        // ===== Grade calculator =====
        int score = 78;
        String grade;

        if (score >= 90) {
            grade = "A";
        } else if (score >= 80) {
            grade = "B";
        } else if (score >= 70) {
            grade = "C";   // matches here
        } else if (score >= 60) {
            grade = "D";
        } else {
            grade = "F";
        }
        System.out.println("Score " + score + " → Grade: " + grade);

        // ===== Time of day greeting =====
        int hour = 14;  // 2 PM
        String greeting;

        if (hour >= 5 && hour < 12) {
            greeting = "Good morning";
        } else if (hour >= 12 && hour < 17) {
            greeting = "Good afternoon";  // matches
        } else if (hour >= 17 && hour < 21) {
            greeting = "Good evening";
        } else {
            greeting = "Good night";
        }
        System.out.println("At hour " + hour + ": " + greeting);

        // ===== Range categorizer =====
        int bmi = 27;
        String category;

        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 25.0) {
            category = "Normal";
        } else if (bmi < 30.0) {
            category = "Overweight";  // matches
        } else {
            category = "Obese";
        }
        System.out.println("BMI " + bmi + " → " + category);

        // ===== String-based condition =====
        String day = "SATURDAY";
        String type;

        if (day.equals("SATURDAY") || day.equals("SUNDAY")) {
            type = "Weekend";  // matches
        } else if (day.equals("MONDAY") || day.equals("FRIDAY")) {
            type = "Near-weekend";
        } else {
            type = "Midweek";
        }
        System.out.println(day + " is: " + type);

        // ===== Demonstrating that only first match runs =====
        int num = 100;
        if (num > 10)  {
            System.out.println("Greater than 10");  // runs (first match)
        } else if (num > 50) {
            System.out.println("Greater than 50");  // SKIPPED — already matched
        } else if (num > 90) {
            System.out.println("Greater than 90");  // SKIPPED — already matched
        }
        // Lesson: order your conditions most-specific first!
    }
}`,
  codeTitle: 'If-Else-If Ladder — Grade, Time, Ranges',
  points: [
    'Only the first matching branch executes. Once a match is found, all subsequent else-if and else blocks are skipped. This is different from writing multiple independent if statements, where each condition is evaluated.',
    'Order is critical with ranges. In a >= ladder for grades, always put the highest threshold first (>= 90 for A) and descend. If you put >= 60 (C) first, no score will ever reach the >= 90 (A) check.',
    'The else block is optional but important. Without it, if no conditions match, nothing happens — which may be a logic bug if you expected at least one branch to always run.',
    'if-else-if is for ranges and complex conditions. When you have more than 3-4 conditions testing the same variable against fixed values, consider a switch statement — it is more readable and the compiler can optimize it as a jump table.',
    'Multiple independent if statements evaluate ALL conditions. An if-else-if ladder evaluates conditions until the first match. Use if-else-if when the conditions are mutually exclusive alternatives.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'if (score >= 60) { grade = "C"; } if (score >= 90) { grade = "A"; } — using two separate ifs (not else-if) means BOTH conditions are checked. A score of 95 would first set grade to "C", then overwrite it to "A". This may be the intended behavior sometimes, but usually you want if-else-if to make the conditions mutually exclusive.',
    },
    {
      type: 'interview',
      content: 'Q: When should you use if-else-if instead of switch?\nA: Use if-else-if when: (1) conditions involve ranges or inequalities (score >= 90), (2) conditions are complex boolean expressions, (3) you are comparing against null or non-constants. Use switch when: testing a single variable against multiple fixed values (int, String, char, enum), especially when there are many values — switch is more readable and may be compiled to a faster jump table.',
    },
    {
      type: 'tip',
      content: 'Extract complex conditions into named boolean variables before the ladder. boolean isExcellent = score >= 90 && attendance >= 80; makes the if condition self-documenting and easier to test independently.',
    },
  ],
}
