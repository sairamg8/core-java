export default {
  id: 'maven-project-linux-ec2-cloud',
  title: '267. Maven Java Project on Linux EC2 (Cloud Setup)',
  explanation: `Creating and building a Maven project on a Linux EC2 instance mirrors the Windows workflow, with Linux shell syntax. This is the cloud-native development and build flow.

**Step 1 — Generate the project on the server:**
\`\`\`bash
mvn archetype:generate \\
  -DgroupId=com.example \\
  -DartifactId=cloud-app \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DarchetypeVersion=1.4 \\
  -DinteractiveMode=false
\`\`\`
(\`\\\` is the Linux line-continuation character.)

**Step 2 — Build:**
\`\`\`bash
cd cloud-app
mvn clean package
\`\`\`

**Step 3 — Run the artifact:**
\`\`\`bash
java -cp target/cloud-app-1.0-SNAPSHOT.jar com.example.App
\`\`\`

**Typical cloud workflow — clone, build, run:**
In practice you usually clone an existing repository rather than generating a new one:
\`\`\`bash
git clone https://github.com/yourorg/yourapp.git
cd yourapp
mvn clean package
java -jar target/yourapp-1.0.0.jar
\`\`\`

**Editing on a headless server:**
EC2 instances have no GUI. Edit files with terminal editors:
- \`nano\` — beginner-friendly
- \`vim\` — powerful, steeper learning curve
Or develop locally and use VS Code Remote-SSH / JetBrains Gateway to edit on the server through your local IDE.

**Keeping the app running after you disconnect:**
A normal \`java -jar\` stops when you log out. To keep it running:
\`\`\`bash
nohup java -jar target/app.jar > app.log 2>&1 &
\`\`\`
Or better, run it as a \`systemd\` service so it restarts on reboot.

**Why build in the cloud:**
- The build environment matches production (same OS, same Java)
- No "works on my machine" surprises
- The server can pull, build, and deploy automatically in CI/CD`,
  code: `# ===== Create & build a Maven project on Linux EC2 =====

# 1. Generate a new project (Linux uses \\ for line continuation)
mvn archetype:generate \\
  -DgroupId=com.example \\
  -DartifactId=cloud-app \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DarchetypeVersion=1.4 \\
  -DinteractiveMode=false

# 2. Build the project
cd cloud-app
mvn clean package

# 3. Run the generated app
java -cp target/cloud-app-1.0-SNAPSHOT.jar com.example.App
# Output: Hello World!


# ===== Real-world cloud workflow: clone existing repo, build, deploy =====

# Clone from GitHub
git clone https://github.com/yourorg/yourapp.git
cd yourapp

# Build (skip tests for a faster deploy build if needed)
mvn clean package -DskipTests

# Run the packaged Spring Boot / executable JAR
java -jar target/yourapp-1.0.0.jar


# ===== Keep the app running after logout =====

# Option A: nohup + background
nohup java -jar target/yourapp-1.0.0.jar > app.log 2>&1 &
# View logs:
tail -f app.log

# Option B: systemd service (survives reboots, auto-restarts)
# Create /etc/systemd/system/myapp.service:
#   [Unit]
#   Description=My Java App
#   After=network.target
#   [Service]
#   User=ec2-user
#   ExecStart=/usr/bin/java -jar /home/ec2-user/yourapp/target/yourapp-1.0.0.jar
#   Restart=always
#   [Install]
#   WantedBy=multi-user.target
#
# sudo systemctl daemon-reload
# sudo systemctl enable --now myapp
# sudo systemctl status myapp


# ===== Edit files on the headless server =====
nano src/main/java/com/example/App.java   # simple terminal editor
# or: vim src/main/java/com/example/App.java`,
  codeTitle: 'Maven Project Create, Build, and Run on Linux EC2',
  points: [
    'The Maven commands on Linux are identical to Windows — only shell syntax differs (\\ for line continuation, not ^)',
    'mvn clean package on the server compiles, tests, and produces the JAR/WAR in target/',
    'The common cloud workflow is clone → build → run, not generating projects from scratch on the server',
    'EC2 is headless — edit with nano or vim, or connect a local IDE via VS Code Remote-SSH / JetBrains Gateway',
    'A plain java -jar stops when you disconnect — use nohup ... & to background it or systemd to run it as a service',
    'Running as a systemd service makes the app restart on crash and survive instance reboots',
    'Building in the cloud gives a production-matching environment and eliminates works-on-my-machine issues',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you start your app with java -jar in a normal SSH session and then close the terminal, the process is killed because it is a child of your shell session. Use nohup java -jar app.jar & (with output redirected) or, better, a systemd service. Beginners often deploy successfully, log out, and are confused when the app is suddenly down.",
    },
    {
      type: 'interview',
      content: "Q: How do you keep a Java application running on a Linux server after you log out?\nA: A process started in an SSH session is tied to that session and dies on logout. To keep it alive, either use nohup with backgrounding (nohup java -jar app.jar > app.log 2>&1 &) which detaches it from the terminal, or — the production approach — define it as a systemd service. systemd manages the process, restarts it if it crashes, starts it on boot, and provides logging via journalctl.",
    },
    {
      type: 'tip',
      content: "Use mvn clean package -DskipTests on a deploy server when you have already validated tests in CI and just need the artifact quickly. But never skip tests as a habit during development — -DskipTests should be a deliberate, situational choice (e.g. a hotfix deploy), not your default build command.",
    },
  ],
}
