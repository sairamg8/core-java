export default {
  id: 'loading-data-and-entities',
  title: '409. Loading Data and Entities',
  explanation: `With \`Job\` now a real \`@Entity\` (see [[jpa-in-job-app]]), it's worth understanding *when* JPA actually talks to the database, and what an "entity" means beyond just an annotated class — because this affects how data loaded through \`JobRepository\` behaves.

**An entity has a lifecycle, not just a mapping.** JPA (via Hibernate) tracks each loaded entity as one of:
- **Transient** — a plain \`new Job()\` with no id, not yet known to JPA at all.
- **Managed** — returned from \`findById\`/\`findAll\`, actively tracked within a persistence context; changes to its fields can be detected and flushed to the database automatically at the end of a transaction (this is why the fetch-then-modify update pattern from [[jpa-update-and-delete]] works without an explicit \`save()\` call inside a \`@Transactional\` method).
- **Detached** — was managed, but the persistence context that tracked it has closed (e.g. the entity crossed out of the service layer into a controller). Changes to a detached entity are *not* automatically saved — an explicit \`save()\` is needed to reattach and persist them.

**Loading data seeded via \`data.sql\`** (see [[jpa-creating-tables-and-inserting-data]]) is simplest at startup — Spring Boot runs it before the app is ready to serve requests, so \`findAll()\` immediately sees those rows with no extra code.

**A performance detail worth knowing early: lazy vs. eager loading.** When an entity has a relationship to another entity (a \`Job\` belonging to a \`Company\`, say), JPA can load the related data **eagerly** (fetched immediately, in the same query or a follow-up one, whether needed or not) or **lazily** (fetched only when the relationship is actually accessed in code). Lazy is the default for collection-valued relationships (\`@OneToMany\`) and avoids loading data that's never used — but accessing a lazy relationship *after* the persistence context has closed throws the well-known \`LazyInitializationException\`, a common early stumbling block once entities have relationships (a deeper topic once the Job app grows beyond a single entity).

**The practical takeaway for now:** entities returned by a repository method called *inside* a \`@Transactional\` service method are safe to modify and have those changes persist; entities that have already been serialized out to a REST response (see [[jpa-findall]]) are effectively detached — modifying the object on the client side has no effect on the database until an explicit update call is made.`,
  code: `@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Transactional
    public void updateProfile(int id, String newProfile) {
        Job job = jobRepository.findById(id).orElseThrow();  // managed entity
        job.setProfile(newProfile);                            // change tracked automatically
        // no explicit save() needed here - Hibernate flushes on transaction commit
    }
}`,
  codeTitle: 'A managed entity persists changes automatically within a transaction',
  points: [
    'JPA tracks entities through a lifecycle: transient (new, unmanaged), managed (tracked, changes auto-persisted), and detached (no longer tracked).',
    'A managed entity\'s field changes can be flushed to the database automatically at transaction commit, without an explicit save() call.',
    'A detached entity (e.g. one already sent out over a REST response) requires an explicit save() to persist any further changes.',
    'Lazy loading fetches related data only when accessed in code; eager loading fetches it immediately regardless of whether it is used.',
    'Accessing a lazily-loaded relationship after its persistence context has closed throws LazyInitializationException - a common early JPA pitfall once entities have relationships.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Modifying a Job object on the client after it was returned from a REST endpoint and expecting the database to reflect that change is a misunderstanding of entity state: that object is detached the moment it leaves the persistence context, and only an explicit update call (a new PUT/POST request) changes the actual database row.' },
    { type: 'interview', content: 'Q: Why does modifying a managed entity\'s field inside a @Transactional service method persist to the database without an explicit call to save()?\nA: A managed entity is actively tracked by the JPA persistence context. Hibernate detects changes ("dirty checking") to a managed entity\'s fields and automatically issues the corresponding UPDATE statement when the surrounding transaction commits, without requiring the code to call save() explicitly.' },
  ],
}
