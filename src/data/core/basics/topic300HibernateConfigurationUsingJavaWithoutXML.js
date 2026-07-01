export default {
  id: 'hibernate-configuration-using-java-without-xml',
  title: '300. Hibernate Configuration Using Java Without XML',
  explanation: `You do not have to use \`hibernate.cfg.xml\`. Hibernate can be configured entirely in **Java code**, setting the same properties programmatically. This is common in code-first projects, in tests, and anywhere you prefer type-checked configuration over an XML file.

**The idea:**
Instead of reading properties from XML, you build a \`Configuration\` (or the newer bootstrap API) in Java, call \`setProperty(...)\` for each setting, register annotated classes with \`addAnnotatedClass(...)\`, and then \`buildSessionFactory()\`.

**The properties you set are identical** to the XML ones — only the mechanism differs:
- \`hibernate.connection.driver_class\`
- \`hibernate.connection.url\`
- \`hibernate.connection.username\` / \`password\`
- \`hibernate.dialect\`
- \`hibernate.hbm2ddl.auto\`
- \`hibernate.show_sql\`

**Two Java-based approaches:**
1. **Configuration API (simplest):** \`new Configuration().setProperty(...).addAnnotatedClass(...).buildSessionFactory()\`. Easy and readable.
2. **ServiceRegistry + Metadata (modern/advanced):** \`StandardServiceRegistryBuilder\` + \`MetadataSources\` → \`buildMetadata().buildSessionFactory()\`. More flexible and the officially recommended bootstrap for fine-grained control.

**Pros of Java config:**
- **Type safety** — errors surface at compile time, not as runtime XML parse failures.
- **Dynamic values** — read settings from environment variables, a secrets manager, or system properties at runtime.
- **No separate file to ship** — everything is in code.

**Cons:**
- Recompilation needed to change settings (unless you externalize values).
- Slightly more verbose than a declarative XML file.

**In practice:**
Frameworks like Spring Boot configure Hibernate entirely without \`hibernate.cfg.xml\` — they set these same properties from \`application.properties\`/\`application.yml\` and build the \`EntityManagerFactory\` in Java. So understanding Java-based configuration demystifies how Spring Boot wires Hibernate for you.`,
  code: `// Approach 1: the Configuration API — no hibernate.cfg.xml at all
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    public static SessionFactory buildSessionFactory() {
        Configuration cfg = new Configuration();

        // Same properties you'd put in hibernate.cfg.xml, set in Java:
        cfg.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
        cfg.setProperty("hibernate.connection.url", "jdbc:mysql://localhost:3306/school");
        cfg.setProperty("hibernate.connection.username", "root");
        cfg.setProperty("hibernate.connection.password", "secret");
        cfg.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        cfg.setProperty("hibernate.hbm2ddl.auto", "update");
        cfg.setProperty("hibernate.show_sql", "true");

        // Register entities in code instead of <mapping class="..."/>
        cfg.addAnnotatedClass(Student.class);

        return cfg.buildSessionFactory();
    }
}

// Approach 2 (modern): ServiceRegistry + Metadata
StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
        .applySetting("hibernate.connection.url", "jdbc:mysql://localhost:3306/school")
        .applySetting("hibernate.dialect", "org.hibernate.dialect.MySQLDialect")
        // ... other settings ...
        .build();
SessionFactory sf = new MetadataSources(registry)
        .addAnnotatedClass(Student.class)
        .buildMetadata()
        .buildSessionFactory();`,
  codeTitle: 'Configuring Hibernate purely in Java',
  points: [
    'Hibernate can be configured entirely in Java, setting the same properties programmatically instead of in XML',
    'The Configuration API uses setProperty(...) and addAnnotatedClass(...) then buildSessionFactory()',
    'The modern approach uses StandardServiceRegistryBuilder + MetadataSources for fine-grained control',
    'Java config gives type safety and lets you inject dynamic values from env vars or a secrets manager',
    'Spring Boot configures Hibernate this way under the hood — no hibernate.cfg.xml, properties set from application.properties',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Java-based configuration shines for reading secrets at runtime. Instead of hard-coding a database password in hibernate.cfg.xml (which then lives in version control), read it from an environment variable — cfg.setProperty("hibernate.connection.password", System.getenv("DB_PASSWORD")) — keeping credentials out of your source tree.',
    },
    {
      type: 'interview',
      content: 'Q: Can you configure Hibernate without hibernate.cfg.xml?\nA: Yes. You can configure Hibernate entirely in Java using the Configuration API — calling setProperty for each setting and addAnnotatedClass for each entity — or the modern StandardServiceRegistryBuilder plus MetadataSources bootstrap. The properties are identical to the XML ones; only the mechanism differs. Spring Boot uses Java-based configuration internally, setting these properties from application.properties.',
    },
  ],
}
