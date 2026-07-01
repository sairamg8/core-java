export default {
  id: 'samesite-strict',
  title: '456. SameSite: Strict',
  explanation: `The CSRF token mechanism (see [[sending-csrf-token]]) is an application-level defense — it works regardless of the browser. **\`SameSite\`** is a complementary, browser-level defense, and understanding it clarifies why modern browsers already block a good portion of CSRF attempts before an application even needs its own token check.

**What \`SameSite\` is:** a cookie attribute, set by the server when issuing a cookie, that tells the browser whether to send that cookie along with cross-site requests at all:
\`\`\`
Set-Cookie: JSESSIONID=5A79FBF2...; SameSite=Strict; HttpOnly; Secure
\`\`\`

**The three values, and what each permits:**
- \`SameSite=Strict\` — the cookie is **never** sent on a cross-site request, full stop, even if the user clicked a link from another site to get there. The most restrictive setting.
- \`SameSite=Lax\` — the cookie is sent on cross-site top-level navigations (clicking a link that goes to the app), but not on cross-site subrequests like the hidden auto-submitting form from the CSRF example (see [[what-is-csrf]]). This is the default in modern browsers when no \`SameSite\` attribute is set at all.
- \`SameSite=None\` — the cookie is sent on all cross-site requests, same as if the attribute didn't exist; requires \`Secure\` (HTTPS-only) to be set alongside it.

**Why \`SameSite=Strict\` alone doesn't replace the CSRF token mechanism entirely.** It's an excellent additional layer, but it has a real usability cost: with \`Strict\`, even a legitimate cross-site scenario — a user clicking a link from an email client or another trusted site straight into a logged-in page — won't carry the session cookie, effectively logging the user out for that one navigation. \`Lax\` is the more commonly used default for exactly this reason: it blocks the specific attack pattern (forms and scripts silently submitting from another page) while still allowing normal top-level link navigation to work.

**Defense in depth — why this chapter still teaches CSRF tokens even with modern \`SameSite=Lax\` defaults.** Not every client is a modern, fully-patched browser; \`SameSite\` is a browser-enforced protection that assumes correct, up-to-date browser behavior, while a CSRF token is an application-level check that doesn't depend on the client's cookie-handling behavior at all. Relying on either mechanism alone is weaker than combining both — exactly the "defense in depth" principle behind most of the security decisions in this chapter.`,
  code: `// SameSite=Strict - cookie never sent cross-site, even from a legitimate link click
Set-Cookie: JSESSIONID=abc123; SameSite=Strict; HttpOnly; Secure

// SameSite=Lax - the modern browser default; blocks the CSRF attack pattern
// (hidden forms/scripts on another page) while still allowing normal link navigation
Set-Cookie: JSESSIONID=abc123; SameSite=Lax; HttpOnly; Secure

// SameSite=None - cookie sent on every cross-site request; requires Secure
Set-Cookie: JSESSIONID=abc123; SameSite=None; Secure`,
  codeTitle: 'The three SameSite cookie values and what each allows across sites',
  points: [
    'SameSite is a cookie attribute that controls whether a browser sends that cookie on a cross-site request at all - it is a browser-enforced defense, separate from application-level CSRF tokens.',
    'SameSite=Strict blocks the cookie on every cross-site request, including a legitimate top-level link click from another site.',
    'SameSite=Lax - the modern browser default - blocks cross-site subrequests like hidden auto-submitting forms while still allowing normal link navigation, covering the exact CSRF attack pattern without breaking usability.',
    'SameSite=None sends the cookie on every cross-site request and requires the Secure attribute (HTTPS only) to be set alongside it.',
    'SameSite complements, rather than replaces, CSRF tokens - SameSite depends on correct browser behavior, while a CSRF token is checked at the application level regardless of the client.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Setting SameSite=Strict on a session cookie can silently log users out when they follow a legitimate link into the app from an email or another site, since the cookie is withheld even for that first navigation - Lax is usually the right choice for typical web applications, with Strict reserved for especially sensitive flows.' },
    { type: 'interview', content: 'Q: Does SameSite=Lax fully protect against CSRF on its own, making explicit CSRF tokens unnecessary?\nA: No. SameSite=Lax blocks the specific attack pattern of cross-site subrequests (like a hidden auto-submitting form) while still allowing normal top-level navigation, which covers most common CSRF scenarios in modern browsers - but it depends entirely on correct, up-to-date browser behavior and offers no protection for clients that do not enforce it. CSRF tokens work at the application level regardless of the client, so combining both is stronger than relying on either alone.' },
  ],
}
