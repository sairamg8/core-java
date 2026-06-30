export default {
  id: 'introduction-to-serialization',
  title: '136. Introduction to Serialization and Deserialization',
  explanation: `Serialization is the process of converting a Java object into a byte stream so it can be stored to a file, sent over a network, or saved in a database. Deserialization is the reverse — reconstructing an object from a byte stream.

**Why serialization?**
- Persist object state to disk (save game state, user preferences, session data)
- Send objects between JVMs over a network (RMI, distributed systems)
- Deep copy objects (serialize then deserialize to get an independent copy)
- Cache objects to disk

**How Java serialization works:**
1. The class must implement java.io.Serializable (a marker interface with no methods)
2. Java walks the object graph recursively, serializing all fields
3. The result is a binary format specific to Java — NOT human-readable
4. References to other objects are serialized inline (if they also implement Serializable)

**serialVersionUID:**
A static long field that acts as a version identifier. If the class changes (field added, removed, renamed) and the serialVersionUID does not match, deserialization throws InvalidClassException. Always declare it explicitly — the default is computed from class structure and changes automatically on any code change.

**What is NOT serialized:**
- static fields — belong to the class, not the instance
- transient fields — marked to be excluded
- non-serializable fields — cause NotSerializableException unless transient

**Limitations of Java built-in serialization:**
- JVM-specific format (Java only) — cannot share with other languages
- Slow and produces large byte arrays
- Security risk (deserialization attacks)
- Modern alternatives: JSON (Jackson, Gson), Protocol Buffers, Avro, MessagePack`,
  code: `import java.io.*;

// Must implement Serializable
class Employee implements Serializable {
    // Explicitly declare version ID — prevents InvalidClassException on class change
    private static final long serialVersionUID = 1L;

    String name;           // serialized
    int age;               // serialized
    double salary;         // serialized
    transient String password;  // NOT serialized (transient)
    static String company = "TechCorp";  // NOT serialized (static)

    Employee(String name, int age, double salary, String password) {
        this.name = name;
        this.age = age;
        this.salary = salary;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Employee{name=" + name + ", age=" + age +
               ", salary=" + salary + ", password=" + password + "}";
    }
}

public class SerializationIntroDemo {
    public static void main(String[] args) {
        Employee emp = new Employee("Alice", 30, 75000.0, "secret123");
        System.out.println("Before serialization: " + emp);

        // Serialize to file
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("employee.ser"))) {
            oos.writeObject(emp);
            System.out.println("Serialized successfully");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Deserialize from file
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("employee.ser"))) {
            Employee restored = (Employee) ois.readObject();
            System.out.println("After deserialization: " + restored);
            // password is null — transient field was not serialized
            // company is still accessible — it's a static field on the class
            System.out.println("Company: " + Employee.company);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        new File("employee.ser").delete();
    }
}`,
  codeTitle: 'Introduction to Serialization',
  points: [
    'Serialization converts an object to a byte stream; deserialization reconstructs the object from bytes',
    'A class must implement java.io.Serializable (marker interface — no methods) to be serializable',
    'serialVersionUID must be declared explicitly to prevent version mismatch errors when the class changes',
    'transient fields are excluded from serialization — use for sensitive data (passwords, tokens) or non-serializable resources',
    'static fields belong to the class, not instances — they are never serialized',
    'All non-transient, non-static fields must also be Serializable, or they must be marked transient',
    'Java built-in serialization is JVM-specific and slow — modern alternatives (JSON, Protobuf) are preferred for production',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you do not declare serialVersionUID and later modify the class (add/remove a field), deserializing old data throws InvalidClassException. Always declare it explicitly as private static final long serialVersionUID = 1L.',
    },
    {
      type: 'interview',
      content: 'Q: What is the purpose of serialVersionUID?\nA: It is a version stamp. When deserializing, Java checks that the serialVersionUID in the byte stream matches the class definition. If they differ, it throws InvalidClassException. Declaring it explicitly prevents JVM from auto-computing it (which changes whenever the class changes).',
    },
    {
      type: 'tip',
      content: 'Do not use Java built-in serialization for new production systems — it has known security vulnerabilities (deserialization attacks). Use JSON (Jackson/Gson) or Protocol Buffers instead. Restrict Java serialization to internal JVM use only.',
    },
  ],
}
