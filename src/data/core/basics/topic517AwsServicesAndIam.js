export default {
  id: 'aws-services-and-iam',
  title: '517. AWS Services and IAM',
  explanation: `The previous topic ended with a promise: stop using the root user, and create a properly restricted user instead (see [[aws-account-signup-process]]) — this topic covers **IAM (Identity and Access Management)**, the AWS service that makes that possible, along with the handful of core AWS services this chapter's remaining topics actually use.

**The core AWS services this chapter touches, at a glance — each covered in depth in its own later topic:**
- **EC2 (Elastic Compute Cloud)** — virtual machines; rent a server, choose its size, manage its OS
- **RDS (Relational Database Service)** — a managed PostgreSQL/MySQL database; AWS handles backups, patching, and replication instead of self-managing a database server
- **Elastic Beanstalk** — a higher-level deployment service that provisions and manages EC2, load balancing, and scaling automatically from just an uploaded application artifact (covered in depth soon, see [[deploying-on-elastic-beanstalk]])
- **ECS (Elastic Container Service)** — runs Docker containers directly on AWS, connecting straight back to the previous chapter's containerized Job app (covered later, see [[introduction-to-ecs]])
- **IAM** — this topic's actual subject: who can do what, across every other service listed above

**What IAM actually manages — three core concepts:**
- **Users** — an individual identity (a person, or an application) with its own credentials
- **Roles** — a set of permissions that can be *assumed* temporarily, without permanent credentials — the standard way an EC2 instance or application gets permission to call other AWS services, rather than embedding a user's long-lived credentials directly in code
- **Policies** — JSON documents defining exactly what actions are allowed or denied on which resources; attached to a user or role to actually grant permissions

**A minimal IAM policy, to make "JSON document defining permissions" concrete:**
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::job-app-uploads/*"
    }
  ]
}
\`\`\`
This policy allows reading and writing objects only within the specific \`job-app-uploads\` S3 bucket — nothing else. Attaching it to a user or role grants exactly that access and nothing more.

**The principle of least privilege — the guiding rule every policy in this chapter follows.** Grant only the specific permissions actually needed for a given task, nothing broader — the deliberate opposite of the root user's unrestricted access from the previous topic. A properly scoped IAM user or role that's compromised limits the damage to whatever narrow set of actions it was actually granted, rather than the entire account.`,
  code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::job-app-uploads/*"
    }
  ]
}
// This IAM policy grants ONLY read/write on one specific S3 bucket -
// nothing else in the account is accessible through it.`,
  codeTitle: 'A minimal, least-privilege IAM policy scoped to one S3 bucket',
  points: [
    'The core AWS services used in this chapter are EC2 (virtual machines), RDS (managed databases), Elastic Beanstalk (higher-level deployment), ECS (container hosting), and IAM (access control across all of them).',
    'IAM Users are individual identities with their own credentials; Roles are permission sets that can be assumed temporarily without permanent credentials; Policies are JSON documents defining what is allowed or denied.',
    'A Role is the standard way an EC2 instance or application gets permission to call other AWS services, avoiding long-lived credentials embedded directly in code.',
    'A policy scopes permissions to specific actions on specific resources - the example policy allows S3 read/write only within one named bucket, nothing else in the account.',
    'The principle of least privilege - granting only what a task actually needs - limits the blast radius of a compromised credential to whatever narrow permissions it was actually given.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Attaching a broad managed policy like AdministratorAccess to an IAM user "just to get something working quickly" recreates the exact root-user risk this chapter just moved away from - a compromised credential with that policy attached has effectively the same unrestricted reach as the root user itself.' },
    { type: 'interview', content: 'Q: What is the difference between an IAM User, a Role, and a Policy, and how do they work together?\nA: A Policy is a JSON document defining what specific actions are allowed or denied on which resources. A User is an individual identity with permanent credentials, and a Role is a set of permissions that can be assumed temporarily without permanent credentials - the standard way applications or EC2 instances get AWS access. Policies are attached to either Users or Roles to actually grant the permissions they define; neither a User nor a Role has any access at all until a Policy is attached.' },
  ],
}
