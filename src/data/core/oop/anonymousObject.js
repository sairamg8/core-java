export default {
  id: 'anonymous-object',
  title: 'Anonymous Objects',
  explanation: `An **anonymous object** is an object created with \`new\` but not assigned to a variable. It has no name — you use it once and discard it.

**Syntax:**
\`\`\`
new ClassName().methodName();
\`\`\`

**When to use it:**
- You need to call a method on an object exactly once and never reference that object again
- You want to pass a freshly-created object directly to a method as an argument

**When NOT to use it:**
- When you need to call multiple methods on the same object (you would create a new instance each time)
- When you need to store or compare the object later

Anonymous objects are immediately eligible for garbage collection after the statement completes, since there is no reference pointing to them.`,
  code: `public class Car {
    private String brand;

    public Car(String brand) {
        this.brand = brand;
    }

    public void drive() {
        System.out.println(brand + " is driving");
    }

    public String getBrand() {
        return brand;
    }
}

// ✅ Anonymous object — one-liner, no variable
new Car("Toyota").drive();     // "Toyota is driving"
                               // object created, method called, then GC-eligible

// ✅ Passing an anonymous object to a method
public static void printBrand(Car car) {
    System.out.println(car.getBrand());
}
printBrand(new Car("Honda")); // "Honda"

// ❌ WRONG — multiple calls on same anonymous object
//    Each new Car("BMW") creates a DIFFERENT object
new Car("BMW").drive();       // first object
new Car("BMW").getBrand();    // second (different) object — wasteful!

// ✅ RIGHT — use a variable when you need multiple calls
Car myCar = new Car("BMW");
myCar.drive();
myCar.getBrand();`,
  points: [
    'Anonymous objects are garbage collected immediately after the statement — no reference keeps them alive',
    'Use anonymous objects only when calling a single method and discarding the result',
    'Passing new SomeClass() directly to a method argument is a clean, common pattern',
    'Each new ClassName() creates a brand new object — calling it twice creates two objects, not one',
    'Inner anonymous classes (used with interfaces) are a related but different concept covered in innerClasses',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is an anonymous object and when should you use it?\nA: An object created without storing a reference (new Car().drive()). Use it when you need an object for a single operation and will never refer to it again. It is immediately eligible for garbage collection after use. If you need two or more operations on the same object, use a named variable instead.',
    },
    {
      type: 'gotcha',
      content: 'new Car("BMW").drive() and new Car("BMW").getBrand() are two SEPARATE objects. This is the most common mistake with anonymous objects — people assume the second call reuses the first object, but it creates a fresh instance.',
    },
  ],
}
