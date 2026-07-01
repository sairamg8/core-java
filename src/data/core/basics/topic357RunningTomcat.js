export default {
  id: 'running-tomcat',
  title: '357. Running Tomcat',
  explanation: `**Apache Tomcat** is the servlet container that runs your web application. Your servlet class does nothing on its own — Tomcat loads your **WAR**, creates the servlet, and routes matching HTTP requests to it.

**How deployment works:**
1. **Build** your project into a \`.war\` file (\`mvn package\`).
2. **Deploy** it — copy the WAR into Tomcat's \`webapps/\` folder, or deploy from your IDE.
3. **Start** Tomcat (\`startup.sh\` / \`startup.bat\`, or the IDE's run button). It listens on port **8080** by default.
4. **Access** it in the browser. The URL is \`http://localhost:8080/<context-path>/<servlet-mapping>\`.

**Context path:** Tomcat unpacks \`myapp.war\` under the context \`/myapp\`, so a servlet mapped to \`/hello\` is reached at \`http://localhost:8080/myapp/hello\`. Deploying as \`ROOT.war\` drops the context path so the app is served at the root \`/\`.

**Running from an IDE (Eclipse/IntelliJ):** add a Tomcat server, associate your project, and hit Run — the IDE handles packaging and hot re-deploy, which is far faster than manual copying while developing.

**Common signs it worked:** the console prints \`Server startup in ... ms\`, and the browser shows your servlet's output. If you get a 404, the context path or servlet mapping is usually wrong; if the port is busy, change \`8080\` in \`server.xml\` or stop the other process.`,
  points: [
    'Tomcat is the servlet container that loads your WAR, instantiates servlets, and routes HTTP requests.',
    'Deploy by dropping the WAR in webapps/ (or via the IDE), then start Tomcat (default port 8080).',
    'URL pattern is http://localhost:8080/<context-path>/<servlet-mapping>.',
    'The context path comes from the WAR name; ROOT.war serves the app at /.',
    'Running Tomcat from the IDE gives faster redeploys than manual WAR copying during development.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A 404 right after deploy almost always means the URL is missing the context path (the app name). Reach /myapp/hello, not just /hello, unless you deployed as ROOT.' },
    { type: 'tip', content: 'If port 8080 is already in use, either stop the other process or change the connector port in conf/server.xml (or server.port in Spring Boot) to something like 8081.' },
    { type: 'interview', content: 'Q: What is the default Tomcat port and how do you change it?\nA: 8080. Change the Connector port in conf/server.xml for standalone Tomcat, or set server.port in application.properties for embedded Tomcat in Spring Boot.' },
  ],
}
