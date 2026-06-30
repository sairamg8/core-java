export default {
  id: 'do-while-loop',
  title: '30. Do-While Loop',
  explanation: `The do-while loop is a post-test (exit-controlled) loop: it executes the body **first** and then checks the condition. This guarantees the body runs **at least once**, regardless of the condition.

**Syntax:**
\`\`\`java
do {
    // body
} while (condition);
\`\`\`

Note the **semicolon** after the closing parenthesis — this is mandatory and a common syntax mistake.

**Flow:**
1. Run body
2. Evaluate condition
3. If true → go back to step 1
4. If false → exit loop

**When to use do-while:**
- **Menu-driven programs** — show the menu first, then ask if the user wants to continue
- **Input validation loops** — read input at least once before checking validity
- **Games** — run the game at least once, then ask "play again?"
- Any situation where the action must happen before you can know if it should repeat

**do-while vs while:**

| | while | do-while |
|---|---|---|
| Condition checked | Before body | After body |
| Min executions | 0 | 1 |
| Use case | Count unknown, may skip | Must run at least once |`,
  code: `import java.util.Scanner;

public class DoWhileDemo {
    public static void main(String[] args) {
        // Basic do-while: always runs at least once
        int n = 0;
        do {
            System.out.println("n = " + n); // prints even though n == 0 (which is not > 0)
            n++;
        } while (n > 0 && n < 3);
        // Prints: 0, 1, 2

        // Menu-driven program
        Scanner sc = new Scanner(System.in);
        int choice;
        do {
            System.out.println("--- Menu ---");
            System.out.println("1. Say Hello");
            System.out.println("2. Exit");
            System.out.print("Enter choice: ");
            choice = sc.nextInt();
            if (choice == 1) {
                System.out.println("Hello!");
            }
        } while (choice != 2);
        System.out.println("Goodbye!");

        // Input validation: keep asking until positive
        int value;
        do {
            System.out.print("Enter a positive integer: ");
            value = sc.nextInt();
            if (value <= 0) {
                System.out.println("Invalid! Try again.");
            }
        } while (value <= 0);
        System.out.println("Accepted: " + value);

        sc.close();
    }
}`,
  codeTitle: 'Do-While Loop — Menu Program and Input Validation',
  points: [
    'do-while always executes its body at least once — the condition is checked after the body runs',
    'The semicolon after while (condition) is required — omitting it is a syntax error',
    'Best for menus, game loops, and input validation where the action must precede the condition check',
    'Functionally identical to while but with the guarantee of a minimum one execution',
    'Can always be rewritten as a while loop with the body duplicated before the loop, but do-while is cleaner',
    'Like all loops, ensure the update inside the body eventually makes the condition false to avoid an infinite loop',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting the semicolon at the end of while (condition); is the most common do-while syntax error. The compiler message will say something like "expected ;" — look right after the closing parenthesis of the condition.',
    },
    {
      type: 'tip',
      content: 'Menu programs are the textbook do-while use case: you must display the menu before the user can choose to exit. If the exit logic were in a while condition, you would need to duplicate the display code.',
    },
    {
      type: 'interview',
      content: 'Q: When would you choose do-while over while?\nA: Use do-while when the loop body must execute at least once before the condition makes sense — input validation and menus are classic examples. Otherwise prefer while (or for) for clarity.',
    },
  ],
}
