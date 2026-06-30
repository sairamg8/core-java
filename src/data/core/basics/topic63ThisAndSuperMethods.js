export default {
  id: 'this-and-super-methods',
  title: '63. this and super Methods',
  explanation: `In Java inheritance, \`this\` and \`super\` serve as explicit references to navigate between the current class and its parent class.

**\`this\` as method/constructor reference:**
- \`this.method()\` — calls the current class's version of a method (usually redundant but clarifying)
- \`this(args)\` — calls another constructor in the **same class** (must be first statement)

**\`super\` as method/constructor reference:**
- \`super.method()\` — calls the **parent class's** version of an overridden method
- \`super(args)\` — calls the **parent class's constructor** (must be first statement in child constructor)

**Calling super.method():**
\`\`\`java
class Animal { void eat() { System.out.println("Animal eats"); } }
class Dog extends Animal {
    @Override
    void eat() {
        super.eat();                // call parent behavior first
        System.out.println("Dog eats too"); // then add extra behavior
    }
}
\`\`\`

**Rules:**
- \`this()\` and \`super()\` cannot both appear in the same constructor
- Both must be the **first statement** in a constructor
- If neither is written, Java inserts \`super()\` automatically

**When to use super.method():**
- When you override a method but want to include the parent's implementation
- When extending a framework class and you want to trigger the parent lifecycle hook`,
  code: `public class ThisAndSuperMethods {
    public static void main(String[] args) {
        Manager m = new Manager("Alice", 90000, "Engineering");
        m.introduce(); // Extends Employee's introduce + adds department
        m.workDay();
    }
}

class Employee {
    String name;
    double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    // Chained constructor using this()
    Employee(String name) {
        this(name, 50000); // default salary
    }

    void introduce() {
        System.out.println("Hi, I am " + name + ", salary: " + salary);
    }

    void workDay() {
        System.out.println(name + " is working");
    }
}

class Manager extends Employee {
    String department;

    Manager(String name, double salary, String department) {
        super(name, salary); // initialize Employee first
        this.department = department;
    }

    // this() chain: no-arg delegates
    Manager(String name) {
        this(name, 80000, "General"); // calls Manager(String, double, String)
    }

    @Override
    void introduce() {
        super.introduce(); // reuse parent behavior
        System.out.println("  Department: " + department); // add extra
    }

    @Override
    void workDay() {
        super.workDay();   // Employee.workDay()
        System.out.println(name + " is managing the " + department + " team");
    }
}`,
  codeTitle: 'this() and super() — Constructor and Method Chaining',
  points: [
    'super(args) calls the parent constructor — must be the first line in child constructor; omitting it inserts a no-arg super() automatically',
    'this(args) calls another constructor in the same class — must also be the first line, so it is mutually exclusive with super()',
    'super.method() calls the parent class version of an overridden method — useful to extend rather than replace behavior',
    'Calling super.eat() before adding Dog-specific behavior is the "extend parent" override pattern',
    'Without @Override, if the parent method signature changes, you would have a new method instead of an override — no compile error',
    'super cannot skip levels in a deep inheritance chain — it always refers to the immediate parent only',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'You cannot have both this() and super() in the same constructor — both must be the first statement, which is a contradiction. Choose one: chain within the class (this) or delegate to the parent (super).',
    },
    {
      type: 'tip',
      content: 'The "extend rather than replace" pattern: call super.method() first, then add child-specific behavior. This is how Android Activity lifecycle methods (onCreate, onResume) work — always call super first.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between this() and super() in constructors?\nA: this() calls another constructor in the SAME class (constructor chaining within the class). super() calls the PARENT class constructor. Both must be the first statement, so they cannot both appear in the same constructor.',
    },
  ],
}
