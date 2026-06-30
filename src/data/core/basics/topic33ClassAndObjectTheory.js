export default {
  id: 'class-and-object-theory',
  title: '33. Class and Object Theory',
  explanation: `A **class** is a blueprint — a user-defined template that describes the properties (fields) and behaviors (methods) that every object created from it will have. An **object** is a concrete instance of that blueprint, allocated on the heap at runtime.

**Class anatomy:**
\`\`\`java
class Car {          // class declaration
    String color;    // field (state)
    int speed;
    void accelerate() { speed += 10; }  // method (behavior)
}
\`\`\`

**Why classes exist:**
- **Encapsulation** — bundle data and the code that operates on it together
- **Reusability** — define once, instantiate many times
- **Abstraction** — hide internal complexity behind a clean API

**Key terminology:**
- **Class** = template / blueprint
- **Object** = instance = a concrete value in memory
- **Field** = instance variable = the state of an object
- **Method** = instance function = the behavior of an object
- **Constructor** = special method called at object creation to initialize fields

**Object lifecycle:**
1. **Declaration:** \`Car myCar;\` — a reference variable (currently \`null\`)
2. **Instantiation:** \`new Car()\` — allocates memory on the heap
3. **Initialization:** the constructor sets initial field values
4. **Usage:** call methods, access fields via the reference
5. **GC:** JVM reclaims memory when no more references point to the object

In Java, **everything that is not a primitive** is an object (or a reference to one). Strings, arrays, and all library classes are objects.`,
  code: `// Class definition — the blueprint
class Dog {
    // Fields: each Dog instance has its own copy
    String name;
    String breed;
    int age;

    // Method: behavior shared by all Dog instances
    void bark() {
        System.out.println(name + " says: Woof!");
    }

    void info() {
        System.out.println(name + " (" + breed + "), age " + age);
    }
}

public class ClassObjectTheory {
    public static void main(String[] args) {
        // Instantiate two independent objects from the same class
        Dog d1 = new Dog();
        d1.name = "Rex";
        d1.breed = "Labrador";
        d1.age = 3;

        Dog d2 = new Dog();
        d2.name = "Bella";
        d2.breed = "Poodle";
        d2.age = 5;

        d1.bark();   // Rex says: Woof!
        d2.info();   // Bella (Poodle), age 5

        // d1 and d2 are independent — changing one does not affect the other
        d1.age = 4;
        System.out.println(d2.age); // still 5
    }
}`,
  codeTitle: 'Class Blueprint and Object Instances',
  points: [
    'A class is a compile-time blueprint; an object is a runtime instance allocated on the heap',
    'Each object has its own copy of instance fields but shares the class methods',
    'Object references are variables that hold the memory address of the object — they live on the stack',
    'Multiple references can point to the same object; changing the object through one reference is visible through all others',
    'The JVM garbage-collects objects when their reference count reaches zero (no live references)',
    'Java is purely object-oriented for user types — all non-primitive values are objects',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Think of a class as a cookie-cutter and objects as the cookies. The cutter defines the shape; each cookie is a separate thing with its own dough. Changing one cookie does not affect the others.',
    },
    {
      type: 'gotcha',
      content: 'Dog d2 = d1 does NOT create a new object — it makes d2 point to the same object as d1. Modifying d2.name also changes what d1 sees. To get an independent copy, you need to create a new object and copy fields manually (or implement clone()).',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a class and an object?\nA: A class is the static definition (blueprint) written in source code. An object is a dynamic, heap-allocated instance created from that blueprint at runtime using new.',
    },
  ],
}
