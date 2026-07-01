export default {
  id: 'docker-architecture',
  title: '505. Docker Architecture',
  explanation: `Every command run so far (see [[docker-commands]]) has been typed as \`docker ...\` — this topic looks at what actually happens behind that single command, since \`docker\` is really a client talking to a separate background service, not a monolithic program doing everything itself.

**The three core architectural pieces:**
- **Docker Client** — the \`docker\` command-line tool typed into a terminal. It doesn't do any container work itself — it only sends requests.
- **Docker Daemon (\`dockerd\`)** — a persistent background process that actually does the real work: pulling images, creating and running containers, managing networks and volumes. This is the piece that was actually installed and started back in the setup topic (see [[docker-setup]]).
- **REST API** — the interface the client and daemon communicate over. Every \`docker\` command is translated into an API call to the daemon — meaning the daemon could, in principle, be controlled by tools other than the official CLI, using that same API directly.

**Why this client/daemon split matters, beyond being an implementation detail.** The daemon can run on a completely different machine than the client — \`docker\` commands can be configured to talk to a **remote** Docker daemon over the network, which is exactly the architecture behind managed container services and CI/CD pipelines that build and run containers on shared infrastructure rather than a developer's own laptop.

**Where images actually live, and how they get to a running container — connecting this architecture back to the earlier Image/Container/Registry vocabulary (see [[what-is-docker]]):**
\`\`\`
Docker Client (docker CLI)
      | REST API
      v
Docker Daemon (dockerd) ---- pulls from ----> Registry (Docker Hub, ECR, etc.)
      |
      |-- manages --> Images (local cache)
      |-- manages --> Containers (running instances)
      |-- manages --> Networks, Volumes
\`\`\`

**What this explains about something that might otherwise seem odd: why \`docker\` commands sometimes need elevated permissions, or fail with a "cannot connect to the Docker daemon" error.** Since the client is a separate process from the daemon, every command depends on the daemon actually running and being reachable — the "permission denied" issue mentioned briefly in the setup topic (see [[docker-setup]]) is really about the client failing to reach or authenticate with the daemon, not a problem with any individual container command itself.`,
  code: `# The architecture behind every "docker" command:

# docker run nginx  (typed in a terminal)
#   -> Docker Client sends a request over the REST API
#     -> Docker Daemon (dockerd) receives it
#       -> checks local image cache
#       -> pulls "nginx" from the Registry if not cached
#       -> creates and starts the container
#     -> Daemon reports status back to the Client
#   -> Client displays the result in the terminal`,
  codeTitle: 'What actually happens between typing docker run and a container starting',
  points: [
    'Docker has three core pieces: the Client (the docker CLI, which only sends requests), the Daemon (dockerd, which does the actual work), and a REST API connecting them.',
    'The Daemon is the persistent background process actually responsible for pulling images, running containers, and managing networks/volumes - the piece installed and started during setup.',
    'Every docker command is translated into a REST API call to the daemon, meaning tools other than the official CLI could control the daemon through that same API.',
    'The client and daemon can run on different machines - docker commands can target a remote daemon over the network, which underlies CI/CD pipelines and managed container services.',
    '"Cannot connect to the Docker daemon" errors are about the client failing to reach or authenticate with the daemon process, not a problem with any specific container command.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming the docker CLI itself does the actual work of running containers overlooks that it is only a thin client sending requests - if the Docker daemon is not running or not reachable, every docker command fails at the connection step, regardless of how correct the command itself is.' },
    { type: 'interview', content: 'Q: When docker run nginx is typed into a terminal, which component actually performs the work of pulling the image and starting the container?\nA: The Docker Daemon (dockerd), not the docker CLI itself. The CLI is a client that sends the request over a REST API to the daemon, which is the persistent background process that checks the local image cache, pulls from a registry if needed, and actually creates and starts the container - the client only sends the request and displays the result it receives back.' },
  ],
}
