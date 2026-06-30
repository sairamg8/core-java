export default {
  id: 'deserialization',
  title: '138. Deserialization',
  explanation: `Deserialization is the process of reconstructing a Java object from a byte stream that was previously serialized. It is performed using ObjectInputStream.

**ObjectInputStream:**
- readObject() — reads the next serialized object from the stream; returns Object (cast required)
- Throws ClassNotFoundException if the class is not on the classpath
- Throws InvalidClassException if serialVersionUID does not match
- Throws StreamCorruptedException if the stream is corrupted

**How deserialization works:**
1. Java reads the class descriptor from the stream (class name, serialVersionUID, fields)
2. It checks that the class exists in the current classpath and serialVersionUID matches
3. It allocates a new object instance WITHOUT calling the constructor
4. It restores all non-transient, non-static field values from the stream
5. If writeObject/readObject are defined, it calls readObject for custom logic

**Key point: constructor is NOT called during deserialization**
This means any logic in constructors (validation, initialization) is bypassed. Be careful if your class has invariants enforced in the constructor.

**readResolve() and writeReplace():**
- readResolve() — called after deserialization; return value replaces the deserialized object. Used to enforce singleton pattern.
- writeReplace() — called before serialization; return value is serialized instead of the original object.

**Security warning:**
Deserializing untrusted data is a major security risk (deserialization gadget chains can execute arbitrary code). Use object deserialization filters (ObjectInputFilter, Java 9+) to restrict what classes can be deserialized.`,
  code: `import java.io.*;
import java.nio.file.*;

class Config implements Serializable {
    private static final long serialVersionUID = 1L;
    String host;
    int port;
    boolean secure;
    transient String apiKey;  // not stored

    Config(String host, int port, boolean secure, String apiKey) {
        this.host = host; this.port = port;
        this.secure = secure; this.apiKey = apiKey;
        System.out.println("Constructor called");  // will NOT be called on deserialization
    }

    // Called after deserialization to do post-restore logic
    private Object readResolve() throws ObjectStreamException {
        // Restore anything that transient/post-init logic requires
        this.apiKey = "restored-default-key";  // set a default since transient wasn't saved
        return this;
    }

    @Override
    public String toString() {
        return "Config{host=" + host + ", port=" + port +
               ", secure=" + secure + ", apiKey=" + apiKey + "}";
    }
}

public class DeserializationDemo {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        Config config = new Config("localhost", 8080, true, "super-secret-key");
        System.out.println("Original: " + config);

        // Serialize
        byte[] data;
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(config);
            data = baos.toByteArray();
        }

        // Deserialize
        System.out.println("\n--- Deserializing ---");
        // Note: "Constructor called" does NOT print again
        try (ObjectInputStream ois = new ObjectInputStream(
                new ByteArrayInputStream(data))) {
            Config restored = (Config) ois.readObject();
            System.out.println("Restored: " + restored);
            // host, port, secure are restored; apiKey comes from readResolve
        }

        // Reading multiple objects in order
        byte[] multi;
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject("First");
            oos.writeInt(42);
            oos.writeObject(config);
            multi = baos.toByteArray();
        }

        try (ObjectInputStream ois = new ObjectInputStream(
                new ByteArrayInputStream(multi))) {
            String s = (String) ois.readObject();    // must read in same order
            int n = ois.readInt();
            Config c = (Config) ois.readObject();
            System.out.println("Multi: " + s + ", " + n + ", " + c.host);
        }

        // ClassNotFoundException example — what happens when class is missing
        // (cannot demonstrate without removing the class, but the exception type is important)
        System.out.println("\nDeserialization complete");
    }
}`,
  codeTitle: 'Deserialization Deep Dive',
  points: [
    'ObjectInputStream.readObject() reconstructs an object from bytes; returns Object — requires an explicit cast',
    'The constructor is NOT called during deserialization — fields are populated directly by the deserialization mechanism',
    'readResolve() is called after deserialization and its return value replaces the reconstructed object — used for Singleton pattern',
    'ClassNotFoundException is thrown if the class is not available in the current classpath',
    'InvalidClassException is thrown if serialVersionUID does not match the stored value',
    'Multiple objects written in sequence must be read back in the exact same order',
    'Deserializing untrusted data is a security risk — use ObjectInputFilter (Java 9+) to whitelist allowed classes',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Because the constructor is skipped during deserialization, constructor-based validation is bypassed. An attacker can craft a byte stream to create an object in an invalid state. Always validate fields in readObject() if your class has invariants.',
    },
    {
      type: 'interview',
      content: 'Q: Is the constructor called during deserialization?\nA: No. Java creates the object instance without calling the constructor by using low-level JVM mechanisms (Unsafe.allocateInstance or similar). Only the parent class constructor up to the first non-Serializable superclass is called.',
    },
    {
      type: 'tip',
      content: 'To implement a Singleton that survives serialization, add a readResolve() method that returns the singleton instance: private Object readResolve() { return INSTANCE; }. Without it, each deserialization creates a new object, breaking the singleton contract.',
    },
  ],
}
