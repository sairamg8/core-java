export default {
  id: 'annotations',
  title: 'Annotations',
  explanation: `An **annotation** is metadata attached to a class, method, field, or parameter. Annotations do not directly affect execution — they are read by the compiler, build tools, or frameworks at runtime via reflection.

**Built-in Java annotations:**
| Annotation | Where | Purpose |
|---|---|---|
| \`@Override\` | Method | Compiler verifies the method actually overrides a supertype method |
| \`@Deprecated\` | Anything | Marks as obsolete; triggers compiler warning on usage |
| \`@SuppressWarnings\` | Anything | Silences specific compiler warnings |
| \`@FunctionalInterface\` | Interface | Compiler enforces exactly one abstract method |
| \`@SafeVarargs\` | Method | Suppresses unchecked varargs warnings for generic types |

**Meta-annotations** (used when defining your own annotations):
| Meta-annotation | Meaning |
|---|---|
| \`@Target\` | Where can this annotation appear (METHOD, FIELD, TYPE, PARAMETER…) |
| \`@Retention\` | How long it survives: SOURCE → CLASS → RUNTIME |
| \`@Documented\` | Include in Javadoc output |
| \`@Inherited\` | Subclasses inherit the annotation |

**Frameworks heavily rely on annotations:**
- Spring: \`@Component\`, \`@Autowired\`, \`@RestController\`
- JPA/Hibernate: \`@Entity\`, \`@Column\`, \`@Id\`
- JUnit: \`@Test\`, \`@BeforeEach\`, \`@Mock\``,
  code: `// 1. @Override — safeguard against typos in method names
class Animal {
    public String sound() { return "..."; }
}

class Dog extends Animal {
    @Override
    public String sound() { return "Woof"; } // compiler checks this overrides something
    // without @Override, a typo like 'Sound()' would silently create a new method
}

// 2. @Deprecated — mark old APIs
@Deprecated(since = "11", forRemoval = true)
public static int oldMethod() { return 42; }

// 3. @SuppressWarnings — silence specific warnings
@SuppressWarnings("unchecked")
List items = new ArrayList();  // raw type warning suppressed

// 4. @FunctionalInterface — enforce single abstract method
@FunctionalInterface
interface Calculator {
    int compute(int a, int b);   // exactly one abstract method
    // adding a second abstract method would cause compile error
}
Calculator add = (a, b) -> a + b; // lambda works because it is @FunctionalInterface

// 5. Custom annotation
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)  // survives compilation, readable at runtime
@Target(ElementType.METHOD)          // can only annotate methods
public @interface Benchmark {
    String name() default "unnamed"; // element with default value
}

// Usage of custom annotation
class Service {
    @Benchmark(name = "fetchUser")
    public User findById(long id) { /* ... */ return null; }
}

// Reading it at runtime via reflection
Method m = Service.class.getMethod("findById", long.class);
Benchmark b = m.getAnnotation(Benchmark.class);
System.out.println(b.name()); // "fetchUser"`,
  points: [
    '@Override should always be used — if you rename the parent method, the compiler immediately flags orphaned overrides',
    '@FunctionalInterface is a documentation + enforcement annotation — the interface works as a functional interface either way, but the annotation makes it explicit',
    'RetentionPolicy.SOURCE: discarded after compile (e.g. @Override). CLASS: in bytecode but not at runtime. RUNTIME: readable via reflection (Spring, JUnit, Hibernate all use this)',
    'Annotations are not comments — frameworks read them at runtime using reflection to drive behaviour',
    'Spring, Hibernate, and JUnit are essentially annotation processors — understanding annotations unlocks understanding those frameworks',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between @Override and not using it?\nA: @Override triggers a compiler check that the method actually overrides something from a parent class or interface. Without it, a typo (e.g., toString vs tostring) silently creates a new method instead of overriding, and the bug only appears at runtime. Always use @Override — it is free safety.',
    },
    {
      type: 'gotcha',
      content: 'Custom annotations with RetentionPolicy.CLASS (the default) are NOT available at runtime. If your framework reads annotations via reflection and they disappear, check your @Retention — you almost certainly need RetentionPolicy.RUNTIME.',
    },
    {
      type: 'tip',
      content: 'You can stack multiple annotations on the same element: @Override, @Deprecated, and @SuppressWarnings can all appear above the same method. Annotation order has no semantic effect.',
    },
  ],
}
