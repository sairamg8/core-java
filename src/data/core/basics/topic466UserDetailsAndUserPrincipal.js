export default {
  id: 'userdetails-and-userprincipal',
  title: '466. UserDetails and UserPrincipal',
  explanation: `\`UserDetailsServiceImpl\` (see [[creating-a-userdetailsservice]]) returns a \`UserDetails\` object built with Spring Security's own builder class — this topic looks at what \`UserDetails\` actually contains, and introduces \`UserPrincipal\`, a common pattern for exposing more than \`UserDetails\` provides out of the box.

**What the \`UserDetails\` interface requires:**
\`\`\`java
public interface UserDetails extends Serializable {
    String getUsername();
    String getPassword();
    Collection<? extends GrantedAuthority> getAuthorities();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();
}
\`\`\`
The four boolean methods let an application express account states beyond a simple "exists or doesn't" — a locked account (too many failed logins), an expired account (a trial period ended), or a disabled account (deactivated by an admin) — all without needing separate authentication logic for each case; \`DaoAuthenticationProvider\` checks these automatically and rejects login with a specific exception for each failing condition.

**The limitation of the built-in \`org.springframework.security.core.userdetails.User\` builder used so far:** it only exposes exactly what \`UserDetails\` requires — username, password, authorities, and those four flags. There's no way to get the actual database \`id\`, an email address, or any other application-specific field back out of it once authenticated, yet controller code frequently needs exactly that (e.g. "which user id owns this request" for the ownership checks from earlier — see [[working-with-multiple-users]]).

**The \`UserPrincipal\` pattern — a custom class implementing \`UserDetails\` directly, wrapping the real entity:**
\`\`\`java
public class UserPrincipal implements UserDetails {
    private final User user;   // the actual @Entity, held by reference

    public UserPrincipal(User user) { this.user = user; }

    public Integer getId() { return user.getId(); }         // <- not part of UserDetails at all
    @Override public String getUsername() { return user.getUsername(); }
    @Override public String getPassword() { return user.getPassword(); }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
\`\`\`
\`UserDetailsServiceImpl\` then returns \`new UserPrincipal(user)\` instead of the generic builder — the same interface contract Spring Security expects, but now with the extra \`getId()\` (and any other field) accessible anywhere the authenticated principal is available, such as \`@AuthenticationPrincipal UserPrincipal principal\` in a controller method.`,
  code: `public class UserPrincipal implements UserDetails {
    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public Integer getId() {
        return user.getId();
    }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}`,
  codeTitle: 'UserPrincipal - a custom UserDetails wrapping the real User entity',
  points: [
    'UserDetails requires username, password, authorities, and four account-state flags (expired, locked, credentials-expired, enabled) that DaoAuthenticationProvider checks automatically.',
    'The built-in org.springframework.security.core.userdetails.User builder only exposes exactly what the interface requires - no access to the actual database id or other entity fields.',
    'UserPrincipal is a custom class implementing UserDetails directly while wrapping the real User entity by reference, exposing extra fields like getId() alongside the required interface methods.',
    'Returning a UserPrincipal from UserDetailsServiceImpl satisfies the exact same interface contract, so nothing else in Spring Security needs to change to use it.',
    'Once wired in, the extra fields on UserPrincipal become available anywhere the authenticated principal is injected, such as @AuthenticationPrincipal in a controller method - directly supporting the ownership checks introduced earlier in this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Returning true from all four UserDetails boolean methods without ever actually checking account state defeats the purpose of having them - if the application supports account locking or expiration at all, these methods need to read the real state from the wrapped User entity, not hardcode true regardless of the data.' },
    { type: 'interview', content: 'Q: Why would an application define its own UserPrincipal class implementing UserDetails, instead of using the built-in org.springframework.security.core.userdetails.User builder?\nA: The built-in builder only exposes exactly what the UserDetails interface requires - username, password, authorities, and account-state flags - with no way to retrieve the actual database id or other entity-specific fields. A custom UserPrincipal wraps the real entity and can expose additional accessors like getId(), which controller code often needs once a request is authenticated, while still satisfying the same UserDetails contract everywhere else in Spring Security.' },
  ],
}
