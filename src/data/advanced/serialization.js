export default {
  id: 'serialization',
  title: 'Serialization & Deserialization',
  explanation: `**Serialization** converts a Java object into a byte stream so it can be saved to disk, sent over a network, or stored in a database. **Deserialization** is the reverse — reconstructing the object from the byte stream.

**To serialize a class:**
1. Implement \`java.io.Serializable\` (marker interface — no methods required)
2. Declare \`private static final long serialVersionUID\` (optional but strongly recommended)
3. Use \`ObjectOutputStream\` to write, \`ObjectInputStream\` to read

**serialVersionUID**
A unique version identifier for the class. If you change the class (add/remove fields) without updating the serialVersionUID, deserialization of old data will throw \`InvalidClassException\`. Explicitly declare it to control versioning.

**transient keyword**
Fields marked \`transient\` are excluded from serialization. Use it for:
- Sensitive data (passwords, tokens)
- Fields that can be recomputed (caches, derived values)
- Non-serializable objects (database connections, threads)

**Alternatives to Java Serialization:**
Java's built-in serialization is fragile and has security issues. Modern applications prefer:
- JSON (Jackson, Gson)
- Protocol Buffers (Protobuf)
- XML (JAXB)`,
  code: `import java.io.*;
import java.util.List;

// 1. Mark the class Serializable
public class Employee implements Serializable {
    // Explicit serialVersionUID prevents InvalidClassException on class changes
    private static final long serialVersionUID = 1L;

    private String name;
    private int    employeeId;
    private double salary;

    // transient — excluded from serialization (sensitive data)
    private transient String password;

    // transient — cannot serialize a database connection
    private transient Connection dbConnection;

    public Employee(String name, int employeeId, double salary, String password) {
        this.name       = name;
        this.employeeId = employeeId;
        this.salary     = salary;
        this.password   = password;
    }

    @Override
    public String toString() {
        return "Employee{name=" + name + ", id=" + employeeId + ", salary=" + salary
               + ", password=" + password + "}";
    }
}

// --- Serialize (object → file) ---
Employee emp = new Employee("Alice", 101, 75000.0, "secret123");
System.out.println("Before: " + emp);   // password = secret123

try (ObjectOutputStream oos =
        new ObjectOutputStream(new FileOutputStream("employee.ser"))) {
    oos.writeObject(emp);                // write single object
    System.out.println("Serialized to employee.ser");
} catch (IOException e) {
    e.printStackTrace();
}

// --- Deserialize (file → object) ---
try (ObjectInputStream ois =
        new ObjectInputStream(new FileInputStream("employee.ser"))) {
    Employee restored = (Employee) ois.readObject();
    System.out.println("After:  " + restored);
    // password = null — transient field is not restored!
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}

// --- Serializing a collection ---
List<Employee> team = List.of(
    new Employee("Bob", 102, 80000, "pass1"),
    new Employee("Carol", 103, 90000, "pass2")
);

try (ObjectOutputStream oos =
        new ObjectOutputStream(new FileOutputStream("team.ser"))) {
    oos.writeObject(team);  // List<Employee> is also Serializable
}`,
  points: [
    'Serializable is a marker interface — implementing it is the only requirement to make a class serializable',
    'Always declare serialVersionUID explicitly; without it Java auto-generates one that changes with any class modification, breaking stored data',
    'transient fields are set to their default value (null, 0, false) after deserialization — never rely on them holding the pre-serialization value',
    'All nested objects must also implement Serializable, or you get NotSerializableException at runtime',
    'Java serialization has known security vulnerabilities (arbitrary code execution via gadget chains) — never deserialize untrusted data',
    'In production, prefer JSON (Jackson) or Protobuf over Java serialization for data persistence or network transfer',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is serialVersionUID and why is it important?\nA: It is a version stamp for the class. During deserialization, Java checks that the serialVersionUID in the byte stream matches the current class. If you add a new field but forget to update the UID, Java may refuse to deserialize old data and throw InvalidClassException. Declaring it explicitly gives you control: you decide when breaking changes warrant a new UID vs when old data should still load.',
    },
    {
      type: 'gotcha',
      content: 'If any field in a serializable class holds a non-serializable object (like a Thread or InputStream), serialization throws NotSerializableException at runtime — even though the class compiles fine. Mark such fields transient to exclude them.',
    },
    {
      type: 'tip',
      content: 'To customize serialization behavior (e.g., to encrypt a field or recompute transient fields on load), implement private void writeObject(ObjectOutputStream out) and private void readObject(ObjectInputStream in) methods. Java calls these automatically instead of the default mechanism.',
    },
  ],
}
