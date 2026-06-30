export default {
  id: 'method-overloading',
  title: '37. Method Overloading',
  explanation: `**Method overloading** allows multiple methods in the same class to share the same name, as long as their **parameter lists differ** (number of parameters, types of parameters, or both). The compiler determines which version to call at **compile time** based on the arguments — this is called **static polymorphism** or **compile-time polymorphism**.

**Legal overloading differences:**
- Different number of parameters
- Different types of parameters
- Different order of parameter types

**NOT overloading:**
- Different return type only (compiler error — return type is not part of the method signature)
- Different access modifier only

**Why overload?**
- Convenience: \`print(int)\`, \`print(double)\`, \`print(String)\` all have the same intuitive name
- Cleaner API: callers use the same method name regardless of type; the compiler picks the right one
- Real-world example: \`System.out.println\` is overloaded for every primitive type and String

**Resolution rules (compiler picks the most specific match):**
1. Exact type match
2. Widening conversion (e.g., \`int\` → \`long\` → \`float\` → \`double\`)
3. Autoboxing
4. Varargs (last resort)

**Overloading vs Overriding:**
- Overloading = same class, same name, different parameters (compile-time)
- Overriding = subclass, same name, same parameters (runtime polymorphism)`,
  code: `public class MethodOverloading {
    // Overloaded: different number of parameters
    static int add(int a, int b)           { return a + b; }
    static int add(int a, int b, int c)    { return a + b + c; }

    // Overloaded: different parameter types
    static double add(double a, double b)  { return a + b; }
    static String add(String a, String b)  { return a + b; }  // concatenation

    // Overloaded: different order of types
    static void display(String s, int n)   { System.out.println(s + " " + n); }
    static void display(int n, String s)   { System.out.println(n + " " + s); }

    // Cannot overload on return type alone — this would be a compile error:
    // static double add(int a, int b) { return a + b; }  // ERROR

    public static void main(String[] args) {
        System.out.println(add(2, 3));          // 5   (int, int)
        System.out.println(add(1, 2, 3));       // 6   (int, int, int)
        System.out.println(add(1.5, 2.5));      // 4.0 (double, double)
        System.out.println(add("Hi ", "Java")); // Hi Java (String, String)

        display("Score", 100);  // Score 100
        display(100, "Score");  // 100 Score

        // Widening: int promoted to double when no exact int+int match is better
        // (compiler always picks the most specific match first)
        System.out.println(add(2, 3));          // calls int version, not double
    }
}`,
  codeTitle: 'Overloaded Methods — Same Name, Different Signatures',
  points: [
    'Method signature = method name + parameter types (not return type, not access modifier)',
    'The compiler resolves overloaded calls at compile time based on argument types — no runtime cost',
    'Overloading a method with different return type only causes a compile error, not overloading',
    'Widening conversions happen automatically when no exact match exists (int → long → float → double)',
    'Autoboxing (int → Integer) is tried before varargs; if both match, the more specific one wins',
    'System.out.println is the most famous overloaded method: 10+ versions for int, long, double, char, String, Object, etc.',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You cannot overload methods by return type alone. static int foo(int x) and static double foo(int x) in the same class will not compile — the compiler cannot distinguish them at the call site.',
    },
    {
      type: 'tip',
      content: 'Overloading is a form of compile-time polymorphism. Overriding is runtime polymorphism. Remember: same class / different params = overloading; subclass / same params = overriding.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between method overloading and method overriding?\nA: Overloading occurs in the same class — same method name, different parameter list, resolved at compile time. Overriding occurs in a subclass — same name and parameter list, resolved at runtime via dynamic dispatch.',
    },
  ],
}
