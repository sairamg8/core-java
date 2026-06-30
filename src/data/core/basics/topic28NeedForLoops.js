export default {
  id: 'need-for-loops',
  title: '28. Need for Loops',
  explanation: `Loops allow you to repeat a block of code multiple times without writing it out manually. They are one of the most fundamental control-flow structures in any programming language.

**Why do we need loops?**

Imagine you need to print the numbers 1 through 1000. Without loops, you would write 1000 separate \`System.out.println\` statements. Loops let you express this in three lines:
\`\`\`java
for (int i = 1; i <= 1000; i++) {
    System.out.println(i);
}
\`\`\`

Loops are essential for:
- **Iterating over collections** — process every element in an array, list, or map
- **Repeating input validation** — keep asking until the user gives valid input
- **Performing accumulations** — sum a series, find a maximum, count occurrences
- **Searching** — scan through data until a condition is met
- **Driving algorithms** — sorting, matrix multiplication, graph traversal

**Three loop structures in Java:**

| Loop | Best used when |
|------|---------------|
| \`while\` | number of iterations unknown, condition checked first |
| \`do-while\` | body must execute at least once |
| \`for\` | number of iterations known, or iterating over a range/index |

Every loop has three logical parts: an **initialization** (set up the counter), a **condition** (keep going while true), and an **update** (advance toward termination). If the update never makes the condition false, you get an **infinite loop**.

**Loop control:**
- \`break\` — exit the loop immediately
- \`continue\` — skip the rest of the current iteration and go to the next one`,
  code: `public class LoopNeed {
    public static void main(String[] args) {
        // Without a loop — tedious and unscalable:
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);
        // ... imagine doing this 1000 times

        System.out.println("--- With a loop ---");

        // With a loop — clean and scalable:
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }

        // Accumulation: sum 1..100
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println("Sum 1-100 = " + sum); // 5050

        // Search: find first even number > 7
        int[] numbers = {3, 7, 2, 9, 12, 5};
        for (int n : numbers) {
            if (n > 7 && n % 2 == 0) {
                System.out.println("Found: " + n); // 12
                break;
            }
        }

        // Continue: skip odd numbers
        System.out.print("Even 1-10: ");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 != 0) continue;
            System.out.print(i + " ");
        }
        System.out.println();
    }
}`,
  codeTitle: 'Why Loops Are Essential',
  points: [
    'Loops let you repeat a block of code without duplicating it — they are the foundation of all repetitive computation',
    'Java has three loop types: while (condition-first), do-while (body-first), and for (counter-based)',
    'Every loop needs an init, a condition, and an update — missing the update is the most common cause of infinite loops',
    'break exits the loop immediately; continue skips the rest of the current iteration and moves to the next',
    'Enhanced for-each loop is the cleanest way to iterate over arrays and collections when you do not need the index',
    'Loops enable algorithms that would be impossible to write statically, like searching, sorting, and recursive aggregation',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'An infinite loop occurs when the loop condition never becomes false. Always ensure the update step drives the variable toward the termination condition.',
    },
    {
      type: 'tip',
      content: 'Use for loops when the iteration count is known in advance, while loops when you are waiting for an event or unknown number of iterations, and do-while when the body must run at least once (e.g., a menu prompt).',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between break and continue?\nA: break exits the entire loop immediately. continue skips the rest of the current iteration and jumps to the loop condition check for the next iteration.',
    },
  ],
}
