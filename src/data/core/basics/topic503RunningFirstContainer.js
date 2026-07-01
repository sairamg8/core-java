export default {
  id: 'running-first-container',
  title: '503. Running First Container',
  explanation: `\`hello-world\` (see [[docker-setup]]) proved Docker works, but it's deliberately trivial — this topic runs something with actual, ongoing behavior: an \`nginx\` web server, which stays running rather than printing a message and exiting immediately, to see what a genuinely long-running container looks like.

**Running \`nginx\` and actually reaching it from a browser:**
\`\`\`bash
docker run -d -p 8080:80 nginx
\`\`\`
Navigating to \`http://localhost:8080\` in a browser now shows the default \`nginx\` welcome page — a real, running web server, started with one command, with no manual install of \`nginx\` itself on the host machine at all.

**Breaking down each flag, since these exact ones reappear constantly for the rest of this chapter:**
- \`-d\` (**detached**) — runs the container in the background, returning control of the terminal immediately, rather than blocking it with the container's live output
- \`-p 8080:80\` (**port mapping**) — maps port \`8080\` on the host machine to port \`80\` inside the container, in the format \`host:container\`. \`nginx\` listens on port \`80\` *inside* its own isolated container network — without this mapping, nothing outside the container could reach it at all.
- \`nginx\` — the image name; Docker pulls it from Docker Hub automatically if not already cached locally, exactly like \`hello-world\` did

**Why the port mapping direction (\`host:container\`) matters, and is easy to get backwards.** \`-p 8080:80\` means "requests to port \`8080\` on my machine get forwarded to port \`80\` inside the container" — \`nginx\` itself doesn't know or care what port the host is using; it always listens on \`80\` internally, same as it would outside a container. Reversing it (\`-p 80:8080\`) would instead expose the host's port \`80\` and forward to a port \`8080\` inside the container that \`nginx\` isn't even listening on — a common early source of "container runs, but I can't reach it" confusion.

**Confirming the container is actually running, and stopping it — the two commands that pair with every \`docker run\`:**
\`\`\`bash
docker ps                  # lists running containers
docker stop <container-id>  # stops it
\`\`\`
Both are covered in full in the next topic (see [[docker-commands]]), but seeing them here first, attached to something concrete just run, makes them far easier to remember than a bare command reference would.`,
  code: `# Run nginx, detached, mapping host port 8080 to container port 80
docker run -d -p 8080:80 nginx

# Now reachable at http://localhost:8080 in a browser

# Confirm it's actually running
docker ps
# CONTAINER ID   IMAGE   COMMAND                  PORTS                  NAMES
# 3f8a2b1c9d4e   nginx   "/docker-entrypoint..."  0.0.0.0:8080->80/tcp   festive_nginx

# Stop it when done
docker stop 3f8a2b1c9d4e`,
  codeTitle: 'Running a real, long-lived nginx container with port mapping',
  points: [
    '-d (detached) runs the container in the background, returning terminal control immediately rather than blocking on the live output of the container.',
    '-p 8080:80 maps host port 8080 to container port 80, in host:container order - the container itself always listens on its own internal port regardless of what host port is mapped to it.',
    'Getting the port mapping direction backwards (-p 80:8080 instead of -p 8080:80) is a common source of "container is running but unreachable" confusion.',
    'docker ps lists currently running containers, confirming a container actually started and is still alive.',
    'docker stop <container-id> stops a running container - the first pairing of run and stop that becomes routine for the rest of this chapter.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running docker run -p 80:8080 nginx (reversed from the correct -p 8080:80) starts successfully with no error at all, but the app becomes unreachable at the expected address, since nginx listens on port 80 inside the container - not the port number that happens to appear second in the mapping - and this specific mismatch produces no error message pointing at the actual cause.' },
    { type: 'interview', content: 'Q: In docker run -d -p 8080:80 nginx, what does the -p 8080:80 flag actually do, and which side of the colon refers to the container?\nA: It maps port 8080 on the host machine to port 80 inside the container, in host:container order. nginx always listens on port 80 internally regardless of the host mapping - the host-side number (8080 here) is simply the port a user or browser connects to on the host machine, which Docker then forwards to port 80 inside the container.' },
  ],
}
