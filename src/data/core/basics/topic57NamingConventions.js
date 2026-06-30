export default {
  id: 'naming-conventions',
  title: '57. Naming Conventions',
  explanation: `Java has widely adopted naming conventions that make code readable and consistent across millions of projects. These are not enforced by the compiler but are standard practice throughout the Java ecosystem.

**Class and Interface names:**
- **PascalCase** (UpperCamelCase)
- Start with a noun or adjective
- Examples: \`Car\`, \`BankAccount\`, \`UserService\`, \`Runnable\`, \`Serializable\`

**Method names:**
- **camelCase** (lowerCamelCase)
- Start with a verb
- Examples: \`calculateTax()\`, \`getName()\`, \`isActive()\`, \`setAge()\`, \`toString()\`

**Variable names (local and instance fields):**
- **camelCase**
- Descriptive but concise; avoid single letters except for loop counters
- Examples: \`studentName\`, \`totalCount\`, \`isValid\`, loop: \`i\`, \`j\`, \`k\`

**Constants (static final fields):**
- **UPPER_SNAKE_CASE**
- Examples: \`MAX_SIZE\`, \`DEFAULT_TIMEOUT\`, \`PI\`, \`HTTP_OK\`

**Package names:**
- **all lowercase**, reverse domain convention
- Examples: \`com.example.app\`, \`org.springframework.core\`, \`java.util\`

**Avoid:**
- Single-letter names (except loop counters \`i\`, \`j\`)
- Abbreviations that are not universally understood
- Underscores in class/variable names (reserved for constants)
- Hungarian notation (prefixing type: \`strName\`, \`intAge\`) — not Java style`,
  code: `// Package: com.example.billing (all lowercase)
package com.example.billing;

// Class: PascalCase noun
public class InvoiceProcessor {

    // Constant: UPPER_SNAKE_CASE
    private static final int MAX_LINE_ITEMS = 100;
    private static final double TAX_RATE = 0.18;

    // Instance field: camelCase
    private String customerName;
    private double totalAmount;
    private boolean isPaid;

    // Constructor: same as class name
    public InvoiceProcessor(String customerName) {
        this.customerName = customerName;
        this.totalAmount = 0.0;
        this.isPaid = false;
    }

    // Methods: camelCase verbs
    public void addLineItem(double amount) {
        if (totalAmount + amount > MAX_LINE_ITEMS * 1000) {
            System.out.println("Limit exceeded");
            return;
        }
        totalAmount += amount;
    }

    public double calculateTotalWithTax() {
        return totalAmount * (1 + TAX_RATE);
    }

    // Getter: getFieldName()
    public String getCustomerName() { return customerName; }

    // Boolean getter: isFieldName()
    public boolean isPaid() { return isPaid; }

    // Setter
    public void setPaid(boolean paid) { this.isPaid = paid; }

    // Main method: always this signature
    public static void main(String[] args) {
        InvoiceProcessor inv = new InvoiceProcessor("Alice Corp");
        inv.addLineItem(500);
        inv.addLineItem(250);
        System.out.println("Total: " + inv.calculateTotalWithTax());
    }
}`,
  codeTitle: 'Java Naming Conventions in a Complete Class',
  points: [
    'Classes/interfaces use PascalCase; methods and variables use camelCase; constants use UPPER_SNAKE_CASE; packages use all-lowercase',
    'Method names must start with a verb (action word): calculate, get, set, is, has, find, build, create',
    'Boolean getters use the is prefix (isActive(), isPaid()); non-boolean getters use get prefix (getName(), getAge())',
    'Package names follow reverse domain convention: com.companyname.projectname — use only lowercase and dots',
    'Single-letter variable names are acceptable for loop counters (i, j, k) and lambda parameters (x, n) — avoid elsewhere',
    'These conventions are enforced by code-review culture and static analysis tools (Checkstyle, PMD) in professional projects',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Your IDE enforces nothing, but Checkstyle does. Most enterprise Java projects run Checkstyle in CI. Learning conventions early means zero violations when your first PR is reviewed.',
    },
    {
      type: 'gotcha',
      content: 'Using getXxx() for a boolean field causes subtle Jackson/Spring issues. Jackson serializes isActive() to the key "active" but getActive() to the key "active" too — UNLESS the field is declared boolean (not Boolean). The is prefix is safest for primitive booleans.',
    },
    {
      type: 'interview',
      content: 'Q: What naming convention do Java constants follow?\nA: UPPER_SNAKE_CASE — all uppercase letters with underscores between words. They must also be declared static final. Example: private static final int MAX_RETRIES = 3.',
    },
  ],
}
