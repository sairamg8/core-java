export default {
  id: 'docker-introduction',
  title: '497. Docker Introduction',
  explanation: `Every project in this course so far has run on one machine, configured by hand — a specific JDK version installed, a specific PostgreSQL running locally, environment variables set manually. This chapter starts a new topic entirely: **Docker**, the tool that packages an application together with everything it needs to run, so it behaves identically wherever it's deployed.

**The problem this chapter builds toward solving, stated plainly first.** A Job app that works perfectly on a development machine can fail on a teammate's machine, or in production, for reasons that have nothing to do with the actual Java code — a different JDK minor version, a missing environment variable, a PostgreSQL version with slightly different default behavior. This gap between "works here" and "works there" is exactly what the next several topics dig into, starting with why it happens at all (see [[problem-docker-solves]], next).

**What Docker is, at the highest level, before any mechanics.** Docker packages an application, its runtime (the JDK, for a Java app), its libraries, and its configuration into a single, self-contained unit called a **container** — designed to run identically regardless of the underlying machine, as long as that machine can run Docker itself.

**Why this chapter exists at this specific point in the course, after Spring Security and Logging.** A real application needs to actually be deployable, not just runnable from an IDE — this chapter (Docker) and the next (AWS) are specifically about that gap: taking the Job app, as built and secured across this entire course, and packaging + deploying it the way a real production system would.

**What to expect across this chapter, concretely.** The next several topics build the case for containerization from first principles (the actual deployment problem, then two historical solutions — virtualization, then containerization), define Docker's core vocabulary precisely, and then get hands-on: installing Docker, running a first container, and eventually packaging the Job app itself into a container image.`,
  code: `# What this chapter builds toward, concretely - by the end of it:
docker build -t job-app .
docker run -p 8080:8080 job-app

# A Spring Boot app, packaged with its exact JDK version and dependencies,
# running identically on any machine that has Docker installed - no manual
# JDK install, no manually configured environment, no "works on my machine."`,
  codeTitle: 'The destination this Docker chapter builds toward',
  points: [
    'Docker packages an application together with its runtime, libraries, and configuration into a single container, designed to behave identically on any machine that can run Docker.',
    'This chapter exists specifically to close the gap between "runs on my machine" and "runs reliably everywhere" - a gap that has nothing to do with whether the application code itself is correct.',
    'The chapter builds from first principles: why deployment inconsistency happens, two historical approaches to solving it (virtualization, then containerization), the core vocabulary of Docker, and finally hands-on containerization of the Job app itself.',
    'Docker fits into this course specifically after security and logging, since a real application needs to actually be deployable in a reliable, reproducible way, not just runnable locally.',
    'Every topic from here through the end of this chapter builds toward one working goal: the Job app packaged as a container image, running identically regardless of host machine.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Treating Docker as "just a way to run things without installing dependencies" undersells what it actually solves - the deeper value is reproducibility: the exact same container image, unchanged, is what runs in development, staging, and production, eliminating an entire category of "it worked in testing" failures.' },
    { type: 'interview', content: 'Q: At a high level, what problem does Docker solve for deploying a Java application, and why does that problem exist in the first place?\nA: Docker solves the "works on my machine" problem - an application behaving differently across environments due to differences in JDK version, OS, installed libraries, or configuration. It solves this by packaging the application together with its exact runtime and dependencies into a single container that runs identically anywhere Docker itself runs, removing environment differences as a source of failure entirely.' },
  ],
}
