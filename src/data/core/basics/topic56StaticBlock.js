export default {
  id: 'static-block',
  title: '56. Static Block',
  explanation: `A **static initializer block** (static block) is a block of code that runs **once** when the class is first loaded by the JVM, before any instance is created and before any static methods are called.

**Syntax:**
\`\`\`java
class MyClass {
    static int x;
    static {
        // runs once at class load
        x = computeExpensiveThing();
    }
}
\`\`\`

**When does it run?**
Exactly once, when the class is **first referenced** by the JVM (class loading trigger):
- First \`new MyClass()\`
- First access to a static field/method
- Explicit \`Class.forName("MyClass")\`

**Order of execution:**
1. Static variables (in declaration order)
2. Static blocks (in declaration order)
3. Instance variables (when object created)
4. Instance initializer blocks
5. Constructor body

**Use cases:**
- Initialize static collections that require multiple statements
- Load configuration from a file/properties
- Load a native library (System.loadLibrary)
- Perform validation that is too complex for a field initializer

\`\`\`java
static final Map<String, Integer> CODES;
static {
    CODES = new HashMap<>();
    CODES.put("US", 1);
    CODES.put("UK", 44);
}
\`\`\``,
  code: `import java.util.*;

public class StaticBlock {
    // Static variable initialized in declaration
    static int x = 10;

    // Static block: runs after static variable declarations
    static {
        System.out.println("Static block 1 — x = " + x); // 10
        x = 20;
    }

    static int y = x * 2; // y = 40 (x is now 20)

    static {
        System.out.println("Static block 2 — y = " + y); // 40
    }

    public static void main(String[] args) {
        System.out.println("main() — x = " + x + ", y = " + y);

        // Static block already ran; creating instances does not re-run it
        Config c1 = new Config();
        Config c2 = new Config(); // static block NOT called again
    }
}

class Config {
    static final Map<String, String> SETTINGS;
    static int instanceCount = 0;

    // Complex static initialization
    static {
        System.out.println("Config class loaded — static block runs once");
        SETTINGS = new HashMap<>();
        SETTINGS.put("host", "localhost");
        SETTINGS.put("port", "8080");
        SETTINGS.put("timeout", "30");
        System.out.println("Loaded " + SETTINGS.size() + " settings");
    }

    // Instance initializer block (NOT static): runs for each object
    {
        instanceCount++;
        System.out.println("Instance #" + instanceCount + " created");
    }

    Config() { /* constructor after instance init block */ }
}`,
  codeTitle: 'Static Block — Initialization Order and Config Loading',
  points: [
    'A static block runs exactly once, the first time the class is loaded — not per-object, not per-method-call',
    'Multiple static blocks in a class run in top-to-bottom order at class load time',
    'Static variables and blocks are processed before any instance is created, so they can safely reference each other in declaration order',
    'The most common use case is initializing static final collections that require multiple put() or add() calls',
    'Instance initializer blocks (without static) run for every new object, just before the constructor body',
    'System.loadLibrary() for JNI native libraries is always placed in a static block',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Static blocks can throw checked exceptions ONLY if the class declares static initialization errors — in practice, exceptions in static blocks become ExceptionInInitializerError, which is hard to debug. Prefer factory methods or lazy initialization for risky setup.',
    },
    {
      type: 'tip',
      content: 'For complex initialization of static final Maps, use a static block. The pattern static { SETTINGS = new HashMap<>(); SETTINGS.put(...); } is idiomatic Java. Java 9+ offers Map.of() as a cleaner alternative for small immutable maps.',
    },
    {
      type: 'interview',
      content: 'Q: When does a static block execute?\nA: Exactly once, when the class is first loaded by the JVM — triggered by the first new, first static field/method access, or Class.forName(). It runs before any constructor or static method call.',
    },
  ],
}
