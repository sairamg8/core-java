export default {
  id: 'creating-a-spring-security-project',
  title: '447. Creating A Spring Security Project',
  explanation: `Turning on Spring Security for the Job app (see [[importance-of-security]]) starts with one dependency — and the very first effect it has is worth understanding precisely, because it surprises nearly everyone the first time.

**Adding the dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
\`\`\`

**The immediate, automatic effect: every endpoint is now locked down.** The moment this dependency is on the classpath, Spring Boot auto-configures a default security setup that requires a login for *every single request* — including endpoints that were working perfectly fine and unauthenticated a moment ago, like \`GET /jobs\`. There is no opt-in step; adding the starter is itself the switch that turns security on everywhere.

**Where the default credentials come from.** With no configuration at all, Spring Boot generates a random password and prints it to the console on startup:
\`\`\`
Using generated security password: 8e557245-73e2-4286-969a-ff57fe326336
\`\`\`
The default username is always \`user\`. This password changes every time the application restarts — it exists purely so a freshly-added security dependency has *something* usable to log in with immediately, not as a real credential scheme for an actual application.

**Why Spring Boot defaults to "lock everything down" rather than "leave everything open until configured":** this is a deliberate secure-by-default design choice. An accidentally-open endpoint (forgetting to add security) is a security incident; an accidentally-closed endpoint (forgetting to open a public endpoint) is a bug that gets noticed immediately during testing. Framework designers overwhelmingly prefer defaults that fail safe rather than fail permissive, and Spring Security's "everything requires auth unless configured otherwise" default reflects exactly that philosophy.

**What comes next in this chapter:** the generated username/password is purely a starting point. The following topics replace it first with the default login form (see [[default-login-form]]), then with a real, permanent username and password, and eventually with a full user database backed by BCrypt-hashed passwords.`,
  code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Restart the app, then check the console output: -->
<!--
Using generated security password: 8e557245-73e2-4286-969a-ff57fe326336
-->

<!-- Now GET http://localhost:8080/jobs requires a login -->
<!-- username: user, password: the generated one printed above -->`,
  codeTitle: 'Adding spring-boot-starter-security locks down every endpoint by default',
  points: [
    'Adding spring-boot-starter-security is itself the action that enables security - there is no separate opt-in step, every endpoint requires authentication immediately.',
    'With zero configuration, Spring Boot generates a random password on every startup and prints it to the console; the default username is always "user".',
    'The generated password changes on every restart and exists only to give a freshly-secured app something usable to log in with, not as a real credential system.',
    'Spring Security defaults to locking everything down rather than leaving things open, following a fail-safe (rather than fail-permissive) security design philosophy.',
    'This generated credential is a temporary starting point - later topics in this chapter replace it with a real login form, then a custom user database, then JWT.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting that the generated console password changes on every restart is a common source of confusion during local development - if a login that worked a minute ago suddenly fails after restarting the app, check the console output for a freshly generated password rather than assuming something is broken.' },
    { type: 'interview', content: 'Q: What happens the moment spring-boot-starter-security is added to a Spring Boot project, with no further configuration written?\nA: Every HTTP endpoint immediately requires authentication - there is no opt-in step. Spring Boot auto-configures a default security setup, generates a random password printed to the console on each startup, and uses the fixed username "user". This reflects the secure-by-default design of Spring Security: everything is locked down unless explicitly opened up.' },
  ],
}
