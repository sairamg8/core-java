export default {
  id: 'aws-account-signup-process',
  title: '516. AWS Account Signup Process',
  explanation: `With AWS chosen as the provider for this chapter (see [[choosing-a-cloud-provider]]), this topic covers the practical first step: actually creating an AWS account — and the handful of decisions made during signup that matter for real safety, not just formality.

**The signup flow, at a high level.** Creating an AWS account requires an email address, a payment method (a credit or debit card — required even to use the **Free Tier**, covered below), and identity verification (typically a phone call or SMS code). The account created this way is the **root user** — and understanding exactly what that means is the single most important thing to get right during signup.

**The root user has unrestricted access to every AWS service and every resource in the account, permanently, by definition.** Unlike the more limited, task-specific users this chapter builds later via IAM (see [[aws-services-and-iam]], next), the root user cannot have its permissions restricted at all — it can delete any resource, change any billing setting, or even close the entire account. This is precisely why AWS's own official guidance is to **never use the root user for everyday work** — it should be used only for the handful of tasks that genuinely require it (initial account setup, changing the account's payment method), with a properly restricted IAM user created immediately afterward for actual day-to-day use.

**Securing the root user immediately after signup — not an optional afterthought.** Enabling **MFA (Multi-Factor Authentication)** on the root user specifically is the single highest-leverage security step available at this stage — since the root user's access can never be limited by permissions, a compromised root password without MFA is a complete, unrestricted account takeover.

**The AWS Free Tier — what it actually offers, and the one honest caveat about it.** AWS offers a Free Tier: limited usage of many services (a small EC2 instance, a small amount of S3 storage, RDS usage under a monthly threshold) genuinely free for the first 12 months on some services, and permanently free at low usage levels on others. **The caveat: exceeding Free Tier limits results in real charges** — the payment method on file is billed automatically, with no default spending cap — which is exactly why **AWS Budgets** (a billing alert service, configured right after signup) is worth setting up immediately, before doing anything else in this chapter.`,
  code: `# The signup essentials, in order:
# 1. Create the account (email, payment method, identity verification)
#    -> this becomes the "root user" - unrestricted, permanent access

# 2. Enable MFA on the root user IMMEDIATELY
#    (the single highest-leverage security step at this stage)

# 3. Set up AWS Budgets - a billing alert
#    (Free Tier limits are real; exceeding them bills the card on file automatically)

# 4. Stop using the root user for everyday work from this point forward -
#    the next topic creates a properly restricted IAM user for that instead`,
  codeTitle: 'The essential steps right after AWS account signup, before doing anything else',
  points: [
    'The account created during signup is the "root user" - it has unrestricted access to every service and resource, and that access can never be limited by permissions.',
    'AWS official guidance is to never use the root user for everyday work - it should be reserved for the few tasks that genuinely require it, like initial setup and billing changes.',
    'Enabling MFA on the root user immediately after signup is the single highest-leverage security step, since a compromised root password without MFA means complete, unrestricted account takeover.',
    'The AWS Free Tier offers genuinely free usage of many services at low volumes, but exceeding those limits results in real charges billed automatically to the card on file, with no default spending cap.',
    'Setting up AWS Budgets (billing alerts) immediately after signup, before using any other AWS service, is a practical safeguard against unexpected charges.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Continuing to use the root user for everyday development tasks (rather than creating a restricted IAM user, covered next) means every mistake - an accidental resource deletion, a misconfigured setting - happens with full, unrestricted account access and no permission boundary to limit the damage.' },
    { type: 'interview', content: 'Q: Why is enabling MFA on the AWS root user specifically considered the single most important security step immediately after account signup?\nA: The root user has unrestricted access to every service and resource in the account, and unlike IAM users, its permissions can never be limited or scoped down. A compromised root password without MFA in place means a complete, unrestricted takeover of the entire account, including billing - MFA is the one control that meaningfully protects against that specific, high-impact risk.' },
  ],
}
