export default {
  id: 'working-with-multiple-users',
  title: '461. Working With Multiple Users',
  explanation: `Everything built so far has assumed one implicit user per request (whoever is currently logged in). Building toward a real user database (see [[getting-ready-for-user-database]]) means designing for **multiple users existing and being distinguishable from each other** — a shift that changes how ownership and authorization need to be thought about, not just how login works.

**The concrete new question this raises for the Job app:** should every logged-in user see every job posting, or only the ones they created? Should any authenticated user be able to delete any job, or only their own? These weren't meaningful questions with a single hardcoded user — they become central design decisions the moment more than one real account exists.

**Two common ownership patterns, and where each applies:**
- **Shared resources** — every job posting is visible to every authenticated user, but only specific roles (e.g. \`ADMIN\`) can create/edit/delete. This is a **role-based** model: authorization depends on *what kind of user* you are, not *which specific user* you are.
- **Owned resources** — each job posting belongs to the user who created it, and only that owner (or an admin) can modify it. This requires the \`Job\` entity to carry a reference to its owning \`User\` — a foreign key relationship, exactly like the ones already built between entities in the JPA chapter (see [[spring-data-jpa-introduction]]).

**Why "just add a \`createdBy\` field" is the easy part, and enforcement is the hard part.** Adding a foreign key column is one line of JPA annotation. *Enforcing* that only the owner can modify their own record means every relevant service method needs to compare the currently authenticated user's identity against the resource's owner — logic that has to be written deliberately, since Spring Security's role-based checks (\`hasRole("ADMIN")\`) don't automatically know anything about resource ownership.

**A realistic middle ground, and the one this course's Job app actually uses:** roles (\`USER\`, \`ADMIN\`) control broad categories of action (who can create/delete at all), while ownership checks, where needed, are handled explicitly in service-layer code — comparing the authenticated principal's ID against the resource's stored owner ID before allowing a write. This combination — role-based *and* ownership-based checks — is how most real applications actually structure authorization, rather than relying on roles alone.`,
  code: `// Ownership-aware authorization check, written explicitly in the service layer
// (roles alone cannot express "only the owner of this specific job")

@Service
public class JobService {

    public void deleteJob(Integer jobId, User currentUser) {
        Job job = jobRepository.findById(jobId).orElseThrow();

        boolean isOwner = job.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Not allowed to delete this job");
        }
        jobRepository.delete(job);
    }
}`,
  codeTitle: 'Combining role-based and ownership-based authorization in one check',
  points: [
    'Supporting multiple real users introduces authorization questions (who can see/edit what) that were meaningless with a single hardcoded user.',
    'Role-based authorization (hasRole) controls what kind of user can do something broadly; ownership-based authorization controls whether a specific user can act on a specific resource they own.',
    'Adding a createdBy foreign key to an entity is straightforward JPA; actually enforcing ownership requires explicit comparison logic in the service layer that Spring Security cannot generate automatically.',
    'Most real applications combine both patterns - broad role checks for categories of action, plus explicit ownership checks for resource-specific access.',
    'This design decision (shared vs. owned resources) needs to be made deliberately per resource type, since it directly shapes the entity model, the service layer, and which checks the security configuration alone can and cannot express.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming hasRole("USER") on an endpoint is sufficient authorization for a per-resource action like "delete my own job" is a common gap - a role check only confirms the caller is some kind of authenticated user, not that they own the specific resource being acted on; that check has to be written explicitly.' },
    { type: 'interview', content: 'Q: Why can a role-based check like hasRole("USER") not, on its own, enforce that a user can only delete their own job posting?\nA: A role describes a category of user (USER vs ADMIN), not a relationship to a specific resource. Any authenticated USER passes a hasRole("USER") check regardless of which job they are trying to delete, so enforcing "only the owner can delete this specific job" requires comparing the authenticated identity against the resource owner stored on the record, explicitly in application code, not through role configuration alone.' },
  ],
}
