export default {
  id: 'optional-class',
  title: '125. Optional Class',
  explanation: `Optional<T> is a container object introduced in Java 8 that may or may not hold a non-null value. Its purpose is to make the absence of a value explicit in the API — instead of returning null and hoping callers check for it, you return Optional and callers must actively unwrap it.

**Creating an Optional:**
- Optional.of(value) — value must not be null; throws NullPointerException if null
- Optional.ofNullable(value) — value can be null; empty Optional if null
- Optional.empty() — explicitly empty Optional

**Accessing the value:**
- get() — returns value; throws NoSuchElementException if empty (use sparingly)
- isPresent() — true if a value exists
- isEmpty() — true if empty (Java 11+)
- ifPresent(Consumer) — runs action only if value present
- orElse(default) — returns value if present, else the default
- orElseGet(Supplier) — like orElse but the default is computed lazily (better for expensive defaults)
- orElseThrow() — throws NoSuchElementException if empty
- orElseThrow(Supplier) — throws the supplied exception if empty

**Transforming Optionals:**
- map(Function) — transforms value if present; returns Optional<R>
- flatMap(Function) — like map, but the function returns Optional (avoids Optional<Optional<T>>)
- filter(Predicate) — returns empty Optional if value does not match

**Important:** Optional is NOT for use as method parameters or field types — it is designed as a return type for methods that might not produce a value.`,
  code: `import java.util.*;

public class OptionalDemo {
    // Returns Optional instead of null
    static Optional<String> findUserById(int id) {
        Map<Integer, String> users = Map.of(1, "Alice", 2, "Bob", 3, "Charlie");
        return Optional.ofNullable(users.get(id));
    }

    static Optional<String> getEmail(String username) {
        if (username.equals("Alice")) return Optional.of("alice@example.com");
        return Optional.empty();
    }

    public static void main(String[] args) {
        // Creating Optionals
        Optional<String> present = Optional.of("Hello");
        Optional<String> empty = Optional.empty();
        Optional<String> nullable = Optional.ofNullable(null);  // same as empty()

        System.out.println("Present: " + present.isPresent());  // true
        System.out.println("Empty: " + empty.isEmpty());        // true (Java 11+)

        // Safe access patterns
        Optional<String> user = findUserById(1);
        user.ifPresent(u -> System.out.println("Found: " + u));  // Found: Alice

        // orElse vs orElseGet
        String name1 = findUserById(99).orElse("Unknown");
        String name2 = findUserById(99).orElseGet(() -> "Default-" + System.currentTimeMillis());
        System.out.println("orElse: " + name1);
        System.out.println("orElseGet: " + name2);

        // orElseThrow
        try {
            String name = findUserById(99).orElseThrow(() -> new IllegalArgumentException("User not found"));
        } catch (IllegalArgumentException e) {
            System.out.println("Exception: " + e.getMessage());
        }

        // map — transform if present
        Optional<Integer> length = findUserById(1).map(String::length);
        System.out.println("Name length: " + length.orElse(0));  // 5

        // filter — keep if matches
        Optional<String> alice = findUserById(1).filter(u -> u.startsWith("A"));
        System.out.println("Filtered: " + alice.orElse("none"));  // Alice

        // flatMap — chaining Optionals (avoids Optional<Optional<T>>)
        Optional<String> email = findUserById(1)
            .flatMap(u -> getEmail(u));  // getEmail returns Optional<String>
        System.out.println("Email: " + email.orElse("no email"));
    }
}`,
  codeTitle: 'Optional — Creating and Unwrapping',
  points: [
    'Optional<T> is a container that explicitly signals "this may or may not have a value" instead of returning null',
    'Optional.of() requires non-null; Optional.ofNullable() accepts null (returns empty Optional)',
    'Never call get() without isPresent() — it throws NoSuchElementException for empty Optionals',
    'Prefer ifPresent(), orElse(), orElseGet(), orElseThrow() over get() for safer value access',
    'orElseGet(Supplier) is better than orElse(value) when the default is expensive — it is computed only when needed',
    'map() and flatMap() let you chain operations on Optionals without null checks',
    'Optional is designed as a return type only — do not use it as method parameters or class fields',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Optional.of(null) throws NullPointerException immediately. Use Optional.ofNullable(value) when the value might be null.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between orElse() and orElseGet()?\nA: orElse(value) evaluates the default eagerly — even if the Optional has a value, the default expression is computed. orElseGet(Supplier) only evaluates the supplier if the Optional is empty. For expensive defaults (DB query, object creation), always use orElseGet().',
    },
    {
      type: 'tip',
      content: 'Chain Optional with map/flatMap/filter instead of unpacking with isPresent()/get(). This keeps code concise and avoids re-introducing null checks.',
    },
  ],
}
