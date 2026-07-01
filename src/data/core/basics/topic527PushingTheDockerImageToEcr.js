export default {
  id: 'pushing-the-docker-image-to-ecr',
  title: '527. Pushing The Docker Image To ECR',
  explanation: `PostgreSQL runs from a public Docker Hub image (\`postgres:16\`, see [[running-the-task-for-postgres]]) — but the Job app's own image (built back in the Docker chapter, see [[dockerfile-for-docker-images]]) exists only locally, or wherever it was built. This topic pushes it to **ECR (Elastic Container Registry)**, AWS's own container registry — a **Registry** in exactly the sense already established (see [[what-is-docker]]), just AWS-hosted instead of Docker Hub.

**Why the Job app's image needs its own registry, specifically, rather than reusing Docker Hub the way \`postgres:16\` did.** \`postgres:16\` is a public, official image anyone can pull freely — the Job app's image is a private, custom-built application, and ECS needs to be able to pull it during deployment. ECR is the natural choice specifically because it integrates directly with IAM (see [[aws-services-and-iam]]) for access control, rather than requiring a separate, external registry account and credential.

**Creating an ECR repository — the destination for the image, analogous to creating a bucket before uploading a file to it:**
\`\`\`bash
aws ecr create-repository --repository-name job-app
\`\`\`

**Authenticating Docker itself to ECR — a required step before any push, since Docker doesn't know about ECR credentials by default:**
\`\`\`bash
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
\`\`\`
This retrieves a temporary authentication token from ECR and pipes it directly into \`docker login\` — no long-lived password is stored or typed anywhere.

**Tagging and pushing the image — the exact \`docker build\`/\`tag\`/\`push\` sequence, applied to the Job app image already built earlier in this course:**
\`\`\`bash
docker build -t job-app .
docker tag job-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest
\`\`\`
\`docker tag\` doesn't copy or duplicate the image — it adds a second name pointing at the exact same image, in the exact format ECR (and any registry) expects: \`<registry-host>/<repository-name>:<tag>\`.

**What this one push actually enables, connecting straight to the very next topic.** With the image now sitting in ECR, a Task Definition can reference \`123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest\` as its \`image\` field — exactly the way \`postgres:16\` was referenced from Docker Hub earlier — letting ECS pull and run the actual Job app, not just PostgreSQL.`,
  code: `# Create the ECR repository
aws ecr create-repository --repository-name job-app

# Authenticate Docker to ECR (temporary token, piped directly - never stored)
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build, tag, and push
docker build -t job-app .
docker tag job-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/job-app:latest`,
  codeTitle: 'Authenticating to ECR, then tagging and pushing the Job app image',
  points: [
    'ECR is the container registry offered by AWS itself, playing the exact Registry role already established in the Docker chapter - just AWS-hosted and integrated with IAM instead of Docker Hub.',
    'A private, custom-built image (like the Job app) needs its own registry, unlike a public official image like postgres:16 which anyone can pull from Docker Hub directly.',
    'aws ecr get-login-password retrieves a temporary authentication token piped directly into docker login - no long-lived password is stored or typed.',
    'docker tag adds a second name to the exact same image (pointing at the ECR repository address) rather than duplicating it - the standard registry:repository:tag format any registry expects.',
    'Once pushed to ECR, an ECS Task Definition can reference the image by its ECR address, exactly the way postgres:16 was referenced from Docker Hub in the previous topic.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting to run docker login (or letting the temporary ECR authentication token expire, since it is short-lived) before docker push results in an authentication error at push time - re-running the aws ecr get-login-password | docker login sequence refreshes the token and resolves it.' },
    { type: 'interview', content: 'Q: Why does pushing a custom application image to ECR require a separate authentication step (docker login) compared to pulling a public image like postgres:16 from Docker Hub?\nA: Docker Hub public images require no authentication to pull at all, but ECR is a private, IAM-integrated registry - Docker itself has no built-in knowledge of AWS credentials, so a temporary authentication token must be explicitly retrieved via the AWS CLI and passed to docker login before Docker is permitted to push (or pull private images) to that specific ECR repository.' },
  ],
}
