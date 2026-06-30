export default {
  id: 'install-apache-tomcat',
  title: '246. Install Apache Tomcat Server',
  explanation: `Apache Tomcat is the servlet container that runs your Servlet & JSP applications. It implements the Java Servlet and JSP specifications.

**Choosing the right version:**
| Tomcat Version | Servlet API | Java Version |
|---------------|-------------|--------------|
| Tomcat 9.x | Servlet 4.0 (javax.*) | Java 8+ |
| Tomcat 10.x | Servlet 5.0 (jakarta.*) | Java 11+ |

For learning with older tutorials, use Tomcat 9. For modern Jakarta EE, use Tomcat 10.

**Installation steps:**

1. **Download:** Go to tomcat.apache.org → Downloads → select version → download the binary ZIP (not source)

2. **Extract:** Unzip to a folder like \`C:\\tomcat9\` (Windows) or \`/opt/tomcat9\` (Linux/Mac)

3. **Set JAVA_HOME:** Tomcat needs Java on the PATH.
\`\`\`bash
export JAVA_HOME=/usr/lib/jvm/java-17
export PATH=\$PATH:\$JAVA_HOME/bin
\`\`\`

4. **Start Tomcat:**
\`\`\`bash
cd /opt/tomcat9/bin
./startup.sh          # Linux/Mac
startup.bat           # Windows
\`\`\`

5. **Verify:** Open \`http://localhost:8080\` in a browser. The Tomcat welcome page confirms it is running.

6. **Stop Tomcat:**
\`\`\`bash
./shutdown.sh         # Linux/Mac
shutdown.bat          # Windows
\`\`\`

**Key Tomcat directories:**
- \`bin/\` — startup.sh, shutdown.sh
- \`conf/\` — server.xml (port config), tomcat-users.xml (admin credentials)
- \`webapps/\` — deploy WAR files here (or exploded directories)
- \`logs/\` — catalina.out (main log), localhost log
- \`lib/\` — Tomcat's own JARs (servlet-api.jar, jsp-api.jar)

**Changing the default port (8080):**
Edit \`conf/server.xml\` and change \`port="8080"\` to any available port.`,
  code: `# ===== Tomcat Installation Verification =====

# 1. Check Java is available (required before starting Tomcat)
java -version
# Expected: java version "17.x.x" or similar

# 2. Navigate to Tomcat bin directory
cd /opt/tomcat9/bin

# 3. Make scripts executable (Linux/Mac only)
chmod +x *.sh

# 4. Start Tomcat
./startup.sh
# Windows: startup.bat

# 5. Verify in browser: http://localhost:8080
# You should see the Tomcat welcome page

# 6. Check the log for errors
tail -f /opt/tomcat9/logs/catalina.out
# Look for: "Server startup in [N] milliseconds" — success

# 7. Deploy a WAR file manually
cp target/myapp.war /opt/tomcat9/webapps/
# Tomcat auto-deploys — check logs for deployment confirmation
# Access at: http://localhost:8080/myapp/

# 8. Configure admin access (conf/tomcat-users.xml)
# <role rolename="manager-gui"/>
# <user username="admin" password="secret" roles="manager-gui"/>
# Then access Tomcat Manager at: http://localhost:8080/manager/html

# 9. Stop Tomcat
./shutdown.sh
# Windows: shutdown.bat

# ===== conf/server.xml — change the port =====
# Find this line and change 8080 to your preferred port:
# <Connector port="8080" protocol="HTTP/1.1"
#            connectionTimeout="20000"
#            redirectPort="8443" />`,
  codeTitle: 'Tomcat Installation, Startup, and Deployment Commands',
  points: [
    'Apache Tomcat is an open-source servlet container that implements the Java Servlet and JSP specifications',
    'Tomcat 9 uses javax.servlet (Servlet 4.0); Tomcat 10+ uses jakarta.servlet (Servlet 5.0) — API package names differ',
    'Download the binary distribution ZIP from tomcat.apache.org — extract to a local directory, no installer needed',
    'JAVA_HOME must be set correctly before starting Tomcat — startup.sh/.bat will fail or behave unexpectedly without it',
    'Tomcat runs on port 8080 by default — change it in conf/server.xml if port 8080 is in use',
    'Deploy WAR files by copying them to the webapps/ directory — Tomcat auto-deploys and auto-undeploys by watching that folder',
    'Check logs/catalina.out for startup errors and successful deployment messages',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Port 8080 may already be in use on your machine (by another Tomcat, a Spring Boot app, or another HTTP server). Tomcat will start but silently fail to bind the port. Check catalina.out for 'Address already in use' errors. Either stop the conflicting process or change Tomcat's port in conf/server.xml.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between Apache Tomcat and Apache HTTP Server?\nA: Apache HTTP Server (httpd) is a general-purpose web server that serves static files and can proxy requests. It has no Java runtime. Apache Tomcat is a Java servlet container — it runs a JVM, loads Servlet classes, and handles the Servlet lifecycle. In production, they are often combined: Apache HTTP Server handles static content and SSL termination, then proxies dynamic requests to Tomcat via mod_jk or mod_proxy.",
    },
    {
      type: 'tip',
      content: "During development, do not deploy to Tomcat manually. Configure your IDE (Eclipse or IntelliJ) to launch Tomcat directly — this enables hot-reload of class files without restarting Tomcat. Eclipse has built-in Tomcat integration; IntelliJ Ultimate also integrates with Tomcat natively.",
    },
  ],
}
