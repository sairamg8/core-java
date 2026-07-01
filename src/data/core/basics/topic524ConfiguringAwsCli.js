export default {
  id: 'configuring-aws-cli',
  title: '524. Configuring AWS CLI',
  explanation: `Every AWS action so far in this chapter has gone through the web-based Console (see [[deploying-app-on-elastic-beanstalk]]) — fine for a first deployment, but the ECS setup this chapter now moves toward (see [[introduction-to-ecs]]) involves enough repeated, precise steps that the **AWS CLI** becomes the more practical tool. This topic installs and configures it.

**Installing the CLI is a standard package install, platform-specific** (a single installer on macOS/Windows, a package manager install on Linux) — not covered step by step here since it changes over time; the AWS documentation always has the current instructions. What matters more is what comes right after: authentication.

**Configuring credentials — connecting the CLI to a real IAM identity, not the root user (see [[aws-account-signup-process]], [[aws-services-and-iam]]):**
\`\`\`bash
aws configure
# AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region: us-east-1
# Default output format: json
\`\`\`
The Access Key ID and Secret Access Key here belong to an **IAM user** created specifically for CLI use (see [[aws-services-and-iam]]) — generated once, from the IAM console, for a properly scoped user — never the root user's credentials, and never a key pasted from some tutorial found online.

**Verifying the CLI is actually authenticated and working:**
\`\`\`bash
aws sts get-caller-identity
\`\`\`
This returns the account ID and IAM identity (user or role) the CLI is currently authenticated as — a quick, safe way to confirm the right credentials are configured *before* running any command that actually creates or modifies AWS resources.

**Why these access keys deserve exactly the same handling discipline already established for every other secret in this course (the JWT signing secret, the OAuth2 client secret, database credentials — see [[project-setup-for-jwt]]).** An AWS Access Key/Secret Access Key pair grants whatever permissions the underlying IAM user has, usable from anywhere, by anyone holding it — leaking one (committing it to a public repository is the single most common real-world way this happens) is exactly as serious as leaking a database password, and \`aws configure\`'s credentials file (\`~/.aws/credentials\`) should never itself be committed to version control.`,
  code: `# Configure the CLI with a scoped IAM user's credentials (never root)
aws configure
# AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region: us-east-1
# Default output format: json

# Verify authentication before running anything that modifies resources
aws sts get-caller-identity
# {
#   "UserId": "AIDACKCEVSQ6C2EXAMPLE",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/job-app-cli-user"
# }`,
  codeTitle: 'Configuring and verifying AWS CLI authentication with a scoped IAM user',
  points: [
    'aws configure stores the Access Key ID and Secret Access Key of an IAM user locally, authenticating the CLI as that specific, scoped identity - never the root user.',
    'aws sts get-caller-identity confirms which account and IAM identity the CLI is currently authenticated as, before running any command that actually creates or modifies resources.',
    'AWS Access Keys deserve the same handling discipline as every other secret covered in this course - never hardcoded, never committed, and generated specifically for their intended use.',
    'The most common real-world leak of AWS credentials is accidentally committing the ~/.aws/credentials file or a key pasted directly into source code to a public repository.',
    'Using the CLI (rather than the Console) becomes more practical for the ECS setup ahead, which involves enough repeated, precise steps to benefit from scriptable commands.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Pasting an AWS Access Key and Secret Access Key directly into application code or a config file that gets committed is one of the most common real-world causes of major cloud security incidents - automated scanners actively search public GitHub repositories specifically for exposed AWS credentials within minutes of a push, and a leaked key with broad IAM permissions can result in significant unauthorized usage and billing.' },
    { type: 'interview', content: 'Q: Why should aws configure be run with credentials from a dedicated IAM user rather than the root user credentials of the AWS account?\nA: The root user has permanently unrestricted access to every resource in the account with no way to limit its permissions, so any leak or misuse of root credentials is a complete account compromise. A dedicated IAM user, scoped with only the specific permissions needed (following least privilege), limits the damage of a leaked credential to whatever narrow set of actions that user was actually granted - the same reasoning already established for using IAM instead of the root user throughout this chapter.' },
  ],
}
