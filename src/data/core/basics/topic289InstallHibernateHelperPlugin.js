export default {
  id: 'install-hibernate-helper-plugin',
  title: '289. Install Hibernate Helper Plugin',
  explanation: `Working with Hibernate is much smoother with IDE support. A Hibernate/JPA helper plugin gives you code completion for HQL/JPQL, validation of mappings and annotations, and navigation between entities and tables. This topic covers what these plugins do and how to install them.

**What a Hibernate/JPA plugin gives you:**
- **HQL/JPQL syntax highlighting and completion** — autocomplete entity and field names inside query strings, catching typos before runtime.
- **Mapping validation** — warnings when an \`@Entity\` is missing an \`@Id\`, when a referenced column does not exist, or when a relationship is misconfigured.
- **Navigation** — jump from an entity to its table, or from a query to the entity it targets.
- **Console/query runner** — some tools let you execute HQL directly and see results without writing a main method.

**IntelliJ IDEA:**
- **IntelliJ IDEA Ultimate** ships with first-class JPA/Hibernate support built in (the "Persistence" tool window, JPA console, diagram view). Nothing to install — just enable the JPA/Hibernate facet.
- **IntelliJ IDEA Community** does not include JPA tooling. You can install community plugins from the Marketplace (\`Settings > Plugins > Marketplace\`) that add HQL highlighting, though features are more limited than Ultimate.

**Eclipse:**
- Install **JBoss Tools** (or the Hibernate Tools subset) from the Eclipse Marketplace. It adds a Hibernate perspective, configuration editors, a reverse-engineering wizard (generate entities from an existing schema), and an HQL editor with a query console.

**How to install (general steps):**
1. Open the plugin marketplace (\`Settings/Preferences > Plugins\` in IntelliJ, \`Help > Eclipse Marketplace\` in Eclipse).
2. Search for "Hibernate" / "JPA" / "JBoss Tools".
3. Install, then restart the IDE.
4. Enable the JPA/Hibernate facet on your project if prompted.

**Is a plugin required?**
No. Hibernate runs perfectly without any IDE plugin — it is a runtime library. The plugin only improves the *development experience* (completion, validation, navigation). Beginners can skip it and add it later once comfortable.`,
  code: `/*
  You do NOT need a plugin to run Hibernate — the plugin only improves the
  editor experience. Here is what better tooling helps you catch.

  Without HQL awareness, this typo compiles fine and fails only at runtime:
*/
Query<Student> q = session.createQuery(
        "FROM Studnt WHERE naem = :n", Student.class);  // 'Studnt', 'naem' typos!
q.setParameter("n", "Ravi");

/*
  With a Hibernate/JPA plugin, the IDE:
    - underlines 'Studnt' (no such entity) and 'naem' (no such field)
    - autocompletes entity/field names as you type inside the query string
    - warns if the Student class is missing an @Id

  IntelliJ Ultimate: Persistence tool window + JPA Console (run HQL live).
  Eclipse: install JBoss Tools / Hibernate Tools -> Hibernate perspective,
           HQL editor, and reverse-engineering from an existing schema.
*/`,
  codeTitle: 'What Hibernate IDE tooling catches for you',
  points: [
    'A Hibernate/JPA plugin adds HQL/JPQL completion and highlighting, catching entity and field typos before runtime',
    'It validates mappings — flagging a missing @Id, an unknown column, or a misconfigured relationship',
    'IntelliJ IDEA Ultimate includes JPA/Hibernate support built in; Community relies on Marketplace plugins',
    'For Eclipse, install JBoss Tools / Hibernate Tools for a Hibernate perspective, HQL editor, and schema reverse-engineering',
    'Plugins are optional — Hibernate runs without them; they only improve the development experience',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'The reverse-engineering feature in Hibernate Tools (Eclipse) or IntelliJ Ultimate can generate entity classes directly from an existing database schema. On a project with a large legacy database, this saves enormous time versus hand-writing dozens of @Entity classes.',
    },
    {
      type: 'gotcha',
      content: 'Do not assume you need IntelliJ Ultimate to learn Hibernate. Everything in these topics runs on the free Community edition or Eclipse — the plugin only adds convenience features. Focus on understanding Hibernate itself first; add richer tooling once the fundamentals click.',
    },
  ],
}
