export default {
  id: 'control-flow',
  title: '5. Control Flow',
  explanation: `Java supports traditional if-else, switch statements, loops, and modern switch expressions (Java 14+). Knowing the switch fall-through behavior and labeled breaks is important for interviews.`,
  code: `// Switch statement — FALL-THROUGH danger
int day = 3;
switch (day) {
    case 1: System.out.println("Mon"); break;  // break prevents fall-through
    case 2: System.out.println("Tue"); break;
    case 3:                                    // intentional fall-through
    case 4: System.out.println("Wed or Thu"); break;
    default: System.out.println("Other");
}

// Switch expression (Java 14+) — no fall-through, returns a value
String name = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3, 4 -> "Midweek";  // multiple labels
    default -> {
        System.out.println("Computing...");
        yield "Weekend";   // yield returns value from block
    }
};

// for-each
int[] nums = {1, 2, 3, 4, 5};
for (int n : nums) System.out.print(n + " ");

// do-while — guaranteed to execute AT LEAST once
int i = 10;
do {
    System.out.println(i);
} while (i < 5);    // prints 10, then condition fails — exits

// Labeled break — exits named outer loop
outer:
for (int row = 0; row < 3; row++) {
    for (int col = 0; col < 3; col++) {
        if (row == 1 && col == 1) break outer;  // exits BOTH loops
        System.out.println(row + "," + col);
    }
}`,
  points: [
    'switch works with: byte, short, int, char, String (Java 7+), enum. NOT with long, float, double, boolean',
    'Switch expression (Java 14) uses -> syntax and requires exhaustive cases (default mandatory for non-enum)',
    'yield is the keyword to return a value from a switch expression block (replaces return inside switch)',
    'Labeled break/continue work with any labeled statement, not just nested loops',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Forgetting break in a switch case causes fall-through — execution falls into the NEXT case body. This is intentional behavior but often a bug. Switch expressions (Java 14+) eliminate this entirely.',
    },
    {
      type: 'interview',
      content: 'Q: Difference between while and do-while?\nA: while checks condition BEFORE executing body (may never run). do-while checks AFTER body executes — guaranteed to run at least once. Use do-while for input validation loops.',
    },
  ],
}
