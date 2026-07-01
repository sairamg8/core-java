export default {
  id: 'importance-of-security',
  title: '445. Importance Of Security',
  explanation: `Every chapter up to this point has built the Job app's *functionality* — REST endpoints (see [[creating-a-rest-controller]]), persistence (see [[spring-data-jpa-introduction]]), even auto-generated CRUD (see [[spring-data-rest-introduction]]). None of it has asked *who* is allowed to call these endpoints, or *what* they're allowed to do once they're in. That question — security — is what this chapter addresses, and it matters for reasons that go well beyond "hackers are bad."

**Why an unsecured REST API is a real, immediate risk, not a theoretical one:** as built so far, \`DELETE /jobs/1\` works for literally anyone who can reach the server — there is no login, no token, no check of any kind. Anyone with the URL can delete every job, read every user's data, or create arbitrary records. This isn't a hypothetical edge case; it's the default state of every Spring Boot app until security is explicitly added.

**Two distinct questions security answers:**
- **Authentication — "who are you?"** Verifying identity: a username and password, a token, a certificate.
- **Authorization — "what are you allowed to do?"** Once identity is known, deciding whether *this* user can perform *this* action on *this* resource.

These are separate concerns and often confused: a user can be authenticated (successfully logged in) but not authorized to delete another user's job posting. Both checks are needed; neither replaces the other.

**Why this can't be "added later" as an afterthought:** security decisions touch nearly every layer — the controller (which endpoints need auth), the data model (who owns what), and the database (whether a query already filters by the current user). Retrofitting security onto an app built with no plan for it usually means widespread rewrites; building it in as a first-class chapter, applied to the real Job app already built, is the more realistic path this course takes.

**What's ahead in this chapter:** Spring Security basics and the default login form, session-based auth, CSRF, a custom user database with BCrypt-hashed passwords, then stateless token-based security (JWT), and finally OAuth2 social login — each layer replacing or extending the one before it, mirroring how real production APIs actually evolve their security over time.`,
  code: `// The Job app as built so far - completely open
@RestController
@RequestMapping("/jobs")
public class JobRestController {

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        jobService.delete(id);   // anyone, no login, no check - this runs
    }
}

// curl -X DELETE http://localhost:8080/jobs/1
// succeeds for any caller, right now, with zero security in place`,
  codeTitle: 'Every endpoint built so far has zero access control',
  points: [
    'Without any security configuration, every Spring Boot REST endpoint is open to anyone who can reach the server - this is the default, not an edge case.',
    'Authentication answers "who are you" (verifying identity); authorization answers "what are you allowed to do" (checking permissions) - they are distinct checks, and being authenticated does not imply being authorized for everything.',
    'Security decisions touch the controller, the data model, and the database query layer simultaneously - it cannot be bolted on cleanly after the fact without significant rework.',
    'This chapter builds security into the existing Job app step by step: Spring Security basics, CSRF, a real user database with BCrypt, then JWT, then OAuth2.',
    'Each later security layer in this chapter (JWT, OAuth2) replaces or extends the session-based approach introduced first, mirroring how real applications evolve their security over time rather than picking one approach permanently on day one.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Testing an API locally with security disabled and assuming it will be "added before production" is one of the most common real-world causes of exposed data - security should be treated as a first-class requirement from the first endpoint, not a final polish step.' },
    { type: 'interview', content: 'Q: What is the difference between authentication and authorization, and why does an application need both?\nA: Authentication verifies identity - confirming who is making the request. Authorization checks permissions - deciding what that already-identified user is allowed to do. An application needs both because a valid, authenticated user is not automatically entitled to perform every action; for example, a logged-in regular user should not be authorized to delete data owned by a different account, even though they are a real, authenticated account themselves.' },
  ],
}
