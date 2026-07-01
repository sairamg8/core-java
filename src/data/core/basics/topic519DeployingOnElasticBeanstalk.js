export default {
  id: 'deploying-on-elastic-beanstalk',
  title: '519. Deploying On Elastic Beanstalk',
  explanation: `With the minimal app built and verified locally (see [[simple-web-app-project]]), this topic actually deploys it to AWS — using **Elastic Beanstalk**, specifically because it hides most of the manual infrastructure setup a raw EC2 deployment would otherwise require, letting a first deployment focus on the concept rather than a long list of manual configuration steps.

**What Elastic Beanstalk actually does, described precisely — a platform-as-a-service layer on top of raw AWS infrastructure.** Given just an application artifact (a JAR, in this case) and a chosen "platform" (Java/Corretto, in this case), Elastic Beanstalk automatically provisions and wires together an EC2 instance to run the app, a load balancer in front of it, auto-scaling rules, and health monitoring — all the individual pieces a manual EC2 deployment would otherwise require configuring by hand, one at a time.

**The deployment flow, using the AWS Console (the web-based UI):**
1. Create a new Elastic Beanstalk **application** and **environment**, choosing the "Java" (Corretto) platform
2. Upload the built JAR (\`simple-web-app-0.0.1-SNAPSHOT.jar\`) as a new application version
3. Elastic Beanstalk provisions the underlying EC2 instance(s), load balancer, and security groups automatically
4. Once environment health shows "OK," the provided URL (something like \`simple-web-app-env.eba-xyz.us-east-1.elasticbeanstalk.com\`) serves the app

**Why Elastic Beanstalk is the right tool for a *first* AWS deployment specifically, even though it's not the most flexible option available.** It trades some fine-grained control (which the raw EC2/manual approach, or the ECS/container approach covered later in this chapter, both offer more of) for a dramatically shorter path from "have a JAR" to "have a working, publicly reachable URL" — exactly the right tradeoff for confirming the deployment concept works at all, before layering on more control later.

**What Elastic Beanstalk does *not* remove: the underlying AWS resources are real and billed.** "Managed" and "automatic" describe how the setup work is handled, not that the resulting EC2 instance and load balancer are free or exempt from Free Tier limits (see [[aws-account-signup-process]]) — the billing alert set up during account signup is exactly the safeguard that matters here, once real infrastructure is actually running.`,
  code: `# The Elastic Beanstalk deployment flow, at a glance:

# 1. Build the JAR locally
./mvnw clean package -DskipTests

# 2. In the AWS Console:
#    - Create Application -> "simple-web-app"
#    - Create Environment -> Platform: Java (Corretto)
#    - Upload: target/simple-web-app-0.0.1-SNAPSHOT.jar

# 3. Elastic Beanstalk provisions EC2, load balancer, auto-scaling automatically

# 4. Once environment health is "OK":
#    http://simple-web-app-env.eba-xyz.us-east-1.elasticbeanstalk.com/
#    -> "Hello from AWS!"`,
  codeTitle: 'From a built JAR to a live, publicly reachable Elastic Beanstalk URL',
  points: [
    'Elastic Beanstalk is a platform-as-a-service layer that automatically provisions EC2, a load balancer, auto-scaling, and health monitoring from just an uploaded application artifact.',
    'Deploying through the AWS Console means creating an application and environment, choosing the Java platform, and uploading the built JAR - Elastic Beanstalk wires the rest together.',
    'Elastic Beanstalk trades fine-grained control (available with raw EC2 or ECS) for a dramatically shorter path from "have a JAR" to "have a publicly reachable URL" - the right tradeoff for a first deployment.',
    'The underlying EC2 instance and load balancer Elastic Beanstalk provisions are real, billed AWS resources - "managed" and "automatic" describe the setup process, not that the resources are free.',
    'The billing alerts (AWS Budgets) set up during account signup become genuinely relevant the moment real infrastructure like this is actually running.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Deploying to Elastic Beanstalk and then forgetting the environment is still running (and billing) even when not actively being used is a common early AWS mistake - unlike a purely local Docker container, an Elastic Beanstalk environment keeps its EC2 instance and load balancer running (and billing) continuously until the environment is explicitly terminated.' },
    { type: 'interview', content: 'Q: What specifically does Elastic Beanstalk automate that a raw EC2 deployment would otherwise require doing manually?\nA: Given just an application artifact and a chosen platform, Elastic Beanstalk automatically provisions and connects an EC2 instance to run the app, a load balancer in front of it, auto-scaling rules, and health monitoring - all pieces that a manual EC2 deployment would require configuring individually. This makes it well suited to a first deployment, trading some fine-grained control for a much faster path to a working, publicly reachable application.' },
  ],
}
