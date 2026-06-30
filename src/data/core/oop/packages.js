export default {
  id: 'packages',
  title: 'Packages & Import',
  explanation: `A **package** is a namespace that groups related classes and interfaces. It prevents naming conflicts and controls access (package-private visibility).

**Package declaration**
Must be the very first statement in a .java file (before imports):
\`\`\`java
package com.company.project.module;
\`\`\`

**Importing classes**
\`\`\`java
import java.util.List;          // single class import
import java.util.*;             // wildcard — all classes in java.util
import static java.lang.Math.*; // static import — use sqrt() without Math.
\`\`\`

**Fully qualified name (no import)**
\`\`\`java
java.util.ArrayList list = new java.util.ArrayList();
\`\`\`
Used when two packages contain a class with the same name (e.g., \`java.util.Date\` vs \`java.sql.Date\`).

**Default package**
If you omit the package declaration, the class belongs to the unnamed default package. Avoid this in real projects — classes in the default package cannot be imported by classes in named packages.

**Directory structure = package structure**
\`com.example.util\` must be stored at \`src/com/example/util/ClassName.java\`. Build tools (Maven, Gradle) enforce this.`,
  code: `// File: src/com/example/banking/BankAccount.java
package com.example.banking;         // 1. Package declaration — first line

import java.util.List;               // 2. Imports — after package, before class
import java.util.ArrayList;

public class BankAccount {
    private String owner;
    private List<Double> transactions = new ArrayList<>();

    public BankAccount(String owner) {
        this.owner = owner;
    }

    public void deposit(double amount) {
        transactions.add(amount);
    }
}

// ---

// File: src/com/example/app/Main.java
package com.example.app;

import com.example.banking.BankAccount; // import from another package

// static import — lets you use sqrt() without Math.
import static java.lang.Math.sqrt;

public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice");
        account.deposit(1000);

        System.out.println(sqrt(144));   // 12.0 — no Math. prefix needed
    }
}

// When two packages share a class name, use fully qualified name
java.util.Date utilDate = new java.util.Date();
java.sql.Date sqlDate   = new java.sql.Date(System.currentTimeMillis());`,
  points: [
    'Package declaration is the first statement (before imports, before class definition)',
    'java.lang is imported automatically — String, System, Math, etc. never need an explicit import',
    'Wildcard import (.*) does NOT import sub-packages — java.util.* does not import java.util.concurrent.*',
    'Package-private (no access modifier) means accessible only within the same package',
    'Package name follows reverse domain convention to guarantee uniqueness globally',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between import java.util.* and import java.util.List?\nA: Functionally the same — wildcard does NOT cause performance problems at runtime (classes are loaded lazily). However, explicit imports are preferred in production code because they make dependencies visible and prevent accidental use of same-named classes from different packages.',
    },
    {
      type: 'gotcha',
      content: 'If you have both java.util.Date and java.sql.Date in the same file, you cannot import both. Import one and use the fully qualified name for the other: java.sql.Date sqlDate = new java.sql.Date(...).',
    },
    {
      type: 'tip',
      content: 'Classes in java.lang (String, Integer, Object, Math, System, Thread...) are ALWAYS available without any import. This is the only package Java auto-imports.',
    },
  ],
}
