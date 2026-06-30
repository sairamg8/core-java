export default {
  id: 'serialization',
  title: '137. Serialization',
  explanation: `Serialization in depth: the mechanics, the ObjectOutputStream API, serializing complex object graphs, and customizing serialization behavior.

**ObjectOutputStream:**
The key class for serializing objects. It wraps any OutputStream (usually FileOutputStream or ByteArrayOutputStream).
- writeObject(Object obj) — serializes obj and all referenced objects
- writeInt(), writeLong(), writeDouble(), writeUTF() — write primitive values directly
- flush() / close() — must call to finalize the stream

**Object graph serialization:**
When you serialize an object, Java also serializes all objects it references (recursively). If Employee has an Address field, Address must also implement Serializable. A circular reference (A references B, B references A) is handled correctly — Java tracks already-serialized objects by reference ID.

**Serializing multiple objects:**
You can write multiple objects to the same stream. Read them back in the same order.

**Customizing serialization with writeObject/readObject:**
You can override the default serialization behavior by implementing:
  private void writeObject(ObjectOutputStream oos) throws IOException
  private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException

This lets you encrypt sensitive fields, validate data on read, or handle migration from old formats.

**Externalizable interface:**
An alternative to Serializable that gives you full control over what is written/read. Must implement writeExternal() and readExternal(). More control but more code.

**Serialization to byte array (in-memory):**
Use ByteArrayOutputStream to serialize to memory (useful for deep copying, caching, or sending over a socket).`,
  code: `import java.io.*;

class Address implements Serializable {
    private static final long serialVersionUID = 1L;
    String street, city, country;

    Address(String street, String city, String country) {
        this.street = street; this.city = city; this.country = country;
    }

    @Override
    public String toString() { return street + ", " + city + ", " + country; }
}

class SecureEmployee implements Serializable {
    private static final long serialVersionUID = 1L;
    String name;
    transient String password;  // won't be auto-serialized
    Address address;

    SecureEmployee(String name, String password, Address address) {
        this.name = name; this.password = password; this.address = address;
    }

    // Custom serialization — encrypt password manually
    private void writeObject(ObjectOutputStream oos) throws IOException {
        oos.defaultWriteObject();  // write all non-transient fields
        // Simulate encryption
        String encrypted = "ENC[" + password + "]";
        oos.writeObject(encrypted);
    }

    // Custom deserialization — decrypt password
    private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
        ois.defaultReadObject();  // restore all non-transient fields
        String encrypted = (String) ois.readObject();
        // Simulate decryption
        this.password = encrypted.replaceAll("ENC\\[(.+)\\]", "$1");
    }

    @Override
    public String toString() {
        return "SecureEmployee{name=" + name + ", pwd=" + password + ", addr=" + address + "}";
    }
}

public class SerializationDemo {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        SecureEmployee emp = new SecureEmployee("Alice", "secret123",
            new Address("123 Main St", "New York", "USA"));

        System.out.println("Original: " + emp);

        // Serialize to file
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream("emp.ser")))) {
            oos.writeObject(emp);
        }

        // Deserialize from file
        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream("emp.ser")))) {
            SecureEmployee restored = (SecureEmployee) ois.readObject();
            System.out.println("Restored: " + restored);
        }

        // Serialize to byte array (deep copy pattern)
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(emp);
        }
        byte[] bytes = baos.toByteArray();
        System.out.println("Serialized size: " + bytes.length + " bytes");

        SecureEmployee copy = (SecureEmployee)
            new ObjectInputStream(new ByteArrayInputStream(bytes)).readObject();
        System.out.println("Deep copy: " + copy);

        new File("emp.ser").delete();
    }
}`,
  codeTitle: 'Serialization Deep Dive',
  points: [
    'ObjectOutputStream.writeObject() serializes the object and all objects in its reference graph',
    'Referenced objects (fields that are objects) must also implement Serializable or be marked transient',
    'Circular references are handled safely — Java tracks already-serialized objects by reference to avoid infinite loops',
    'Custom writeObject/readObject lets you control exactly what gets written/read — useful for encryption or migration',
    'defaultWriteObject() / defaultReadObject() within custom methods delegates to the standard serialization for non-transient fields',
    'Serializing to ByteArrayOutputStream enables in-memory serialization — useful for deep copies or sending over network',
    'Wrap ObjectOutputStream with BufferedOutputStream for better performance when writing to files',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If any object in the reference graph does not implement Serializable (and is not transient), writeObject() throws NotSerializableException. Mark non-serializable fields as transient to exclude them.',
    },
    {
      type: 'interview',
      content: 'Q: How does Java handle circular references during serialization?\nA: Java assigns a reference ID to each serialized object. If it encounters the same object again, it writes the reference ID instead of serializing the object again. Deserialization reconstructs the same reference graph — the two references point to the same object.',
    },
    {
      type: 'tip',
      content: 'The byte-array serialize/deserialize pattern is a quick but inefficient way to deep copy objects. For production deep copies, use a proper copy constructor or a library like Apache Commons Lang SerializationUtils.',
    },
  ],
}
