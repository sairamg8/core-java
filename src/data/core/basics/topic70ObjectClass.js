export default {
  id: 'object-class-equals-tostring-hashcode',
  title: '70. Object Class: equals(), toString(), and hashCode()',
  explanation: `Every Java class implicitly extends \`java.lang.Object\` — the root of the entire class hierarchy. Three of Object's methods are overridden in almost every domain class: \`equals()\`, \`toString()\`, and \`hashCode()\`.

**toString():**
Returns a String representation of the object. The default is \`ClassName@hexHashCode\` (useless for debugging). Override to provide meaningful output.
\`\`\`java
@Override public String toString() { return "Person[" + name + ", " + age + "]"; }
\`\`\`
Called automatically by \`System.out.println(obj)\`, string concatenation \`"" + obj\`, and logging.

**equals():**
The default \`equals()\` checks reference equality (same as \`==\`). Override to check value equality.
\`\`\`java
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Person p)) return false;
    return age == p.age && Objects.equals(name, p.name);
}
\`\`\`

**hashCode():**
Returns an int used by hash-based structures (HashMap, HashSet). **The contract:** if two objects are equal (\`a.equals(b)\`), they MUST have the same hashCode.
\`\`\`java
@Override public int hashCode() { return Objects.hash(name, age); }
\`\`\`

**The equals-hashCode contract:**
If you override equals, you MUST override hashCode, and vice versa. Violating this breaks HashMap and HashSet behavior.`,
  code: `import java.util.*;

public class ObjectClass {
    public static void main(String[] args) {
        Person p1 = new Person("Alice", 30);
        Person p2 = new Person("Alice", 30);
        Person p3 = new Person("Bob", 25);

        // Default Object.toString() is useless — see override
        System.out.println(p1); // Person[Alice, 30]

        // == vs equals()
        System.out.println(p1 == p2);       // false (different objects)
        System.out.println(p1.equals(p2));  // true  (same name + age)
        System.out.println(p1.equals(p3));  // false

        // hashCode consistency
        System.out.println(p1.hashCode() == p2.hashCode()); // true (equal objects)
        System.out.println(p1.hashCode() == p3.hashCode()); // likely false

        // HashMap works because of correct equals+hashCode
        Map<Person, String> roles = new HashMap<>();
        roles.put(p1, "Admin");
        System.out.println(roles.get(p2)); // "Admin" — found via equal hashCode+equals

        // HashSet deduplication
        Set<Person> set = new HashSet<>(List.of(p1, p2, p3));
        System.out.println(set.size()); // 2: p1 and p2 are equal, so only one
    }
}

class Person {
    String name;
    int age;

    Person(String name, int age) { this.name = name; this.age = age; }

    @Override
    public String toString() {
        return "Person[" + name + ", " + age + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person p)) return false;
        return age == p.age && Objects.equals(name, p.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age); // consistent with equals
    }
}`,
  codeTitle: 'equals(), hashCode(), and toString() Override Contract',
  points: [
    'Every Java class inherits toString(), equals(), and hashCode() from Object; the defaults are rarely what you want',
    'Override toString() to make System.out.println and logging produce human-readable output',
    'Override equals() to define value equality (same content) rather than reference equality (same memory address)',
    'If you override equals(), you MUST override hashCode() — objects that are equal must have equal hashCodes',
    'Use Objects.hash(field1, field2, ...) for a correct, null-safe hashCode; use Objects.equals() in equals() for null-safe field comparison',
    'Violating the equals-hashCode contract causes HashMap and HashSet to behave incorrectly (duplicate entries, failed lookups)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you override equals() but not hashCode(), equal objects may have different hashCodes. HashMap uses hashCode first to find the bucket — if the hashCodes differ, the key is never found even when equals() would return true.',
    },
    {
      type: 'tip',
      content: 'IntelliJ (Alt+Insert → equals() and hashCode()), Eclipse, and VS Code can generate both methods together. Always generate them as a pair. Java Records auto-generate correct implementations for all three methods.',
    },
    {
      type: 'interview',
      content: 'Q: What is the contract between equals() and hashCode()?\nA: If a.equals(b) is true, then a.hashCode() == b.hashCode() must also be true. The reverse is not required — two objects can have the same hashCode (hash collision) without being equal.',
    },
  ],
}
