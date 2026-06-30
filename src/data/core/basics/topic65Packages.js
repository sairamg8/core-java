export default {
  id: 'packages',
  title: '65. Packages',
  explanation: `A **package** is a namespace that organizes related classes and interfaces. It prevents name collisions and controls access with package-private visibility.

**Package declaration:**
\`\`\`java
package com.example.app; // first line of every file in this package
\`\`\`

**Import:**
\`\`\`java
import java.util.ArrayList;   // import specific class
import java.util.*;            // import all (wildcard — fine for one package)
import static java.lang.Math.sqrt; // static import
\`\`\`

**java.lang is auto-imported** — String, System, Math, Object, Integer, etc. are always available.

**Package naming convention:**
- All lowercase, reverse domain: \`com.company.project.module\`
- Never uppercase or underscores (exception: legacy code)
- Examples: \`com.google.gson\`, \`org.springframework.core\`, \`java.util\`

**Access modifiers and package visibility:**
| Modifier | Same class | Same package | Subclass | All |
|----------|-----------|-------------|----------|-----|
| public | Yes | Yes | Yes | Yes |
| protected | Yes | Yes | Yes (subclass) | No |
| (none) | Yes | Yes | No | No |
| private | Yes | No | No | No |

Package-private (no modifier) is the default — accessible only within the same package.

**Why packages matter:**
- **Organization** — group related types (com.app.model, com.app.service)
- **Encapsulation** — hide internal helpers as package-private
- **Prevent name collisions** — two libraries can have a class named \`User\`
- **Modular deployment** — package = unit of JAR organization`,
  code: `// File: src/com/example/app/Main.java
package com.example.app;

import java.util.ArrayList;
import java.util.List;
import static java.lang.Math.PI; // static import

// import com.example.model.User; // if User is in another package

public class Main {
    public static void main(String[] args) {
        // java.lang auto-imported
        String s = "Hello Java";
        System.out.println(s.toUpperCase());
        System.out.println("PI = " + PI); // Math.PI via static import

        // Classes from same package are directly accessible
        Helper h = new Helper(); // no import needed — same package
        h.doWork();

        // Classes from different packages need import or FQCN
        List<String> list = new ArrayList<>(); // import java.util.List;
        java.util.Date d = new java.util.Date(); // FQCN without import

        list.add("one"); list.add("two");
        System.out.println(list);
    }
}

class Helper { // package-private class: only visible inside com.example.app
    void doWork() { System.out.println("Helper doing work"); }
}`,
  codeTitle: 'Package Declaration, Imports, and Access Visibility',
  points: [
    'Package declaration must be the first statement in a file (before imports and class); omitting it puts the class in the unnamed default package',
    'java.lang is always auto-imported; all other packages require explicit imports or fully-qualified class names',
    'Package-private (no modifier) is the default access level — more restrictive than protected, less than private',
    'Reverse domain package naming (com.company.project) prevents collisions between libraries with classes of the same name',
    'Static imports (import static) let you use static members without the class prefix: sqrt(4) instead of Math.sqrt(4)',
    'Each .java file must match its declared package directory structure: com/example/app/Main.java for package com.example.app',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The default (no-modifier) package-private access is NOT the same as protected. Protected allows subclasses outside the package; package-private does not. They are easy to confuse in interviews.',
    },
    {
      type: 'tip',
      content: 'Wildcard imports (import java.util.*) import all classes from a package but NOT sub-packages. import java.util.* does NOT import java.util.concurrent.* — you need a separate import for that.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between protected and package-private access?\nA: Package-private (no modifier) means accessible only within the same package. Protected means accessible within the same package AND by subclasses in any package. Protected is more permissive than package-private.',
    },
  ],
}
