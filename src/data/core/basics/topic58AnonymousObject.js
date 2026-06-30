export default {
  id: 'anonymous-object',
  title: '58. Anonymous Object',
  explanation: `An **anonymous object** is an object that is created and used **without being assigned to a named variable**. The object is created, used immediately, and then becomes eligible for garbage collection.

**Syntax:**
\`\`\`java
new ClassName().method(); // create and use in one expression
\`\`\`

vs. named object:
\`\`\`java
ClassName obj = new ClassName();
obj.method();
\`\`\`

**When to use anonymous objects:**
- When you need to call only **one method** on an object and never refer to it again
- When passing an object as an **argument** to a method
- To keep code concise and avoid creating unnecessary local variables
- Test/demo code where brevity matters

**Limitations:**
- Cannot call more than one operation (you have no reference to chain calls)
- Cannot pass to multiple method calls
- Garbage collected immediately after the expression completes

**Anonymous objects vs anonymous classes:**
- Anonymous object: an instance of a named class, just without a variable
- Anonymous class: a one-off implementation of an interface or abstract class, defined inline

\`\`\`java
// Anonymous object of a named class
new Car("Toyota").drive();

// Anonymous class (different concept — implements interface inline)
Runnable r = new Runnable() { public void run() { ... } };
\`\`\``,
  code: `public class AnonymousObject {
    public static void main(String[] args) {
        // Named object: reference stored, reusable
        Calculator named = new Calculator();
        named.add(5, 3);
        named.multiply(5, 3);

        // Anonymous objects: one-off, no variable
        new Calculator().add(10, 20);      // use once, GC'd immediately
        new Calculator().multiply(4, 7);   // another new object

        // Anonymous object passed as method argument
        processCalc(new Calculator());

        // Useful in test code: chain one method call
        System.out.println(new StringBuilder("hello").reverse().toString());

        // Common in Android/Swing event handling
        // button.setOnClickListener(new View.OnClickListener() { ... });

        // Modern equivalent with lambda (Java 8+)
        // button.setOnClickListener(v -> doSomething());
    }

    static void processCalc(Calculator c) {
        c.add(100, 200);
    }
}

class Calculator {
    int add(int a, int b) {
        int result = a + b;
        System.out.println(a + " + " + b + " = " + result);
        return result;
    }

    int multiply(int a, int b) {
        int result = a * b;
        System.out.println(a + " × " + b + " = " + result);
        return result;
    }
}`,
  codeTitle: 'Anonymous Objects — One-Off Usage Pattern',
  points: [
    'An anonymous object has no variable holding it — created, used in one expression, then eligible for GC',
    'Use anonymous objects only when you need to invoke exactly one operation on the new instance',
    'They clean up code by eliminating a named variable that is only used once immediately after declaration',
    'Not the same as anonymous classes — anonymous objects are instances of normal named classes, just without a reference variable',
    'Common in pre-lambda code for passing simple Runnable, Comparator, or listener implementations',
    'Modern Java (Java 8+) replaces many anonymous class patterns with lambdas — but anonymous objects of named classes remain relevant',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Anonymous objects are most useful as method arguments: processCalc(new Calculator()). This is shorter and clearer than creating a named variable just to pass it once.',
    },
    {
      type: 'gotcha',
      content: 'Do not chain multiple calls on an anonymous object if you need all results — you have no reference after the first call. Create a named variable if you need to call more than one method.',
    },
    {
      type: 'interview',
      content: 'Q: What is an anonymous object in Java?\nA: An object created with new without assigning it to a variable. new Calculator().add(1, 2) creates a Calculator, calls add, and the object immediately becomes GC-eligible since no reference holds it. Useful for one-off single-method calls.',
    },
  ],
}
