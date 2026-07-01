export default {
  id: 'docker-commands',
  title: '504. Docker Commands',
  explanation: `Three commands appeared already while running \`nginx\` (see [[running-first-container]]) — \`run\`, \`ps\`, \`stop\`. This topic covers the full working set of commands needed to manage containers and images day to day, the reference every remaining hands-on topic in this chapter draws from.

**Container lifecycle commands:**
\`\`\`bash
docker ps                 # list RUNNING containers
docker ps -a               # list ALL containers, including stopped ones
docker stop <id>            # gracefully stop a running container
docker start <id>           # restart a previously stopped container (reuses it, doesn't create new)
docker rm <id>               # remove a stopped container permanently
docker logs <id>              # view a container's console output (essential for debugging)
docker exec -it <id> bash      # open an interactive shell INSIDE a running container
\`\`\`

**Image management commands:**
\`\`\`bash
docker images               # list locally cached images
docker pull <image>          # download an image without running it yet
docker rmi <image>            # remove a local image
docker build -t <name> .       # build an image from a Dockerfile (covered fully later, see [[dockerfile-for-docker-images]])
\`\`\`

**Why \`docker start\` and \`docker run\` are genuinely different commands, not two names for the same thing.** \`docker run\` always **creates a new container** from an image; \`docker start\` **resumes an existing, previously-stopped container** — reusing its filesystem state and container ID rather than creating a fresh one. Running \`docker run nginx\` repeatedly creates a *new, independent* \`nginx\` container each time (each getting its own auto-generated name and ID) — the distinction from the earlier image-vs-container topic (see [[what-is-docker]]) made concrete in command form.

**Why \`docker logs\` is often the very first debugging step for a container that isn't behaving as expected.** Since containers commonly run detached (\`-d\`, see [[running-first-container]]), there's no visible terminal output at all by default — \`docker logs <id>\` is how that hidden output actually gets inspected after the fact.

**Why \`docker exec -it <id> bash\` matters as a genuine debugging escape hatch.** It opens an interactive shell running *inside* the already-running container's isolated filesystem and process space — useful for inspecting files, checking environment variables, or running diagnostic commands exactly as they'd behave from inside the container, without stopping it or rebuilding anything.`,
  code: `# Container lifecycle
docker ps                    # running containers
docker ps -a                  # all containers, including stopped
docker stop <id>               # stop a running container
docker start <id>               # restart a stopped container (reuses it)
docker rm <id>                   # remove a stopped container
docker logs <id>                  # view a container's output
docker exec -it <id> bash          # shell into a running container

# Image management
docker images                 # list local images
docker pull <image>            # download without running
docker rmi <image>              # remove a local image
docker build -t <name> .         # build an image from a Dockerfile`,
  codeTitle: 'The core Docker CLI commands used throughout the rest of this chapter',
  points: [
    'docker run always creates a new container from an image; docker start resumes a previously stopped, existing container - these are genuinely different operations, not synonyms.',
    'docker ps shows only running containers by default; docker ps -a includes stopped ones as well.',
    'docker logs <id> is typically the first debugging step for a misbehaving container, since detached containers produce no visible output by default.',
    'docker exec -it <id> bash opens an interactive shell inside an already-running container, useful for inspecting files or environment variables without stopping or rebuilding anything.',
    'docker rm removes a container; docker rmi removes an image - the naming mirrors the image/container distinction and matters when cleaning up disk space.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker run nginx repeatedly, expecting it to reuse the same container each time, actually creates a brand new, independent container on every invocation - each with its own auto-generated name and separate state - which is a common source of confusion until the run-vs-start distinction is internalized.' },
    { type: 'interview', content: 'Q: What is the practical difference between docker run and docker start, and why does repeatedly running docker run nginx not just restart the same container?\nA: docker run always creates a brand new container instance from the specified image; docker start resumes a specific, already-existing container that was previously stopped, identified by its id or name. Since docker run creates a new container every time it is invoked, running it repeatedly with the same image produces multiple independent nginx containers, each with its own separate id and state, rather than reusing one.' },
  ],
}
