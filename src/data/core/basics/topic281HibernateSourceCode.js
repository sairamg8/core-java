export default {
  id: 'hibernate-source-code',
  title: '281. Hibernate Source Code',
  explanation: `Before diving into Hibernate as a user, it helps to know that Hibernate is a large, mature, open-source project — and that its source code is freely available. Knowing where the code lives, how it is organized, and how to read it turns Hibernate from a "magic black box" into a tool you can inspect when something behaves unexpectedly.

**Where the source lives:**
- The canonical repository is on GitHub: **github.com/hibernate/hibernate-orm**
- It is licensed under the LGPL / Apache-style open license, so you can read, fork, and even patch it.
- Releases are published to Maven Central, so the JARs you pull as dependencies map directly to tags in this repo.

**Why look at the source at all?**
- **Understanding behavior:** When Hibernate generates SQL you did not expect, the truth is in the code, not in a blog post.
- **Debugging:** A stack trace often points into Hibernate internals (\`org.hibernate.*\`). Being able to open that class and read it shortens debugging enormously.
- **Learning good design:** Hibernate is a textbook example of layered architecture, the proxy pattern, and the session/unit-of-work pattern.

**How the code is organized (high level):**
- \`hibernate-core\` — the heart: Session, SessionFactory, the persistence engine, HQL parser, dialects.
- \`hibernate-entitymanager\` / JPA layer — the bridge that lets Hibernate act as a JPA provider.
- \`hibernate-c3p0\`, \`hibernate-ehcache\`, etc. — optional integration modules for pooling and caching.

**Attaching sources in your IDE:**
Both IntelliJ IDEA and Eclipse can "Download Sources" for the Hibernate JARs on your classpath. Once attached, Ctrl+Click (or Cmd+Click) on any Hibernate class or method jumps straight into the real implementation. This is the single most useful habit for learning how Hibernate actually works.

You do not need to memorize the internals. The goal of this topic is simply to make you comfortable with the idea that Hibernate is readable code — and to encourage you to open it whenever curiosity or a bug demands it.`,
  code: `// In your Maven pom.xml, the Hibernate dependency you add maps directly
// to a tag in github.com/hibernate/hibernate-orm

<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>6.4.4.Final</version>
</dependency>

/*
 In IntelliJ IDEA:
   1. Open the Maven "Dependencies" node in the project view.
   2. Right-click hibernate-core -> "Download Sources".
   3. Now Ctrl+Click any org.hibernate.* class to read its real code.

 In Eclipse:
   1. Expand "Maven Dependencies".
   2. Right-click the hibernate-core JAR -> Maven -> "Download Sources".

 Try it: open the Session interface (org.hibernate.Session) and read the
 Javadoc on persist(), get(), and createQuery(). Everything you will use
 in the coming topics is declared there.
*/`,
  codeTitle: 'Locating and attaching Hibernate sources',
  points: [
    'Hibernate ORM is open source; its canonical repository is github.com/hibernate/hibernate-orm',
    'The dependency version in your pom.xml corresponds directly to a release tag in that repository',
    'hibernate-core contains the persistence engine, Session/SessionFactory, HQL parser, and SQL dialects',
    'Downloading and attaching sources in your IDE lets you Ctrl+Click into real Hibernate code',
    'Reading the source is the fastest way to understand unexpected SQL and to debug internal stack traces',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The very first time you set up a Hibernate project, download the sources. When Hibernate later throws a LazyInitializationException or generates a surprising join, being able to jump into the actual class that raised it will save you hours compared to guessing from documentation.',
    },
    {
      type: 'interview',
      content: 'Q: Is Hibernate open source, and why does that matter to a developer?\nA: Yes, Hibernate ORM is open source under a permissive license, hosted on GitHub. It matters because you can read the exact implementation behind any behavior, debug into its internals from a stack trace, verify how it generates SQL, and even patch or fork it if needed — instead of treating it as an opaque black box.',
    },
  ],
}
