export default {
  id: 'introduction-to-ecs',
  title: '523. Introduction to ECS',
  explanation: `Elastic Beanstalk (see [[deploying-app-on-elastic-beanstalk]]) deploys an uploaded JAR directly, with AWS choosing how to run it. This topic introduces **ECS (Elastic Container Service)** — a different deployment model that connects straight back to the Docker chapter (see [[docker-volumes]]): running the Job app's actual **container image**, not a raw JAR, as a first-class AWS-managed workload.

**Why this matters, stated as a direct connection rather than a new idea from scratch.** The entire Docker chapter built toward one thing: a portable container image that runs identically anywhere (see [[docker-introduction]]). Elastic Beanstalk, so far, has sidestepped Docker entirely — deploying a JAR directly. ECS is where that earlier investment in containerization actually gets used: the exact same image built in the Docker chapter can run on ECS with no changes.

**The core ECS vocabulary, each concept introduced here and built on by the remaining AWS topics:**
- **Task Definition** — a blueprint describing which container image to run, how much CPU/memory it needs, and its networking/environment configuration — conceptually similar to a Kubernetes Pod spec, for readers who've encountered that elsewhere, though ECS is AWS's own distinct system
- **Task** — a running instance of a Task Definition — the ECS equivalent of a Docker container actually running
- **Service** — keeps a specified number of Tasks running continuously, automatically replacing any that fail or stop — the piece that provides actual production reliability
- **Cluster** — the underlying compute capacity Tasks actually run on

**Two ways ECS actually runs a Task's underlying compute — the one major decision ECS introduces that Elastic Beanstalk abstracted away entirely.**
- **EC2 launch type** — Tasks run on EC2 instances the developer provisions and manages directly, more control, more responsibility
- **Fargate launch type** — a "serverless" option where AWS manages the underlying compute entirely; specify the container and its resource needs, and Fargate runs it with no EC2 instance to provision or manage at all

**Why ECS is introduced only now, after Elastic Beanstalk, rather than first.** Elastic Beanstalk demonstrated the *concept* of cloud deployment (a JAR becomes a live URL) with the absolute minimum number of new ideas at once. ECS introduces genuinely new vocabulary (Task Definition, Task, Service, Cluster) and a real architectural choice (EC2 vs. Fargate) — appropriate to introduce once the basic deployment concept from Elastic Beanstalk is already solid, not before.`,
  code: `# ECS core vocabulary, connecting straight back to Docker chapter concepts:

# Task Definition  - blueprint: which image, how much CPU/memory, config
#                     (built from the exact image created in the Docker chapter)
# Task             - a running instance of a Task Definition
#                     (the ECS equivalent of "docker run" actually happening)
# Service          - keeps N Tasks running continuously, replacing failed ones
# Cluster          - the underlying compute capacity Tasks run on

# Two launch types for that underlying compute:
# EC2 launch type  - you provision and manage the EC2 instances yourself
# Fargate          - AWS manages compute entirely - no EC2 instance to manage`,
  codeTitle: 'ECS vocabulary: Task Definition, Task, Service, Cluster, and launch types',
  points: [
    'ECS runs the actual container image built in the Docker chapter directly, unlike Elastic Beanstalk which deploys a raw JAR and abstracts away Docker entirely.',
    'A Task Definition is a blueprint (which image, how much CPU/memory, networking/config); a Task is a running instance of that blueprint - the ECS equivalent of a container actually running.',
    'A Service keeps a specified number of Tasks running continuously, automatically replacing any that fail - the piece providing actual production reliability.',
    'The EC2 launch type means provisioning and managing the underlying EC2 instances directly; the Fargate launch type is "serverless" - AWS manages the compute entirely with no EC2 instance to manage at all.',
    'ECS is introduced after Elastic Beanstalk deliberately, since it adds genuinely new vocabulary and a real architectural decision (EC2 vs. Fargate) appropriate once the basic deployment concept is already solid.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming ECS Tasks and Docker containers are unrelated concepts overlooks that a Task Definition directly references a Docker image (the exact same one built and pushed in the Docker chapter) - ECS is fundamentally a way to run that same container image reliably at scale on AWS, not a separate deployment mechanism requiring different application packaging.' },
    { type: 'interview', content: 'Q: What is the fundamental difference between deploying to Elastic Beanstalk and deploying to ECS, in terms of what artifact is actually deployed?\nA: Elastic Beanstalk deploys a raw application artifact (a JAR, in this case) and manages the underlying EC2/load balancer infrastructure automatically, without any Docker involvement. ECS deploys an actual Docker container image directly - the same one built in the Docker chapter - as a Task, managed by a Service for reliability, running on either self-managed EC2 instances or AWS-managed Fargate compute.' },
  ],
}
