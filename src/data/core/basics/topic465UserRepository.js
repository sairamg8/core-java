export default {
  id: 'user-repository',
  title: '465. User Repository',
  explanation: `The \`UserDetailsServiceImpl\` written in the previous topic (see [[creating-a-userdetailsservice]]) calls \`userRepository.findByUsername(username)\` — this topic writes that repository, the last missing piece connecting the \`User\` entity (see [[creating-user-table-and-db-properties]]) to the database.

**The repository itself — almost entirely boilerplate, following the exact pattern already used for \`JobRepository\` (see [[spring-data-jpa-introduction]]):**
\`\`\`java
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
\`\`\`

**Why \`findByUsername\` needs to be declared explicitly, unlike \`findById\` which \`JpaRepository\` already provides.** \`JpaRepository<User, Integer>\` gives \`findById(Integer id)\` for free because it's part of the generic base interface — but looking up by \`username\` is specific to this entity, so it's declared as a **derived query method** (see [[jpa-query-dsl]] from the earlier JPA chapter), and Spring Data JPA generates the underlying \`SELECT * FROM app_user WHERE username = ?\` implementation automatically from the method name alone — no query is written by hand.

**Why the return type is \`Optional<User>\`, and why that matters specifically for \`UserDetailsServiceImpl\`.** A username that doesn't exist is an entirely expected, routine outcome (someone mistyping their username, or a first-time login attempt) — not an exceptional situation the database layer itself should throw an error for. \`Optional<User>\` makes "might not be found" explicit in the method signature, and \`.orElseThrow(() -> new UsernameNotFoundException(...))\` in the calling code (already written in the previous topic) is exactly where that "not found" case gets turned into the specific exception Spring Security's \`AuthenticationProvider\` expects.

**The full picture now complete, end to end:** login submits a username/password → \`AuthenticationProvider\` (see [[authenticationprovider]]) delegates to \`UserDetailsServiceImpl\` → which calls this \`UserRepository\` → which queries the real \`app_user\` table → returns a \`User\`, adapted into \`UserDetails\`, whose stored BCrypt hash gets compared against the submitted password. Every piece introduced since [[getting-ready-for-user-database]] now connects into one working, database-backed login flow — replacing the single hardcoded user from earlier in this chapter entirely.`,
  code: `public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}

// End-to-end flow, now complete:
// 1. POST /login with username + password
// 2. AuthenticationProvider delegates to UserDetailsServiceImpl
// 3. UserDetailsServiceImpl calls userRepository.findByUsername(username)
// 4. UserRepository runs SELECT * FROM app_user WHERE username = ? (auto-generated)
// 5. Returned User is adapted to UserDetails; password hash compared via BCrypt`,
  codeTitle: 'UserRepository - one derived query method completes the login flow',
  points: [
    'UserRepository extends JpaRepository<User, Integer> exactly like JobRepository, getting findById, save, delete, and findAll for free.',
    'findByUsername(String) is a derived query method - Spring Data JPA generates the SQL from the method name alone, with no query written by hand.',
    'Returning Optional<User> makes "username not found" an explicit, expected outcome in the method signature rather than a thrown exception at the database layer.',
    '.orElseThrow() in UserDetailsServiceImpl is exactly where a missing user becomes the UsernameNotFoundException that AuthenticationProvider expects.',
    'This repository is the final piece connecting the database to the login flow built across this chapter: AuthenticationProvider -> UserDetailsServiceImpl -> UserRepository -> the real app_user table.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Naming the derived method findByUserName (capital N) instead of findByUsername would still compile, since Spring Data JPA parses it as looking for a field named userName - but the User entity field is named username (lowercase n), so the generated query would fail at startup with a property-not-found error, not silently return wrong results.' },
    { type: 'interview', content: 'Q: Why does UserRepository.findByUsername return Optional<User> rather than User directly, and how does that connect to the UsernameNotFoundException seen in UserDetailsServiceImpl?\nA: A username not existing is a routine, expected outcome (a typo, a first login attempt), not something the repository layer should treat as exceptional - Optional<User> makes that possibility explicit in the return type. The calling code in UserDetailsServiceImpl then uses .orElseThrow() to convert an empty Optional into the specific UsernameNotFoundException that AuthenticationProvider is designed to catch and treat as a clean authentication failure.' },
  ],
}
