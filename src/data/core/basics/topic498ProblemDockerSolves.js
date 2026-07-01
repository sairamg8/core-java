export default {
  id: 'problem-docker-solves',
  title: '498. Problem Docker Solves',
  explanation: `The introduction named the problem loosely as "works on my machine" (see [[docker-introduction]]) — this topic makes it concrete with the exact kinds of differences that cause it, since understanding the specific failure modes is what makes Docker's solution (the next few topics) make sense as a direct response, not just a trendy tool.

**Concrete ways a Java application's behavior can differ across environments, none of which are bugs in the application code itself:**
- **JDK version mismatch** — code compiled and tested against Java 21 behaves differently, or fails to start at all, on a server still running Java 17.
- **OS-level differences** — file path separators, default character encodings, or line-ending conventions differing between a developer's macOS machine and a Linux production server.
- **Missing or mismatched system dependencies** — a native library, a specific version of a command-line tool, or an environment variable that exists on one machine and not another.
- **Database version drift** — code tested against PostgreSQL 16 locally hitting subtly different behavior against PostgreSQL 13 in production.
- **"Dependency hell"** — two applications on the same physical server requiring different, incompatible versions of the same shared library or runtime.

**Why "just document the setup steps carefully" doesn't actually solve this.** Setup documentation (a \`README\` listing "install JDK 21, install PostgreSQL 16, set these five environment variables") relies on every single person, on every single machine, following every step exactly, every time — and it silently goes stale the moment any dependency version changes without every document being updated in lockstep. This is fundamentally a **manual, error-prone process**, no matter how well-intentioned or well-documented.

**The core problem Docker exists to solve, stated as one sentence: environments drift apart over time, in ways manual setup instructions cannot reliably prevent.** Two historical approaches emerged to solve this drift problem before Docker specifically — the next two topics cover the first (virtualization, see [[solution-with-virtualization]]) and then containerization itself (see [[solution-with-containerization]]), showing precisely why the second approach became the industry standard.`,
  code: `# The kind of failure this chapter is about - none of these are code bugs:

# Works on a developer's machine (Java 21, macOS, PostgreSQL 16):
$ java -jar job-app.jar
# Started JobApp in 2.1 seconds

# Fails on a production server (Java 17, Linux, PostgreSQL 13):
$ java -jar job-app.jar
# Error: A JNI error has occurred... UnsupportedClassVersionError
# - compiled for a newer Java version than what is installed here`,
  codeTitle: 'The exact class of failure Docker exists to prevent',
  points: [
    'Environment inconsistency causes failures unrelated to application logic: JDK version mismatches, OS-level differences, missing system dependencies, and database version drift.',
    'Dependency hell - two applications on one server needing incompatible versions of the same shared library - is a specific, common instance of this broader problem.',
    'Manual setup documentation (a README of install steps) does not reliably solve this, since it depends on every person following every step exactly, and silently goes stale as dependency versions change.',
    'The underlying issue is that environments drift apart over time in ways manual processes cannot reliably prevent - not any single specific configuration mistake.',
    'Two major historical approaches address this drift problem: virtualization first, then containerization - the next two topics cover each and why containerization became the dominant modern approach.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A UnsupportedClassVersionError in production when the exact same JAR ran fine in development is a classic symptom of this problem specifically - it means the code was compiled for a newer Java version than what is actually installed on the target machine, not a defect in the code itself.' },
    { type: 'interview', content: 'Q: Beyond a vague "it works on my machine" complaint, what are concrete, specific causes of environment-related failures in deploying a Java application?\nA: JDK version mismatches (code compiled for a newer Java version than what is installed on the target), OS-level differences in file paths or encodings, missing system-level dependencies or environment variables, database version drift between environments, and dependency hell where multiple applications on one server need incompatible versions of the same shared library.' },
  ],
}
