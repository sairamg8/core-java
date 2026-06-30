export default {
  id: 'variables',
  title: '17. Variables',
  explanation: `A variable is a named container in memory that holds a value which can change during program execution. Java is a statically typed language, meaning every variable must be declared with a type before use.

**Variable declaration and initialization:**

\`\`\`
type variableName;          // declaration (default value assigned)
type variableName = value;  // declaration + initialization
\`\`\`

**Three categories of variables in Java:**

1. **Local variables** — declared inside a method, constructor, or block. No default value; must be initialized before use. Destroyed when the block exits.
2. **Instance variables (fields)** — declared inside a class but outside any method. Each object gets its own copy. Initialized to default values automatically.
3. **Class variables (static fields)** — declared with the \`static\` keyword. Shared across all instances of the class. One copy per class.

**Naming rules (mandatory):**
- Can contain letters, digits, \`_\`, and \`$\`
- Cannot start with a digit
- Cannot be a Java keyword (\`int\`, \`class\`, \`public\`, etc.)
- Case-sensitive: \`count\` and \`Count\` are different variables

**Naming conventions (by agreement):**
- Use camelCase: \`totalAmount\`, \`studentName\`
- Constants use UPPER_SNAKE_CASE: \`MAX_SIZE\`

**Local variable type inference (Java 10+):**
The \`var\` keyword lets the compiler infer the type. Only works for local variables with an initializer.

\`\`\`java
var count = 10;       // inferred as int
var name = "Alice";   // inferred as String
\`\`\``,
  code: `public class VariablesDemo {

    // Instance variable (field) — has default value
    int instanceCount;         // default: 0

    // Class variable (static field)
    static String appName = "JavaApp";

    public static void main(String[] args) {

        // Local variables — MUST be initialized before use
        int age = 25;
        double salary = 75000.50;
        char grade = 'A';
        boolean isEmployed = true;
        String name = "Alice";

        System.out.println("Name: " + name + ", Age: " + age);
        System.out.println("Salary: " + salary + ", Grade: " + grade);
        System.out.println("Employed: " + isEmployed);

        // Multiple declaration (same type)
        int x = 1, y = 2, z = 3;
        System.out.println("x=" + x + " y=" + y + " z=" + z);

        // Re-assignment (variable is NOT final)
        age = 26;
        System.out.println("Updated age: " + age);

        // var — local type inference (Java 10+)
        var pi = 3.14159;       // double
        var message = "Hello";  // String
        System.out.println(message + " Pi=" + pi);

        // Constant (final — value cannot change)
        final int MAX_RETRIES = 3;
        // MAX_RETRIES = 4;  // compile error: cannot assign to final variable
        System.out.println("Max retries: " + MAX_RETRIES);
    }
}`,
  codeTitle: 'Variables — All Kinds in One Class',
  points: [
    'Local variables have NO default value in Java. Trying to use an uninitialized local variable causes a compile-time error: "variable X might not have been initialized". This is different from instance variables, which get a zero/null/false default.',
    'var (Java 10+) is NOT a type — it is a hint to the compiler to infer the type. var count = 10 is exactly int count = 10 after inference. You cannot do var x; (no initializer) or var x = null; (ambiguous type).',
    'A variable declared with final cannot be reassigned. For primitives, this means the value is constant. For objects, final means the reference cannot point to a different object, but the object itself can still be mutated.',
    'Java identifiers can start with $ or _ (legal but avoid them — $ is used by generated code, _ is a reserved keyword in Java 9+).',
    'Instance variables vs local variables: fields are initialized to defaults (0, 0.0, false, null) automatically by the JVM. Local variables in methods are never initialized automatically — the compiler enforces explicit initialization.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'int value; System.out.println(value); — this does NOT compile. Local variables must be initialized before reading. Beginners often assume 0 is the default like in other languages, but the Java compiler rejects this at compile time, not runtime.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a local variable, instance variable, and static variable?\nA: Local variables exist inside a method/block, are stack-allocated, have no default, and die when the block exits. Instance variables are per-object fields stored on the heap with automatic defaults (0/false/null). Static variables are class-level, stored in the method area (Metaspace in Java 8+), shared across all instances, and initialized when the class is loaded.',
    },
    {
      type: 'tip',
      content: 'Declare variables as close to their first use as possible. This reduces scope, makes the code easier to read, and lets the compiler catch use-before-initialization errors earlier.',
    },
  ],
}
