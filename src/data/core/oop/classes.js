export default {
  id: 'classes-objects',
  title: '1. Classes, Objects & Constructors',
  explanation: `A **class** is a blueprint that defines state (fields) and behavior (methods). An **object** is a runtime instance of that blueprint created with new.

**Constructor rules:**
- Same name as class, no return type
- If you define NO constructor, Java provides a free default (no-arg) constructor
- The moment you define ANY constructor, the default disappears
- Constructors are NOT inherited`,
  code: `public class Car {
    // Instance state — each object has its own copy
    private String brand;
    private int year;

    // Class state — shared across all instances
    private static int totalCars = 0;

    // No-arg constructor — delegates to parameterized via this()
    public Car() {
        this("Unknown", 2024);   // must be FIRST statement
    }

    // Parameterized constructor
    public Car(String brand, int year) {
        this.brand = brand;      // 'this' disambiguates field vs param
        this.year  = year;
        totalCars++;
    }

    // Copy constructor — convention, not a Java keyword
    public Car(Car other) {
        this(other.brand, other.year);
    }

    public String getBrand()        { return brand; }
    public void   setBrand(String b){ this.brand = b; }

    // Access class-level state through class name
    public static int getTotalCars() { return totalCars; }

    @Override
    public String toString() {
        return "Car[" + brand + ", " + year + "]";
    }
}

Car c1 = new Car("Toyota", 2022);
Car c2 = new Car(c1);              // deep copy via copy constructor
System.out.println(c1);            // Car[Toyota, 2022]
System.out.println(Car.getTotalCars()); // 2`,
  points: [
    'this() calls another constructor in the same class — must be the first statement',
    'super() calls the parent constructor — also must be the first statement',
    'You cannot have both this() AND super() in the same constructor',
    'toString() is automatically called by println() and string concatenation',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: Can a constructor be private?\nA: Yes! Private constructors prevent instantiation from outside the class. Used in: Singleton pattern (only one instance), utility classes (Math, Collections), factory method pattern where creation is controlled.',
    },
    {
      type: 'gotcha',
      content: 'If you add a parameterized constructor and still need no-arg construction, you MUST explicitly add the no-arg constructor. The compiler does NOT add it automatically once any constructor exists.',
    },
  ],
}
