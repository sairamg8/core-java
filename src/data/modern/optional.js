export default {
  id: 'optional',
  title: '1. Optional',
  explanation: `\`Optional<T>\` is a container that may or may not hold a non-null value. It makes the possibility of absence **explicit in the type system**, eliminating null checks and NullPointerExceptions in API contracts.

**Rule:** Use Optional as a return type from methods — not as fields, method parameters, or collection elements.`,
  code: `import java.util.Optional;

// Creating Optional
Optional<String> present  = Optional.of("hello");    // throws NPE if null
Optional<String> maybeNull = Optional.ofNullable(null); // safe — empty if null
Optional<String> empty    = Optional.empty();

// Checking and extracting — DON'T use isPresent() + get() together
// BAD — defeats the purpose
if (present.isPresent()) {
    System.out.println(present.get()); // can still throw NoSuchElementException
}

// GOOD — functional style
String val1 = present.orElse("default");                   // value or default
String val2 = present.orElseGet(() -> computeDefault());   // lazy supplier
String val3 = present.orElseThrow(() -> new IllegalStateException("Missing!"));

// map / filter / flatMap
Optional<Integer> length = present.map(String::length);   // Optional<Integer>
Optional<String>  upper  = present.map(String::toUpperCase).filter(s -> s.length() > 3);

// flatMap — when the mapper itself returns Optional
Optional<String> name = findUser(1).flatMap(user -> findName(user));

// ifPresent / ifPresentOrElse (Java 9+)
present.ifPresent(System.out::println);
present.ifPresentOrElse(
    v -> System.out.println("Found: " + v),
    () -> System.out.println("Not found")
);

// or() (Java 9+) — alternative Optional if empty
Optional<String> fallback = empty.or(() -> Optional.of("fallback"));

// stream() (Java 9+) — convert to 0-or-1 Stream, useful in pipelines
List<Optional<String>> optionals = List.of(Optional.of("a"), Optional.empty(), Optional.of("b"));
List<String> values = optionals.stream()
    .flatMap(Optional::stream)   // empties filtered out
    .toList();                    // ["a", "b"]

// Real-world example
class UserService {
    public Optional<User> findById(long id) {
        // return Optional.empty() instead of null — contract is clear
        return Optional.ofNullable(database.get(id));
    }
}

String username = userService.findById(42L)
    .map(User::getName)
    .map(String::trim)
    .filter(s -> !s.isEmpty())
    .orElse("Anonymous");

// What NOT to do with Optional
class User {
    private Optional<String> phone; // ❌ don't use as field — use String phone (nullable)
    String getName() { return ""; }
    java.util.Map<Long, User> database = new java.util.HashMap<>();
}
interface UserService { Optional<User> findById(long id); }
UserService userService = id -> Optional.empty();
Optional<String> findUser(long id) { return Optional.empty(); }
Optional<String> findName(String s) { return Optional.empty(); }
String computeDefault() { return "default"; }`,
  points: [
    'Optional.get() throws NoSuchElementException when empty — always use orElse/orElseGet/orElseThrow instead',
    'Optional is for return types, NOT method parameters. boolean save(Optional<String> name) → use overloading or @Nullable instead',
    'Optional is not Serializable — don\'t use it as fields in entities or DTOs',
    'orElse() always evaluates its argument; orElseGet() is lazy — use orElseGet(() -> expensive()) to avoid unnecessary computation',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between orElse() and orElseGet()?\nA: orElse(default) always evaluates default even when the Optional is present. orElseGet(() -> compute()) only runs the supplier when the Optional is empty. If "default" is an expensive computation or has side effects, always use orElseGet.',
    },
    {
      type: 'gotcha',
      content: 'Optional.of(null) throws NullPointerException immediately. Use Optional.ofNullable(value) when the value might be null. Optional.of() is only safe when you are certain the value is not null.',
    },
  ],
}
