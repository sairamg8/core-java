export default {
  id: 'transient',
  title: '139. Transient (Selective Serialization)',
  explanation: `The transient keyword tells Java to skip a field during serialization. When the object is deserialized, the transient field is restored to its default value (null for objects, 0 for int, false for boolean, etc.) instead of the saved value.

**When to use transient:**
1. **Sensitive data** — passwords, tokens, credit card numbers should NEVER be serialized to disk or sent over the wire in plaintext.
2. **Derived/computed fields** — fields that can be recalculated from other fields do not need to be stored.
3. **Non-serializable fields** — fields whose type does not implement Serializable (e.g., Thread, Connection, Socket).
4. **Caches** — cached values that can be rebuilt after deserialization.
5. **Logger fields** — Logger is not serializable; mark them transient.

**Custom initialization after deserialization:**
When a transient field needs a non-default value after deserialization, override readObject() to set it:
  private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
      ois.defaultReadObject();  // restore non-transient fields
      this.cache = new HashMap<>();  // re-initialize transient cache
  }

**transient with volatile:**
A field can be both transient and volatile — transient controls serialization, volatile controls thread visibility. They are orthogonal.

**Note:** The transient keyword has no meaning for non-serializable classes. It is only relevant when the class implements Serializable.`,
  code: `import java.io.*;
import java.util.*;

class UserSession implements Serializable {
    private static final long serialVersionUID = 1L;

    String username;
    String email;
    Date loginTime;

    transient String authToken;              // sensitive — never serialize
    transient Connection dbConnection;       // not serializable
    transient Map<String, Object> cache;     // can be rebuilt
    transient Logger logger;                 // Logger is not Serializable

    static int sessionCount = 0;             // static — not serialized

    UserSession(String username, String email) {
        this.username = username;
        this.email = email;
        this.loginTime = new Date();
        this.authToken = "jwt_" + System.nanoTime();
        this.cache = new HashMap<>();
        this.logger = new Logger();
        sessionCount++;
    }

    // Restore transient fields after deserialization
    private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
        ois.defaultReadObject();             // restore non-transient fields
        this.cache = new HashMap<>();        // re-initialize cache (empty)
        this.logger = new Logger();          // re-initialize logger
        // authToken and dbConnection remain null (intentionally)
    }

    @Override
    public String toString() {
        return "UserSession{user=" + username + ", email=" + email +
               ", loginTime=" + loginTime + ", token=" + authToken +
               ", cacheSize=" + (cache != null ? cache.size() : "null") + "}";
    }
}

// Dummy non-serializable class (like a real DB Connection)
class Connection { }

// Dummy logger (real Logger from java.util.logging is not Serializable)
class Logger { void log(String msg) { System.out.println("[LOG] " + msg); } }

public class TransientDemo {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        UserSession session = new UserSession("alice", "alice@example.com");
        session.cache.put("preferences", "dark_mode");
        System.out.println("Before: " + session);
        System.out.println("Token before: " + session.authToken);

        // Serialize
        byte[] data;
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(session);
            data = baos.toByteArray();
        }

        // Deserialize
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            UserSession restored = (UserSession) ois.readObject();
            System.out.println("\nAfter: " + restored);
            System.out.println("Token after: " + restored.authToken);  // null (transient)
            System.out.println("Cache after: " + restored.cache);       // {} (re-initialized in readObject)
            System.out.println("Login time: " + restored.loginTime);   // preserved (non-transient)
        }
    }
}`,
  codeTitle: 'transient — Excluding Fields from Serialization',
  points: [
    'transient excludes a field from serialization — deserialized value is the default (null, 0, false)',
    'Use transient for: sensitive data (passwords, tokens), non-serializable types (Thread, Connection), derived/computed values, caches',
    'Logger fields should always be transient — most Logger implementations are not Serializable',
    'Override readObject() to re-initialize transient fields to non-default values after deserialization',
    'transient and static are complementary ways to exclude fields: static fields belong to the class (never serialized), transient excludes instance fields',
    'transient has no effect on non-Serializable classes — it is only meaningful in the context of Java serialization',
    'transient and volatile are orthogonal — a field can be both (transient: skip serialization; volatile: memory visibility for threads)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'After deserialization, a transient field is null (for objects) — code that assumes the field is initialized will throw NullPointerException. Always null-check transient fields or initialize them in readObject().',
    },
    {
      type: 'interview',
      content: 'Q: What is the default value of a transient field after deserialization?\nA: The Java default for that type: null for object references, 0 for int/long/double, false for boolean. The original value is NOT restored because it was never serialized.',
    },
    {
      type: 'tip',
      content: 'Mark fields transient proactively for any field that should not leave the JVM boundary — cryptographic keys, session tokens, database connections. This enforces a security boundary at the serialization layer.',
    },
  ],
}
