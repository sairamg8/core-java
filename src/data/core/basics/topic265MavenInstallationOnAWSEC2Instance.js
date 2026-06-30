export default {
  id: 'maven-installation-aws-ec2',
  title: '265. Maven Installation on AWS EC2 Instance',
  explanation: `Installing Maven on an AWS EC2 Linux instance is the cloud counterpart to the Windows setup. It is how you build Java projects on a remote server — common for CI agents and deployment hosts.

**Step 1 — Connect to the EC2 instance via SSH:**
\`\`\`bash
ssh -i my-key.pem ec2-user@<public-ip>
\`\`\`
(\`ec2-user\` for Amazon Linux; \`ubuntu\` for Ubuntu AMIs.)

**Step 2 — Install the JDK:**
On Amazon Linux 2023:
\`\`\`bash
sudo dnf install -y java-17-amazon-corretto-devel
\`\`\`
On Ubuntu:
\`\`\`bash
sudo apt update && sudo apt install -y openjdk-17-jdk
\`\`\`
Verify: \`java -version\` and \`javac -version\`.

**Step 3 — Install Maven:**

Option A — package manager (quick):
\`\`\`bash
sudo dnf install -y maven        # Amazon Linux
sudo apt install -y maven        # Ubuntu
\`\`\`

Option B — manual install (gets the latest version):
\`\`\`bash
cd /opt
sudo wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
sudo tar -xzf apache-maven-3.9.6-bin.tar.gz
sudo ln -s apache-maven-3.9.6 maven
\`\`\`

**Step 4 — Set environment variables (for manual install):**
Add to \`/etc/profile.d/maven.sh\` (system-wide) or \`~/.bashrc\` (per-user):
\`\`\`bash
export JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto
export MAVEN_HOME=/opt/maven
export PATH=$PATH:$MAVEN_HOME/bin
\`\`\`
Apply: \`source ~/.bashrc\`.

**Step 5 — Verify:**
\`\`\`bash
mvn -version
\`\`\`

**Why install Maven on EC2:**
- Build and deploy applications directly on a server
- Run a self-hosted CI/CD build agent
- Reproduce production-like builds in the cloud
- The instance can be a build server in a Jenkins/GitHub Actions pipeline

**Instance sizing note:**
Maven builds (especially Spring projects) need memory. A \`t2.micro\` (1 GB RAM) may run out of memory on large builds — use at least \`t3.small\` (2 GB) for comfortable builds, or set a smaller \`-Xmx\` for the build.`,
  code: `# ===== Maven on AWS EC2 (Amazon Linux 2023) — full setup =====

# 1. SSH into the instance (from your local machine)
ssh -i my-key.pem ec2-user@54.12.34.56

# 2. Update packages
sudo dnf update -y

# 3. Install JDK 17 (Amazon Corretto)
sudo dnf install -y java-17-amazon-corretto-devel
java -version
javac -version

# 4a. Install Maven via package manager (simplest)
sudo dnf install -y maven
mvn -version

# 4b. OR install Maven manually for a specific/latest version
cd /opt
sudo wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
sudo tar -xzf apache-maven-3.9.6-bin.tar.gz
sudo ln -s apache-maven-3.9.6 maven      # symlink for easy version swaps

# 5. Configure environment variables system-wide
sudo tee /etc/profile.d/maven.sh > /dev/null <<'EOF'
export JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto
export MAVEN_HOME=/opt/maven
export PATH=$PATH:$MAVEN_HOME/bin
EOF

sudo chmod +x /etc/profile.d/maven.sh
source /etc/profile.d/maven.sh

# 6. Verify the installation
mvn -version
# Apache Maven 3.9.6
# Java version: 17.x.x, vendor: Amazon.com Inc.

# 7. Clone and build a project on the server
git clone https://github.com/example/my-app.git
cd my-app
mvn clean package

# 8. Run the built artifact
java -jar target/my-app-1.0.0.jar

# ===== Memory tip for small instances (t2.micro / 1GB) =====
# Limit Maven's JVM heap to avoid OutOfMemoryError on large builds:
export MAVEN_OPTS="-Xmx512m"
mvn clean package`,
  codeTitle: 'Maven Installation and Build on AWS EC2',
  points: [
    'Connect to EC2 with SSH using your key pair; user is ec2-user on Amazon Linux, ubuntu on Ubuntu AMIs',
    'Install a JDK first (Amazon Corretto via dnf, or OpenJDK via apt), then install Maven',
    'Package-manager install (dnf/apt install maven) is quickest; manual tar.gz install gives you a specific version',
    'For manual installs, set JAVA_HOME, MAVEN_HOME, and PATH — system-wide via /etc/profile.d/maven.sh',
    'A symlink (/opt/maven -> apache-maven-3.9.6) makes future version upgrades a one-line change',
    'Installing Maven on EC2 lets the server build and deploy apps, or act as a CI/CD build agent',
    'Small instances (t2.micro, 1GB RAM) can hit OutOfMemoryError on large builds — set MAVEN_OPTS=-Xmx or use a larger instance',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "On a t2.micro (1 GB RAM) instance, building large projects like Spring Boot apps can fail with 'OutOfMemoryError: Java heap space' or the build process being killed by the OS OOM killer. Either upgrade to t3.small (2 GB), add swap space, or constrain Maven's heap with export MAVEN_OPTS=\"-Xmx512m\" before building.",
    },
    {
      type: 'interview',
      content: "Q: Why would you install Maven on a server like an EC2 instance instead of just on your laptop?\nA: To build and deploy in an environment that matches production, and to support CI/CD. A server with Maven can act as a build agent that pulls code, builds the artifact, runs tests, and deploys — all automatically as part of a pipeline. This removes 'works on my machine' problems by making the build environment consistent and remotely accessible.",
    },
    {
      type: 'tip',
      content: "Use a symlink for the Maven install directory: sudo ln -s apache-maven-3.9.6 maven, and point MAVEN_HOME at /opt/maven. When you upgrade Maven later, extract the new version and re-point the symlink — your MAVEN_HOME and PATH never need to change. This same pattern works well for managing JDK versions too.",
    },
  ],
}
