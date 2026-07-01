export default {
  id: 'running-tomcat-in-eclipse',
  title: '376. Running Tomcat in Eclipse',
  explanation: `A WAR-packaged project (see [[creating-spring-mvc-project-part1]]) needs a servlet container to run in. Eclipse/STS can manage a Tomcat installation directly from the IDE, so the app can be deployed and re-deployed without leaving the editor.

**Setting up Tomcat in Eclipse:**
1. Download **Apache Tomcat** (a plain zip/tar, not an installer) and unpack it somewhere outside the project (e.g. \`/opt/tomcat\` or \`C:\\tomcat\`).
2. In Eclipse: **Window → Preferences → Server → Runtime Environments → Add**, choose the matching Tomcat version, and point it at the unpacked folder.
3. Open the **Servers** view (**Window → Show View → Servers**), right-click → **New → Server**, select the Tomcat runtime just created.
4. Right-click the project → **Run As → Run on Server**, and choose the Tomcat server. Eclipse copies the compiled app into Tomcat's \`webapps\` folder (or serves it directly from the workspace) and starts the server.

**Accessing the running app:**
By default Tomcat listens on port 8080, and the app is available under its **context path** — usually the project/WAR name: \`http://localhost:8080/<context-path>/\`.

**Redeploy cycle while developing:**
Eclipse's "Run on Server" watches for changes and can auto-republish, but a full restart is sometimes needed for changes to \`web.xml\` or new dependencies — a quick refresh in the browser is not always enough; check the Servers view for "Synchronized" status before assuming a code change took effect.`,
  code: `# Equivalent from the command line, without Eclipse's Servers view:
# 1. Build the WAR
mvn clean package

# 2. Copy it into Tomcat's webapps directory
cp target/job-app.war $TOMCAT_HOME/webapps/

# 3. Start Tomcat
$TOMCAT_HOME/bin/startup.sh   # startup.bat on Windows

# 4. App is now live at:
# http://localhost:8080/job-app/`,
  codeTitle: 'Deploying a WAR without the IDE',
  points: [
    'A servlet container (Tomcat) is required to run a plain WAR-packaged Spring MVC app - there is no embedded server.',
    'Eclipse manages a Tomcat runtime through Preferences > Server > Runtime Environments, pointing at an unpacked Tomcat install.',
    'The Servers view lets you start, stop, and redeploy the app directly from the IDE via "Run As > Run on Server".',
    'The app is reachable under its context path: http://localhost:8080/<context-path>/, not the bare root by default.',
    'Some changes (web.xml, new dependencies) require a full server restart, not just a hot redeploy.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Port 8080 conflicts are common if another Tomcat instance or a Spring Boot app is already running. Stop the other process or change the port in Tomcat\'s server.xml before starting.' },
    { type: 'interview', content: 'Q: Why does a plain Spring MVC app need a separate Tomcat, while a Spring Boot app does not?\nA: Spring Boot embeds a servlet container inside the runnable JAR itself, so "java -jar app.jar" starts everything. A plain Spring MVC app is packaged as a WAR with no server included, so it must be deployed onto an externally running Tomcat.' },
  ],
}
