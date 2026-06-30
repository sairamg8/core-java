export default {
  id: 'while-loop',
  title: '29. While Loop',
  explanation: `The while loop is a pre-test (entry-controlled) loop: it checks the condition **before** each iteration. If the condition is false the first time, the body never executes.

**Syntax:**
\`\`\`java
while (condition) {
    // body
}
\`\`\`

**Flow:**
1. Evaluate \`condition\`
2. If true → run body → go back to step 1
3. If false → exit loop

**When to use while:**
- When the number of iterations is **not known in advance**
- When you are waiting for an **external event** (user input, file end, network response)
- When the loop might legitimately run **zero times**

**Infinite loop with while:**
\`\`\`java
while (true) {
    // runs forever — only exit via break or return
}
\`\`\`
This pattern is used intentionally for event loops and server main loops, always with a \`break\` or \`return\` inside.

**Common mistakes:**
- Forgetting to update the loop variable → infinite loop
- Off-by-one: using \`<\` vs \`<=\` incorrectly
- Updating the variable inside an if-block that never executes`,
  code: `import java.util.Scanner;

public class WhileLoopDemo {
    public static void main(String[] args) {
        // Basic countdown
        int n = 5;
        while (n > 0) {
            System.out.println("Countdown: " + n);
            n--;  // without this, infinite loop!
        }
        System.out.println("Go!");

        // Sum digits of a number
        int number = 1234;
        int digitSum = 0;
        while (number > 0) {
            digitSum += number % 10;  // extract last digit
            number /= 10;             // remove last digit
        }
        System.out.println("Digit sum: " + digitSum); // 10

        // Input validation (runs until user enters a positive number)
        Scanner sc = new Scanner(System.in);
        int value = -1;
        while (value <= 0) {
            System.out.print("Enter a positive number: ");
            value = sc.nextInt();
        }
        System.out.println("You entered: " + value);

        // Event loop pattern (intentional infinite loop)
        int attempt = 0;
        while (true) {
            attempt++;
            if (attempt == 3) {
                System.out.println("Breaking at attempt " + attempt);
                break;
            }
        }
    }
}`,
  codeTitle: 'While Loop — Countdown, Digit Sum, Input Validation',
  points: [
    'while checks the condition before executing the body — if the condition is initially false, the body never runs (zero iterations)',
    'Requires manual initialization before the loop and a manual update inside the body to avoid an infinite loop',
    'Best for situations where you do not know the iteration count upfront — reading until end-of-file, waiting for user input, polling',
    'while (true) with a break inside is a legitimate pattern for game loops, server loops, and retries',
    'The loop variable must be modified in a way that eventually makes the condition false — always trace your update path',
    'Nested while loops are legal but increase complexity — each inner loop must manage its own counter independently',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The most common while-loop bug is forgetting to update the loop variable, causing an infinite loop. Always trace the variable from initialization through each iteration to confirm it moves toward the exit condition.',
    },
    {
      type: 'tip',
      content: 'If you need to ensure at least one execution, use do-while instead of while. If you know the exact count, use a for loop — it keeps init, condition, and update in one line and is harder to accidentally break.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a while loop and a for loop?\nA: Both can do the same work. while is preferred when the iteration count is unknown; for is preferred when iterating a fixed range because it keeps init, condition, and update in one line for clarity.',
    },
  ],
}
