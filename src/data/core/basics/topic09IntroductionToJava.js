export default {
  id: 'introduction-to-java',
  title: '9. Introduction to Java',
  explanation: `**Java** is a general-purpose, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.

**The story of Java:**
- 1991: James Gosling at Sun Microsystems starts the "Green Project" to build software for consumer electronics
- 1995: Java 1.0 publicly released — initial motto was "Write Once, Run Anywhere"
- 2006: Sun open-sources Java as OpenJDK
- 2010: Oracle acquires Sun Microsystems, takes over Java stewardship
- 2017: Java switches to 6-month release cadence (a new version every 6 months)
- 2021–present: Java 17, 21 are LTS releases (Long-Term Support, ~8 years of patches)

**Core characteristics of Java:**

**Strongly typed** — every variable must declare its type. \`int x = 5\` tells the compiler x holds integers. You cannot put a String in x without explicit conversion. This catches type errors at compile time.

**Object-Oriented** — programs are built from classes and objects. Even primitive types have wrapper classes (Integer, Double). Everything that is not a primitive is an object.

**Automatic Memory Management** — the Garbage Collector (GC) automatically reclaims memory from objects that are no longer referenced. No manual malloc/free, no memory leaks from forgotten pointers.

**Multithreaded by design** — Java has thread support in the language itself (Thread class, Runnable, synchronized) and in the standard library (java.util.concurrent).

**Secure** — the JVM runs in a sandboxed environment. No direct memory access, array bounds checking, and bytecode verification prevent common security vulnerabilities.`,
  code: `// Java's key syntactic traits at a glance

public class JavaOverview {

    // Static main method: entry point for the JVM
    public static void main(String[] args) {

        // 1. Strong typing — types declared explicitly
        int age = 25;
        String name = "Alice";
        double salary = 75_000.50;  // underscores OK in numeric literals (Java 7+)
        boolean isActive = true;

        // 2. Case-sensitive language
        // int Age = 26; // 'age' and 'Age' are DIFFERENT variables

        // 3. Every statement ends with semicolon
        System.out.println(name + " is " + age + " years old.");

        // 4. String concatenation with + operator
        String greeting = "Hello, " + name + "!";
        System.out.println(greeting);

        // 5. Type inference with var (Java 10+)
        var message = "Inferred as String";
        System.out.println(message.getClass().getSimpleName()); // String
    }
}`,
  codeTitle: 'Java Syntax Overview',
  points: [
    'Java is case-sensitive: String, string, and STRING are three different identifiers. String (capital S) is the built-in class; string is just an invalid reference unless defined.',
    'Java has 53 reserved keywords — words like class, if, for, while that cannot be used as variable names. true, false, and null are literals, not keywords, but also cannot be used as names.',
    'Java is single-inheritance for classes but allows multiple interface implementation — a deliberate design choice to avoid the diamond inheritance problem.',
    'Java 10 introduced var (local variable type inference): var x = 5; — the compiler infers int. It does NOT make Java dynamically typed; the type is still fixed at compile time.',
    'Java Standard Library (java.lang, java.util, java.io, etc.) is enormous — ~4,000+ classes and interfaces. A large part of Java mastery is knowing what already exists.',
  ],
  callouts: [
    {
      type: 'note',
      content: 'Java versions: Java 8 (2014) added lambdas and streams — the biggest change in Java history. Java 17 (2021) and Java 21 (2023) are current LTS releases. For new projects, use Java 21. For interviews, be fluent in Java 8+ features.',
    },
    {
      type: 'interview',
      content: 'Q: What are the four pillars of OOP in Java?\nA: Encapsulation (bundling data + methods, controlling access via access modifiers), Inheritance (extending classes with "extends"), Polymorphism (same method name, different behavior via overriding/overloading), Abstraction (hiding implementation details via abstract classes and interfaces).',
    },
  ],
}
