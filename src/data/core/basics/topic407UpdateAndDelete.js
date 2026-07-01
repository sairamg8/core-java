export default {
  id: 'jpa-update-and-delete',
  title: '407. Update And Delete',
  explanation: `Updating and deleting through \`JpaRepository\` (see [[spring-data-jpa-introduction]]) both use built-in methods, but each has a behavior worth understanding precisely.

**Update — there is no separate \`update()\` method.** \`save()\` does both insert *and* update, deciding based on the entity's id:
\`\`\`java
public Job update(int id, Job updatedJob) {
    updatedJob.setId(id);        // tell JPA which row this represents
    return jobRepository.save(updatedJob);
}
\`\`\`
If the id **matches an existing row**, Hibernate issues an \`UPDATE\`. If the id is \`null\` or matches no existing row (depending on the id generation strategy), it issues an \`INSERT\` instead. This dual behavior is why \`save()\` is the one method used for both create (see [[jpa-findall]]) and update — the *id* is what determines which SQL runs, not which Java method was called.

**A subtlety with \`GenerationType.IDENTITY\` (see [[jpa-creating-tables-and-inserting-data]]):** Hibernate checks whether the id is \`null\` to decide insert vs. update for identity-generated keys. Setting an id that happens to match an existing row on a *new* object (rather than fetching and modifying the existing managed entity) can behave unexpectedly — the safer update pattern is to \`findById\`, modify the fields on the *returned* managed entity, then \`save\` that:
\`\`\`java
public Job update(int id, Job updatedFields) {
    Job existing = jobRepository.findById(id).orElseThrow();
    existing.setDescription(updatedFields.getDescription());
    existing.setProfile(updatedFields.getProfile());
    return jobRepository.save(existing);
}
\`\`\`

**Delete — two provided methods, subtly different:**
\`\`\`java
jobRepository.deleteById(5);   // fails with EmptyResultDataAccessException if id 5 doesn't exist
jobRepository.delete(job);     // deletes a specific, already-fetched entity instance
\`\`\`
\`deleteById\` is convenient when only the id is known (as in a REST \`DELETE /jobs/{id}\` endpoint, see [[put-and-delete-mapping]]) but throws if the row is already gone — worth wrapping with an existence check or catching the exception for a clean 404 response rather than a 500.`,
  code: `@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Job update(int id, Job updatedFields) {
        Job existing = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found: " + id));
        existing.setDescription(updatedFields.getDescription());
        existing.setUrl(updatedFields.getUrl());
        existing.setProfile(updatedFields.getProfile());
        return jobRepository.save(existing);   // UPDATE, since id already exists
    }

    public void delete(int id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found: " + id);
        }
        jobRepository.deleteById(id);
    }
}`,
  codeTitle: 'Safe update (fetch-then-save) and delete (existence check first)',
  points: [
    'JpaRepository has no separate update() method - save() handles both insert and update, based on whether the entity\'s id already exists.',
    'The safest update pattern is to findById first, modify fields on the returned managed entity, then save it - rather than constructing a fresh object with a guessed id.',
    'deleteById(id) throws EmptyResultDataAccessException if no row with that id exists - check existsById first for a clean error path.',
    'delete(entity) removes a specific, already-fetched entity instance rather than looking it up by id again.',
    'Deciding insert vs. update is based entirely on the entity\'s id state, not on which repository method name was called.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling save() with a manually-constructed Job that happens to have an id matching an existing row, without first fetching that row, can overwrite fields the caller didn\'t intend to touch (since save() persists the entire entity state) - fetch-then-modify avoids accidentally blanking fields.' },
    { type: 'interview', content: 'Q: How does JpaRepository\'s save() method decide whether to perform an INSERT or an UPDATE?\nA: It inspects the entity\'s id field. If the id is null (or, depending on the generation strategy, does not correspond to an existing row), Hibernate issues an INSERT. If the id matches an existing managed or persisted entity, it issues an UPDATE instead. There is no separate update() method - the same save() call handles both cases based on this id check.' },
  ],
}
