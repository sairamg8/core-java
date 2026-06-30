export default {
  id: 'getters-and-setters',
  title: '50. Getters and Setters',
  explanation: `**Getters** and **setters** (also called accessors and mutators) are public methods that provide controlled read and write access to private fields.

**Naming convention (JavaBean standard):**
- Getter: \`getFieldName()\` — or \`isFieldName()\` for boolean fields
- Setter: \`setFieldName(value)\`

\`\`\`java
private String name;
public String getName()           { return name; }
public void   setName(String name){ this.name = name; }

private boolean active;
public boolean isActive()             { return active; }
public void    setActive(boolean act) { this.active = act; }
\`\`\`

**Why not just use public fields?**

\`\`\`java
// Public field: no control, no validation
class Person { public int age; }
p.age = -100; // allowed! Invalid state.

// With setter: validation enforced
class Person {
    private int age;
    public void setAge(int a) { if (a > 0 && a < 150) age = a; }
}
\`\`\`

**Read-only fields:** provide only a getter (no setter).
**Write-only fields:** provide only a setter (rare, used for passwords).
**Immutable class:** provide only getters, set all fields in the constructor, declare class \`final\`.

**JavaBeans standard:** frameworks like Spring, Hibernate, and Jackson rely on the getX/setX convention for auto-injection, ORM mapping, and JSON serialization. Following it makes your classes framework-compatible out of the box.`,
  code: `public class GettersAndSetters {
    public static void main(String[] args) {
        Employee e = new Employee();
        e.setName("Alice");
        e.setSalary(75000);
        e.setActive(true);

        System.out.println(e.getName());   // Alice
        System.out.println(e.getSalary()); // 75000.0
        System.out.println(e.isActive());  // true

        // Salary validation in setter
        e.setSalary(-1000); // rejected silently
        System.out.println(e.getSalary()); // 75000.0 (unchanged)

        // Read-only: only getter for employeeId
        System.out.println(e.getEmployeeId()); // auto-assigned
    }
}

class Employee {
    private static int idCounter = 1000;

    private int employeeId;  // read-only: no setter
    private String name;
    private double salary;
    private boolean active;

    Employee() {
        this.employeeId = idCounter++;
    }

    // Read-only
    public int getEmployeeId() { return employeeId; }

    // Name getter/setter
    public String getName() { return name; }
    public void setName(String name) {
        if (name != null && !name.isBlank()) this.name = name;
    }

    // Salary with validation
    public double getSalary() { return salary; }
    public void setSalary(double salary) {
        if (salary >= 0) this.salary = salary;
    }

    // Boolean: isXxx() convention
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}`,
  codeTitle: 'JavaBean Getters, Setters, and Validation',
  points: [
    'Follow the JavaBean naming convention: getX()/setX() for non-booleans, isX()/setX() for booleans',
    'Setters can validate and reject invalid input — impossible if the field is public',
    'Read-only fields have only a getter; the field is set in the constructor and never exposed for writing',
    'Spring, Hibernate, and Jackson all rely on getX/setX conventions for dependency injection, ORM mapping, and JSON parsing',
    'Lombok\'s @Getter and @Setter annotations auto-generate the boilerplate at compile time — widely used in real projects',
    'For truly immutable value objects, use Java Records (Java 16+) — they auto-generate getters with the field name (no get prefix)',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'In Spring/Hibernate, if your getter is named getXxx() for a field named xxx, the framework will find and use it automatically. Naming getters incorrectly (e.g., fetchName()) breaks framework auto-wiring.',
    },
    {
      type: 'gotcha',
      content: 'For boolean fields: the getter MUST be named isActive(), not getActive(). Java serialization, Jackson (JSON), and Spring use isX() for booleans by convention. A getter named getActive() for a boolean field may cause JSON serialization issues.',
    },
    {
      type: 'interview',
      content: 'Q: Why use getters/setters instead of public fields?\nA: Three reasons: (1) validation — setters can reject invalid values; (2) read-only control — provide getter without setter; (3) flexibility — changing the internal representation does not break callers since the public API (the method signatures) stays the same.',
    },
  ],
}
