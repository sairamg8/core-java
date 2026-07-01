export default {
  id: 'creating-a-spring-jdbc-project',
  title: '349. Creating a Spring JDBC Project',
  explanation: `Setting up a Spring JDBC project (with Spring Boot) is mostly about **dependencies + a datasource configuration**; Boot auto-configures the rest.

**1. Dependencies** — in \`pom.xml\` add the JDBC starter and a database driver:
\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
\`\`\`
The starter pulls in \`spring-jdbc\`, a connection pool (HikariCP), and transaction support.

**2. Datasource config** — in \`application.properties\`. Boot reads these and builds a pooled \`DataSource\` and a \`JdbcTemplate\` automatically:
\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/school
spring.datasource.username=postgres
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver
\`\`\`

**3. Inject \`JdbcTemplate\`** — you do **not** create it; Boot already registered the bean. Just autowire it into a \`@Repository\`:
\`\`\`java
@Repository
public class StudentRepository {
    private final JdbcTemplate jdbc;
    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
}
\`\`\`

**4. (Optional) schema/seed data** — put \`schema.sql\` and \`data.sql\` on the classpath and Boot runs them at startup, handy for an embedded H2 database in tests.

**Plain Spring (no Boot) equivalent:** you would define the \`DataSource\` and \`JdbcTemplate\` yourself as \`@Bean\` methods and read properties via \`@PropertySource\`/\`\${...}\` placeholders. Boot removes that with auto-configuration (see [[spring-jdbc-introduction]]).

**The payoff:** three dependencies and four properties, and you have a fully wired, connection-pooled data-access setup ready to run SQL through \`JdbcTemplate\`.`,
  code: `// application.properties
// spring.datasource.url=jdbc:postgresql://localhost:5432/school
// spring.datasource.username=postgres
// spring.datasource.password=secret

@SpringBootApplication
public class SchoolApp {
    public static void main(String[] args) {
        SpringApplication.run(SchoolApp.class, args);
    }
}

// Boot auto-configured a DataSource + JdbcTemplate; just inject and use it.
@Repository
public class StudentRepository {
    private final JdbcTemplate jdbc;
    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public int count() {
        return jdbc.queryForObject("select count(*) from student", Integer.class);
    }
}

// Plain-Spring alternative (no Boot): define beans yourself
@Bean
public JdbcTemplate jdbcTemplate(DataSource ds) { return new JdbcTemplate(ds); }`,
  codeTitle: 'Dependencies, datasource, and injected JdbcTemplate',
  points: [
    'Add spring-boot-starter-jdbc plus a database driver dependency to start a Spring JDBC project',
    'Configure the datasource url, username, and password in application.properties',
    'Spring Boot auto-configures a pooled DataSource and a JdbcTemplate bean from those properties',
    'Inject the ready-made JdbcTemplate into a @Repository — you do not construct it yourself',
    'Without Boot you declare the DataSource and JdbcTemplate as @Bean methods manually',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How do you set up a Spring JDBC project with Spring Boot?\nA: Add the spring-boot-starter-jdbc dependency and a database driver, then configure spring.datasource.url, username, and password in application.properties. Boot auto-configures a pooled DataSource and a JdbcTemplate bean, which you inject into a @Repository to run SQL. Optional schema.sql and data.sql files on the classpath initialise the database at startup.',
    },
    {
      type: 'tip',
      content: 'You almost never create the JdbcTemplate yourself in a Boot app — auto-configuration already registered it from your datasource properties. Just inject it. Defining your own DataSource/JdbcTemplate beans is only needed for custom pools or in a non-Boot Spring application.',
    },
  ],
}
