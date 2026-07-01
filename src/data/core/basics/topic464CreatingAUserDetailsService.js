export default {
  id: 'creating-a-userdetailsservice',
  title: '464. Creating a UserDetailsService',
  explanation: `\`AuthenticationProvider\` (see [[authenticationprovider]]) needs a \`UserDetailsService\` to actually load a user by username — this topic writes that implementation, bridging the database-backed \`User\` entity (see [[creating-user-table-and-db-properties]]) to the \`UserDetails\` interface Spring Security itself understands.

**Why a bridge/adapter is needed at all, rather than using the \`User\` entity directly.** Spring Security's internal machinery is written entirely against its own \`UserDetails\` interface — it has no knowledge of this application's specific \`User\` entity, its \`Role\` enum, or its column names. \`UserDetailsService\` is the one required translation point: implement its single method, and every part of Spring Security downstream (filters, \`AuthenticationProvider\`, session storage) works with the result automatically.

**The implementation, using the \`UserRepository\` built in the next topic:**
\`\`\`java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())               // already-hashed value from the DB
            .roles(user.getRole().name())                 // e.g. "ADMIN" -> authority "ROLE_ADMIN"
            .build();
    }
}
\`\`\`

**Two \`User\` classes in play here, and why the naming collision is worth calling out explicitly:** this application's own \`@Entity User\` (holding the database row), and \`org.springframework.security.core.userdetails.User\` (Spring Security's own builder class implementing \`UserDetails\`) — completely different classes that happen to share a name. The fully-qualified reference in the code above is deliberate, to keep the two unambiguous when both are used in the same file.

**Why \`throw new UsernameNotFoundException(...)\` rather than returning \`null\` for a missing user.** Spring Security's \`AuthenticationProvider\` specifically expects this exception type to signal "no such user" — returning \`null\` instead would cause a \`NullPointerException\` deeper in the framework rather than the clean, well-defined authentication failure this exception produces. This is a case where the contract of an interface method matters as much as its return type.`,
  code: `@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .build();
    }
}`,
  codeTitle: 'UserDetailsServiceImpl bridging the app’s User entity to Spring Security',
  points: [
    'UserDetailsService is the one required translation point between an application-specific user entity and the UserDetails interface Spring Security actually understands internally.',
    'loadUserByUsername() throws UsernameNotFoundException for a missing user, rather than returning null, matching the exact contract AuthenticationProvider expects to signal failed lookup cleanly.',
    'There are two distinct User classes in play - the application-defined @Entity, and the org.springframework.security.core.userdetails.User builder from Spring Security - and using the fully-qualified name avoids ambiguity when both appear in the same file.',
    '.roles(user.getRole().name()) automatically prefixes the stored role with "ROLE_" to form the authority string Spring Security checks against (e.g. hasRole("ADMIN") checks for authority "ROLE_ADMIN").',
    'Once this class is a @Service bean, it is automatically available for injection into AuthenticationProvider or the SecurityFilterChain configuration - no additional registration step is needed.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Passing the already-hashed password from the database straight into .password(user.getPassword()) is correct and expected - it is easy to second-guess this and try to decode or re-encode it, but DaoAuthenticationProvider is specifically designed to compare a fresh hash of the submitted raw password against this already-hashed stored value, never the reverse.' },
    { type: 'interview', content: 'Q: Why does loadUserByUsername throw UsernameNotFoundException instead of returning null when no matching user exists?\nA: AuthenticationProvider (specifically DaoAuthenticationProvider) is written to expect this exact exception as the signal that no such user exists, and translates it into a clean, well-defined authentication failure. Returning null instead would not match that contract and would likely cause a NullPointerException deeper inside Spring Security rather than a clear authentication failure.' },
  ],
}
