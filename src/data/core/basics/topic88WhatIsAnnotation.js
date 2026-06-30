export default {
  id: 'what-is-annotation',
  title: '88. What Is an Annotation?',
  explanation: `Annotations are metadata tags that you can attach to Java code elements — classes, methods, fields, parameters, constructors, or packages. They do not change program logic directly but provide information to the compiler, the JVM at runtime, or annotation processing tools.

Java has three categories of annotations:
1. **Built-in Java annotations** — \`@Override\`, \`@Deprecated\`, \`@SuppressWarnings\`, \`@FunctionalInterface\`, etc.
2. **Meta-annotations** — annotations that annotate other annotations: \`@Target\`, \`@Retention\`, \`@Documented\`, \`@Inherited\`, \`@Repeatable\`.
3. **Custom annotations** — defined with \`@interface\`, used by frameworks and your own tools.

Annotations are declared with \`@interface\`. Their retention policy (where they survive — source, class, runtime) is set via \`@Retention\`. Their target (what elements they can annotate) is set via \`@Target\`. Frameworks like Spring, Hibernate, and JUnit rely heavily on runtime-retained annotations read via reflection.`,
  code: `import java.lang.annotation.*;

// 1. Built-in annotations
class Parent {
    public void greet() { System.out.println("Hello from Parent"); }
}

class Child extends Parent {
    @Override           // tells compiler to verify this overrides a superclass method
    public void greet() { System.out.println("Hello from Child"); }

    @Deprecated         // marks the method as obsolete
    public void oldMethod() { System.out.println("Old way"); }

    @SuppressWarnings("unchecked")  // suppresses compiler warnings
    public void uncheckedOp() {
        java.util.List list = new java.util.ArrayList();  // raw type warning suppressed
        list.add("test");
    }
}

// 2. Custom annotation
@Retention(RetentionPolicy.RUNTIME)   // available at runtime via reflection
@Target(ElementType.METHOD)           // can only be placed on methods
@interface MyAnnotation {
    String author() default "unknown";
    String version() default "1.0";
}

class Service {
    @MyAnnotation(author = "Alice", version = "2.1")
    public void process() {
        System.out.println("Processing...");
    }
}

// 3. Reading annotation at runtime
public class Demo {
    public static void main(String[] args) throws Exception {
        java.lang.reflect.Method m = Service.class.getMethod("process");
        MyAnnotation ann = m.getAnnotation(MyAnnotation.class);
        if (ann != null) {
            System.out.println("Author: " + ann.author());   // Author: Alice
            System.out.println("Version: " + ann.version()); // Version: 2.1
        }

        Child c = new Child();
        c.greet();  // Hello from Child
    }
}`,
  codeTitle: 'Annotations: Built-in, Custom, and Runtime Reading',
  points: [
    '@Override tells the compiler you intend to override a superclass method — it catches typos in method names',
    '@Deprecated marks an API as obsolete; the compiler warns callers',
    '@SuppressWarnings silences specific compiler warnings by category name',
    '@FunctionalInterface verifies that the annotated interface has exactly one abstract method',
    'Custom annotations are declared with @interface and can have elements (like attributes) with default values',
    '@Retention controls when the annotation survives: SOURCE (discarded), CLASS (in .class file), RUNTIME (accessible via reflection)',
    '@Target controls which code elements the annotation can be applied to',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Annotations with @Retention(RetentionPolicy.CLASS) are in the .class file but NOT accessible at runtime via reflection. If your framework reads annotations via reflection, you must use RetentionPolicy.RUNTIME.',
    },
    {
      type: 'interview',
      content: 'Q: How does Spring use annotations?\nA: Spring scans classpath for @Component, @Service, @Repository, @Controller classes and registers them as beans. @Autowired triggers dependency injection. @RequestMapping defines HTTP route handlers. All are read via reflection at application startup — this is why Spring beans must have RetentionPolicy.RUNTIME annotations.',
    },
    {
      type: 'tip',
      content: 'Always add @Override when you intend to override a method. If the parent changes its method signature, the compiler immediately flags your class rather than silently creating a new method that never gets called.',
    },
  ],
}
