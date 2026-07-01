export default {
  id: 'configuration-without-lambda',
  title: '459. Configuration Without Lambda',
  explanation: `Every \`SecurityFilterChain\` example so far in this chapter (see [[security-configuration]]) has used Spring Security's lambda-based DSL — \`.csrf(csrf -> csrf.disable())\`, \`.authorizeHttpRequests(auth -> auth...)\`. This is the recommended, modern style (introduced in Spring Security 5.7 and required as the primary style from Spring Security 6), but understanding the older, pre-lambda style matters for reading legacy code and tutorials that predate it.

**The old, chained-method style (Spring Security 5.x and earlier, largely deprecated in 6):**
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/jobs/search").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin();
    }
}
\`\`\`

**The same configuration in the modern lambda style:**
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/jobs/search").permitAll()
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults());
        return http.build();
    }
}
\`\`\`

**What actually changed, structurally:** the old style chains configuration methods directly onto \`http\`, using \`.and()\` to return to the parent builder after configuring a sub-section — a pattern that becomes hard to read once several sections are chained, since it's not always obvious which \`.and()\` returns to which level. The lambda style instead scopes each configuration section (\`csrf\`, \`authorizeHttpRequests\`, \`formLogin\`) to its own lambda block, making the boundaries visually explicit and removing the need for \`.and()\` entirely.

**Why \`WebSecurityConfigurerAdapter\` itself was removed, not just the chaining style.** Extending a base class to override \`configure(HttpSecurity)\` meant only one \`SecurityConfig\` could easily exist per application (inheritance doesn't compose well for multiple, independent filter chains). Returning a \`SecurityFilterChain\` as a plain \`@Bean\`, as every other example in this chapter does, allows multiple filter chain beans to coexist — useful for applications that need different security rules for different URL patterns (a public API vs. an admin console, for example) — something the inheritance-based approach could not do cleanly.`,
  code: `// OLD (Spring Security 5.x, deprecated in 6) - extends a base class, uses .and()
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
                .antMatchers("/jobs/search").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin();
    }
}

// MODERN (Spring Security 6+) - a plain @Bean, lambda-scoped sections
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/jobs/search").permitAll()
            .anyRequest().authenticated())
        .formLogin(Customizer.withDefaults());
    return http.build();
}`,
  codeTitle: 'WebSecurityConfigurerAdapter chaining vs. the modern SecurityFilterChain bean',
  points: [
    'The old style extended WebSecurityConfigurerAdapter and chained configuration methods onto http, using .and() to return to the parent builder after each sub-section.',
    'The modern lambda style scopes each configuration section (csrf, authorizeHttpRequests, formLogin) to its own lambda, making section boundaries explicit and removing the need for .and() entirely.',
    'WebSecurityConfigurerAdapter is deprecated as of Spring Security 5.7 and removed as the primary approach in Spring Security 6 - modern configuration returns a plain SecurityFilterChain @Bean instead.',
    'antMatchers() from the old style is replaced by requestMatchers() in the modern API - functionally similar but part of the same modernization.',
    'A plain @Bean approach allows multiple independent SecurityFilterChain beans to coexist for different URL patterns, something an inheritance-based single base class could not support cleanly.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Copying a SecurityConfig example from an older tutorial that extends WebSecurityConfigurerAdapter into a modern Spring Boot 3 / Spring Security 6 project will fail to compile - the class was removed. Recognizing this older style on sight (and knowing its modern equivalent) is valuable specifically because so much existing tutorial content online still uses it.' },
    { type: 'interview', content: 'Q: Why did Spring Security move away from extending WebSecurityConfigurerAdapter toward defining a SecurityFilterChain as a plain @Bean?\nA: Inheriting from a single base class does not compose well when an application needs more than one independent filter chain (for example, different rules for a public API versus an admin console) - only one subclass can easily exist. Returning a SecurityFilterChain as a @Bean allows multiple, independently scoped filter chains to be declared side by side, and the lambda-based DSL that came with it also removes the need for the harder-to-read .and() chaining style.' },
  ],
}
