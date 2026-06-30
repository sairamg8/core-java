export default {
  id: 'class-and-object-practical',
  title: '34. Class and Object Practical',
  explanation: `This topic puts theory into practice: writing a complete class with fields, methods, and a main method, and understanding how Java executes object-oriented code end to end.

**Practical checklist for every class:**
1. Define **fields** with appropriate types and access modifiers
2. Write a **constructor** to initialize required fields
3. Write **methods** that operate on the fields
4. In \`main\`, create object instances with \`new\` and call methods

**Access via the dot operator:**
\`\`\`java
ClassName ref = new ClassName();
ref.fieldName    // access a field
ref.methodName() // call a method
\`\`\`

**Stack vs Heap — what goes where:**
- **Stack:** local variables, method parameters, reference variables (e.g., \`Student s\`)
- **Heap:** the actual object data (all fields of \`Student\`)

When you write \`Student s = new Student("Alice", 20);\`:
- \`s\` is a reference on the stack
- The \`Student\` object with \`name="Alice"\` and \`age=20\` lives on the heap

**Multiple objects — each is independent:**
Creating two \`Student\` objects gives two separate blocks of memory on the heap. Modifying one has no effect on the other unless they reference the same nested object.

**Null reference:**
A reference that has never been assigned (or was set to \`null\`) points to nothing. Calling a method on it throws \`NullPointerException\`. Always initialize references before use.`,
  code: `// A real-world class with fields, constructor, and methods
class Student {
    String name;
    int age;
    double gpa;

    // Constructor: called by 'new Student(...)'
    Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }

    void displayInfo() {
        System.out.println("Name: " + name + " | Age: " + age + " | GPA: " + gpa);
    }

    boolean isHonorRoll() {
        return gpa >= 3.5;
    }
}

public class ClassObjectPractical {
    public static void main(String[] args) {
        // Create objects on the heap; references on the stack
        Student s1 = new Student("Alice", 20, 3.8);
        Student s2 = new Student("Bob", 22, 2.9);

        s1.displayInfo();   // Name: Alice | Age: 20 | GPA: 3.8
        s2.displayInfo();   // Name: Bob   | Age: 22 | GPA: 2.9

        System.out.println(s1.name + " honor roll: " + s1.isHonorRoll()); // true
        System.out.println(s2.name + " honor roll: " + s2.isHonorRoll()); // false

        // Reference copy — NOT a new object
        Student s3 = s1;   // s3 and s1 point to the same object
        s3.age = 21;
        System.out.println(s1.age); // 21 — same object!

        // Null reference pitfall
        Student s4 = null;
        // s4.displayInfo(); // would throw NullPointerException
    }
}`,
  codeTitle: 'Class with Constructor, Methods, and Object Lifecycle',
  points: [
    'Write fields at class level (not inside methods) so they persist as long as the object lives',
    'Use this.fieldName inside constructors and methods to disambiguate field names from parameter names',
    'new creates a heap object and returns a reference to it — store that reference in a typed variable',
    'Reference assignment (s3 = s1) makes two variables point to the same heap object — mutation through either is visible in both',
    'Always check for null before calling a method on a reference that might not be initialized',
    'The toString() method (from Object) is called implicitly when you use an object in string concatenation',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'NullPointerException (NPE) is one of the most common Java runtime errors. It happens when you call a method or access a field on a null reference. Validate input references and initialize fields in constructors.',
    },
    {
      type: 'tip',
      content: 'Override toString() in every class to get readable debug output. Without it, printing an object gives something like Student@7d4991ad, which is the hashCode, not useful information.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a reference and an object?\nA: A reference is a variable (stack) that holds the memory address of an object. The object is the actual data (heap). Two references can point to the same object.',
    },
  ],
}
