export default {
  id: 'what-is-docker',
  title: '501. What Is Docker?',
  explanation: `With containerization understood conceptually (see [[solution-with-containerization]]), this topic defines **Docker** itself precisely — not as a synonym for "containers" in general, but as one specific, dominant implementation of the container idea, along with the exact vocabulary every later topic in this chapter builds on.

**Docker is a platform for building, shipping, and running containers** — not the only container technology that exists (containerd, Podman, and others also implement containers), but the one that made containerization broadly accessible and became the de facto standard tooling most teams actually use.

**The four core Docker concepts, defined precisely — these exact terms recur in every remaining topic of this chapter:**
- **Image** — a read-only template containing an application, its runtime, and its dependencies. Immutable once built — running it doesn't change it.
- **Container** — a running instance of an image. The relationship is exactly like a class and an object in Java: one image, many containers can run from it simultaneously, each an independent, isolated instance.
- **Dockerfile** — a text file of instructions describing how to build an image, step by step (what base OS/runtime to start from, what to copy in, what command to run).
- **Registry** — a place to store and share built images (Docker Hub is the default public registry; AWS ECR and GitHub Container Registry are common private alternatives, covered later in this course, see [[pushing-the-docker-image-to-ecr]] in the AWS chapter).

**Why "image vs. container" is worth getting precisely right before moving further**, since nearly every later topic depends on this distinction being second nature. Building an image is a one-time (or per-change) step; running a container from that image can happen any number of times, and multiple containers from the same image are fully independent of each other — stopping or modifying one container has zero effect on the image itself, or on any other container running from it.

**Where Docker fits relative to the two previous topics.** Docker is the concrete tool that implements the containerization approach (see [[solution-with-containerization]]) — it provides the container engine, the image format, the \`Dockerfile\` build system, and the client tooling (the \`docker\` CLI) used throughout the rest of this chapter.`,
  code: `# The relationship between these four core concepts:

# Dockerfile (text instructions)
#   --build-->  Image (immutable template)
#                  --run-->  Container 1 (running instance)
#                  --run-->  Container 2 (another, independent instance)
#                  --run-->  Container 3 (yet another instance)
#
# Image  --push-->  Registry (Docker Hub, ECR, GitHub Container Registry)
#                       --pull--> another machine can now run the same image`,
  codeTitle: 'How Dockerfile, Image, Container, and Registry relate to each other',
  points: [
    'Docker is one specific, dominant platform implementing containerization - not a synonym for containers in general, since other tools (containerd, Podman) also implement containers.',
    'An Image is an immutable, read-only template; a Container is a running instance of that image - the same relationship as a class and an object.',
    'A single image can produce any number of independent, isolated containers, and stopping or modifying one container has no effect on the image or on other containers from it.',
    'A Dockerfile is the text-based recipe describing how to build an image, step by step.',
    'A Registry (Docker Hub by default, or private alternatives like AWS ECR) is where built images are stored and shared so other machines can pull and run them.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Modifying files inside a running container (installing a package, editing a config file directly in the container) and expecting that change to persist the next time a new container is started from the same image is a common early mistake - those changes exist only in that specific running container, not in the underlying image, and are lost when the container is removed unless the image itself is rebuilt.' },
    { type: 'interview', content: 'Q: What is the precise relationship between a Docker image and a Docker container, and why does that distinction matter practically?\nA: An image is an immutable, read-only template; a container is a running instance created from that image, analogous to a class and an object in Java. The distinction matters because any number of independent containers can be started from the same image, and changes made inside one running container do not affect the image or any other container - only rebuilding the image itself changes what future containers will contain.' },
  ],
}
