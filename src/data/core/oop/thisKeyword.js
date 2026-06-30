export default {
  id: 'this-keyword',
  title: 'The this Keyword',
  explanation: `\`this\` is a reference to the **current object** — the instance on which the current method or constructor was called. It solves three distinct problems.

**1. Disambiguate field vs parameter (most common use)**
When a constructor or setter parameter has the same name as a field, \`this.field\` refers to the field, plain \`field\` refers to the parameter.

**2. Constructor chaining — \`this(...)\`**
One constructor delegates to another in the same class. Avoids duplicating initialization logic. Must be the **first statement** in the constructor body.

**3. Pass the current object as an argument**
Useful when a method needs a reference to the caller (e.g., registering a listener, returning the same object for fluent builders).

**What \`this\` is NOT:**
- \`this\` is not available in static methods — static methods have no owning object
- \`this\` is not a variable you can reassign`,
  code: `public class Builder {
    private String name;
    private int age;

    // 1. Disambiguate — field vs param have the same name
    public Builder(String name, int age) {
        this.name = name;   // this.name = field, name = param
        this.age  = age;
    }

    // 2. Constructor chaining with this()
    public Builder() {
        this("Anonymous", 0);  // must be the first statement
    }

    // 3. Return 'this' for fluent / method-chaining style
    public Builder setName(String name) {
        this.name = name;
        return this;           // return the same object
    }

    public Builder setAge(int age) {
        this.age = age;
        return this;
    }

    @Override
    public String toString() {
        return "Builder{name=" + name + ", age=" + age + "}";
    }
}

// Fluent builder usage — each setter returns 'this', enabling chaining
Builder b = new Builder()
    .setName("Alice")
    .setAge(30);
System.out.println(b);   // Builder{name=Alice, age=30}`,
  points: [
    'this.field disambiguates when a parameter shadows an instance field',
    'this() delegates to another constructor in the same class — must be the first line',
    'Returning this from setters enables fluent/method-chaining APIs (common in builders)',
    'this cannot be used in a static context — static methods belong to the class, not an instance',
    'super() and this() cannot both be the first statement — you can only call one',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between this() and super()?\nA: this() calls another constructor in the SAME class (constructor chaining within one class). super() calls a constructor in the PARENT class (used to initialize inherited state). Both must be the first statement, so you can only use one of them per constructor.',
    },
    {
      type: 'gotcha',
      content: 'A common mistake is calling this() in one constructor that calls this() in another, which calls back to the first — an infinite constructor recursion. Java detects this at compile time and produces an error: "recursive constructor invocation".',
    },
    {
      type: 'tip',
      content: 'Always use this.fieldName in constructors and setters even when there is no naming conflict. It makes the intent explicit: "this is an instance variable assignment, not a local variable reassignment".',
    },
  ],
}
