export default {
  id: 'hibernate-jpa',
  title: '1. JPA & Hibernate — Object-Relational Mapping',
  explanation: `**JPA** (Jakarta Persistence API) is the standard Java ORM specification. **Hibernate** is its most popular implementation. Together they let you work with Java objects instead of SQL — the framework generates the SQL for you.

**Core concepts:**
- **Entity** — a Java class mapped to a database table (\`@Entity\`)
- **EntityManager** — the JPA equivalent of JDBC Connection — manages the persistence context
- **Persistence Context** — a first-level cache. Managed entities are tracked; changes are automatically synced on commit.`,
  table: {
    headers: ['JPA Annotation', 'Purpose'],
    rows: [
      ['@Entity', 'Marks class as a DB table'],
      ['@Table(name="t")', 'Custom table name'],
      ['@Id', 'Primary key field'],
      ['@GeneratedValue', 'Auto-generate PK (IDENTITY, SEQUENCE, AUTO)'],
      ['@Column', 'Map field to column (name, nullable, unique, length)'],
      ['@OneToMany / @ManyToOne', 'Relationship mappings'],
      ['@ManyToMany', 'Many-to-many (join table)'],
      ['@Transient', 'Field NOT persisted to DB'],
    ],
  },
  code: `import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

// ── Entity mapping ─────────────────────────────────────────────────────────
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // DB auto-increment
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Transient  // computed — not stored in DB
    private String displayName;

    // @OneToMany — one User has many Orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    // JPA requires no-arg constructor
    protected User() {}
    public User(String name, String email) {
        this.name = name; this.email = email;
        this.createdAt = LocalDateTime.now();
    }
    // getters/setters...
}

@Entity
@Table(name = "orders")
class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)       // lazy — don't load User unless accessed
    @JoinColumn(name = "user_id")            // FK column in orders table
    private User user;

    private double amount;

    protected Order() {}
    Order(User user, double amount) { this.user = user; this.amount = amount; }
}

// ── Spring Data JPA — eliminates boilerplate ──────────────────────────────
// Just declare an interface — Spring generates the implementation
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    // Derived query — Spring parses method name to generate SQL
    List<User> findByName(String name);
    List<User> findByNameAndEmail(String name, String email);
    List<User> findByNameContainingIgnoreCase(String keyword);
    boolean existsByEmail(String email);
    long countByName(String name);
    void deleteByEmail(String email);

    // JPQL — object-oriented query language (uses class/field names, not table/column)
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain%")
    List<User> findByEmailDomain(@Param("domain") String domain);

    // Native SQL — when JPQL isn't enough
    @Query(value = "SELECT * FROM users WHERE created_at > NOW() - INTERVAL 7 DAY",
           nativeQuery = true)
    List<User> findRecentUsers();
}

// ── Using the repository in a service ────────────────────────────────────
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) { this.repo = repo; }

    @Transactional
    public User createUser(String name, String email) {
        if (repo.existsByEmail(email)) throw new IllegalArgumentException("Email taken");
        return repo.save(new User(name, email));
    }

    public List<User> searchByName(String keyword) {
        return repo.findByNameContainingIgnoreCase(keyword);
    }
}`,
  points: [
    'FetchType.LAZY (default for @OneToMany) loads related entities only when accessed — EAGER loads them always. Use LAZY by default; EAGER can cause N+1 problems.',
    'N+1 problem: loading 100 users then accessing user.getOrders() fires 100 extra queries. Fix with @EntityGraph or JOIN FETCH in JPQL.',
    '@Transactional on a method starts a transaction on entry and commits on exit (or rolls back on RuntimeException). Required for any write operation.',
    'Spring Data JPA\'s JpaRepository includes save(), findById(), findAll(), delete(), count() — you get CRUD for free.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the N+1 query problem in Hibernate?\nA: If you load N entities and then access a lazy-loaded collection on each, Hibernate fires 1 query to load the parents + N queries to load each child collection = N+1 queries. Fix: use JOIN FETCH in JPQL ("SELECT u FROM User u JOIN FETCH u.orders") or @EntityGraph to load both in one query.',
    },
    {
      type: 'gotcha',
      content: '@Transactional on private methods does nothing — Spring\'s AOP proxy cannot intercept private method calls. The @Transactional annotation only works on public methods called from outside the bean (i.e., not self-invocation within the same class).',
    },
  ],
}
