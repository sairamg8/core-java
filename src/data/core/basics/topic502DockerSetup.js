export default {
  id: 'docker-setup',
  title: '502. Docker Setup',
  explanation: `With the core vocabulary in place (see [[what-is-docker]]), this topic is the practical step of actually getting Docker installed and confirming it works — the prerequisite for every hands-on topic that follows in this chapter.

**Docker Desktop — the standard way to get Docker running on a development machine (Windows and macOS).** Docker Desktop bundles the Docker Engine, the \`docker\` CLI, and (as covered in the previous topic, see [[solution-with-containerization]]) a lightweight Linux VM on Windows/macOS specifically to provide the shared Linux kernel containers need. Installing it is a standard downloaded-installer process — no different from installing any other desktop application.

**On Linux, Docker Engine installs natively, with no VM layer needed at all** — since Linux already provides the kernel containers run on directly, there's no "provide a compatible kernel" step required the way there is on Windows/macOS. This is a direct, concrete consequence of the shared-kernel architecture from the previous topic.

**Verifying the installation — the standard first command run on any fresh Docker install:**
\`\`\`bash
docker --version
# Docker version 25.0.3, build 4debf41

docker run hello-world
\`\`\`
\`docker run hello-world\` pulls a tiny, purpose-built image from Docker Hub (the default registry, see [[what-is-docker]]) and runs it — its entire job is printing a confirmation message proving the installation actually works end to end: image pull, container creation, and container execution all succeeded.

**What actually happens behind that one command, worth tracing through explicitly since it previews the exact flow every later \`docker run\` follows:**
1. Docker checks whether the \`hello-world\` image already exists locally
2. If not, it's pulled from Docker Hub automatically
3. A new container is created from that image
4. The container runs, prints its message, and exits

**Why this specific verification step matters before moving to anything more complex.** If \`docker run hello-world\` fails, every later topic in this chapter (running a real container, building a custom image) will fail for the same underlying reason — confirming this baseline works first isolates "Docker itself isn't installed correctly" from "something is wrong with a specific image or Dockerfile," which otherwise become much harder to tell apart once real application containers are involved.`,
  code: `# Verify installation
docker --version
# Docker version 25.0.3, build 4debf41

# Run the standard first container - confirms the full pull/create/run flow
docker run hello-world

# Expected output includes:
# "Hello from Docker!"
# "This message shows that your installation appears to be working correctly."`,
  codeTitle: 'The standard Docker installation verification: docker run hello-world',
  points: [
    'Docker Desktop bundles the Docker Engine, CLI, and (on Windows/macOS) a lightweight Linux VM providing the shared kernel containers need.',
    'On Linux, Docker Engine installs natively with no VM layer, since Linux already provides a compatible kernel directly.',
    'docker run hello-world is the standard verification command - it pulls a minimal image from Docker Hub, creates a container, runs it, and confirms the entire pull/create/run pipeline works.',
    'The sequence behind docker run - check local image cache, pull if missing, create container, run it - is the exact flow every later docker run command in this chapter follows.',
    'Verifying this baseline first isolates installation problems from application-specific problems, which become much harder to distinguish once real Dockerfiles and custom images are involved.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker commands and getting a "permission denied" or "cannot connect to the Docker daemon" error on Linux typically means the current user is not in the docker group or the Docker service is not running - this is an environment/setup issue, not a problem with any specific Docker command being run.' },
    { type: 'interview', content: 'Q: What exactly happens when docker run hello-world is executed on a machine for the first time?\nA: Docker first checks whether the hello-world image exists in its local cache; since it does not on a fresh install, Docker pulls it from Docker Hub (the default registry). A new container is then created from that image and started, at which point it prints a confirmation message and exits. This single command exercises the full image-pull, container-creation, and container-execution pipeline used by every later docker run command.' },
  ],
}
