export default {
  id: 'this-keyword',
  title: '51. this Keyword',
  explanation: `\`this\` is a reference to the **current object** — the instance on which the method or constructor is currently executing. It is implicitly available inside any non-static method or constructor.

**Uses of \`this\`:**

**1. Disambiguate field vs parameter names (most common):**
\`\`\`java
class Person {
    String name;
    Person(String name) {
        this.name = name; // this.name = field; name = parameter
    }
}
\`\`\`

**2. Constructor chaining (this(...)):**
Call another constructor in the same class from the first line of a constructor:
\`\`\`java
Person() { this("Unknown", 0); } // calls Person(String, int)
Person(String name, int age) { this.name = name; this.age = age; }
\`\`\`
Must be the **first statement** in the constructor.

**3. Pass current object as argument:**
\`\`\`java
printInfo(this); // pass self to another method/class
\`\`\`

**4. Return current object (fluent/builder pattern):**
\`\`\`java
Builder setName(String n) { this.name = n; return this; }
\`\`\`

**5. Access hidden outer instance (inner classes):**
\`\`\`java
OuterClass.this.field
\`\`\`

\`this\` is a **compile-time** concept — it is not available in \`static\` methods because static methods belong to the class, not to any specific instance.`,
  code: `public class ThisKeyword {
    public static void main(String[] args) {
        // Disambiguate fields
        Counter c1 = new Counter(5);
        System.out.println(c1.count); // 5

        // Constructor chaining
        Counter c2 = new Counter();
        System.out.println(c2.count); // 0 (default chain)

        // Fluent builder pattern
        Person p = new Person()
            .setName("Alice")
            .setAge(30);
        System.out.println(p.name + ", " + p.age);
    }
}

class Counter {
    int count;
    String label;

    Counter(int count) {
        this.count = count;  // 'this.count' = field; 'count' = parameter
        this.label = "counter";
    }

    Counter() {
        this(0); // chain to Counter(int count) — must be first statement
    }

    void increment() {
        count++;
        print(this); // pass current object as argument
    }

    static void print(Counter c) {
        System.out.println(c.label + ": " + c.count);
    }
}

class Person {
    String name;
    int age;

    // Fluent setters return 'this' for chaining
    Person setName(String name) {
        this.name = name;
        return this; // return current object
    }

    Person setAge(int age) {
        this.age = age;
        return this;
    }
}`,
  codeTitle: 'this — Field Disambiguation, Chaining, Fluent Pattern',
  points: [
    'this.field disambiguates when a parameter and an instance field share the same name in a constructor or setter',
    'this() calls another constructor in the same class — must be the very first statement in the constructor body',
    'return this enables method chaining (fluent API / builder pattern) — every setter returns the object itself',
    'this is implicitly a final reference to the current instance; you cannot reassign it',
    'this is NOT available in static methods — static methods do not belong to any specific instance',
    'In inner classes, OuterClass.this accesses the enclosing outer class instance',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'this() (constructor chaining) must be the first line in a constructor. You cannot have any statement before it, not even variable declarations. Similarly, super() and this() cannot both appear in the same constructor.',
    },
    {
      type: 'tip',
      content: 'When you write setters, always use this.field = param even if the names differ — it is self-documenting and future-proofs against accidental shadowing if someone renames the parameter later.',
    },
    {
      type: 'interview',
      content: 'Q: What happens if you use this in a static method?\nA: Compile error — "non-static variable this cannot be referenced from a static context". Static methods have no implicit object; this has no meaning there.',
    },
  ],
}
