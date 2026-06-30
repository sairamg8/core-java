export default {
  id: 'aws-deploy',
  title: '2. AWS Deployment — EC2, ECS & Elastic Beanstalk',
  explanation: `Three common ways to deploy a Spring Boot JAR/Docker container on AWS:

**1. EC2 (Elastic Compute Cloud)**
A virtual machine you fully manage. You install Java, copy the JAR, run it. Maximum control, maximum management burden.
- Use when: you need specific OS config, custom networking, or full control

**2. Elastic Beanstalk**
Platform-as-a-Service (PaaS) — upload your JAR and AWS manages the EC2 instances, load balancer, auto-scaling, and health monitoring.
- Use when: you want simplicity for a standard web app. Lowest operational overhead.

**3. ECS (Elastic Container Service)**
Container orchestration — run Docker containers on a cluster of EC2 instances or on AWS Fargate (serverless containers — no instances to manage).
- Use when: you containerize everything (Docker), need microservices orchestration, or want Fargate's zero-server-management

**Elastic Beanstalk is the quickest path for a Java developer** deploying a monolith or simple service.`,
  code: `# === Deploy Spring Boot JAR to Elastic Beanstalk ===

# 1. Install the EB CLI
pip install awsebcli

# 2. Initialize EB in your project root
eb init my-spring-app --platform "java" --region us-east-1

# 3. Create an environment (first deploy)
eb create production --instance-type t3.small --single   # --single = no load balancer
# or with load balancer and auto-scaling:
eb create production --instance-type t3.small --min-instances 2 --max-instances 5

# 4. Build JAR and deploy
mvn clean package -DskipTests
eb deploy                  # uploads target/*.jar, restarts application

# 5. View logs
eb logs
eb open                    # open the app URL in browser
eb status                  # see environment health

# === Procfile (tells EB how to run the JAR) ===
# Create a file named 'Procfile' in the project root:
# web: java -jar target/myapp.jar

# === Environment variables in EB ===
eb setenv DB_URL=jdbc:mysql://rds-endpoint:3306/mydb \
          DB_PASS=secret \
          SPRING_PROFILES_ACTIVE=prod

# === ECS with Fargate (containerized) ===
# Push image to ECR (Elastic Container Registry)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t myapp .
docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest

# Then create ECS Task Definition + Service via AWS Console or Terraform/CDK

# === CloudWatch — view application logs ===
# Spring Boot on EB/ECS auto-sends stdout to CloudWatch Logs
# In Spring Boot, logs go to stdout (System.out) — Docker captures that automatically`,
  points: [
    'Elastic Beanstalk is the fastest way to deploy a Spring Boot app to AWS with minimal AWS expertise',
    'ECS + Fargate (serverless containers) is the recommended path for microservices — no EC2 instances to manage',
    'Always use Application Load Balancer (ALB) for production — it provides health checks, SSL termination, and path-based routing',
    'Store all secrets (DB passwords, API keys) in AWS Secrets Manager or Parameter Store — inject them as environment variables',
    'CloudWatch collects logs from EC2, ECS, and Lambda — configure Log Insights for searching and Alarms for alerting',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between EC2, Elastic Beanstalk, and ECS?\nA: EC2 is raw virtual machines — you manage everything (OS, Java, deployment). Elastic Beanstalk is PaaS — upload your JAR and AWS manages infrastructure (EC2, load balancer, auto-scaling). ECS is container orchestration — you define Docker tasks and AWS runs them on a cluster (EC2) or serverless (Fargate). More control = more responsibility: EC2 > ECS > Beanstalk.',
    },
    {
      type: 'tip',
      content: 'For a typical Spring Boot + MySQL app: use Elastic Beanstalk for the application and RDS for the database. Connect them via environment variables (SPRING_DATASOURCE_URL). Enable Multi-AZ on RDS for high availability. This setup can handle most startup workloads with minimal ops.',
    },
  ],
}
