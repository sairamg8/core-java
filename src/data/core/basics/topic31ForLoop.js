export default {
  id: 'for-loop',
  title: '31. For Loop',
  explanation: `The for loop is the most commonly used loop in Java when the number of iterations is known in advance. It compacts initialization, condition, and update into a single line, making loops easier to read and less prone to "forgot to update" bugs.

**Syntax:**
\`\`\`java
for (initialization; condition; update) {
    // body
}
\`\`\`

All three parts are optional (though the semicolons are not):
\`\`\`java
for (;;) { }  // infinite loop — same as while (true)
\`\`\`

**Flow:**
1. Execute initialization (once, at the start)
2. Evaluate condition → if false, exit
3. Run body
4. Execute update
5. Go to step 2

**Enhanced for-each loop:**
For iterating over arrays and collections without an index:
\`\`\`java
int[] arr = {10, 20, 30};
for (int x : arr) {
    System.out.println(x);
}
\`\`\`
The enhanced for cannot modify the array (changing \`x\` does not change \`arr[i]\`) and cannot iterate backwards.

**Nested for loops:**
Used for 2D structures (matrices, grids, multiplication tables). Each inner-loop iteration runs \`innerCount\` times per outer iteration, giving O(n²) total iterations for equal sizes.

**Multiple variables:**
The initialization and update can contain multiple statements separated by commas:
\`\`\`java
for (int i = 0, j = 10; i < j; i++, j--) { }
\`\`\``,
  code: `public class ForLoopDemo {
    public static void main(String[] args) {
        // Basic for loop: 1 to 5
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }
        System.out.println(); // 1 2 3 4 5

        // Count down
        for (int i = 5; i >= 1; i--) {
            System.out.print(i + " ");
        }
        System.out.println(); // 5 4 3 2 1

        // Sum array with index
        int[] scores = {85, 90, 78, 92, 88};
        int total = 0;
        for (int i = 0; i < scores.length; i++) {
            total += scores[i];
        }
        System.out.println("Average: " + (total / scores.length)); // 86

        // Enhanced for-each
        for (int score : scores) {
            System.out.print(score + " ");
        }
        System.out.println();

        // Nested loops: multiplication table
        for (int row = 1; row <= 3; row++) {
            for (int col = 1; col <= 3; col++) {
                System.out.printf("%4d", row * col);
            }
            System.out.println();
        }

        // Multiple variables in one for
        for (int i = 0, j = 10; i < j; i++, j--) {
            System.out.println("i=" + i + " j=" + j);
        }

        // Step by 2
        for (int i = 0; i <= 10; i += 2) {
            System.out.print(i + " "); // 0 2 4 6 8 10
        }
        System.out.println();
    }
}`,
  codeTitle: 'For Loop — Basic, Enhanced, Nested, and Multi-variable',
  points: [
    'for keeps init, condition, and update in one line — it is harder to accidentally forget the update than in a while loop',
    'The initialization runs exactly once; the condition is checked before each iteration; the update runs after each body execution',
    'for (int x : collection) is the enhanced for-each — cleaner for simple iteration but provides no index and cannot modify the source array',
    'All three parts of the for header are optional; for (;;) is the idiomatic infinite loop',
    'Nested for loops are standard for 2D arrays and matrix operations; remember inner-loop variables are scoped to each outer iteration',
    'Multiple variables can appear in the init and update sections using comma separation, but keep it readable',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In enhanced for-each, assigning to the loop variable (x = newValue) does NOT modify the original array or collection — it only rebinds the local variable. Use a classic indexed for loop when you need to mutate elements.',
    },
    {
      type: 'tip',
      content: 'Use the enhanced for-each whenever you do not need the index or backward iteration — it is shorter, eliminates off-by-one errors, and works uniformly with all Iterable types (arrays, lists, sets).',
    },
    {
      type: 'interview',
      content: 'Q: What is the scope of a variable declared in the for-loop initialization?\nA: It is scoped to the for block — the variable is not accessible after the closing brace. Declare it outside the for header if you need its value after the loop.',
    },
  ],
}
