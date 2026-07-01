export default {
  id: 'running-java-app-task',
  title: '528. Running Java App Task',
  explanation: `With the Job app's image now sitting in ECR (see [[pushing-the-docker-image-to-ecr]]) and PostgreSQL already running as an ECS Task (see [[running-the-task-for-postgres]]), this final topic in the chapter runs the Job app itself as a Task — the actual milestone the entire AWS chapter has been building toward, and the direct ECS counterpart to Elastic Beanstalk's simpler deployment covered earlier (see [[deploying-app-on-elastic-beanstalk]]).

**A Task Definition for the Job app, referencing the ECR image and the same externalized configuration pattern already established (see [[spring-project-with-database]]):**
\`\`\`json
{
  "family": "job-app-web-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "job-app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest",
      "portMappings": [{ "containerPort": 8080 }],
      "environment": [
        { "name": "DB_URL", "value": "jdbc:postgresql://<postgres-task-ip>:5432/jobapp" },
        { "name": "DB_USERNAME", "value": "postgres" },
        { "name": "DB_PASSWORD", "value": "postgres" }
      ]
    }
  ]
}
\`\`\`

**Running it, exactly the same \`run-task\` command already used for PostgreSQL (see [[running-the-task-for-postgres]]), just against this new Task Definition:**
\`\`\`bash
aws ecs register-task-definition --cli-input-json file://job-app-task-def.json
aws ecs run-task --cluster job-app-cluster --task-definition job-app-web-task \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789],securityGroups=[sg-0123456789],assignPublicIp=ENABLED}"
\`\`\`

**The one real, honest gap this simple setup exposes, previewed rather than fully solved here — worth naming rather than glossing over.** \`<postgres-task-ip>\` in the environment above is a real problem: a standalone Fargate Task's IP address isn't fixed or predictable, and changes if that Task ever restarts — a fragile way to connect two Tasks together. A production ECS setup solves this properly with **Service Discovery** or by putting the database behind RDS instead (as the earlier Elastic Beanstalk deployment already did, see [[creating-database-in-aws-rds]]) rather than running PostgreSQL as a Task at all — the Microservices chapter later in this course covers service-to-service communication patterns like this in much greater depth.

**What this milestone represents for the whole AWS chapter.** The Job app, containerized in the Docker chapter, now runs on ECS — the same portable image built weeks of course-content ago, deployed through a genuinely different mechanism than Elastic Beanstalk, demonstrating concretely that the earlier investment in Docker (a portable, environment-independent artifact) pays off across more than one deployment target.`,
  code: `# job-app-task-def.json
{
  "family": "job-app-web-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "job-app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest",
      "portMappings": [{ "containerPort": 8080 }],
      "environment": [
        { "name": "DB_URL", "value": "jdbc:postgresql://<postgres-task-ip>:5432/jobapp" },
        { "name": "DB_USERNAME", "value": "postgres" },
        { "name": "DB_PASSWORD", "value": "postgres" }
      ]
    }
  ]
}

aws ecs register-task-definition --cli-input-json file://job-app-task-def.json
aws ecs run-task --cluster job-app-cluster --task-definition job-app-web-task \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789],securityGroups=[sg-0123456789],assignPublicIp=ENABLED}"`,
  codeTitle: 'Running the Job app itself as an ECS Task, referencing its ECR image',
  points: [
    'The Job app Task Definition references the image pushed to ECR in the previous topic, using the same run-task command already used for PostgreSQL.',
    'This is the concrete milestone the entire AWS chapter builds toward: the exact image built in the Docker chapter, now running on ECS.',
    'The IP address of a standalone Fargate Task is not fixed and changes if the Task restarts, making direct IP-based container-to-container connection fragile - a real, honest limitation of this simplified setup.',
    'A production setup solves this with Service Discovery, or (as the earlier Elastic Beanstalk deployment in this chapter already did) by using RDS instead of running the database as a plain ECS Task at all.',
    'This chapter demonstrates the payoff of the earlier Docker investment concretely: the same portable container image now runs successfully via two genuinely different AWS deployment mechanisms.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Hardcoding the current IP address of a Postgres Task into the Task Definition of the Job app works only until that Postgres Task restarts for any reason (a Fargate maintenance event, a crash) - at which point it gets a new IP and the Job app silently loses connectivity to the database with no obvious error pointing at the actual cause.' },
    { type: 'interview', content: 'Q: What is the honest limitation of connecting the Job app Task directly to a standalone PostgreSQL Task by IP address in this simplified ECS setup, and how would a real production setup address it?\nA: The IP address of a standalone Fargate Task is not fixed and changes if the Task restarts for any reason, so hardcoding it is fragile and will silently break connectivity after any restart. A real production setup would use ECS Service Discovery to resolve the database by a stable name instead of a raw IP, or more commonly, avoid running the database as a Task entirely and use a managed RDS instance instead, exactly as the earlier Elastic Beanstalk deployment in this chapter already did.' },
  ],
}
