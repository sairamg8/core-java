export default {
  id: 'running-jdk-docker-container',
  title: '506. Running JDK Docker Container',
  explanation: `Every Docker command so far has run someone else's pre-built image (\`hello-world\`, \`nginx\` — see [[running-first-container]]) — this topic runs an **official JDK image**, the specific building block the rest of this chapter needs before actually packaging the Job app itself into a container.

**Running a JDK image directly and confirming the version, without installing Java on the host machine at all:**
\`\`\`bash
docker run eclipse-temurin:21-jdk java -version
\`\`\`
This pulls the official Eclipse Temurin (the widely used OpenJDK distribution) JDK 21 image and runs \`java -version\` inside it — printing the JDK version from *inside the container*, with zero Java installation on the host machine itself.

**What the image tag actually specifies, since this exact naming pattern reappears for every base image used in this chapter.** \`eclipse-temurin:21-jdk\` breaks down as \`<image-name>:<tag>\` — \`eclipse-temurin\` is the image, \`21-jdk\` is a specific **tag** identifying which variant: JDK version 21, the full JDK (as opposed to a slimmer JRE-only variant, or an even smaller \`alpine\`-based variant using a minimal Linux base).

**Getting an interactive Java shell inside the container — useful for exploring what's actually available:**
\`\`\`bash
docker run -it eclipse-temurin:21-jdk bash
\`\`\`
\`-it\` combines two flags: \`-i\` (interactive, keeps input open) and \`-t\` (allocates a pseudo-terminal) — together, they turn the container into something that behaves like an actual interactive terminal session, rather than running one command and exiting immediately. From inside this shell, \`java -version\`, \`javac -version\`, and normal Linux commands all work exactly as they would on a real machine with the JDK installed — because, inside this container, that's precisely what's there.

**Why running a JDK image directly like this, before building anything custom, is the right first step.** It confirms the base image itself works correctly in isolation — before the next several topics build a custom \`Dockerfile\` on top of it (see [[dockerfile-for-docker-images]]) to actually package the Job app. If something goes wrong once a custom image is being built, having already confirmed the base JDK image works correctly on its own rules out an entire category of possible causes.`,
  code: `# Run java -version inside an official JDK 21 image - no host Java install needed
docker run eclipse-temurin:21-jdk java -version
# openjdk version "21.0.2" 2024-01-16
# OpenJDK Runtime Environment Temurin-21.0.2+13 ...

# Get an interactive shell inside the same image
docker run -it eclipse-temurin:21-jdk bash
# root@3f8a2b1c9d4e:/# java -version
# root@3f8a2b1c9d4e:/# javac -version
# root@3f8a2b1c9d4e:/# exit`,
  codeTitle: 'Running the official JDK image directly, and exploring it interactively',
  points: [
    'docker run eclipse-temurin:21-jdk java -version confirms a real JDK 21 works entirely inside a container, with zero Java installation on the host machine.',
    'The image tag (21-jdk) specifies both the JDK version and the variant - full JDK versus a slimmer JRE-only or Alpine-based image, a distinction that matters once building minimal production images later in this chapter.',
    '-it combines -i (interactive, keeps input open) and -t (allocates a pseudo-terminal), turning the container session into a usable interactive shell rather than a single command that exits immediately.',
    'From inside an interactive JDK container shell, java, javac, and normal Linux commands work exactly as they would on a real machine with the JDK installed.',
    'Confirming the base JDK image works correctly on its own, before building a custom Dockerfile on top of it, isolates base-image problems from custom-build problems later in this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker run eclipse-temurin:21-jdk java -version without -it works fine (java -version does not need an interactive session), but trying to get an interactive bash shell with plain docker run eclipse-temurin:21-jdk bash, omitting -it, produces a container that starts and exits immediately with no usable terminal - the -it flags are specifically what make an interactive session actually usable.' },
    { type: 'interview', content: 'Q: What do the -i and -t flags in docker run -it eclipse-temurin:21-jdk bash each do individually, and what happens if only one is used?\nA: -i (interactive) keeps standard input open so commands can actually be typed into the container; -t allocates a pseudo-terminal so the session behaves like a normal terminal, with proper formatting and control characters. Using only one typically produces a session that either cannot accept input properly or displays incorrectly - both are needed together for a genuinely usable interactive shell inside the container.' },
  ],
}
