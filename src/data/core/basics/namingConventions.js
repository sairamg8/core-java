export default {
  id: 'naming-conventions',
  title: 'Naming Conventions',
  explanation: `Java has strict, universally-followed naming conventions. They are enforced by code style tools (Checkstyle) and expected in every interview and real-world codebase.

**By construct:**
| Construct | Convention | Example |
|---|---|---|
| Class / Interface / Enum | PascalCase | \`BankAccount\`, \`Runnable\` |
| Method / Variable | camelCase | \`getBalance()\`, \`accountId\` |
| Constant (static final) | UPPER_SNAKE_CASE | \`MAX_SIZE\`, \`PI\` |
| Package | all lowercase, reverse domain | \`com.company.util\` |
| Type Parameter (Generic) | Single uppercase letter | \`T\`, \`E\`, \`K\`, \`V\` |

**Key rules:**
- Class names are nouns (\`Car\`, \`UserService\`)
- Method names are verbs (\`drive()\`, \`calculateTax()\`)
- Boolean methods start with \`is\` / \`has\` / \`can\` (\`isEmpty()\`, \`hasPermission()\`)
- Avoid abbreviations unless universally known (\`url\`, \`id\`, \`num\`)`,
  code: `// ✅ CORRECT naming
package com.example.banking;          // all-lowercase package

public class BankAccount {            // PascalCase class
    private static final int MAX_OVERDRAFT = 500;  // UPPER_SNAKE constant
    private double balance;           // camelCase field

    public double getBalance() {      // verb method, camelCase
        return balance;
    }

    public boolean isEmpty() {        // boolean: 'is' prefix
        return balance == 0;
    }

    public void deposit(double amount) {
        this.balance += amount;
    }
}

// ❌ WRONG naming
public class bank_account { }         // never snake_case for class
double Balance = 100;                 // never uppercase start for variable
static final int maxoverdraft = 500;  // constants must be UPPER_SNAKE
void GetBalance() { }                 // methods don't start uppercase`,
  points: [
    'Packages use reverse domain names (com.google.guava) to avoid collisions across the globe',
    'PascalCase = capitalize EVERY word (BankAccount, not Bankaccount)',
    'camelCase = first word lowercase, subsequent words capitalized (myVariable)',
    'UPPER_SNAKE_CASE is ONLY for static final constants — do not use on regular variables',
    'Test methods often use underscores: methodName_whenCondition_thenExpectedBehavior',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Why does Java use reverse domain names for packages?\nA: To guarantee global uniqueness. Two different companies cannot both have com.example.util because domain names are unique. This avoids naming collisions when multiple libraries are combined in one project.',
    },
    {
      type: 'tip',
      content: 'If you see UPPER_SNAKE_CASE in a codebase, that identifier is guaranteed to be a static final constant — you know at a glance it cannot change at runtime. This is a huge readability benefit.',
    },
    {
      type: 'gotcha',
      content: 'Java is case-sensitive. String and string are different identifiers. string is not a valid type (it is lowercase) — only String (with capital S) is the class. This trips up developers coming from case-insensitive languages.',
    },
  ],
}
