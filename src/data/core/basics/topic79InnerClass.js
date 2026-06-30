export default {
  id: 'inner-class',
  title: '79. Inner Class',
  explanation: `An **inner class** is a class defined inside another class. Java supports four types of nested classes:

**1. Non-static inner class (member inner class):**
\`\`\`java
class Outer {
    class Inner { // has access to all Outer members including private
        void show() { System.out.println(Outer.this.x); }
    }
}
Outer o = new Outer();
Outer.Inner i = o.new Inner(); // requires outer instance
\`\`\`

**2. Static nested class:**
\`\`\`java
class Outer {
    static class Nested { // no access to instance members of Outer
        void show() { }
    }
}
Outer.Nested n = new Outer.Nested(); // no outer instance needed
\`\`\`

**3. Local inner class:**
Defined inside a method — scoped to that method.

**4. Anonymous inner class:**
One-off implementation of an interface/abstract class, inline.

**Why use inner classes?**
- Logical grouping of related classes (Map.Entry inside Map)
- Helper class tightly coupled to outer class
- Implement interfaces privately without polluting the package namespace
- Event handlers (pre-lambda style)

**Inner class access:**
A non-static inner class has access to all members of the outer class (even private). The outer instance is implicitly captured. Use \`OuterClass.this.field\` to access the outer field when there is a name conflict.`,
  code: `public class InnerClass {
    private int value = 42;

    // 1. Non-static inner class: has implicit reference to outer instance
    class Inner {
        void show() {
            System.out.println("Outer.value = " + value); // direct access!
        }
    }

    // 2. Static nested class: no outer instance needed
    static class StaticNested {
        void show() {
            // System.out.println(value); // ERROR: cannot access instance member
            System.out.println("Static nested — no outer instance");
        }
    }

    // 3. Local inner class: defined inside a method
    void doWork() {
        int localVal = 10; // effectively final
        class Local {
            void run() { System.out.println("Local class sees localVal=" + localVal); }
        }
        new Local().run();
    }

    public static void main(String[] args) {
        InnerClass outer = new InnerClass();

        // Non-static inner: requires outer instance
        InnerClass.Inner inner = outer.new Inner();
        inner.show(); // Outer.value = 42

        // Static nested: no outer instance needed
        InnerClass.StaticNested sn = new InnerClass.StaticNested();
        sn.show();

        // Local inner class
        outer.doWork();

        // Anonymous inner class (topic 80 covers in detail)
        Runnable r = new Runnable() {
            @Override public void run() { System.out.println("Anonymous runnable"); }
        };
        r.run();
    }
}`,
  codeTitle: 'Four Types of Inner Classes',
  points: [
    'Non-static inner class holds an implicit reference to the outer instance and can access all outer class members including private',
    'Static nested class has no reference to an outer instance — can be instantiated without an outer object (Outer.Nested n = new Outer.Nested())',
    'Local inner class is defined inside a method — it can access effectively-final local variables and the outer class members',
    'Anonymous inner class (topic 80) is a local class without a name — defined and instantiated in one expression',
    'The most common real-world inner class: Map.Entry<K,V> is a static nested interface inside Map',
    'Modern Java (Java 8+) replaces most anonymous inner class uses with lambdas; inner classes are still relevant for multi-method interfaces',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Non-static inner classes hold a hidden reference to the outer class instance. If the inner class is long-lived (e.g., stored in a static field), it prevents the outer object from being garbage collected — a memory leak. Use static nested classes when the outer reference is not needed.',
    },
    {
      type: 'tip',
      content: 'When building helper classes that only make sense in the context of one class (e.g., a Node class for a LinkedList), use a static nested class. It groups the classes logically without the memory overhead of a non-static inner class.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a static nested class and a non-static inner class?\nA: A non-static inner class holds an implicit reference to the outer instance and can access all its members. A static nested class has no such reference — it is just a regular class namespaced inside the outer class, with no access to outer instance members.',
    },
  ],
}
