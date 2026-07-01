export default {
  id: 'getting-ready-for-user-database',
  title: '460. Getting Ready For User Database',
  explanation: `Every user seen so far in this chapter has been fake, in one way or another — a random console-generated password (see [[creating-a-spring-security-project]]) or a single hardcoded username/password (see [[setting-username-and-password]]). Neither approach can support more than one real person. This topic is the planning step before building an actual, database-backed user system — laying out what's needed before writing the entities and repositories in the topics that follow.

**What a real user table needs to hold, at minimum:**
- A unique identifier for login (username or email)
- A **hashed** password (never plain text — see [[what-is-bcrypt]] shortly)
- Role/authority information (what this user is allowed to do)
- Whatever else the application needs about the user (name, contact info) — kept separate from the security-specific fields where it makes sense

**The pieces this chapter builds, in order, to get there:**
1. A \`User\` JPA entity and \`UserRepository\` (see [[user-repository]]), following the same pattern already established for \`Job\` (see [[spring-data-jpa-introduction]])
2. A custom \`UserDetailsService\` (see [[creating-a-userdetailsservice]]) that loads a \`User\` from the database and adapts it into the \`UserDetails\` object Spring Security expects
3. A \`PasswordEncoder\` (already introduced) actually wired into registration and login, rather than just declared as an unused bean
4. An \`AuthenticationProvider\` (see [[authenticationprovider]]) that ties the \`UserDetailsService\` and \`PasswordEncoder\` together into the actual login check

**Why this can't just reuse the \`Job\` entity pattern verbatim.** \`Job\` had no security-sensitive fields at all — every field could be freely returned in an API response. A \`User\` entity, by contrast, has at least one field (the password hash) that must **never** be included in an API response or logged anywhere, which shapes how the entity, its repository, and any DTOs built around it need to be designed from the very first topic that touches it.

**Setting expectations for the topics ahead:** this is a multi-topic build, mirroring how the REST/JPA chapter built up the Job app piece by piece (see [[jpa-in-job-app]]) rather than all at once — each piece (entity, repository, service, provider) gets its own topic so the *reason* for each layer is clear before the next one is added on top.`,
  code: `// The shape being built toward over the next several topics:

// 1. User entity (JPA) - holds hashed password, never plain text
// 2. UserRepository extends JpaRepository<User, Integer>
// 3. UserDetailsServiceImpl implements UserDetailsService
//    - loads a User by username, adapts it to Spring Security's UserDetails
// 4. AuthenticationProvider - wires UserDetailsService + PasswordEncoder
//    together into the actual username/password check performed at login`,
  codeTitle: 'The four pieces this chapter assembles for a real user database',
  points: [
    'A real user table needs at minimum a unique login identifier, a hashed (never plain-text) password, and role/authority information.',
    'The chapter builds four pieces in order: a User entity + repository, a custom UserDetailsService, an actually-wired PasswordEncoder, and an AuthenticationProvider tying them together.',
    'Unlike the Job entity, a User entity has at least one field (the password hash) that must never appear in an API response or log output.',
    'Building this incrementally, one piece per topic, mirrors how the Job app itself was built up gradually rather than all at once.',
    'This groundwork replaces both the random console password and the single hardcoded user with a system that supports any number of real registered users.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Reusing a DTO or serialization pattern built for Job (where every field was safe to expose) directly on a User entity is a common mistake - without deliberately excluding the password field from any response DTO, the hashed password can end up leaking into an API response even though it is properly hashed at rest.' },
    { type: 'interview', content: 'Q: What is the one property a User entity has that fundamentally distinguishes it from an entity like Job when it comes to API design?\nA: A User entity holds at least one field - the password hash - that must never be returned in an API response, logged, or exposed anywhere outside the authentication flow, even though it is safely hashed in the database. This means User needs deliberate response DTOs or field exclusion from the very first topic that touches it, unlike Job where every field was safe to expose freely.' },
  ],
}
