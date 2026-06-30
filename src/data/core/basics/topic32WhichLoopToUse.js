export default {
  id: 'which-loop-to-use',
  title: '32. Which Loop to Use',
  explanation: `Java has three loop types and one enhanced for-each. Choosing the right one makes code clearer and less error-prone. Here is the decision framework:

**for loop**
Use when:
- The number of iterations is **known in advance** (loop over a range, array, fixed count)
- You need the **index** to access or modify elements
- The init, condition, and update are tightly coupled

**while loop**
Use when:
- The number of iterations is **not known in advance**
- You are **waiting for a condition** driven by external input or event
- The loop might legitimately run **zero times**

**do-while loop**
Use when:
- The body **must execute at least once** before the condition is checked
- Classic use case: menu programs and input-validation prompts

**Enhanced for-each**
Use when:
- You want to iterate over **every element** of an array or Collection
- You do NOT need the index or backward traversal
- You are NOT modifying the elements in place

**Quick comparison:**

| Situation | Best loop |
|-----------|-----------|
| Print 1 to 100 | for |
| Read lines until EOF | while |
| Show menu, repeat until "Exit" | do-while |
| Process all items in a List | enhanced for |
| Find first match and stop | for + break (or while) |
| Keep asking for valid input | do-while or while |
| Nested iteration over 2D array | nested for |

**Common pitfall:** Developers default to for for everything. Use the loop whose semantics match the intent — it signals to the reader exactly what the loop is doing.`,
  code: `import java.util.List;
import java.util.Scanner;

public class WhichLoop {
    public static void main(String[] args) {
        // FOR: known count
        System.out.println("Squares 1-5:");
        for (int i = 1; i <= 5; i++) {
            System.out.print(i * i + " ");
        }
        System.out.println();

        // ENHANCED FOR: iterate all elements
        List<String> names = List.of("Alice", "Bob", "Charlie");
        System.out.println("Names:");
        for (String name : names) {
            System.out.println("  " + name);
        }

        // WHILE: unknown count (Collatz sequence)
        int x = 27;
        int steps = 0;
        while (x != 1) {
            x = (x % 2 == 0) ? x / 2 : 3 * x + 1;
            steps++;
        }
        System.out.println("Collatz steps from 27: " + steps); // 111

        // DO-WHILE: must run at least once (menu)
        Scanner sc = new Scanner(System.in);
        int choice;
        do {
            System.out.print("Enter 0 to exit, 1 to continue: ");
            choice = sc.nextInt();
            System.out.println("You chose: " + choice);
        } while (choice != 0);

        sc.close();
    }
}`,
  codeTitle: 'Choosing the Right Loop',
  points: [
    'Use for when iteration count is known; while when unknown; do-while when at least one execution is guaranteed; enhanced for when you just want all elements',
    'Enhanced for-each is the cleanest option for collections — prefer it unless you need the index, backward iteration, or mutation',
    'do-while is the correct choice for menu programs because the menu must appear before you can determine whether to loop',
    'while (true) + break is acceptable for event loops or retry logic where the exit condition is complex and in the middle of the body',
    'Nesting different loop types is perfectly valid — combine for and while freely when logic requires it',
    'Readability is the deciding factor: the chosen loop type should signal the intent to the next developer reading the code',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'A good rule of thumb: if you can write the loop as an enhanced for-each, do it. If you need an index, use a classic for. If you are waiting on a condition, use while. If the body must run first, use do-while.',
    },
    {
      type: 'gotcha',
      content: 'Defaulting to for loops for everything is a code-smell. Using while or do-while where they apply communicates the intent more clearly and reduces the chance of initialization and update bugs.',
    },
    {
      type: 'interview',
      content: 'Q: Can you always replace a do-while with a while loop?\nA: Yes — copy the loop body before the while condition. But do-while is more concise and expresses the intent (run-then-check) more clearly in cases like menu-driven programs.',
    },
  ],
}
