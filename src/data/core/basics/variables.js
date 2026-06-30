export default {
  id: 'variables',
  title: 'Variables & Scope',
  explanation: `A **variable** is a named storage location in memory that holds a value. In Java, every variable has:
1. A **type** (what kind of data it stores)
2. A **name** (identifier to reference it)
3. A **value** (the data stored)
4. A **scope** (where in the code it can be accessed)

**Three kinds of variables in Java:**
- **Local variables** — declared inside a method/block. Must be initialized before use. No default value. Destroyed when the method exits.
- **Instance variables** — declared inside a class, outside any method. Each object gets its own copy. Initialized to defaults (0, false, null).
- **Static (class) variables** — declared with \`static\` keyword. Shared across ALL instances of the class. Only one copy exists.`,
  code: `public class VariableDemo {

    // Instance variable — belongs to each object
    String name;           // default: null
    int    age;            // default: 0
    boolean active;        // default: false

    // Static variable — one copy shared by all objects
    static int count = 0;

    public VariableDemo(String name, int age) {
        // Local variable — scope is this constructor only
        String greeting = "Created: " + name;  // must initialize before use
        System.out.println(greeting);

        this.name = name;   // "this.name" = instance field; "name" = param
        this.age  = age;
        count++;            // increment shared counter
    }

    public void showScope() {
        int x = 10;          // local — lives only inside this method
        {
            int y = 20;      // block-scoped — only accessible in this block
            System.out.println(x + y);   // 30
        }
        // System.out.println(y);  // ERROR: y is out of scope here
        System.out.println(x);      // fine: x is still in scope
    }

    public static void main(String[] args) {
        VariableDemo a = new VariableDemo("Alice", 25);
        VariableDemo b = new VariableDemo("Bob", 30);

        System.out.println(a.name);    // "Alice"  (instance var)
        System.out.println(b.name);    // "Bob"    (instance var — separate copy)
        System.out.println(count);     // 2         (static var — shared)

        // int uninit;
        // System.out.println(uninit);  // COMPILE ERROR: variable might not have been initialized
    }
}`,
  codeTitle: 'VariableDemo.java',
  points: [
    'Local variables MUST be explicitly initialized before use — no default value. Instance/static variables get defaults.',
    'Variable shadowing: a local variable with the same name as an instance variable hides the instance variable. Use this.name to access the instance variable.',
    'Java uses camelCase for variables (firstName, totalCount). Constants use UPPER_SNAKE_CASE (MAX_SIZE).',
    'Variable names cannot start with a digit. They can start with a letter, dollar sign ($), or underscore (_) — though $ and _ are conventions for generated or special code.',
    'Scope is determined by curly braces {}. A variable declared inside a block {} is destroyed when that block ends.',
  ],
  table: {
    headers: ['Type', 'Where Declared', 'Default Value', 'Lifetime'],
    rows: [
      ['Local', 'Inside method/block', 'None (must init)', 'Until method/block exits'],
      ['Instance', 'Inside class, outside methods', '0 / false / null', 'As long as object lives'],
      ['Static', 'Inside class, with static keyword', '0 / false / null', 'Entire program lifetime'],
    ],
  },
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between a local variable and an instance variable?\nA: Local variables are declared inside a method and have no default value — the compiler forces you to initialize them. Instance variables are declared in the class body and get default values (0, false, null). Local variables live on the stack; instance variables live on the heap with their object.',
    },
    {
      type: 'gotcha',
      content: 'int x; System.out.println(x); — This is a COMPILE ERROR, not a runtime error. The compiler detects uninitialized local variables before the code ever runs. This is one of Java\'s safety features that prevents bugs that C/C++ programmers often encounter.',
    },
    {
      type: 'tip',
      content: 'Always declare variables as close to their first use as possible. This limits scope and makes code easier to read. A variable declared at the top of a long method but used only at the bottom is a sign the code can be refactored.',
    },
  ],
}
