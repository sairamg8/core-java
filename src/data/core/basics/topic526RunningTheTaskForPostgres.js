export default {
  id: 'running-the-task-for-postgres',
  title: '526. Running The Task For Postgres',
  explanation: `The Task Definition from the previous topic (see [[creating-cluster-and-task]]) describes a PostgreSQL container, but nothing has actually started running yet — this topic launches it, and covers the two distinct ways ECS can run a Task, each suited to a different purpose.

**Option 1 — running a standalone Task directly, appropriate here since PostgreSQL is a single, long-lived process being started manually for this chapter's purposes:**
\`\`\`bash
aws ecs run-task \\
  --cluster job-app-cluster \\
  --task-definition job-app-task \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789],securityGroups=[sg-0123456789],assignPublicIp=ENABLED}"
\`\`\`
This starts exactly one Task from the registered Task Definition and stops there — if the Task crashes, nothing automatically restarts it.

**Confirming it's actually running:**
\`\`\`bash
aws ecs list-tasks --cluster job-app-cluster
aws ecs describe-tasks --cluster job-app-cluster --tasks <task-arn>
\`\`\`
\`describe-tasks\` shows the Task's current status (\`PENDING\`, \`RUNNING\`, \`STOPPED\`) and, once running, the actual network details (the ENI/IP address Fargate assigned it) needed to actually connect to it.

**Why \`run-task\` (a one-off Task) is the right choice here, but explicitly *not* the right choice for the Job app itself, previewed for the next topic.** \`run-task\` has no concept of "keep this running" — if the underlying Fargate infrastructure has an issue and the Task stops, it simply stays stopped. For something that genuinely needs to stay available (the actual Job app, serving real user requests), a **Service** (see [[introduction-to-ecs]]) is the correct tool — it wraps a Task Definition with exactly the "keep N running, replace failures automatically" behavior \`run-task\` alone doesn't provide.

**The specific, deliberate reason PostgreSQL is run as a plain Task here, not a Service, even though it's meant to persist.** This chapter mirrors the earlier Docker chapter's own choice to keep the very first \`nginx\` container simple (see [[running-first-container]]) — isolating "can ECS run *a* container successfully at all" from "how does ECS keep something running reliably long-term," covered properly once the Job app itself is deployed via a Service in a later topic.`,
  code: `# Launch a standalone Task from the registered Task Definition
aws ecs run-task \\
  --cluster job-app-cluster \\
  --task-definition job-app-task \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789],securityGroups=[sg-0123456789],assignPublicIp=ENABLED}"

# Confirm it's running
aws ecs list-tasks --cluster job-app-cluster
aws ecs describe-tasks --cluster job-app-cluster --tasks <task-arn>
# status: "RUNNING", plus the actual network interface/IP assigned by Fargate`,
  codeTitle: 'Launching a standalone ECS Task and confirming it is running',
  points: [
    'aws ecs run-task launches exactly one Task from a registered Task Definition, with no built-in mechanism to restart it if it stops.',
    'describe-tasks shows the current Task status (PENDING, RUNNING, STOPPED) and, once running, the actual network details needed to connect to it.',
    'run-task is appropriate for a one-off or manually managed Task; anything that needs to stay reliably available requires a Service instead, which adds the "keep N running, replace failures" behavior run-task lacks.',
    'Running PostgreSQL as a plain Task here (rather than a Service) is a deliberate simplification, isolating "can ECS run a container at all" from "how does ECS keep something running long-term."',
    'This mirrors the same incremental approach used in the Docker chapter, where the first container run (nginx) was kept deliberately simple before more advanced patterns were introduced.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running a genuinely important, long-lived workload (like a real production database or the Job app itself) via run-task rather than a Service means there is no automatic recovery if the Task stops for any reason - it simply stays stopped until someone notices and manually runs it again, unlike a Service which detects and replaces a stopped Task automatically.' },
    { type: 'interview', content: 'Q: What is the practical difference between launching an ECS Task with run-task and running the same Task Definition through a Service?\nA: run-task starts a specified number of Tasks once and has no ongoing management - if a Task stops for any reason, nothing restarts it automatically. A Service continuously monitors and maintains a specified number of running Tasks from a Task Definition, automatically replacing any that stop or fail, which is the behavior actually needed for anything that must stay reliably available, like a production application.' },
  ],
}
