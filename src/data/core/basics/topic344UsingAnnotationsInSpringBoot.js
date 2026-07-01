export default {
  id: 'using-annotations-in-spring-boot',
  title: '344. Using Annotations in Spring Boot',
  explanation: `Spring Boot is **annotation-first** — XML config is essentially gone. You describe beans, wiring, and configuration entirely with annotations, and Boot scans and wires them at startup.

**The entry-point annotation — \`@SpringBootApplication\`:** placed on the main class, it is a meta-annotation combining three:
- **\`@Configuration\`** — the class can define \`@Bean\` methods.
- **\`@EnableAutoConfiguration\`** — turns on Boot's auto-configuration.
- **\`@ComponentScan\`** — scans the main class's package **and everything below it** for stereotypes.

\`\`\`java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

**The everyday annotations you actually use:**
- **\`@Component\` / \`@Service\` / \`@Repository\` / \`@Controller\` / \`@RestController\`** — declare beans by layer (see [[component-stereotype-annotation]]).
- **\`@Autowired\`** — inject dependencies (often omitted on a single constructor).
- **\`@Value\` / \`@ConfigurationProperties\`** — pull settings from \`application.properties\`.
- **\`@Bean\` inside \`@Configuration\`** — register beans for classes you cannot annotate.
- **\`@Qualifier\` / \`@Primary\`** — resolve ambiguity.

**The package-structure rule that trips people up:** \`@ComponentScan\` starts at the main class's package. So keep your main class in a **root package** (e.g. \`com.example\`) with all other classes in sub-packages (\`com.example.service\`, \`com.example.repository\`). A bean in a package **outside** that tree is **not scanned** and never created.

The net effect: put the right annotation on each class, keep the package layout sane, and Boot assembles the whole application graph with no XML.`,
  code: `// Root package com.example — everything below is scanned
package com.example;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

package com.example.repository;
@Repository
public class StudentRepository { }

package com.example.service;
@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) {   // @Autowired optional
        this.repo = repo;
    }
}

// A class in com.other.util would NOT be scanned -> no bean created`,
  codeTitle: '@SpringBootApplication and scanned packages',
  points: [
    '@SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan',
    'Component scanning starts at the main class package and covers all sub-packages',
    'Beans are declared with stereotype annotations and wired with @Autowired',
    'Configuration values come from @Value or @ConfigurationProperties instead of XML',
    'Keep the main class in a root package so every component lies below it and gets scanned',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What does @SpringBootApplication do?\nA: It is a meta-annotation on the main class that combines @Configuration (allowing @Bean methods), @EnableAutoConfiguration (turning on classpath-based auto-configuration), and @ComponentScan (scanning the main class package and its sub-packages for stereotypes). Together they let Boot discover and wire the whole application from annotations with no XML.',
    },
    {
      type: 'gotcha',
      content: 'Because component scanning begins at the main class package, a @Service or @Repository placed in a package outside that tree is never detected and its bean is never created — leading to a confusing NoSuchBeanDefinitionException. Keep the main class in a top-level root package with all components beneath it.',
    },
  ],
}
