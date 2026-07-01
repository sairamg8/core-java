export default {
  id: 'creating-cluster-and-task',
  title: '525. Creating Cluster And Task',
  explanation: `With the CLI configured (see [[configuring-aws-cli]]), this topic actually creates the two foundational ECS resources introduced conceptually earlier (see [[introduction-to-ecs]]): a **Cluster** and a **Task Definition** — the container-level equivalent of the EC2 instance/environment setup Elastic Beanstalk handled automatically.

**Creating a Cluster — the compute capacity Tasks will actually run on:**
\`\`\`bash
aws ecs create-cluster --cluster-name job-app-cluster
\`\`\`
This example uses **Fargate** (see [[introduction-to-ecs]]) — AWS-managed compute with no EC2 instance to provision — which is precisely why creating the cluster itself is this simple: there's no underlying EC2 instance type or count to specify at all.

**Writing a Task Definition — the blueprint describing what to run, as a JSON document:**
\`\`\`json
{
  "family": "job-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "postgres",
      "image": "postgres:16",
      "portMappings": [{ "containerPort": 5432 }],
      "environment": [
        { "name": "POSTGRES_DB", "value": "jobapp" },
        { "name": "POSTGRES_PASSWORD", "value": "postgres" }
      ]
    }
  ]
}
\`\`\`
Registering it:
\`\`\`bash
aws ecs register-task-definition --cli-input-json file://task-def.json
\`\`\`

**Reading each field, connecting directly back to Docker Compose concepts already covered (see [[docker-compose-topic]]).** \`cpu\`/\`memory\` specify Task-level resource limits (analogous to resource limits in a Compose file); \`containerDefinitions\` is genuinely the same idea as a Compose \`services\` block — one or more containers, each with an image, port mappings, and environment variables — just expressed as ECS's own JSON schema instead of YAML.

**Why \`requiresCompatibilities: ["FARGATE"]\` matters specifically.** It declares upfront which launch type (see [[introduction-to-ecs]]) this Task Definition is compatible with — \`awsvpc\` networking mode is a Fargate requirement, giving each Task its own dedicated network interface, distinct from the EC2 launch type's networking model.

**What's deliberately still missing at this point, on purpose.** This Task Definition describes *what* to run, but nothing has actually been started yet — no running Task, no Service keeping it alive. That's the very next topic (see [[running-the-task-for-postgres]]), which takes this exact Task Definition and actually launches it.`,
  code: `# Create the cluster (Fargate - no EC2 instance to specify)
aws ecs create-cluster --cluster-name job-app-cluster

# task-def.json - the blueprint for a PostgreSQL Task
{
  "family": "job-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "postgres",
      "image": "postgres:16",
      "portMappings": [{ "containerPort": 5432 }],
      "environment": [
        { "name": "POSTGRES_DB", "value": "jobapp" },
        { "name": "POSTGRES_PASSWORD", "value": "postgres" }
      ]
    }
  ]
}

# Register it
aws ecs register-task-definition --cli-input-json file://task-def.json`,
  codeTitle: 'Creating an ECS Cluster and registering a Task Definition for PostgreSQL',
  points: [
    'Creating a Fargate cluster requires no EC2 instance specification at all, since Fargate is AWS-managed compute - this is exactly why the create-cluster command is this minimal.',
    'A Task Definition is a JSON blueprint - family, resource limits (cpu/memory), and containerDefinitions - conceptually the same information a Docker Compose file expresses in YAML.',
    'containerDefinitions plays the same role as a Compose services block: one or more containers, each with an image, port mappings, and environment variables.',
    'requiresCompatibilities: ["FARGATE"] declares which launch type this Task Definition supports; awsvpc networking mode is required for Fargate, giving each Task its own network interface.',
    'Registering a Task Definition only describes what to run - it does not start anything running yet; actually launching a Task is the next topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Hardcoding a real password directly into the environment array of a Task Definition (as shown here for simplicity) is the ECS equivalent of hardcoding a database password in application.properties - a real deployment should reference AWS Secrets Manager or SSM Parameter Store instead, injecting the value at runtime rather than storing it in plain text inside the Task Definition JSON.' },
    { type: 'interview', content: 'Q: What is the relationship between the containerDefinitions field of an ECS Task Definition and a Docker Compose services block?\nA: They express conceptually the same information - one or more containers, each with an image, port mappings, and environment variables - just in different schemas. containerDefinitions is the JSON format ECS itself uses for describing what to run, while Compose uses YAML; both describe container configuration declaratively rather than as a sequence of individual docker run flags.' },
  ],
}
